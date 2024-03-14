
//------------------------------------------------------------------
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById ("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-conut");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const spanItem = document.getElementById("date-span");
//------------------------------------------------------------------

let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
     let parentButton = event.target.closest(".add-to-cart-btn");
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

function addToCart(name, price){
    const existingItem = cart.find( item => item.name === name)

    if(existingItem){
        existingItem.qtde += 1;
    }else{
        cart.push({
            name,
            price,
            qtde: 1,
        })
    }

    updateCartModal();

}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}<p/>
                    <p>Qtde: ${item.qtde}<p/>
                    <p class="font-medium mt-2">${item.price.toFixed(2)}<p/>
                </div>

                <button class="remove-fron-cart-btn" data-name"${item.name}>
                    Remover
                </button>

            </div>
        `
        total += item.price * item.qtde;

        cartItemsContainer.appendChild(cartItemElement);

    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-fron-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.qtde > 1){
            item.qtde -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestauranteOpen();
    if(!isOpen){
        

        Toastify({
            text: "O restaurante esta fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #fda01d, #b43a3a)",
            },
          }).showToast();
        return;
    }

    if(cart.length === 0)
    return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: ${item.qtde} Preço: ${item.price} |`
        )
    }).join("")

    const mensage = encodeURIComponent(cartItems);
    const phone = "77999018695"

    window.open(`https://wa.me/${phone}?text=${mensage} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();

})

function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 11 && hora < 12;
}

const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}