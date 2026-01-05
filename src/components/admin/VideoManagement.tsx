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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Sparkles, Video, Star } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string;
  video_url: string;
  video_type: string;
  duration: string | null;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
}

interface VideoManagementProps {
  videos: VideoItem[];
  onRefresh: () => void;
}

const initialForm = {
  title: '',
  description: '',
  thumbnail_url: '',
  video_url: '',
  video_type: 'youtube',
  duration: '',
  display_order: 0,
  is_active: true,
  is_featured: false,
};

const VideoManagement = ({ videos, onRefresh }: VideoManagementProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.video_url || !form.thumbnail_url) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('videos').update(form).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Video updated' });
      } else {
        const { error } = await supabase.from('videos').insert(form);
        if (error) throw error;
        toast({ title: 'Success', description: 'Video added' });
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

  const handleEdit = (video: VideoItem) => {
    setForm({
      title: video.title,
      description: video.description || '',
      thumbnail_url: video.thumbnail_url,
      video_url: video.video_url,
      video_type: video.video_type,
      duration: video.duration || '',
      display_order: video.display_order,
      is_active: video.is_active,
      is_featured: video.is_featured,
    });
    setEditingId(video.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Video deleted' });
      onRefresh();
    }
  };

  const toggleStatus = async (id: string, field: 'is_active' | 'is_featured', current: boolean) => {
    const { error } = await supabase.from('videos').update({ [field]: !current }).eq('id', id);
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
        body: { type: 'video', context: { currentTitle: form.title } },
      });
      if (error) throw error;
      if (data?.suggestions) {
        setForm(prev => ({
          ...prev,
          title: data.suggestions.title || prev.title,
          description: data.suggestions.description || prev.description,
          duration: data.suggestions.duration || prev.duration,
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
            <Video className="h-5 w-5" />
            Video Management
          </CardTitle>
          <CardDescription>Manage videos displayed on the website</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setForm(initialForm); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Video</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Video' : 'Add Video'}</DialogTitle>
              <DialogDescription>Fill in the video details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={getAiSuggestions} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  AI Suggest
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>Thumbnail *</Label>
                <ImageUpload value={form.thumbnail_url} onChange={(url) => setForm(prev => ({ ...prev, thumbnail_url: url }))} />
              </div>
              <div className="grid gap-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Video title" />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Video description" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label>Video URL *</Label>
                <Input value={form.video_url} onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))} placeholder="YouTube/Vimeo embed URL" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Video Type</Label>
                  <Select value={form.video_type} onValueChange={(value) => setForm(prev => ({ ...prev, video_type: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="direct">Direct URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Duration</Label>
                  <Input value={form.duration} onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="e.g., 5:30" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))} />
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
                {editingId ? 'Update' : 'Add'} Video
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
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <img src={video.thumbnail_url} alt={video.title} className="w-20 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {video.title}
                    {video.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{video.video_type}</TableCell>
                <TableCell>{video.duration || '-'}</TableCell>
                <TableCell>
                  <Badge variant={video.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleStatus(video.id, 'is_active', video.is_active)}>
                    {video.is_active ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(video)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {videos.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No videos yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VideoManagement;
