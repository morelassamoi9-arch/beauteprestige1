// ===== VARIABLES GLOBALES =====
let cart = [];
let currentLightboxIndex = 0;

// Images de la galerie (à remplacer par vos vraies images)
const galleryImages = [
    { src: 'images/galerie-1.jpg', caption: 'Sérum + Crème visage' },
    { src: 'images/galerie-2.jpg', caption: 'Collection Maquillage' },
    { src: 'images/galerie-3.jpg', caption: 'Parfums Premium' },
    { src: 'images/galerie-4.jpg', caption: 'Soins du Corps' },
    { src: 'images/galerie-5.jpg', caption: 'Nouveautés 2026' },
    { src: 'images/galerie-6.jpg', caption: 'Coffret Prestige' }
];

// Produits (base de données simplifiée)
const products = {
    1: { name: 'Sérum Éclat Jeunesse', price: 89.90 },
    2: { name: 'Rouge Velours Mat', price: 34.90 },
    3: { name: 'Essence Royale', price: 125.00 },
    4: { name: 'Crème Veloutée Hydra+', price: 67.50 },
    5: { name: 'Huile Soyeuse Réparatrice', price: 45.00 },
    6: { name: 'Palette Regard Intense', price: 52.00 }
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeNavigation();
    initializeContactForm();
    initializeNewsletterForm();
    initializeCart();
    
    // Animation au scroll
    window.addEventListener('scroll', handleScrollAnimations);
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            this.classList.add('active');
            
            // Scroll vers la section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fonction pour scroller vers les produits
function scrollToProducts() {
    const productsSection = document.querySelector('#produits');
    const offsetTop = productsSection.offsetTop - 80;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// ===== FILTRES PRODUITS =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Mise à jour des boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filtrage des produits avec animation
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== PANIER =====
function initializeCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    
    cartBtn.addEventListener('click', openCart);
    
    // Fermer le panier en cliquant à l'extérieur
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });
}

function addToCart(productId) {
    const product = products[productId];
    
    if (!product) {
        console.error('Produit non trouvé');
        return;
    }
    
    // Vérifier si le produit existe déjà dans le panier
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    
    // Animation de confirmation
    showCartNotification();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        cartTotal.textContent = '0,00 €';
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #ecf0f1;
                gap: 15px;
            ">
                <div style="flex: 1;">
                    <h4 style="font-size: 16px; margin-bottom: 5px;">${item.name}</h4>
                    <p style="color: #7f8c8d; font-size: 14px;">${item.price.toFixed(2)} € × ${item.quantity}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="
                        background: #ecf0f1;
                        border: none;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                    ">-</button>
                    <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="
                        background: #ecf0f1;
                        border: none;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                    ">+</button>
                    <button onclick="removeFromCart(${item.id})" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 16px;
                        margin-left: 10px;
                    ">×</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total.toFixed(2) + ' €';
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

function showCartNotification() {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.textContent = 'Produit ajouté au panier !';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// ===== GALERIE & LIGHTBOX =====
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    lightbox.classList.add('active');
    
    // Utiliser l'image placeholder ou l'image réelle
    // lightboxImg.src = galleryImages[index].src;
    // lightboxCaption.textContent = galleryImages[index].caption;
    
    // Pour la démo, on affiche juste le texte
    lightboxImg.alt = galleryImages[index].caption;
    lightboxCaption.textContent = galleryImages[index].caption;
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;
    
    // Boucler si nécessaire
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
        currentLightboxIndex = 0;
    }
    
    openLightbox(currentLightboxIndex);
}

// Fermer le lightbox avec la touche Échap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
        closeCart();
    } else if (e.key === 'ArrowLeft') {
        changeLightboxImage(-1);
    } else if (e.key === 'ArrowRight') {
        changeLightboxImage(1);
    }
});

// ===== SUPPORTS VISUELS =====
function downloadSupport(type) {
    // Simuler un téléchargement
    const messages = {
        'affiche': 'Téléchargement de l\'affiche en cours...',
        'flyer': 'Téléchargement du flyer en cours...',
        'banner': 'Téléchargement de la bannière en cours...',
        'card': 'Téléchargement de la carte produit en cours...',
        'catalogue': 'Téléchargement du catalogue en cours...'
    };
    
    showNotification(messages[type] || 'Téléchargement en cours...', '#3498db');
    
    // Ici, vous ajouteriez la vraie logique de téléchargement
    // window.location.href = 'downloads/' + type + '.pdf';
}

function playVideo() {
    showNotification('Lecture de la vidéo...', '#9b59b6');
    
    // Ici, vous ouvririez un modal avec la vidéo
    // Ou redirigerez vers une page YouTube/Vimeo
}

function showNotification(message, color = '#27ae60') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== FORMULAIRE DE CONTACT =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Validation basique
        if (!name || !email || !message) {
            showNotification('Veuillez remplir tous les champs obligatoires', '#e74c3c');
            return;
        }
        
        // Simulation d'envoi
        showNotification('Message envoyé avec succès ! Nous vous répondrons bientôt.', '#27ae60');
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Ici, vous ajouteriez la vraie logique d'envoi
        // fetch('/api/contact', { method: 'POST', body: formData })
    });
}

// ===== NEWSLETTER =====
function initializeNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!email || !isValidEmail(email)) {
                showNotification('Veuillez entrer une adresse email valide', '#e74c3c');
                return;
            }
            
            showNotification('Inscription réussie ! Merci de vous être abonné.', '#27ae60');
            emailInput.value = '';
            
            // Ici, vous ajouteriez la vraie logique d'inscription
        });
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== ANIMATIONS AU SCROLL =====
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .gallery-item, .support-card');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// ===== ANIMATIONS CSS (à ajouter dynamiquement) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-card,
    .gallery-item,
    .support-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// ===== SMOOTH SCROLL POLYFILL =====
// Pour les navigateurs qui ne supportent pas scroll-behavior: smooth
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollTo = (target, duration) => {
        const targetPosition = target.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - 80;
        let startTime = null;
        
        const animation = currentTime => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    };
}

console.log('Beauté Prestige - Site chargé avec succès !');
