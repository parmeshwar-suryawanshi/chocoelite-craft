import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Sparkles, Package } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface ComboOffer {
  id: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  image_url: string | null;
  product_ids: unknown;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  display_order: number;
}

interface ComboOfferManagementProps {
  combos: ComboOffer[];
  onRefresh: () => void;
}

const initialForm = {
  title: '',
  description: '',
  original_price: 0,
  discounted_price: 0,
  image_url: '',
  product_ids: [] as string[],
  is_active: true,
  valid_until: '',
  display_order: 0,
};

const ComboOfferManagement = ({ combos, onRefresh }: ComboOfferManagementProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.description || form.original_price <= 0) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        original_price: form.original_price,
        discounted_price: form.discounted_price,
        image_url: form.image_url || null,
        product_ids: JSON.parse(JSON.stringify(form.product_ids)),
        is_active: form.is_active,
        valid_until: form.valid_until || null,
        display_order: form.display_order,
      };

      if (editingId) {
        const { error } = await supabase.from('combo_offers').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Combo offer updated' });
      } else {
        const { error } = await supabase.from('combo_offers').insert(payload);
        if (error) throw error;
        toast({ title: 'Success', description: 'Combo offer created' });
      }
      setIsDialogOpen(false);
      setForm(initialForm);
      setEditingId(null);
      onRefresh();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (combo: ComboOffer) => {
    setForm({
      title: combo.title,
      description: combo.description,
      original_price: combo.original_price,
      discounted_price: combo.discounted_price,
      image_url: combo.image_url || '',
      product_ids: Array.isArray(combo.product_ids) ? combo.product_ids as string[] : [],
      is_active: combo.is_active,
      valid_until: combo.valid_until ? combo.valid_until.split('T')[0] : '',
      display_order: combo.display_order,
    });
    setEditingId(combo.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this combo offer?')) return;
    const { error } = await supabase.from('combo_offers').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Combo offer deleted' });
      onRefresh();
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from('combo_offers').update({ is_active: !current }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      onRefresh();
    }
  };

  const getAiSuggestions = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-suggestions', {
        body: { type: 'combo', context: { currentTitle: form.title } },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setForm(prev => ({
          ...prev,
          title: data.suggestions.title || prev.title,
          description: data.suggestions.description || prev.description,
        }));
        toast({ title: 'AI Suggestions Applied', description: 'Review and adjust as needed' });
      }
    } catch (error: any) {
      toast({ title: 'AI Error', description: error.message, variant: 'destructive' });
    } finally {
      setAiLoading(false);
    }
  };

  const savings = (combo: ComboOffer) => {
    const saved = combo.original_price - combo.discounted_price;
    const percent = Math.round((saved / combo.original_price) * 100);
    return { saved, percent };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Combo Offers
          </CardTitle>
          <CardDescription>Manage product combo deals</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setForm(initialForm); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Combo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Combo Offer' : 'Create Combo Offer'}</DialogTitle>
              <DialogDescription>Configure the combo deal</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={getAiSuggestions} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Suggest
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>Combo Image</Label>
                <ImageUpload value={form.image_url} onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))} />
              </div>
              <div className="grid gap-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Family Pack Special" />
              </div>
              <div className="grid gap-2">
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe the combo deal" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Original Price (₹) *</Label>
                  <Input type="number" value={form.original_price} onChange={(e) => setForm(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Discounted Price (₹) *</Label>
                  <Input type="number" value={form.discounted_price} onChange={(e) => setForm(prev => ({ ...prev, discounted_price: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Valid Until</Label>
                <Input type="date" value={form.valid_until} onChange={(e) => setForm(prev => ({ ...prev, valid_until: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? 'Update' : 'Create'} Combo
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
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Savings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combos.map((combo) => {
              const { saved, percent } = savings(combo);
              return (
                <TableRow key={combo.id}>
                  <TableCell>
                    {combo.image_url ? (
                      <img src={combo.image_url} alt={combo.title} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{combo.title}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="line-through text-muted-foreground">₹{combo.original_price}</span>
                      <span className="ml-2 font-bold text-primary">₹{combo.discounted_price}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Save {percent}% (₹{saved})
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={combo.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleStatus(combo.id, combo.is_active)}>
                      {combo.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(combo)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(combo.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {combos.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No combo offers yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ComboOfferManagement;
