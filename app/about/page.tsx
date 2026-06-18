export default function About() {
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
              <a href="/products" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">Products</a>
              <a href="/order-feed" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">Order</a>
              <a href="/about" className="text-sm font-semibold text-[var(--bronze)] border-b-2 border-[var(--bronze)]">About</a>
              <a href="/contact" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Page Intro */}
        <section className="relative overflow-hidden -mx-5 md:-mx-10 px-5 md:px-10 py-12 md:py-16 rounded-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/about-ducks.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">About Kesten Feed Co</h1>
            <p className="text-lg text-white/90 max-w-2xl">
              We exist to make it easier for small farms and homesteaders to get dependable feed without the usual frustration.
            </p>
          </div>
        </section>

        {/* Why We Started */}
        <section className="py-12 md:py-16 border-b border-[var(--ink-soft)]">
          <h2 className="text-3xl font-bold mb-6 text-[var(--ink)]">Why Kesten Feed Co Exists</h2>
          <div className="space-y-6 text-[var(--ink-muted)] leading-relaxed">
            <p>
              Remi started Kesten Feed Co because he saw a real problem: small farm owners and homesteaders in Missouri were getting squeezed. They'd pay too much at big retailers, drive too far to get quality feed, or end up with animals that didn't thrive on the limited options available locally.
            </p>
            <p>
              The feed business is typically built around big operations with big orders. But there's a whole community of small farms—backyard poultry keepers, hobby ranchers, small dairy operations—who just need quality feed at a fair price delivered without hassle. That's where we fit.
            </p>
            <p>
              Kesten Feed Co is built on a simple idea: small farms deserve straightforward, honest service from someone who understands what they actually need.
            </p>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl font-bold mb-8 text-[var(--ink)]">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--bronze)]">Quality First</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                Non-GMO ingredients, carefully mixed, formulated for the animals you're raising. We don't cut corners on what goes into our feeds because we know your animals deserve better.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--bronze)]">Local & Transparent</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                We're based in Marshall, Missouri. You know who you're buying from. No corporate layers between you and the person making your feed.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--bronze)]">Practical Service</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                Whether you need eight bags picked up or eight tons delivered, we work with your schedule and your operation's size. No pressure to buy more than you need.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--bronze)]">Real Relationships</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                We're not a call center. Remi takes orders, answers questions, and builds relationships with customers because we care about your farm's success.
              </p>
            </div>
          </div>
        </section>

        {/* Sourcing & Values */}
        <section className="py-12 md:py-16 bg-[var(--primary)] -mx-5 md:-mx-10 px-5 md:px-10 rounded text-white">
          <h2 className="text-3xl font-bold mb-8">What We Stand For</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3 text-blue-100">Non-GMO Sourcing</h3>
              <p className="text-blue-200">
                We source non-GMO ingredients because they matter. Your animals eat what you feed them, and we care about what that means for their health and your operation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-blue-100">Small Farm Advocacy</h3>
              <p className="text-blue-200">
                We believe small farms are important. They feed families, they're good stewards of the land, and they deserve to thrive without getting crushed by corporate pricing and logistics.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-blue-100">Honest Business</h3>
              <p className="text-blue-200">
                Straightforward pricing, no hidden fees or pressure tactics. We tell you what things cost and why. That's how we want to build relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Remi's Story */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl font-bold mb-8 text-[var(--ink)]">About Remi</h2>
          <p className="text-lg text-[var(--ink-muted)] leading-relaxed">
            Remi knows the challenges of small farming firsthand. He understands the frustration of searching for feed, the sting of bad pricing, and the importance of animals doing well. That's why Kesten Feed Co exists—not as just another feed supplier, but as a partner who gets it.
          </p>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[var(--ink)]">Ready to Work Together?</h2>
          <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-2xl mx-auto">
            Let's talk about your farm and how Kesten Feed Co can help support it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/order-feed"
              className="px-8 py-3 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
            >
              Place an Order
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border-2 border-[var(--bronze)] text-[var(--bronze)] font-bold text-sm uppercase tracking-wide rounded hover:bg-[var(--lace)] transition-colors"
            >
              Get in Touch
            </a>
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
