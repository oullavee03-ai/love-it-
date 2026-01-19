// ====== FIREBASE CONFIG ======
const firebaseConfig = {
  apiKey: "AIzaSyDDSDsEFkaq5HnW5Be-h13fUxGkU5RciKs",
  authDomain: "our-love-app-20c4f.firebaseapp.com",
  databaseURL: "https://our-love-app-20c4f-default-rtdb.firebaseio.com",
  projectId: "our-love-app-20c4f",
  storageBucket: "our-love-app-20c4f.appspot.com",
  messagingSenderId: "349289764967",
  appId: "1:349289764967:web:d282b207c9fa2798b75cc2"
};

// Initialize Firebase (ONLY ONCE)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
let userId = null;

// ====== AUTH ======
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("auth-status").innerText = "🎉 Account created! Now login.";
    })
    .catch((error) => {
      document.getElementById("auth-status").innerText = "❌ " + error.message;
    });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      userId = userCredential.user.uid;
      showApp(userCredential.user);
      loadPet();
      loadMood();
      loadCalendar();
      loadChat();
    })
    .catch((error) => {
      document.getElementById("auth-status").innerText = "❌ " + error.message;
    });
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    userId = user.uid;
    showApp(user);
    loadPet();
    loadMood();
    loadCalendar();
    loadChat();
  }
});

function showApp(user) {
  document.getElementById("auth").style.display = "none";
  document.getElementById("app").style.display = "block";
}

// ====== MOOD ======
function saveMood() {
  const mood = document.getElementById("mood").value;
  database.ref("users/" + userId + "/mood").set({
    mood,
    timestamp: Date.now()
  });
  document.getElementById("mood-message").innerText = "Mood saved! 💛";
}

function loadMood() {
  database.ref("users/" + userId + "/mood").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      document.getElementById("mood-message").innerText = "Last mood: " + data.mood;
    }
  });
}

// ====== PET ======
function createPetIfNotExist() {
  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    if (!snapshot.exists()) {
      database.ref("users/" + userId + "/pet").set({
        name: "LovePet",
        hunger: 70,
        cleanliness: 70,
        style: 0,
        age: 0
      });
    }
  });
}

function loadPet() {
  createPetIfNotExist();

  database.ref("users/" + userId + "/pet").on("value", (snapshot) => {
    const pet = snapshot.val();
    if (!pet) return;

    document.getElementById("pet-status").innerText = `
Pet: ${pet.name}
Hunger: ${pet.hunger}
Cleanliness: ${pet.cleanliness}
Style: ${pet.style}
Age: ${pet.age.toFixed(1)}
    `;

    const petImage = document.getElementById("pet-image");
    petImage.src = `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
        <circle cx='100' cy='100' r='90' fill='%23ffb6c1'/>
        <circle cx='70' cy='80' r='10' fill='black'/>
        <circle cx='130' cy='80' r='10' fill='black'/>
        <path d='M70 130 Q100 150 130 130' stroke='black' stroke-width='5' fill='none'/>
      </svg>`;
  });
}

function showEffect(emoji) {
  const effectLayer = document.getElementById("effect-layer");
  const span = document.createElement("span");
  span.className = "effect";
  span.innerText = emoji;
  span.style.left = Math.random() * 200 + "px";
  span.style.top = "60px";

  effectLayer.appendChild(span);

  setTimeout(() => {
    span.remove();
  }, 1200);
}

function feedPet() {
  showEffect("🍎");
  showEffect("🍔");

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      hunger: Math.min(100, pet.hunger + 20),
      age: pet.age + 0.1
    });
  });
}

function bathePet() {
  showEffect("🫧");
  showEffect("🫧");

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      cleanliness: Math.min(100, pet.cleanliness + 20),
      age: pet.age + 0.1
    });
  });
}

function dressPet() {
  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      style: pet.style + 1,
      age: pet.age + 0.1
    });
  });
}

// ====== CALENDAR ======
function addEvent() {
  const name = document.getElementById("event-name").value;
  const date = document.getElementById("event-date").value;

  const eventId = database.ref("users/" + userId + "/events").push().key;
  database.ref("users/" + userId + "/events/" + eventId).set({
    name,
    date
  });
}

function loadCalendar() {
  database.ref("users/" + userId + "/events").on("value", (snapshot) => {
    const events = snapshot.val();
    let html = "";
    for (let id in events) {
      html += `<p>${events[id].date} - ${events[id].name}</p>`;
    }
    document.getElementById("calendar").innerHTML = html;
  });
}

// ====== CHAT ======
function sendMessage() {
  const msg = document.getElementById("message").value;
  const chatId = database.ref("global/chat").push().key;
  database.ref("global/chat/" + chatId).set({
    userId,
    message: msg,
    timestamp: Date.now()
  });
}

function loadChat() {
  database.ref("global/chat").on("value", (snapshot) => {
    const chat = snapshot.val();
    let html = "";
    for (let id in chat) {
      html += `<p>${chat[id].userId}: ${chat[id].message}</p>`;
    }
    document.getElementById("chat").innerHTML = html;
  });
}

// ====== PET STAT DECAY ======
setInterval(() => {
  if (!userId) return;

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    if (!pet) return;

    database.ref("users/" + userId + "/pet").update({
      hunger: Math.max(0, pet.hunger - 1),
      cleanliness: Math.max(0, pet.cleanliness - 1)
    });
  });
}, 60000);

