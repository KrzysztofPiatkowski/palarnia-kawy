document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Sprawdzam, czy `DOMContentLoaded` działa poprawnie');
  setupNavigation();
  setupHamburgerMenu();
  handleInitialSection();

  console.log('✅ Wymuszam `fetchProducts()` BEZ sprawdzania `hash`');

  // 🔹 Pobieramy produkty niezależnie od `hash`
  setTimeout(() => {
    console.log('🛠 Wywołuję `fetchProducts()` bez sprawdzania `hash`');
    fetchProducts();
  }, 1000);
});


/** 🔹 Pobiera i wyświetla produkty */
function fetchProducts() {
  fetch('http://localhost:3131/products')
    .then(response => response.json())
    .then(products => {
      console.log('📥 Produkty pobrane z API:', products);
      renderProducts(products);
    })
    .catch(error => console.error('❌ Błąd podczas pobierania danych:', error));
}

/** 🔹 Renderuje produkty na stronie */
function renderProducts(products) {
  console.log('🔄 Renderowanie produktów:', products);

  const productsContainer = document.querySelector('.products');
  if (!productsContainer) {
    console.error('❌ Nie znaleziono kontenera .products');
    return;
  }

  productsContainer.innerHTML = ''; // Czyszczenie poprzedniej zawartości

  const productsList = document.createElement('div');
  productsList.classList.add('products__list');

  products.slice(0, 3).forEach((product, index) => {
    console.log(`✅ Renderowanie produktu: ${product.title} | Index: ${index}`);

    let isReversed = index % 2 === 1;
    console.log(`🔄 Produkt ${product.title} ${isReversed ? '⏪ ODWRÓCONY' : '➡ NORMALNY'}`);

    let row = document.createElement('div');
    row.classList.add('row', 'align-items-center', 'mb-5');

    let imgCol = document.createElement('div');
    imgCol.classList.add('col-md-6', 'text-center');
    if (isReversed) imgCol.classList.add('order-md-2');
    imgCol.innerHTML = `<img class="img-fluid product-card__image" src="${product.image}" alt="${product.title}">`;

    let textCol = document.createElement('div');
    textCol.classList.add('col-md-6');
    if (isReversed) textCol.classList.add('order-md-1');
    textCol.innerHTML = `
      <h3 class="product-card__title">${product.id}. ${product.title}</h3>
      <div class="product-card__description">
        <hr class="product-card__divider">
        <p>${product.description}</p>
      </div>
    `;

    row.appendChild(imgCol);
    row.appendChild(textCol);
    productsList.appendChild(row);
  });

  productsContainer.appendChild(productsList);
}



/** 🔹 Pokazuje odpowiednią sekcję */
function showSection(hash) {
  console.log(`🔄 Przełączam na sekcję: ${hash}`);
  const sections = document.querySelectorAll('main section');

  if (hash === 'home') {
    sections.forEach(section => {
      section.style.display = section.id === 'contact' ? 'none' : 'block';
    });
    return;
  }

  sections.forEach(section => {
    section.style.display = section.id === hash ? 'block' : 'none';
  });

  if (hash === 'products') {
    fetchProducts();
  }
}

/** 🔹 Obsługuje nawigację i zmiany zakładek */
function setupNavigation() {
  console.log('🔄 setupNavigation uruchomione!');
  const links = document.querySelectorAll('.navigation__menu a');

  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const hash = link.getAttribute('href').substring(1);
      showSection(hash);
      history.pushState(null, null, `#${hash}`);
    });
  });

  const currentHash = window.location.hash.substring(1) || 'home';
  console.log(`📌 Aktualny hash: ${currentHash}`);
  showSection(currentHash);

  if (currentHash === 'products') {
    console.log('🛠 Wywołuję fetchProducts() na starcie');
    fetchProducts();
  }
}

/** 🔹 Obsługa menu hamburgerowego */
function setupHamburgerMenu() {
  const menuButton = document.querySelector('.hamburger-menu');
  const menu = document.querySelector('.navigation__menu');
  const menuLinks = document.querySelectorAll('.navigation__menu a');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
        history.pushState(null, null, `#${sectionId}`);
        menu.classList.remove('active');
      });
    });
  }
}

/** 🔹 Obsługuje wyświetlenie sekcji "Products" na starcie */
function handleInitialSection() {
  console.log('🚀 Sprawdzam, czy trzeba pokazać sekcję #products');

  if (window.location.hash === '#products') {
    console.log('✅ Automatycznie pokazuję #products');

    const productsSection = document.querySelector('#products');
    if (productsSection) {
      productsSection.classList.add('active'); // ⬅️ Dodajemy klasę "active"
      productsSection.style.display = 'block'; // ⬅️ Upewniamy się, że sekcja jest widoczna
      fetchProducts(); // ⬅️ Pobieramy produkty automatycznie!
    }
  }
}


