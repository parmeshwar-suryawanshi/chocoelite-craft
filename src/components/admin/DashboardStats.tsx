import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Package, Percent, ShoppingBag, DollarSign, Users, TrendingUp, Gift, Trophy } from 'lucide-react';
import { StatCardSkeleton } from '@/components/ui/section-skeleton';

interface DashboardStatsProps {
  onStatsLoaded?: () => void;
}

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalOffers: number;
  activeOffers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCustomers: number;
  comboOffers: number;
  festivalOffers: number;
  luckyWinners: number;
}

const DashboardStats = ({ onStatsLoaded }: DashboardStatsProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        productsRes,
        offersRes,
        ordersRes,
        profilesRes,
        comboRes,
        festivalRes,
        winnersRes,
      ] = await Promise.all([
        supabase.from('products').select('id, in_stock'),
        supabase.from('offers').select('id, is_active'),
        supabase.from('orders').select('id, total_amount, status, created_at'),
        supabase.from('profiles').select('id'),
        supabase.from('combo_offers').select('id, is_active'),
        supabase.from('festival_offers').select('id, is_active'),
        supabase.from('lucky_winners').select('id, is_active'),
      ]);

      const products = productsRes.data || [];
      const offers = offersRes.data || [];
      const orders = ordersRes.data || [];
      const profiles = profilesRes.data || [];
      const combos = comboRes.data || [];
      const festivals = festivalRes.data || [];
      const winners = winnersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const todayOrders = orders.filter(order => new Date(order.created_at) >= today);
      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.in_stock).length,
        totalOffers: offers.length,
        activeOffers: offers.filter(o => o.is_active).length,
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
        todayRevenue,
        totalCustomers: profiles.length,
        comboOffers: combos.filter(c => c.is_active).length,
        festivalOffers: festivals.filter(f => f.is_active).length,
        luckyWinners: winners.filter(w => w.is_active).length,
      });

      onStatsLoaded?.();
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} in stock`,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Offers',
      value: stats.activeOffers,
      subtitle: `${stats.totalOffers} total offers`,
      icon: Percent,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pending`,
      icon: ShoppingBag,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subtitle: `₹${stats.todayRevenue.toLocaleString()} today`,
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      subtitle: 'Registered users',
      icon: Users,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      title: 'Combo Offers',
      value: stats.comboOffers,
      subtitle: 'Active combos',
      icon: Gift,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Festival Offers',
      value: stats.festivalOffers,
      subtitle: 'Active festivals',
      icon: TrendingUp,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Lucky Winners',
      value: stats.luckyWinners,
      subtitle: 'Featured winners',
      icon: Trophy,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
