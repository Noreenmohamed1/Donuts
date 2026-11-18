// Search Products

let searchBtn = document.getElementById("searchBtn");
let searchInput = document.getElementById("searchInput");

if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", function() {

        let searchValue = searchInput.value.toLowerCase().trim();

        let products = document.querySelectorAll(".product-card");

        products.forEach(function(product) {

            let productName = product.querySelector("h3").textContent.toLowerCase();

            if (productName.includes(searchValue)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }

        });

    });

}
let buttons = document.querySelectorAll(".donut-btn");

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        let image = getComputedStyle(button).backgroundImage;

        document.querySelector(".hero").style.backgroundImage = image;

    });

});

// Add Products To Cart

let cartButtons = document.querySelectorAll(".cart-btn");

var cart = JSON.parse(localStorage.getItem("cart")) || [];


// Update Cart Count

function updateCartCount() {
    let cartCount = document.querySelector(".cart-count");

    if (cartCount) {
        let totalQuantity = 0;

        cart.forEach(function(item) {
            totalQuantity += item.quantity;
        });

        cartCount.textContent = totalQuantity;
    }
}


// Add Or Remove Products

cartButtons.forEach(function(button) {

    let productName = button.dataset.name;

    let existingProduct = cart.find(function(item) {
        return item.name === productName;
    });

    if (existingProduct) {
        button.textContent = "Remove from Cart";
    }

    button.addEventListener("click", function() {

        let productName = button.dataset.name;
        let productPrice = Number(button.dataset.price);
        let productImage = button.dataset.image;

        let existingProduct = cart.find(function(item) {
            return item.name === productName;
        });

        if (existingProduct) {

            cart = cart.filter(function(item) {
                return item.name !== productName;
            });

            button.textContent = "Add to Cart";

        } else {

            cart.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

            button.textContent = "Remove from Cart";
        }

        saveCart();
    });

});


// Save Cart

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}


// Display Cart

function displayCart() {

    let cartItems = document.getElementById("cart-items");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty! 🍩</p>';
        updateSummary();
        return;
    }

    cart.forEach(function(item, index) {

        let product = document.createElement("div");

        product.className = "cart-product";

        product.innerHTML = `
            <img src="${item.image || ''}" alt="${item.name}">

            <div class="cart-product-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>

            <div class="quantity-control">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>

            <button class="delete-btn" onclick="removeProduct(${index})">🗑</button>
        `;

        cartItems.appendChild(product);

    });

    updateSummary();
}


// Change Quantity

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
    updateProductButtons();
}


// Remove Product

function removeProduct(index) {

    cart.splice(index, 1);

    saveCart();
    displayCart();
    updateProductButtons();
}


// Update Summary

function updateSummary() {

    let totalItems = document.getElementById("total-items");
    let totalPrice = document.getElementById("total-price");

    let items = 0;
    let price = 0;

    cart.forEach(function(item) {
        items += item.quantity;
        price += item.price * item.quantity;
    });

    if (totalItems) {
        totalItems.textContent = items;
    }

    if (totalPrice) {
        totalPrice.textContent = "$" + price.toFixed(2);
    }
}


// Update Product Buttons

function updateProductButtons() {

    cartButtons.forEach(function(button) {

        let productExists = cart.some(function(item) {
            return item.name === button.dataset.name;
        });

        if (productExists) {
            button.textContent = "Remove from Cart";
        } else {
            button.textContent = "Add to Cart";
        }

    });
    }


// Initial Update

updateCartCount();
displayCart();
updateProductButtons();

// Favorites / Wishlist

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let favoriteButtons = document.querySelectorAll(".favorite");


// Save Favorites

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}


// Add or Remove Favorite

favoriteButtons.forEach(function(button) {

    let productCard = button.closest(".product-card");

    let productName = productCard.querySelector("h3").textContent;

    let isFavorite = favorites.some(function(item) {
        return item.name === productName;
    });

    button.textContent = isFavorite ? "♥" : "♡";

    button.addEventListener("click", function() {

        let product = {
            name: productName,
            price: Number(
                productCard.querySelector(".price").textContent.replace("$", "")
            ),
            image: getComputedStyle(
                productCard.querySelector(".product-img")
            ).backgroundImage.slice(5, -2)
        };

        let existing = favorites.find(function(item) {
            return item.name === product.name;
        });

        if (existing) {
            favorites = favorites.filter(function(item) {
                return item.name !== product.name;
            });

            button.textContent = "♡";

        } else {
            favorites.push(product);
            button.textContent = "♥";
        }

        saveFavorites();
        displayFavorites();

    });

});

// Display Favorites

function displayFavorites() {

    let wishlistSection = document.getElementById("wishlist-section");
    let wishlistContainer = document.getElementById("wishlist-container");

    if (!wishlistSection || !wishlistContainer) return;

    if (favorites.length === 0) {
        wishlistSection.style.display = "none";
        return;
    }

    wishlistSection.style.display = "block";
    wishlistContainer.innerHTML = "";

    favorites.forEach(function(item, index) {

        wishlistContainer.innerHTML += `
            <div class="wishlist-card">

                <img src="${item.image}" alt="${item.name}">

                <h3>${item.name}</h3>

                <p>$${item.price.toFixed(2)}</p>
<button class="cart-btn" onclick="moveFavoriteToCart(${index})">
    Add to Cart
</button>

            </div>
        `;

    });

}


// Move Favorite To Cart

function moveFavoriteToCart(index) {

    let item = favorites[index];

    let existingProduct = cart.find(function(product) {
        return product.name === item.name;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }

    favorites.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavorites();
    displayCart();
    updateCartCount();
    updateSummary();
}

displayFavorites();

// Register

let registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let email = document.getElementById("registerEmail").value;
        let password = document.getElementById("registerPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let existingUser = users.find(function(user) {
            return user.email === email;
        });

        if (existingUser) {
            alert("This email is already registered!");
            return;
        }

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully!");

        window.location.href = "login.html";
    });
}
// Login

let loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let currentUser = users.find(function(user) {
            return user.email === email && user.password === password;
        });

        if (currentUser) {
            sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

            alert("Login Successful! Welcome to Sweet Circles ❤️");

            window.location.href = "index.html";
        } else {
            alert("Invalid Email or Password!");
        }
    });
}
// Check Login Before Checkout

let checkoutBtn = document.querySelector(".checkout-btn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {

        let currentUser = sessionStorage.getItem("currentUser");

        if (!currentUser) {
            alert("Please login first to complete your order!");
            window.location.href = "login.html";
        } else {
            alert("You can proceed with your order!");
        }

    });
}

// Category Filter

let category = document.getElementById("category");

if (category) {
    category.addEventListener("change", function() {

        let selectedCategory = category.value.toLowerCase();

        let sections = document.querySelectorAll(".products");

        sections.forEach(function(section) {

            if (selectedCategory === "all" ||
                section.id === selectedCategory) {

                section.style.display = "block";

            } else {

                section.style.display = "none";

            }

        });

    });
}