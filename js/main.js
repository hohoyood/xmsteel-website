/* ==========================================================================
   Xueming Steel — main.js
   Small, dependency-free interactions shared across all pages:
   1. Sticky header shadow on scroll
   2. Mobile hamburger navigation
   3. Subtle reveal-on-scroll (fade-in)
   4. Request-a-Quote form -> mailto (placeholder; see TODO below)
   5. Footer year
   ========================================================================== */

(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  /* 1. Header shadow on scroll ---------------------------------------- */
  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 2. Mobile navigation ---------------------------------------------- */
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu when a link is tapped (mobile).
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* 3. Reveal-on-scroll ------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 4. Request-a-Quote form -> mailto (placeholder) --------------------- */
  /*
   * TODO: Connect this form to company email / backend.
   * For now it opens the user's email client with a pre-filled inquiry,
   * so no server is required in this first static version.
   *
   * Integration point (later): POST this form to a form handler or
   * company email service. Replace the `recipient` below with the real
   * company email address.
   */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Lightweight required-field check (native validation is off).
      var required = ["name", "country", "email", "material"];
      var missing = false;
      required.forEach(function (key) {
        var field = form.elements[key];
        if (field && !field.value.trim()) {
          field.style.borderColor = "#b2202c";
          missing = true;
        } else if (field) {
          field.style.borderColor = "";
        }
      });

      if (missing) {
        var note = form.querySelector(".form-note");
        if (note) {
          note.textContent = "Please fill in the required fields marked with *.";
        }
        return;
      }

      var val = function (key) {
        var f = form.elements[key];
        return f ? f.value.trim() : "";
      };

      var subject = "Inquiry: " + (val("material") || "Steel") + " (" + val("country") + ")";
      var body = [
        "Name: " + val("name"),
        "Company: " + val("company"),
        "Country: " + val("country"),
        "Email: " + val("email"),
        "WhatsApp: " + val("whatsapp"),
        "Material: " + val("material"),
        "Thickness: " + val("thickness"),
        "Width: " + val("width"),
        "Quantity: " + val("quantity"),
        "Required Hardness: " + val("hardness"),
        "",
        "Message:",
        val("message"),
      ].join("\n");

      // Placeholder recipient — replace with the real company email.
      var recipient = "[YOUR EMAIL]";
      window.location.href =
        "mailto:" + encodeURIComponent(recipient) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      var note = form.querySelector(".form-note");
      if (note) {
        note.textContent = "Opening your email client to send the inquiry…";
      }
    });
  }

  /* 5. Footer year ------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
