// ====== FIREBASE CONFIG ======
const firebaseConfig = {
const firebaseConfig = 
  { apiKey: "AIzaSyDDSDsEFkaq5HnW5Be-h13fUxGkU5RciKs",
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

// ====== UI Helpers ======
function setUI(loggedIn) {
  document.getElementById("auth").style.display = loggedIn ? "none" : "block";
  document.getElementById("app").style.display = loggedIn ? "block" : "none";
}

function status(msg) {
  document.getElementById("auth-status").innerText = msg;
}

// ====== AUTH ======
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => status("Account created! Please login."))
    .catch((e) => status(e.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((u) => {
      userId = u.user.uid;
      setUI(true);
      loadPet();
      loadMood();
      loadCalendar();
      loadChat();
    })
    .catch((e) => status(e.message));
}

function logout() {
  auth.signOut();
  setUI(false);
}

auth.onAuthStateChanged((user) => {
  if (user) {
    userId = user.uid;
    setUI(true);
    loadPet();
    loadMood();
    loadCalendar();
    loadChat();
  } else {
    setUI(false);
  }
});

// ====== MOOD ======
function saveMood() {
  const mood = document.getElementById("mood").value;
  database.ref("users/" + userId + "/mood").set({
    mood,
    timestamp: Date.now()
  });
  document.getElementById("mood-message").innerText = "Mood saved 💛";
}

function loadMood() {
  database.ref("users/" + userId + "/mood").on("value", (snap) => {
    const data = snap.val();
    if (data) {
      document.getElementById("mood-message").innerText = "Last mood: " + data.mood;
    }
  });
}

// ====== PET ======
function createPetIfNotExist() {
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    if (!snap.exists()) {
      database.ref("users/" + userId + "/pet").set({
        style: 0,
        hunger: 50,
        cleanliness: 50,
        bathroom: 50,
        happiness: 50,
        age: 0
      });
    }
  });
}

function loadPet() {
  createPetIfNotExist();

  database.ref("users/" + userId + "/pet").on("value", (snap) => {
    const pet = snap.val();
    if (!pet) return;

    document.getElementById("pet-status").innerText =
      `Hunger: ${pet.hunger} | Cleanliness: ${pet.cleanliness} | Bathroom: ${pet.bathroom} | Happiness: ${pet.happiness} | Age: ${pet.age}`;

    document.getElementById("pet-image").src = `./images/pet/pet${pet.style}.png`;
    document.getElementById("pet-clothes").src = `./images/clothes/cloth${pet.style}.png`;
  });
}

function showEffect(emoji) {
  const layer = document.getElementById("effect-layer");
  const e = document.createElement("div");
  e.className = "effect";
  e.innerText = emoji;
  e.style.left = "50%";
  e.style.top = "50%";
  layer.appendChild(e);
  setTimeout(() => e.remove(), 1500);
}

function feedPet() {
  showEffect("🍎");
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    const pet = snap.val();
    database.ref("users/" + userId + "/pet").update({
      hunger: Math.min(100, pet.hunger + 25),
      happiness: Math.min(100, pet.happiness + 10),
      age: pet.age + 0.1
    });
  });
}

function bathroomPet() {
  showEffect("🚽");
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    const pet = snap.val();
    database.ref("users/" + userId + "/pet").update({
      bathroom: Math.min(100, pet.bathroom + 40),
      cleanliness: Math.max(0, pet.cleanliness - 5),
      happiness: Math.min(100, pet.happiness + 5),
      age: pet.age + 0.05
    });
  });
}

function bathePet() {
  showEffect("🛁");
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    const pet = snap.val();
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
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    const pet = snap.val();
    database.ref("users/" + userId + "/pet").update({
      cleanliness: Math.min(100, pet.cleanliness + 15),
      happiness: Math.min(100, pet.happiness + 5),
      age: pet.age + 0.05
    });
  });
}

function playPet() {
  showEffect("🎾");
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    const pet = snap.val();
    database.ref("users/" + userId + "/pet").update({
      happiness: Math.min(100, pet.happiness + 20),
      hunger: Math.max(0, pet.hunger - 10),
      age: pet.age + 0.1
    });
  });
}

function dressPet() {
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    const pet = snap.val();
    database.ref("users/" + userId + "/pet").update({
      style: (pet.style + 1) % 4,
      happiness: Math.min(100, pet.happiness + 5),
      age: pet.age + 0.05
    });
  });
}

// Pet stat decay
setInterval(() => {
  if (!userId) return;
  database.ref("users/" + userId + "/pet").once("value", (snap) => {
    const pet = snap.val();
    if (!pet) return;
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
  const id = database.ref("users/" + userId + "/events").push().key;

  database.ref("users/" + userId + "/events/" + id).set({ name, date });
}

function loadCalendar() {
  database.ref("users/" + userId + "/events").on("value", (snap) => {
    const events = snap.val() || {};
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
  const id = database.ref("global/chat").push().key;
  database.ref("global/chat/" + id).set({
    userId,
    message: msg,
    timestamp: Date.now()
  });
}

function loadChat() {
  database.ref("global/chat").on("value", (snap) => {
    const chat = snap.val() || {};
    let html = "";
    for (let id in chat) {
      html += `<p>${chat[id].userId}: ${chat[id].message}</p>`;
    }
    document.getElementById("chat").innerHTML = html;
  });
}

// ====== VIDEO CALL (WEBRTC) ======
let localStream;
let pc;

async function startCall() {
  const localVideo = document.getElementById("localVideo");
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  pc = new RTCPeerConnection();
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    document.getElementById("remoteVideo").srcObject = event.streams[0];
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const callId = database.ref("calls").push().key;
  database.ref("calls/" + callId).set({ offer: offer.toJSON() });

  database.ref("calls/" + callId + "/answer").on("value", async (snap) => {
    const answer = snap.val();
    if (answer && !pc.currentRemoteDescription) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  });
}

async function shareScreen() {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  screenStream.getTracks().forEach(track => pc.addTrack(track, screenStream));
}
