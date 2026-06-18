export default function Contact() {
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
              <a href="/about" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">About</a>
              <a href="/contact" className="text-sm font-semibold text-[var(--bronze)] border-b-2 border-[var(--bronze)]">Contact</a>
            </nav>
          </div>
        </header>

        {/* Page Intro */}
        <section className="py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--ink)]">Get In Touch</h1>
          <p className="text-lg text-[var(--ink-muted)] max-w-2xl">
            We're here to answer questions about our feed, discuss your operation's needs, or help you place an order.
          </p>
        </section>

        {/* Contact Info + Form */}
        <section className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-[var(--ink)]">Contact Information</h2>
            
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--bronze)] mb-2">Phone</p>
                <a
                  href="tel:660-971-0060"
                  className="text-xl font-bold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors"
                >
                  660-971-0060
                </a>
                <p className="text-sm text-[var(--ink-muted)] mt-1">Call to place an order or ask questions</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--bronze)] mb-2">Email</p>
                <a
                  href="mailto:remi@kestenfeed.co"
                  className="text-xl font-bold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors"
                >
                  remi@kestenfeed.co
                </a>
                <p className="text-sm text-[var(--ink-muted)] mt-1">We respond within 24 hours (business days)</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--bronze)] mb-2">Location</p>
                <p className="text-lg font-bold text-[var(--ink)]">
                  16298 Norway Ave<br />
                  Marshall, MO 65340
                </p>
                <p className="text-sm text-[var(--ink-muted)] mt-1">Pickup location for bagged feed</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--bronze)] mb-2">Service Area</p>
                <p className="text-[var(--ink-muted)]">
                  We serve small farms and homesteaders throughout Missouri. If you're unsure whether we can deliver to your location, just ask.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[var(--lace)] rounded p-8">
            <h2 className="text-2xl font-bold mb-6 text-[var(--ink)]">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)] bg-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)] bg-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)] bg-white"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)] bg-white resize-none"
                  placeholder="Tell us about your operation, what you need, or any questions you have..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 md:py-16">
          <h2 className="text-2xl font-bold mb-6 text-[var(--ink)]">What else can we help with?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[var(--ink-soft)] rounded p-6 text-center hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-[var(--ink)]">Want to Order?</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                Place an order for bagged pickup or bulk delivery.
              </p>
              <a
                href="/order-feed"
                className="inline-block text-[var(--bronze)] font-semibold hover:underline"
              >
                Go to order form →
              </a>
            </div>

            <div className="border border-[var(--ink-soft)] rounded p-6 text-center hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-[var(--ink)]">Explore Products</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                See our full lineup of feed options.
              </p>
              <a
                href="/products"
                className="inline-block text-[var(--bronze)] font-semibold hover:underline"
              >
                View all products →
              </a>
            </div>

            <div className="border border-[var(--ink-soft)] rounded p-6 text-center hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-3 text-[var(--ink)]">Ready to Order Now?</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                Call Remi directly to place an order.
              </p>
              <a
                href="tel:660-971-0060"
                className="inline-block text-[var(--bronze)] font-semibold hover:underline"
              >
                Call 660-971-0060 →
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
