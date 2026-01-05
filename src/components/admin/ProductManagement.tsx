import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Sparkles, Package, Star } from 'lucide-react';
import ImageUpload from './ImageUpload';
import BulkPackPricing from './BulkPackPricing';

interface BulkPack {
  size: number;
  price: number;
  label: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  price: number;
  in_stock: boolean;
  category: string;
  type: string;
  image: string;
  featured?: boolean;
  bestseller?: boolean;
  limited_edition?: boolean;
  bulk_packs?: unknown;
}

interface ProductManagementProps {
  products: Product[];
  onRefresh: () => void;
}

const defaultBulkPacks: BulkPack[] = [
  { size: 6, price: 0, label: 'Pack of 6' },
  { size: 12, price: 0, label: 'Pack of 12' },
  { size: 24, price: 0, label: 'Pack of 24' },
];

const initialForm = {
  id: '',
  name: '',
  description: '',
  long_description: '',
  price: 0,
  category: '',
  type: 'milk',
  image: '',
  in_stock: true,
  featured: false,
  bestseller: false,
  limited_edition: false,
  bulk_packs: defaultBulkPacks,
};

const ProductManagement = ({ products, onRefresh }: ProductManagementProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.id || !form.name || !form.description || !form.category || !form.image) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const bulkPacksJson = JSON.parse(JSON.stringify(form.bulk_packs));
      
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update({
            name: form.name,
            description: form.description,
            long_description: form.long_description,
            price: form.price,
            category: form.category,
            type: form.type,
            image: form.image,
            in_stock: form.in_stock,
            featured: form.featured,
            bestseller: form.bestseller,
            limited_edition: form.limited_edition,
            bulk_packs: bulkPacksJson,
          })
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        const { error } = await supabase.from('products').insert([{
          id: form.id,
          name: form.name,
          description: form.description,
          long_description: form.long_description,
          price: form.price,
          category: form.category,
          type: form.type,
          image: form.image,
          in_stock: form.in_stock,
          featured: form.featured,
          bestseller: form.bestseller,
          limited_edition: form.limited_edition,
          bulk_packs: bulkPacksJson,
        }]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Product created successfully' });
      }

      setIsDialogOpen(false);
      setForm(initialForm);
      setEditingId(null);
      onRefresh();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save product', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    const bulkPacks = Array.isArray(product.bulk_packs) ? product.bulk_packs as BulkPack[] : defaultBulkPacks;
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      long_description: product.long_description || '',
      price: product.price,
      category: product.category,
      type: product.type,
      image: product.image,
      in_stock: product.in_stock,
      featured: product.featured || false,
      bestseller: product.bestseller || false,
      limited_edition: product.limited_edition || false,
      bulk_packs: bulkPacks,
    });
    setEditingId(product.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Product deleted successfully' });
      onRefresh();
    }
  };

  const toggleProductStock = async (productId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('products').update({ in_stock: !currentStatus }).eq('id', productId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update product stock', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Product stock updated' });
      onRefresh();
    }
  };

  const getAiSuggestions = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-suggestions', {
        body: { 
          type: 'product', 
          context: { 
            name: form.name, 
            category: form.category, 
            type: form.type 
          } 
        },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setForm(prev => ({
          ...prev,
          name: data.suggestions.name || prev.name,
          description: data.suggestions.description || prev.description,
          long_description: data.suggestions.longDescription || prev.long_description,
        }));
        toast({ title: 'AI Suggestions Applied', description: 'Review and adjust as needed' });
      }
    } catch (error: any) {
      toast({ title: 'AI Error', description: error.message, variant: 'destructive' });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products Management
          </CardTitle>
          <CardDescription>View and manage your product catalog</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setForm(initialForm); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Product' : 'Create New Product'}</DialogTitle>
              <DialogDescription>Fill in the product details below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={getAiSuggestions} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Suggest Content
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>Product Image *</Label>
                <ImageUpload value={form.image} onChange={(url) => setForm(prev => ({ ...prev, image: url }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Product ID *</Label>
                  <Input 
                    value={form.id} 
                    onChange={(e) => setForm(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} 
                    placeholder="e.g., dark-truffle-box"
                    disabled={!!editingId}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Price (₹) *</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Product name" />
              </div>
              <div className="grid gap-2">
                <Label>Short Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief product description" rows={2} />
              </div>
              <div className="grid gap-2">
                <Label>Long Description</Label>
                <Textarea value={form.long_description} onChange={(e) => setForm(prev => ({ ...prev, long_description: e.target.value }))} placeholder="Detailed product description" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truffles">Truffles</SelectItem>
                      <SelectItem value="bars">Bars</SelectItem>
                      <SelectItem value="pralines">Pralines</SelectItem>
                      <SelectItem value="gifts">Gift Boxes</SelectItem>
                      <SelectItem value="assorted">Assorted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Type *</Label>
                  <Select value={form.type} onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="milk">Milk</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="sugar-free">Sugar Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Bulk Pack Pricing</Label>
                <BulkPackPricing 
                  value={form.bulk_packs} 
                  onChange={(packs) => setForm(prev => ({ ...prev, bulk_packs: packs }))} 
                />
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.in_stock} onCheckedChange={(checked) => setForm(prev => ({ ...prev, in_stock: checked }))} />
                  <Label>In Stock</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.featured} onCheckedChange={(checked) => setForm(prev => ({ ...prev, featured: checked }))} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.bestseller} onCheckedChange={(checked) => setForm(prev => ({ ...prev, bestseller: checked }))} />
                  <Label>Bestseller</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.limited_edition} onCheckedChange={(checked) => setForm(prev => ({ ...prev, limited_edition: checked }))} />
                  <Label>Limited Edition</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? 'Update' : 'Create'} Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Badges</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.image} alt={product.name} className="w-16 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {product.name}
                    {product.bestseller && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>
                  <Badge 
                    variant={product.in_stock ? "default" : "destructive"} 
                    className="cursor-pointer"
                    onClick={() => toggleProductStock(product.id, product.in_stock)}
                  >
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {product.featured && <Badge variant="outline">Featured</Badge>}
                    {product.limited_edition && <Badge variant="secondary">Limited</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductManagement;
