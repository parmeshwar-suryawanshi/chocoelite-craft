import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Sparkles, Trophy, Star } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface LuckyWinner {
  id: string;
  winner_name: string;
  winner_email: string | null;
  winner_phone: string | null;
  prize_description: string;
  prize_image: string | null;
  draw_date: string;
  campaign_name: string;
  winner_image: string | null;
  testimonial: string | null;
  is_featured: boolean;
  is_active: boolean;
}

interface LuckyWinnerManagementProps {
  winners: LuckyWinner[];
  onRefresh: () => void;
}

const initialForm = {
  winner_name: '',
  winner_email: '',
  winner_phone: '',
  prize_description: '',
  prize_image: '',
  draw_date: '',
  campaign_name: '',
  winner_image: '',
  testimonial: '',
  is_featured: false,
  is_active: true,
};

const LuckyWinnerManagement = ({ winners, onRefresh }: LuckyWinnerManagementProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.winner_name || !form.prize_description || !form.draw_date || !form.campaign_name) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        winner_name: form.winner_name,
        winner_email: form.winner_email || null,
        winner_phone: form.winner_phone || null,
        prize_description: form.prize_description,
        prize_image: form.prize_image || null,
        draw_date: form.draw_date,
        campaign_name: form.campaign_name,
        winner_image: form.winner_image || null,
        testimonial: form.testimonial || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };

      if (editingId) {
        const { error } = await supabase.from('lucky_winners').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Winner updated' });
      } else {
        const { error } = await supabase.from('lucky_winners').insert(payload);
        if (error) throw error;
        toast({ title: 'Success', description: 'Winner added' });
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

  const handleEdit = (winner: LuckyWinner) => {
    setForm({
      winner_name: winner.winner_name,
      winner_email: winner.winner_email || '',
      winner_phone: winner.winner_phone || '',
      prize_description: winner.prize_description,
      prize_image: winner.prize_image || '',
      draw_date: winner.draw_date,
      campaign_name: winner.campaign_name,
      winner_image: winner.winner_image || '',
      testimonial: winner.testimonial || '',
      is_featured: winner.is_featured,
      is_active: winner.is_active,
    });
    setEditingId(winner.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this winner record?')) return;
    const { error } = await supabase.from('lucky_winners').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Winner deleted' });
      onRefresh();
    }
  };

  const toggleStatus = async (id: string, field: 'is_active' | 'is_featured', current: boolean) => {
    const { error } = await supabase.from('lucky_winners').update({ [field]: !current }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    } else {
      onRefresh();
    }
  };

  const getAiSuggestions = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-suggestions', {
        body: { type: 'winner', context: { campaign: form.campaign_name, prize: form.prize_description } },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setForm(prev => ({
          ...prev,
          testimonial: data.suggestions.testimonialPrompt || prev.testimonial,
        }));
        toast({ title: 'AI Suggestions Applied', description: 'Testimonial prompt generated' });
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
            <Trophy className="h-5 w-5" />
            Lucky Winners
          </CardTitle>
          <CardDescription>Manage lucky draw winners and campaigns</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setForm(initialForm); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Winner</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Winner' : 'Add Lucky Winner'}</DialogTitle>
              <DialogDescription>Enter winner details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={getAiSuggestions} disabled={aiLoading || !form.campaign_name} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Suggest Testimonial
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Winner Photo</Label>
                  <ImageUpload value={form.winner_image} onChange={(url) => setForm(prev => ({ ...prev, winner_image: url }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Prize Image</Label>
                  <ImageUpload value={form.prize_image} onChange={(url) => setForm(prev => ({ ...prev, prize_image: url }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Campaign Name *</Label>
                <Input value={form.campaign_name} onChange={(e) => setForm(prev => ({ ...prev, campaign_name: e.target.value }))} placeholder="e.g., Diwali Lucky Draw 2025" />
              </div>
              <div className="grid gap-2">
                <Label>Winner Name *</Label>
                <Input value={form.winner_name} onChange={(e) => setForm(prev => ({ ...prev, winner_name: e.target.value }))} placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.winner_email} onChange={(e) => setForm(prev => ({ ...prev, winner_email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input value={form.winner_phone} onChange={(e) => setForm(prev => ({ ...prev, winner_phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Prize Description *</Label>
                <Textarea value={form.prize_description} onChange={(e) => setForm(prev => ({ ...prev, prize_description: e.target.value }))} placeholder="What did they win?" rows={2} />
              </div>
              <div className="grid gap-2">
                <Label>Draw Date *</Label>
                <Input type="date" value={form.draw_date} onChange={(e) => setForm(prev => ({ ...prev, draw_date: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Winner Testimonial</Label>
                <Textarea value={form.testimonial} onChange={(e) => setForm(prev => ({ ...prev, testimonial: e.target.value }))} placeholder="Winner's feedback or quote" rows={3} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_featured} onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_featured: checked }))} />
                  <Label>Featured</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? 'Update' : 'Add'} Winner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead>Draw Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winners.map((winner) => (
              <TableRow key={winner.id}>
                <TableCell>
                  {winner.winner_image ? (
                    <img src={winner.winner_image} alt={winner.winner_name} className="w-12 h-12 object-cover rounded-full" />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {winner.winner_name}
                    {winner.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{winner.campaign_name}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{winner.prize_description}</TableCell>
                <TableCell>{new Date(winner.draw_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={winner.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleStatus(winner.id, 'is_active', winner.is_active)}>
                    {winner.is_active ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(winner)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(winner.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {winners.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No winners yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LuckyWinnerManagement;
