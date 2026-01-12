import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, Percent, ShoppingBag, BarChart3, MessageCircle, Image, Video, Gift, PartyPopper, Trophy, LayoutGrid, Sparkles, Users, Clock, Heart, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SalesAnalytics from '@/components/admin/SalesAnalytics';
import DashboardStats from '@/components/admin/DashboardStats';
import WhatsAppOrderManagement from '@/components/admin/WhatsAppOrderManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import OfferManagement from '@/components/admin/OfferManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';
import VideoManagement from '@/components/admin/VideoManagement';
import ComboOfferManagement from '@/components/admin/ComboOfferManagement';
import FestivalOfferManagement from '@/components/admin/FestivalOfferManagement';
import LuckyWinnerManagement from '@/components/admin/LuckyWinnerManagement';
import SectionManagement from '@/components/admin/SectionManagement';
import HeroManagement from '@/components/admin/HeroManagement';
import TestimonialManagement from '@/components/admin/TestimonialManagement';
import AboutContentManagement from '@/components/admin/AboutContentManagement';
import LoyaltyManagement from '@/components/admin/LoyaltyManagement';
import LimitedTimeOfferManagement from '@/components/admin/LimitedTimeOfferManagement';

interface Product {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  price: number;
  in_stock: boolean;
  category: string;
  type: string;
  image: string;
  featured?: boolean;
  bestseller?: boolean;
  limited_edition?: boolean;
  bulk_packs?: unknown;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  code: string;
  is_active: boolean;
  min_order_amount?: number;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  delivery_status: string;
  user_id: string;
}

interface GalleryImage {
  id: string;
  title: string;
  alt_text: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string;
  video_url: string;
  video_type: string;
  duration: string | null;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
}

interface ComboOffer {
  id: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  image_url: string | null;
  product_ids: unknown;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  display_order: number;
}

interface FestivalOffer {
  id: string;
  title: string;
  description: string;
  festival_name: string;
  banner_image: string | null;
  discount_type: string;
  discount_value: number | null;
  code: string | null;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  terms_conditions: string | null;
}

interface LuckyWinner {
  id: string;
  winner_name: string;
  winner_email: string | null;
  winner_phone: string | null;
  prize_description: string;
  prize_image: string | null;
  draw_date: string;
  campaign_name: string;
  winner_image: string | null;
  testimonial: string | null;
  is_featured: boolean;
  is_active: boolean;
}

interface SiteSection {
  id: string;
  section_key: string;
  section_name: string;
  is_visible: boolean;
  display_order: number;
  description: string | null;
}

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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>([]);
  const [festivalOffers, setFestivalOffers] = useState<FestivalOffer[]>([]);
  const [luckyWinners, setLuckyWinners] = useState<LuckyWinner[]>([]);
  const [siteSections, setSiteSections] = useState<SiteSection[]>([]);
  const [heroContents, setHeroContents] = useState<HeroContent[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await fetchData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const [
      productsRes, 
      offersRes, 
      ordersRes, 
      galleryRes, 
      videosRes, 
      comboRes, 
      festivalRes, 
      winnersRes,
      sectionsRes,
      heroRes
    ] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('offers').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery_images').select('*').order('display_order', { ascending: true }),
      supabase.from('videos').select('*').order('display_order', { ascending: true }),
      supabase.from('combo_offers').select('*').order('display_order', { ascending: true }),
      supabase.from('festival_offers').select('*').order('created_at', { ascending: false }),
      supabase.from('lucky_winners').select('*').order('draw_date', { ascending: false }),
      supabase.from('site_sections').select('*').order('display_order', { ascending: true }),
      supabase.from('hero_content').select('*').order('display_order', { ascending: true }),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (offersRes.data) setOffers(offersRes.data);
    if (ordersRes.data) setOrders(ordersRes.data);
    if (galleryRes.data) setGalleryImages(galleryRes.data);
    if (videosRes.data) setVideos(videosRes.data);
    if (comboRes.data) setComboOffers(comboRes.data);
    if (festivalRes.data) setFestivalOffers(festivalRes.data);
    if (winnersRes.data) setLuckyWinners(winnersRes.data);
    if (sectionsRes.data) setSiteSections(sectionsRes.data);
    if (heroRes.data) setHeroContents(heroRes.data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete content management system with AI assistance</p>
        </div>

        <DashboardStats />

        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto mb-8">
            <TabsTrigger value="sections" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Sections</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              <Percent className="h-4 w-4" />
              <span className="hidden sm:inline">Offers</span>
            </TabsTrigger>
            <TabsTrigger value="combos" className="gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Combos</span>
            </TabsTrigger>
            <TabsTrigger value="festivals" className="gap-2">
              <PartyPopper className="h-4 w-4" />
              <span className="hidden sm:inline">Festivals</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="winners" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Winners</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </TabsTrigger>
          </TabsList>

          {/* Sections Tab */}
          <TabsContent value="sections">
            <SectionManagement sections={siteSections} onRefresh={fetchData} />
          </TabsContent>

          {/* Hero Tab */}
          <TabsContent value="hero">
            <HeroManagement heroContents={heroContents} onRefresh={fetchData} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManagement products={products} onRefresh={fetchData} />
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers">
            <OfferManagement offers={offers} onRefresh={fetchData} />
          </TabsContent>

          {/* Combo Offers Tab */}
          <TabsContent value="combos">
            <ComboOfferManagement combos={comboOffers} onRefresh={fetchData} />
          </TabsContent>

          {/* Festival Offers Tab */}
          <TabsContent value="festivals">
            <FestivalOfferManagement festivals={festivalOffers} onRefresh={fetchData} />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <GalleryManagement images={galleryImages} onRefresh={fetchData} />
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <VideoManagement videos={videos} onRefresh={fetchData} />
          </TabsContent>

          {/* Lucky Winners Tab */}
          <TabsContent value="winners">
            <LuckyWinnerManagement winners={luckyWinners} onRefresh={fetchData} />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrderManagement orders={orders} onRefresh={fetchData} />
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp">
            <WhatsAppOrderManagement />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
