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
};

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
  
    let authBox = document.getElementById; 
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
