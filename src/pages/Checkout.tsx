import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, MessageCircle, Copy, Check } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [trackingToken, setTrackingToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to checkout' });
      navigate('/auth');
    }
  }, [user, navigate]);

  const shipping = totalPrice >= 1000 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  const generateWhatsAppData = (orderId: string, trackingCode: string) => {
    const phoneNumber = '919130032225';
    
    const itemsList = items.map(item => 
      `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');
    
    const message = `🍫 *New Order from ChocoElite*

📋 *Order ID:* ${orderId.substring(0, 8)}
🔗 *Tracking Code:* ${trackingCode}

👤 *Customer Details:*
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

📍 *Shipping Address:*
${formData.address}
${formData.city}, ${formData.state} - ${formData.pincode}

🛒 *Order Items:*
${itemsList}

💰 *Order Summary:*
Subtotal: ₹${totalPrice}
Shipping: ${shipping === 0 ? 'FREE' : `₹${shipping}`}
*Total: ₹${finalTotal}*

💳 *Payment:* Cash on Delivery`;

    const encodedMessage = encodeURIComponent(message);
    return {
      url: `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      message
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate city is Mumbai or Pune
    const allowedCities = ['mumbai', 'pune'];
    if (!allowedCities.includes(formData.city.toLowerCase().trim())) {
      toast({
        title: 'Delivery Not Available',
        description: 'We currently deliver only in Mumbai and Pune.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);

    try {
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: finalTotal,
          shipping_address: shippingAddress,
          payment_method: 'cod',
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Generate WhatsApp URL and show success modal
      const { url, message } = generateWhatsAppData(order.id, order.tracking_token);
      setWhatsappUrl(url);
      setWhatsappMessage(message);
      setTrackingToken(order.tracking_token);

      await clearCart();
      setOrderSuccess(true);
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      toast({ title: 'Copied!', description: 'Message copied. Send it to +91 9130032225 on WhatsApp.' });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({ title: 'Copy failed', description: 'Please manually copy the message.', variant: 'destructive' });
    }
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    setCopied(false);
    navigate('/profile');
  };

  if (items.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <SEO title="Checkout | ChocoElite" />
      <Navbar />
      <div className="min-h-screen pt-24 pb-20 bg-luxury-cream">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-gradient-luxury">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City * (Mumbai or Pune only)</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          placeholder="Mumbai or Pune"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            required
                            value={formData.pincode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-amber-50 border-amber-200">
                      <div className="w-4 h-4 rounded-full bg-amber-600 border-4 border-amber-200"></div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-semibold">
                          {shipping === 0 ? 'FREE' : `₹${shipping}`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-luxury-brown">₹{finalTotal}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-6 gradient-luxury text-white"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      By placing your order, you agree to our terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {/* Order Success Modal */}
      <Dialog open={orderSuccess} onOpenChange={handleCloseSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Your order has been placed. Please send the order details to our team via WhatsApp for confirmation.
            </DialogDescription>
          </DialogHeader>
          
          {/* Tracking Code Display */}
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="text-sm text-muted-foreground mb-1">Your Tracking Code</p>
            <p className="text-lg font-mono font-bold text-primary">{trackingToken}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Save this code to track your order at /track-order
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Send Order on WhatsApp
            </a>
            <Button
              variant="secondary"
              onClick={handleCopyMessage}
              className="flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Message (Fallback)'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              If the button doesn't work, copy the message and send to +91 9130032225
            </p>
            <Button variant="outline" onClick={handleCloseSuccess}>
              View My Orders
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Checkout;
