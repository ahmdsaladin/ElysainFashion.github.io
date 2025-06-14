// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const closeBtn = document.querySelector('.close-btn');
const searchInput = document.querySelector('.searchInput');
const productContainer = document.querySelector('.pro-container');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');

// State Management
let state = {
  products: [],
  cart: [],
  searchQuery: '',
  isLoading: false,
  error: null
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
});

// Initialize App
async function initializeApp() {
  try {
    state.isLoading = true;
    await loadProducts();
    renderProducts();
    updateCart();
  } catch (error) {
    handleError(error);
  } finally {
    state.isLoading = false;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  menuToggle?.addEventListener('click', toggleMenu);
  closeBtn?.addEventListener('click', closeMenu);

  // Search
  searchInput?.addEventListener('input', debounce(handleSearch, 300));

  // Cart
  checkoutBtn?.addEventListener('click', handleCheckout);
}

// Navigation Functions
function toggleMenu() {
  navMenu?.classList.toggle('show');
}

function closeMenu() {
  navMenu?.classList.remove('show');
}

// Search Functions
function handleSearch(e) {
  state.searchQuery = e.target.value.toLowerCase();
  renderProducts();
}

// Product Functions
async function loadProducts() {
  try {
    // Simulate API call
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to load products');
    state.products = await response.json();
  } catch (error) {
    handleError(error);
    state.products = []; // Fallback to empty array
  }
}

function renderProducts() {
  if (!productContainer) return;

  const filteredProducts = state.products.filter(product => 
    product.name.toLowerCase().includes(state.searchQuery)
  );

  productContainer.innerHTML = filteredProducts.map(product => `
    <div class="pro" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="pro1">
      <div class="des">
        <span>${product.brand}</span>
        <h5>${product.name}</h5>
        <div class="star">
          ${generateStars(product.rating)}
        </div>
        <h4>$${product.price}</h4>
      </div>
      <button class="btn btn-success add-to-cart" data-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `).join('');

  // Add event listeners to new buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.dataset.id;
      addToCart(productId);
    });
  });
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return `
    ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
    ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
    ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
  `;
}

// Cart Functions
function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showNotification('Product added to cart');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  updateCart();
  showNotification('Product removed from cart');
}

function updateCart() {
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = state.cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>$${item.price} x ${item.quantity}</p>
      </div>
      <button class="btn btn-danger remove-from-cart" data-id="${item.id}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.dataset.id;
      removeFromCart(productId);
    });
  });
}

// Checkout Functions
async function handleCheckout() {
  if (state.cart.length === 0) {
    showNotification('Your cart is empty', 'warning');
    return;
  }

  try {
    state.isLoading = true;
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    state.cart = [];
    updateCart();
    showNotification('Order placed successfully!', 'success');
  } catch (error) {
    handleError(error);
  } finally {
    state.isLoading = false;
  }
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function handleError(error) {
  console.error('Error:', error);
  state.error = error.message;
  showNotification(error.message, 'error');
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    state,
    addToCart,
    removeFromCart,
    handleSearch,
    handleCheckout
  };
}
