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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchResults(product) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((response) => response.json())
    .then((response) =>
      response.results.map((item) => ({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      })))
    .then((results) => {
      results.forEach((result) => {
        document
          .querySelector('.items')
          .appendChild(createProductItemElement(result));
      });
    });
}

function fetchItemById(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((item) => ({ sku: item.id, name: item.title, salePrice: item.price }))
    .then((item) => 
    document.querySelector('.cart__items').appendChild(createCartItemElement(item)));
}

async function addProductToCart() {
  document.querySelectorAll('.item__add').forEach((item) =>
    item.addEventListener('click', (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      fetchItemById(itemID);
    }));
}

window.onload = async () => {
  await fetchResults('computador');
  addProductToCart();
};
