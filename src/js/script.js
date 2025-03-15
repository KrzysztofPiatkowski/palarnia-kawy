document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();

  // Jeśli nie ma hasha w URL, nie ukrywaj niczego (czyli "Home" = cała strona)
  if (!window.location.hash) {
    showSection('home');
  }
});

function fetchProducts() {
  fetch('http://localhost:3131/products')
    .then(response => response.json())
    .then(products => {
      renderProducts(products);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function renderProducts(products) {
  const productsContainer = document.querySelector('.products');

  // Usuwamy poprzednie produkty
  productsContainer.innerHTML = '';

  // Tworzymy nową listę produktów
  const productsList = document.createElement('div');
  productsList.classList.add('products__list');

  // Dodajemy tylko 3 unikalne produkty
  products.slice(0, 3).forEach((product, index) => {
    //const productData = Object.assign({}, product);
    let productHTML;

    if (index % 2 !== 0) {
      // Produkt parzysty - obraz po lewej, opis po prawej
      productHTML = `
        <div class="row align-items-center mb-5 flex-md-row-reverse">
          <div class="col-md-6 text-center">
            <img class="img-fluid product-card__image" src="${product.image}" alt="${product.title}">
          </div>
          <div class="col-md-6">
            <h3 class="product-card__title">${product.id}. ${product.title}</h3>
            <div class="product-card__description">
              <hr class="product-card__divider">
              <p>${product.description}</p>
            </div>
            <div class="product-card__meta">
              <div class="product-card__meta-item">
                <span class="product-card__meta-label">Roasting:</span>
                <span class="product-card__meta-value">${product.roasting}/10</span>
              </div>
              <div class="product-card__meta-item">
                <span class="product-card__meta-label">Intensity:</span>
                <span class="product-card__meta-value">${product.intensity}/10</span>
              </div>
            </div>
          </div>
        </div>`;
    } else {
      // Produkt nieparzysty - opis po lewej, obraz po prawej
      productHTML = `
        <div class="row align-items-center mb-5">
          <div class="col-md-6">
            <h3 class="product-card__title">${product.id}. ${product.title}</h3>
            <div class="product-card__description">
              <hr class="product-card__divider">
              <p>${product.description}</p>
            </div>
            <div class="product-card__meta">
              <div class="product-card__meta-item">
                <span class="product-card__meta-label">Roasting:</span>
                <span class="product-card__meta-value">${product.roasting}/10</span>
              </div>
              <div class="product-card__meta-item">
                <span class="product-card__meta-label">Intensity:</span>
                <span class="product-card__meta-value">${product.intensity}/10</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-center">
            <img class="img-fluid product-card__image" src="${product.image}" alt="${product.title}">
          </div>
        </div>`;
    }

    productsList.insertAdjacentHTML('beforeend', productHTML);
  });

  // Dodajemy produkty do sekcji "Products"
  productsContainer.appendChild(productsList);
}




function showSection(hash) {
  console.log(`Przełączam na sekcję: ${hash}`); // DEBUG
  let sections = document.querySelectorAll('main section');

  // Jeśli Home, to nie ukrywaj sekcji, tylko ukryj Contact
  if (hash === 'home') {
    sections.forEach(section => {
      if (section.id === 'contact') {
        section.style.display = 'none';
      } else {
        section.style.display = 'block';
      }
    });
    return;
  }

  // Ukryj wszystkie sekcje, oprócz wybranej
  sections.forEach(section => {
    section.style.display = (section.id === hash) ? 'block' : 'none';
  });

  if (hash === 'products') {
    fetchProducts();
  }
}

function setupNavigation() {
  console.log('setupNavigation uruchomione!'); // DEBUG
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
  showSection(currentHash);
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupHamburgerMenu();
});

function setupHamburgerMenu() {
  const menuButton = document.querySelector('.hamburger-menu');
  const menu = document.querySelector('.navigation__menu');
  const menuLinks = document.querySelectorAll('.navigation__menu a');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      menu.classList.toggle('active'); // Otwiera / zamyka menu
    });

    // Zamykamy menu po kliknięciu w dowolny link
    menuLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault(); // Blokuje domyślną akcję
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId); // Wywołujemy funkcję zmiany sekcji
        history.pushState(null, null, `#${sectionId}`); // Aktualizujemy URL
        menu.classList.remove('active'); // Zamykamy menu
      });
    });
  }
}

