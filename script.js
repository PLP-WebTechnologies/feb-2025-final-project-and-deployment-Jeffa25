  // Select the button element
        const btn =
        document.querySelector('button');

        // Add event listeners for
        // mouseover and mouseout events
        btn.addEventListener('mouseover', function () {
            btn.style.color = 'white';
            btn.style.backgroundColor = 'green';
        });
        btn.addEventListener('mouseout', function () {
            btn.style.color = 'black';
            btn.style.backgroundColor = ' #ff6f61';
        });

let cartCount = 0;

// Function to update the cart count display
function updateCartCount() {
    // Retrieve the cart count from localStorage or initialize to 0
    cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;
    document.getElementById('cartCount').innerText = cartCount; // Update the cart count display
}

// Function to add items to the cart
function addToCart(item) {
    cartCount++;
    localStorage.setItem('cartCount', JSON.stringify(cartCount)); // Save updated cart count to localStorage
    updateCartCount(); // Update the cart count display

    // Get existing cart items from localStorage or initialize an empty array
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(item); // Add the new item to the cart
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save updated cart to localStorage
}

// Function to update the cart display on the cart page
function updateCart() {
    const cartList = document.getElementById('cartItems');
    cartList.innerHTML = ''; // Clear existing items

    // Retrieve cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item; // Display the item name
        cartList.appendChild(li); // Add item to the list
    });
}

// Slideshow functionality
let slideIndex = 0;
showSlides();

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

// Call updateCart when the cart page is loaded
if (window.location.pathname.includes('Cart.html')) {
    updateCart();
}

// Initialize cart count on page load
updateCartCount();

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count in navigation
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Add to cart buttons functionality
    document.querySelectorAll('.shoe .button').forEach(button => {
        // Only add event listeners to buttons that aren't links
        if (!button.closest('a')) {
            button.addEventListener('click', function() {
                const shoeItem = this.closest('.shoe');
                const name = shoeItem.querySelector('p:first-of-type').textContent;
                const priceText = shoeItem.querySelector('p:last-of-type').textContent;
                const price = parseFloat(priceText.replace('KSH. ', '').trim());
                const image = shoeItem.querySelector('img').src;
                
                // Generate a simple ID from the name
                const id = name.toLowerCase().replace(/\s+/g, '-');
                
                // Check if item already in cart
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                updateCartCount();
                
                // Provide feedback
                alert(`${name} added to cart!`);
            });
        }
    });
    
    // Load cart items on cart page
    if (document.getElementById('cartItems')) {
        const cartItemsContainer = document.getElementById('cartItems');
        const checkoutButton = document.getElementById('checkoutButton');
        
        function renderCart() {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<li>Your cart is empty</li>';
                checkoutButton.style.display = 'none';
                return;
            }
            
            checkoutButton.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            
            let total = 0;
            
            cart.forEach(item => {
                total += item.price * item.quantity;
                
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" width="80" height="80">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>KSH. ${item.price.toFixed(2)} × ${item.quantity}</p>
                        <p>Subtotal: KSH. ${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(li);
            });
            
            // Add total row
            const totalLi = document.createElement('li');
            totalLi.className = 'cart-total';
            totalLi.innerHTML = `<h3>Total: KSH. ${total.toFixed(2)}</h3>`;
            cartItemsContainer.appendChild(totalLi);
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    renderCart();
                    updateCartCount();
                });
            });
        }
        
        renderCart();
        
        // Checkout button
        checkoutButton.addEventListener('click', function() {
            alert('Proceeding to checkout!');
            // In a real application, you would redirect to a checkout page
        });
    }
    
    // Initialize cart count on page load
    updateCartCount();
});