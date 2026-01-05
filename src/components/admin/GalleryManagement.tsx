import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface GalleryImage {
  id: string;
  title: string;
  alt_text: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

interface GalleryManagementProps {
  images: GalleryImage[];
  onRefresh: () => void;
}

const initialForm = {
  title: '',
  alt_text: '',
  image_url: '',
  display_order: 0,
  is_active: true,
};

const GalleryManagement = ({ images, onRefresh }: GalleryManagementProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.image_url) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('gallery_images').update(form).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Gallery image updated' });
      } else {
        const { error } = await supabase.from('gallery_images').insert(form);
        if (error) throw error;
        toast({ title: 'Success', description: 'Gallery image added' });
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

  const handleEdit = (image: GalleryImage) => {
    setForm({
      title: image.title,
      alt_text: image.alt_text,
      image_url: image.image_url,
      display_order: image.display_order,
      is_active: image.is_active,
    });
    setEditingId(image.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery image?')) return;
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Image deleted' });
      onRefresh();
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from('gallery_images').update({ is_active: !current }).eq('id', id);
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
        body: { type: 'gallery', context: { currentTitle: form.title } },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setForm(prev => ({
          ...prev,
          title: data.suggestions.title || prev.title,
          alt_text: data.suggestions.altText || prev.alt_text,
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
            <ImageIcon className="h-5 w-5" />
            Gallery Management
          </CardTitle>
          <CardDescription>Manage gallery images displayed on the website</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setForm(initialForm); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Image</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
              <DialogDescription>Fill in the image details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={getAiSuggestions} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Suggest
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>Image *</Label>
                <ImageUpload value={form.image_url} onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))} />
              </div>
              <div className="grid gap-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Image title" />
              </div>
              <div className="grid gap-2">
                <Label>Alt Text</Label>
                <Input value={form.alt_text} onChange={(e) => setForm(prev => ({ ...prev, alt_text: e.target.value }))} placeholder="SEO-friendly alt text" />
              </div>
              <div className="grid gap-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? 'Update' : 'Add'} Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => (
              <TableRow key={image.id}>
                <TableCell>
                  <img src={image.image_url} alt={image.alt_text} className="w-16 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{image.title}</TableCell>
                <TableCell>{image.display_order}</TableCell>
                <TableCell>
                  <Badge variant={image.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleStatus(image.id, image.is_active)}>
                    {image.is_active ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(image)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(image.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {images.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No gallery images yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GalleryManagement;
