// E-Commerce Marketplace JavaScript
// Shopping Cart, Wishlist, Search, Reviews

class MarketplaceApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        this.init();
    }

    init() {
        this.attachCartListeners();
        this.attachWishlistListeners();
        this.attachSearchListeners();
        this.attachReviewListeners();
        this.updateUI();
    }

    // Shopping Cart Methods
    addToCart(productId, name, price, quantity = 1) {
        const item = this.cart.find(i => i.id === productId);
        if (item) {
            item.quantity += quantity;
        } else {
            this.cart.push({id: productId, name, price, quantity});
        }
        this.saveCart();
        this.showNotification(name + ' added to cart!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateUI();
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Wishlist Methods
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showNotification('Removed from wishlist', 'info');
        } else {
            this.wishlist.push(productId);
            this.showNotification('Added to wishlist! ❤️', 'success');
        }
        this.saveWishlist();
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.updateUI();
    }

    // Search Methods
    searchProducts(query) {
        const products = document.querySelectorAll('[data-product-card]');
        const lowerQuery = query.toLowerCase();
        
        products.forEach(product => {
            const name = product.getAttribute('data-product-name').toLowerCase();
            const category = product.getAttribute('data-product-category').toLowerCase();
            const matches = name.includes(lowerQuery) || category.includes(lowerQuery);
            product.style.display = matches ? 'grid' : 'none';
        });
    }

    // Review Methods
    submitReview(productId, rating, text) {
        console.log({productId, rating, text});
        this.showNotification('Review posted! Thank you!', 'success');
    }

    // UI Methods
    updateUI() {
        const cartBadge = document.querySelector('[data-cart-badge]');
        const wishlistBadge = document.querySelector('[data-wishlist-badge]');
        
        if (cartBadge) cartBadge.textContent = this.getCartCount();
        if (wishlistBadge) wishlistBadge.textContent = this.wishlist.length;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Event Listeners
    attachCartListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-add-to-cart]')) {
                const btn = e.target.closest('[data-add-to-cart]');
                const card = btn.closest('[data-product-card]');
                const id = card.dataset.productId;
                const name = card.dataset.productName;
                const price = parseFloat(card.dataset.productPrice);
                this.addToCart(id, name, price);
            }
        });
    }

    attachWishlistListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-wishlist-btn]')) {
                const btn = e.target.closest('[data-wishlist-btn]');
                const card = btn.closest('[data-product-card]');
                const id = card.dataset.productId;
                this.toggleWishlist(id);
            }
        });
    }

    attachSearchListeners() {
        const searchInput = document.querySelector('[data-search-box]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
    }

    attachReviewListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-submit-review]')) {
                const btn = e.target.closest('[data-submit-review]');
                const form = btn.closest('[data-review-form]');
                const productId = form.dataset.productId;
                const rating = form.querySelector('[data-rating-input]').value;
                const text = form.querySelector('[data-review-text]').value;
                
                if (text.trim()) {
                    this.submitReview(productId, rating, text);
                    form.querySelector('[data-review-text]').value = '';
                } else {
                    this.showNotification('Please write a review', 'error');
                }
            }
        });
    }
}

// Initialize app
window.app = new MarketplaceApp();
document.addEventListener('DOMContentLoaded', () => {
    console.log('E-Commerce Marketplace Initialized');
});
