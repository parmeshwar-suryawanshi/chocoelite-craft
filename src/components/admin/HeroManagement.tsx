import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Save, Trash2, Loader2, Image, Video, Palette, Eye, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeroContent {
  id: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  badge_text: string | null;
  primary_button_text: string | null;
  primary_button_link: string | null;
  secondary_button_text: string | null;
  secondary_button_link: string | null;
  image_url: string | null;
  video_url: string | null;
  background_type: string;
  background_value: string | null;
  trust_indicators: unknown;
  floating_card_1_title: string | null;
  floating_card_1_subtitle: string | null;
  floating_card_2_title: string | null;
  floating_card_2_subtitle: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

interface HeroManagementProps {
  heroContents: HeroContent[];
  onRefresh: () => void;
}

const HeroManagement = ({ heroContents, onRefresh }: HeroManagementProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultHero: Partial<HeroContent> = {
    title_line1: 'Where Nature',
    title_line2: 'Meets Indulgence',
    subtitle: 'Experience the perfect harmony of sun-ripened fruits and artisan Belgian chocolate.',
    badge_text: 'Premium Fruit Chocolates',
    primary_button_text: 'Explore Collection',
    primary_button_link: '/shop',
    secondary_button_text: 'Our Story',
    secondary_button_link: '#about',
    image_url: '',
    video_url: '',
    background_type: 'gradient',
    background_value: '',
    floating_card_1_title: '100%',
    floating_card_1_subtitle: 'Real Fruits',
    floating_card_2_title: 'Premium',
    floating_card_2_subtitle: 'Belgian Cocoa',
    is_active: false,
    display_order: heroContents.length + 1,
  };

  const handleSave = async () => {
    if (!editingHero) return;
    
    setSaving(true);
    try {
      if (editingHero.id) {
        // Update existing
        const { error } = await supabase
          .from('hero_content')
          .update({
            title_line1: editingHero.title_line1,
            title_line2: editingHero.title_line2,
            subtitle: editingHero.subtitle,
            badge_text: editingHero.badge_text,
            primary_button_text: editingHero.primary_button_text,
            primary_button_link: editingHero.primary_button_link,
            secondary_button_text: editingHero.secondary_button_text,
            secondary_button_link: editingHero.secondary_button_link,
            image_url: editingHero.image_url,
            video_url: editingHero.video_url,
            background_type: editingHero.background_type,
            background_value: editingHero.background_value,
            floating_card_1_title: editingHero.floating_card_1_title,
            floating_card_1_subtitle: editingHero.floating_card_1_subtitle,
            floating_card_2_title: editingHero.floating_card_2_title,
            floating_card_2_subtitle: editingHero.floating_card_2_subtitle,
            is_active: editingHero.is_active,
            display_order: editingHero.display_order,
          })
          .eq('id', editingHero.id);

        if (error) throw error;
        toast({ title: 'Hero Updated', description: 'Hero content has been saved successfully' });
      } else {
        // Create new
        const { error } = await supabase
          .from('hero_content')
          .insert({
            title_line1: editingHero.title_line1,
            title_line2: editingHero.title_line2,
            subtitle: editingHero.subtitle,
            badge_text: editingHero.badge_text,
            primary_button_text: editingHero.primary_button_text,
            primary_button_link: editingHero.primary_button_link,
            secondary_button_text: editingHero.secondary_button_text,
            secondary_button_link: editingHero.secondary_button_link,
            image_url: editingHero.image_url,
            video_url: editingHero.video_url,
            background_type: editingHero.background_type,
            background_value: editingHero.background_value,
            floating_card_1_title: editingHero.floating_card_1_title,
            floating_card_1_subtitle: editingHero.floating_card_1_subtitle,
            floating_card_2_title: editingHero.floating_card_2_title,
            floating_card_2_subtitle: editingHero.floating_card_2_subtitle,
            is_active: editingHero.is_active,
            display_order: editingHero.display_order,
          });

        if (error) throw error;
        toast({ title: 'Hero Created', description: 'New hero content has been added' });
      }

      setDialogOpen(false);
      setEditingHero(null);
      onRefresh();
    } catch (error) {
      console.error('Error saving hero:', error);
      toast({ title: 'Error', description: 'Failed to save hero content', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero content?')) return;

    try {
      const { error } = await supabase.from('hero_content').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Hero content has been removed' });
      onRefresh();
    } catch (error) {
      console.error('Error deleting hero:', error);
      toast({ title: 'Error', description: 'Failed to delete hero content', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (hero: HeroContent) => {
    try {
      const { error } = await supabase
        .from('hero_content')
        .update({ is_active: !hero.is_active })
        .eq('id', hero.id);

      if (error) throw error;
      toast({ 
        title: hero.is_active ? 'Hero Deactivated' : 'Hero Activated',
        description: `This hero is now ${hero.is_active ? 'hidden' : 'visible'} on the homepage`
      });
      onRefresh();
    } catch (error) {
      console.error('Error toggling hero:', error);
      toast({ title: 'Error', description: 'Failed to update hero status', variant: 'destructive' });
    }
  };

  const updateField = (field: keyof HeroContent, value: any) => {
    if (editingHero) {
      setEditingHero({ ...editingHero, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Hero Section Content</h3>
          <p className="text-sm text-muted-foreground">Manage your homepage hero banners, text, and images</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingHero(defaultHero as HeroContent)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hero Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingHero?.id ? 'Edit Hero Content' : 'Create New Hero'}</DialogTitle>
            </DialogHeader>
            
            {editingHero && (
              <Tabs defaultValue="content" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="buttons">Buttons</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="extras">Extras</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div>
                      <Label>Badge Text</Label>
                      <Input
                        value={editingHero.badge_text || ''}
                        onChange={(e) => updateField('badge_text', e.target.value)}
                        placeholder="e.g., Premium Fruit Chocolates"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title Line 1</Label>
                        <Input
                          value={editingHero.title_line1}
                          onChange={(e) => updateField('title_line1', e.target.value)}
                          placeholder="Where Nature"
                        />
                      </div>
                      <div>
                        <Label>Title Line 2 (Highlighted)</Label>
                        <Input
                          value={editingHero.title_line2}
                          onChange={(e) => updateField('title_line2', e.target.value)}
                          placeholder="Meets Indulgence"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Textarea
                        value={editingHero.subtitle}
                        onChange={(e) => updateField('subtitle', e.target.value)}
                        placeholder="Describe your brand..."
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="buttons" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-medium">Primary Button</h4>
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={editingHero.primary_button_text || ''}
                          onChange={(e) => updateField('primary_button_text', e.target.value)}
                          placeholder="Explore Collection"
                        />
                      </div>
                      <div>
                        <Label>Button Link</Label>
                        <Input
                          value={editingHero.primary_button_link || ''}
                          onChange={(e) => updateField('primary_button_link', e.target.value)}
                          placeholder="/shop"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-medium">Secondary Button</h4>
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={editingHero.secondary_button_text || ''}
                          onChange={(e) => updateField('secondary_button_text', e.target.value)}
                          placeholder="Our Story"
                        />
                      </div>
                      <div>
                        <Label>Button Link</Label>
                        <Input
                          value={editingHero.secondary_button_link || ''}
                          onChange={(e) => updateField('secondary_button_link', e.target.value)}
                          placeholder="#about"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-4">
                  <div>
                    <Label>Background Type</Label>
                    <Select
                      value={editingHero.background_type}
                      onValueChange={(v) => updateField('background_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient">
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Gradient (Default)
                          </div>
                        </SelectItem>
                        <SelectItem value="image">
                          <div className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            Background Image
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Background Video
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editingHero.background_type === 'image' && (
                    <div>
                      <Label>Background Image URL</Label>
                      <Input
                        value={editingHero.background_value || ''}
                        onChange={(e) => updateField('background_value', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  {editingHero.background_type === 'video' && (
                    <div>
                      <Label>Background Video URL</Label>
                      <Input
                        value={editingHero.background_value || ''}
                        onChange={(e) => updateField('background_value', e.target.value)}
                        placeholder="https://... (YouTube embed or video file)"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Hero Image URL</Label>
                    <Input
                      value={editingHero.image_url || ''}
                      onChange={(e) => updateField('image_url', e.target.value)}
                      placeholder="https://..."
                    />
                    {editingHero.image_url && (
                      <div className="mt-2 rounded-lg overflow-hidden border aspect-square max-w-[200px]">
                        <img src={editingHero.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Hero Video URL (Optional - replaces image)</Label>
                    <Input
                      value={editingHero.video_url || ''}
                      onChange={(e) => updateField('video_url', e.target.value)}
                      placeholder="https://youtube.com/embed/..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="extras" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-medium">Floating Card 1</h4>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={editingHero.floating_card_1_title || ''}
                          onChange={(e) => updateField('floating_card_1_title', e.target.value)}
                          placeholder="100%"
                        />
                      </div>
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={editingHero.floating_card_1_subtitle || ''}
                          onChange={(e) => updateField('floating_card_1_subtitle', e.target.value)}
                          placeholder="Real Fruits"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-medium">Floating Card 2</h4>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={editingHero.floating_card_2_title || ''}
                          onChange={(e) => updateField('floating_card_2_title', e.target.value)}
                          placeholder="Premium"
                        />
                      </div>
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={editingHero.floating_card_2_subtitle || ''}
                          onChange={(e) => updateField('floating_card_2_subtitle', e.target.value)}
                          placeholder="Belgian Cocoa"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Active Status</Label>
                      <p className="text-sm text-muted-foreground">Show this hero on the homepage</p>
                    </div>
                    <Switch
                      checked={editingHero.is_active}
                      onCheckedChange={(checked) => updateField('is_active', checked)}
                    />
                  </div>

                  <div>
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editingHero.display_order}
                      onChange={(e) => updateField('display_order', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save Hero
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {heroContents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Image className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">No Hero Content Yet</h4>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Create your first hero slide to display on the homepage
              </p>
              <Button onClick={() => { setEditingHero(defaultHero as HeroContent); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Hero
              </Button>
            </CardContent>
          </Card>
        ) : (
          heroContents.map((hero) => (
            <Card key={hero.id} className={!hero.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {hero.image_url && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={hero.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold truncate">{hero.title_line1} {hero.title_line2}</h4>
                          {hero.is_active ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{hero.subtitle}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Order: {hero.display_order}</span>
                          <span>Type: {hero.background_type}</span>
                          {hero.badge_text && <span>Badge: {hero.badge_text}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={hero.is_active}
                          onCheckedChange={() => handleToggleActive(hero)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingHero(hero); setDialogOpen(true); }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(hero.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HeroManagement;
