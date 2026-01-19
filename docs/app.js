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
        age: 0,
        happiness: 70,
        bathroom: 50
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
Bathroom: ${pet.bathroom}
Happiness: ${pet.happiness}
Style: ${pet.style}
Age: ${pet.age.toFixed(1)}
    `;

    // Pet visual reaction
    const petImage = document.getElementById("pet-image");
    petImage.style.transform = `scale(${1 + pet.age / 50})`;

    if (pet.happiness < 30 || pet.hunger < 30) {
      petImage.style.opacity = "0.6";
    } else {
      petImage.style.opacity = "1";
    }
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
      hunger: Math.min(100, pet.hunger + 25),
      happiness: Math.min(100, pet.happiness + 10),
      age: pet.age + 0.1
    });
  });
}

function bathroomPet() {
  showEffect("🚽");

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      bathroom: Math.min(100, pet.bathroom + 40),
      cleanliness: Math.max(0, pet.cleanliness - 5),
      happiness: Math.min(100, pet.happiness + 5),
      age: pet.age + 0.05
    });
  });
}

function bathePet() {
  showEffect("🫧");
  showEffect("🫧");

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      cleanliness: Math.min(100, pet.cleanliness + 30),
      bathroom: Math.max(0, pet.bathroom - 5),
      happiness: Math.min(100, pet.happiness + 10),
      age: pet.age + 0.1
    });
  });
}

function brushTeeth() {
  showEffect("🪥");

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      cleanliness: Math.min(100, pet.cleanliness + 15),
      happiness: Math.min(100, pet.happiness + 5),
      age: pet.age + 0.05
    });
  });
}

function playPet() {
  showEffect("🎾");
  showEffect("🎮");

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      happiness: Math.min(100, pet.happiness + 20),
      hunger: Math.max(0, pet.hunger - 10),
      age: pet.age + 0.1
    });
  });
}

function dressPet() {
  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    database.ref("users/" + userId + "/pet").update({
      style: pet.style + 1,
      happiness: Math.min(100, pet.happiness + 5),
      age: pet.age + 0.05
    });
  });
}

// Pet stat decay
setInterval(() => {
  if (!userId) return;

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();
    if (!pet) return;
    const petClothes = document.getElementById("pet-clothes");
petClothes.src = `./images/clothes/cloth${pet.style}.png`;


    database.ref("users/" + userId + "/pet").update({
      hunger: Math.max(0, pet.hunger - 1),
      cleanliness: Math.max(0, pet.cleanliness - 1),
      bathroom: Math.max(0, pet.bathroom - 1),
      happiness: Math.max(0, pet.happiness - 1)
    });
  });
}, 60000);

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

