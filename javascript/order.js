import { DessertCart } from './cart.js'

export class Order {

  static confirmOrderButton = document.querySelector('.js-confirm-order')
  static startNewOrderButton = document.querySelector('.js-start-new-order')
  static overLay = document.querySelector('.js-overlay')
  static orderPopUp = document.querySelector('.js-order-confirmed-popup')
  static confirmedOrdersContainer = document.querySelector('.js-confirmed-orders-list')

  static displayUserOrder() {

    this.confirmOrderButton.addEventListener('click', () => {
      this.handlePopUp(true, false)
      this.renderConfirmedOrders()
    })

    this.startNewOrderButton.addEventListener('click', () => {
      this.handlePopUp(false, true)
    })
  }

  static handlePopUp(show, hide) {
    if (show) {
      this.overLay.classList.remove('hidden')
      this.orderPopUp.classList.remove('hidden')
    }
    else if (hide) {
      this.overLay.classList.add('hidden')
      this.orderPopUp.classList.add('hidden')
    }
  }

  static renderConfirmedOrders() {
    const desserts = DessertCart.selectedDesserts

    let html = '';

    desserts.forEach((dessert) => {
      html += `      
      <li class="confirmed-order-dessert flex-wrapper">
        <div class="flex-wrapper">
          <img src="${dessert.image.thumbnail}" alt="${dessert.name}">
          <div class="confirmed-order-dessert-details">
            <p class="confirmed-order-dessert-name fw-bold">${dessert.name}</p>
            <div class="flex-wrapper">
              <p class="accent-texts fw-bold">${dessert.quantity}x</p>
              <p class="secondary-texts">@${dessert.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <p class="confirmed-order-dessert-price secondary-texts2 fw-bold">$${(dessert.price * dessert.quantity).toFixed(2)}</p>
      </li>`
    })

    let total = 0

    desserts.forEach((dessert) => {
      total += dessert.quantity * dessert.price
    })

    html += `
    <div class="order-summary flex-wrapper">
      <p class="secondary-texts">Order Total</p>
      <p class="fw-big fs-medium-x2">$${total.toFixed(2)}</p>
    </div>
    `

    this.confirmedOrdersContainer.innerHTML = html
  }


}