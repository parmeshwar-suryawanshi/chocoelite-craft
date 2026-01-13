import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Save, Trash2, Loader2, Edit2, Gift, Award, Sparkles, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface LoyaltyTier {
  id: string;
  name: string;
  icon: string;
  color_from: string;
  color_to: string;
  points_min: number;
  points_max: number | null;
  benefits: string[];
  display_order: number;
  is_active: boolean;
}

interface LoyaltyEarnRule {
  id: string;
  rule_type: string;
  points_value: number;
  description: string;
  display_order: number;
  is_active: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Gift,
  Award,
  Sparkles,
  Crown,
};

const iconOptions = ['Gift', 'Award', 'Sparkles', 'Crown'];

const colorOptions = [
  'orange-400', 'orange-600', 'gray-300', 'gray-500', 
  'yellow-400', 'yellow-600', 'purple-400', 'purple-600',
  'blue-400', 'blue-600', 'green-400', 'green-600',
  'red-400', 'red-600', 'pink-400', 'pink-600',
];

const LoyaltyManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
  const [editingRule, setEditingRule] = useState<LoyaltyEarnRule | null>(null);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [benefitsText, setBenefitsText] = useState('');

  const { data: tiers = [], isLoading: tiersLoading } = useQuery({
    queryKey: ['admin-loyalty-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_tiers')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as LoyaltyTier[];
    },
  });

  const { data: earnRules = [], isLoading: rulesLoading } = useQuery({
    queryKey: ['admin-loyalty-earn-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_earn_rules')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as LoyaltyEarnRule[];
    },
  });

  const isLoading = tiersLoading || rulesLoading;

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-loyalty-tiers'] });
    queryClient.invalidateQueries({ queryKey: ['admin-loyalty-earn-rules'] });
  };

  const defaultTier: Partial<LoyaltyTier> = {
    name: '',
    icon: 'Gift',
    color_from: 'orange-400',
    color_to: 'orange-600',
    points_min: 0,
    points_max: null,
    benefits: [],
    display_order: tiers.length + 1,
    is_active: true,
  };

  const defaultRule: Partial<LoyaltyEarnRule> = {
    rule_type: 'purchase',
    points_value: 10,
    description: '',
    display_order: earnRules.length + 1,
    is_active: true,
  };

  const handleSaveTier = async () => {
    if (!editingTier) return;
    
    setSaving(true);
    try {
      const benefitsArray = benefitsText.split('\n').filter(b => b.trim());
      
      if (editingTier.id) {
        const { error } = await supabase
          .from('loyalty_tiers')
          .update({
            name: editingTier.name,
            icon: editingTier.icon,
            color_from: editingTier.color_from,
            color_to: editingTier.color_to,
            points_min: editingTier.points_min,
            points_max: editingTier.points_max,
            benefits: benefitsArray,
            display_order: editingTier.display_order,
            is_active: editingTier.is_active,
          })
          .eq('id', editingTier.id);

        if (error) throw error;
        toast({ title: 'Tier Updated', description: 'Changes saved successfully' });
      } else {
        const { error } = await supabase
          .from('loyalty_tiers')
          .insert({
            name: editingTier.name,
            icon: editingTier.icon,
            color_from: editingTier.color_from,
            color_to: editingTier.color_to,
            points_min: editingTier.points_min,
            points_max: editingTier.points_max,
            benefits: benefitsArray,
            display_order: editingTier.display_order,
            is_active: editingTier.is_active,
          });

        if (error) throw error;
        toast({ title: 'Tier Created', description: 'New tier added' });
      }

      setTierDialogOpen(false);
      setEditingTier(null);
      setBenefitsText('');
      onRefresh();
    } catch (error) {
      console.error('Error saving tier:', error);
      toast({ title: 'Error', description: 'Failed to save tier', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRule = async () => {
    if (!editingRule) return;
    
    setSaving(true);
    try {
      if (editingRule.id) {
        const { error } = await supabase
          .from('loyalty_earn_rules')
          .update({
            rule_type: editingRule.rule_type,
            points_value: editingRule.points_value,
            description: editingRule.description,
            display_order: editingRule.display_order,
            is_active: editingRule.is_active,
          })
          .eq('id', editingRule.id);

        if (error) throw error;
        toast({ title: 'Rule Updated', description: 'Changes saved successfully' });
      } else {
        const { error } = await supabase
          .from('loyalty_earn_rules')
          .insert({
            rule_type: editingRule.rule_type,
            points_value: editingRule.points_value,
            description: editingRule.description,
            display_order: editingRule.display_order,
            is_active: editingRule.is_active,
          });

        if (error) throw error;
        toast({ title: 'Rule Created', description: 'New earn rule added' });
      }

      setRuleDialogOpen(false);
      setEditingRule(null);
      onRefresh();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast({ title: 'Error', description: 'Failed to save rule', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tier?')) return;
    try {
      const { error } = await supabase.from('loyalty_tiers').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Tier has been removed' });
      onRefresh();
    } catch (error) {
      console.error('Error deleting tier:', error);
      toast({ title: 'Error', description: 'Failed to delete tier', variant: 'destructive' });
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    try {
      const { error } = await supabase.from('loyalty_earn_rules').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Rule has been removed' });
      onRefresh();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({ title: 'Error', description: 'Failed to delete rule', variant: 'destructive' });
    }
  };

  const openTierEdit = (tier: LoyaltyTier | null) => {
    if (tier) {
      setEditingTier(tier);
      setBenefitsText(Array.isArray(tier.benefits) ? tier.benefits.join('\n') : '');
    } else {
      setEditingTier(defaultTier as LoyaltyTier);
      setBenefitsText('');
    }
    setTierDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Program</CardTitle>
        <CardDescription>Manage loyalty tiers and how customers earn points</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tiers">
          <TabsList>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="earn-rules">Earn Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="tiers" className="mt-4">
            <div className="flex justify-end mb-4">
              <Dialog open={tierDialogOpen} onOpenChange={setTierDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openTierEdit(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingTier?.id ? 'Edit Tier' : 'Add Tier'}</DialogTitle>
                  </DialogHeader>
                  
                  {editingTier && (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tier Name</Label>
                          <Input
                            value={editingTier.name}
                            onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                            placeholder="Bronze, Silver, Gold..."
                          />
                        </div>
                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={editingTier.icon}
                            onValueChange={(v) => setEditingTier({ ...editingTier, icon: v })}
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

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Color From</Label>
                          <Select
                            value={editingTier.color_from}
                            onValueChange={(v) => setEditingTier({ ...editingTier, color_from: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {colorOptions.map((color) => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Color To</Label>
                          <Select
                            value={editingTier.color_to}
                            onValueChange={(v) => setEditingTier({ ...editingTier, color_to: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {colorOptions.map((color) => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Min Points</Label>
                          <Input
                            type="number"
                            value={editingTier.points_min}
                            onChange={(e) => setEditingTier({ ...editingTier, points_min: parseInt(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Max Points (empty for unlimited)</Label>
                          <Input
                            type="number"
                            value={editingTier.points_max || ''}
                            onChange={(e) => setEditingTier({ ...editingTier, points_max: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Unlimited"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Benefits (one per line)</Label>
                        <Textarea
                          value={benefitsText}
                          onChange={(e) => setBenefitsText(e.target.value)}
                          placeholder="5% off on all orders&#10;Birthday surprise&#10;Early access to sales"
                          rows={4}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingTier.is_active}
                          onCheckedChange={(v) => setEditingTier({ ...editingTier, is_active: v })}
                        />
                        <Label>Active</Label>
                      </div>

                      <Button onClick={handleSaveTier} disabled={saving} className="w-full">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Tier
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Points Range</TableHead>
                  <TableHead>Benefits</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => {
                  const IconComponent = iconMap[tier.icon] || Gift;
                  return (
                    <TableRow key={tier.id}>
                      <TableCell>
                        <IconComponent className="h-5 w-5 text-amber-600" />
                      </TableCell>
                      <TableCell className="font-medium">{tier.name}</TableCell>
                      <TableCell>
                        {tier.points_min} - {tier.points_max || '∞'}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(tier.benefits) ? tier.benefits.length : 0} benefits
                      </TableCell>
                      <TableCell>
                        <Switch checked={tier.is_active} disabled />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => openTierEdit(tier)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteTier(tier.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="earn-rules" className="mt-4">
            <div className="flex justify-end mb-4">
              <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingRule(defaultRule as LoyaltyEarnRule)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingRule?.id ? 'Edit Rule' : 'Add Rule'}</DialogTitle>
                  </DialogHeader>
                  
                  {editingRule && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Rule Type</Label>
                        <Select
                          value={editingRule.rule_type}
                          onValueChange={(v) => setEditingRule({ ...editingRule, rule_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="purchase">Purchase</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="signup">Sign Up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Points Value</Label>
                        <Input
                          type="number"
                          value={editingRule.points_value}
                          onChange={(e) => setEditingRule({ ...editingRule, points_value: parseInt(e.target.value) })}
                        />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Input
                          value={editingRule.description}
                          onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                          placeholder="₹100 = 10 Points"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingRule.is_active}
                          onCheckedChange={(v) => setEditingRule({ ...editingRule, is_active: v })}
                        />
                        <Label>Active</Label>
                      </div>

                      <Button onClick={handleSaveRule} disabled={saving} className="w-full">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Rule
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium capitalize">{rule.rule_type}</TableCell>
                    <TableCell>{rule.points_value}</TableCell>
                    <TableCell>{rule.description}</TableCell>
                    <TableCell>
                      <Switch checked={rule.is_active} disabled />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => { setEditingRule(rule); setRuleDialogOpen(true); }}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoyaltyManagement;
