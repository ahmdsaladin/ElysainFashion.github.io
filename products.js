// DOM Elements
const productContainer = document.getElementById("products-container");
const paginationContainer = document.querySelector(".pagination");
const searchInput = document.getElementById("sea");

// Product data and pagination
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;

// Utility functions
function getRandomStars() {
  return (Math.random() * 2 + 3).toFixed(1); // Returns a random number between 3.0 and 5.0 with 1 decimal
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function getRandomCategory() {
  const categories = ['Dresses', 'Tops', 'Accessories', 'New Arrivals', 'Best Sellers'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function displayProducts(products) {
  if (!productContainer) return;
  
  if (products.length === 0) {
    productContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-search mb-3" style="font-size: 3rem; color: var(--gold); opacity: 0.7;"></i>
        <h3 class="mb-3">No products found</h3>
        <p class="text-muted">Try adjusting your search or filter to find what you're looking for.</p>
        <button class="btn btn-outline-dark mt-2" onclick="resetSearch()">Clear search</button>
      </div>`;
    return;
  }

  const productsHTML = products.map((product) => {
    const rating = getRandomStars();
    const price = Math.floor(Math.random() * 200) + 20; // Random price between 20-220
    const oldPrice = Math.random() > 0.5 ? Math.floor(price * 1.3) : null; // 30% higher for old price
    const isNew = Math.random() > 0.7;
    const isSale = Math.random() > 0.8 && oldPrice;
    const category = getRandomCategory();

    return `
      <div class="col-md-4 mb-4">
        <div class="product-card h-100">
          <div class="product-image position-relative">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="img-fluid"
              onerror="this.src='https://via.placeholder.com/300x400?text=Image+Not+Available'"
            >
            ${isNew ? '<span class="product-badge">New</span>' : ''}
            ${isSale ? '<span class="product-badge" style="background: #dc3545;">Sale</span>' : ''}
            <div class="product-overlay d-flex align-items-center justify-content-center">
              <button class="btn btn-outline-light rounded-pill px-4">
                <i class="fas fa-shopping-bag me-2"></i>Add to Cart
              </button>
            </div>
          </div>
          <div class="product-info">
            <span class="product-category">${category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="d-flex align-items-center mb-2">
              <div class="text-warning me-2">
                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(rating))}
                ${rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(rating))}
                <small class="text-muted ms-1">(${rating})</small>
              </div>
            </div>
            <div class="product-price">
              ${formatPrice(price)}
              ${oldPrice ? `<span class="old-price">${formatPrice(oldPrice)}</span>` : ''}
            </div>
            <div class="product-actions">
              <button class="btn btn-sm btn-outline-dark rounded-pill">
                <i class="far fa-heart"></i>
              </button>
              <button class="btn btn-sm btn-outline-dark rounded-pill" 
                      onclick="window.location.href='productscope.html?id=${product.id}'">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  productContainer.innerHTML = productsHTML.join('');
}
// Pagination Functions
function paginateProducts(pageNumber, products) {
  const start = (pageNumber - 1) * productsPerPage;
  const end = start + productsPerPage;
  const slicedProducts = products.slice(start, end);
  
  displayProducts(slicedProducts);
  updatePagination(products.length);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePagination(totalItems) {
  if (!paginationContainer) return;
  
  const totalPages = Math.ceil(totalItems / productsPerPage);
  const pageButtons = [];
  
  // Previous button
  pageButtons.push(`
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" aria-label="Previous" ${currentPage === 1 ? 'tabindex="-1"' : ''}>
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`
  );
  
  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  if (startPage > 1) {
    pageButtons.push(`<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`);
    if (startPage > 2) {
      pageButtons.push('<li class="page-item disabled"><span class="page-link">...</span></li>');
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(`
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>`
    );
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageButtons.push('<li class="page-item disabled"><span class="page-link">...</span></li>');
    }
    pageButtons.push(`<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`);
  }
  
  // Next button
  pageButtons.push(`
    <li class="page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
      <a class="page-link" href="#" aria-label="Next" ${currentPage === totalPages || totalPages === 0 ? 'tabindex="-1"' : ''}>
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`
  );
  
  paginationContainer.querySelector('ul').innerHTML = pageButtons.join('');
  
  // Add event listeners to pagination links
  document.querySelectorAll('.page-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(link.getAttribute('data-page'));
      if (page !== currentPage) {
        currentPage = page;
        paginateProducts(currentPage, filteredProducts.length > 0 ? filteredProducts : allProducts);
      }
    });
  });
}
// Data fetching and initialization
function getData() {
  // Show loading state
  productContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-gold mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading products...</p>
    </div>`;
  
  axios
    .get('products.json')
    .then((response) => {
      allProducts = response.data.products || response.data;
      filteredProducts = [...allProducts];
      
      // Initialize with first page
      paginateProducts(1, allProducts);
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      productContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-exclamation-triangle text-danger mb-3" style="font-size: 2rem;"></i>
          <h3>Error loading products</h3>
          <p class="text-muted">Please try again later.</p>
          <button class="btn btn-outline-dark mt-2" onclick="getData()">
            <i class="fas fa-sync-alt me-2"></i>Retry
          </button>
        </div>`;
    });
}

// Search functionality
function filterProducts(searchTerm = '') {
  if (!searchTerm.trim()) {
    filteredProducts = [...allProducts];
  } else {
    const searchLower = searchTerm.toLowerCase();
    filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      (product.category && product.category.toLowerCase().includes(searchLower))
    );
  }
  
  currentPage = 1;
  paginateProducts(currentPage, filteredProducts);
}

// Reset search and show all products
function resetSearch() {
  if (searchInput) searchInput.value = '';
  filterProducts('');
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  getData();
  
  // Search input handler with debounce
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterProducts(e.target.value);
      }, 300);
    });
  }
  
  // Category filter
  document.querySelectorAll('.category-filter').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.getAttribute('data-category');
      if (category === 'all') {
        filterProducts('');
      } else {
        filterProducts(category);
      }
    });
  });
  
  // Add to cart functionality (example)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart')) {
      e.preventDefault();
      const productId = e.target.closest('[data-product-id]')?.getAttribute('data-product-id');
      if (productId) {
        // Here you would typically add to cart logic
        console.log('Added to cart:', productId);
        // Show added to cart notification
        const toast = new bootstrap.Toast(document.getElementById('addedToCartToast'));
        toast.show();
      }
    }
  });
});

// Make functions available globally
window.resetSearch = resetSearch;
      paginateProducts(currentPage, filtered);
      renderPagination(filtered);
    } else {
      productContainer.innerHTML = `<div class="Noresults"> no result :( </div>`;
      paginationContainer.innerHTML = "";
    }
  });
});