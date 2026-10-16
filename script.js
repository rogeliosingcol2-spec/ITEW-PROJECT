$(document).ready(function () {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    $(".add-to-cart").click(function (e) {
        e.preventDefault(); // stop the "#" link from jumping to the top

        let id = Number($(this).data("id"));
        let name = $(this).data("name");
        let price = Number($(this).data("price"));

        let existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }

        saveCart();
        $("#message").text(name + " added to cart!");
        displayCart();
    });

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function displayCart() {
        $("#cart-items").empty();

        let total = 0;
        let totalQty = 0;

        if (cart.length === 0) {
            $("#cart-items").html(
                '<tr><td colspan="5" class="text-center">' +
                'Your cart is empty.</td></tr>'
            );
        }

        cart.forEach(function (item) {
            let subtotal = item.price * item.quantity;
            total += subtotal;
            totalQty += item.quantity;

            $("#cart-items").append(`
                <tr>
                    <td>${item.name}</td>
                    <td>₱${item.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-outline-secondary btn-sm change-qty"
                                data-id="${item.id}" data-change="-1">−</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm change-qty"
                                data-id="${item.id}" data-change="1">+</button>
                    </td>
                    <td>₱${subtotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-item"
                                data-id="${item.id}">
                            Remove
                        </button>
                    </td>
                </tr>
            `);
        });

        $("#total").text("₱" + total.toFixed(2));
        $("#cart-count").text(totalQty);

        makeResponsiveTable();
    }

    $("#cart-items").on("click", ".change-qty", function () {
        let id = Number($(this).data("id"));
        let change = Number($(this).data("change"));

        let item = cart.find(p => p.id === id);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id);
        }

        saveCart();
        displayCart();
    });

    $("#cart-items").on("click", ".remove-item", function () {
        let id = Number($(this).data("id"));

        cart = cart.filter(item => item.id !== id);

        saveCart();
        displayCart();
    });

    $("#clear-cart").click(function () {
        cart = [];
        localStorage.removeItem("cart");
        displayCart();
        $("#message").text("Cart cleared.");
    });

    $("#place-order").click(function () {
        if (cart.length === 0) {
            $("#message").text("Your cart is empty.");
            return;
        }

        alert("Order placed successfully!");

        cart = [];
        localStorage.removeItem("cart");
        displayCart();
        $("#message").text("");
    });

    function makeResponsiveTable() {
        let screenWidth = $(window).width();

        if (screenWidth <= 600) {
            $("#cartTable thead").hide();
            $("#cartTable tbody tr").each(function () {
                $(this).addClass("mobile-row").css("display", "block");

                $(this).find("td").each(function (index) {
                    let heading = $("#cartTable thead th").eq(index).text();

                    $(this).addClass("mobile-cell").css({
                        "display": "block",
                        "width": "100%",
                        "text-align": "left"
                    });

                    if (heading && $(this).find(".mobile-label").length === 0) {
                        $(this).prepend(
                            $("<span>")
                                .addClass("mobile-label fw-bold")
                                .text(heading + ": ")
                        );
                    }
                });
            });
        } else {
            $("#cartTable thead").show();

            $("#cartTable tbody tr")
                .removeClass("mobile-row")
                .css("display", "");

            $("#cartTable td")
                .removeClass("mobile-cell")
                .css({
                    "display": "",
                    "width": "",
                    "text-align": ""
                });

            $(".mobile-label").remove();
        }
    }

    $(window).on("resize", function () {
        makeResponsiveTable();
    });

    displayCart();
});