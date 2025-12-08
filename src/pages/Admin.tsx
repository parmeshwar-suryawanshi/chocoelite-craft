import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, Percent, ShoppingBag, Plus, Pencil, Trash2, BarChart3, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageUpload from '@/components/admin/ImageUpload';
import BulkPackPricing from '@/components/admin/BulkPackPricing';
import SalesAnalytics from '@/components/admin/SalesAnalytics';
import WhatsAppOrderManagement from '@/components/admin/WhatsAppOrderManagement';

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

interface Offer {
  id: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  code: string;
  is_active: boolean;
  min_order_amount?: number;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  delivery_status: string;
  user_id: string;
}

const defaultBulkPacks: BulkPack[] = [
  { size: 6, price: 0, label: 'Pack of 6' },
  { size: 12, price: 0, label: 'Pack of 12' },
  { size: 24, price: 0, label: 'Pack of 24' },
];

const initialProductForm = {
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

const initialOfferForm = {
  title: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 0,
  code: '',
  min_order_amount: 0,
  is_active: true,
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Product form state
  const [productForm, setProductForm] = useState(initialProductForm);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  
  // Offer form state
  const [offerForm, setOfferForm] = useState(initialOfferForm);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<string | null>(null);
  const [offerSaving, setOfferSaving] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await fetchData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const [productsRes, offersRes, ordersRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('offers').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (offersRes.data) setOffers(offersRes.data);
    if (ordersRes.data) setOrders(ordersRes.data);
  };

  // Product CRUD operations
  const handleProductSubmit = async () => {
    if (!productForm.id || !productForm.name || !productForm.description || !productForm.category || !productForm.image) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setProductSaving(true);
    try {
      const bulkPacksJson = JSON.parse(JSON.stringify(productForm.bulk_packs));
      
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: productForm.name,
            description: productForm.description,
            long_description: productForm.long_description,
            price: productForm.price,
            category: productForm.category,
            type: productForm.type,
            image: productForm.image,
            in_stock: productForm.in_stock,
            featured: productForm.featured,
            bestseller: productForm.bestseller,
            limited_edition: productForm.limited_edition,
            bulk_packs: bulkPacksJson,
          })
          .eq('id', editingProduct);

        if (error) throw error;
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        const { error } = await supabase.from('products').insert([{
          id: productForm.id,
          name: productForm.name,
          description: productForm.description,
          long_description: productForm.long_description,
          price: productForm.price,
          category: productForm.category,
          type: productForm.type,
          image: productForm.image,
          in_stock: productForm.in_stock,
          featured: productForm.featured,
          bestseller: productForm.bestseller,
          limited_edition: productForm.limited_edition,
          bulk_packs: bulkPacksJson,
        }]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Product created successfully' });
      }

      setIsProductDialogOpen(false);
      setProductForm(initialProductForm);
      setEditingProduct(null);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setProductSaving(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    const bulkPacks = Array.isArray(product.bulk_packs) ? product.bulk_packs as BulkPack[] : defaultBulkPacks;
    setProductForm({
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
    setEditingProduct(product.id);
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Product deleted successfully' });
      fetchData();
    }
  };

  const toggleProductStock = async (productId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ in_stock: !currentStatus })
      .eq('id', productId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product stock',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Product stock updated' });
      fetchData();
    }
  };

  // Offer CRUD operations
  const handleOfferSubmit = async () => {
    if (!offerForm.title || !offerForm.description || !offerForm.code) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setOfferSaving(true);
    try {
      if (editingOffer) {
        const { error } = await supabase
          .from('offers')
          .update({
            title: offerForm.title,
            description: offerForm.description,
            discount_type: offerForm.discount_type,
            discount_value: offerForm.discount_value,
            code: offerForm.code,
            min_order_amount: offerForm.min_order_amount,
            is_active: offerForm.is_active,
          })
          .eq('id', editingOffer);

        if (error) throw error;
        toast({ title: 'Success', description: 'Offer updated successfully' });
      } else {
        const { error } = await supabase.from('offers').insert({
          title: offerForm.title,
          description: offerForm.description,
          discount_type: offerForm.discount_type,
          discount_value: offerForm.discount_value,
          code: offerForm.code,
          min_order_amount: offerForm.min_order_amount,
          is_active: offerForm.is_active,
        });

        if (error) throw error;
        toast({ title: 'Success', description: 'Offer created successfully' });
      }

      setIsOfferDialogOpen(false);
      setOfferForm(initialOfferForm);
      setEditingOffer(null);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save offer',
        variant: 'destructive',
      });
    } finally {
      setOfferSaving(false);
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setOfferForm({
      title: offer.title,
      description: offer.description,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value || 0,
      code: offer.code || '',
      min_order_amount: offer.min_order_amount || 0,
      is_active: offer.is_active,
    });
    setEditingOffer(offer.id);
    setIsOfferDialogOpen(true);
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    const { error } = await supabase.from('offers').delete().eq('id', offerId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete offer',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Offer deleted successfully' });
      fetchData();
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('offers')
      .update({ is_active: !currentStatus })
      .eq('id', offerId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update offer status',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Offer status updated' });
      fetchData();
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, deliveryStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status, delivery_status: deliveryStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Order status updated' });
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage products, offers, and orders</p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              <Percent className="h-4 w-4" />
              Offers
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Products Management</CardTitle>
                  <CardDescription>View and manage your product catalog</CardDescription>
                </div>
                <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                  setIsProductDialogOpen(open);
                  if (!open) {
                    setProductForm(initialProductForm);
                    setEditingProduct(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
                      <DialogDescription>Fill in the product details below</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-id">Product ID *</Label>
                          <Input
                            id="product-id"
                            placeholder="e.g., mango-milk-6"
                            value={productForm.id}
                            onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                            disabled={!!editingProduct}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-name">Name *</Label>
                          <Input
                            id="product-name"
                            placeholder="Product name"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-desc">Short Description *</Label>
                        <Textarea
                          id="product-desc"
                          placeholder="Brief product description"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-long-desc">Long Description</Label>
                        <Textarea
                          id="product-long-desc"
                          placeholder="Detailed product description"
                          value={productForm.long_description}
                          onChange={(e) => setProductForm({ ...productForm, long_description: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-price">Price (₹) *</Label>
                          <Input
                            id="product-price"
                            type="number"
                            placeholder="0"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-category">Category *</Label>
                          <Select
                            value={productForm.category}
                            onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mango">Mango</SelectItem>
                              <SelectItem value="Strawberry">Strawberry</SelectItem>
                              <SelectItem value="Custard Apple">Custard Apple</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-type">Type *</Label>
                          <Select
                            value={productForm.type}
                            onValueChange={(value) => setProductForm({ ...productForm, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="milk">Milk Chocolate</SelectItem>
                              <SelectItem value="white">White Chocolate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <ImageUpload
                        value={productForm.image}
                        onChange={(url) => setProductForm({ ...productForm, image: url })}
                      />
                      <BulkPackPricing
                        value={productForm.bulk_packs}
                        onChange={(packs) => setProductForm({ ...productForm, bulk_packs: packs })}
                      />
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.in_stock}
                            onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })}
                            className="rounded border-input"
                          />
                          <span className="text-sm">In Stock</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.featured}
                            onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                            className="rounded border-input"
                          />
                          <span className="text-sm">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.bestseller}
                            onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                            className="rounded border-input"
                          />
                          <span className="text-sm">Bestseller</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.limited_edition}
                            onChange={(e) => setProductForm({ ...productForm, limited_edition: e.target.checked })}
                            className="rounded border-input"
                          />
                          <span className="text-sm">Limited Edition</span>
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleProductSubmit} disabled={productSaving}>
                        {productSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {editingProduct ? 'Update' : 'Create'} Product
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.type}</Badge>
                          </TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>
                            <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleProductStock(product.id, product.in_stock)}
                              >
                                Toggle Stock
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Offers Management</CardTitle>
                  <CardDescription>Create and manage promotional offers</CardDescription>
                </div>
                <Dialog open={isOfferDialogOpen} onOpenChange={(open) => {
                  setIsOfferDialogOpen(open);
                  if (!open) {
                    setOfferForm(initialOfferForm);
                    setEditingOffer(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
                      <DialogDescription>Fill in the offer details below</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="offer-title">Title *</Label>
                        <Input
                          id="offer-title"
                          placeholder="Offer title"
                          value={offerForm.title}
                          onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offer-desc">Description *</Label>
                        <Textarea
                          id="offer-desc"
                          placeholder="Offer description"
                          value={offerForm.description}
                          onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="offer-type">Discount Type *</Label>
                          <Select
                            value={offerForm.discount_type}
                            onValueChange={(value) => setOfferForm({ ...offerForm, discount_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                              <SelectItem value="bogo">Buy One Get One</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offer-value">Discount Value</Label>
                          <Input
                            id="offer-value"
                            type="number"
                            placeholder="0"
                            value={offerForm.discount_value}
                            onChange={(e) => setOfferForm({ ...offerForm, discount_value: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="offer-code">Promo Code *</Label>
                          <Input
                            id="offer-code"
                            placeholder="SAVE20"
                            value={offerForm.code}
                            onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offer-min">Min Order Amount (₹)</Label>
                          <Input
                            id="offer-min"
                            type="number"
                            placeholder="0"
                            value={offerForm.min_order_amount}
                            onChange={(e) => setOfferForm({ ...offerForm, min_order_amount: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={offerForm.is_active}
                          onChange={(e) => setOfferForm({ ...offerForm, is_active: e.target.checked })}
                          className="rounded border-input"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleOfferSubmit} disabled={offerSaving}>
                        {offerSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {editingOffer ? 'Update' : 'Create'} Offer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offers.map((offer) => (
                        <TableRow key={offer.id}>
                          <TableCell className="font-medium">{offer.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{offer.discount_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {offer.discount_type === 'percentage' ? `${offer.discount_value}%` : `₹${offer.discount_value}`}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{offer.code}</code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={offer.is_active ? 'default' : 'secondary'}>
                              {offer.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                              >
                                Toggle Status
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditOffer(offer)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteOffer(offer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>₹{order.total_amount}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.delivery_status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Update
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Order Status</DialogTitle>
                                  <DialogDescription>Change order and delivery status</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Order Status</Label>
                                    <Select
                                      defaultValue={order.status}
                                      onValueChange={(value) => {
                                        updateOrderStatus(order.id, value, order.delivery_status);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Delivery Status</Label>
                                    <Select
                                      defaultValue={order.delivery_status}
                                      onValueChange={(value) => {
                                        updateOrderStatus(order.id, order.status, value);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="in_transit">In Transit</SelectItem>
                                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp Orders Tab */}
          <TabsContent value="whatsapp">
            <WhatsAppOrderManagement />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
