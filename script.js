document.addEventListener("DOMContentLoaded", () => {
  const getStartedBtn = document.querySelector("#getStarted");
  const toast = document.querySelector("#toast");

  if (getStartedBtn && toast) {
    getStartedBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent immediate navigation
      toast.classList.remove("hidden");
      toast.classList.add("opacity-100");

      // Hide after 3 seconds, then redirect
      setTimeout(() => {
        toast.classList.add("hidden");
        window.location.href = "signup.html";
      }, 3000);
    });
  }
});