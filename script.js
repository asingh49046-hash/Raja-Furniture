function uploadPhoto() {
  const photoInput = document.getElementById("photo");
  if (!photoInput) return;

  const file = photoInput.files[0];

  if (!file) {
    alert("Please select a photo");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    let images = JSON.parse(localStorage.getItem("rajaFurnitureImages")) || [];
    images.push(e.target.result);
    localStorage.setItem("rajaFurnitureImages", JSON.stringify(images));

    alert("Photo posted successfully");
    window.location.href = "admin.html";
  };

  reader.readAsDataURL(file);
}

function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const images = JSON.parse(localStorage.getItem("rajaFurnitureImages")) || [];

  if (images.length === 0) {
    gallery.innerHTML = "<p>No photos posted yet.</p>";
    return;
  }

  gallery.innerHTML = "";

  const isAdminPage = window.location.pathname.includes("admin.html");

  images.forEach(function (imgSrc, index) {
    const card = document.createElement("div");
    card.className = "photo-card";

    card.innerHTML = `
      <img src="${imgSrc}" alt="Furniture Photo">

      ${
        isAdminPage
          ? `<button class="danger" onclick="deletePhoto(${index})">Delete</button>`
          : ""
      }
    `;

    gallery.appendChild(card);
  });
}

function deletePhoto(index) {
  const confirmDelete = confirm("Kya aap is photo ko delete karna chahte hain?");

  if (!confirmDelete) return;

  let images = JSON.parse(localStorage.getItem("rajaFurnitureImages")) || [];

  images.splice(index, 1);

  localStorage.setItem("rajaFurnitureImages", JSON.stringify(images));

  loadGallery();
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

loadGallery();