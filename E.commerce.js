function getRandomStars() {
    return Math.floor(Math.random() * 5) + 1;
  }
  
  function Randomprice() {
    return Math.floor(Math.random() * 300) + 1;
  }
  
  
  axios
    .get('./Data/products.json')
    .then((response) => {
      let products = response.data;
      let productContainer = document.querySelector(".pro-container");
  
      let productsHTML = products.map((product) => {
        let starsCount = getRandomStars();
        let starsHTML = "";
        let randomprice = Randomprice();
  
        for (let i = 0; i < starsCount; i++) {
          starsHTML += '<i class="fa-solid fa-star"></i>';
        }
  
        return `
          <div class="pro" >
            <img src="${product.image}" alt="" class="pro1" />
            <div class="des">
              <span>${product.name}</span>
              <div class="starts">
                ${starsHTML} 
              </div>
              <h5 class="price">${randomprice} $</h5>
              <div class="shopping">
                <i class="fa-solid fa-cart-shopping" id="basket"></i>
                
              </div>
             
            </div>
          </div>
        `;
      });
  
      productContainer.innerHTML += productsHTML.join(""); 
      function getRandomStars() {
    return Math.floor(Math.random() * 5) + 1;
  }
  
  function Randomprice() {
    return Math.floor(Math.random() * 300) + 1;
  }
  
 
     
    

  
      
    })
    .catch((error) => console.error("Error loading products:", error));
    console.log(getEventListeners(document));

  
     
    

  