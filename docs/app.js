alert("APP.JS LOADED");

// FIREBASE CONFIG
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

// DOM
const email = document.getElementById("email");
const password = document.getElementById("password");
const authBox = document.getElementById("auth");
const app = document.getElementById("app");
const moodInput = document.getElementById("mood");
const moodMessage = document.getElementById("mood-message");
const petImage = document.getElementById("pet-image");
const petClothes = document.getElementById("pet-clothes");
const petStatus = document.getElementById("pet-status");
const effectLayer = document.getElementById("effect-layer");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const localVideo = document.getElementById("localVideo");

let userId = null;
let pet = { style: 0, happy: 50 };

// TABS
function openTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// AUTH
function signup() {
  auth.createUserWithEmailAndPassword(email.value, password.value);
}
function login() {
  auth.signInWithEmailAndPassword(email.value, password.value);
}
function logout() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (!user) return;
  userId = user.uid;
  authBox.style.display = "none";
  app.style.display = "block";
  loadPet();
  loadMood();
  loadChat();
});

// MOOD
function saveMood() {
  db.ref(`users/${userId}/mood`).set(moodInput.value);
}
function loadMood() {
  db.ref(`users/${userId}/mood`).on("value", s => {
    moodMessage.innerText = "Mood: " + (s.val() || "");
  });
}

// PET
function loadPet() {
  const ref = db.ref(`users/${userId}/pet`);
  ref.once("value", s => {
    if (!s.exists()) ref.set(pet);
  });
  ref.on("value", s => {
    pet = s.val();
    petImage.src = `./images/pet/pet${pet.style}.png`;
    petClothes.src = `./images/clothes/cloth${pet.style}.png`;
    petStatus.innerText = "❤️ " + pet.happy;
  });
}
function updatePet(d) {
  db.ref(`users/${userId}/pet`).update(d);
}
function feedPet() {
  updatePet({ happy: pet.happy + 5 });
  effect("🍎");
}
function playPet() {
  updatePet({ happy: pet.happy + 10 });
  effect("🎾");
}
function dressPet() {
  updatePet({ style: (pet.style + 1) % 4 });
}
function effect(e) {
  const d = document.createElement("div");
  d.className = "effect";
  d.innerText = e;
  effectLayer.appendChild(d);
  setTimeout(() => d.remove(), 1500);
}

// CHAT
function sendMessage() {
  db.ref("chat").push(messageInput.value);
  messageInput.value = "";
}
function loadChat() {
  db.ref("chat").on("value", s => {
    chatBox.innerHTML = "";
    Object.values(s.val() || {}).forEach(m => {
      chatBox.innerHTML += `<p>${m}</p>`;
    });
  });
}

// VIDEO
let stream;
async function startCall() {
  stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = stream;
}
async function shareScreen() {
  const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
  s.getTracks().forEach(t => stream.addTrack(t));
}

