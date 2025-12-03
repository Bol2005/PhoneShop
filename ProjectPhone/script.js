const iPhoneData = {
    X: {
        series: { Standard: 999 },
        colors: ["silver", "black"],
    },
    XS: {
        series: { Standard: 999, Max: 1099 },
        colors: ["silver", "black", "gold"],
    },
    XR: {
        series: { Standard: 799 },
        colors: ["white", "black", "blue", "red"],
    },
    11: {
        series: { Standard: 699 },
        colors: ["white", "black", "purple", "red", "green", "yellow"],
    },
    12: {
        series: { Standard: 799, Mini: 729, Pro: 999, "Pro Max": 1099 },
        colors: ["black", "white", "red", "green", "blue", "purple"],
    },
    13: {
        series: { Standard: 799, Mini: 729, Pro: 999, "Pro Max": 1099 },
        colors: ["black", "white", "red", "blue", "purple", "green", "gold"],
    },
    14: {
        series: { Standard: 799, Plus: 899, Pro: 999, "Pro Max": 1099 },
        colors: ["black", "white", "red", "blue", "purple", "gold", "titanium"],
    },
    15: {
        series: { Standard: 799, Plus: 899, Pro: 999, "Pro Max": 1099 },
        colors: ["black", "white", "blue", "red", "purple", "titanium", "green"],
    },
    16: {
        series: { Standard: 799, Plus: 899, Pro: 999, "Pro Max": 1099 },
        colors: ["black", "white", "blue", "purple", "gold", "titanium"],
    },
    17: {
        series: { Standard: 899, Plus: 999, Pro: 1099, "Pro Max": 1199 },
        colors: ["titanium", "silver", "black", "gold"],
    },
};

let cart = [];
let selectedColor = null;
let discountApplied = { value: 0, type: "percentage" };

const colorNames = {
    black: "Black",
    white: "White",
    silver: "Silver",
    gold: "Gold",
    blue: "Blue",
    red: "Red",
    green: "Green",
    purple: "Purple",
    titanium: "Titanium",
    yellow: "Yellow",
};

function initializeColorSelection() {
    const modelSelect = document.getElementById("model-select").value;
    const colorContainer = document.getElementById("color-selection");

    if (modelSelect && iPhoneData[modelSelect]) {
        colorContainer.innerHTML = "";
        iPhoneData[modelSelect].colors.forEach((color) => {
            const colorButton = document.createElement("div");
            colorButton.className = "color-option";
            colorButton.setAttribute("data-color", color);
            colorButton.onclick = () => selectColor(color);
            colorContainer.appendChild(colorButton);
        });
        selectedColor = null;
        document.getElementById("selected-color").textContent = "Select a color";
    }
}

function selectColor(color) {
    document.querySelectorAll(".color-option").forEach((btn) => {
        btn.classList.remove("selected");
    });
    document.querySelector(`[data-color="${color}"]`).classList.add("selected");
    selectedColor = color;
    document.getElementById(
        "selected-color"
    ).textContent = `Selected: ${colorNames[color]}`;
}

function displayProducts() {
    const model = document.getElementById("model-select").value;
    const series = document.getElementById("series-select").value;
    const grid = document.getElementById("products-grid");

    if (!model || !series) {
        grid.innerHTML =
            '<p class="empty-cart">Select a model and series to see products</p>';
        updateCheckoutButton();
        return;
    }

    const colors = iPhoneData[model].colors;
    const basePrice = iPhoneData[model].series[series];

    grid.innerHTML = colors
        .map((color) => {
            const price = basePrice + (color === "titanium" ? 50 : 0);
            return `
                    <div class="product-card">
                        <div class="product-image" style="background: linear-gradient(135deg, ${getColorGradient(
                color
            )});">
                            ${model} ${series} - ${color.charAt(0).toUpperCase() + color.slice(1)
                }
                        </div>
                        <div class="product-info">
                            <div class="product-name">iPhone ${model} ${series}</div>
                            <div class="product-color">${color.charAt(0).toUpperCase() + color.slice(1)
                }</div>
                            <div class="product-price">$${price}</div>
                            <button class="add-to-cart-btn" onclick="addToCart('${model}', '${series}', '${color}', ${price})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;
        })
        .join("");
}

function getColorGradient(color) {
    const gradients = {
        black: "#000000, #1a1a1a",
        white: "#f5f5f5, #e8e8e8",
        gold: "#ffd700, #ffed4e",
        silver: "#e8e8e8, #d3d3d3",
        blue: "#007aff, #0051d5",
        red: "#ff3b30, #ff1744",
        green: "#34c759, #00c853",
        purple: "#9c27b0, #7b1fa2",
        titanium: "#8b8b8b, #5a5a5a",
        yellow: "#ffcc00, #ffb300",
    };
    return gradients[color] || "#f0f0f0, #e5e5e5";
}

function addToCart(model, series, color, price) {
    const cartItem = {
        id: `${model}-${series}-${color}-${Date.now()}`,
        name: `iPhone ${model} ${series}`,
        series: series,
        color: color,
        price: price,
    };
    cart.push(cartItem);
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart
            .map(
                (item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-image" style="background: var(--color, #f5f5f5);" title="${item.color
                    }">
                            ${item.color.charAt(0).toUpperCase()}
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-color">${colorNames[item.color]
                    }</div>
                            <div class="cart-item-price">$${item.price.toFixed(
                        2
                    )}</div>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
                    </div>
                `
            )
            .join("");
        checkoutBtn.disabled = false;
    }

    updateTotals();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = 0;

    if (discountApplied.type === "percentage") {
        discount = (subtotal * discountApplied.value) / 100;
    } else {
        discount = Math.min(discountApplied.value, subtotal);
    }

    const total = subtotal - discount;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

function applyDiscount() {
    const discountAmount = parseFloat(
        document.getElementById("discount-amount").value
    );
    const discountType = document.getElementById("discount-type").value;

    if (isNaN(discountAmount) || discountAmount < 0) {
        document.getElementById("discount-info").textContent =
            "Please enter a valid amount";
        return;
    }

    discountApplied = { value: discountAmount, type: discountType };
    const discountText =
        discountType === "percentage"
            ? `${discountAmount}% OFF`
            : `$${discountAmount.toFixed(2)} OFF`;
    document.getElementById(
        "discount-info"
    ).textContent = `Discount applied: ${discountText}`;

    updateTotals();
}

function checkout() {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = 0;

    if (discountApplied.type === "percentage") {
        discount = (subtotal * discountApplied.value) / 100;
    } else {
        discount = Math.min(discountApplied.value, subtotal);
    }

    const total = subtotal - discount;

    const summaryHTML = cart
        .map(
            (item) => `
                <div class="modal-item">
                    <strong>${item.name}</strong>
                    <span>$${item.price.toFixed(2)}</span>
                </div>
                <div class="modal-item-color">${colorNames[item.color]}</div>
            `
        )
        .join("");

    document.getElementById("modal-summary").innerHTML = summaryHTML;
    document.getElementById("modal-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("modal-final-total").textContent = total.toFixed(2);

    if (discount > 0) {
        document.getElementById("discount-row").style.display = "flex";
        document.getElementById("modal-discount").textContent = discount.toFixed(2);
    } else {
        document.getElementById("discount-row").style.display = "none";
    }

    document.getElementById("confirmation-modal").classList.add("active");
}

function cancelCheckout() {
    document.getElementById("confirmation-modal").classList.remove("active");
}

function confirmPurchase() {
    document.getElementById("confirmation-modal").classList.remove("active");
    document.getElementById("success-message").classList.add("show");

    setTimeout(() => {
        document.getElementById("success-message").classList.remove("show");
        cart = [];
        selectedColor = null;
        discountApplied = { value: 0, type: "percentage" };
        document.getElementById("discount-amount").value = "";
        document.getElementById("discount-info").textContent = "";
        document.getElementById("model-select").value = "";
        document.getElementById("series-select").value = "";
        document.getElementById("series-select").disabled = true;
        document.getElementById("color-selection").innerHTML = "";
        document.getElementById("selected-color").textContent = "Select a color";
        updateCart();
        displayProducts();
    }, 2000);
}

function updateCheckoutButton() {
    const checkoutBtn = document.getElementById("checkout-btn");
    checkoutBtn.disabled = true;
}

document.getElementById("model-select").addEventListener("change", () => {
    initializeColorSelection();
    document.getElementById("series-select").value = "";
    document.getElementById("series-select").disabled = true;
    displayProducts();
});

document.getElementById("series-select").addEventListener("change", () => {
    displayProducts();
});

// Initialize series options based on selected model
document.getElementById("model-select").addEventListener("change", function () {
    const seriesSelect = document.getElementById("series-select");
    const selectedModel = this.value;

    seriesSelect.innerHTML = '<option value="">Choose Series</option>';
    seriesSelect.disabled = true;

    if (selectedModel && iPhoneData[selectedModel]) {
        const series = Object.keys(iPhoneData[selectedModel].series);
        series.forEach((s) => {
            const option = document.createElement("option");
            option.value = s;
            option.textContent = s;
            seriesSelect.appendChild(option);
        });
        seriesSelect.disabled = false;
    }
});
