import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Save, Trash2, Loader2, Star, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

interface TestimonialManagementProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

const TestimonialManagement = ({ testimonials, onRefresh }: TestimonialManagementProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultItem: Partial<Testimonial> = {
    name: '',
    location: '',
    rating: 5,
    text: '',
    image_url: '',
    is_active: true,
    display_order: testimonials.length + 1,
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: editingItem.name,
            location: editingItem.location,
            rating: editingItem.rating,
            text: editingItem.text,
            image_url: editingItem.image_url,
            is_active: editingItem.is_active,
            display_order: editingItem.display_order,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: 'Testimonial Updated', description: 'Changes saved successfully' });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({
            name: editingItem.name,
            location: editingItem.location,
            rating: editingItem.rating,
            text: editingItem.text,
            image_url: editingItem.image_url,
            is_active: editingItem.is_active,
            display_order: editingItem.display_order,
          });

        if (error) throw error;
        toast({ title: 'Testimonial Created', description: 'New testimonial added' });
      }

      setDialogOpen(false);
      setEditingItem(null);
      onRefresh();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Testimonial has been removed' });
      onRefresh();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (item: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      toast({ 
        title: item.is_active ? 'Testimonial Hidden' : 'Testimonial Visible',
        description: `This testimonial is now ${item.is_active ? 'hidden' : 'visible'}`
      });
      onRefresh();
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const updateField = (field: keyof Testimonial, value: unknown) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>Manage customer testimonials displayed on the homepage</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(defaultItem as Testimonial)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            </DialogHeader>
            
            {editingItem && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Name</Label>
                    <Input
                      value={editingItem.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={editingItem.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="Mumbai"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Rating</Label>
                    <Select
                      value={String(editingItem.rating)}
                      onValueChange={(v) => updateField('rating', parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <SelectItem key={r} value={String(r)}>
                            <div className="flex items-center gap-1">
                              {[...Array(r)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={editingItem.display_order}
                      onChange={(e) => updateField('display_order', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Testimonial Text</Label>
                  <Textarea
                    value={editingItem.text}
                    onChange={(e) => updateField('text', e.target.value)}
                    placeholder="Customer's review..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Customer Photo URL</Label>
                  <Input
                    value={editingItem.image_url || ''}
                    onChange={(e) => updateField('image_url', e.target.value)}
                    placeholder="https://..."
                  />
                  {editingItem.image_url && (
                    <div className="mt-2 w-16 h-16 rounded-full overflow-hidden">
                      <img src={editingItem.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingItem.is_active}
                    onCheckedChange={(v) => updateField('is_active', v)}
                  />
                  <Label>Active</Label>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Testimonial
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <div className="flex">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={() => handleToggleActive(item)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingItem(item);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TestimonialManagement;
