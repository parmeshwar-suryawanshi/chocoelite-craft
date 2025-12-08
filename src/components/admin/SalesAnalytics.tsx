import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, ShoppingCart, IndianRupee, Package, MessageCircle, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

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

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const pendingOrders = orders?.filter((o) => o.status === 'pending').length || 0;
      const completedOrders = orders?.filter((o) => o.delivery_status === 'delivered').length || 0;

      // Order source breakdown
      const appOrdersList = orders?.filter((o) => o.order_source === 'app' || !o.order_source) || [];
      const whatsappOrdersList = orders?.filter((o) => o.order_source === 'whatsapp') || [];
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
        
        const dayOrders = orders?.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= dayStart && orderDate <= dayEnd;
        }) || [];

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
      orders?.forEach((order) => {
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
        recentOrders: orders?.slice(0, 5) || [],
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
    </div>
  );
};

export default SalesAnalytics;
