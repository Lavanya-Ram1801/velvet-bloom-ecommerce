/* =========================================================
   VELVET BLOOM — product data & store configuration
   Everything here is DEMONSTRATION content: products, prices,
   ratings and review counts are sample data, not real customers.
   ========================================================= */
'use strict';

const CONFIG = {
  currency: '₹',
  freeShippingThreshold: 1499, // standard delivery is free at/above this subtotal
  standardFee: 99,
  expressFee: 199,
  maxQtyPerProduct: 10,
  coupons: {
    BLOOM10: { type: 'percent', value: 10, max: 500, minSubtotal: 0, label: '10% off (up to ₹500)' },
    WELCOME150: { type: 'flat', value: 150, minSubtotal: 999, label: '₹150 off orders of ₹999+' },
  },
};

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', note: '5–7 business days (demo estimate)' },
  { id: 'express', label: 'Express Delivery', note: '2–3 business days (demo estimate)' },
];

const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on Delivery', note: 'Pay when your order arrives (simulated).', status: 'Pay on delivery (demo)' },
  { id: 'demo-online', label: 'Demo Online Payment', note: 'Simulated only. No card or UPI details are requested and no money moves.', status: 'Demo payment simulated — no real charge' },
];

const ORDER_FLOW = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const CATEGORIES = [
  { id: 'clothing', name: 'Clothing', label: 'Soft silhouettes for every day', image: 'assets/images/cat-clothing.svg' },
  { id: 'accessories', name: 'Bags & Accessories', label: 'Finishing touches, carried well', image: 'assets/images/cat-accessories.svg' },
  { id: 'jewelry', name: 'Jewelry', label: 'Delicate pieces that glow', image: 'assets/images/cat-jewelry.svg' },
  { id: 'beauty', name: 'Beauty', label: 'Essentials for your ritual', image: 'assets/images/cat-beauty.svg' },
  { id: 'lifestyle', name: 'Lifestyle', label: 'Small joys for your space', image: 'assets/images/cat-lifestyle.svg' },
];

const CATEGORY_ALIASES = {
  clothing: ['clothing', 'clothes', 'apparel'],
  accessories: ['accessories', 'accessory'],
  jewelry: ['jewelry', 'jewellery'],
  beauty: ['beauty', 'makeup'],
  lifestyle: ['lifestyle', 'home'],
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const PRODUCTS = [
  // ---------- CLOTHING ----------
  {
    id: 'p01', name: 'Floral Summer Dress', category: 'clothing', price: 2499, originalPrice: 3199,
    desc: 'A breezy midi dress with a softly flared skirt and a delicate hand-drawn floral print.',
    rating: 4.7, reviews: 128, stock: 14, sizes: SIZES, featured: true, tag: 'bestseller', added: '2026-08-02',
    colors: [{ name: 'Rose', hex: '#D99BAA' }, { name: 'Cream', hex: '#F3E6D3' }, { name: 'Sage', hex: '#A9B8A0' }],
    keywords: ['dress', 'floral', 'summer', 'midi', 'frock', 'gown'],
    details: ['Lightweight viscose blend', 'Adjustable shoulder straps', 'Side pockets', 'Machine wash cold, line dry'],
  },
  {
    id: 'p02', name: 'Satin Midi Skirt', category: 'clothing', price: 1899,
    desc: 'A fluid satin skirt with a flattering elastic waist that moves beautifully.',
    rating: 4.5, reviews: 64, stock: 9, sizes: SIZES, tag: 'new', added: '2026-10-05',
    colors: [{ name: 'Champagne', hex: '#E8D5C0' }, { name: 'Berry', hex: '#743B50' }],
    keywords: ['skirt', 'satin', 'midi', 'silk'],
    details: ['Satin-finish polyester', 'Elastic waistband', 'Fully lined', 'Hand wash cold'],
  },
  {
    id: 'p03', name: 'Classic Knit Cardigan', category: 'clothing', price: 2299, originalPrice: 2799,
    desc: 'A cosy button-front cardigan in a soft, breathable knit for layering all season.',
    rating: 4.6, reviews: 87, stock: 11, sizes: SIZES, featured: true, added: '2026-07-18',
    colors: [{ name: 'Oatmeal', hex: '#D9C3B0' }, { name: 'Rose', hex: '#D99BAA' }],
    keywords: ['cardigan', 'knit', 'sweater', 'winter', 'layer', 'jacket'],
    details: ['Cotton-acrylic blend', 'Pearl-effect buttons', 'Relaxed fit', 'Gentle machine wash, dry flat'],
  },
  {
    id: 'p04', name: 'Everyday Linen Top', category: 'clothing', price: 1299,
    desc: 'A relaxed linen-blend top that keeps you cool and put-together from morning to evening.',
    rating: 4.4, reviews: 203, stock: 22, sizes: SIZES, tag: 'bestseller', added: '2026-06-10',
    colors: [{ name: 'White', hex: '#F1E9E4' }, { name: 'Blush', hex: '#F4DDE3' }, { name: 'Sage', hex: '#A9B8A0' }],
    keywords: ['top', 'linen', 'shirt', 'blouse', 'tee', 'casual'],
    details: ['Linen-cotton blend', 'Relaxed fit', 'Machine wash cold', 'Iron on medium heat'],
  },
  {
    id: 'p05', name: 'Soft Lounge Set', category: 'clothing', price: 2799,
    desc: 'A matching top and trouser set in brushed jersey, made for slow weekends.',
    rating: 4.8, reviews: 92, stock: 7, sizes: SIZES, tag: 'new', featured: true, added: '2026-10-12',
    colors: [{ name: 'Mauve', hex: '#B89AA6' }, { name: 'Cream', hex: '#E9D8CC' }],
    keywords: ['lounge', 'set', 'loungewear', 'pyjama', 'pajama', 'co-ord', 'comfy'],
    details: ['Brushed cotton jersey', 'Two-piece set', 'Elastic waist with drawcord', 'Machine wash cold'],
  },

  // ---------- BAGS & ACCESSORIES ----------
  {
    id: 'p06', name: 'Mini Shoulder Bag', category: 'accessories', price: 1999, originalPrice: 2499,
    desc: 'A structured mini bag with a gold-tone clasp and a detachable strap.',
    rating: 4.7, reviews: 156, stock: 12, featured: true, tag: 'bestseller', added: '2026-07-01',
    colors: [{ name: 'Berry', hex: '#743B50' }, { name: 'Cream', hex: '#F1E9E4' }, { name: 'Rose', hex: '#D99BAA' }],
    keywords: ['bag', 'handbag', 'purse', 'shoulder', 'mini'],
    details: ['Vegan leather', 'Magnetic flap closure', 'Fits phone, cards and lipstick', 'Wipe clean with a damp cloth'],
  },
  {
    id: 'p07', name: 'Everyday Tote', category: 'accessories', price: 1599,
    desc: 'A roomy canvas-blend tote with an inner pocket, perfect for work and weekends.',
    rating: 4.3, reviews: 71, stock: 18, added: '2026-05-20',
    colors: [{ name: 'Taupe', hex: '#B6A39B' }, { name: 'Berry', hex: '#743B50' }],
    keywords: ['bag', 'tote', 'shopper', 'work', 'carryall'],
    details: ['Canvas-blend body', 'Inner zip pocket', 'Reinforced handles', 'Spot clean only'],
  },
  {
    id: 'p08', name: 'Quilted Crossbody Bag', category: 'accessories', price: 2199,
    desc: 'A softly quilted crossbody with an adjustable chain-style strap.',
    rating: 4.6, reviews: 48, stock: 6, tag: 'new', added: '2026-10-09',
    colors: [{ name: 'Blush', hex: '#E8B8C3' }, { name: 'Berry', hex: '#743B50' }],
    keywords: ['bag', 'crossbody', 'quilted', 'purse', 'sling'],
    details: ['Vegan leather, quilted finish', 'Adjustable strap', 'Zip closure', 'Wipe clean'],
  },
  {
    id: 'p09', name: 'Silk Hair Ribbon', category: 'accessories', price: 399,
    desc: 'A pure-feel silk-blend ribbon to tie into hair, around a bag handle or a ponytail.',
    rating: 4.5, reviews: 310, stock: 40, tag: 'bestseller', added: '2026-04-15',
    colors: [{ name: 'Rose', hex: '#D99BAA' }, { name: 'Cream', hex: '#F1E9E4' }, { name: 'Berry', hex: '#743B50' }],
    keywords: ['ribbon', 'hair', 'bow', 'scrunchie', 'silk', 'tie'],
    details: ['Silk-blend satin', 'Approx. 120 cm length', 'Hand wash cold'],
  },
  {
    id: 'p10', name: 'Minimalist Sunglasses', category: 'accessories', price: 899,
    desc: 'Softly rounded frames with UV400 lenses, light enough to wear all day.',
    rating: 4.2, reviews: 59, stock: 25, added: '2026-06-02',
    colors: [{ name: 'Tortoise', hex: '#8A5A44' }, { name: 'Black', hex: '#30252A' }],
    keywords: ['sunglasses', 'shades', 'eyewear', 'glasses', 'sun'],
    details: ['UV400 lenses', 'Lightweight acetate-style frame', 'Includes soft pouch'],
  },

  // ---------- JEWELRY ----------
  {
    id: 'p11', name: 'Pearl Pendant Necklace', category: 'jewelry', price: 1199, originalPrice: 1499,
    desc: 'A single lustrous faux pearl on a fine gold-tone chain.',
    rating: 4.8, reviews: 174, stock: 16, featured: true, tag: 'bestseller', added: '2026-06-28',
    keywords: ['pearl', 'necklace', 'pendant', 'chain', 'gold'],
    details: ['Gold-plated brass chain', 'Faux pearl pendant', '45 cm + 5 cm extender', 'Avoid water and perfume'],
  },
  {
    id: 'p12', name: 'Golden Hoop Earrings', category: 'jewelry', price: 799,
    desc: 'Lightweight everyday hoops with a high-polish gold-tone finish.',
    rating: 4.5, reviews: 118, stock: 30, added: '2026-05-05',
    keywords: ['earrings', 'hoops', 'hoop', 'gold', 'ear'],
    details: ['Gold-plated brass', 'Hypoallergenic posts', '30 mm diameter', 'Store in the pouch provided'],
  },
  {
    id: 'p13', name: 'Delicate Layered Necklace', category: 'jewelry', price: 1399,
    desc: 'Two fine chains with a tiny disc and drop charm, already layered for you.',
    rating: 4.6, reviews: 53, stock: 10, tag: 'new', featured: true, added: '2026-10-14',
    keywords: ['necklace', 'layered', 'chain', 'charm', 'gold'],
    details: ['Gold-plated brass', 'Two-layer design', 'Adjustable length', 'Avoid water and perfume'],
  },
  {
    id: 'p14', name: 'Floral Stud Earrings', category: 'jewelry', price: 599, originalPrice: 799,
    desc: 'Tiny blossom studs with a pearl-like centre, sweet but never fussy.',
    rating: 4.4, reviews: 97, stock: 35, added: '2026-03-12',
    keywords: ['earrings', 'studs', 'stud', 'floral', 'flower', 'pearl'],
    details: ['Plated alloy', 'Hypoallergenic posts', '12 mm blossom'],
  },
  {
    id: 'p15', name: 'Minimalist Bracelet', category: 'jewelry', price: 699,
    desc: 'A slim chain bracelet with a tiny flower charm and an adjustable clasp.',
    rating: 4.3, reviews: 41, stock: 20, added: '2026-04-01',
    colors: [{ name: 'Gold', hex: '#C9A27A' }, { name: 'Rose Gold', hex: '#E0A99A' }],
    keywords: ['bracelet', 'chain', 'charm', 'wrist', 'gold'],
    details: ['Plated brass', 'Adjustable 15–19 cm', 'Avoid water and perfume'],
  },

  // ---------- BEAUTY ----------
  {
    id: 'p16', name: 'Vanity Makeup Pouch', category: 'beauty', price: 599,
    desc: 'A roomy zip pouch with a wipe-clean lining for your daily makeup.',
    rating: 4.6, reviews: 142, stock: 28, tag: 'bestseller', added: '2026-05-25',
    colors: [{ name: 'Blush', hex: '#E8B8C3' }, { name: 'Berry', hex: '#743B50' }],
    keywords: ['pouch', 'makeup', 'cosmetic', 'bag', 'case', 'vanity'],
    details: ['Water-resistant fabric', 'Wipe-clean lining', 'Smooth zip closure'],
  },
  {
    id: 'p17', name: 'Makeup Brush Set', category: 'beauty', price: 1299, originalPrice: 1699,
    desc: 'Five soft, densely packed brushes for face and eyes with a travel roll.',
    rating: 4.7, reviews: 220, stock: 15, featured: true, added: '2026-06-20',
    keywords: ['brush', 'brushes', 'makeup', 'set', 'blush', 'foundation', 'eyeshadow'],
    details: ['Vegan synthetic bristles', '5 brushes', 'Includes travel roll', 'Wash gently with mild soap'],
  },
  {
    id: 'p18', name: 'Travel Beauty Organizer', category: 'beauty', price: 999,
    desc: 'A compact zip organizer with compartments for skincare, makeup and tools.',
    rating: 4.5, reviews: 38, stock: 13, tag: 'new', added: '2026-10-17',
    colors: [{ name: 'Oatmeal', hex: '#C9A890' }, { name: 'Rose', hex: '#D99BAA' }],
    keywords: ['organizer', 'organiser', 'travel', 'makeup', 'bag', 'case', 'skincare'],
    details: ['Water-resistant fabric', 'Removable dividers', 'Wipe clean'],
  },
  {
    id: 'p19', name: 'Compact Cosmetic Mirror', category: 'beauty', price: 449,
    desc: 'A pocket-size mirror in a gold-tone frame, sold out for now — check back soon.',
    rating: 4.4, reviews: 76, stock: 0, added: '2026-02-18',
    keywords: ['mirror', 'compact', 'makeup', 'pocket', 'cosmetic'],
    details: ['Metal frame', '7 cm glass mirror', 'Includes cover'],
  },

  // ---------- LIFESTYLE ----------
  {
    id: 'p20', name: 'Floral Ceramic Mug', category: 'lifestyle', price: 549,
    desc: 'A hand-finished ceramic mug with a tiny blossom print for slow mornings.',
    rating: 4.6, reviews: 84, stock: 24, added: '2026-07-07',
    keywords: ['mug', 'cup', 'ceramic', 'tea', 'coffee', 'floral', 'kitchen'],
    details: ['Ceramic', '300 ml', 'Dishwasher and microwave safe'],
  },
  {
    id: 'p21', name: 'Scented Candle', category: 'lifestyle', price: 799,
    desc: 'A soy-blend candle in a keepsake jar, with a gentle fragrance that fills the room.',
    rating: 4.7, reviews: 133, stock: 19, colorLabel: 'Scent', added: '2026-08-20',
    colors: [{ name: 'Rose', hex: '#E8B8C3' }, { name: 'Vanilla', hex: '#F1E3C8' }, { name: 'Fig', hex: '#8E6B5E' }],
    keywords: ['candle', 'scented', 'fragrance', 'home', 'decor', 'soy', 'aroma'],
    details: ['Soy-blend wax', 'Approx. 40 hours burn time', 'Trim the wick to 5 mm before lighting', 'Never leave a burning candle unattended'],
  },
  {
    id: 'p22', name: 'Mini Jewelry Organizer', category: 'lifestyle', price: 899,
    desc: 'A small hinged box with ring rolls and a hook for necklaces.',
    rating: 4.5, reviews: 57, stock: 8, tag: 'new', added: '2026-10-19',
    keywords: ['jewelry', 'jewellery', 'organizer', 'organiser', 'box', 'storage', 'ring', 'travel'],
    details: ['Faux-leather finish', 'Soft velvet interior', 'Fits rings, earrings and a few necklaces'],
  },
].map((p) => ({
  ...p,
  image: `assets/images/${p.id}.svg`,
  images: [`assets/images/${p.id}.svg`, `assets/images/${p.id}-b.svg`],
}));
