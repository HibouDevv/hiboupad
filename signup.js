document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // Simulate saving user data (you can replace this with Firebase later)
    localStorage.setItem("hibouUser", JSON.stringify({ name, email }));

    // Show a success message
    alert(`Welcome to HibouBoard, ${name}!`);

    // Redirect to the board page
    window.location.href = "board.html";
  });
});