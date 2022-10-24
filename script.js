let modalQt = 1;
let cart = [];

const c = function (el) {
    return document.querySelector(el);
}

const cs = (el) => document.querySelectorAll(el);

pizzaJson.map(function (item, index) {
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true); //clonar

    pizzaItem.setAttribute('data-key', index); // adiciona as informaçoes do modelo
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalkey = key;

        c('.pizzaBig img').src = pizzaJson[key].img; // informaçoes do modal
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        //
        console.log(pizzaJson[key]);

        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
        console.log(pizzaJson[key]);
        console.log('clicou na pizza')

        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    c('.pizza-area').append(pizzaItem);
});


// *** Eventos do MODAL

function closeModal() { // efeito modal
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => { //menos
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => { //mais
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex) => { //select
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key');

    let identifier = pizzaJson[modalKey].id + '@' + size; // identificador para quantidade
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({ // adiciona ao carrinho
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', () => {// abrir no mobile
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';// fechar no mobile
});

function uptadeCart() {// funçao para atualizar o carrinho
    c('.menu-openner span').innerHTML = cart.length
    //verificar itens  
    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; // zerar e listar

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;

            // clonar o cart--item
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch (cart[i].size) {
                case '0':
                    pizzaSizeName = 'P';
                    break;
                case '1':
                    pizzaSizeName = 'M';
                    break;
                case '2':
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => { // menos
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                uptadeCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                uptadeCart();
            });
            c('.cart').append(cartItem);
            console.log(pizzaItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show'); // remove a tela de carrinho
        c('aside').style.left = '100vw'
    }
}

