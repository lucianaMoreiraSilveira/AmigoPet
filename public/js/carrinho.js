 const specieMap = { G: 'Gato', C: 'Cachorro' };
  const sexMap = { M: 'Macho', F: 'Fêmea' };
  const sizeMap = { P: 'Pequeno', M: 'Médio', G: 'Grande' };

  function getCartKey() {
    const token = localStorage.getItem('token');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id || payload.id || payload.sub;
      return userId ? `cart_${userId}` : 'cart_guest';
    } catch {
      return 'cart_guest';
    }
  }

  function getCart() {
    return JSON.parse(localStorage.getItem(getCartKey())) || [];
  }

  function setCart(cart) {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
  }

  function updateCartCount() {
    const el = document.getElementById('cartCount');
    if (el) el.textContent = getCart().length;
  }

  function displayCartItems() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    container.innerHTML = '';

    if (cart.length === 0) {
      container.innerHTML = '<div class="col-12 text-center text-muted">Seu carrinho está vazio.</div>';
      return;
    }

    cart.forEach(pet => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-3';

      col.innerHTML = `
        <div class="card">
          <img src="${pet.image}" class="card-img-top" alt="${pet.name}" style="height:150px; object-fit:contain;">
          <div class="card-body text-center">
            <h5 class="card-title">${pet.name}</h5>
            <p>Espécie: ${pet.especie}<br>
               Sexo: ${pet.sexo}<br>
               Idade: ${pet.idade} anos<br>
               Porte: ${pet.porte}</p>
            <button class="btn btn-danger remove-from-cart" data-id="${pet.id}">Remover</button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  }

  document.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('remove-from-cart')) {
      const petId = parseInt(e.target.dataset.id);
      let cart = getCart();
      cart = cart.filter(p => p.id != petId);
      setCart(cart);
      displayCartItems();
      updateCartCount();
      alert('Pet removido da cestinha.');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado.');
      window.location.href = '/login.html';
      return;
    }
    displayCartItems();
    updateCartCount();
  });