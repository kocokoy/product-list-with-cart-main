class ProductList{
  constructor(){
    this.CartSide = new CartSide(this);
    this.DessertSide = new DessertSide(this);
    this.itemCard = document.querySelector('.dessert_side-items');
    this.productTotalCount = document.querySelector('.card_side-title-count');
    this.listProducts = [];
  }
  
  jsonDataFetcher(){
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      this.listProducts = data;
      this.DessertSide.addDataToHTML();
      this.productTotalCount.innerHTML = `(0)`;
    })
    .catch(error => console.error('Error loading JSON:', error));
  }
}

class DessertSide{
  constructor(ProductList){
    this.ProductList = ProductList;
    this.CartSide = ProductList.CartSide;
    this.addItemToCart = ProductList.addItemToCart;
    this.cart = [];
    this.itemCount = {};
  }

  addDataToHTML(){
    this.ProductList.itemCard.innerHTML = '';
    this.CartSide.cartCard();
    this.addtoCartClicked();
   if(this.ProductList.listProducts.length > 0){
    this.ProductList.listProducts.forEach((dessert,index) => {
       let divElement = document.createElement('div');
       divElement.classList.add('dessert_side-items-card');
       divElement.dataset.id = index;
       divElement.innerHTML = `
              <div class="dessert_side-items-card-button-holder"> 
              <img class="dessert_side-items-card-image" src="${dessert.image.desktop}" alt="">
              <button class="dessert_side-items-card-button">
              <img src="/assets/images/icon-add-to-cart.svg" alt="">
              <span class="dessert_side-items-card-info-buttonname">Add to Cart</span>
              </button>
              </div>
              <div class="dessert_side-items-card-info">
                <p class="dessert_side-items-card-info-category">${dessert.category}</p>
                <p class="dessert_side-items-card-info-name">${dessert.name}</p>
                <p class="dessert_side-items-card-info-price">$${dessert.price.toFixed(2)}</p>
              </div>`;
       this.ProductList.itemCard.appendChild(divElement);
     });
   };
  };
    
  addtoCartClicked(){
    this.ProductList.itemCard.addEventListener('click', (event) => {
      const button = event.target.closest('.dessert_side-items-card-button');
     if(button && button.classList.contains('dessert_side-items-card-button')){
         const parentElement = event.target.closest('.dessert_side-items-card');
         const productId = parentElement.dataset.id;
         this.addtoCart(productId,button);
      }
    });
  };

  addtoCart(productId,button){
      const cartItem = this.cart.find(item => item.id === productId);
      const parentElement = button.closest('.dessert_side-items-card'); // Get the parent 
      const imageElement = parentElement.querySelector('.dessert_side-items-card-image');
      let item;

      if (cartItem) {
        cartItem.quantity++;
        item = cartItem;
      } else {
        item = {
          id: productId,
          name: this.ProductList.listProducts[productId].name,
          price: this.ProductList.listProducts[productId].price,
          quantity: 1
        };
        this.cart.push(item);
      }

      console.log(imageElement);
      imageElement.classList.add('dessert_side-items-card-image-selected');
      this.addToCartButtonChanged(button, item);
      this.updateCartUI(productId);

  };
 
  updateCartUI(productId) {
    const cartSide = document.querySelector('.card_side-content');
    let totalProductCount = 0;
    let subTotalPrice = 0;
    let totalPrice = [];
    cartSide.innerHTML = ''; 
    if (this.cart.length === 0) {
      this.ProductList.productTotalCount.innerHTML = `(0)`;
      const emptyCartHTML = `
        <div class="empty-cart">
          <img src="/assets/images/illustration-empty-cart.svg" alt="">
          <div class="empty-cart-text">Your added items will appear here</div>
        </div>
      `;
      cartSide.insertAdjacentHTML('afterbegin', emptyCartHTML);
      this.cart.forEach(item => {
        this.removeBorder(item.id);
    });
    }else{

      this.cart.forEach(item => {
      subTotalPrice = item.quantity*item.price;
      totalPrice.push(subTotalPrice);
        const cartItemHTML = `
        <div class="product-in-cart">
          <div class="product-in-cart-info">
            <p class="product-in-cart-info-name">${item.name}</p>
            <div class="product-in-cart-info-count-price">
              <div class="product-in-cart-info-quantity">${item.quantity}x</div>
              <div class="product-in-cart-info-price">@ $${item.price.toFixed(2)}</div>
              <div class="product-in-cart-info-subtotal">$${(subTotalPrice).toFixed(2)}</div>
            </div>
          </div>
          <div class="product-in-cart-close-button">
            <button data-id="${item.id}">
            <img src="/assets/images/icon-remove-item.svg" alt="">
            </button>
          </div>
        </div>
        `;
        totalProductCount+=item.quantity;
        this.ProductList.productTotalCount.innerHTML = `(${totalProductCount})`;  
        cartSide.insertAdjacentHTML('afterbegin', cartItemHTML);
  
      });
        this.orderTotalAmount(totalPrice,cartSide);

       // Add event listener for "X" buttons to remove items
      cartSide.querySelectorAll('.product-in-cart-close-button button').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.closest('button').dataset.id;
            this.removeItemFromCart(productId);
        });
      });

      // Add event listeners for increment/decrement buttons
      cartSide.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', (event) => {
          const productId = event.target.dataset.id;
          this.incrementItem(productId);
          console.log('test');
        });
      });
  
      cartSide.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', (event) => {
          const productId = event.target.dataset.id;
          this.decrementItem(productId);
        });
      });
    };
  };

  addToCartButtonChanged(button, item) {
    if (button.classList.contains('dessert_side-items-card-button')) {
      button.classList.remove('dessert_side-items-card-button');
      button.classList.add('dessert_side-items-card-button-clicked');
      button.innerHTML = `
        <div class='dessert_side-items-card-button-clicked-content'>
          <button class='decrement' data-id="${item.id}">
            <img src="/assets/images/icon-decrement-quantity.svg">
          </button>
          <div class="cart-quantity">${item.quantity}</div>
          <button class='increment' data-id="${item.id}">
            <img src="/assets/images/icon-increment-quantity.svg">
          </button>
        </div>
      `;
      // Add listeners for increment and decrement
      this.addIncrementDecrementListeners(button, item);
    }
  };

  addIncrementDecrementListeners(button, item) {
    const incrementButton = button.querySelector('.increment');
    const decrementButton = button.querySelector('.decrement');
    const quantityDisplay = button.querySelector('.cart-quantity');
  
    incrementButton.addEventListener('click', () => {
      item.quantity++;
      quantityDisplay.textContent = item.quantity;
      this.updateCartUI();
    });
  
    decrementButton.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        quantityDisplay.textContent = item.quantity;
      } else {
        this.cart = this.cart.filter(cartItem => cartItem.id !== item.id);
        this.resetAddToCartButton(button, item);
      }
      this.updateCartUI();
    });
  }

  removeItemFromCart(productId) {
    // Remove the item from the cart array
    this.cart = this.cart.filter(item => item.id !== productId);

    // Find the corresponding "Add to Cart" button and reset it
    const productButton = document.querySelector(`[data-id="${productId}"] .dessert_side-items-card-button-clicked`);
    console.log(productButton);
    if (productButton) {
        productButton.classList.remove('dessert_side-items-card-button-clicked');
        productButton.classList.add('dessert_side-items-card-button');
        productButton.innerHTML = `<img src="/assets/images/icon-add-to-cart.svg" alt=""><span class="dessert_side-items-card-info-buttonname">Add to Cart</span>`;
    }

    // Find the corresponding image and remove the border class
    const productImage = document.querySelector(`[data-id="${productId}"] .dessert_side-items-card-image`);
    if (productImage) {
        productImage.classList.remove('dessert_side-items-card-image-selected');
    }

    // Update the cart UI after removal
    this.updateCartUI();
  }

  updateBorder(productId) {
    const productImage = document.querySelector(`[data-id="${productId}"] .dessert_side-items-card-image`);
    if (productImage && this.cart.find(item => item.id === productId)) {
        productImage.classList.add('dessert_side-items-card-image-selected');
    }
  }

  removeBorder(productId) {
    const productImage = document.querySelector(`[data-id="${productId}"] .dessert_side-items-card-image`);
    if (productImage) {
        productImage.classList.remove('dessert_side-items-card-image-selected');
    }
  }


  
  // Reset the button to "Add to Cart" state when quantity is zero
  resetAddToCartButton(button, item) {
    button.classList.remove('dessert_side-items-card-button-clicked');
    button.classList.add('dessert_side-items-card-button');
    button.innerHTML = `<img src="/assets/images/icon-add-to-cart.svg" alt=""><span class="dessert_side-items-card-info-buttonname">Add to Cart</span>`;
    item.quantity = 1; // Reset quantity for next time
  }

  orderTotalAmount(totalPrice,cartSide) {
  const total = totalPrice.reduce((a,b) => a + b, 0);
  const cartTotalPriceHTML = `
    <div class="card_side-content-item-info">
      <div class="card_side-content-item-info-total">
        <div class="card_side-content-item-info-total-text">Order Total</div>
        <div class="card_side-content-item-info-total-price">$${total.toFixed(2)}</div>
      </div>
      <div class="card_side-content-item-info-carbon">
        <img src="/assets/images/icon-carbon-neutral.svg" alt="">
        <div>This is a <span>carbon-neutral</span> delivery</div>
      </div>
      <button class="card_side-content-item-info-confirm-button"> Confirm Order</button>
    </div>
    `
  cartSide.insertAdjacentHTML('beforeend', cartTotalPriceHTML);
  };

   // Increment item quantity
  incrementItem(productId) {
    const cartItem = this.cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity++;
      this.updateCartUI();
    }
  }
 
   // Decrement item quantity or remove if 0
  decrementItem(productId) {
  const cartItem = this.cart.find(item => item.id === productId);
  if (cartItem) {
      cartItem.quantity--;
      
      // Check if quantity is zero
      if (cartItem.quantity <= 0) {
          // Remove the item from the cart
          this.removeItemFromCart(productId);
          console.log('test');
          // Remove the border after removing the item
          this.removeBorder(productId);
      } else {
          // Update the UI if quantity > 0
          this.updateCartUI();
          // Ensure border is maintained if quantity is still present
          this.updateBorder(productId);
      }
  }
  }

  
  
}

class CartSide{
  constructor(){
    this.cartCount = 0;
  }
  cartCard(itemCount){
    const cardSideElement = document.querySelector('.card_side-content');

    let emptyCartHtml = `
      <div class="card_side-content">
        <img src="/assets/images/illustration-empty-cart.svg" alt="">
        <div>Your added items will appear here</div>
      </div>`
    let productHtml = `
        <div class="product-in-cart">
        <div class="product-in-cart-info">
          <p>Name</p>
          <div class="product-in-cart-info-count-price">
            <div>1x</div>
            <div>@ $4.40</div>
            <div>$5.50</div>
          </div>
        </div>
        <div class="product-in-cart-close-button">
          <img src="/assets/images/icon-remove-item.svg" alt="">
        </div>
      </div> 
    `
    // cardSideElement.innerHTML = emptyCartHtml;
  }
}


const productList = new ProductList();
productList.jsonDataFetcher();