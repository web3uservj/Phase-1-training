document.addEventListener('DOMContentLoaded', () => {
  const menuItems = [
    { id: 1, name: "Burger", price: 99, date: "2024-06-01", category: "Fast Food", freeDelivery: true },
    { id: 2, name: "Pizza", price: 199, date: "2024-07-01", category: "Italian", freeDelivery: false },
  ];

  const isAdminPage = window.location.pathname.includes("admin-menu");
  const isCustomerPage = window.location.pathname.includes("customer-menu");
  const isCartPage = window.location.pathname.includes("cart");

  if (isAdminPage) {
    const adminMenuBody = document.getElementById('adminMenuBody');
    menuItems.forEach(item => {
      adminMenuBody.innerHTML += `
        <tr>
          <td>${item.id}</td><td>${item.name}</td><td>₹${item.price}</td><td>${item.date}</td>
          <td>${item.category}</td><td>${item.freeDelivery ? "Yes" : "No"}</td>
          <td><a href="edit-item.html" class="btn btn-sm btn-warning">Edit</a></td>
        </tr>`;
    });
  }

  if (isCustomerPage) {
    const today = new Date().toISOString().split('T')[0];
    const menuDiv = document.getElementById('menuItems');
    menuItems
      .filter(item => new Date(item.date) <= new Date())
      .forEach(item => {
        menuDiv.innerHTML += `
          <div class="col">
            <div class="card p-3 shadow-sm">
              <h5>${item.name}</h5>
              <p>₹${item.price} - ${item.category}</p>
              <button class="btn btn-sm btn-success" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
          </div>`;
      });
  }

  if (isCartPage) {
    const cartDiv = document.getElementById('cartItems');
    const emptyMsg = document.getElementById('emptyMsg');
    const cart = JSON.parse(localStorage.getItem('cart') || "[]");

    if (cart.length === 0) {
      emptyMsg.textContent = "There are no items in the cart.";
    } else {
      cart.forEach(id => {
        const item = menuItems.find(m => m.id === id);
        cartDiv.innerHTML += `
          <div class="col">
            <div class="card p-3">
              <h5>${item.name}</h5>
              <p>₹${item.price}</p>
              <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>`;
      });
    }
  }
});

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || "[]");
  cart.push(id);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Item added to cart!");
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || "[]");
  cart = cart.filter(item => item !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}
