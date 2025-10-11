import { useState } from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: 'Message Sent! 📧',
        description: 'Thank you for contacting us. We\'ll get back to you soon.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      detail: '+91 8042781962',
      link: 'tel:+918042781962',
    },
    {
      icon: Mail,
      title: 'Email',
      detail: 'yash_agrodairyfoodpark@rediffmail.com',
      link: 'mailto:yash_agrodairyfoodpark@rediffmail.com',
    },
    {
      icon: MapPin,
      title: 'Location',
      detail: 'Pune, Maharashtra, India',
      link: 'https://maps.google.com/?q=Pune,Maharashtra',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      detail: 'Mon-Sat: 9:00 AM - 6:00 PM',
      link: null,
    },
  ];

  return (
    <>
      <SEO
        title="Contact Us | ChocoElite"
        description="Get in touch with ChocoElite for bulk orders, corporate gifting, or any questions about our premium chocolates. We're here to help!"
        keywords="contact chocoelite, bulk chocolate order, corporate gifting, chocolate inquiry"
        url="https://chocoelite.lovable.app/contact"
      />
      <Navbar />
      <div className="min-h-screen pt-24 pb-20">
        {/* Hero Section */}
        <section className="py-20 gradient-luxury text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Have questions about our products or want to place a bulk order? We'd love to hear from you!
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-12">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="hover-lift shadow-lg border-none"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full gradient-luxury mb-4">
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-muted-foreground hover:text-luxury-brown transition-colors"
                      target={info.title === 'Location' ? '_blank' : undefined}
                      rel={info.title === 'Location' ? 'noopener noreferrer' : undefined}
                    >
                      {info.detail}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{info.detail}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-luxury text-white"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Visit Our Factory</h2>
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=800&h=400&fit=crop"
                  alt="ChocoElite Factory"
                  className="w-full h-full object-cover"
                />
              </div>
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Corporate Gifting & Bulk Orders</h3>
                  <p className="text-muted-foreground mb-4">
                    Looking for corporate gifts or bulk orders? We offer:
                  </p>
                  <ul className="space-y-2 text-muted-foreground mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold mt-1">✓</span>
                      <span>Custom packaging and branding options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold mt-1">✓</span>
                      <span>Volume discounts for bulk orders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold mt-1">✓</span>
                      <span>Personalized gift messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold mt-1">✓</span>
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                  <Button
                    asChild
                    size="lg"
                    className="w-full gradient-luxury text-white"
                  >
                    <a href="tel:+918042781962">Call for Quote</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
