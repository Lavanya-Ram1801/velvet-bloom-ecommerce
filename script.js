/* =========================================================
   VELVET BLOOM — storefront logic (frontend-only demo)
   Sections: helpers · icons · storage/state · cart · wishlist ·
   search/filter/sort · views · overlays · checkout · orders · events
   ========================================================= */
'use strict';

(function () {
  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => CONFIG.currency + Math.round(Number(n) || 0).toLocaleString('en-IN');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || id;
  const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const discountPct = (p) => (p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0);
  const maxQty = (p) => Math.min(p.stock, CONFIG.maxQtyPerProduct);

  const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#F4DDE3"/>' +
    '<g transform="translate(400 500)">' + [0, 72, 144, 216, 288].map((a, i) =>
      `<ellipse cx="0" cy="-70" rx="40" ry="70" fill="${i % 2 ? '#743B50' : '#D99BAA'}" opacity=".85" transform="rotate(${a})"/>`).join('') +
    '<circle r="24" fill="#FFF9F5"/></g></svg>');

  /* ---------- icons (Lucide-style inline SVG, no external dependency) ---------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    sliders: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
    box: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  };
  const icon = (name, size = 20, cls = '') =>
    `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
  const hydrateIcons = (root = document) =>
    $$('[data-icon]', root).forEach((el) => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 22); });

  /* ---------- storage & state ---------- */
  const KEYS = { cart: 'vb_cart', wishlist: 'vb_wishlist', orders: 'vb_orders', coupon: 'vb_coupon', recent: 'vb_recent_searches' };

  const storage = {
    load(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        const val = JSON.parse(raw);
        return val === null || val === undefined ? fallback : val;
      } catch (e) { return fallback; } // corrupted JSON or storage blocked
    },
    save(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
  };

  const lineKey = (id, size, color) => [id, size || '', color || ''].join('|');

  function sanitizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    const merged = new Map();
    raw.forEach((i) => {
      const p = i && getProduct(i.productId);
      if (!p || p.stock <= 0) return;
      let qty = Math.floor(Number(i.qty));
      if (!(qty >= 1)) return;
      let size = null;
      if (p.sizes) { if (!p.sizes.includes(i.size)) return; size = i.size; }
      let color = null;
      if (p.colors) color = p.colors.some((c) => c.name === i.color) ? i.color : p.colors[0].name;
      const key = lineKey(p.id, size, color);
      const existing = merged.get(key);
      qty = Math.min(qty + (existing ? existing.qty : 0), maxQty(p));
      merged.set(key, { productId: p.id, size, color, qty });
    });
    return Array.from(merged.values());
  }
  const sanitizeWishlist = (raw) => (Array.isArray(raw) ? [...new Set(raw.filter((id) => typeof id === 'string' && getProduct(id)))] : []);
  const sanitizeOrders = (raw) => (Array.isArray(raw) ? raw.filter((o) => o && typeof o.id === 'string' && Array.isArray(o.items) && ORDER_FLOW.concat('Cancelled').includes(o.status)) : []);

  const state = {
    cart: sanitizeCart(storage.load(KEYS.cart, [])),
    wishlist: sanitizeWishlist(storage.load(KEYS.wishlist, [])),
    orders: sanitizeOrders(storage.load(KEYS.orders, [])),
    coupon: (() => { const c = storage.load(KEYS.coupon, null); return typeof c === 'string' && CONFIG.coupons[c] ? c : null; })(),
    recent: (() => { const r = storage.load(KEYS.recent, []); return Array.isArray(r) ? r.filter((x) => typeof x === 'string').slice(0, 5) : []; })(),
  };
  const saveCart = () => storage.save(KEYS.cart, state.cart);
  const saveWishlist = () => storage.save(KEYS.wishlist, state.wishlist);
  const saveCoupon = () => storage.save(KEYS.coupon, state.coupon);
  const saveRecent = () => storage.save(KEYS.recent, state.recent);

  /* ---------- cart logic ---------- */
  function cartLines() {
    return state.cart.map((i) => {
      const p = getProduct(i.productId);
      return { key: lineKey(i.productId, i.size, i.color), product: p, size: i.size, color: i.color, qty: i.qty };
    }).filter((l) => l.product);
  }
  const cartCount = () => state.cart.reduce((n, i) => n + i.qty, 0);
  const qtyInCart = (id) => state.cart.filter((i) => i.productId === id).reduce((n, i) => n + i.qty, 0);

  function addToCart(productId, { size = null, color = null, qty = 1 } = {}) {
    const p = getProduct(productId);
    if (!p) return { ok: false, message: 'That product could not be found.' };
    if (p.stock <= 0) return { ok: false, message: 'Sorry, this item is sold out.' };
    if (p.sizes && !p.sizes.includes(size)) return { ok: false, message: 'Please select a size first.', field: 'size' };
    if (p.colors && !p.colors.some((c) => c.name === color)) color = p.colors[0].name;
    if (!p.sizes) size = null;
    if (!p.colors) color = null;
    qty = Math.floor(Number(qty));
    if (!(qty >= 1)) return { ok: false, message: 'Quantity must be at least 1.', field: 'qty' };
    if (qtyInCart(productId) + qty > maxQty(p)) {
      return { ok: false, message: `You can order up to ${maxQty(p)} of this item (${qtyInCart(productId)} already in your bag).`, field: 'qty' };
    }
    const key = lineKey(productId, size, color);
    const existing = state.cart.find((i) => lineKey(i.productId, i.size, i.color) === key);
    if (existing) existing.qty += qty; else state.cart.push({ productId, size, color, qty });
    saveCart();
    refreshCartUI();
    return { ok: true, product: p };
  }

  function changeQty(key, delta) {
    const item = state.cart.find((i) => lineKey(i.productId, i.size, i.color) === key);
    if (!item) return;
    const p = getProduct(item.productId);
    const next = item.qty + delta;
    if (next < 1) return; // never below one — use Remove instead
    if (qtyInCart(item.productId) + delta > maxQty(p)) { toast(`Only ${maxQty(p)} available per order.`); return; }
    item.qty = next;
    saveCart();
    refreshCartUI();
  }

  function removeLine(key) {
    state.cart = state.cart.filter((i) => lineKey(i.productId, i.size, i.color) !== key);
    saveCart();
    refreshCartUI();
  }

  function evaluateCoupon(code, subtotal) {
    if (!code) return { valid: false, amount: 0 };
    const c = CONFIG.coupons[String(code).toUpperCase()];
    if (!c) return { valid: false, amount: 0, message: 'That code is not valid.' };
    if (subtotal < c.minSubtotal) return { valid: false, amount: 0, message: `Add ${money(c.minSubtotal - subtotal)} more to use ${code}.` };
    let amount = c.type === 'percent' ? Math.round((subtotal * c.value) / 100) : c.value;
    if (c.max) amount = Math.min(amount, c.max);
    return { valid: true, amount: Math.min(amount, subtotal), message: c.label };
  }

  function shippingFee(deliveryId, subtotal) {
    if (deliveryId === 'express') return CONFIG.expressFee;
    return subtotal >= CONFIG.freeShippingThreshold ? 0 : CONFIG.standardFee;
  }

  // Always recalculated from trusted product data — never from displayed text.
  function calcTotals(lines, deliveryId = 'standard', couponCode = state.coupon) {
    const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
    const coupon = evaluateCoupon(couponCode, subtotal);
    const discount = coupon.valid ? coupon.amount : 0;
    const shipping = lines.length ? shippingFee(deliveryId, subtotal) : 0;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping, coupon };
  }

  /* ---------- wishlist logic ---------- */
  const inWishlist = (id) => state.wishlist.includes(id);
  function toggleWishlist(id) {
    if (!getProduct(id)) return;
    if (inWishlist(id)) state.wishlist = state.wishlist.filter((x) => x !== id);
    else state.wishlist.push(id);
    saveWishlist();
    updateBadges();
    syncWishButtons(id);
    toast(inWishlist(id) ? `Saved “${getProduct(id).name}” to your wishlist.` : 'Removed from your wishlist.');
    if (currentRoute.name === 'wishlist') renderRoute();
  }
  function syncWishButtons(id) {
    $$(`[data-action="wish"][data-id="${id}"]`).forEach((b) => {
      const on = inWishlist(id);
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? `Remove ${getProduct(id).name} from wishlist` : `Add ${getProduct(id).name} to wishlist`);
      b.classList.toggle('is-on', on);
      if (on) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
    });
  }

  /* ---------- search, filter, sort ---------- */
  function searchProducts(query) {
    const tokens = String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const scored = [];
    PRODUCTS.forEach((p) => {
      const nameStr = p.name.toLowerCase();
      const hay = nameStr + ' ' + p.keywords.join(' ');
      let score = 0;
      const ok = tokens.every((t) => {
        let hit = false;
        if (nameStr.includes(t)) { score += 3; hit = true; }
        if (p.keywords.some((k) => k.includes(t) || (t.length > 3 && t.includes(k) && k.length > 3))) { score += 2; hit = true; }
        const aliases = CATEGORY_ALIASES[p.category] || [];
        if (aliases.some((a) => a === t || (t.length >= 5 && a.startsWith(t)))) { score += 1; hit = true; }
        if (!hit && hay.includes(t)) { score += 1; hit = true; }
        return hit;
      });
      if (ok) scored.push({ p, score });
    });
    return scored.sort((a, b) => b.score - a.score).map((x) => x.p);
  }

  function filterProducts(list, f) {
    return list.filter((p) => {
      if (f.cat && f.cat !== 'all' && p.category !== f.cat) return false;
      if (f.min !== '' && f.min != null && p.price < Number(f.min)) return false;
      if (f.max !== '' && f.max != null && p.price > Number(f.max)) return false;
      if (f.inStock && p.stock <= 0) return false;
      if (f.bestseller && p.tag !== 'bestseller') return false;
      if (f.isNew && p.tag !== 'new') return false;
      return true;
    });
  }

  function sortProducts(list, sort) {
    const arr = [...list];
    const idx = (p) => PRODUCTS.indexOf(p);
    switch (sort) {
      case 'price-asc': return arr.sort((a, b) => a.price - b.price);
      case 'price-desc': return arr.sort((a, b) => b.price - a.price);
      case 'newest': return arr.sort((a, b) => new Date(b.added) - new Date(a.added));
      case 'rating': return arr.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      default: return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || idx(a) - idx(b));
    }
  }

  /* ---------- UI atoms ---------- */
  function stars(rating, reviews) {
    const full = Math.round(rating);
    const s = [1, 2, 3, 4, 5].map((n) => icon('star', 14, n <= full ? 'star on' : 'star')).join('');
    return `<span class="rating" aria-label="Sample rating ${rating} out of 5 from ${reviews} sample reviews"><span class="stars" aria-hidden="true">${s}</span><span class="rating-text">${rating.toFixed(1)} <span>(${reviews})</span></span></span>`;
  }

  function priceHTML(p) {
    return `<span class="price"><span class="price-now">${money(p.price)}</span>${p.originalPrice ? `<s class="price-was" aria-label="Original price">${money(p.originalPrice)}</s>` : ''}</span>`;
  }

  function stockLabel(p) {
    if (p.stock <= 0) return { text: 'Out of stock', cls: 'out' };
    if (p.stock <= 5) return { text: `Only ${p.stock} left`, cls: 'low' };
    return { text: 'In stock', cls: 'in' };
  }

  function productCard(p, { variant = '' } = {}) {
    const d = discountPct(p);
    const sold = p.stock <= 0;
    const on = inWishlist(p.id);
    return `
    <article class="product-card" data-id="${p.id}">
      <div class="pc-media">
        <a class="pc-link" href="#/product/${p.id}" aria-label="View ${esc(p.name)}">
          <img class="img-main" src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy" width="800" height="1000">
          <img class="img-alt" src="${p.images[1]}" alt="" aria-hidden="true" loading="lazy" width="800" height="1000">
        </a>
        <div class="pc-badges">
          ${sold ? '<span class="badge-tag sold">Sold out</span>' : ''}
          ${!sold && p.tag === 'new' ? '<span class="badge-tag new">New</span>' : ''}
          ${!sold && p.tag === 'bestseller' ? '<span class="badge-tag best">Bestseller</span>' : ''}
          ${d ? `<span class="badge-tag off">−${d}%</span>` : ''}
        </div>
        <button class="icon-btn wish-btn ${on ? 'is-on' : ''}" data-action="wish" data-id="${p.id}" aria-pressed="${on}"
          aria-label="${on ? 'Remove' : 'Add'} ${esc(p.name)} ${on ? 'from' : 'to'} wishlist">${icon('heart', 20)}</button>
        ${variant === 'wishlist' ? '' : `<button class="quick-add" data-action="quick-add" data-id="${p.id}" ${sold ? 'disabled' : ''}>${sold ? 'Sold out' : 'Quick add'}</button>`}
      </div>
      <div class="pc-body">
        <p class="pc-cat">${esc(catName(p.category))}</p>
        <h3 class="pc-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <div class="pc-meta">${priceHTML(p)}${stars(p.rating, p.reviews)}</div>
        ${variant === 'wishlist' ? `<div class="pc-actions">
          <button class="btn btn-primary btn-sm" data-action="quick-add" data-id="${p.id}" ${sold ? 'disabled' : ''}>${sold ? 'Sold out' : 'Add to bag'}</button>
          <button class="btn btn-ghost btn-sm" data-action="wish" data-id="${p.id}">Remove</button></div>` : ''}
      </div>
    </article>`;
  }
  const productGrid = (list, opts) => `<div class="product-grid">${list.map((p) => productCard(p, opts)).join('')}</div>`;

  const emptyState = (title, text, btnLabel, href, iconName = 'bag') => `
    <div class="empty">
      <div class="empty-icon">${icon(iconName, 34)}</div>
      <h2>${esc(title)}</h2>
      <p>${esc(text)}</p>
      ${btnLabel ? `<a class="btn btn-primary" href="${href}">${esc(btnLabel)}</a>` : ''}
    </div>`;

  function toast(message, { actionLabel, action } = {}) {
    const wrap = $('#toasts');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${esc(message)}</span>${actionLabel ? `<button class="toast-btn" data-action="${action}">${esc(actionLabel)}</button>` : ''}`;
    wrap.appendChild(t);
    while (wrap.children.length > 3) wrap.firstChild.remove();
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3800);
  }

  function updateBadges() {
    const c = cartCount();
    $$('.cart-count').forEach((b) => { b.textContent = c; b.hidden = c === 0; });
    const w = state.wishlist.length;
    $$('.wish-count').forEach((b) => { b.textContent = w; b.hidden = w === 0; });
    $('#cart-btn').setAttribute('aria-label', `Open shopping bag, ${c} item${c === 1 ? '' : 's'}`);
  }

  function refreshCartUI() {
    updateBadges();
    renderCart();
    if (currentRoute.name === 'checkout') renderCheckoutSummary();
    const btn = $('#cart-btn');
    btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
  }

  /* =========================================================
     CART DRAWER
     ========================================================= */
  function couponFormHTML() {
    const lines = cartLines();
    const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
    const ev = evaluateCoupon(state.coupon, subtotal);
    if (state.coupon) {
      return `<div class="coupon-applied ${ev.valid ? '' : 'invalid'}">
        <span>${icon('check', 16)} <strong>${esc(state.coupon)}</strong> — ${esc(ev.valid ? ev.message : ev.message || 'Not applicable right now')}</span>
        <button class="link-btn" data-action="remove-coupon">Remove</button></div>`;
    }
    return `<form class="coupon-form" novalidate>
      <label class="sr-only" for="coupon-${Math.random().toString(36).slice(2, 6)}">Promo code</label>
      <input type="text" name="code" placeholder="Promo code (try BLOOM10)" autocomplete="off" aria-label="Promo code">
      <button class="btn btn-outline btn-sm" type="submit">Apply</button>
      <p class="coupon-msg" role="status"></p></form>`;
  }

  function totalsHTML(t, { deliveryLabel } = {}) {
    return `<dl class="totals">
      <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
      <div><dt>${deliveryLabel || 'Shipping'}</dt><dd>${t.shipping ? money(t.shipping) : 'Free'}</dd></div>
      ${t.discount ? `<div class="disc"><dt>Discount</dt><dd>−${money(t.discount)}</dd></div>` : ''}
      <div class="grand"><dt>Total</dt><dd>${money(t.total)}</dd></div></dl>`;
  }

  function cartLineHTML(l) {
    const p = l.product;
    const variant = [l.size && `Size ${l.size}`, l.color && `${p.colorLabel || 'Color'}: ${l.color}`].filter(Boolean).join(' · ');
    return `<li class="cart-line">
      <a class="cl-img" href="#/product/${p.id}"><img src="${p.image}" alt="${esc(p.name)}" width="80" height="100"></a>
      <div class="cl-info">
        <a class="cl-name" href="#/product/${p.id}">${esc(p.name)}</a>
        ${variant ? `<p class="cl-variant">${esc(variant)}</p>` : ''}
        <p class="cl-unit">${money(p.price)} each</p>
        <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
          <button class="qty-btn" data-action="cart-dec" data-key="${esc(l.key)}" aria-label="Decrease quantity" ${l.qty <= 1 ? 'disabled' : ''}>${icon('minus', 16)}</button>
          <output aria-live="polite">${l.qty}</output>
          <button class="qty-btn" data-action="cart-inc" data-key="${esc(l.key)}" aria-label="Increase quantity" ${l.qty >= maxQty(p) ? 'disabled' : ''}>${icon('plus', 16)}</button>
        </div>
      </div>
      <div class="cl-side">
        <strong class="cl-total">${money(p.price * l.qty)}</strong>
        <button class="icon-btn small" data-action="cart-remove" data-key="${esc(l.key)}" aria-label="Remove ${esc(p.name)} from bag">${icon('trash', 18)}</button>
      </div></li>`;
  }

  function renderCart() {
    const lines = cartLines();
    const body = $('#cart-body'); const foot = $('#cart-foot');
    $('#cart-title-count').textContent = cartCount() ? ` (${cartCount()})` : '';
    if (!lines.length) {
      body.innerHTML = `<div class="empty"><div class="empty-icon">${icon('bag', 34)}</div><h3>Your bag is empty</h3><p>A little treat is just a click away.</p>
        <button class="btn btn-primary" data-action="continue-shopping">Continue shopping</button></div>`;
      foot.innerHTML = '';
      return;
    }
    const t = calcTotals(lines);
    const left = CONFIG.freeShippingThreshold - t.subtotal;
    const pct = Math.min(100, Math.round((t.subtotal / CONFIG.freeShippingThreshold) * 100));
    body.innerHTML = `
      <div class="ship-progress"><p>${left > 0 ? `Add <strong>${money(left)}</strong> more for free standard shipping` : 'You have unlocked free standard shipping'}</p>
        <div class="bar" role="presentation"><span style="width:${pct}%"></span></div></div>
      <ul class="cart-lines">${lines.map(cartLineHTML).join('')}</ul>`;
    foot.innerHTML = `${couponFormHTML()}${totalsHTML(t, { deliveryLabel: 'Shipping (standard)' })}
      <p class="demo-note">Demo store — no real payment is taken.</p>
      <a class="btn btn-primary btn-block" href="#/checkout">Proceed to checkout</a>
      <button class="btn btn-ghost btn-block" data-action="continue-shopping">Continue shopping</button>`;
  }

  function applyCoupon(code, formEl) {
    const lines = cartLines();
    const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
    const clean = String(code || '').trim().toUpperCase();
    const msg = $('.coupon-msg', formEl);
    if (!clean) { msg.textContent = 'Please enter a promo code.'; return; }
    const ev = evaluateCoupon(clean, subtotal);
    if (!ev.valid) { msg.textContent = ev.message; return; }
    state.coupon = clean; saveCoupon();
    refreshCartUI();
    toast(`Promo ${clean} applied.`);
  }

  /* =========================================================
     OVERLAYS (drawer, menu, search, modal) with focus management
     ========================================================= */
  const overlay = { el: null, lastFocus: null, closing: null };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openOverlay(el, focusSel) {
    if (overlay.el === el) return;
    if (overlay.el) closeOverlay(true);
    overlay.lastFocus = document.activeElement;
    overlay.el = el;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('open'));
    document.body.classList.add('no-scroll');
    const target = (focusSel && $(focusSel, el)) || $(FOCUSABLE, $('.overlay-panel', el)) || $('.overlay-panel', el);
    setTimeout(() => target && target.focus(), 30);
  }

  function closeOverlay(immediate = false) {
    const el = overlay.el;
    if (!el) return;
    overlay.el = null;
    el.classList.remove('open');
    const done = () => { el.hidden = true; };
    if (immediate) done(); else setTimeout(done, 260);
    document.body.classList.remove('no-scroll');
    const back = overlay.lastFocus;
    if (!immediate && back && document.contains(back)) back.focus();
  }

  function trapTab(e) {
    if (!overlay.el || e.key !== 'Tab') return;
    const nodes = $$(FOCUSABLE, $('.overlay-panel', overlay.el)).filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0]; const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  const openCart = () => { renderCart(); openOverlay($('#cart-drawer')); };

  /* ---------- search overlay ---------- */
  function openSearch() { openOverlay($('#search-overlay'), '#search-input'); renderSearchResults(); }

  function renderSearchResults() {
    const q = $('#search-input').value.trim();
    const box = $('#search-results');
    if (!q) {
      box.innerHTML = state.recent.length
        ? `<div class="recent"><p class="eyebrow">Recent searches</p><div class="chips">${state.recent.map((r) => `<button class="chip" data-action="recent-search" data-q="${esc(r)}">${esc(r)}</button>`).join('')}</div></div>`
        : `<p class="muted search-hint">Try “dress”, “pearl” or “bag”.</p>`;
      return;
    }
    const results = searchProducts(q);
    if (!results.length) { box.innerHTML = `<p class="no-results">No little treasures found. Try another search.</p>`; return; }
    box.innerHTML = `<p class="result-count">${results.length} result${results.length === 1 ? '' : 's'} for “${esc(q)}”</p>
      <ul class="search-list">${results.slice(0, 6).map((p) => `
        <li><a href="#/product/${p.id}" data-remember="${esc(q)}"><img src="${p.image}" alt="" width="56" height="70"><span class="sl-name">${esc(p.name)}<small>${esc(catName(p.category))}</small></span><span class="sl-price">${money(p.price)}</span></a></li>`).join('')}</ul>
      <a class="btn btn-outline btn-block" href="#/shop?q=${encodeURIComponent(q)}" data-remember="${esc(q)}">View all ${results.length} result${results.length === 1 ? '' : 's'}</a>`;
  }

  function rememberSearch(q) {
    q = String(q || '').trim();
    if (q.length < 2) return;
    state.recent = [q, ...state.recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    saveRecent();
  }

  /* ---------- quick add modal ---------- */
  const quick = { id: null, size: null, color: null };
  function openQuickAdd(id) {
    const p = getProduct(id);
    if (!p) return;
    if (p.stock <= 0) { toast('Sorry, this item is sold out.'); return; }
    if (!p.sizes) { // no required choice: default colour is used
      const r = addToCart(id, { color: p.colors ? p.colors[0].name : null });
      afterAdd(r);
      return;
    }
    quick.id = id; quick.size = null; quick.color = p.colors ? p.colors[0].name : null;
    renderQuickModal();
    openOverlay($('#modal'));
  }

  function renderQuickModal() {
    const p = getProduct(quick.id);
    $('#modal-body').innerHTML = `
      <button class="icon-btn modal-close" data-action="close-overlay" aria-label="Close">${icon('x', 20)}</button>
      <div class="quick">
        <img src="${p.image}" alt="${esc(p.name)}" width="160" height="200">
        <div>
          <h2 id="modal-title">${esc(p.name)}</h2>
          <p>${priceHTML(p)}</p>
          ${optionsHTML(p, quick, 'quick')}
          <p class="field-error" id="quick-error" role="alert"></p>
          <button class="btn btn-primary btn-block" data-action="quick-confirm">Add to bag</button>
        </div></div>`;
  }

  function optionsHTML(p, sel, scope) {
    let h = '';
    if (p.colors) {
      h += `<fieldset class="opt"><legend>${esc(p.colorLabel || 'Color')}: <strong>${esc(sel.color || '')}</strong></legend><div class="swatches">${p.colors.map((c) =>
        `<button type="button" class="swatch ${sel.color === c.name ? 'on' : ''}" data-action="${scope}-color" data-value="${esc(c.name)}" aria-pressed="${sel.color === c.name}" aria-label="${esc(c.name)}" style="--sw:${c.hex}"></button>`).join('')}</div></fieldset>`;
    }
    if (p.sizes) {
      h += `<fieldset class="opt"><legend>Size${sel.size ? `: <strong>${sel.size}</strong>` : ' <span class="req">(required)</span>'}</legend><div class="sizes">${p.sizes.map((s) =>
        `<button type="button" class="size ${sel.size === s ? 'on' : ''}" data-action="${scope}-size" data-value="${s}" aria-pressed="${sel.size === s}">${s}</button>`).join('')}</div></fieldset>`;
    }
    return h;
  }

  function afterAdd(r, { silentToast = false } = {}) {
    if (!r.ok) { toast(r.message); return r; }
    if (!silentToast) toast(`“${r.product.name}” added to your bag.`, { actionLabel: 'View bag', action: 'open-cart' });
    return r;
  }

  /* =========================================================
     ROUTER & VIEWS
     ========================================================= */
  const app = $('#app');
  let currentRoute = { name: 'home', parts: [], params: new URLSearchParams() };
  const shop = { cat: 'all', sort: 'featured', min: '', max: '', inStock: false, bestseller: false, isNew: false, q: '', filtersOpen: false };
  let pdp = { id: null, size: null, color: null, qty: 1 };
  let isSubmitting = false;

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    return { name: parts[0] || 'home', parts, params: new URLSearchParams(qs || '') };
  }

  function renderRoute() {
    currentRoute = parseHash();
    const { name } = currentRoute;
    const views = { home: homeView, shop: shopView, product: productView, wishlist: wishlistView, checkout: checkoutView, confirmation: confirmationView, orders: ordersView, order: orderDetailView, info: infoView };
    const view = views[name];
    document.body.dataset.route = name;
    app.innerHTML = view ? view() : notFoundView();
    hydrateIcons(app);
    setActiveNav();
    if (name === 'shop') updateCatalog();
    if (name === 'checkout') renderCheckoutSummary();
  }

  function onRouteChange() {
    closeOverlay(true);
    const next = parseHash();
    if (next.name === 'shop') initShopFromParams(next.params);
    if (next.name === 'product') pdp = { id: next.parts[1], size: null, color: null, qty: 1 };
    renderRoute();
    window.scrollTo({ top: 0, behavior: 'auto' });
    const h = $('h1', app);
    document.title = (h ? h.textContent.replace(/\s+/g, ' ').trim() + ' — ' : '') + 'VELVET BLOOM';
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in');
  }

  function setActiveNav() {
    const { name, params, parts } = currentRoute;
    let active = name;
    if (name === 'shop') active = params.get('cat') || (params.get('filter') === 'new' ? 'new' : 'shop');
    if (name === 'product') { const p = getProduct(parts[1]); active = p && ['clothing', 'accessories', 'jewelry', 'beauty'].includes(p.category) ? p.category : 'shop'; }
    if (name === 'order' || name === 'confirmation') active = 'orders';
    $$('[data-nav]').forEach((a) => { const on = a.dataset.nav === active; a.classList.toggle('active', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  }

  /* ---------- Home ---------- */
  function sectionHead(eyebrow, title, linkText, href) {
    return `<div class="section-head"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div>${linkText ? `<a class="text-link" href="${href}">${linkText} ${icon('arrow', 16)}</a>` : ''}</div>`;
  }

  function homeView() {
    const featured = sortProducts(PRODUCTS.filter((p) => p.featured), 'featured').slice(0, 4);
    const fresh = sortProducts(PRODUCTS.filter((p) => p.tag === 'new'), 'newest').slice(0, 4);
    const best = sortProducts(PRODUCTS.filter((p) => p.tag === 'bestseller'), 'rating').slice(0, 4);
    return `
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">THE NEW SEASON EDIT</p>
          <h1>Little Things.<br><em>Lovely Feelings.</em></h1>
          <p class="lead">Discover thoughtfully curated pieces that make everyday moments feel special.</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#/shop">SHOP THE COLLECTION</a>
            <a class="text-link" href="#/shop?filter=new">EXPLORE NEW ARRIVALS ${icon('arrow', 16)}</a>
          </div>
        </div>
        <div class="hero-media">
          <img src="assets/images/hero.svg" alt="Soft editorial illustration of a floral dress, a berry shoulder bag and a pearl necklace" width="1000" height="1200" fetchpriority="high">
          <p class="hero-note">Made for your everyday magic.</p>
        </div>
      </div>
    </section>

    <section class="section container" aria-labelledby="cat-h">
      <div class="section-head center"><div><p class="eyebrow">SHOP BY CATEGORY</p><h2 id="cat-h">Find Your Kind of Lovely</h2><p class="muted">Little treasures for every version of you.</p></div></div>
      <div class="cat-grid">${CATEGORIES.map((c) => `
        <a class="cat-card" href="#/shop?cat=${c.id}">
          <img src="${c.image}" alt="" loading="lazy" width="800" height="1000">
          <span class="cat-info"><strong>${esc(c.name)}</strong><small>${esc(c.label)}</small><span class="cat-go">Shop Now ${icon('arrow', 14)}</span></span>
        </a>`).join('')}</div>
    </section>

    <section class="section container" aria-labelledby="feat-h">
      ${sectionHead('HANDPICKED', '<span id="feat-h">Featured Pieces</span>', 'Shop all', '#/shop')}
      ${productGrid(featured)}
    </section>

    <section class="section container" aria-labelledby="new-h">
      ${sectionHead('JUST LANDED', '<span id="new-h">New Arrivals</span>', 'View all new', '#/shop?filter=new')}
      ${productGrid(fresh)}
    </section>

    <section class="promo" aria-labelledby="promo-h">
      <div class="container promo-inner">
        <div class="promo-copy">
          <p class="eyebrow light">THE EDIT</p>
          <h2 id="promo-h">A Little Something, Just for You.</h2>
          <p>Discover pieces that bring a little extra joy to your everyday.</p>
          <a class="btn btn-light" href="#/shop?filter=bestseller">EXPLORE THE EDIT</a>
        </div>
        <img src="assets/images/promo.svg" alt="Illustration of a berry bag, a pearl pendant and a floral mug" loading="lazy" width="1600" height="900">
      </div>
    </section>

    <section class="section container" aria-labelledby="best-h">
      ${sectionHead('LOVED MOST', '<span id="best-h">Best Sellers</span>', 'View best sellers', '#/shop?filter=bestseller')}
      ${productGrid(best)}
      <p class="demo-note center">All products, ratings and review counts are sample demo content.</p>
    </section>

    ${newsletterHTML()}`;
  }

  function newsletterHTML() {
    return `<section class="newsletter" aria-labelledby="nl-h"><div class="container nl-inner">
      <h2 id="nl-h">Letters from the Lovely Side</h2>
      <p>Be the first to discover new arrivals, styling inspiration, and little surprises.</p>
      <form id="newsletter-form" novalidate>
        <label class="sr-only" for="nl-email">Email address</label>
        <input id="nl-email" type="email" name="email" placeholder="Your email address" autocomplete="email" aria-describedby="nl-msg">
        <button class="btn btn-primary" type="submit">Subscribe</button>
      </form>
      <p id="nl-msg" class="form-msg" role="status"></p>
      <p class="demo-note">Demo interaction only — nothing is sent or stored.</p></div></section>`;
  }

  /* ---------- Shop / catalog ---------- */
  function initShopFromParams(params) {
    Object.assign(shop, { cat: 'all', sort: 'featured', min: '', max: '', inStock: false, bestseller: false, isNew: false, q: '', filtersOpen: false });
    const cat = params.get('cat');
    if (cat && CATEGORIES.some((c) => c.id === cat)) shop.cat = cat;
    const f = params.get('filter');
    if (f === 'new') shop.isNew = true;
    if (f === 'bestseller') shop.bestseller = true;
    shop.q = (params.get('q') || '').slice(0, 80);
    const s = params.get('sort');
    if (['price-asc', 'price-desc', 'newest', 'rating'].includes(s)) shop.sort = s;
  }

  function shopTitle() {
    if (shop.q) return 'Search results';
    if (shop.isNew && shop.cat === 'all') return 'New Arrivals';
    if (shop.bestseller && shop.cat === 'all') return 'Best Sellers';
    return shop.cat === 'all' ? 'Shop All' : catName(shop.cat);
  }

  function shopView() {
    return `
    <section class="page-head"><div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> <span aria-hidden="true">/</span> <span>Shop</span></nav>
      <h1 id="shop-title">${esc(shopTitle())}</h1>
      <p class="muted" id="shop-sub"></p>
    </div></section>
    <section class="container catalog">
      <div class="toolbar">
        <div class="chips" role="group" aria-label="Filter by category">
          <button class="chip" data-action="shop-cat" data-cat="all">All Products</button>
          ${CATEGORIES.map((c) => `<button class="chip" data-action="shop-cat" data-cat="${c.id}">${esc(c.name)}</button>`).join('')}
        </div>
        <div class="toolbar-row">
          <p class="count" id="shop-count" aria-live="polite"></p>
          <div class="toolbar-ctrls">
            <button class="btn btn-outline btn-sm" data-action="shop-toggle-filters" aria-expanded="false" aria-controls="filter-panel">${icon('sliders', 16)} Filters</button>
            <label class="sort"><span class="sr-only">Sort by</span>
              <select data-filter="sort" aria-label="Sort products">
                <option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option><option value="rating">Highest Rated</option></select></label>
          </div>
        </div>
        <div class="filter-panel" id="filter-panel" hidden>
          <div class="fp-grid">
            <fieldset><legend>Price (₹)</legend>
              <div class="price-inputs"><label class="sr-only" for="f-min">Minimum price</label><input id="f-min" type="number" min="0" inputmode="numeric" placeholder="Min" data-filter="min">
              <span aria-hidden="true">–</span><label class="sr-only" for="f-max">Maximum price</label><input id="f-max" type="number" min="0" inputmode="numeric" placeholder="Max" data-filter="max"></div></fieldset>
            <fieldset><legend>Show only</legend>
              <label class="check"><input type="checkbox" data-filter="inStock"> In stock</label>
              <label class="check"><input type="checkbox" data-filter="bestseller"> Bestsellers</label>
              <label class="check"><input type="checkbox" data-filter="isNew"> New arrivals</label></fieldset>
          </div>
          <button class="btn btn-ghost btn-sm" data-action="shop-clear">Clear filters</button>
        </div>
      </div>
      <div id="catalog-grid"></div>
    </section>`;
  }

  function currentShopList() {
    const base = shop.q ? searchProducts(shop.q) : PRODUCTS;
    return sortProducts(filterProducts(base, shop), shop.sort);
  }

  function updateCatalog() {
    const list = currentShopList();
    const grid = $('#catalog-grid');
    if (!grid) return;
    $('#shop-title').textContent = shopTitle();
    $('#shop-sub').innerHTML = shop.q ? `Showing results for “${esc(shop.q)}” · <a class="text-link inline" href="#/shop">Clear search</a>` : '';
    $('#shop-count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
    $$('[data-action="shop-cat"]').forEach((b) => { const on = b.dataset.cat === shop.cat; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const set = (sel, fn) => { const el = $(sel); if (el) fn(el); };
    set('[data-filter="sort"]', (e) => (e.value = shop.sort));
    set('[data-filter="min"]', (e) => (e.value = shop.min));
    set('[data-filter="max"]', (e) => (e.value = shop.max));
    ['inStock', 'bestseller', 'isNew'].forEach((k) => set(`[data-filter="${k}"]`, (e) => (e.checked = !!shop[k])));
    const panel = $('#filter-panel');
    panel.hidden = !shop.filtersOpen;
    $('[data-action="shop-toggle-filters"]').setAttribute('aria-expanded', String(shop.filtersOpen));
    grid.innerHTML = list.length ? productGrid(list)
      : `<div class="empty"><div class="empty-icon">${icon('search', 34)}</div><h2>No little treasures found.</h2><p>Try another search or clear your filters.</p><button class="btn btn-primary" data-action="shop-clear">Clear filters</button></div>`;
    grid.classList.remove('swap'); void grid.offsetWidth; grid.classList.add('swap');
  }

  function clearShopFilters() {
    Object.assign(shop, { cat: 'all', sort: 'featured', min: '', max: '', inStock: false, bestseller: false, isNew: false, q: '' });
    if (location.hash.includes('?')) { history.replaceState(null, '', '#/shop'); setActiveNav(); }
    updateCatalog();
  }

  /* ---------- Product detail ---------- */
  function productView() {
    const p = getProduct(currentRoute.parts[1]);
    if (!p) return notFoundView('We couldn’t find that product.');
    if (pdp.id !== p.id) pdp = { id: p.id, size: null, color: null, qty: 1 };
    if (p.colors && !pdp.color) pdp.color = p.colors[0].name;
    const st = stockLabel(p);
    const related = [...PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id), ...PRODUCTS.filter((x) => x.category !== p.category && x.id !== p.id)].slice(0, 4);
    const on = inWishlist(p.id);
    return `
    <section class="container pdp">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> <span aria-hidden="true">/</span> <a href="#/shop?cat=${p.category}">${esc(catName(p.category))}</a> <span aria-hidden="true">/</span> <span>${esc(p.name)}</span></nav>
      <div class="pdp-grid">
        <div class="pdp-gallery">
          <div class="pdp-main"><img id="pdp-main-img" src="${p.images[0]}" alt="${esc(p.name)}" width="800" height="1000">
            ${discountPct(p) ? `<span class="badge-tag off">−${discountPct(p)}%</span>` : ''}</div>
          <div class="pdp-thumbs">${p.images.map((src, i) => `<button class="thumb ${i === 0 ? 'on' : ''}" data-action="gallery" data-src="${src}" aria-label="Show image ${i + 1}" aria-pressed="${i === 0}"><img src="${src}" alt="" width="80" height="100"></button>`).join('')}</div>
        </div>
        <div class="pdp-info">
          <p class="eyebrow">${esc(catName(p.category))}</p>
          <h1>${esc(p.name)}</h1>
          <div class="pdp-rate">${stars(p.rating, p.reviews)} <span class="muted small">sample rating · demo content</span></div>
          <p class="pdp-price">${priceHTML(p)}</p>
          <p class="pdp-desc">${esc(p.desc)}</p>
          <div id="pdp-options">${optionsHTML(p, pdp, 'pdp')}</div>
          <p class="field-error" id="pdp-error" role="alert"></p>
          <div class="pdp-buy">
            <div class="qty big" role="group" aria-label="Quantity">
              <button class="qty-btn" data-action="pdp-qty" data-delta="-1" aria-label="Decrease quantity" ${p.stock <= 0 ? 'disabled' : ''}>${icon('minus', 16)}</button>
              <output id="pdp-qty" aria-live="polite">${pdp.qty}</output>
              <button class="qty-btn" data-action="pdp-qty" data-delta="1" aria-label="Increase quantity" ${p.stock <= 0 ? 'disabled' : ''}>${icon('plus', 16)}</button>
            </div>
            <p class="stock ${st.cls}"><span class="dot"></span>${st.text}</p>
          </div>
          <div class="pdp-actions">
            <button class="btn btn-primary" data-action="pdp-add" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? 'Sold out' : 'Add to cart'}</button>
            <button class="btn btn-dark" data-action="pdp-buy" ${p.stock <= 0 ? 'disabled' : ''}>Buy now</button>
            <button class="icon-btn wish-btn outline ${on ? 'is-on' : ''}" data-action="wish" data-id="${p.id}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Add'} ${esc(p.name)} ${on ? 'from' : 'to'} wishlist">${icon('heart', 22)}</button>
          </div>
          <div class="pdp-delivery">${icon('truck', 20)}<div><strong>Delivery</strong><p>Standard 5–7 business days, express 2–3 (demo estimates). Free standard shipping over ${money(CONFIG.freeShippingThreshold)}.</p></div></div>
          <details class="acc" open><summary>Details &amp; care</summary><ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></details>
          <details class="acc"><summary>Shipping &amp; returns (demo policy)</summary><p>This is a demonstration store. See <a href="#/info/shipping">shipping</a> and <a href="#/info/returns">returns</a> for the sample policy text.</p></details>
        </div>
      </div>
    </section>
    <section class="section container" aria-labelledby="rel-h">
      ${sectionHead('YOU MAY ALSO LOVE', '<span id="rel-h">Related Products</span>')}
      ${productGrid(related)}
    </section>`;
  }

  function refreshPdpOptions() {
    const p = getProduct(pdp.id);
    $('#pdp-options').innerHTML = optionsHTML(p, pdp, 'pdp');
  }

  function pdpAdd(buyNow) {
    const p = getProduct(pdp.id);
    const err = $('#pdp-error');
    const r = addToCart(p.id, { size: pdp.size, color: pdp.color, qty: pdp.qty });
    if (!r.ok) { err.textContent = r.message; if (r.field === 'size') $('.sizes .size')?.focus(); return; }
    err.textContent = '';
    if (buyNow) { location.hash = '#/checkout'; return; }
    afterAdd(r);
    const btn = $('[data-action="pdp-add"]');
    btn.textContent = 'Added ✓'; btn.classList.add('done');
    setTimeout(() => { btn.textContent = 'Add to cart'; btn.classList.remove('done'); }, 1600);
  }

  /* ---------- Wishlist ---------- */
  function wishlistView() {
    const items = state.wishlist.map(getProduct).filter(Boolean);
    return `<section class="page-head"><div class="container"><h1>Your Wishlist</h1><p class="muted">${items.length} saved piece${items.length === 1 ? '' : 's'}</p></div></section>
      <section class="container section tight">${items.length ? productGrid(items, { variant: 'wishlist' })
        : emptyState('Your wishlist is waiting for a little love.', 'Tap the heart on anything you adore and it will wait for you here.', 'Browse Products', '#/shop', 'heart')}</section>`;
  }

  /* ---------- Checkout ---------- */
  function checkoutView() {
    const lines = cartLines();
    if (!lines.length) {
      return `<section class="page-head"><div class="container"><h1>Checkout</h1></div></section>
        <section class="container section tight">${emptyState('Your bag is empty', 'Add something lovely before checking out.', 'Continue Shopping', '#/shop')}</section>`;
    }
    const field = (id, label, extra = '', type = 'text', attrs = '') => `
      <div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${attrs} aria-describedby="err-${id}" ${extra}><p class="field-error" id="err-${id}" role="alert"></p></div>`;
    return `
    <section class="page-head"><div class="container"><h1>Checkout</h1>
      <p class="demo-banner">${icon('info', 18)} Demo checkout — no real payment is processed and no real order is shipped.</p></div></section>
    <section class="container checkout">
      <form id="checkout-form" novalidate class="checkout-form">
        <fieldset class="step"><legend><span class="step-n">1</span> Contact information</legend>
          ${field('name', 'Full name', 'autocomplete="name"', 'text', 'required')}
          <div class="two">${field('email', 'Email address', 'autocomplete="email"', 'email', 'required')}${field('phone', 'Phone number', 'autocomplete="tel" inputmode="tel" placeholder="10-digit mobile number"', 'tel', 'required')}</div>
        </fieldset>
        <fieldset class="step"><legend><span class="step-n">2</span> Shipping address</legend>
          ${field('address', 'Address line', 'autocomplete="street-address"', 'text', 'required')}
          <div class="two">${field('city', 'City', 'autocomplete="address-level2"', 'text', 'required')}
            <div class="field"><label for="state">State</label><select id="state" name="state" required autocomplete="address-level1" aria-describedby="err-state"><option value="">Select state</option>${INDIAN_STATES.map((s) => `<option>${esc(s)}</option>`).join('')}</select><p class="field-error" id="err-state" role="alert"></p></div></div>
          <div class="two">${field('postal', 'Postal code', 'autocomplete="postal-code" inputmode="numeric" maxlength="6" placeholder="6-digit PIN code"', 'text', 'required')}
            <div class="field"><label for="country">Country</label><select id="country" name="country" required><option>India</option></select><p class="hint">This demo ships to India only.</p></div></div>
        </fieldset>
        <fieldset class="step"><legend><span class="step-n">3</span> Delivery method</legend>
          ${DELIVERY_OPTIONS.map((d, i) => `<label class="choice"><input type="radio" name="delivery" value="${d.id}" ${i === 0 ? 'checked' : ''}>
            <span><strong>${d.label}</strong><small>${d.note}</small></span><span class="choice-price" data-delivery-price="${d.id}"></span></label>`).join('')}
        </fieldset>
        <fieldset class="step"><legend><span class="step-n">4</span> Payment method</legend>
          ${PAYMENT_OPTIONS.map((d, i) => `<label class="choice"><input type="radio" name="payment" value="${d.id}" ${i === 0 ? 'checked' : ''}>
            <span><strong>${d.label}</strong><small>${d.note}</small></span></label>`).join('')}
          <p class="hint">We never ask for card numbers, CVVs, UPI PINs or passwords in this demo.</p>
        </fieldset>
        <p class="form-msg err" id="checkout-error" role="alert"></p>
        <button class="btn btn-primary btn-block btn-lg" type="submit" id="place-order">Place demo order</button>
        <p class="demo-note">By placing this demo order you are only saving a sample record in this browser (localStorage).</p>
      </form>
      <aside class="summary" aria-labelledby="sum-h"><h2 id="sum-h"><span class="step-n">5</span> Order summary</h2><div id="checkout-summary"></div></aside>
    </section>`;
  }

  const selectedDelivery = () => { const f = $('#checkout-form'); const r = f && $('input[name="delivery"]:checked', f); return r ? r.value : 'standard'; };

  function renderCheckoutSummary() {
    const box = $('#checkout-summary');
    if (!box) return;
    const lines = cartLines();
    if (!lines.length) { box.innerHTML = '<p class="muted">Your bag is empty.</p>'; return; }
    const dId = selectedDelivery();
    const t = calcTotals(lines, dId);
    const lbl = (DELIVERY_OPTIONS.find((d) => d.id === dId) || {}).label || 'Shipping';
    box.innerHTML = `<ul class="sum-lines">${lines.map((l) => `<li><img src="${l.product.image}" alt="" width="56" height="70"><div><strong>${esc(l.product.name)}</strong><small>${[l.size && 'Size ' + l.size, l.color].filter(Boolean).join(' · ')}</small><small>Qty ${l.qty} × ${money(l.product.price)}</small></div><span>${money(l.product.price * l.qty)}</span></li>`).join('')}</ul>
      ${couponFormHTML()}${totalsHTML(t, { deliveryLabel: lbl })}`;
    DELIVERY_OPTIONS.forEach((d) => { const el = $(`[data-delivery-price="${d.id}"]`); if (el) { const f = shippingFee(d.id, t.subtotal); el.textContent = f ? money(f) : 'Free'; } });
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validateCheckout(d) {
    const e = {};
    if (!/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(d.name)) e.name = 'Please enter your full name (letters only, at least 2 characters).';
    if (!EMAIL_RE.test(d.email)) e.email = 'Please enter a valid email address, like name@example.com.';
    const digits = d.phone.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '');
    if (!/^[6-9]\d{9}$/.test(digits)) e.phone = 'Enter a valid 10-digit Indian mobile number (starting with 6–9).';
    if (d.address.length < 6) e.address = 'Please enter your street address (at least 6 characters).';
    if (!/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(d.city)) e.city = 'Please enter a valid city.';
    if (!INDIAN_STATES.includes(d.state)) e.state = 'Please choose a state.';
    if (!/^[1-9]\d{5}$/.test(d.postal)) e.postal = 'Enter a valid 6-digit PIN code.';
    return e;
  }

  function readCheckoutForm(form) {
    const v = (n) => String(form.elements[n]?.value || '').trim();
    return { name: v('name'), email: v('email'), phone: v('phone'), address: v('address'), city: v('city'), state: v('state'), postal: v('postal'), country: v('country') || 'India',
      delivery: selectedDelivery(), payment: ($('input[name="payment"]:checked', form) || {}).value || 'cod' };
  }

  function generateOrderId() {
    const d = new Date(); const pad = (n) => String(n).padStart(2, '0');
    let id;
    do { id = `VB-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }
    while (state.orders.some((o) => o.id === id));
    return id;
  }

  function createOrder(data, lines) {
    const t = calcTotals(lines, data.delivery);
    const pay = PAYMENT_OPTIONS.find((p) => p.id === data.payment) || PAYMENT_OPTIONS[0];
    const del = DELIVERY_OPTIONS.find((x) => x.id === data.delivery) || DELIVERY_OPTIONS[0];
    const now = new Date().toISOString();
    return {
      id: generateOrderId(), createdAt: now,
      items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, image: l.product.image, size: l.size, color: l.color, qty: l.qty, unitPrice: l.product.price, lineTotal: l.product.price * l.qty })),
      shipping: { name: data.name, email: data.email, phone: data.phone, address: data.address, city: data.city, state: data.state, postal: data.postal, country: data.country },
      delivery: { id: del.id, label: del.label, fee: t.shipping },
      subtotal: t.subtotal, shippingFee: t.shipping, discount: t.discount, couponCode: t.coupon.valid ? state.coupon : null, total: t.total,
      payment: { method: pay.label, status: pay.status },
      status: 'Order Placed', statusHistory: [{ status: 'Order Placed', at: now }],
    };
  }

  function saveOrder(order) {
    state.orders.unshift(order);
    const wrote = storage.save(KEYS.orders, state.orders);
    const verify = wrote && (storage.load(KEYS.orders, []) || []).some((o) => o.id === order.id);
    if (!verify) { state.orders = state.orders.filter((o) => o.id !== order.id); return false; }
    return true;
  }

  async function placeOrder(form) {
    if (isSubmitting) return;
    const errBox = $('#checkout-error'); errBox.textContent = '';
    const data = readCheckoutForm(form);
    const errors = validateCheckout(data);
    $$('.field-error', form).forEach((n) => (n.textContent = ''));
    $$('[aria-invalid]', form).forEach((n) => n.removeAttribute('aria-invalid'));
    const keys = Object.keys(errors);
    if (keys.length) {
      keys.forEach((k) => { const el = $(`#err-${k}`); if (el) el.textContent = errors[k]; const input = $(`#${k}`, form); if (input) input.setAttribute('aria-invalid', 'true'); });
      errBox.textContent = 'Please fix the highlighted fields.';
      $(`#${keys[0]}`, form).focus();
      return;
    }
    const lines = cartLines();
    if (!lines.length) { errBox.textContent = 'Your bag is empty — add something before placing an order.'; return; }
    const bad = lines.find((l) => l.product.stock <= 0 || l.qty > maxQty(l.product));
    if (bad) { errBox.textContent = `“${bad.product.name}” is no longer available in that quantity. Please update your bag.`; return; }

    isSubmitting = true;
    const btn = $('#place-order'); btn.disabled = true; btn.textContent = 'Placing demo order…';
    await sleep(700);
    const order = createOrder(data, lines);
    if (!saveOrder(order)) {
      errBox.textContent = 'We could not save your demo order (browser storage may be blocked). No order was placed.';
      btn.disabled = false; btn.textContent = 'Place demo order'; isSubmitting = false;
      return;
    }
    state.cart = []; state.coupon = null; saveCart(); saveCoupon(); updateBadges(); renderCart();
    isSubmitting = false;
    location.hash = `#/confirmation/${order.id}`;
  }

  /* ---------- Confirmation, orders ---------- */
  const getOrder = (id) => state.orders.find((o) => o.id === id);
  const statusPill = (s) => `<span class="pill status-${s.toLowerCase().replace(/\s+/g, '-')}">${esc(s)}</span>`;
  const itemCount = (o) => o.items.reduce((n, i) => n + i.qty, 0);
  const variantText = (i) => [i.size && `Size ${i.size}`, i.color].filter(Boolean).join(' · ');

  function orderItemsHTML(o) {
    return `<ul class="sum-lines">${o.items.map((i) => `<li><img src="${esc(i.image)}" alt="" width="56" height="70"><div><strong>${esc(i.name)}</strong>${variantText(i) ? `<small>${esc(variantText(i))}</small>` : ''}<small>Qty ${i.qty} × ${money(i.unitPrice)}</small></div><span>${money(i.lineTotal)}</span></li>`).join('')}</ul>`;
  }
  const orderTotalsHTML = (o) => totalsHTML({ subtotal: o.subtotal, shipping: o.shippingFee, discount: o.discount, total: o.total }, { deliveryLabel: o.delivery.label });
  const addressHTML = (s) => `<address>${esc(s.name)}<br>${esc(s.address)}<br>${esc(s.city)}, ${esc(s.state)} ${esc(s.postal)}<br>${esc(s.country)}<br>${esc(s.phone)} · ${esc(s.email)}</address>`;

  function confirmationView() {
    const o = getOrder(currentRoute.parts[1]);
    if (!o) return notFoundView('We couldn’t find that order in this browser.');
    return `<section class="container confirm">
      <div class="confirm-icon" aria-hidden="true"><svg viewBox="0 0 52 52" width="64" height="64"><circle class="c-ring" cx="26" cy="26" r="24" fill="none" stroke="#743B50" stroke-width="2"/><path class="c-tick" d="M15 27l8 8 14-16" fill="none" stroke="#743B50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h1>Your Order Is Placed!</h1>
      <p class="muted">Order ID <strong class="order-id">${esc(o.id)}</strong></p>
      <p class="demo-banner">${icon('info', 18)} This was a demo checkout. No real payment was taken and nothing will be shipped.</p>
      <div class="confirm-grid">
        <div class="card"><h2>Order summary</h2>${orderItemsHTML(o)}${orderTotalsHTML(o)}</div>
        <div class="card"><h2>Delivery address</h2>${addressHTML(o.shipping)}
          <h2 class="mt">Delivery method</h2><p>${esc(o.delivery.label)}</p>
          <h2 class="mt">Payment</h2><p>${esc(o.payment.method)}<br><span class="muted">${esc(o.payment.status)}</span></p>
          <h2 class="mt">Status</h2><p>${statusPill(o.status)}</p></div>
      </div>
      <div class="confirm-cta"><a class="btn btn-primary" href="#/orders">View my orders</a><a class="btn btn-outline" href="#/shop">Continue shopping</a></div>
    </section>`;
  }

  function ordersView() {
    const list = state.orders;
    return `<section class="page-head"><div class="container"><h1>My Orders</h1>
      <p class="demo-banner">${icon('info', 18)} Orders are saved in this browser's localStorage for demonstration only. This is not a secure production database.</p></div></section>
      <section class="container section tight">${list.length ? `<div class="order-list">${list.map((o) => `
        <article class="order-card"><div><p class="oc-id">${esc(o.id)}</p><p class="muted small">${fmtDate(o.createdAt)} · ${itemCount(o)} item${itemCount(o) === 1 ? '' : 's'}</p></div>
          <div class="oc-mid">${statusPill(o.status)}</div><strong>${money(o.total)}</strong>
          <a class="btn btn-outline btn-sm" href="#/order/${encodeURIComponent(o.id)}">View details</a></article>`).join('')}</div>`
        : emptyState('No orders yet', 'When you place a demo order it will appear here.', 'Start Shopping', '#/shop', 'box')}</section>`;
  }

  const NEXT_STATUS = { 'Order Placed': 'Processing', Processing: 'Shipped', Shipped: 'Delivered' };

  function updateOrderStatus(id, next) {
    const o = getOrder(id);
    if (!o) return { ok: false, message: 'Order not found.' };
    if (o.status === 'Cancelled') return { ok: false, message: 'A cancelled order cannot change status.' };
    const allowed = next === 'Cancelled' ? o.status === 'Order Placed' : NEXT_STATUS[o.status] === next;
    if (!allowed) return { ok: false, message: `An order that is “${o.status}” cannot move to “${next}”.` };
    o.status = next; o.statusHistory.push({ status: next, at: new Date().toISOString() });
    if (!storage.save(KEYS.orders, state.orders)) return { ok: false, message: 'Could not save the change (storage unavailable).' };
    return { ok: true };
  }

  function orderDetailView() {
    const o = getOrder(currentRoute.parts[1]);
    if (!o) return notFoundView('We couldn’t find that order in this browser.');
    const cancelled = o.status === 'Cancelled';
    const idx = ORDER_FLOW.indexOf(o.status);
    const next = NEXT_STATUS[o.status];
    const timeline = cancelled
      ? `<div class="cancelled-note">${icon('x', 18)} This order was cancelled${o.statusHistory.length ? ' on ' + fmtDate(o.statusHistory[o.statusHistory.length - 1].at) : ''}.</div>`
      : `<ol class="timeline">${ORDER_FLOW.map((s, i) => `<li class="${i < idx ? 'done' : ''} ${i === idx ? 'now' : ''}"><span class="tl-dot">${i <= idx ? icon('check', 14) : ''}</span>${s}</li>`).join('')}</ol>`;
    return `<section class="container section tight order-detail">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/orders">My Orders</a> <span aria-hidden="true">/</span> <span>${esc(o.id)}</span></nav>
      <div class="od-head"><div><h1>Order ${esc(o.id)}</h1><p class="muted">Placed ${fmtDate(o.createdAt)}</p></div>${statusPill(o.status)}</div>
      ${timeline}
      <div class="confirm-grid">
        <div class="card"><h2>Items</h2>${orderItemsHTML(o)}${orderTotalsHTML(o)}${o.couponCode ? `<p class="muted small">Promo used: ${esc(o.couponCode)}</p>` : ''}</div>
        <div class="card"><h2>Shipping to</h2>${addressHTML(o.shipping)}
          <h2 class="mt">Delivery</h2><p>${esc(o.delivery.label)}</p>
          <h2 class="mt">Payment</h2><p>${esc(o.payment.method)}<br><span class="muted">${esc(o.payment.status)}</span></p>
          <div class="od-actions">
            ${next ? `<button class="btn btn-outline btn-sm" data-action="advance-status" data-id="${esc(o.id)}">Demo: simulate “${next}”</button>` : ''}
            ${o.status === 'Order Placed' ? `<button class="btn btn-ghost btn-sm danger" data-action="cancel-order" data-id="${esc(o.id)}">Cancel order</button>` : ''}
          </div>
          <p class="demo-note">Status changes here are a simulation. No courier or warehouse is involved.</p></div>
      </div></section>`;
  }

  /* ---------- Info pages ---------- */
  const INFO = {
    contact: { title: 'Contact', body: `<p>VELVET BLOOM is a demonstration project, so there is no real customer-service team behind it. The form below only checks your input and does not send anything.</p>
      <form id="contact-form" novalidate class="contact-form"><div class="field"><label for="c-email">Your email</label><input id="c-email" type="email" autocomplete="email"><p class="field-error" id="c-err-email" role="alert"></p></div>
      <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" rows="4"></textarea><p class="field-error" id="c-err-msg" role="alert"></p></div>
      <button class="btn btn-primary" type="submit">Send (demo)</button><p id="contact-ok" class="form-msg" role="status"></p></form>` },
    shipping: { title: 'Shipping Information', body: `<p class="demo-banner">Demo policy — sample text only.</p><ul><li>Standard delivery: 5–7 business days. Free on orders with a subtotal of ${money(CONFIG.freeShippingThreshold)} or more, otherwise ${money(CONFIG.standardFee)}.</li><li>Express delivery: 2–3 business days for ${money(CONFIG.expressFee)}.</li><li>The demo ships to India only, and nothing is really shipped.</li></ul>` },
    returns: { title: 'Returns', body: `<p class="demo-banner">Demo policy — sample text only.</p><ul><li>In a real store you might offer a 7-day return window for unworn items with tags.</li><li>Jewelry, beauty and candle items are final sale in this sample policy.</li><li>No real returns or refunds are processed here.</li></ul>` },
    faqs: { title: 'FAQs', body: `<details class="acc" open><summary>Is this a real store?</summary><p>No. VELVET BLOOM is a frontend portfolio project. Products, prices, ratings and policies are sample content.</p></details>
      <details class="acc"><summary>Are payments processed?</summary><p>No. Checkout is simulated and never asks for card, UPI or password details.</p></details>
      <details class="acc"><summary>Where is my order history kept?</summary><p>In your browser's localStorage on this device only. Clearing site data removes it.</p></details>
      <details class="acc"><summary>Which promo codes work?</summary><p>BLOOM10 (10% off, up to ${money(500)}) and WELCOME150 (${money(150)} off ${money(999)}+).</p></details>` },
  };
  function infoView() {
    const page = INFO[currentRoute.parts[1]];
    if (!page) return notFoundView();
    return `<section class="page-head"><div class="container"><h1>${page.title}</h1></div></section><section class="container section tight prose">${page.body}</section>`;
  }

  function notFoundView(msg) {
    return `<section class="container section tight">${emptyState('Page not found', msg || 'The page you were looking for does not exist.', 'Back to home', '#/', 'search').replace('<h2>', '<h1>').replace('</h2>', '</h1>')}</section>`;
  }

  /* =========================================================
     EVENTS
     ========================================================= */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link && overlay.el) { if (link.dataset.remember) rememberSearch(link.dataset.remember); closeOverlay(); }

    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;
    const id = t.dataset.id;
    switch (a) {
      case 'open-cart': openCart(); break;
      case 'open-menu': openOverlay($('#mobile-menu')); break;
      case 'open-search': openSearch(); break;
      case 'close-overlay': closeOverlay(); break;
      case 'continue-shopping': closeOverlay(); if (!location.hash.startsWith('#/shop')) location.hash = '#/shop'; break;
      case 'search-clear': { const i = $('#search-input'); i.value = ''; renderSearchResults(); i.focus(); break; }
      case 'recent-search': { const i = $('#search-input'); i.value = t.dataset.q; renderSearchResults(); i.focus(); break; }
      case 'wish': toggleWishlist(id); break;
      case 'quick-add': openQuickAdd(id); break;
      case 'quick-size': quick.size = t.dataset.value; renderQuickModal(); $('#modal .size.on')?.focus(); break;
      case 'quick-color': quick.color = t.dataset.value; renderQuickModal(); $('#modal .swatch.on')?.focus(); break;
      case 'quick-confirm': {
        const r = addToCart(quick.id, { size: quick.size, color: quick.color });
        if (!r.ok) { $('#quick-error').textContent = r.message; break; }
        closeOverlay(); afterAdd(r); break;
      }
      case 'cart-inc': changeQty(t.dataset.key, 1); break;
      case 'cart-dec': changeQty(t.dataset.key, -1); break;
      case 'cart-remove': removeLine(t.dataset.key); break;
      case 'remove-coupon': state.coupon = null; saveCoupon(); refreshCartUI(); break;
      case 'shop-cat': shop.cat = t.dataset.cat; updateCatalog(); break;
      case 'shop-toggle-filters': shop.filtersOpen = !shop.filtersOpen; updateCatalog(); break;
      case 'shop-clear': clearShopFilters(); break;
      case 'gallery': {
        $('#pdp-main-img').src = t.dataset.src;
        $$('.thumb').forEach((b) => { const on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
        break;
      }
      case 'pdp-size': pdp.size = t.dataset.value; $('#pdp-error').textContent = ''; refreshPdpOptions(); $('#pdp-options .size.on')?.focus(); break;
      case 'pdp-color': pdp.color = t.dataset.value; refreshPdpOptions(); $('#pdp-options .swatch.on')?.focus(); break;
      case 'pdp-qty': {
        const p = getProduct(pdp.id);
        const next = pdp.qty + Number(t.dataset.delta);
        const room = maxQty(p) - qtyInCart(p.id);
        pdp.qty = Math.max(1, Math.min(next, Math.max(1, room)));
        if (next > Math.max(1, room)) $('#pdp-error').textContent = `You can order up to ${maxQty(p)} of this item.`;
        else $('#pdp-error').textContent = '';
        $('#pdp-qty').textContent = pdp.qty;
        break;
      }
      case 'pdp-add': pdpAdd(false); break;
      case 'pdp-buy': pdpAdd(true); break;
      case 'advance-status': {
        const o = getOrder(id); const r = updateOrderStatus(id, o && NEXT_STATUS[o.status]);
        if (!r.ok) toast(r.message); renderRoute(); break;
      }
      case 'cancel-order':
        $('#modal-body').innerHTML = `<button class="icon-btn modal-close" data-action="close-overlay" aria-label="Close">${icon('x', 20)}</button>
          <div class="confirm-box"><h2 id="modal-title">Cancel this order?</h2><p>This will mark order ${esc(id)} as cancelled in this browser. You can't undo it.</p>
          <div class="confirm-cta"><button class="btn btn-primary" data-action="confirm-cancel" data-id="${esc(id)}">Yes, cancel order</button><button class="btn btn-outline" data-action="close-overlay">Keep order</button></div></div>`;
        openOverlay($('#modal'));
        break;
      case 'confirm-cancel': {
        const r = updateOrderStatus(id, 'Cancelled');
        closeOverlay(); toast(r.ok ? 'Order cancelled.' : r.message); renderRoute(); break;
      }
      default: break;
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'search-input') renderSearchResults();
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.filter) {
      const k = t.dataset.filter;
      shop[k] = t.type === 'checkbox' ? t.checked : t.value;
      if (k === 'min' || k === 'max') shop[k] = t.value === '' ? '' : Math.max(0, Number(t.value));
      updateCatalog();
    }
    if (t.name === 'delivery') renderCheckoutSummary();
  });

  document.addEventListener('submit', (e) => {
    const f = e.target;
    if (f.matches('.coupon-form')) { e.preventDefault(); applyCoupon($('input[name="code"]', f).value, f); return; }
    if (f.id === 'checkout-form') { e.preventDefault(); placeOrder(f); return; }
    if (f.id === 'search-form') { e.preventDefault(); const q = $('#search-input').value.trim(); if (q) { rememberSearch(q); closeOverlay(true); location.hash = `#/shop?q=${encodeURIComponent(q)}`; } return; }
    if (f.id === 'newsletter-form') {
      e.preventDefault();
      const email = $('#nl-email').value.trim(); const msg = $('#nl-msg');
      if (!EMAIL_RE.test(email)) { msg.className = 'form-msg err'; msg.textContent = 'Please enter a valid email address.'; $('#nl-email').setAttribute('aria-invalid', 'true'); return; }
      $('#nl-email').removeAttribute('aria-invalid');
      msg.className = 'form-msg ok'; msg.textContent = 'Thanks! This is a demo — your email was not saved or sent anywhere.'; f.reset(); return;
    }
    if (f.id === 'contact-form') {
      e.preventDefault();
      const em = $('#c-email').value.trim(); const m = $('#c-msg').value.trim();
      $('#c-err-email').textContent = EMAIL_RE.test(em) ? '' : 'Please enter a valid email address.';
      $('#c-err-msg').textContent = m.length >= 5 ? '' : 'Please write a short message.';
      const ok = EMAIL_RE.test(em) && m.length >= 5;
      $('#contact-ok').className = 'form-msg ' + (ok ? 'ok' : '');
      $('#contact-ok').textContent = ok ? 'Looks good! This is a demo form, so nothing was sent.' : '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.el) { e.preventDefault(); closeOverlay(); }
    trapTab(e);
    if (e.key === '/' && !overlay.el && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  // Graceful image fallback (error events do not bubble, so capture them)
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img && img.tagName === 'IMG' && !img.dataset.fb) { img.dataset.fb = '1'; img.src = FALLBACK_IMG; }
  }, true);

  window.addEventListener('hashchange', onRouteChange);

  // keep both tabs in sync if the same store is open twice
  window.addEventListener('storage', (e) => {
    if (!Object.values(KEYS).includes(e.key)) return;
    state.cart = sanitizeCart(storage.load(KEYS.cart, []));
    state.wishlist = sanitizeWishlist(storage.load(KEYS.wishlist, []));
    state.orders = sanitizeOrders(storage.load(KEYS.orders, []));
    updateBadges(); renderCart();
  });

  /* ---------- init ---------- */
  function init() {
    $('#year').textContent = new Date().getFullYear();
    hydrateIcons(document);
    updateBadges();
    renderCart();
    if (!location.hash) history.replaceState(null, '', '#/');
    onRouteChange();
  }
  init();
})();
