import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, ShoppingCart, IndianRupee, Package, MessageCircle, Smartphone, Eye, MousePointer, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrderWithItems {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  delivery_status: string;
  order_source: string;
  customer_name: string | null;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  appOrders: number;
  whatsappOrders: number;
  appRevenue: number;
  whatsappRevenue: number;
  dailyRevenue: { date: string; revenue: number; orders: number; appOrders: number; whatsappOrders: number }[];
  statusBreakdown: { name: string; value: number }[];
  sourceBreakdown: { name: string; value: number; revenue: number }[];
  recentOrders: OrderWithItems[];
  offerAnalytics: { 
    offer_id: string; 
    title: string;
    views: number; 
    clicks: number; 
    conversions: number; 
    revenue: number;
    ctr: number;
  }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const thirtyDaysAgo = subDays(new Date(), 30);

      const [ordersRes, offerAnalyticsRes, offersRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false }),
        supabase
          .from('offer_analytics')
          .select('*')
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0]),
        supabase
          .from('limited_time_offers')
          .select('id, title')
      ]);

      const orders = ordersRes.data || [];
      const offerAnalyticsData = offerAnalyticsRes.data || [];
      const offers = offersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const pendingOrders = orders.filter((o) => o.status === 'pending').length;
      const completedOrders = orders.filter((o) => o.delivery_status === 'delivered').length;

      // Order source breakdown
      const appOrdersList = orders.filter((o) => o.order_source === 'app' || !o.order_source);
      const whatsappOrdersList = orders.filter((o) => o.order_source === 'whatsapp');
      const appOrders = appOrdersList.length;
      const whatsappOrders = whatsappOrdersList.length;
      const appRevenue = appOrdersList.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const whatsappRevenue = whatsappOrdersList.reduce((sum, order) => sum + Number(order.total_amount), 0);

      // Calculate daily revenue for the last 7 days
      const dailyRevenue: { date: string; revenue: number; orders: number; appOrders: number; whatsappOrders: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        const dayOrders = orders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= dayStart && orderDate <= dayEnd;
        });

        const dayAppOrders = dayOrders.filter((o) => o.order_source === 'app' || !o.order_source);
        const dayWhatsappOrders = dayOrders.filter((o) => o.order_source === 'whatsapp');

        dailyRevenue.push({
          date: format(date, 'MMM dd'),
          revenue: dayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
          orders: dayOrders.length,
          appOrders: dayAppOrders.length,
          whatsappOrders: dayWhatsappOrders.length,
        });
      }

      // Status breakdown
      const statusCounts: Record<string, number> = {};
      orders.forEach((order) => {
        statusCounts[order.delivery_status] = (statusCounts[order.delivery_status] || 0) + 1;
      });
      const statusBreakdown = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

      // Source breakdown
      const sourceBreakdown = [
        { name: 'App Orders', value: appOrders, revenue: appRevenue },
        { name: 'WhatsApp Orders', value: whatsappOrders, revenue: whatsappRevenue },
      ];

      // Offer analytics aggregation
      const offerAnalyticsMap = new Map<string, { views: number; clicks: number; conversions: number; revenue: number }>();
      offerAnalyticsData.forEach((a) => {
        const existing = offerAnalyticsMap.get(a.offer_id) || { views: 0, clicks: 0, conversions: 0, revenue: 0 };
        offerAnalyticsMap.set(a.offer_id, {
          views: existing.views + (a.views || 0),
          clicks: existing.clicks + (a.clicks || 0),
          conversions: existing.conversions + (a.conversions || 0),
          revenue: existing.revenue + Number(a.revenue_generated || 0),
        });
      });

      const offerAnalyticsList = offers.map((offer) => {
        const stats = offerAnalyticsMap.get(offer.id) || { views: 0, clicks: 0, conversions: 0, revenue: 0 };
        return {
          offer_id: offer.id,
          title: offer.title,
          views: stats.views,
          clicks: stats.clicks,
          conversions: stats.conversions,
          revenue: stats.revenue,
          ctr: stats.views > 0 ? (stats.clicks / stats.views) * 100 : 0,
        };
      }).filter(o => o.views > 0 || o.clicks > 0 || o.conversions > 0);

      setAnalytics({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        pendingOrders,
        completedOrders,
        appOrders,
        whatsappOrders,
        appRevenue,
        whatsappRevenue,
        dailyRevenue,
        statusBreakdown,
        sourceBreakdown,
        recentOrders: orders.slice(0, 5),
        offerAnalytics: offerAnalyticsList,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load analytics data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.totalOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">App Orders</p>
                <p className="text-2xl font-bold">{analytics.appOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">₹{analytics.appRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp Orders</p>
                <p className="text-2xl font-bold">{analytics.whatsappOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">₹{analytics.whatsappRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">₹{analytics.averageOrderValue.toFixed(0)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Per order</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{analytics.pendingOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Requires action</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Source Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Source</CardTitle>
            <CardDescription>App vs WhatsApp orders comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.sourceBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Revenue distribution by order source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics.sourceBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.sourceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="revenue"
                      label={({ name, percent }) => `${name.replace(' Orders', '')} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="hsl(220, 70%, 50%)" />
                      <Cell fill="hsl(142, 70%, 45%)" />
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No order data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `₹${value}`} />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics.statusBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.statusBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No order data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders per Day */}
      <Card>
        <CardHeader>
          <CardTitle>Orders per Day</CardTitle>
          <CardDescription>Number of orders placed each day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentOrders.length > 0 ? (
              analytics.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      order.order_source === 'whatsapp' ? 'bg-green-500/10' : 'bg-blue-500/10'
                    }`}>
                      {order.order_source === 'whatsapp' ? (
                        <MessageCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Smartphone className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {order.customer_name || order.id.slice(0, 8) + '...'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{Number(order.total_amount).toLocaleString()}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <Badge variant="outline" className="text-xs">
                        {order.order_source === 'whatsapp' ? 'WhatsApp' : 'App'}
                      </Badge>
                      <Badge variant={order.delivery_status === 'delivered' ? 'default' : 'secondary'}>
                        {order.delivery_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No recent orders</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offer Performance Analytics */}
      {analytics.offerAnalytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Offer Performance
            </CardTitle>
            <CardDescription>Views, clicks, and conversions for limited time offers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4" />
                      Views
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MousePointer className="h-4 w-4" />
                      Clicks
                    </div>
                  </TableHead>
                  <TableHead className="text-center">CTR</TableHead>
                  <TableHead className="text-center">Conversions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.offerAnalytics.map((offer) => (
                  <TableRow key={offer.offer_id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {offer.title}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{offer.views.toLocaleString()}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{offer.clicks.toLocaleString()}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={offer.ctr > 5 ? 'default' : 'outline'}>
                        {offer.ctr.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="bg-green-500">
                        {offer.conversions}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{offer.revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesAnalytics;
