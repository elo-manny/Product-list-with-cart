export class DessertCart {

  /**
   * Fetches the list of desserts from the 'data.json' file.
   * @returns {Promise<Array>} A promise that resolves to an array of desserts.
   */
  static async fetchDessertData() {
    const response = await fetch('data.json');
    const desserts = await response.json();
    return desserts;
  }

  // Array to keep track of the quantity of each dessert.
  static dessertQuantities = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * Enables controls for incrementing and decrementing dessert quantities.
   * Fetches the list of desserts and sets up event listeners for the buttons.
   */
  static async initializeControls() {
    const dessertsList = await this.fetchDessertData();

    const incrementButtons = document.querySelectorAll('.js-inc-qty-btn svg');
    const decrementButtons = document.querySelectorAll('.js-dec-qty-btn svg');
    const quantityDisplayElements = document.querySelectorAll('.js-quantity-count');

    // Initialize dessert quantities based on the count array.
    dessertsList.forEach((item, index) => {
      item.quantity = this.dessertQuantities[index];
    });

    // Add event listeners for increment buttons.
    incrementButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.dessertQuantities[index]++;
        dessertsList.forEach((dessert, index) => {
          dessert.quantity = this.dessertQuantities[index];
        });
        quantityDisplayElements[index].textContent = this.dessertQuantities[index];
        this.updateCartWithDessert(dessertsList[index], this.dessertQuantities[index]);
      });
    });

    // Add event listeners for decrement buttons.
    decrementButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (this.dessertQuantities[index] >= 1) {
          this.dessertQuantities[index]--;
          quantityDisplayElements[index].textContent = this.dessertQuantities[index];
          this.removeDessertFromCart(dessertsList[index]);
        }
      });
    });
  }

  // Array to store all selected desserts in the cart.
  static selectedDesserts = [];

  // DOM elements for the cart's empty state, full state, list of selected desserts, cart items count, and total payment amount.
  static cartEmptyState = document.querySelector('.js-cart-empty');
  static cartFullState = document.querySelector('.js-cart-full');
  static selectedDessertsContainer = document.querySelector('.js-selected-desserts');
  static cartItemCountDisplay = document.querySelector('.js-cart-items-count');
  static totalPaymentDisplay = document.querySelector('.js-total-pay-amount');

  /**
   * Updates the count of items in the cart.
   * Sets the text content of the cartItemCountDisplay element.
   */
  static updateCartItemCount() {
    this.cartItemCountDisplay.textContent = this.dessertQuantities.reduce((a, b) => a + b, 0);
  }

  /**
   * Computes the total payment amount for all items in the cart.
   * Sets the text content of the totalPaymentDisplay element.
   */
  static calculateTotalPayment() {
    let totalPay = 0;
    this.selectedDesserts.forEach(dessert => {
      totalPay += dessert.quantity * dessert.price;
    });
    this.totalPaymentDisplay.textContent = `$${totalPay.toFixed(2)}`;
  }

  /**
   * Loads the selected desserts into the cart.
   * Updates the DOM with the selected desserts and their details.
   */
  static renderCartContents() {
    let html = '';

    this.selectedDesserts.forEach(dessert => {
      html += `
            <li class="flex-wrapper selected-dessert">
              <div>
                <p class="selected-dessert__name fw-bold">${dessert.name}</p>
                <div class="flex-wrapper">
                  <p class="selected-dessert__quantity accent-texts fw-bold">${dessert.quantity}x</p>
                  <p class="selected-dessert__ppi secondary-texts">@${dessert.price.toFixed(2)}</p>
                  <p class="selected-dessert__tppi secondary-texts2 fw-bold">$${(dessert.price * dessert.quantity).toFixed(2)}</p>
                </div>
              </div>
              <button class="js-delete-dessert-btn delete-dessert-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                  <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
                </svg>
              </button>
            </li>
          `;
    });

    this.cartEmptyState.classList.add('hidden');
    this.cartFullState.classList.remove('hidden');
    this.selectedDessertsContainer.innerHTML = html;
    this.enableDeleteButtons();
    this.updateCartItemCount();
  }

  /**
   * Adds a dessert to the cart.
   * Updates the quantity of the dessert and reloads the cart.
   * @param {Object} dessert - The dessert object to be added.
   * @param {number} count - The quantity of the dessert to be added.
   */
  static updateCartWithDessert(dessert, count) {
    let index = this.selectedDesserts.findIndex(d => d.id === dessert.id);
    index === -1 ? this.selectedDesserts.push(dessert) : dessert.quantity = count;

    this.calculateTotalPayment();
    this.renderCartContents();
  }

  /**
   * Decreases the quantity of a dessert in the cart.
   * If the quantity becomes zero, removes the dessert from the cart.
   * @param {Object} dessert - The dessert object whose quantity is to be decreased.
   */
  static removeDessertFromCart(dessert) {
    let index = this.selectedDesserts.findIndex(d => d.id === dessert.id);

    if (index !== -1) {
      if (this.selectedDesserts[index].quantity > 1) {
        this.selectedDesserts[index].quantity--;
        this.renderCartContents();
      } else {
        this.selectedDesserts.splice(index, 1);
        this.renderCartContents();

        if (this.selectedDesserts.length < 1) {
          this.cartEmptyState.classList.remove('hidden');
          this.cartFullState.classList.add('hidden');
        }
      }
    }
  }

  /**
   * Enables the delete buttons for removing desserts from the cart.
   * Fetches the list of desserts and sets up event listeners for the delete buttons.
   */
  static async enableDeleteButtons() {
    const dessertsList = await this.fetchDessertData();
    const itemQtyCounts = document.querySelectorAll('.js-quantity-count');
    const deleteBtns = document.querySelectorAll('.js-delete-dessert-btn');

    // Add event listeners for delete buttons.
    deleteBtns.forEach((button, index) => {
      button.addEventListener('click', () => {
        const dessertId = this.selectedDesserts[index].id;
        this.selectedDesserts.splice(index, 1);
        this.renderCartContents();

        // Reset the quantity of the deleted item.
        dessertsList.forEach((item, index) => {
          if (item.id === dessertId) {
            this.dessertQuantities[index] = 0;
            itemQtyCounts[index].textContent = 0;

            if (this.selectedDesserts.length < 1) {
              this.cartEmptyState.classList.remove('hidden');
              this.cartFullState.classList.add('hidden');
            }
          }
        });
      });
    });

    this.updateCartItemCount();
    this.calculateTotalPayment();
  }
}
