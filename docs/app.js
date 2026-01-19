document.addEventListener("DOMContentLoaded", () => {

 const firebaseConfig = {
  apiKey: "AIzaSyDDSDsEFkaq5HnW5Be-h13fUxGkU5RciKs",
  authDomain: "our-love-app-20c4f.firebaseapp.com",
  databaseURL: "https://our-love-app-20c4f-default-rtdb.firebaseio.com",
  projectId: "our-love-app-20c4f",
  storageBucket: "our-love-app-20c4f.appspot.com",
  messagingSenderId: "349289764967",
  appId: "1:349289764967:web:d282b207c9fa2798b75cc2"
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.database();

  const authDiv = document.getElementById("auth");
  const appDiv  = document.getElementById("app");

  // AUTH
  window.signup = () => {
    const email = emailInput();
    const password = passwordInput();
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => setUI(true))
      .catch(e => status(e.message));
  };

  window.login = () => {
    const email = emailInput();
    const password = passwordInput();
    auth.signInWithEmailAndPassword(email, password)
      .then(() => setUI(true))
      .catch(e => status(e.message));
  };

  window.logout = () => {
    auth.signOut();
    setUI(false);
  };

  function setUI(loggedIn) {
    authDiv.style.display = loggedIn ? "none" : "block";
    appDiv.style.display = loggedIn ? "block" : "none";
  }

  function emailInput() {
    return document.getElementById("email").value;
  }

  function passwordInput() {
    return document.getElementById("password").value;
  }

  function status(msg) {
    document.getElementById("auth-status").innerText = msg;
  }

  // 🌈 MOOD
  window.saveMood = () => {
    const mood = document.getElementById("mood").value;
    document.getElementById("mood-message").innerText = "Saved 💖";
  };

  // 🐾 PET
  let pet = { style: 0, mood: 50 };

  const petImage = document.getElementById("pet-image");
  const petClothes = document.getElementById("pet-clothes");

  function updatePet() {
    petImage.src = `./images/pet/pet${pet.style}.png`;
    petClothes.src = `./images/clothes/cloth${pet.style}.png`;
  }

  window.feedPet = () => sparkle("🍎");
  window.bathePet = () => sparkle("🛁");
  window.brushTeeth = () => sparkle("🪥");
  window.playPet = () => sparkle("🎾");
  window.bathroomPet = () => sparkle("🚽");

  window.dressPet = () => {
    pet.style = (pet.style + 1) % 4;
    updatePet();
  };

  function sparkle(icon) {
    const s = document.createElement("div");
    s.innerText = icon;
    s.className = "effect";
    s.style.left = "50%";
    s.style.top = "50%";
    document.getElementById("effect-layer").appendChild(s);
    setTimeout(() => s.remove(), 1500);
  }

});

