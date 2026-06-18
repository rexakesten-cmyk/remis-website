export default function Products() {
  const products = [
    {
      name: "Cattle Blend",
      description: "Comprehensive nutrition for beef and dairy cattle. Formulated to support growth, milk production, and overall herd health. Non-GMO, properly balanced for small to mid-size operations.",
      type: "Bagged & Bulk"
    },
    {
      name: "Poultry Pellets",
      description: "Specialized feed for chickens, turkeys, and other poultry. Designed to optimize egg production, meat quality, and consistent bird health. Great for backyard operations and small farms.",
      type: "Bagged & Bulk"
    },
    {
      name: "Equine Mix",
      description: "Balanced nutrition for horses and ponies. Supports bone health, energy levels, and overall performance. Perfect for riding operations, hobby farms, and small stables.",
      type: "Bagged & Bulk"
    },
    {
      name: "Sheep & Goat Blend",
      description: "Targeted formulation for small ruminants. Meets nutritional demands for meat and dairy production. Supports healthy growth and consistent productivity.",
      type: "Bagged & Bulk"
    },
    {
      name: "Swine Supplement",
      description: "Custom supplement designed to enhance growth rates and meat quality for pig operations. Supports efficient feed conversion and animal health.",
      type: "Bagged & Bulk"
    },
    {
      name: "Custom Mixes",
      description: "We'll work directly with your operation to create a feed blend tailored to your specific animals, goals, and budget. Tell us what you're raising and what you need.",
      type: "Bulk"
    },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)]">
      <main className="page-flow mx-auto w-full max-w-[90rem] px-5 md:px-10">
        {/* Header */}
        <header className="py-6 md:py-8">
          <div className="flex items-center justify-between">
            <a href="/" aria-label="Kesten Feed Co home" className="inline-flex items-center">
              <img src="/main-logo.png" alt="Kesten Feed Co" className="h-12 md:h-14 w-auto" />
            </a>
            <nav className="flex gap-6 md:gap-8">
              <a href="/" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">Home</a>
              <a href="/products" className="text-sm font-semibold text-[var(--bronze)] border-b-2 border-[var(--bronze)]">Products</a>
              <a href="/order-feed" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">Order</a>
              <a href="/about" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">About</a>
              <a href="/contact" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Page Intro */}
        <section className="relative overflow-hidden -mx-5 md:-mx-10 px-5 md:px-10 py-12 md:py-16 rounded-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/products-chicks.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/42" aria-hidden="true" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Our Feed Products</h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Carefully formulated, non-GMO feed designed for the animals and operations we serve. Choose bagged pickup or bulk delivery, or tell us what you need and we'll create a custom mix.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="border border-[var(--ink-soft)] rounded p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-[var(--ink)]">{product.name}</h3>
                  <span className="text-xs font-semibold text-[var(--bronze)] bg-[var(--lace)] px-2 py-1 rounded">
                    {product.type}
                  </span>
                </div>
                <p className="text-[var(--ink-muted)] leading-relaxed">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ordering Info */}
        <section className="py-12 md:py-16 bg-[var(--lace)] -mx-5 md:-mx-10 px-5 md:px-10 rounded">
          <h2 className="text-3xl font-bold mb-8 text-[var(--ink)]">How to Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--bronze)]">Bagged Pickup</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                Choose from our pre-bagged options or specify your own quantities. Pick up on your schedule from our location in Marshall, Missouri.
              </p>
              <a
                href="/order-feed"
                className="inline-block px-6 py-2 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
              >
                Order Bagged Feed
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--bronze)]">Bulk Delivery</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                For larger quantities, we deliver directly to your farm. Just tell us what you need and when.
              </p>
              <a
                href="/order-feed"
                className="inline-block px-6 py-2 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
              >
                Order Bulk Feed
              </a>
            </div>
          </div>
        </section>

        {/* Custom Blend Section */}
        <section className="py-12 md:py-16">
          <div className="border border-[var(--ink-soft)] rounded p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-[var(--ink)]">Not Sure What You Need?</h3>
            <p className="text-[var(--ink-muted)] mb-6 max-w-2xl mx-auto">
              We work directly with your operation to understand your animals and goals. Tell us what you're raising and what you need, and we'll create a custom blend.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 border-2 border-[var(--bronze)] text-[var(--bronze)] font-bold text-sm uppercase tracking-wide rounded hover:bg-[var(--lace)] transition-colors"
            >
              Request a Custom Blend
            </a>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[var(--ink)]">Ready to Get Started?</h2>
          <a
            href="/order-feed"
            className="inline-block px-8 py-3 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
          >
            Place Your Order
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--ink)] text-white mt-16">
        <div className="mx-auto w-full max-w-[90rem] px-5 md:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3">Kesten Feed Co</h4>
              <p className="text-blue-200 text-sm">High-quality non-GMO feed for Missouri farms and homesteaders.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Contact</h4>
              <p className="text-blue-200 text-sm">Phone: 660-971-0060</p>
              <p className="text-blue-200 text-sm">Email: remi@kestenfeed.co</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Location</h4>
              <p className="text-blue-200 text-sm">16298 Norway Ave<br />Marshall, MO 65340</p>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8 text-center text-blue-200 text-sm">
            <p>&copy; 2024 Kesten Feed Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
