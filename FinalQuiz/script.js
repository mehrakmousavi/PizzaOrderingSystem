"use strict";

document.addEventListener("DOMContentLoaded", function () { 
    // Get elements
    const pizzaCheckbox = document.getElementById("slice-of-pizza");
    const pizzaQuantityInput = document.getElementById("pizza-quantity");

    const toppingsCheckboxes = document.querySelectorAll(".quantity-container.toppings input[type='checkbox']");
    const sidesCheckboxes = document.querySelectorAll(".quantity-container.sides input[type='checkbox']");
    const drinkRadios = document.querySelectorAll("input[name='drink']");

    const viewOrderBtn = document.getElementById("viewOrderBtn");
    const refreshOrderBtn = document.getElementById("refreshOrderBtn");
    const orderDisplay = document.getElementById("order-display");
    const orderList = document.getElementById("order-list");

    // Prices for items
    const prices = {
        pizza: 2.00,
        toppings: {
            pepperoni: 0.25,
            meatballs: 0.35,
            mushrooms: 0.40,
            olives: 0.20
        },
        sides: {
            "potato-salad": 1.25,
            hummus: 2.50,
            "caesar-salad": 3.50,
            "garden-salad": 2.25
        },
        drinks: {
            "drink-soda-small": 1.95,
            "drink-soda-medium": 2.20,
            "drink-soda-large": 2.50,
            "drink-juice": 2.00,
            "drink-water": 1.25
        }
    };

    // Function to capture selected order
    function getOrder() {
        const order = {
            pizza: [],
            toppings: [],
            sides: [],
            drinks: []
        };

        // Capture pizza selection
        if (pizzaCheckbox.checked) {
            const quantity = parseInt(pizzaQuantityInput.value, 10) || 1; // Default to 1 if no quantity is entered
            order.pizza.push({ item: "Slice of Pizza", price: prices.pizza * quantity, quantity });
        }

        // Capture selected toppings
        toppingsCheckboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                const topping = checkbox.id.split("-")[1];
                const quantityInput = document.getElementById(`topping-${topping}-quantity`);
                const quantity = parseInt(quantityInput.value, 10) || 1;
                order.toppings.push({ item: topping, price: prices.toppings[topping] * quantity, quantity });
            }
        });

        // Capture selected sides
        sidesCheckboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                const side = checkbox.id.replace("side-", ""); // Remove 'side-' prefix
                const quantityInput = document.getElementById(`side-${side}-quantity`);
                const quantity = parseInt(quantityInput.value, 10) || 1;
                order.sides.push({ item: side, price: prices.sides[side] * quantity, quantity });
            }
        });

        // Capture selected drinks
        drinkRadios.forEach(function (radio) {
            if (radio.checked) {
                const drink = radio.id;
                const quantityInput = document.getElementById(`${drink}-quantity`);
                const quantity = parseInt(quantityInput.value, 10) || 1;
                if (prices.drinks[drink]) {
                    order.drinks.push({ item: drink, price: prices.drinks[drink] * quantity, quantity });
                }
            }
        });

        return order;
    }

    // Function to calculate and display the order with subtotal, tax, and total
    function displayOrder() {
        const savedOrder = JSON.parse(localStorage.getItem("order"));
        if (!savedOrder || (savedOrder.pizza.length === 0 && savedOrder.toppings.length === 0 && savedOrder.sides.length === 0 && savedOrder.drinks.length === 0)) {
            orderList.innerHTML = "<li>No items selected yet.</li>";
            orderDisplay.style.display = "block";
            return;
        }

        orderList.innerHTML = "";
        let subtotal = 0; // Initialize subtotal

        // Display pizza order
        savedOrder.pizza.forEach(function (pizzaItem) {
            const pizzaElement = document.createElement("li");
            pizzaElement.textContent = `${pizzaItem.item} (x${pizzaItem.quantity}) - $${pizzaItem.price.toFixed(2)}`;
            orderList.appendChild(pizzaElement);
            subtotal += pizzaItem.price; // Add to subtotal
        });

        // Display toppings order
        savedOrder.toppings.forEach(function (topping) {
            const toppingElement = document.createElement("li");
            toppingElement.textContent = `${topping.item.charAt(0).toUpperCase() + topping.item.slice(1)} (x${topping.quantity}) - $${topping.price.toFixed(2)}`;
            orderList.appendChild(toppingElement);
            subtotal += topping.price; // Add to subtotal
        });

        // Display sides order
        savedOrder.sides.forEach(function (side) {
            const sideElement = document.createElement("li");
            sideElement.textContent = `${side.item.replace("-", " ").toUpperCase()} (x${side.quantity}) - $${side.price.toFixed(2)}`;
            orderList.appendChild(sideElement);
            subtotal += side.price; // Add to subtotal
        });

        // Display drinks order
        savedOrder.drinks.forEach(function (drink) {
            const drinkElement = document.createElement("li");
            const drinkName = drink.item.replace("-", " ").toUpperCase();
            drinkElement.textContent = `${drinkName} (x${drink.quantity}) - $${drink.price.toFixed(2)}`;
            orderList.appendChild(drinkElement);
            subtotal += drink.price; // Add to subtotal
        });

        // Calculate tax (e.g., 5%)
        const taxRate = 0.05;
        const tax = subtotal * taxRate;

        // Calculate total
        const total = subtotal + tax;

        // Display subtotal, tax, and total
        const subtotalElement = document.createElement("li");
        subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        orderList.appendChild(subtotalElement);

        const taxElement = document.createElement("li");
        taxElement.textContent = `Tax (5%): $${tax.toFixed(2)}`;
        orderList.appendChild(taxElement);

        const totalElement = document.createElement("li");
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
        orderList.appendChild(totalElement);

        orderDisplay.style.display = "block";
    }

    // Event listener for the "Your Order" button
    viewOrderBtn.addEventListener("click", function () {
        const order = getOrder();  // Get the current order
        localStorage.setItem("order", JSON.stringify(order));  // Save the order in localStorage
        displayOrder();
    });

    // Event listener for the "Refresh Order" button
    refreshOrderBtn.addEventListener("click", function () {
        // Clear localStorage and hide the order display
        localStorage.removeItem("order");
        orderList.innerHTML = "<li>No items selected yet.</li>";
        orderDisplay.style.display = "none"; // Hide the order display
    });

    // Check if there is a saved order in localStorage and display it
    displayOrder();
});
