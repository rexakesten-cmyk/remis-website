'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type BaggedProduct = {
  id: string;
  label: string;
  pricePerBag: number;
};

const BAGGED_PRODUCTS: BaggedProduct[] = [
  { id: 'cattle-blend', label: 'Cattle Blend', pricePerBag: 19.5 },
  { id: 'poultry-pellets', label: 'Poultry Pellets', pricePerBag: 16.75 },
  { id: 'equine-mix', label: 'Equine Mix', pricePerBag: 21.25 },
  { id: 'sheep-goat-blend', label: 'Sheep & Goat Blend', pricePerBag: 18.5 },
  { id: 'swine-supplement', label: 'Swine Supplement', pricePerBag: 20.0 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export default function OrderFeed() {
  const searchParams = useSearchParams();
  const [orderType, setOrderType] = useState<'bagged' | 'bulk'>('bagged');
  const [baggedQuantities, setBaggedQuantities] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const baggedLineItems = BAGGED_PRODUCTS.map((product) => {
    const quantity = baggedQuantities[product.id] ?? 0;
    return {
      product: product.label,
      quantity,
      unitPrice: product.pricePerBag,
      lineTotal: quantity * product.pricePerBag,
    };
  }).filter((item) => item.quantity > 0);

  const baggedSubtotal = baggedLineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    const sessionId = searchParams.get('session_id');

    async function verifyStripeCheckoutSuccess() {
      if (!sessionId) {
        setSubmitStatus('error');
        setSubmitMessage('Stripe checkout returned without a session id. Please contact us to confirm payment.');
        return;
      }

      try {
        const response = await fetch(
          `/api/payments/stripe-session-status?session_id=${encodeURIComponent(sessionId)}`,
        );
        const result = (await response.json()) as { paid?: boolean; paymentStatus?: string; message?: string };

        if (!response.ok) {
          throw new Error(result.message ?? 'Unable to verify Stripe payment status.');
        }

        if (result.paid) {
          setSubmitStatus('success');
          setSubmitMessage('Payment successful. Thank you for your bagged feed order.');
          setOrderType('bagged');
          setBaggedQuantities({});
          return;
        }

        setSubmitStatus('error');
        setSubmitMessage(
          `Payment is currently ${result.paymentStatus ?? 'unpaid'}. If this looks wrong, contact us and share your session id.`,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to verify Stripe payment status right now. Please contact us to confirm payment.';
        setSubmitStatus('error');
        setSubmitMessage(message);
      }
    }

    if (checkoutStatus === 'success') {
      void verifyStripeCheckoutSuccess();
    }

    if (checkoutStatus === 'cancelled') {
      setSubmitStatus('error');
      setSubmitMessage('Stripe checkout was cancelled. Your order was not paid yet.');
      setOrderType('bagged');
    }
  }, [searchParams]);

  function updateBagQuantity(productId: string, value: string) {
    const parsed = Number.parseInt(value, 10);
    const nextQuantity = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);

    setBaggedQuantities((current) => ({
      ...current,
      [productId]: nextQuantity,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const baggedItems = baggedLineItems;

    if (orderType === 'bagged' && baggedItems.length === 0) {
      setSubmitStatus('error');
      setSubmitMessage('Please add at least one bagged product quantity before submitting.');
      setIsSubmitting(false);
      return;
    }

    const feedDetails =
      orderType === 'bagged'
        ? baggedItems.map((item) => `${item.quantity} bags of ${item.product}`).join(', ')
        : String(formData.get('feedDetails') ?? '').trim();

    const payload = {
      orderType,
      name: String(formData.get('name') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      farmName: String(formData.get('farmName') ?? '').trim(),
      feedDetails,
      baggedItems,
      baggedSubtotal,
      deliveryAddress: String(formData.get('deliveryAddress') ?? '').trim(),
      timing: String(formData.get('timing') ?? '').trim(),
      notes: String(formData.get('notes') ?? '').trim(),
    };

    try {
      const endpoint = orderType === 'bagged' ? '/api/payments/stripe-checkout' : '/api/orders';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string; checkoutUrl?: string };

      if (!response.ok) {
        throw new Error(result.message ?? 'Unable to submit your order right now.');
      }

      if (orderType === 'bagged') {
        if (!result.checkoutUrl) {
          throw new Error('Stripe checkout could not be started. Please try again.');
        }

        window.location.assign(result.checkoutUrl);
        return;
      }

      setSubmitStatus('success');
      setSubmitMessage(result.message ?? 'Order request submitted successfully.');
      form.reset();
      setOrderType('bagged');
      setBaggedQuantities({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit your order right now.';
      setSubmitStatus('error');
      setSubmitMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

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
              <a href="/order-feed" className="text-sm font-semibold text-[var(--bronze)] border-b-2 border-[var(--bronze)]">Order</a>
              <a href="/about" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">About</a>
              <a href="/contact" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--bronze)] transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden -mx-5 md:-mx-10 px-5 md:px-10 py-12 md:py-16 rounded-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/order-pigs.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/42" aria-hidden="true" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Place Your Order</h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Choose the ordering option that works best for your operation. Pick up bagged feed or arrange bulk delivery.
            </p>
          </div>
        </section>

        {/* Order Type Selection */}
        <section className="py-8 md:py-12">
          <h2 className="text-2xl font-bold mb-8 text-[var(--ink)]">How do you want to order?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Bagged Pickup Option */}
            <button
              onClick={() => setOrderType('bagged')}
              className={`p-8 rounded border-2 text-left transition-all ${
                orderType === 'bagged'
                  ? 'border-[var(--bronze)] bg-[var(--lace)]'
                  : 'border-[var(--ink-soft)] bg-white hover:border-[var(--bronze)]'
              }`}
            >
              <h3 className="text-2xl font-bold mb-3 text-[var(--ink)]">Bagged Pickup</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                Pick up pre-bagged feed on your schedule from our location in Marshall, Missouri.
              </p>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li>✓ No shipping cost</li>
                <li>✓ Convenient pickup times</li>
                <li>✓ Perfect for smaller operations</li>
              </ul>
            </button>

            {/* Bulk Delivery Option */}
            <button
              onClick={() => setOrderType('bulk')}
              className={`p-8 rounded border-2 text-left transition-all ${
                orderType === 'bulk'
                  ? 'border-[var(--bronze)] bg-[var(--lace)]'
                  : 'border-[var(--ink-soft)] bg-white hover:border-[var(--bronze)]'
              }`}
            >
              <h3 className="text-2xl font-bold mb-3 text-[var(--ink)]">Bulk Delivery</h3>
              <p className="text-[var(--ink-muted)] mb-4">
                We deliver bulk feed directly to your farm. One trip, one invoice, delivered to your door.
              </p>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li>✓ Delivered to your farm</li>
                <li>✓ Better pricing per unit</li>
                <li>✓ Ideal for larger operations</li>
              </ul>
            </button>
          </div>
        </section>

        {/* Order Form */}
        <section className="py-12 md:py-16 bg-[var(--lace)] -mx-5 md:-mx-10 px-5 md:px-10 rounded">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[var(--ink)]">
            {orderType === 'bagged' ? 'Bagged Pickup Order' : 'Bulk Delivery Order'}
          </h2>

          <div className="bg-white rounded p-8 mb-8">
            <h3 className="text-xl font-bold mb-6 text-[var(--ink)]">Tell us what you need</h3>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="orderType" value={orderType} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)]"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)]"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Farm Name (optional)
                </label>
                <input
                  type="text"
                  name="farmName"
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)]"
                  placeholder="Your Farm Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  {orderType === 'bagged' ? 'Bagged feed quantities *' : 'What feed do you need? *'}
                </label>

                {orderType === 'bagged' ? (
                  <div className="border border-[var(--ink-soft)] rounded p-4 space-y-3">
                    {BAGGED_PRODUCTS.map((product) => (
                      <div
                        key={product.id}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_7rem_9rem] gap-3 items-center"
                      >
                        <span className="font-medium text-[var(--ink)]">{product.label}</span>
                        <span className="text-sm text-[var(--ink-muted)] sm:text-right">
                          {formatCurrency(product.pricePerBag)}/bag
                        </span>
                        <div>
                          <label className="sr-only" htmlFor={`qty-${product.id}`}>
                            Number of bags for {product.label}
                          </label>
                          <input
                            id={`qty-${product.id}`}
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            value={baggedQuantities[product.id] ?? 0}
                            onChange={(event) => updateBagQuantity(product.id, event.target.value)}
                            className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)]"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ))}
                    <p className="text-sm text-[var(--ink-muted)]">
                      Enter the number of bags for each product. Leave at 0 if you do not need that feed.
                    </p>

                    <div className="border-t border-[var(--ink-soft)] pt-3 space-y-2">
                      {baggedLineItems.length > 0 ? (
                        <ul className="space-y-1 text-sm text-[var(--ink-muted)]">
                          {baggedLineItems.map((item) => (
                            <li key={item.product} className="flex items-center justify-between gap-3">
                              <span>
                                {item.quantity} x {item.product}
                              </span>
                              <span className="font-semibold text-[var(--ink)]">{formatCurrency(item.lineTotal)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[var(--ink-muted)]">No bagged items selected yet.</p>
                      )}

                      <div className="flex items-center justify-between text-base font-bold text-[var(--ink)]">
                        <span>Estimated Subtotal</span>
                        <span>{formatCurrency(baggedSubtotal)}</span>
                      </div>
                      <p className="text-xs text-[var(--ink-muted)]">
                        Final total may vary based on current pricing, taxes, and order adjustments.
                      </p>
                    </div>
                  </div>
                ) : (
                  <textarea
                    name="feedDetails"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)] resize-none"
                    placeholder="e.g., 4 tons cattle blend, custom poultry mix, etc."
                  />
                )}
              </div>

              {orderType === 'bulk' && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    name="deliveryAddress"
                    required={orderType === 'bulk'}
                    rows={3}
                    className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)] resize-none"
                    placeholder="Your farm address"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  When do you need this? (optional)
                </label>
                <input
                  type="text"
                  name="timing"
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)]"
                  placeholder="e.g., This week, next Monday, end of month"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Additional notes (optional)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2 border border-[var(--ink-soft)] rounded focus:outline-none focus:border-[var(--bronze)] resize-none"
                  placeholder="Any special requests or questions?"
                />
              </div>

              {submitStatus !== 'idle' && (
                <div
                  className={`rounded px-4 py-3 text-sm font-medium ${
                    submitStatus === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                  role="status"
                >
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-[var(--bronze)] text-white font-bold text-sm uppercase tracking-wide rounded hover:opacity-90 transition-opacity"
              >
                {isSubmitting
                  ? 'Submitting...'
                  : orderType === 'bagged'
                    ? 'Continue to Secure Stripe Checkout'
                    : 'Submit Order Request'}
              </button>

              {orderType === 'bagged' && (
                <p className="text-xs text-[var(--ink-muted)] text-center">
                  Bagged feed payments are processed securely through Stripe.
                </p>
              )}
            </form>
          </div>

          <div className="bg-white rounded p-8">
            <h3 className="text-lg font-bold mb-4 text-[var(--ink)]">What happens next?</h3>
            <ol className="space-y-3 text-[var(--ink-muted)]">
              <li className="flex gap-3">
                <span className="font-bold text-[var(--bronze)] flex-shrink-0">1.</span>
                <span>We'll review your order request and confirm details.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--bronze)] flex-shrink-0">2.</span>
                <span>Remi will call or email you within 24 hours (business days).</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--bronze)] flex-shrink-0">3.</span>
                <span>We'll confirm pricing, timing, and any custom details.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--bronze)] flex-shrink-0">4.</span>
                <span>arrange pickup or delivery on your preferred schedule.</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Contact Fallback */}
        <section className="py-12 md:py-16">
          <div className="border border-[var(--ink-soft)] rounded p-8 text-center">
            <h3 className="text-xl font-bold mb-3 text-[var(--ink)]">Prefer to contact us directly?</h3>
            <p className="text-[var(--ink-muted)] mb-6">
              No problem. Reach out to Remi via phone or email, and we'll help you place an order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:660-971-0060"
                className="px-6 py-3 border-2 border-[var(--ink)] text-[var(--ink)] font-bold text-sm uppercase tracking-wide rounded hover:bg-[var(--lace)] transition-colors"
              >
                Call: 660-971-0060
              </a>
              <a
                href="mailto:remi@kestenfeed.co"
                className="px-6 py-3 border-2 border-[var(--bronze)] text-[var(--bronze)] font-bold text-sm uppercase tracking-wide rounded hover:bg-[var(--lace)] transition-colors"
              >
                Email Remi
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
