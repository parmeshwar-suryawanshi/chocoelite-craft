import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Palette, Type, Square, Layout, Sparkles, Wand2, Move, Box, Layers } from "lucide-react";
import type { SectionStyle } from "@/hooks/useSectionStyles";

const sectionLabels: Record<string, string> = {
  'hero': 'Hero Section',
  'navbar': 'Navbar',
  'footer': 'Footer',
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
  { value: 'text-xl', label: 'Extra Small' },
  { value: 'text-2xl', label: 'Small' },
  { value: 'text-3xl', label: 'Medium' },
  { value: 'text-4xl', label: 'Large' },
  { value: 'text-5xl', label: 'Extra Large' },
  { value: 'text-6xl', label: 'Huge' },
  { value: 'text-7xl', label: 'Massive' },
];

const fontWeightOptions = [
  { value: 'font-light', label: 'Light' },
  { value: 'font-normal', label: 'Normal' },
  { value: 'font-medium', label: 'Medium' },
  { value: 'font-semibold', label: 'Semibold' },
  { value: 'font-bold', label: 'Bold' },
  { value: 'font-extrabold', label: 'Extra Bold' },
];

const borderRadiusOptions = [
  { value: 'rounded-none', label: 'None' },
  { value: 'rounded-sm', label: 'Small' },
  { value: 'rounded-md', label: 'Medium' },
  { value: 'rounded-lg', label: 'Large' },
  { value: 'rounded-xl', label: 'Extra Large' },
  { value: 'rounded-2xl', label: '2XL' },
  { value: 'rounded-3xl', label: '3XL' },
  { value: 'rounded-full', label: 'Full' },
];

const shadowOptions = [
  { value: 'shadow-none', label: 'None' },
  { value: 'shadow-sm', label: 'Small' },
  { value: 'shadow-md', label: 'Medium' },
  { value: 'shadow-lg', label: 'Large' },
  { value: 'shadow-xl', label: 'Extra Large' },
  { value: 'shadow-2xl', label: '2XL' },
  { value: 'shadow-inner', label: 'Inner' },
];

const paddingOptions = [
  { value: 'pt-4', label: 'Tiny' },
  { value: 'pt-8', label: 'Small' },
  { value: 'pt-12', label: 'Medium' },
  { value: 'pt-16', label: 'Large' },
  { value: 'pt-20', label: 'Extra Large' },
  { value: 'pt-24', label: '2XL' },
  { value: 'pt-32', label: '3XL' },
  { value: 'pt-40', label: '4XL' },
];

const animationOptions = [
  { value: 'none', label: 'None' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-down', label: 'Fade Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'pulse', label: 'Pulse' },
];

const hoverEffectOptions = [
  { value: 'none', label: 'None' },
  { value: 'lift', label: 'Lift Up' },
  { value: 'glow', label: 'Glow' },
  { value: 'scale', label: 'Scale' },
  { value: 'shadow', label: 'Shadow Grow' },
  { value: 'border-glow', label: 'Border Glow' },
];

const dividerOptions = [
  { value: 'none', label: 'None' },
  { value: 'line', label: 'Simple Line' },
  { value: 'dashed', label: 'Dashed Line' },
  { value: 'dotted', label: 'Dotted Line' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'wave', label: 'Wave' },
  { value: 'zigzag', label: 'Zigzag' },
];

const textAlignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const containerWidthOptions = [
  { value: 'max-w-4xl', label: 'Small' },
  { value: 'max-w-5xl', label: 'Medium' },
  { value: 'max-w-6xl', label: 'Large' },
  { value: 'max-w-7xl', label: 'Extra Large' },
  { value: 'max-w-full', label: 'Full Width' },
];

const particleSpeedOptions = [
  { value: 'slow', label: 'Slow' },
  { value: 'medium', label: 'Medium' },
  { value: 'fast', label: 'Fast' },
];

const letterSpacingOptions = [
  { value: 'tracking-tighter', label: 'Tighter' },
  { value: 'tracking-tight', label: 'Tight' },
  { value: 'tracking-normal', label: 'Normal' },
  { value: 'tracking-wide', label: 'Wide' },
  { value: 'tracking-wider', label: 'Wider' },
  { value: 'tracking-widest', label: 'Widest' },
];

const lineHeightOptions = [
  { value: 'leading-none', label: 'None' },
  { value: 'leading-tight', label: 'Tight' },
  { value: 'leading-snug', label: 'Snug' },
  { value: 'leading-normal', label: 'Normal' },
  { value: 'leading-relaxed', label: 'Relaxed' },
  { value: 'leading-loose', label: 'Loose' },
];

const borderStyleOptions = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
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

  const handleUpdate = (field: keyof SectionStyle, value: string | number | boolean) => {
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
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="background" className="flex items-center gap-1">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Background</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1">
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Typography</span>
            </TabsTrigger>
            <TabsTrigger value="buttons" className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span className="hidden sm:inline">Buttons</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-1">
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Animation</span>
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-1">
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Effects</span>
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-1">
              <Move className="w-4 h-4" />
              <span className="hidden sm:inline">Spacing</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Background Tab */}
          <TabsContent value="background">
            <Card>
              <CardContent className="pt-6 space-y-6">
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Gradient From</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.background_gradient_from || '#ffffff'}
                          onChange={(e) => handleUpdate('background_gradient_from', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.background_gradient_from || ''}
                          onChange={(e) => handleUpdate('background_gradient_from', e.target.value)}
                          className="flex-1"
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
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.background_gradient_to || ''}
                          onChange={(e) => handleUpdate('background_gradient_to', e.target.value)}
                          className="flex-1"
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
                          <SelectItem value="to-tl">To Top Left</SelectItem>
                          <SelectItem value="to-bl">To Bottom Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Gradient Angle</Label>
                      <Input
                        value={currentStyle.gradient_angle || '135deg'}
                        onChange={(e) => handleUpdate('gradient_angle', e.target.value)}
                        placeholder="135deg"
                      />
                    </div>
                  </div>
                )}

                {currentStyle.background_type === 'image' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Background Image URL</Label>
                      <Input
                        value={currentStyle.background_image_url || ''}
                        onChange={(e) => handleUpdate('background_image_url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Overlay Opacity: {currentStyle.background_overlay_opacity}%</Label>
                      <Slider
                        value={[currentStyle.background_overlay_opacity]}
                        onValueChange={(v) => handleUpdate('background_overlay_opacity', v[0])}
                        max={100}
                        step={5}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Overlay Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyle.overlay_color || '#000000'}
                        onChange={(e) => handleUpdate('overlay_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={currentStyle.overlay_color || ''}
                        onChange={(e) => handleUpdate('overlay_color', e.target.value)}
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

                {/* Preview */}
                <div className="mt-6">
                  <Label className="mb-2 block">Preview</Label>
                  <div
                    className="h-32 rounded-lg border flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor: currentStyle.background_type === 'solid' ? currentStyle.background_color : undefined,
                      background: currentStyle.background_type === 'gradient'
                        ? `linear-gradient(${currentStyle.gradient_angle || '135deg'}, ${currentStyle.background_gradient_from || currentStyle.background_color}, ${currentStyle.background_gradient_to || currentStyle.accent_color})`
                        : undefined,
                      backgroundImage: currentStyle.background_type === 'image' && currentStyle.background_image_url
                        ? `url(${currentStyle.background_image_url})`
                        : undefined,
                      backgroundSize: 'cover',
                    }}
                  >
                    {currentStyle.background_overlay_opacity > 0 && (
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundColor: currentStyle.overlay_color,
                          opacity: currentStyle.background_overlay_opacity / 100
                        }}
                      />
                    )}
                    <span style={{ color: currentStyle.heading_color }} className="font-bold text-xl relative z-10">
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
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <Label>Heading Weight</Label>
                    <Select
                      value={currentStyle.heading_font_weight || 'font-bold'}
                      onValueChange={(v) => handleUpdate('heading_font_weight', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeightOptions.map(opt => (
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
                    <Label>Text Weight</Label>
                    <Select
                      value={currentStyle.text_font_weight || 'font-normal'}
                      onValueChange={(v) => handleUpdate('text_font_weight', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeightOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Text Alignment</Label>
                    <Select
                      value={currentStyle.text_align || 'center'}
                      onValueChange={(v) => handleUpdate('text_align', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {textAlignOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Letter Spacing</Label>
                    <Select
                      value={currentStyle.letter_spacing || 'tracking-normal'}
                      onValueChange={(v) => handleUpdate('letter_spacing', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {letterSpacingOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <Select
                      value={currentStyle.line_height || 'leading-normal'}
                      onValueChange={(v) => handleUpdate('line_height', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lineHeightOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Typography Preview */}
                <div className="mt-6 p-6 rounded-lg border" style={{ backgroundColor: currentStyle.background_color, textAlign: currentStyle.text_align as any }}>
                  <h2 
                    className={`${currentStyle.heading_font_size} ${currentStyle.heading_font_weight || 'font-bold'} ${currentStyle.letter_spacing || ''}`} 
                    style={{ color: currentStyle.heading_color }}
                  >
                    Heading Preview
                  </h2>
                  <p className={`text-lg mt-2 ${currentStyle.line_height || ''}`} style={{ color: currentStyle.subheading_color }}>
                    Subheading text preview
                  </p>
                  <p className={`mt-2 ${currentStyle.text_font_weight || 'font-normal'}`} style={{ color: currentStyle.text_color }}>
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.button_primary_bg}
                          onChange={(e) => handleUpdate('button_primary_bg', e.target.value)}
                          className="w-12 h-10 p-1"
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
                          className="w-12 h-10 p-1"
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
                    <div className="space-y-2">
                      <Label>Hover Effect</Label>
                      <Select
                        value={currentStyle.button_hover_effect || 'darken'}
                        onValueChange={(v) => handleUpdate('button_hover_effect', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="darken">Darken</SelectItem>
                          <SelectItem value="lighten">Lighten</SelectItem>
                          <SelectItem value="scale">Scale Up</SelectItem>
                          <SelectItem value="glow">Glow</SelectItem>
                          <SelectItem value="shadow">Shadow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Secondary Button */}
                <div>
                  <h3 className="font-semibold mb-4">Secondary Button</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.button_secondary_bg === 'transparent' ? '#ffffff' : currentStyle.button_secondary_bg}
                          onChange={(e) => handleUpdate('button_secondary_bg', e.target.value)}
                          className="w-12 h-10 p-1"
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
                          className="w-12 h-10 p-1"
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
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.button_secondary_border_color}
                          onChange={(e) => handleUpdate('button_secondary_border_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Border Radius</Label>
                      <Select
                        value={currentStyle.button_secondary_border_radius}
                        onValueChange={(v) => handleUpdate('button_secondary_border_radius', v)}
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

                {/* Button Preview */}
                <div className="mt-6 p-6 rounded-lg border flex gap-4 items-center flex-wrap" style={{ backgroundColor: currentStyle.background_color }}>
                  <button
                    className={`px-6 py-2 font-medium ${currentStyle.button_primary_border_radius} transition-all duration-300 hover:opacity-90 hover:scale-105`}
                    style={{
                      backgroundColor: currentStyle.button_primary_bg,
                      color: currentStyle.button_primary_text,
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className={`px-6 py-2 font-medium border-2 ${currentStyle.button_secondary_border_radius} transition-all duration-300 hover:opacity-80`}
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Card Background</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.card_bg}
                          onChange={(e) => handleUpdate('card_bg', e.target.value)}
                          className="w-12 h-10 p-1"
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
                    <div className="space-y-2">
                      <Label>Hover Effect</Label>
                      <Select
                        value={currentStyle.card_hover_effect || 'shadow'}
                        onValueChange={(v) => handleUpdate('card_hover_effect', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {hoverEffectOptions.map(opt => (
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Badge Background</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.badge_bg}
                          onChange={(e) => handleUpdate('badge_bg', e.target.value)}
                          className="w-12 h-10 p-1"
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
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.badge_text}
                          onChange={(e) => handleUpdate('badge_text', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Icon Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.icon_color || '#8B4513'}
                          onChange={(e) => handleUpdate('icon_color', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.icon_color || ''}
                          onChange={(e) => handleUpdate('icon_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Icon Size</Label>
                      <Input
                        value={currentStyle.icon_size || '24px'}
                        onChange={(e) => handleUpdate('icon_size', e.target.value)}
                        placeholder="24px"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-6 rounded-lg border" style={{ backgroundColor: currentStyle.background_color }}>
                  <div
                    className={`p-6 ${currentStyle.card_border_radius} ${currentStyle.card_shadow} transition-all duration-300 hover:shadow-xl`}
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

          {/* Animations Tab */}
          <TabsContent value="animations">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Animation Type</Label>
                    <Select
                      value={currentStyle.animation_type || 'none'}
                      onValueChange={(v) => handleUpdate('animation_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {animationOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Animation Duration</Label>
                    <Select
                      value={currentStyle.animation_duration || '300ms'}
                      onValueChange={(v) => handleUpdate('animation_duration', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="150ms">Fast (150ms)</SelectItem>
                        <SelectItem value="300ms">Normal (300ms)</SelectItem>
                        <SelectItem value="500ms">Slow (500ms)</SelectItem>
                        <SelectItem value="700ms">Very Slow (700ms)</SelectItem>
                        <SelectItem value="1000ms">Extra Slow (1s)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Animation Delay</Label>
                    <Select
                      value={currentStyle.animation_delay || '0ms'}
                      onValueChange={(v) => handleUpdate('animation_delay', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0ms">None</SelectItem>
                        <SelectItem value="100ms">100ms</SelectItem>
                        <SelectItem value="200ms">200ms</SelectItem>
                        <SelectItem value="300ms">300ms</SelectItem>
                        <SelectItem value="500ms">500ms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Particles Section */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Particle Animation (Hero/Background)</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2 flex items-center gap-3">
                      <Switch
                        checked={currentStyle.particles_enabled || false}
                        onCheckedChange={(v) => handleUpdate('particles_enabled', v)}
                      />
                      <Label>Enable Particles</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Particle Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.particles_color || '#ffffff'}
                          onChange={(e) => handleUpdate('particles_color', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.particles_color || '#ffffff'}
                          onChange={(e) => handleUpdate('particles_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Particle Count: {currentStyle.particles_count || 30}</Label>
                      <Slider
                        value={[currentStyle.particles_count || 30]}
                        onValueChange={(v) => handleUpdate('particles_count', v[0])}
                        min={10}
                        max={100}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Particle Speed</Label>
                      <Select
                        value={currentStyle.particles_speed || 'medium'}
                        onValueChange={(v) => handleUpdate('particles_speed', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {particleSpeedOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Hover Effect</Label>
                    <Select
                      value={currentStyle.hover_effect || 'none'}
                      onValueChange={(v) => handleUpdate('hover_effect', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hoverEffectOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Section Divider</Label>
                    <Select
                      value={currentStyle.divider_style || 'none'}
                      onValueChange={(v) => handleUpdate('divider_style', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dividerOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Divider Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyle.divider_color || '#e5e7eb'}
                        onChange={(e) => handleUpdate('divider_color', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={currentStyle.divider_color || ''}
                        onChange={(e) => handleUpdate('divider_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Border Styling */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Border Styling</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Border Style</Label>
                      <Select
                        value={currentStyle.border_style || 'none'}
                        onValueChange={(v) => handleUpdate('border_style', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {borderStyleOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Border Width</Label>
                      <Input
                        value={currentStyle.border_width || '0'}
                        onChange={(e) => handleUpdate('border_width', e.target.value)}
                        placeholder="0, 1px, 2px, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Border Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={currentStyle.border_color || '#e5e7eb'}
                          onChange={(e) => handleUpdate('border_color', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={currentStyle.border_color || ''}
                          onChange={(e) => handleUpdate('border_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <SelectItem value="px-16">2XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Container Width</Label>
                    <Select
                      value={currentStyle.container_max_width || 'max-w-7xl'}
                      onValueChange={(v) => handleUpdate('container_max_width', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {containerWidthOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Custom CSS (Advanced)</Label>
                  <Textarea
                    value={currentStyle.custom_css || ''}
                    onChange={(e) => handleUpdate('custom_css', e.target.value)}
                    placeholder="/* Add custom CSS here */
.my-class {
  /* custom styles */
}"
                    className="font-mono text-sm min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add custom CSS for advanced styling. Use with caution.
                  </p>
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