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
import { Plus, Pencil, Trash2, Loader2, Sparkles, PartyPopper, Calendar } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface FestivalOffer {
  id: string;
  title: string;
  description: string;
  festival_name: string;
  banner_image: string | null;
  discount_type: string;
  discount_value: number | null;
  code: string | null;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  terms_conditions: string | null;
}

interface FestivalOfferManagementProps {
  festivals: FestivalOffer[];
  onRefresh: () => void;
}

const FESTIVALS = [
  'Diwali', 'Christmas', 'New Year', 'Valentine\'s Day', 'Holi',
  'Raksha Bandhan', 'Eid', 'Easter', 'Navratri', 'Ganesh Chaturthi',
  'Onam', 'Pongal', 'Independence Day', 'Republic Day', 'Mother\'s Day',
  'Father\'s Day', 'Friendship Day', 'Custom'
];

const initialForm = {
  title: '',
  description: '',
  festival_name: '',
  banner_image: '',
  discount_type: 'percentage',
  discount_value: 0,
  code: '',
  is_active: true,
  valid_from: '',
  valid_until: '',
  terms_conditions: '',
};

const FestivalOfferManagement = ({ festivals, onRefresh }: FestivalOfferManagementProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.festival_name) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        festival_name: form.festival_name,
        banner_image: form.banner_image || null,
        discount_type: form.discount_type,
        discount_value: form.discount_value || null,
        code: form.code || null,
        is_active: form.is_active,
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
        terms_conditions: form.terms_conditions || null,
      };

      if (editingId) {
        const { error } = await supabase.from('festival_offers').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Festival offer updated' });
      } else {
        const { error } = await supabase.from('festival_offers').insert(payload);
        if (error) throw error;
        toast({ title: 'Success', description: 'Festival offer created' });
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

  const handleEdit = (festival: FestivalOffer) => {
    setForm({
      title: festival.title,
      description: festival.description,
      festival_name: festival.festival_name,
      banner_image: festival.banner_image || '',
      discount_type: festival.discount_type || 'percentage',
      discount_value: festival.discount_value || 0,
      code: festival.code || '',
      is_active: festival.is_active,
      valid_from: festival.valid_from ? festival.valid_from.split('T')[0] : '',
      valid_until: festival.valid_until ? festival.valid_until.split('T')[0] : '',
      terms_conditions: festival.terms_conditions || '',
    });
    setEditingId(festival.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this festival offer?')) return;
    const { error } = await supabase.from('festival_offers').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Festival offer deleted' });
      onRefresh();
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from('festival_offers').update({ is_active: !current }).eq('id', id);
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
        body: { type: 'festival', context: { festival: form.festival_name, currentTitle: form.title } },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setForm(prev => ({
          ...prev,
          title: data.suggestions.title || prev.title,
          description: data.suggestions.description || prev.description,
          code: data.suggestions.code || prev.code,
          terms_conditions: data.suggestions.terms || prev.terms_conditions,
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
            <PartyPopper className="h-5 w-5" />
            Festival Offers
          </CardTitle>
          <CardDescription>Manage seasonal and festival promotions</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setForm(initialForm); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Festival Offer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Festival Offer' : 'Create Festival Offer'}</DialogTitle>
              <DialogDescription>Configure the festival promotion</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={getAiSuggestions} disabled={aiLoading || !form.festival_name} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Suggest
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>Banner Image</Label>
                <ImageUpload value={form.banner_image} onChange={(url) => setForm(prev => ({ ...prev, banner_image: url }))} />
              </div>
              <div className="grid gap-2">
                <Label>Festival *</Label>
                <Select value={form.festival_name} onValueChange={(value) => setForm(prev => ({ ...prev, festival_name: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select festival" /></SelectTrigger>
                  <SelectContent>
                    {FESTIVALS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Diwali Sweet Delights" />
              </div>
              <div className="grid gap-2">
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe the festival offer" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Discount Type</Label>
                  <Select value={form.discount_type} onValueChange={(value) => setForm(prev => ({ ...prev, discount_type: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Discount Value</Label>
                  <Input type="number" value={form.discount_value} onChange={(e) => setForm(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Promo Code</Label>
                <Input value={form.code} onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} placeholder="e.g., DIWALI25" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Valid From</Label>
                  <Input type="date" value={form.valid_from} onChange={(e) => setForm(prev => ({ ...prev, valid_from: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Valid Until</Label>
                  <Input type="date" value={form.valid_until} onChange={(e) => setForm(prev => ({ ...prev, valid_until: e.target.value }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Terms & Conditions</Label>
                <Textarea value={form.terms_conditions} onChange={(e) => setForm(prev => ({ ...prev, terms_conditions: e.target.value }))} placeholder="Add any terms and conditions" rows={2} />
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
              <TableHead>Banner</TableHead>
              <TableHead>Festival</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {festivals.map((festival) => (
              <TableRow key={festival.id}>
                <TableCell>
                  {festival.banner_image ? (
                    <img src={festival.banner_image} alt={festival.title} className="w-16 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <PartyPopper className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{festival.festival_name}</Badge>
                </TableCell>
                <TableCell className="font-medium">{festival.title}</TableCell>
                <TableCell>
                  {festival.discount_value ? (
                    <span className="text-green-600 font-medium">
                      {festival.discount_type === 'percentage' ? `${festival.discount_value}%` : `₹${festival.discount_value}`}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {festival.code ? (
                    <Badge variant="secondary">{festival.code}</Badge>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {festival.valid_from && festival.valid_until ? (
                    <div className="text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(festival.valid_from).toLocaleDateString()} - {new Date(festival.valid_until).toLocaleDateString()}
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={festival.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleStatus(festival.id, festival.is_active)}>
                    {festival.is_active ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(festival)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(festival.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {festivals.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No festival offers yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FestivalOfferManagement;
