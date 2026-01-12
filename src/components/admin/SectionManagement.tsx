import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GripVertical, Save, Eye, EyeOff, Loader2 } from 'lucide-react';

interface SiteSection {
  id: string;
  section_key: string;
  section_name: string;
  is_visible: boolean;
  display_order: number;
  description: string | null;
}

interface SectionManagementProps {
  sections: SiteSection[];
  onRefresh: () => void;
}

const SectionManagement = ({ sections, onRefresh }: SectionManagementProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);
  const [localSections, setLocalSections] = useState<SiteSection[]>(sections);

  // Update local state when props change
  useState(() => {
    setLocalSections(sections);
  });

  const handleToggleVisibility = async (section: SiteSection) => {
    setSaving(section.id);
    try {
      const { error } = await supabase
        .from('site_sections')
        .update({ is_visible: !section.is_visible })
        .eq('id', section.id);

      if (error) throw error;

      setLocalSections(prev => 
        prev.map(s => s.id === section.id ? { ...s, is_visible: !s.is_visible } : s)
      );

      toast({
        title: 'Section Updated',
        description: `${section.section_name} is now ${!section.is_visible ? 'visible' : 'hidden'}`,
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: 'Error',
        description: 'Failed to update section visibility',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const handleUpdateOrder = async (sectionId: string, newOrder: number) => {
    setSaving(sectionId);
    try {
      const { error } = await supabase
        .from('site_sections')
        .update({ display_order: newOrder })
        .eq('id', sectionId);

      if (error) throw error;

      setLocalSections(prev => 
        prev.map(s => s.id === sectionId ? { ...s, display_order: newOrder } : s)
          .sort((a, b) => a.display_order - b.display_order)
      );

      toast({
        title: 'Order Updated',
        description: 'Section display order has been updated',
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update section order',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const sortedSections = [...localSections].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Section Visibility & Order
          </CardTitle>
          <CardDescription>
            Control which sections appear on your homepage and in what order. Toggle visibility on/off and adjust display order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedSections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  section.is_visible 
                    ? 'bg-card border-border' 
                    : 'bg-muted/50 border-dashed opacity-60'
                }`}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{section.section_name}</h4>
                    {!section.is_visible && (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </div>
                  {section.description && (
                    <p className="text-sm text-muted-foreground truncate">{section.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`order-${section.id}`} className="text-xs text-muted-foreground">
                      Order
                    </Label>
                    <Input
                      id={`order-${section.id}`}
                      type="number"
                      min="1"
                      max="20"
                      value={section.display_order}
                      onChange={(e) => handleUpdateOrder(section.id, parseInt(e.target.value) || 1)}
                      className="w-16 h-8 text-center"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {saving === section.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Switch
                        checked={section.is_visible}
                        onCheckedChange={() => handleToggleVisibility(section)}
                        aria-label={`Toggle ${section.section_name} visibility`}
                      />
                    )}
                    {section.is_visible ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Save className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Auto-Save Enabled</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Changes are saved automatically. The homepage will update in real-time as you toggle sections on/off or change their order.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectionManagement;
