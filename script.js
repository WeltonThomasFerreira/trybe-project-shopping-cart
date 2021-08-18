const shoppingCartID = '#shopping-cart';
let totalPurchase = 0;

function addShoppingCartToStorage() {
  const shoppingCart = document.querySelector(shoppingCartID);
  const total = document.querySelector('.total-price');
  window.localStorage.setItem('shopping_cart', shoppingCart.innerHTML);
  window.localStorage.setItem(
    'total_purchase',
    (total.innerHTML = totalPurchase),
  );
}

function fetchCartInStorage() {
  const shoppingCart = document.querySelector(shoppingCartID);
  const total = document.querySelector('.total-price');
  shoppingCart.innerHTML = localStorage.getItem('shopping_cart');
  total.innerHTML = localStorage.getItem('total_purchase');
}

function fetchItemById(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((item) => ({
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    }));
}

// ------------------------------------------------------------------------------------

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  const mappedItem = await fetchItemById(event.target.id);
  totalPurchase -= mappedItem.salePrice;
  await event.target.remove();
  addShoppingCartToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// ------------------------------------------------------------------------------------

function fetchResults(searchTerm) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`)
    .then((response) => response.json())
    .then((response) =>
      response.results.map((item) => ({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
        // salePrice: item.price,
      })))
    .then((results) =>
      results.forEach((result) => {
        document
          .querySelector('.items')
          .appendChild(createProductItemElement(result));
      }));
}

function appendItem(item) {
  return document
    .querySelector(shoppingCartID)
    .appendChild(createCartItemElement(item));
}

function addProductToCart() {
  document.querySelectorAll('.item__add').forEach((item) =>
    item.addEventListener('click', async (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      const mappedItem = await fetchItemById(itemID);
      totalPurchase += mappedItem.salePrice;
      await appendItem(mappedItem);
      addShoppingCartToStorage();
    }));
}

function removeProductFromCart() {
  const cartItems = document.querySelectorAll(shoppingCartID);
  cartItems.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function emptyCart() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    const cart = document.querySelector(shoppingCartID);
    const price = document.querySelector('#total-price');
    window.localStorage.removeItem('shopping_cart');
    window.localStorage.removeItem('total_purchase');
    cart.innerHTML = '';
    price.innerHTML = 'Preço total: $<span class="total-price"></span>';
  });
}

window.onload = async () => {
  await fetchResults('computador');
  await fetchCartInStorage();
  addProductToCart();
  removeProductFromCart();
  emptyCart();
};
