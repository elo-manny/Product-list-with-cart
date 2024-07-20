export class HTML {

  static async fetchDesserts() {
    const response = await fetch('data.json')
    const desserts = await response.json()
    return desserts
  }

  static async loadPage() {
    const desserts = await this.fetchDesserts()
    const allDesserts = document.querySelector('.js-all-desserts')
    let html = "";

    desserts.forEach((dessert, index) => {

      html += `        
        <li class="dessert-item">
          <div>
            <picture>
              <source media="(min-width: 1024px)" srcset="${dessert.image.desktop}">
              <source media="(min-width: 768px)" srcset="${dessert.image.tablet}">
              <img src="${dessert.image.mobile}" alt="${dessert.name}">
            </picture>

            <div class="flex-wrapper dessert-item__btn">
              <div class="flex-wrapper">
                <img src="./assets/images/icon-add-to-cart.svg" class="small">
                <p class="fw-bold">Add to Cart</p>
              </div>
              <div class="js-dessert-item__controls dessert-item__controls flex-wrapper hidden">
                <button class="btn js-dec-qty-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
                    <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
                  </svg>
                </button>
                <p class="js-quantity-count">0</p>
                <button class="btn js-inc-qty-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                    <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="dessert-item__details inner-spacing">
            <p class="secondary-texts fs-300">${dessert.category}</p>
            <p class="fw-bold fs-medium">${dessert.name}</p>
            <p class="accent-texts fw-bold">$${dessert.price.toFixed(2)}</p>
          </div>

        </li>`
    })

    allDesserts.innerHTML = html
    this.addListener()
  }

  static addListener() {
    const dessertImage = document.querySelectorAll('picture img')
    const addToCartBtn = document.querySelectorAll('.dessert-item__btn > div:first-of-type')
    const controlsBtn = document.querySelectorAll('.js-dessert-item__controls')
    const main = document.querySelector('main')

    dessertImage.forEach((image, index) => {
      image.addEventListener('click', () => {
        if (!image.classList.contains('active')) {
          image.classList.add('active')
          addToCartBtn[index].classList.add('hidden')
          controlsBtn[index].classList.remove('hidden')
        }
        else {
          image.classList.remove('active')
          addToCartBtn[index].classList.remove('hidden')
          controlsBtn[index].classList.add('hidden')
        }
      })
    })

    addToCartBtn.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        addToCartBtn[index].classList.add('hidden')
        controlsBtn[index].classList.remove('hidden')
      })
    })

    controlsBtn.forEach((btn, index) => {
      btn.addEventListener('click', ({ target }) => {
        if (target === btn) {
          addToCartBtn[index].classList.remove('hidden')
          controlsBtn[index].classList.add('hidden')
        }
      })
    })



    document.dispatchEvent(new Event('page.js_Loaded'));
  }
}