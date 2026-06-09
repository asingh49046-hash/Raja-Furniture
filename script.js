import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const gallery = document.getElementById("gallery");

if (gallery) {
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
      `;

      gallery.appendChild(card);
    });
  });
}