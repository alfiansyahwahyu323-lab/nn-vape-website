const products = [
    { id: 1, title: "Voopoo Drag X2", price: 320000, originalPrice: 380000, image: "https://images.unsplash.com/photo-1589384216882-11cd0d5b2c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 5, reviews: 456, badge: "DISKON 15%" },
    { id: 2, title: "GeekVape Zeus", price: 280000, image: "https://images.unsplash.com/photo-1618563252536-13e6ce1759e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 5, reviews: 234 },
    { id: 3, title: "Smok V-Fin", price: 350000, originalPrice: 420000, image: "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4, reviews: 189, badge: "POPULER" },
    { id: 4, title: "Aspire Nautilus", price: 150000, image: "https://images.unsplash.com/photo-1589384216882-11cd0d5b2c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 5, reviews: 312 },
    { id: 5, title: "Lost Vape Orion", price: 450000, image: "https://images.unsplash.com/photo-1618563252536-13e6ce1759e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 5, reviews: 567, badge: "PREMIUM" },
    { id: 6, title: "Uwell Crown", price: 200000, image: "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4, reviews: 234 }
];

let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    hideLoader();
    loadProducts();
    setupEventListeners();
    loadCartFromStorage();
});

function hideLoader() {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
}

function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    Rp ${product.price.toLocaleString('id-ID')}
                    ${product.originalPrice ? `<span style="text-decoration:line-through;color:#999;font-size:1rem;">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="buy-btn" onclick="addToCart(${product.id})">🛒 Beli Sekarang</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
    showNotification(`${product.title} ditambahkan ke keranjang!`);
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
    saveCartToStorage();
}

function saveCartToStorage() {
    localStorage.setItem('nnVapeCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('nnVapeCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 80px; right: 20px; background: linear-gradient(45deg, #00d4ff, #0099cc); color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,212,255,0.3); animation: slideIn 0.3s ease; z-index: 10000;';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setupEventListeners() {
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
    document.getElementById('cartIcon').addEventListener('click', openCart);
    const modal = document.getElementById('cartModal');
    document.querySelector('.close').addEventListener('click', closeCart);
    window.addEventListener('click', function(event) {
        if (event.target == modal) closeCart();
    });
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const filtered = products.filter(p => p.title.toLowerCase().includes(e.target.value.toLowerCase()));
        displayProducts(filtered);
    });
}

function openCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Keranjang Anda kosong</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <p style="margin:0;font-weight:600;">${item.title}</p>
                    <p style="margin:0;color:#999;font-size:0.9rem;">Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                    <p style="margin:0.5rem 0 0 0;color:#ff6b6b;font-weight:600;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Hapus</button>
            </div>
        `).join('');
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    modal.style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    openCart();
    showNotification('Produk dihapus dari keranjang');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang Anda kosong');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = encodeURIComponent(`Halo, saya ingin memesan:\n\n${cart.map(item => `${item.title} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`).join('\n')}\n\nTotal: Rp ${total.toLocaleString('id-ID')}`);
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
    cart = [];
    updateCart();
    closeCart();
}

function displayProducts(filtered) {
    const productGrid = document.getElementById('productGrid');
    if (filtered.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;grid-column:1/-1;">Produk tidak ditemukan</p>';
        return;
    }
    productGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    Rp ${product.price.toLocaleString('id-ID')}
                    ${product.originalPrice ? `<span style="text-decoration:line-through;color:#999;font-size:1rem;">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="buy-btn" onclick="addToCart(${product.id})">🛒 Beli Sekarang</button>
            </div>
        </div>
    `).join('');
}

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}