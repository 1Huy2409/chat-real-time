// Alert notification handler
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  // Auto hide after specified time
  setTimeout(function () {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Manual close button
  if (closeAlert) {
    closeAlert.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
    });
  }
}

// Add smooth scroll behavior to all links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add loading animation for forms
const forms = document.querySelectorAll("form");
forms.forEach((form) => {
  // Skip chat form - nó dùng socket, không cần loading
  if (form.classList.contains("inner-form")) {
    return;
  }

  form.addEventListener("submit", function (e) {
    const submitBtn = this.querySelector('button[type="submit"]');
    if (submitBtn && !submitBtn.disabled) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fa fa-spinner fa-spin"></i> Đang xử lý...';

      // Re-enable after 5 seconds as fallback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 5000);
    }
  });
});

// Add hover effect for cards on home page
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
    this.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
    this.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  });
});
