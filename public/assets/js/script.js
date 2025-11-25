'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}
// Select all "View Details" buttons
document.querySelectorAll('.view-details-btn').forEach(function(btn) {
  btn.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link behavior

      // Find the closest image container
      const imageContainer = this.closest('.img-zoomable');

      // Toggle a CSS class to zoom the image to the whole page
      imageContainer.classList.toggle('zoomed');
  });
});




/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () { navbar.classList.toggle("active"); }

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () { navbar.classList.remove("active"); }

addEventOnElem(navLinks, "click", closeNavbar);



/**
 * header & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});
// ===============================
//  ARTOVEX GALLERY (DYNAMIC LOAD)
// ===============================

const galleryList = document.getElementById("gallery-list");

async function loadArtworks() {
  if (!galleryList) return; // safety check

  try {
    const response = await fetch("/api/artworks");
    if (!response.ok) {
      throw new Error("Failed to load artworks");
    }

    const artworks = await response.json();

    // Clear existing content (if any)
    galleryList.innerHTML = "";

    if (!artworks.length) {
      galleryList.innerHTML = `
        <li>
          <p style="text-align:center; width:100%;">
            No artworks available yet. Please check back later.
          </p>
        </li>
      `;
      return;
    }

    artworks.forEach((artwork) => {
      const li = document.createElement("li");
      li.className = "scrollbar-item";

      li.innerHTML = `
        <div class="gallery-card">
          <figure class="card-banner img-holder" style="--width: 736; --height: 1040;">
            <img src="${artwork.fileUrl}"
                 loading="lazy"
                 alt="${artwork.title || 'Artwork'}"
                 class="img-cover">
          </figure>
          <div class="card-content">
            <h3 class="h3">
              <a href="#" class="card-title">${artwork.title || "Untitled Artwork"}</a>
            </h3>
            <p class="card-text">
              ${artwork.description || "No description provided."}
            </p>
            <a href="#" class="btn-link has-before view-details-btn">View Details</a>

          </div>
        </div>
      `;

      galleryList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    galleryList.innerHTML = `
      <li>
        <p style="text-align:center; color:red; width:100%;">
          Failed to load artworks. Please try again later.
        </p>
      </li>
    `;
  }
}

// Load artworks when page is ready
window.addEventListener("DOMContentLoaded", loadArtworks);
// ===============================
//  VIEW DETAILS TOGGLE
// ===============================
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-details-btn")) {
    e.preventDefault();

    const card = e.target.closest(".gallery-card");
    const desc = card.querySelector(".card-text");

    desc.classList.toggle("expanded");

    // Change button text
    if (desc.classList.contains("expanded")) {
      e.target.textContent = "Hide Details";
    } else {
      e.target.textContent = "View Details";
    }
  }
});

