export default function Home() {
  return (
    <div className="min-h-screen text-[var(--ink)]">
      <main className="page-flow mx-auto w-full max-w-[90rem] px-5 md:px-10">
        {/* Header and Hero with Top Background */}
        <section className="relative overflow-hidden -mx-5 md:-mx-10 px-5 md:px-10 rounded-b-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-cows.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

          <div className="relative z-10">
            {/* Header with Navigation */}
            <header className="py-6 md:py-8">
              <div className="flex items-center justify-between">
                <a href="/" aria-label="Kesten Feed Co home" className="inline-flex items-center">
                  <img src="/main-logo.png" alt="Kesten Feed Co" className="h-12 md:h-14 w-auto" />
                </a>
                <nav className="flex gap-6 md:gap-8">
                  <a href="/" className="text-sm font-semibold text-white/95 hover:text-[var(--bronze)] transition-colors">Home</a>
                  <a href="/products" className="text-sm font-semibold text-white/95 hover:text-[var(--bronze)] transition-colors">Products</a>
                  <a href="/order-feed" className="text-sm font-semibold text-white/95 hover:text-[var(--bronze)] transition-colors">Order</a>
                  <a href="/about" className="text-sm font-semibold text-white/95 hover:text-[var(--bronze)] transition-colors">About</a>
                  <a href="/contact" className="text-sm font-semibold text-white/95 hover:text-[var(--bronze)] transition-colors">Contact</a>
                </nav>
              </div>
            </header>

            {/* Hero Section */}
            <section className="py-12 md:py-20">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[var(--bronze)]">Trusted Feed for Missouri Farms</p>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-4 text-white">
                    Feed you can trust for your farm.
                  </h1>
                </div>
                <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
                  High-quality non-GMO feed for small farms and homesteaders, with bagged pickup and bulk delivery options that make sense for your operation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="/order-feed"
                    className="inline-block px-6 py-3 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
                  >
                    Order Feed
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-block px-6 py-3 border-2 border-white text-white font-bold text-sm uppercase tracking-wide rounded hover:bg-white/10 transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Credibility Section */}
        <section className="py-12 md:py-16 border-y border-[var(--ink-soft)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[var(--bronze)]">Local</p>
              <p className="text-[var(--ink-muted)] mt-2">Serving small farms and homesteaders throughout Missouri with reliable feed and honest service.</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[var(--bronze)]">Transparent</p>
              <p className="text-[var(--ink-muted)] mt-2">Non-GMO, quality-focused blends sourced and mixed with care for your animals' health.</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[var(--bronze)]">Practical</p>
              <p className="text-[var(--ink-muted)] mt-2">Whether you need eight bags or eight tons, we offer flexible ordering and delivery that works for you.</p>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[var(--ink)]">The Frustration</h2>
          <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-2xl">
            Small farm owners and homesteaders know the struggle:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-[var(--bronze)] flex-shrink-0">•</div>
              <p className="text-[var(--ink-muted)]">Feed is too expensive at big-box retailers.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-[var(--bronze)] flex-shrink-0">•</div>
              <p className="text-[var(--ink-muted)]">The nearest quality supplier is too far away.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-[var(--bronze)] flex-shrink-0">•</div>
              <p className="text-[var(--ink-muted)]">Shipping costs eat up your savings.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-[var(--bronze)] flex-shrink-0">•</div>
              <p className="text-[var(--ink-muted)]">Local options don't carry what your animals need.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-[var(--bronze)] flex-shrink-0">•</div>
              <p className="text-[var(--ink-muted)]">Your animals aren't thriving on available feeds.</p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="how-it-works" className="py-12 md:py-16 bg-[var(--lace)] -mx-5 md:-mx-10 px-5 md:px-10 rounded">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--ink)]">Our Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--bronze)]">Bagged Pickup</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                No shipping. No middleman markup. Pick up pre-bagged feed on your schedule from our location in Marshall, Missouri. Perfect for smaller operations that need consistent supply without the hassle.
              </p>
              <ul className="mt-4 space-y-2 text-[var(--ink-muted)]">
                <li className="flex gap-2">
                  <span className="text-[var(--bronze)] font-bold">➔</span>
                  <span>Convenient pickup times</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--bronze)] font-bold">➔</span>
                  <span>No shipping cost</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--bronze)] font-bold">➔</span>
                  <span>Exact quantities you need</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--bronze)]">Bulk Delivery</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                Need a larger quantity? We deliver bulk feed directly to your farm. One trip to your property, one invoice, and your feed is where you need it. Affordable and efficient for growing operations.
              </p>
              <ul className="mt-4 space-y-2 text-[var(--ink-muted)]">
                <li className="flex gap-2">
                  <span className="text-[var(--bronze)] font-bold">➔</span>
                  <span>Delivered to your farm</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--bronze)] font-bold">➔</span>
                  <span>Better pricing per unit</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--bronze)] font-bold">➔</span>
                  <span>Flexible order timing</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feed Options Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--ink)]">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[var(--ink-soft)] rounded p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-3">Bagged Feed</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                Pre-packaged, ready to pick up. Ideal for small farms, backyard poultry, and operations that prefer consistent bag sizes.
              </p>
              <a href="/products" className="text-[var(--bronze)] font-semibold hover:underline">View bagged options →</a>
            </div>
            <div className="border border-[var(--ink-soft)] rounded p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-3">Bulk Feed</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                Large quantities delivered to your farm. Cost-effective for cattle, equine, and larger livestock operations.
              </p>
              <a href="/products" className="text-[var(--bronze)] font-semibold hover:underline">View bulk options →</a>
            </div>
            <div className="border border-[var(--ink-soft)] rounded p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-3">Custom Mixes</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                Not sure what your operation needs? We work with you to create a blend tailored to your animals and goals.
              </p>
              <a href="/contact" className="text-[var(--bronze)] font-semibold hover:underline">Request a custom blend →</a>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-16 bg-[var(--primary)]  -mx-5 md:-mx-10 px-5 md:px-10 text-white rounded">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Kesten Feed Co</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Quality You Can Trust</h3>
              <p className="text-blue-100">Non-GMO, freshly mixed, and formulated for the animals you're raising. No shortcuts.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Real Relationships</h3>
              <p className="text-blue-100">We're not a corporate call center. Remi knows the challenges of small-farm feeding. You'll get straightforward advice.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Local Support</h3>
              <p className="text-blue-100">Based in Marshall, Missouri. Close to you. Quick to respond. Invested in your farm's success.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Flexible Options</h3>
              <p className="text-blue-100">Whether you need eight bags or eight tons, we scale to your needs without pressure or minimum orders.</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--ink)]">Ready to Order?</h2>
            <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-2xl mx-auto">
              Choose bagged pickup or bulk delivery, place your order, and let us help your farm thrive with feed you can trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/order-feed"
                className="px-8 py-3 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
              >
                Place Your Order
              </a>
              <a
                href="/contact"
                className="px-8 py-3 border-2 border-[var(--bronze)] text-[var(--bronze)] font-bold text-sm uppercase tracking-wide rounded hover:bg-[var(--lace)] transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
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
