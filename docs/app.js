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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let userId = null;
let petData = null;


// Tabs
function openTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Auth
function signup(){
  auth.createUserWithEmailAndPassword(email.value,password.value);
}
function login(){
  auth.signInWithEmailAndPassword(email.value,password.value);
}
function logout(){ auth.signOut(); }

auth.onAuthStateChanged(u=>{
  if(!u) return;
  uid=u.uid;
  auth.style.display="none";
  app.style.display="block";
  loadPet(); loadMood(); loadChat(); loadGame();
});

// Mood
function saveMood(){
  db.ref(`users/${uid}/mood`).set(moodInput.value);
}
function loadMood(){
  db.ref(`users/${uid}/mood`).on("value",s=>{
    moodDisplay.innerText = "Mood: " + (s.val()||"—");
  });
}

// Pet
function loadPet(){
  const ref=db.ref(`users/${uid}/pet`);
  ref.once("value",s=>{
    if(!s.exists()) ref.set({style:0,happy:50});
  });
  ref.on("value",s=>{
    pet=s.val();
    petImage.src=`assets/pet/pet${pet.style}.png`;
    petClothes.src=`assets/clothes/cloth${pet.style}.png`;
    petStats.innerText=`❤️ ${pet.happy}`;
  });
}
function feedPet(){ updatePet({happy: pet.happy+5}); effect("🍎"); }
function playPet(){ updatePet({happy: pet.happy+10}); effect("🎾"); }
function dressPet(){ updatePet({style:(pet.style+1)%4}); }
function updatePet(d){ db.ref(`users/${uid}/pet`).update(d); }
function effect(e){
  const el=document.createElement("div");
  el.className="effect"; el.innerText=e;
  effects.appendChild(el);
  setTimeout(()=>el.remove(),1500);
}

// Multiplayer Game
function tapPet(){
  db.ref("game/taps").transaction(v=>(v||0)+1);
}
function loadGame(){
  db.ref("game/taps").on("value",s=>{
    tapScore.innerText="Total taps: "+(s.val()||0);
  });
}

// Chat
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

// Video Call (basic local)
let stream;
async function startCall(){
  stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  localVideo.srcObject=stream;
}
async function shareScreen(){
  const s=await navigator.mediaDevices.getDisplayMedia({video:true});
  s.getTracks().forEach(t=>stream.addTrack(t));
}
