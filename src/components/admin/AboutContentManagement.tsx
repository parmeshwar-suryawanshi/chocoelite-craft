import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Save, Trash2, Loader2, Edit2, Heart, Leaf, Sparkles, Award, Target, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface AboutContent {
  id: string;
  content_type: string;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Leaf,
  Sparkles,
  Award,
  Target,
  Eye,
};

const contentTypes = [
  { value: 'intro', label: 'Introduction' },
  { value: 'feature', label: 'Feature' },
  { value: 'mission', label: 'Mission' },
  { value: 'vision', label: 'Vision' },
];

const iconOptions = ['Heart', 'Leaf', 'Sparkles', 'Award', 'Target', 'Eye'];

const AboutContentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutContent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: aboutContent = [], isLoading } = useQuery({
    queryKey: ['admin-about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as AboutContent[];
    },
  });

  const onRefresh = () => queryClient.invalidateQueries({ queryKey: ['admin-about-content'] });

  const defaultItem: Partial<AboutContent> = {
    content_type: 'feature',
    title: '',
    description: '',
    icon: 'Heart',
    display_order: aboutContent.length + 1,
    is_active: true,
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from('about_content')
          .update({
            content_type: editingItem.content_type,
            title: editingItem.title,
            description: editingItem.description,
            icon: editingItem.icon,
            display_order: editingItem.display_order,
            is_active: editingItem.is_active,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: 'Content Updated', description: 'Changes saved successfully' });
      } else {
        const { error } = await supabase
          .from('about_content')
          .insert({
            content_type: editingItem.content_type,
            title: editingItem.title,
            description: editingItem.description,
            icon: editingItem.icon,
            display_order: editingItem.display_order,
            is_active: editingItem.is_active,
          });

        if (error) throw error;
        toast({ title: 'Content Created', description: 'New content item added' });
      }

      setDialogOpen(false);
      setEditingItem(null);
      onRefresh();
    } catch (error) {
      console.error('Error saving about content:', error);
      toast({ title: 'Error', description: 'Failed to save content', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase.from('about_content').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Content has been removed' });
      onRefresh();
    } catch (error) {
      console.error('Error deleting about content:', error);
      toast({ title: 'Error', description: 'Failed to delete content', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (item: AboutContent) => {
    try {
      const { error } = await supabase
        .from('about_content')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error toggling about content:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const updateField = (field: keyof AboutContent, value: unknown) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'intro': return 'bg-blue-100 text-blue-800';
      case 'feature': return 'bg-green-100 text-green-800';
      case 'mission': return 'bg-purple-100 text-purple-800';
      case 'vision': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>About Section Content</CardTitle>
          <CardDescription>Manage the About section content (intro, features, mission, vision)</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(defaultItem as AboutContent)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? 'Edit Content' : 'Add Content'}</DialogTitle>
            </DialogHeader>
            
            {editingItem && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Content Type</Label>
                    <Select
                      value={editingItem.content_type}
                      onValueChange={(v) => updateField('content_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={editingItem.icon || ''}
                      onValueChange={(v) => updateField('icon', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => {
                          const IconComponent = iconMap[icon];
                          return (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {icon}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={editingItem.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Content title"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingItem.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Content description..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingItem.display_order}
                    onChange={(e) => updateField('display_order', parseInt(e.target.value))}
                  />
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
                  Save Content
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
              <TableHead>Icon</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aboutContent.map((item) => {
              const IconComponent = item.icon ? iconMap[item.icon] : null;
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    {IconComponent && <IconComponent className="h-5 w-5 text-amber-600" />}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(item.content_type)}>
                      {item.content_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.display_order}</TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AboutContentManagement;
