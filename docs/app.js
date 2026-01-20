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

// UI
function openTab(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";
}

function setUI(on){
  auth.style.display = on?"none":"block";
  app.style.display = on?"block":"none";
}

// AUTH
function signup(){
  auth.createUserWithEmailAndPassword(email.value,password.value)
    .then(()=>alert("Account created!"))
    .catch(e=>alert(e.message));
}

function login(){
  auth.signInWithEmailAndPassword(email.value,password.value)
    .catch(e=>alert(e.message));
}

function logout(){
  auth.signOut();
}

auth.onAuthStateChanged(u=>{
  if(!u){ auth.style.display="block"; return; }
  userId=u.uid;
  auth.style.display="none";
  app.style.display="block";
  loadPet(); loadMood(); loadCalendar(); loadChat();
});

// MOOD
function saveMood(){
  db.ref(`users/${userId}/mood`).set({text:mood.value,time:Date.now()});
  moodMessage.innerText="Mood saved 💖";
}

// PET
function loadPet(){
  const ref=db.ref(`users/${userId}/pet`);
  ref.once("value",s=>{
    if(!s.exists()) ref.set({style:0,hunger:60,happy:60});
  });
  ref.on("value",s=>{
    petData=s.val();
    petStatus.innerText=`🍎 ${petData.hunger} | ❤️ ${petData.happy}`;
    petImage.src=`./images/pet/pet${petData.style}.png`;
    petClothes.src=`./images/clothes/cloth${petData.style}.png`;
  });
}

function updatePet(d){ db.ref(`users/${userId}/pet`).update(d); }
function feedPet(){ updatePet({hunger:100,happy:petData.happy+5}); effect("🍎"); }
function playPet(){ updatePet({happy:100,hunger:petData.hunger-10}); effect("🎾"); }
function dressPet(){ updatePet({style:(petData.style+1)%4}); }

function effect(e){
  const d=document.createElement("div");
  d.className="effect"; d.innerText=e;
  effect-layer.appendChild(d);
  setTimeout(()=>d.remove(),1500);
}

// CALENDAR
function addEvent(){
  db.ref(`users/${userId}/events`).push({
    name:event-name.value,
    date:event-date.value
  });
}
function loadCalendar(){
  db.ref(`users/${userId}/events`).on("value",s=>{
    calendar.innerHTML="";
    Object.values(s.val()||{}).forEach(e=>{
      calendar.innerHTML+=`<p>${e.date} – ${e.name}</p>`;
    });
  });
}

// CHAT
function sendMessage(){
  db.ref("chat").push({m:message.value});
  message.value="";
}
function loadChat(){
  db.ref("chat").on("value",s=>{
    chat.innerHTML="";
    Object.values(s.val()||{}).forEach(c=>{
      chat.innerHTML+=`<p>${c.m}</p>`;
    });
  });
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
