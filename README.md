<div align="center">

# 🌸 V E L V E T   B L O O M

### *Your Style, Your Story.*

**A little luxury. A lot of personality. A boutique experience built with code.**

A premium, feminine e-commerce website designed and developed as a personal frontend project.

<br>

![HTML5](https://img.shields.io/badge/HTML5-FFE4E9?style=for-the-badge\&logo=html5\&logoColor=C44569)
![CSS3](https://img.shields.io/badge/CSS3-F8D7E8?style=for-the-badge\&logo=css3\&logoColor=A23B72)
![JavaScript](https://img.shields.io/badge/JavaScript-FCECC9?style=for-the-badge\&logo=javascript\&logoColor=9A6700)
![Responsive](https://img.shields.io/badge/Responsive-EEE5FF?style=for-the-badge\&logo=responsive\&logoColor=7048A8)

<br>

**✦ 22 Products   ✦ 5 Categories   ✦ 100% Frontend   ✦ Zero Build Tools**

</div>

---

## 💗 A Little About the Project

Welcome to **VELVET BLOOM** — a boutique shopping experience inspired by feminine elegance, modern fashion, and the beauty of minimal design.

I created this project to bring the feeling of a premium online fashion boutique into a responsive, interactive website. From exploring products and saving favourites to placing a demo order, the experience is designed to feel cohesive, intuitive, and enjoyable.

This isn't just a static storefront. It brings together product discovery, shopping cart management, wishlists, checkout validation, and order history using **HTML, CSS, and Vanilla JavaScript**.

> *Every detail matters. Every interaction has a purpose. Every style tells a story.*

### ✨ The Vision

Create an online boutique that feels less like browsing a catalogue and more like stepping into a thoughtfully curated fashion store.

|     | Design Philosophy                                                                   |
| :-: | ----------------------------------------------------------------------------------- |
|  🎀 | **Feminine & Elegant** — soft blush tones, warm neutrals, and editorial typography. |
| 🛍️ | **Interactive by Design** — shopping features that work directly in the browser.    |
|  📱 | **Made for Every Screen** — responsive layouts for desktop, tablet, and mobile.     |
|  🧵 | **Simple Technology** — clean frontend development without unnecessary frameworks.  |

---

## 🛍️ Explore the Experience

### 01 — Discover Your Style

* Browse 22 sample products across five categories.
* Search products by name, keyword, or category.
* Filter by category, price, availability, bestseller, and new arrivals.
* Sort by featured products, price, newest arrivals, and ratings.
* Explore product details, image galleries, and related items.

### 02 — Your Personal Shopping Bag

* Add products with selected sizes and colours.
* Increase or decrease quantities with stock limits.
* View live subtotal, shipping costs, discounts, and totals.
* Track progress towards free shipping.
* Apply promotional codes:

  * `BLOOM10` — 10% off, up to ₹500.
  * `WELCOME150` — ₹150 off eligible orders of ₹999 or more.

### 03 — Save What You Love

* Add products to your wishlist.
* Keep favourite items saved between visits.
* Move wishlist products directly into your shopping bag.

### 04 — A Complete Demo Checkout

* Follow a step-by-step checkout process.
* Validate contact and delivery information.
* Choose between simulated Cash on Delivery and demo online payment.
* Generate an order confirmation and save the order locally.

### 05 — Your Orders, Your Way

* View order history and individual order details.
* Follow a simulated order-status timeline.
* Demonstrate status changes from processing to delivery.
* Cancel eligible orders while they remain in the initial order-placed state.

### 06 — The Finishing Touches

* Responsive navigation and interactive overlays.
* Newsletter and contact forms with frontend validation.
* Recent-search suggestions.
* Persistent shopping data using browser storage.
* Accessible interactions and reduced-motion support.

---

## 🎨 The Aesthetic

VELVET BLOOM follows a soft, editorial-inspired visual direction.

| Element               | Design Direction                                   |
| --------------------- | -------------------------------------------------- |
| 🌷 Colour palette     | Blush pink, cream, rose, and berry                 |
| ✍️ Display typography | Playfair Display                                   |
| ◉ Body typography     | DM Sans                                            |
| 🪞 Visual identity    | Modern boutique, soft luxury, editorial minimalism |
| ✦ Icons               | Inline SVG icons                                   |
| 🖼️ Illustrations     | Locally stored SVG assets                          |

The design aims to balance visual beauty with usability, allowing the products and shopping experience to take centre stage.

---

## ⚙️ Built With

<div align="center">

| Technology                | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| **HTML5**                 | Page structure and semantic content                            |
| **CSS3**                  | Styling, responsive layouts, animations, and design tokens     |
| **Vanilla JavaScript**    | Application logic, interactions, routing, and state management |
| **LocalStorage**          | Persistence for the cart, wishlist, searches, and orders       |
| **SVG**                   | Lightweight icons, illustrations, and favicon                  |
| **Google Fonts**          | Playfair Display and DM Sans typography                        |
| **VS Code + Live Server** | Development and local testing                                  |

</div>

**No React. No build step. No npm required.**

The website runs directly in a browser, making it straightforward to explore, understand, and extend.

---

## 🗂️ Project Structure

```text
VELVET-BLOOM/
│
├── index.html              # Main page and application shell
├── style.css               # Design system and responsive styling
├── data.js                 # Product catalogue and configuration
├── script.js               # Routing, shopping logic, and interactions
├── README.md               # Project documentation
│
└── assets/
    ├── favicon.svg
    └── images/
        ├── Product illustrations
        ├── Category illustrations
        ├── Hero artwork
        └── Promotional graphics
```

---

## 🚀 Run It Locally

Want to explore VELVET BLOOM on your own computer?

### Prerequisites

* [Visual Studio Code](https://code.visualstudio.com/)
* A modern web browser
* The **Live Server** extension for VS Code (recommended)

### Installation

**1. Clone the repository**

Replace `YOUR-USERNAME` with your GitHub username.

```bash
git clone https://github.com/YOUR-USERNAME/velvet-bloom-ecommerce.git
```

**2. Open the project**

```bash
cd velvet-bloom-ecommerce
code .
```

Alternatively, open the downloaded project folder directly in VS Code.

**3. Launch the website**

Open `index.html`, right-click inside the editor, and select:

`Open with Live Server`

Your website should open in your browser at an address similar to:

```text
http://127.0.0.1:5500/
```

That's it! No package installation or build command is needed.

---

## 🧠 Under the Hood

### Lightweight Client-Side Routing

A small hash-based router renders the appropriate page without requiring a separate backend.

Supported views include the home page, shop, product details, wishlist, checkout, confirmation, order history, order details, and informational pages.

### Persistent Shopping Experience

The browser's `localStorage` stores supported shopping data between visits. Saved information is checked against the product catalogue when the application loads.

### Reliable Price Calculations

Product prices come from the project's data file. Cart totals, discounts, and shipping charges are recalculated by the frontend rather than trusted from displayed page content.

### A Complete Demonstration Flow

The application connects product discovery, cart management, checkout validation, order creation, confirmation, and order history into one browser-based experience.

**Important:** These are frontend demonstrations, not server-enforced security guarantees. A production e-commerce application would need trusted backend validation and persistent server-side storage.

---

## 🧪 Testing & Quality

The project was designed around the core shopping journey:

* [x] Product browsing and search
* [x] Combined filtering and sorting
* [x] Shopping cart and quantity controls
* [x] Wishlist functionality
* [x] Promotional discounts and shipping calculations
* [x] Checkout validation
* [x] Demo order creation and confirmation
* [x] Order history and cancellation rules
* [x] Browser storage persistence

The project's core flows were exercised using an automated `jsdom` test script. Visual testing across real desktop, tablet, and mobile browsers should also be performed.

---

## ⚠️ Important Limitations

VELVET BLOOM is a **portfolio and learning project**, not a production-ready online store.

* **Payments:** No real transactions are processed.
* **Backend:** No server, production database, or user authentication exists.
* **Orders:** Order information is stored locally in the browser.
* **Delivery:** Shipping and tracking are simulated.
* **Inventory:** Sample stock information is not connected to a live inventory system.
* **Products:** Catalogue details, ratings, and illustrations are demonstration content.
* **Forms:** Contact and newsletter forms validate input but do not send real messages.

Avoid entering real personal or payment information into the demo. Checkout information may be saved in your browser's local storage.

---

## 🌱 What's Next?

VELVET BLOOM is a foundation that can grow beyond the browser.

Potential future improvements include:

* [ ] Build a backend API using Node.js and Express.
* [ ] Connect a database for products, users, and orders.
* [ ] Introduce secure authentication and account management.
* [ ] Integrate a legitimate payment provider in a secure test environment.
* [ ] Add an administration dashboard and inventory management.
* [ ] Replace sample illustrations with real product photography.
* [ ] Add automated tests and continuous integration.
* [ ] Deploy a live version using GitHub Pages for the frontend demonstration.

---

## 👩🏻‍💻 The Creator

<div align="center">

### Designed with creativity. Built with code. 💗

**Created by Lavanya **

I built VELVET BLOOM as a personal frontend development project to explore how design, functionality, and user experience can come together in a modern e-commerce interface.

This project represents my hands-on work with HTML, CSS, and JavaScript, along with my interest in building interactive, responsive, and visually polished web experiences.

**My goal:** To keep learning, keep creating, and turn ideas into experiences people can enjoy.

<br>

[![GitHub](https://img.shields.io/badge/Explore%20My%20GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/Lavanya-Ram1801)

</div>

---

<div align="center">

### 🌸 VELVET BLOOM

*Your Style, Your Story.*

**A personal project made with creativity, curiosity, and code.**

If you like this project, consider giving the repository a ⭐ on GitHub!

</div>
