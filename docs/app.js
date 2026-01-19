const firebaseConfig = {
  apiKey: "AIzaSyDDSDsEFkaq5HnW5Be-h13fUxGkU5RciKs",
  authDomain: "our-love-app-20c4f.firebaseapp.com",
  databaseURL: "https://our-love-app-20c4f-default-rtdb.firebaseio.com",
  projectId: "our-love-app-20c4f",
  storageBucket: "our-love-app-20c4f.appspot.com",
  messagingSenderId: "349289764967",
  appId: "1:349289764967:web:d282b207c9fa2798b75cc2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
let userId;

// -------- AUTH --------
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("auth-message").innerText = "Signed up! You can now log in.";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
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
      document.getElementById("auth-message").innerText = error.message;
    });
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("app-container").style.display = "none";
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
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("app-container").style.display = "block";
  document.getElementById("user-email").innerText = user.email;
}

// -------- MOOD --------
function saveMood() {
  const mood = document.getElementById("mood").value;
  database.ref("users/" + userId + "/mood").set({
    mood,
    timestamp: Date.now()
  });
  document.getElementById("mood-message").innerText = "Mood saved!";
}

function loadMood() {
  database.ref("users/" + userId + "/mood").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      document.getElementById("mood-message").innerText = "Last mood: " + data.mood;
    }
  });
}

// -------- PET --------
function loadPet() {
  createPetIfNotExist();

  database.ref("users/" + userId + "/pet").on("value", (snapshot) => {
    const pet = snapshot.val();

    function feedPet() {
  showEffect("🍎")("🍔")("🍕");

  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();

    database.ref("users/" + userId + "/pet").update({
      hunger: Math.min(100, pet.hunger + 20),
      age: pet.age + 0.1
    });
  });
}

function showEffect(emoji) {
  const effectLayer = document.getElementById("effect-layer");

  const span = document.createElement("span");
  span.className = "effect";
  span.innerText = emoji;
  span.style.left = Math.random() * 150 + "px";
  span.style.top = "100px";

  effectLayer.appendChild(span);

  setTimeout(() => {
    span.remove();
  }, 1500);
}

const petImage = document.getElementById("pet-image");
petImage.classList.add("pet-react");

setTimeout(() => {
  petImage.classList.remove("pet-react");
}, 400);


  setTimeout(() => {
    span.remove();
  }, 1500);
}


function loadPet() {
  createPetIfNotExist();
  database.ref("users/" + userId + "/pet").on("value", (snapshot) => {
    const pet = snapshot.val();
    document.getElementById("pet-status").innerText = `
      Pet: ${pet.name}
      Hunger: ${pet.hunger}
      Cleanliness: ${pet.cleanliness}
      Style: ${pet.style}
      Age: ${pet.age}
    `;
  });
}
function feedPet() {
  database.ref("users/" + userId + "/pet").once("value", (snapshot) => {
    const pet = snapshot.val();

    database.ref("users/" + userId + "/pet").update({
      hunger: Math.min(100, pet.hunger + 20),
      age: pet.age + 0.1
    });
  });
}


    });
  });
}

function bathePet() {
  showEffect("🫧");
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

.pet-react {
  animation: wiggle 0.4s ease-in-out;
}

@keyframes wiggle {
  0% { transform: rotate(0); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  100% { transform: rotate(0); }
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

// -------- CALENDAR --------
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

// -------- CHAT --------
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
}, 60000); // every 1 minute
