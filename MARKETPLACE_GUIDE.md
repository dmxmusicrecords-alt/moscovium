# E-Commerce Marketplace JavaScript Implementation Guide

**Complete JavaScript functionality for your e-commerce marketplace with shopping cart, wishlist, search, and reviews.**

---

## 📚 **Quick Start**

### Step 1: Link the JavaScript File

Add this to your `index.html` before closing `</body>` tag:

```html
<script src="marketplace.js" defer></script>
```

---

## 🛒 **Shopping Cart Implementation**

### HTML Structure for Products

```html
<!-- Product Card -->
<div 
    data-product-card
    data-product-id="prod_001"
    data-product-name="Premium Headphones"
    data-product-category="Electronics"
    data-product-price="79.99"
    class="product-card"
>
    <img src="product.jpg" alt="Premium Headphones">
    <h3>Premium Headphones</h3>
    <p class="price">$79.99</p>
    
    <!-- Add to Cart Button -->
    <button data-add-to-cart class="btn-primary">
        🛒 Add to Cart
    </button>
    
    <!-- Wishlist Button -->
    <button data-wishlist-btn class="btn-icon">
        ❤️ Add to Wishlist
    </button>
</div>
```

### Cart Counter Display

```html
<!-- Display in Header -->
<a href="#cart" class="cart-link">
    🛒 Cart
    <span data-cart-badge class="badge">0</span>
</a>

<!-- Display Wishlist Count -->
<a href="#wishlist" class="wishlist-link">
    ❤️ Wishlist
    <span data-wishlist-badge class="badge">0</span>
</a>
```

### JavaScript Usage

```javascript
// Add item to cart
app.addToCart('prod_001', 'Premium Headphones', 79.99, 1);

// Remove from cart
app.removeFromCart('prod_001');

// Get cart total
const total = app.getCartTotal(); // Returns: 79.99
console.log('Total: $' + total);

// Get item count
const count = app.getCartCount(); // Returns: 1
console.log('Items: ' + count);
```

---

## ❤️ **Wishlist Implementation**

### HTML Structure

```html
<!-- Wishlist Button on Product Card -->
<button 
    data-wishlist-btn 
    class="btn-icon wishlist-icon"
    title="Add to Wishlist"
>
    ❤️
</button>

<!-- Wishlist Display -->
<div class="wishlist-container">
    <h2>My Wishlist</h2>
    <div id="wishlist-items"></div>
</div>
```

### JavaScript Usage

```javascript
// Toggle wishlist
app.toggleWishlist('prod_001');

// Check if in wishlist
const isWishlisted = app.wishlist.includes('prod_001');

// Get wishlist count
const count = app.wishlist.length;
```

---

## 🔍 **Search Implementation**

### HTML Structure

```html
<!-- Search Box -->
<input 
    type="search"
    data-search-box
    placeholder="Search products..."
    class="search-input"
>

<!-- Product Grid -->
<div class="products-grid">
    <div 
        data-product-card
        data-product-id="prod_001"
        data-product-name="Premium Headphones"
        data-product-category="Electronics"
        class="product-card"
    >
        <!-- Product content -->
    </div>
    
    <div 
        data-product-card
        data-product-id="prod_002"
        data-product-name="Wireless Charger"
        data-product-category="Accessories"
        class="product-card"
    >
        <!-- Product content -->
    </div>
</div>
```

### How It Works

Search filters products by:
- Product name
- Product category
- Case-insensitive matching
- Real-time filtering

**Example:**
- Search "headphones" → Shows Premium Headphones
- Search "electronics" → Shows all electronics
- Search "wire" → Shows Wireless Charger

---

## ⭐ **Product Reviews Implementation**

### HTML Structure

```html
<!-- Review Form -->
<form data-review-form data-product-id="prod_001" class="review-form">
    <h3>Leave a Review</h3>
    
    <!-- Rating Input -->
    <div class="form-group">
        <label for="rating">Rating:</label>
        <select data-rating-input id="rating">
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
        </select>
    </div>
    
    <!-- Review Text -->
    <div class="form-group">
        <label for="review">Your Review:</label>
        <textarea 
            data-review-text 
            id="review"
            placeholder="Share your thoughts..."
            rows="4"
        ></textarea>
    </div>
    
    <!-- Submit Button -->
    <button type="button" data-submit-review class="btn-primary">
        Submit Review
    </button>
</form>

<!-- Display Reviews -->
<div class="reviews-section">
    <h3>Customer Reviews</h3>
    <div class="reviews-list">
        <div class="review-item">
            <strong>John Doe</strong> - ⭐⭐⭐⭐⭐
            <p>Excellent product! Highly recommended.</p>
        </div>
    </div>
</div>
```

### JavaScript Usage

```javascript
// Review data is automatically handled
// Just submit the form with data-submit-review button
// The app will:
// 1. Get product ID from form
// 2. Get rating and text
// 3. Validate input
// 4. Show success notification
// 5. Clear form
```

---

## 📝 **Complete HTML Example**

Here's a full working example for your `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Marketplace</title>
    <style>
        .product-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        .btn-primary { background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; }
        .btn-primary:hover { background: #059669; }
        .badge { background: #ef4444; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px; }
        .search-input { padding: 10px; border: 1px solid #ddd; border-radius: 6px; width: 100%; max-width: 400px; }
        .notification { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <!-- Header -->
    <header style="padding: 20px; background: #f3f4f6; display: flex; gap: 20px; align-items: center;">
        <h1>🛍️ Marketplace</h1>
        <input type="search" data-search-box placeholder="Search products..." class="search-input">
        <a href="#cart" class="cart-link">
            🛒 Cart <span data-cart-badge class="badge">0</span>
        </a>
        <a href="#wishlist" class="wishlist-link">
            ❤️ Wishlist <span data-wishlist-badge class="badge">0</span>
        </a>
    </header>

    <!-- Products Grid -->
    <main style="padding: 40px;">
        <h2>Featured Products</h2>
        <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
            
            <!-- Product 1 -->
            <div 
                data-product-card
                data-product-id="prod_001"
                data-product-name="Premium Headphones"
                data-product-category="Electronics"
                data-product-price="79.99"
                class="product-card"
            >
                <h3>Premium Headphones</h3>
                <p style="color: #10b981; font-size: 20px; font-weight: bold;">$79.99</p>
                <p>High-quality audio with noise cancellation</p>
                <button data-add-to-cart class="btn-primary" style="width: 100%; margin-bottom: 10px;">
                    🛒 Add to Cart
                </button>
                <button data-wishlist-btn style="width: 100%; padding: 10px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">
                    ❤️ Add to Wishlist
                </button>
            </div>

            <!-- Product 2 -->
            <div 
                data-product-card
                data-product-id="prod_002"
                data-product-name="Wireless Charger"
                data-product-category="Accessories"
                data-product-price="29.99"
                class="product-card"
            >
                <h3>Wireless Charger</h3>
                <p style="color: #10b981; font-size: 20px; font-weight: bold;">$29.99</p>
                <p>Fast charging for all Qi-enabled devices</p>
                <button data-add-to-cart class="btn-primary" style="width: 100%; margin-bottom: 10px;">
                    🛒 Add to Cart
                </button>
                <button data-wishlist-btn style="width: 100%; padding: 10px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">
                    ❤️ Add to Wishlist
                </button>
            </div>

            <!-- Product 3 -->
            <div 
                data-product-card
                data-product-id="prod_003"
                data-product-name="Phone Case"
                data-product-category="Accessories"
                data-product-price="19.99"
                class="product-card"
            >
                <h3>Phone Case</h3>
                <p style="color: #10b981; font-size: 20px; font-weight: bold;">$19.99</p>
                <p>Durable protection for your smartphone</p>
                <button data-add-to-cart class="btn-primary" style="width: 100%; margin-bottom: 10px;">
                    🛒 Add to Cart
                </button>
                <button data-wishlist-btn style="width: 100%; padding: 10px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">
                    ❤️ Add to Wishlist
                </button>
            </div>

        </div>
    </main>

    <!-- Review Section -->
    <section style="padding: 40px; background: #f9fafb; margin-top: 40px;">
        <h2>Product Reviews</h2>
        <form data-review-form data-product-id="prod_001" class="review-form" style="max-width: 500px; margin-top: 20px;">
            <div style="margin-bottom: 15px;">
                <label for="rating" style="display: block; margin-bottom: 5px;">Rating:</label>
                <select data-rating-input id="rating" style="padding: 8px; width: 100%; border: 1px solid #ddd; border-radius: 6px;">
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                    <option value="2">⭐⭐ 2 Stars</option>
                    <option value="1">⭐ 1 Star</option>
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label for="review" style="display: block; margin-bottom: 5px;">Your Review:</label>
                <textarea 
                    data-review-text 
                    id="review"
                    placeholder="Share your thoughts..."
                    rows="4"
                    style="padding: 8px; width: 100%; border: 1px solid #ddd; border-radius: 6px; font-family: Arial;"
                ></textarea>
            </div>
            <button type="button" data-submit-review class="btn-primary">
                Submit Review
            </button>
        </form>
    </section>

    <!-- Load Marketplace JS -->
    <script src="marketplace.js" defer></script>
</body>
</html>
```

---

## 🎨 **CSS Styling Tips**

```css
/* Product Card */
.product-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

/* Buttons */
.btn-primary {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
}

.btn-primary:hover {
    background: #059669;
}

/* Search Input */
[data-search-box] {
    padding: 10px 15px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
}

/* Badge */
[data-cart-badge], [data-wishlist-badge] {
    background: #ef4444;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: bold;
}
```

---

## 💾 **Data Persistence**

### LocalStorage

Data is automatically saved to browser's localStorage:

```javascript
// Cart data
localStorage.getItem('cart')     // JSON array

// Wishlist data
localStorage.getItem('wishlist') // JSON array
```

**Example localStorage data:**
```json
{
  "cart": [
    {"id": "prod_001", "name": "Headphones", "price": 79.99, "quantity": 1}
  ],
  "wishlist": ["prod_002", "prod_003"]
}
```

---

## 🔧 **Methods Reference**

### Cart Methods
| Method | Returns | Example |
|--------|---------|---------|
| `addToCart(id, name, price, qty)` | void | `app.addToCart('p1', 'Headphones', 79.99)` |
| `removeFromCart(id)` | void | `app.removeFromCart('p1')` |
| `getCartTotal()` | number | `app.getCartTotal()` // 79.99 |
| `getCartCount()` | number | `app.getCartCount()` // 1 |
| `saveCart()` | void | `app.saveCart()` |

### Wishlist Methods
| Method | Returns | Example |
|--------|---------|---------|
| `toggleWishlist(id)` | void | `app.toggleWishlist('p1')` |
| `saveWishlist()` | void | `app.saveWishlist()` |

### Utility Methods
| Method | Returns | Example |
|--------|---------|---------|
| `searchProducts(query)` | void | `app.searchProducts('headphones')` |
| `showNotification(msg, type)` | void | `app.showNotification('Added!', 'success')` |

---

## 🎯 **Features Summary**

✅ **Shopping Cart**
- Add/remove items
- Quantity management
- Price calculation
- Persistent storage

✅ **Wishlist**
- Toggle favorites
- Heart icon integration
- Counter badge
- Persistent storage

✅ **Search**
- Real-time filtering
- Search by name & category
- Case-insensitive matching
- Instant results

✅ **Reviews**
- 5-star rating system
- Text reviews
- Form validation
- Success notifications

✅ **Notifications**
- Success messages (green)
- Error messages (red)
- Info messages (blue)
- Auto-dismiss (3 seconds)

---

## 🚀 **Deploy to GoDaddy**

1. Upload `marketplace.js` to `/public_html/`
2. Update `index.html` with product cards
3. Link `<script src="marketplace.js" defer></script>`
4. Test on https://yourdomain.com

---

**Your E-Commerce Marketplace is Ready! 🎉**

**Files in Repo:**
- `marketplace.js` - Main functionality
- This guide - Implementation help
