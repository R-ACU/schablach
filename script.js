const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const navLinks = document.querySelectorAll("[data-nav]");

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.getElementById("main-nav");

if (navToggle && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const serviceMapEl = document.getElementById("service-map");

if (serviceMapEl && typeof L !== "undefined") {
  const points = [
    {
      name: "Hannover",
      coords: [52.3759, 9.732],
      text: "Hauptstandort für schnelle Abstimmung und laufende Betreuung",
    },
    {
      name: "Mönchengladbach",
      coords: [51.1805, 6.4428],
      text: "Weitere Einsatzregion nach Auftrag und Terminplanung",
    },
    {
      name: "Bad Pyrmont",
      coords: [51.9856, 9.2523],
      text: "Flexible Einsätze nach Absprache im Stadtgebiet und Umland",
    },
  ];

  const map = L.map(serviceMapEl, {
    scrollWheelZoom: false,
  }).setView([51.95, 8.45], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const bounds = [];

  points.forEach((point) => {
    const icon = L.divIcon({
      className: "",
      html: '<span class="custom-map-marker" aria-hidden="true"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    L.marker(point.coords, { icon })
      .addTo(map)
      .bindPopup(
        `<div class="custom-map-popup"><h3>${point.name}</h3><p>${point.text}</p></div>`
      );

    L.circle(point.coords, {
      radius: 16000,
      color: "#347763",
      weight: 1.5,
      fillColor: "#4e8f7b",
      fillOpacity: 0.13,
    }).addTo(map);

    bounds.push(point.coords);
  });

  map.fitBounds(bounds, { padding: [34, 34] });
}
