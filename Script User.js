let shops = JSON.parse(localStorage.getItem("shops")) || [
  {
    shopName: "Burger King",
    menu: [
      { name: "Burger", price: 80 },
      { name: "Fries", price: 50 }
    ]
  },
  {
    shopName: "A-1 Biryani",
    menu: [
      { name: "Chicken Biryani", price: 150 },
      { name: "Veg Biryani", price: 120 }
    ]
  }
];

let cart = [];
let currentShop = null;

const menuDiv = document.getElementById("menu");
const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const title = document.getElementById("title");
const backBtn = document.getElementById("backBtn");

document.getElementById("tableInfo").innerText =
  "🪑 Table No: " + (new URLSearchParams(location.search).get("table") || "Not Assigned");

showShops();

function showShops() {
  title.innerText = "🏪 Shops";
  backBtn.style.display = "none";
  menuDiv.innerHTML = "";
  shops.forEach((shop, i) => {
    menuDiv.innerHTML += `
      <div class="card">
        <h3>${shop.shopName}</h3>
        <button onclick="openShop(${i})">View Menu</button>
      </div>`;
  });
}

function openShop(index) {
  currentShop = index;
  title.innerText = shops[index].shopName;
  backBtn.style.display = "block";
  menuDiv.innerHTML = "";
  shops[index].menu.forEach(item => {
    menuDiv.innerHTML += `
      <div class="card">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <button onclick="addToCart('${item.name}',${item.price})">Add</button>
      </div>`;
  });
}

function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });
  updateCart();
}

function updateCart() {
  cartDiv.innerHTML = "";
  let total = 0;
  if (cart.length === 0) cartDiv.innerText = "No items";

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    cartDiv.innerHTML += `
      <div>
        ${item.name}
        <button onclick="qty(${i},-1)">−</button>
        ${item.qty}
        <button onclick="qty(${i},1)">+</button>
      </div>`;
  });
  totalDiv.innerText = "Total: ₹" + total;
}

function qty(i, val) {
  cart[i].qty += val;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  updateCart();
}

/* BILL */
function openBill() {
  if (cart.length === 0) return alert("Cart empty");
  document.getElementById("billModal").style.display = "block";
  let html = "", total = 0;
  cart.forEach(i => {
    total += i.price * i.qty;
    html += `<p>${i.name} × ${i.qty} = ₹${i.price*i.qty}</p>`;
  });
  document.getElementById("billItems").innerHTML = html;
  document.getElementById("billTotal").innerText = "Total: ₹" + total;
}

function closeBill() {
  document.getElementById("billModal").style.display = "none";
}

function confirmOrder() {
  alert("Order Placed 🎉");
  cart = [];
  updateCart();
  closeBill();
}

/* DARK MODE */
document.getElementById("darkToggle").onclick = () =>
  document.documentElement.classList.toggle("dark");
