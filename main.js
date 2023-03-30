// https://fakeapi.platzi.com/  => fake api sayfasi: ordan copy yap url'yi ve fetch'e paste yap

const categoryList = document.querySelector(".category-list");
const productList = document.querySelector(".product-list");

const modal = document.getElementById("modal-wrapper");
const cartBtn = document.getElementById("cart-btn");
const closeBtn = document.getElementById("close-btn");
const modalList = document.querySelector(".modal-list");
const totalExpenses = document.querySelector("#total");

// html yuklendiginde, fonksiyonlari call back function ile (birden fazla) calistir:
// call back function, ()=>{}, icerisinde baska fonksiyonlari calistiran fonksiyondur:
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

/*
// html yuklendiginde, tek fonksiyon calistir:
document.addEventListener("DOMContentLoaded", fetchCategories());
*/

// CATEGORIES  - cekme islemi

// fonksiyon (sablon)
const fetchCategories = () => {
  fetch("https://api.escuelajs.co/api/v1/categories")
    .then((res) => res.json())
    // data json formatinda gelsin diye (obje seklinde)

    // eger json() basarili ise data'yi goster:
    .then((data) =>
      // data dizisindeki her bir eleman icin ekrana kategori basmak
      data.slice(0, 6).forEach((category) => {
        // gelen her obje icin div olusturmak:
        const categoryDiv = document.createElement("div");
        // olusturulan div'e class vermek:
        categoryDiv.classList.add("category");
        // div'e icerik ekleme (img,p):
        categoryDiv.innerHTML = `
            <img src="${category.image}">
            <p>${category.name}</p>
       `;
        //olusan elemani listeye (<div class="category-list"></div>) yonlendirme
        categoryList.appendChild(categoryDiv);
      })
    );
};
//(Sayfadaki html yuklendiginde ("DOMContentLoaded") calissin); bu fonksiyonu calistirmak icin addEventListener("DOMContentLoaded") use:

// PRODUCTS - cekme islemi
const fetchProducts = () => {
  fetch(" https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 24).forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("card");
        productDiv.innerHTML = `
        <img src="${product.images}">   
                    <p>${product.title}</p>
                    <p>${product.category.name}</p>
                    <div class="card-footer">
                        <span>${product.price} $</span>
                        <button onclick='addToCart({id:${product.id}, name:"${product.title}", price:"${product.price}", img:"${product.images}", amount: 1})'>Add to cart</button>
                    </div>
         `;
        productList.appendChild(productDiv);
      })
    );
};

// <img src="${product.images[0]}">
// eger cok foto varsa db'te, bu sekilde secebilirsin
//----------------------------------------------------

// MODALS - acma ve kapatma islemi:

let cart = [];
let totalPrice = 0;

function listCart() {
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("item");
    // item'in icerisindeki icerik:
    cartItem.innerHTML = `
    <img src="${item.img}">
    <h2>${item.name}</h2>
    <h2>${item.price} $</h2>
    <p>(${item.amount})</p>
    `;
    modalList.appendChild(cartItem);
    totalPrice += item.price * item.amount;
  });
}

const toggleModal = () => {
  modal.classList.toggle("active");
};

// sepeti acmak ve eleman eklemek:
cartBtn.addEventListener("click", () => {
  // sepeti acmak:
  toggleModal();
  // sepetin icine eleman eklemek:
  listCart();
  // sepeti guncelle (toplam fiyati gosterir:)
  totalExpenses.innerText = totalPrice; 
});
// sepeti kapatma ve eleman temizleme:
closeBtn.addEventListener("click", () => {
  //sepeti kapatmak:
  toggleModal();
  // sepetteki elemani temizlemek (sepeti bosaltmak):
  modalList.innerHTML = " ";
  // toplam fiyati sifirlama:
  totalPrice = 0;
});

// SEPETE EKLEME ISLEMI:

const addToCart = (param) => {
  // cart'in icinde eklemek istedigimiz product varmi yok mu:
  const foundItem = cart.find((item) => item.id === param.id);
  // ver ise miktarini +1 yapacagiz:
  if (foundItem) {
    foundItem.amount += 1;
    // yok ise product cart'a eklenir:
  } else {
    cart.push(param);
  }
};
