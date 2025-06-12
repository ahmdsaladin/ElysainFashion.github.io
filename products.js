const productContainer = document.querySelector(".pro-container");
const paginationContainer = document.querySelector(".pagination");

function getRandomStars() {
  return Math.floor(Math.random() * 5) + 1;
}

function Randomprice() {
  return Math.floor(Math.random() * 300) + 1;
}

let allProducts = [];
let currentPage = 1;
const productsPerPage = 8;

function displayProducts(products) {
  productContainer.innerHTML = "";

  let productsHTML = products.map((product) => {
    let starsCount = getRandomStars();
    let starsHTML = "";
    let randomprice = Randomprice();

    for (let i = 0; i < starsCount; i++) {
      starsHTML += '<i class="fa-solid fa-star"></i>';
    }

    return `
      <div class="pro" id="product-${product.id}" onclick="window.location.href='productscope.html?id=${product.id}'">
        <img src="${product.image}" alt="" class="pro1" />
        <div class="des">
          <span>${product.name}</span>
          <div class="starts">${starsHTML}</div>
          <h5 class="price"> price  : ${randomprice} $</h5>
          <button type="button" class="btn btn-warning">selected</button>
        </div>
      </div>
    `;
  });

  productContainer.innerHTML = productsHTML.join("");
}
//// paginate  Function Logic .......
function paginateProducts(pageNumber, products) {
  const start = (pageNumber - 1) * productsPerPage;
  const end = start + productsPerPage;
  const slicedProducts = products.slice(start, end);

  displayProducts(slicedProducts);
}
 //// pagination ... rendring ... 
function renderPagination(products) {
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(products.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.classList.add("page-btn");
    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      paginateProducts(currentPage, products);
      renderPagination(products);
    });

    paginationContainer.appendChild(btn);
  }
}
 //// fetch the data >....
function getData() {
  axios
    .get('./Data/products.json')
    .then((response) => {
      allProducts = response.data;
      paginateProducts(currentPage, allProducts);
      renderPagination(allProducts);
    })
    .catch((error) => console.error("Error loading products:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
////////// search HAndling 
  const SearchHandler = document.getElementById("sea");

  SearchHandler.addEventListener("input", (e) => {
    const searchtarget = e.target.value.toLowerCase();
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchtarget)
    );

    currentPage = 1;

    if (filtered.length > 0) {
      paginateProducts(currentPage, filtered);
      renderPagination(filtered);
    } else {
      productContainer.innerHTML = `<div class="Noresults"> no result :( </div>`;
      paginationContainer.innerHTML = "";
    }
  });
});