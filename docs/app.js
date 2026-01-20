// FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDDSDsEFkaq5HnW5Be-h13fUxGkU5RciKs",
  authDomain: "our-love-app-20c4f.firebaseapp.com",
  databaseURL: "https://our-love-app-20c4f-default-rtdb.firebaseio.com",
  projectId: "our-love-app-20c4f"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let uid = null;
let pet = null;

// UI
function openTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* 🌙 Theme */
function toggleTheme() {
  document.body.classList.toggle("light");
}

// Real photographic images from Unsplash (royalty-free)

// Butterflies
const butterflies = [
  {
    src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    caption: "Butterfly on wild flower"
  },
  {
    src: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
    caption: "Blue butterfly resting"
  }
];

// Garden scenes
const gardens = [
  {
    src: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
    caption: "Sunlit garden path"
  },
  {
    src: "https://images.unsplash.com/photo-1468327768560-75b778cbb551",
    caption: "Blooming flower garden"
  }
];

// Plants
const plants = [
  {
    src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    caption: "Green leaves close-up"
  },
  {
    src: "https://images.unsplash.com/photo-1446071103084-c257b5f70672",
    caption: "Indoor house plant"
  }
];
document.addEventListener("DOMContentLoaded", () => {
  renderImages();
});

function renderImages() {
  const container = document.getElementById("imageContainer");
  if (!container) return;

  const images = [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ];

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.style.width = "90%";
    img.style.borderRadius = "16px";
    img.style.margin = "10px 0";
    container.appendChild(img);
  });
}

// Load all sections
renderImages("butterflies", butterflies);
renderImages("garden", gardens);
renderImages("plants", plants);

// AUTH
function signup(){
  auth.createUserWithEmailAndPassword(email.value,password.value)
    .then(()=>authStatus.innerText="Account created 💖")
    .catch(e=>authStatus.innerText=e.message);
}
function login(){
  auth.signInWithEmailAndPassword(email.value,password.value)
    .catch(e=>authStatus.innerText=e.message);
}
function logout(){ auth.signOut(); }

auth.onAuthStateChanged(u=>{
  if(!u) return;
  uid=u.uid;
  authBox.classList.add("hidden");
  app.classList.remove("hidden");
  loadMood(); loadPet(); loadChat();
});

// MOOD
function saveMood(){
  db.ref(`users/${uid}/mood`).set(moodInput.value);
}
function loadMood(){
  db.ref(`users/${uid}/mood`).on("value",s=>{
    moodDisplay.innerText="Mood: "+(s.val()||"—");
  });
}

// PET
function loadPet(){
  const ref=db.ref(`users/${uid}/pet`);
  ref.once("value",s=>{
    if(!s.exists()) ref.set({style:0,happy:50});
  });
  ref.on("value",s=>{
    pet=s.val();
    petImage.src=`images/pet/pet${pet.style}.png`;
    petClothes.src=`images/clothes/cloth${pet.style}.png`;
    petStatus.innerText=`❤️ Happiness: ${pet.happy}`;
     alert("Your pet feels loved 💕"); 
  });
}
function updatePet(d){ db.ref(`users/${uid}/pet`).update(d); }
function feedPet(){ effect("🍎"); updatePet({happy:pet.happy+5}); }
function playPet(){ effect("🎾"); updatePet({happy:pet.happy+10}); }
function dressPet(){ updatePet({style:(pet.style+1)%4}); }

// REAL PET IMAGES
const petImages = [
  "https://images.unsplash.com/photo-1517849845537-4d257902454a",
  "https://images.unsplash.com/photo-1507149833265-60c372daea22",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d"
];

// GARDEN REAL PHOTOS
function loadGarden(){
  const butterflies = [
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
  ];
  const plants = [
    "https://images.unsplash.com/photo-1446071103084-c257b5f70672",
    "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf"
  ];

/* 🦋 Butterflies */
function spawnButterfly() {
  const b = document.createElement("img");
  b.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Butterfly_animated.gif";
  b.className = "floating-butterfly";
  b.style.top = Math.random()*70+"vh";
  document.body.appendChild(b);
  setTimeout(()=>b.remove(),20000);
}
setInterval(spawnButterfly, 7000);
  
  plants.forEach(src=>{
    const img=document.createElement("img");
    img.src=src;
    document.getElementById("plants").appendChild(img);
  });
}
function effect(e){
  const el=document.createElement("div");
  el.className="effect";
  el.innerText=e;
  effectLayer.appendChild(el);
  setTimeout(()=>el.remove(),1500);
}

// CHAT
function sendMessage(){
  db.ref("chat").push(chatInput.value);
  chatInput.value="";
}
function loadChat(){
  db.ref("chat").on("value",s=>{
    chatBox.innerHTML="";
    Object.values(s.val()||{}).forEach(m=>{
      chatBox.innerHTML+=`<p>${m}</p>`;
    });
  });
}

function loadMovie() {
  const url = document.getElementById("movieUrl").value;
  const movie = document.getElementById("sharedMovie");
  movie.src = url;
  movie.play();
}

// VIDEO
let stream;
async function startCall(){
  stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  localVideo.srcObject=stream;
}
async function shareScreen(){
  const s=await navigator.mediaDevices.getDisplayMedia({video:true});
  s.getTracks().forEach(t=>stream.addTrack(t));
}
