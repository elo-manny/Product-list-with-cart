import { HTML } from './page.js'
import { DessertCart } from './cart.js'
import { Order } from './order.js'


class DessertApp {

  static init() {
    HTML.loadPage()
    document.addEventListener('page.js_Loaded', () => {
      DessertCart.initializeControls();
    });
    Order.displayUserOrder()
  }


}


DessertApp.init()