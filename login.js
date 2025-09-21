import { initializeApp } from "firebase/app";

const provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider)
  .then((result) => {
    const user = result.user;
    alert(`Welcome, ${user.displayName}!`);
    window.location.href = "board.html";
  })
  .catch((error) => {
    alert(error.message);
  });
const app = initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      alert("Logged in! Redirecting to HibouPad...");
      window.location.href = "board.html";
    } catch (error) {
      alert(error.message);
    }
  });
});