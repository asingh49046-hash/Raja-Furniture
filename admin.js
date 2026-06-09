import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const photoInput = document.getElementById("photo");
const uploadBtn = document.getElementById("uploadBtn");
const gallery = document.getElementById("gallery");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
  } else {
    loadAdminGallery();
  }
});

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();

      img.onload = function () {
        const canvas = document.createElement("canvas");

        const maxWidth = 900;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedImage);
      };

      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

uploadBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];

  if (!file) {
    alert("Please select a photo");
    return;
  }

  try {
    uploadBtn.innerText = "Uploading...";
    uploadBtn.disabled = true;

    const imageData = await compressImage(file);

    await addDoc(collection(db, "furniturePhotos"), {
      imageData: imageData,
      createdAt: serverTimestamp()
    });

    alert("Photo posted successfully");
    photoInput.value = "";

  } catch (error) {
    console.error(error);
    alert("Upload failed: " + error.message);
  } finally {
    uploadBtn.innerText = "Post Photo";
    uploadBtn.disabled = false;
  }
});

function loadAdminGallery() {
  const q = query(
    collection(db, "furniturePhotos"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    gallery.innerHTML = "";

    if (snapshot.empty) {
      gallery.innerHTML = "<p>No photos posted yet.</p>";
      return;
    }

    snapshot.forEach((item) => {
      const data = item.data();

      const card = document.createElement("div");
      card.className = "photo-card";

      card.innerHTML = `
        <img src="${data.imageData}" alt="Furniture Photo">
        <button class="danger delete-btn" data-id="${item.id}">
          Delete
        </button>
      `;

      gallery.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");

        if (!confirm("Kya aap is photo ko delete karna chahte hain?")) return;

        try {
          await deleteDoc(doc(db, "furniturePhotos", id));
          alert("Photo deleted successfully");
        } catch (error) {
          console.error(error);
          alert("Delete failed: " + error.message);
        }
      });
    });
  });
}

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = "admin-login.html";
});