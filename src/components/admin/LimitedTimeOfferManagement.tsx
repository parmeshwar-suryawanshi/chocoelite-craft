import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Save, Trash2, Loader2, Edit2, Clock, BarChart3, Eye, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format, differenceInSeconds } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface LimitedTimeOffer {
  id: string;
  title: string;
  description: string;
  offer_type: string;
  discount_type: string;
  discount_value: number | null;
  code: string | null;
  product_ids: string[] | null;
  category_filter: string | null;
  min_order_amount: number | null;
  start_date: string;
  end_date: string;
  banner_image: string | null;
  badge_text: string | null;
  terms_conditions: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

interface OfferAnalytics {
  id: string;
  offer_id: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue_generated: number;
  date: string;
}

const offerTypes = [
  { value: 'flash_sale', label: 'Flash Sale' },
  { value: 'festival', label: 'Festival Offer' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'seasonal', label: 'Seasonal' },
];

const discountTypes = [
  { value: 'percentage', label: 'Percentage Off' },
  { value: 'fixed', label: 'Fixed Amount Off' },
  { value: 'bogo', label: 'Buy One Get One' },
  { value: 'free_gift', label: 'Free Gift' },
];

const CountdownTimer = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = differenceInSeconds(end, now);
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const isExpired = timeLeft === 'Expired';

  return (
    <Badge variant={isExpired ? 'destructive' : 'secondary'} className="font-mono">
      <Clock className="h-3 w-3 mr-1" />
      {timeLeft}
    </Badge>
  );
};

const LimitedTimeOfferManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [editingOffer, setEditingOffer] = useState<LimitedTimeOffer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingAnalytics, setViewingAnalytics] = useState<string | null>(null);

  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: ['admin-limited-time-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('limited_time_offers')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as LimitedTimeOffer[];
    },
  });

  const { data: analytics = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-offer-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offer_analytics')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data as OfferAnalytics[];
    },
  });

  const isLoading = offersLoading || analyticsLoading;

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-limited-time-offers'] });
    queryClient.invalidateQueries({ queryKey: ['admin-offer-analytics'] });
  };

  const now = new Date();
  const activeOffers = offers.filter(o => new Date(o.end_date) > now && new Date(o.start_date) <= now);
  const upcomingOffers = offers.filter(o => new Date(o.start_date) > now);
  const expiredOffers = offers.filter(o => new Date(o.end_date) <= now);

  const defaultOffer: Partial<LimitedTimeOffer> = {
    title: '',
    description: '',
    offer_type: 'flash_sale',
    discount_type: 'percentage',
    discount_value: null,
    code: '',
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    banner_image: '',
    badge_text: '',
    terms_conditions: '',
    is_active: true,
    is_featured: false,
    display_order: offers.length + 1,
  };

  const handleSave = async () => {
    if (!editingOffer) return;
    
    setSaving(true);
    try {
      const payload = {
        title: editingOffer.title,
        description: editingOffer.description,
        offer_type: editingOffer.offer_type,
        discount_type: editingOffer.discount_type,
        discount_value: editingOffer.discount_value,
        code: editingOffer.code,
        start_date: editingOffer.start_date,
        end_date: editingOffer.end_date,
        banner_image: editingOffer.banner_image,
        badge_text: editingOffer.badge_text,
        terms_conditions: editingOffer.terms_conditions,
        is_active: editingOffer.is_active,
        is_featured: editingOffer.is_featured,
        display_order: editingOffer.display_order,
        min_order_amount: editingOffer.min_order_amount,
        category_filter: editingOffer.category_filter,
      };

      if (editingOffer.id) {
        const { error } = await supabase
          .from('limited_time_offers')
          .update(payload)
          .eq('id', editingOffer.id);

        if (error) throw error;
        toast({ title: 'Offer Updated', description: 'Changes saved successfully' });
      } else {
        const { error } = await supabase
          .from('limited_time_offers')
          .insert(payload);

        if (error) throw error;
        toast({ title: 'Offer Created', description: 'New limited time offer added' });
      }

      setDialogOpen(false);
      setEditingOffer(null);
      onRefresh();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({ title: 'Error', description: 'Failed to save offer', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      const { error } = await supabase.from('limited_time_offers').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Offer has been removed' });
      onRefresh();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({ title: 'Error', description: 'Failed to delete offer', variant: 'destructive' });
    }
  };

  const getOfferAnalytics = (offerId: string) => {
    const offerData = analytics.filter(a => a.offer_id === offerId);
    return {
      totalViews: offerData.reduce((sum, a) => sum + a.views, 0),
      totalClicks: offerData.reduce((sum, a) => sum + a.clicks, 0),
      totalConversions: offerData.reduce((sum, a) => sum + a.conversions, 0),
      totalRevenue: offerData.reduce((sum, a) => sum + Number(a.revenue_generated), 0),
    };
  };

  const renderOfferTable = (offerList: LimitedTimeOffer[], showCountdown: boolean = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Discount</TableHead>
          {showCountdown && <TableHead>Time Left</TableHead>}
          <TableHead>Period</TableHead>
          <TableHead>Stats</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offerList.map((offer) => {
          const stats = getOfferAnalytics(offer.id);
          return (
            <TableRow key={offer.id}>
              <TableCell className="font-medium">{offer.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{offer.offer_type.replace('_', ' ')}</Badge>
              </TableCell>
              <TableCell>
                {offer.discount_type === 'percentage' && `${offer.discount_value}% Off`}
                {offer.discount_type === 'fixed' && `₹${offer.discount_value} Off`}
                {offer.discount_type === 'bogo' && 'Buy 1 Get 1'}
                {offer.discount_type === 'free_gift' && 'Free Gift'}
              </TableCell>
              {showCountdown && (
                <TableCell>
                  <CountdownTimer endDate={offer.end_date} />
                </TableCell>
              )}
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(offer.start_date), 'MMM d')} - {format(new Date(offer.end_date), 'MMM d')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingAnalytics(offer.id)}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  {stats.totalViews} views
                </Button>
              </TableCell>
              <TableCell>
                <Switch checked={offer.is_active} disabled />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingOffer({
                        ...offer,
                        start_date: offer.start_date.slice(0, 16),
                        end_date: offer.end_date.slice(0, 16),
                      });
                      setDialogOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(offer.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {offerList.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
              No offers found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Limited Time Offers</CardTitle>
          <CardDescription>Manage time-limited promotions with countdown timers and analytics</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOffer(defaultOffer as LimitedTimeOffer)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOffer?.id ? 'Edit Offer' : 'Create Offer'}</DialogTitle>
            </DialogHeader>
            
            {editingOffer && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Offer Type</Label>
                    <Select
                      value={editingOffer.offer_type}
                      onValueChange={(v) => setEditingOffer({ ...editingOffer, offer_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {offerTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Discount Type</Label>
                    <Select
                      value={editingOffer.discount_type}
                      onValueChange={(v) => setEditingOffer({ ...editingOffer, discount_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {discountTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={editingOffer.title}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    placeholder="Flash Sale - 50% Off!"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingOffer.description}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    placeholder="Describe your offer..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Discount Value</Label>
                    <Input
                      type="number"
                      value={editingOffer.discount_value || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, discount_value: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <Label>Promo Code (Optional)</Label>
                    <Input
                      value={editingOffer.code || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, code: e.target.value })}
                      placeholder="FLASH50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={editingOffer.start_date}
                      onChange={(e) => setEditingOffer({ ...editingOffer, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={editingOffer.end_date}
                      onChange={(e) => setEditingOffer({ ...editingOffer, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Order Amount</Label>
                    <Input
                      type="number"
                      value={editingOffer.min_order_amount || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, min_order_amount: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>Badge Text</Label>
                    <Input
                      value={editingOffer.badge_text || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, badge_text: e.target.value })}
                      placeholder="Limited Time!"
                    />
                  </div>
                </div>

                <div>
                  <Label>Banner Image URL</Label>
                  <Input
                    value={editingOffer.banner_image || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, banner_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label>Terms & Conditions</Label>
                  <Textarea
                    value={editingOffer.terms_conditions || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, terms_conditions: e.target.value })}
                    placeholder="Terms and conditions..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingOffer.is_active}
                      onCheckedChange={(v) => setEditingOffer({ ...editingOffer, is_active: v })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingOffer.is_featured}
                      onCheckedChange={(v) => setEditingOffer({ ...editingOffer, is_featured: v })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Offer
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Eye className="h-4 w-4" />
              Active ({activeOffers.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              <Clock className="h-4 w-4" />
              Upcoming ({upcomingOffers.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History ({expiredOffers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {renderOfferTable(activeOffers)}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            {renderOfferTable(upcomingOffers)}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {renderOfferTable(expiredOffers, false)}
          </TabsContent>
        </Tabs>

        {/* Analytics Dialog */}
        <Dialog open={!!viewingAnalytics} onOpenChange={() => setViewingAnalytics(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Offer Analytics</DialogTitle>
            </DialogHeader>
            {viewingAnalytics && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {(() => {
                  const stats = getOfferAnalytics(viewingAnalytics);
                  return (
                    <>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">{stats.totalViews}</p>
                          <p className="text-sm text-muted-foreground">Total Views</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">{stats.totalClicks}</p>
                          <p className="text-sm text-muted-foreground">Total Clicks</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">{stats.totalConversions}</p>
                          <p className="text-sm text-muted-foreground">Conversions</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                        </CardContent>
                      </Card>
                    </>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LimitedTimeOfferManagement;
