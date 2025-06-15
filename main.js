document.addEventListener('DOMContentLoaded', () => {
  // Inject header & footer partials
  ['header', 'footer'].forEach(part => {
    const placeholder = document.getElementById(`include-${part}`);
    if (placeholder) {
      fetch(`partials/${part}.html`)
        .then(res => res.text())
        .then(html => {
          placeholder.innerHTML = html;
          if (part === 'header') initNavToggle();
          if (part === 'header') initProducts();
        });
    }
  });

  function initNavToggle() {
    const toggleBtn = document.getElementById('custom-btn');
    const nav = document.getElementById('navbar');
    const closeBtn = document.querySelector('.close-btn');
    if (!toggleBtn || !nav) return;
    toggleBtn.addEventListener('click', () => nav.classList.toggle('show'));
    if (closeBtn) closeBtn.addEventListener('click', () => nav.classList.remove('show'));
  }

  function initProducts() {
    const products = [
      {
        id: 1,
        name: 'Elegant Silk Dress',
        price: 199.99,
        image: 'https://via.placeholder.com/300x400',
        category: 'Dresses',
        rating: 4.5,
        reviews: 123
      },
      {
        id: 2,
        name: 'Classic Blouse',
        price: 89.99,
        image: 'https://via.placeholder.com/300x400',
        category: 'Tops',
        rating: 4.2,
        reviews: 89
      },
      {
        id: 3,
        name: 'Leather Handbag',
        price: 149.99,
        image: 'https://via.placeholder.com/300x400',
        category: 'Accessories',
        rating: 4.8,
        reviews: 67
      },
      // Add more products as needed
    ];

    const container = document.getElementById('products-container');
    if (!container) return;

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'col-lg-3 col-md-4 col-sm-6';
      productCard.innerHTML = `
        <div class="card h-100 border-0 shadow-sm">
          <div class="position-relative">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="position-absolute top-0 end-0 p-2">
              <span class="badge bg-warning text-dark">${product.rating}★</span>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title h6">${product.name}</h5>
            <div class="d-flex justify-content-between align-items-center">
              <span class="h5 mb-0">$${product.price.toFixed(2)}</span>
              <button class="btn btn-sm btn-outline-primary">Add to Cart</button>
            </div>
            <div class="text-muted mt-2">
              <i class="fas fa-star text-warning"></i>
              <span class="ms-1">${product.reviews} reviews</span>
            </div>
          </div>
        </div>
      `;
      container.appendChild(productCard);
    });

    // Handle search functionality
    const searchInput = document.getElementById('sea');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = container.querySelectorAll('.card');
        cards.forEach(card => {
          const productName = card.querySelector('.card-title').textContent.toLowerCase();
          if (productName.includes(searchTerm)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // Handle category filtering
    const categoryDropdown = container.closest('.search-bar')?.querySelector('.dropdown-toggle');
    if (categoryDropdown) {
      categoryDropdown.addEventListener('click', () => {
        const selectedCategory = categoryDropdown.textContent;
        const cards = container.querySelectorAll('.card');
        cards.forEach(card => {
          const productCategory = card.dataset.category || 'All Categories';
          if (selectedCategory === 'Categories' || selectedCategory === 'All Categories' || productCategory === selectedCategory) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  }
});
