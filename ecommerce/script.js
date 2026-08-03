const emptyCart = document.getElementById("empty-cart");

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 25000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXfCtbf1FwmNyQkZwl7zUFjx2FgWBihvOoFzJ0JIPf5g&s=10"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Accessories",
        price: 45000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrvYAe2RsqaDRhMnrVr_6O9u5OiRUw3rRCcRzjDOi1eQ&s=10"
    },
    {
        id: 3,
        name: "Gaming Mouse",
        category: "Electronics",
        price: 12500,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqUcYrKuQ4DMe53VSWW_haFtpAc220JuUdLWaEn_Q17w&s=10"
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 30000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR32sZ_U3ZhLK0Frb4oULWbY3B1CYZqn2pVgintXkRSDQ&s=10"
    },
    {
        id: 5,
        name: "Mechanical Keyboard",
        category: "Accessories",
        price: 38000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPMoE17tvD9yoQ2CVeAm4VDem-VhgOhcsVI90M3aWCdw&s=10"
    },
    {
        id: 6,
        name: "Gaming Laptop",
        category: "Computers",
        price: 550000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuvR0vTQyVdHhiVrvPDvXCBMkNjCqmBssudeehXfLVYw&s=10"
    }
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const itemCount = document.getElementById("item-count");
const totalPrice = document.getElementById("total-price");
const clearCartBtn = document.getElementById("clear-cart");


function displayProducts() {

    productGrid.innerHTML = "";

    products.forEach(product => {

        productGrid.innerHTML += `

        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <span class="category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>
                <h2>₦${product.price.toLocaleString()}</h2>

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
        `;
    });

}


function addToCart(id) {

    const product = products.find(item => item.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;

    } else {
        cart.push({...product,quantity: 1});
    }

    updateCart();

}


function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let items = 0;

    if (cart.length === 0) {

        emptyCart.style.display = "flex";
        cartItems.style.display = "none";

    } else {

        emptyCart.style.display = "none";
        cartItems.style.display = "block";

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        items += item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}">

            <div class="cart-details">

                <h4>${item.name}</h4>

                <p>₦${item.price.toLocaleString()}</p>

                <div class="quantity">

                    <button onclick="decrease(${item.id})">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="increase(${item.id})">+</button>

                </div>

            </div>

            <button
                class="remove-btn"
                onclick="removeItem(${item.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    cartCount.innerText = items;

    itemCount.innerText = `${items} Item${items !== 1 ? "s" : ""}`;

    totalPrice.innerText = `₦${total.toLocaleString()}`;

    localStorage.setItem("cart", JSON.stringify(cart));

}


function increase(id) {

    const item = cart.find(product => product.id === id);

    item.quantity++;

    updateCart();

}


function decrease(id) {

    const item = cart.find(product => product.id === id);

    item.quantity--;

    if (item.quantity === 0) {

        removeItem(id);

        return;

    }

    updateCart();

}


function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

}


clearCartBtn.addEventListener("click", () => {

    if (confirm("Clear cart?")) {

        cart = [];

        updateCart();

    }

});


document.querySelector(".checkout-btn").addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert("Thank you for shopping with ShopEasy!");

    cart = [];

    updateCart();

});


displayProducts();

updateCart();