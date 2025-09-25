document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert("Logged in! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password.");
    }
  });
});
