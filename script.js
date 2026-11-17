const products = [
  {id:1,name:"Celeste Gold Necklace",category:"Necklaces",price:2499,image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",tag:"BESTSELLER"},
  {id:2,name:"Golden Bloom Earrings",category:"Earrings",price:1299,image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",tag:"NEW"},
  {id:3,name:"Solitaire Shine Ring",category:"Rings",price:1899,image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",tag:"POPULAR"},
  {id:4,name:"Dainty Gold Bracelet",category:"Bracelets",price:1599,image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",tag:""},
  {id:5,name:"Pearl Drop Necklace",category:"Necklaces",price:2999,image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",tag:"NEW"},
  {id:6,name:"Everyday Sparkle Hoops",category:"Earrings",price:999,image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=80",tag:""},
  {id:7,name:"Classic Promise Ring",category:"Rings",price:2199,image:"https://images.unsplash.com/photo-1599459183200-59c7687a0278?auto=format&fit=crop&w=700&q=80",tag:""},
  {id:8,name:"Golden Hour Bracelet",category:"Bracelets",price:1799,image:"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=80",tag:""}
];

let cart = [];
let wishlist = [];
let activeFilter = "All";
let searchTerm = "";

const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);

function renderProducts() {
  const visible = products.filter(p =>
    (activeFilter === "All" || p.category === activeFilter) &&
    (p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm))
  );
  $("#productGrid").innerHTML = visible.length ? visible.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <button class="wish-btn ${wishlist.includes(p.id) ? "selected" : ""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">${wishlist.includes(p.id) ? "♥" : "♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">ADD TO BAG +</button></div>
      </div>
    </article>`).join("") : `<p class="empty-state">No jewellery found. Try another search.</p>`;
}

function updateCounts() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#wishlistCount").textContent = wishlist.length;
  $("#cartTotal").textContent = money(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
}

function renderCart() {
  $("#cartItems").innerHTML = cart.length ? cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}">
      <div><h4>${item.name}</h4><small>${money(item.price)}</small>
        <div class="qty-controls"><button data-qty="${item.id}" data-change="-1">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-change="1">+</button></div>
      </div>
      <div><b>${money(item.price * item.qty)}</b><br><button class="remove-btn" data-remove="${item.id}">Remove</button></div>
    </div>`).join("") : `<div class="empty-state">Your bag is waiting for something beautiful. ♡</div>`;
  updateCounts();
}

function renderWishlist() {
  const saved = products.filter(p => wishlist.includes(p.id));
  $("#wishlistItems").innerHTML = saved.length ? saved.map(p => `
    <div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><small>${money(p.price)}</small><br><button class="remove-btn" data-unwish="${p.id}">Remove</button></div><button class="add-btn" data-add="${p.id}">ADD</button></div>`).join("") : `<div class="empty-state">Save the pieces you love here. ♡</div>`;
  updateCounts();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openDrawer(id) {
  closeDrawers();
  $("#overlay").classList.add("show");
  $(id).classList.add("open");
}
function closeDrawers() {
  $("#overlay").classList.remove("show");
  document.querySelectorAll(".side-drawer").forEach(d => d.classList.remove("open"));
}

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  if (add) {
    const product = products.find(p => p.id === Number(add.dataset.add));
    const existing = cart.find(item => item.id === product.id);
    existing ? existing.qty++ : cart.push({...product, qty:1});
    renderCart(); showToast(`${product.name} added to your bag`);
  }

  const wish = event.target.closest("[data-wish]");
  if (wish) {
    const id = Number(wish.dataset.wish);
    wishlist = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    renderProducts(); renderWishlist();
    showToast(wishlist.includes(id) ? "Added to your wishlist ♡" : "Removed from wishlist");
  }

  const qty = event.target.closest("[data-qty]");
  if (qty) {
    const item = cart.find(p => p.id === Number(qty.dataset.qty));
    item.qty += Number(qty.dataset.change);
    if (item.qty <= 0) cart = cart.filter(p => p.id !== item.id);
    renderCart();
  }

  const remove = event.target.closest("[data-remove]");
  if (remove) { cart = cart.filter(p => p.id !== Number(remove.dataset.remove)); renderCart(); }

  const unwish = event.target.closest("[data-unwish]");
  if (unwish) { wishlist = wishlist.filter(id => id !== Number(unwish.dataset.unwish)); renderWishlist(); renderProducts(); }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    activeFilter = filter.dataset.filter;
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === filter));
    renderProducts();
  }

  const category = event.target.closest("[data-category]");
  if (category) {
    activeFilter = category.dataset.category;
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
    renderProducts();
    $("#bestsellers").scrollIntoView({behavior:"smooth"});
  }

  if (event.target.matches("[data-close]") || event.target.id === "overlay") closeDrawers();
});

$("#cartToggle").addEventListener("click", () => { renderCart(); openDrawer("#cartDrawer"); });
$("#wishlistToggle").addEventListener("click", () => { renderWishlist(); openDrawer("#wishlistDrawer"); });
$("#overlay").addEventListener("click", closeDrawers);
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeDrawers));

$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));

$("#searchToggle").addEventListener("click", () => {
  $("#searchPanel").classList.toggle("open");
  if ($("#searchPanel").classList.contains("open")) $("#searchInput").focus();
});
function runSearch() {
  searchTerm = $("#searchInput").value.trim().toLowerCase();
  activeFilter = "All";
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === "All"));
  renderProducts();
  $("#bestsellers").scrollIntoView({behavior:"smooth"});
}
$("#searchButton").addEventListener("click", runSearch);
$("#searchInput").addEventListener("keydown", e => { if (e.key === "Enter") runSearch(); });

$("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return showToast("Your bag is empty");
  showToast("Demo only: connect a backend and payment gateway for checkout.");
});
$("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  $("#newsletterMessage").textContent = "Thank you for subscribing! (Demo form)";
  $("#newsletterEmail").value = "";
});
$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
renderWishlist();
