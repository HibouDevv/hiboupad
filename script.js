document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    window.location.href = "dashboard.html";
    return;
  }
});
