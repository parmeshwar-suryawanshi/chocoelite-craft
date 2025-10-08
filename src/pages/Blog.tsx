import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';

const Blog = () => {
  return (
    <>
      <SEO
        title="Blog - Chocolate Insights & Recipes | ChocoElite"
        description="Discover chocolate insights, health benefits, pairing guides, and behind-the-scenes stories from ChocoElite. Learn everything about premium chocolate."
        keywords="chocolate blog, chocolate recipes, dark chocolate benefits, chocolate pairing, chocolate making process"
        url="https://chocoelite.lovable.app/blog"
      />

      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-gradient-luxury">
              Chocolate Insights
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore the world of premium chocolate through our stories, guides, and behind-the-scenes content
            </p>
          </div>

          {/* Featured Post */}
          <Card className="mb-16 overflow-hidden shadow-2xl border-none">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 gradient-luxury text-white">
                  Featured
                </Badge>
              </div>
              <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                <Badge className="w-fit mb-4">{blogPosts[0].category}</Badge>
                <h2 className="text-3xl font-display font-bold mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(blogPosts[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <Link to={`/blog/${blogPosts[0].slug}`}>
                  <Button className="gradient-luxury text-white">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card
                  className="group overflow-hidden hover-lift border-none shadow-lg h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute top-4 right-4 gradient-luxury text-white">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-luxury-brown transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 gradient-luxury rounded-2xl p-8 md:p-12 text-white text-center shadow-glow">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Never Miss a Story
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest chocolate insights, exclusive recipes, and special offers
            </p>
            <Button size="lg" className="bg-white text-luxury-brown hover:bg-white/90 font-semibold">
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
