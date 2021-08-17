const shoppingCartID = '#shopping-cart';

function addShoppingCartToStorage() {
  const shoppingCart = document.querySelector(shoppingCartID);
  window.localStorage.setItem('shopping_cart', shoppingCart.innerHTML);
}

function fetchCartInStorage() {
  const shoppingCart = document.querySelector(shoppingCartID);
  shoppingCart.innerHTML = localStorage.getItem('shopping_cart');
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
  await event.target.remove();
  addShoppingCartToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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

function fetchItemById(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((item) => ({
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    }));
}

function appendItem(item) {
  document
    .querySelector(shoppingCartID)
    .appendChild(createCartItemElement(item));
}

function addProductToCart() {
  document.querySelectorAll('.item__add').forEach((item) =>
    item.addEventListener('click', async (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      const mappedItem = await fetchItemById(itemID);
      appendItem(mappedItem);
      addShoppingCartToStorage();
    }));
}

function removeProductFromCart() {
  const cartItems = document.querySelectorAll(shoppingCartID);
  cartItems.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

window.onload = async () => {
  await fetchResults('computador');
  fetchCartInStorage();
  addProductToCart();
  removeProductFromCart();
};
