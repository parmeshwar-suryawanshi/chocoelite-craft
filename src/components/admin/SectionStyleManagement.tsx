import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Palette, Type, Square, Layout, Sparkles, Save } from "lucide-react";
import type { SectionStyle } from "@/hooks/useSectionStyles";

const sectionLabels: Record<string, string> = {
  'hero': 'Hero Section',
  'products': 'Products',
  'special-offers': 'Special Offers',
  'combo-offers': 'Combo Offers',
  'festival-offers': 'Festival Offers',
  'limited-edition': 'Limited Edition',
  'craft-video': 'Craft Video',
  'about': 'About',
  'gift-section': 'Gift Section',
  'gallery': 'Gallery',
  'lucky-winners': 'Lucky Winners',
  'testimonials': 'Testimonials',
  'loyalty': 'Loyalty Program',
  'newsletter': 'Newsletter',
  'contact': 'Contact',
};

const fontSizeOptions = [
  { value: 'text-2xl', label: 'Small' },
  { value: 'text-3xl', label: 'Medium' },
  { value: 'text-4xl', label: 'Large' },
  { value: 'text-5xl', label: 'Extra Large' },
  { value: 'text-6xl', label: 'Huge' },
];

const borderRadiusOptions = [
  { value: 'rounded-none', label: 'None' },
  { value: 'rounded-sm', label: 'Small' },
  { value: 'rounded-md', label: 'Medium' },
  { value: 'rounded-lg', label: 'Large' },
  { value: 'rounded-xl', label: 'Extra Large' },
  { value: 'rounded-2xl', label: '2XL' },
  { value: 'rounded-full', label: 'Full' },
];

const shadowOptions = [
  { value: 'shadow-none', label: 'None' },
  { value: 'shadow-sm', label: 'Small' },
  { value: 'shadow-md', label: 'Medium' },
  { value: 'shadow-lg', label: 'Large' },
  { value: 'shadow-xl', label: 'Extra Large' },
  { value: 'shadow-2xl', label: '2XL' },
];

const paddingOptions = [
  { value: 'pt-8', label: 'Small' },
  { value: 'pt-12', label: 'Medium' },
  { value: 'pt-16', label: 'Large' },
  { value: 'pt-20', label: 'Extra Large' },
  { value: 'pt-24', label: '2XL' },
  { value: 'pt-32', label: '3XL' },
];

const SectionStyleManagement = () => {
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const queryClient = useQueryClient();

  const { data: styles, isLoading } = useQuery({
    queryKey: ['section-styles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_styles')
        .select('*')
        .order('section_key');
      if (error) throw error;
      return data as SectionStyle[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<SectionStyle> & { section_key: string }) => {
      const { section_key, ...styleUpdates } = updates;
      const { error } = await supabase
        .from('section_styles')
        .update(styleUpdates)
        .eq('section_key', section_key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-styles'] });
      toast.success('Style updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update style');
    }
  });

  const currentStyle = styles?.find(s => s.section_key === selectedSection);

  const handleUpdate = (field: keyof SectionStyle, value: string | number) => {
    if (!currentStyle) return;
    updateMutation.mutate({ section_key: selectedSection, [field]: value });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading styles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Section Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Section Style Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedSection === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSection(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentStyle && (
        <Tabs defaultValue="background" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="background" className="flex items-center gap-1">
              <Layout className="w-4 h-4" />
              Background
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1">
              <Type className="w-4 h-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="buttons" className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              Buttons
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Cards & Badges
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-1">
              <Layout className="w-4 h-4" />
              Spacing
            </TabsTrigger>
          </TabsList>

          {/* Background Tab */}
          <TabsContent value="background">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Background Type</Label>
                    <Select
                      value={currentStyle.background_type}
                      onValueChange={(v) => handleUpdate('background_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid Color</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyle.background_color}
                        onChange={(e) => handleUpdate('background_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={currentStyle.background_color}
                        onChange={(e) => handleUpdate('background_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {currentStyle.background_type === 'gradient' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Gradient From</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.background_gradient_from || '#ffffff'}
                          onChange={(e) => handleUpdate('background_gradient_from', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.background_gradient_from || ''}
                          onChange={(e) => handleUpdate('background_gradient_from', e.target.value)}
                          className="flex-1"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Gradient To</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.background_gradient_to || '#000000'}
                          onChange={(e) => handleUpdate('background_gradient_to', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.background_gradient_to || ''}
                          onChange={(e) => handleUpdate('background_gradient_to', e.target.value)}
                          className="flex-1"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Direction</Label>
                      <Select
                        value={currentStyle.background_gradient_direction}
                        onValueChange={(v) => handleUpdate('background_gradient_direction', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="to-t">To Top</SelectItem>
                          <SelectItem value="to-b">To Bottom</SelectItem>
                          <SelectItem value="to-l">To Left</SelectItem>
                          <SelectItem value="to-r">To Right</SelectItem>
                          <SelectItem value="to-tr">To Top Right</SelectItem>
                          <SelectItem value="to-br">To Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStyle.background_type === 'image' && (
                  <div className="space-y-2">
                    <Label>Background Image URL</Label>
                    <Input
                      value={currentStyle.background_image_url || ''}
                      onChange={(e) => handleUpdate('background_image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {/* Preview */}
                <div className="mt-6">
                  <Label className="mb-2 block">Preview</Label>
                  <div
                    className="h-32 rounded-lg border flex items-center justify-center"
                    style={{
                      backgroundColor: currentStyle.background_type === 'solid' ? currentStyle.background_color : undefined,
                      background: currentStyle.background_type === 'gradient'
                        ? `linear-gradient(${currentStyle.background_gradient_direction.replace('to-', 'to ')}, ${currentStyle.background_gradient_from || currentStyle.background_color}, ${currentStyle.background_gradient_to || currentStyle.accent_color})`
                        : undefined,
                      backgroundImage: currentStyle.background_type === 'image' && currentStyle.background_image_url
                        ? `url(${currentStyle.background_image_url})`
                        : undefined,
                      backgroundSize: 'cover',
                    }}
                  >
                    <span style={{ color: currentStyle.heading_color }} className="font-bold text-xl">
                      {sectionLabels[selectedSection]} Preview
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heading Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyle.heading_color}
                        onChange={(e) => handleUpdate('heading_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={currentStyle.heading_color}
                        onChange={(e) => handleUpdate('heading_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Heading Size</Label>
                    <Select
                      value={currentStyle.heading_font_size}
                      onValueChange={(v) => handleUpdate('heading_font_size', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizeOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subheading Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyle.subheading_color}
                        onChange={(e) => handleUpdate('subheading_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={currentStyle.subheading_color}
                        onChange={(e) => handleUpdate('subheading_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyle.text_color}
                        onChange={(e) => handleUpdate('text_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={currentStyle.text_color}
                        onChange={(e) => handleUpdate('text_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyle.accent_color}
                        onChange={(e) => handleUpdate('accent_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={currentStyle.accent_color}
                        onChange={(e) => handleUpdate('accent_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Preview */}
                <div className="mt-6 p-6 rounded-lg border" style={{ backgroundColor: currentStyle.background_color }}>
                  <h2 className={currentStyle.heading_font_size} style={{ color: currentStyle.heading_color }}>
                    Heading Preview
                  </h2>
                  <p className="text-lg mt-2" style={{ color: currentStyle.subheading_color }}>
                    Subheading text preview
                  </p>
                  <p className="mt-2" style={{ color: currentStyle.text_color }}>
                    Regular body text preview showing how content will appear.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value="buttons">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Primary Button */}
                <div>
                  <h3 className="font-semibold mb-4">Primary Button</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.button_primary_bg}
                          onChange={(e) => handleUpdate('button_primary_bg', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.button_primary_bg}
                          onChange={(e) => handleUpdate('button_primary_bg', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.button_primary_text}
                          onChange={(e) => handleUpdate('button_primary_text', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.button_primary_text}
                          onChange={(e) => handleUpdate('button_primary_text', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Border Radius</Label>
                      <Select
                        value={currentStyle.button_primary_border_radius}
                        onValueChange={(v) => handleUpdate('button_primary_border_radius', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {borderRadiusOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Secondary Button */}
                <div>
                  <h3 className="font-semibold mb-4">Secondary Button</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.button_secondary_bg === 'transparent' ? '#ffffff' : currentStyle.button_secondary_bg}
                          onChange={(e) => handleUpdate('button_secondary_bg', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.button_secondary_bg}
                          onChange={(e) => handleUpdate('button_secondary_bg', e.target.value)}
                          className="flex-1"
                          placeholder="transparent"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.button_secondary_text}
                          onChange={(e) => handleUpdate('button_secondary_text', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.button_secondary_text}
                          onChange={(e) => handleUpdate('button_secondary_text', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Border Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.button_secondary_border_color}
                          onChange={(e) => handleUpdate('button_secondary_border_color', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.button_secondary_border_color}
                          onChange={(e) => handleUpdate('button_secondary_border_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Preview */}
                <div className="mt-6 p-6 rounded-lg border flex gap-4 items-center" style={{ backgroundColor: currentStyle.background_color }}>
                  <button
                    className={`px-6 py-2 font-medium ${currentStyle.button_primary_border_radius}`}
                    style={{
                      backgroundColor: currentStyle.button_primary_bg,
                      color: currentStyle.button_primary_text,
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className={`px-6 py-2 font-medium border-2 ${currentStyle.button_secondary_border_radius}`}
                    style={{
                      backgroundColor: currentStyle.button_secondary_bg,
                      color: currentStyle.button_secondary_text,
                      borderColor: currentStyle.button_secondary_border_color,
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards & Badges Tab */}
          <TabsContent value="cards">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Card Styling */}
                <div>
                  <h3 className="font-semibold mb-4">Card Styling</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Card Background</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.card_bg}
                          onChange={(e) => handleUpdate('card_bg', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.card_bg}
                          onChange={(e) => handleUpdate('card_bg', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Border Radius</Label>
                      <Select
                        value={currentStyle.card_border_radius}
                        onValueChange={(v) => handleUpdate('card_border_radius', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {borderRadiusOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Shadow</Label>
                      <Select
                        value={currentStyle.card_shadow}
                        onValueChange={(v) => handleUpdate('card_shadow', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {shadowOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Badge Styling */}
                <div>
                  <h3 className="font-semibold mb-4">Badge Styling</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Badge Background</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.badge_bg}
                          onChange={(e) => handleUpdate('badge_bg', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.badge_bg}
                          onChange={(e) => handleUpdate('badge_bg', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Badge Text</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.badge_text}
                          onChange={(e) => handleUpdate('badge_text', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.badge_text}
                          onChange={(e) => handleUpdate('badge_text', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-6 rounded-lg border" style={{ backgroundColor: currentStyle.background_color }}>
                  <div
                    className={`p-6 ${currentStyle.card_border_radius} ${currentStyle.card_shadow}`}
                    style={{ backgroundColor: currentStyle.card_bg }}
                  >
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3"
                      style={{ backgroundColor: currentStyle.badge_bg, color: currentStyle.badge_text }}
                    >
                      Badge Preview
                    </span>
                    <h3 style={{ color: currentStyle.heading_color }} className="font-semibold text-lg">Card Title</h3>
                    <p style={{ color: currentStyle.text_color }} className="text-sm mt-2">Card content preview</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Padding Top</Label>
                    <Select
                      value={currentStyle.padding_top}
                      onValueChange={(v) => handleUpdate('padding_top', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paddingOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Padding Bottom</Label>
                    <Select
                      value={currentStyle.padding_bottom}
                      onValueChange={(v) => handleUpdate('padding_bottom', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paddingOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value.replace('pt-', 'pb-')}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Horizontal Padding</Label>
                    <Select
                      value={currentStyle.padding_x}
                      onValueChange={(v) => handleUpdate('padding_x', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px-2">Extra Small</SelectItem>
                        <SelectItem value="px-4">Small</SelectItem>
                        <SelectItem value="px-6">Medium</SelectItem>
                        <SelectItem value="px-8">Large</SelectItem>
                        <SelectItem value="px-12">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SectionStyleManagement;
