/* ==========================================
   CAMPUSBITE APPLICATION
========================================== */


/* ==========================================
   LOGIN
========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const role =
            document.getElementById("role").value;


        if (!username || !password) {

            alert("Please enter your username and password.");

            return;

        }


        localStorage.setItem(
            "loggedInUser",
            username
        );

        localStorage.setItem(
            "userRole",
            role
        );


        if (role === "student") {

            window.location.href = "menu.html";

        }

        else if (role === "cashier") {

            window.location.href = "pos.html";

        }

        else if (role === "kitchen") {

            window.location.href = "kitchen.html";

        }

        else if (role === "admin") {

            window.location.href = "admin.html";

        }

    });

}


/* ==========================================
   LOGOUT
========================================== */

function logout() {

    localStorage.removeItem("loggedInUser");

    localStorage.removeItem("userRole");

}


/* ==========================================
   CART
========================================== */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


function addToCart(name, price) {

    const existingItem =
        cart.find(
            item => item.name === name
        );


    if (existingItem) {

        existingItem.quantity++;

    }

    else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    showCartMessage(name);

}


function showCartMessage(name) {

    const message =
        document.createElement("div");

    message.className =
        "cart-toast";

    message.innerHTML =
        `✓ ${name} added to cart`;


    document.body.appendChild(message);


    setTimeout(() => {

        message.classList.add("show");

    }, 10);


    setTimeout(() => {

        message.remove();

    }, 2000);

}


function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.innerText = count;

    }

}


updateCartCount();


/* ==========================================
   DISPLAY CART
========================================== */

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");


    if (!cartContainer) {

        return;

    }


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h2>Your cart is empty</h2>

                <p>
                    Add some delicious food from the menu.
                </p>

                <a
                    href="menu.html"
                    class="btn btn-primary"
                >
                    Browse Menu
                </a>

            </div>

        `;

        updateCartTotals();

        return;

    }


    cartContainer.innerHTML =
        cart.map(
            (item, index) => `

                <div class="cart-item">

                    <div class="cart-item-image">
                        🍴
                    </div>

                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₱${item.price.toFixed(2)}
                            each
                        </p>

                    </div>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(
                                ${index},
                                -1
                            )"
                        >
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="changeQuantity(
                                ${index},
                                1
                            )"
                        >
                            +
                        </button>

                    </div>

                    <div>

                        <strong>
                            ₱${(
                                item.price *
                                item.quantity
                            ).toFixed(2)}
                        </strong>

                        <button
                            class="remove-button"
                            onclick="removeFromCart(
                                ${index}
                            )"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `
        )
        .join("");


    updateCartTotals();

}


function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

    updateCartCount();

}


function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();

    updateCartCount();

}


function updateCartTotals() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    const subtotalElement =
        document.getElementById("subtotal");

    const totalElement =
        document.getElementById("total");


    if (subtotalElement) {

        subtotalElement.innerText =
            `₱${subtotal.toFixed(2)}`;

    }


    if (totalElement) {

        totalElement.innerText =
            `₱${subtotal.toFixed(2)}`;

    }

}


displayCart();


/* ==========================================
   CHECKOUT
========================================== */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add an item first."
        );

        return;

    }


    const orderNumber =
        "CB-" +
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const order = {

        orderNumber:
            orderNumber,

        items:
            [...cart],

        total:
            total,

        status:
            "Pending",

        date:
            new Date().toISOString()

    };


    let orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    orders.push(order);


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    cart = [];

    saveCart();

    updateCartCount();


    alert(
        `Order ${orderNumber} placed successfully!\n\nTotal: ₱${total.toFixed(2)}\n\nPlease proceed to the cashier for payment.`
    );


    window.location.href =
        "menu.html";

}


/* ==========================================
   MENU FILTER
========================================== */

function filterMenu(category, button) {

    const cards =
        document.querySelectorAll(
            ".food-card"
        );


    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(
        btn =>
            btn.classList.remove(
                "active"
            )
    );


    if (button) {

        button.classList.add("active");

    }


    cards.forEach(card => {

        if (
            category === "all" ||
            card.dataset.category === category
        ) {

            card.style.display =
                "block";

        }

        else {

            card.style.display =
                "none";

        }

    });

}


/* ==========================================
   LOAD ORDERS FOR POS
========================================== */

function loadOrdersForPOS() {

    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    console.log(
        "Orders stored:",
        orders
    );

}


loadOrdersForPOS();