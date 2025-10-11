const Gallery = () => {
  const galleryImages = [
    {
      url: "https://fpimages.withfloats.com/actual/67a08943207b407e61ab2d1c.png",
      alt: "ChocoElite premium chocolates display",
    },
    {
      url: "https://fpimages.withfloats.com/actual/67a08942207b407e61ab2d1a.png",
      alt: "Artisan chocolate making process",
    },
    {
      url: "https://fpimages.withfloats.com/actual/67a08941207b407e61ab2d18.png",
      alt: "Fresh fruit chocolate assortment",
    },
    {
      url: "https://fpimages.withfloats.com/actual/67a08944207b407e61ab2d21.png",
      alt: "Luxurious chocolate packaging",
    },
    {
      url: "https://fpimages.withfloats.com/actual/67a08944207b407e61ab2d1f.png",
      alt: "Handcrafted chocolate creations",
    },
    {
      url: "https://fpimages.withfloats.com/actual/67a08943207b407e61ab2d1d.png",
      alt: "Premium chocolate gift boxes",
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient">
            Gallery
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the artistry and craftsmanship behind our delightful chocolate creations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift bg-muted/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] flex items-center justify-center p-4">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
