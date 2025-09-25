document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      alert("Email already exists. Please log in instead.");
    } else {
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      alert("Account created! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    }
  });
});
