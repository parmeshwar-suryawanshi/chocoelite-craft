import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Sparkles, Percent } from 'lucide-react';

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

interface OfferManagementProps {
  offers: Offer[];
  onRefresh: () => void;
}

const initialForm = {
  title: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 0,
  code: '',
  min_order_amount: 0,
  is_active: true,
};

const OfferManagement = ({ offers, onRefresh }: OfferManagementProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.code) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('offers')
          .update({
            title: form.title,
            description: form.description,
            discount_type: form.discount_type,
            discount_value: form.discount_value,
            code: form.code,
            min_order_amount: form.min_order_amount,
            is_active: form.is_active,
          })
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Offer updated successfully' });
      } else {
        const { error } = await supabase.from('offers').insert({
          title: form.title,
          description: form.description,
          discount_type: form.discount_type,
          discount_value: form.discount_value,
          code: form.code,
          min_order_amount: form.min_order_amount,
          is_active: form.is_active,
        });
        if (error) throw error;
        toast({ title: 'Success', description: 'Offer created successfully' });
      }

      setIsDialogOpen(false);
      setForm(initialForm);
      setEditingId(null);
      onRefresh();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save offer', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setForm({
      title: offer.title,
      description: offer.description,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value || 0,
      code: offer.code || '',
      min_order_amount: offer.min_order_amount || 0,
      is_active: offer.is_active,
    });
    setEditingId(offer.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    const { error } = await supabase.from('offers').delete().eq('id', offerId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete offer', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Offer deleted successfully' });
      onRefresh();
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('offers').update({ is_active: !currentStatus }).eq('id', offerId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update offer status', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Offer status updated' });
      onRefresh();
    }
  };

  const getAiSuggestions = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-suggestions', {
        body: { type: 'offer', context: { currentTitle: form.title, discountType: form.discount_type } },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setForm(prev => ({
          ...prev,
          title: data.suggestions.title || prev.title,
          description: data.suggestions.description || prev.description,
          code: data.suggestions.code || prev.code,
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
            <Percent className="h-5 w-5" />
            Offers Management
          </CardTitle>
          <CardDescription>Manage discount offers and promo codes</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setForm(initialForm); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Offer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
              <DialogDescription>Fill in the offer details below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={getAiSuggestions} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Suggest
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>Offer Title *</Label>
                <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Summer Sale - 20% Off" />
              </div>
              <div className="grid gap-2">
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe the offer" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Discount Type</Label>
                  <Select value={form.discount_type} onValueChange={(value) => setForm(prev => ({ ...prev, discount_type: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                      <SelectItem value="freebie">Free Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Discount Value</Label>
                  <Input type="number" value={form.discount_value} onChange={(e) => setForm(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Promo Code *</Label>
                  <Input value={form.code} onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} placeholder="e.g., SUMMER20" />
                </div>
                <div className="grid gap-2">
                  <Label>Min Order Amount (₹)</Label>
                  <Input type="number" value={form.min_order_amount} onChange={(e) => setForm(prev => ({ ...prev, min_order_amount: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? 'Update' : 'Create'} Offer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">{offer.title}</TableCell>
                <TableCell>
                  {offer.discount_type === 'percentage' 
                    ? `${offer.discount_value}%` 
                    : offer.discount_type === 'fixed' 
                    ? `₹${offer.discount_value}` 
                    : 'Free Item'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{offer.code}</Badge>
                </TableCell>
                <TableCell>{offer.min_order_amount ? `₹${offer.min_order_amount}` : '-'}</TableCell>
                <TableCell>
                  <Badge 
                    variant={offer.is_active ? "default" : "secondary"} 
                    className="cursor-pointer"
                    onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                  >
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(offer)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(offer.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {offers.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No offers yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OfferManagement;
