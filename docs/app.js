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
const auth = firebase.auth();
const db = firebase.database();
let userId = null;
let currentPet = null;

// UI
function setUI(on){
  authBox.style.display = on?"none":"block";
  app.style.display = on?"block":"none";
}
function openTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// AUTH
function signup(){
  auth.createUserWithEmailAndPassword(email.value,password.value)
    .then(()=>status("Account created!"))
    .catch(e=>status(e.message));
}
function login(){
  auth.signInWithEmailAndPassword(email.value,password.value)
    .catch(e=>status(e.message));
}
function logout(){ auth.signOut(); }
auth.onAuthStateChanged(u=>{
  if(!u)return setUI(false);
  userId=u.uid; setUI(true);
  loadPet(); loadMood(); loadCalendar(); loadChat();
});

// MOOD + NOTIFICATION
function saveMood(){
  db.ref(`users/${userId}/mood`).set({ mood:mood.value,time:Date.now()});
  moodMessage.innerText="Mood saved 💖";
  if(Notification.permission==="granted")
    new Notification("💌 Mood Updated",{body:"Your partner feels you ✨"});
}
Notification.requestPermission();

// PET
function loadPet(){
  const ref=db.ref(`users/${userId}/pet`);
  ref.once("value",s=>{ if(!s.exists()) ref.set({style:0,hunger:60,happiness:60}); });
  ref.on("value",s=>{
    currentPet=s.val();
    petStatus.innerText=`❤️ ${currentPet.happiness} | 🍎 ${currentPet.hunger}`;
    petImage.src=`./images/pet/pet${currentPet.style}.png`;
    petClothes.src=`./images/clothes/cloth${currentPet.style}.png`;
    animatePet();
  });
}
function animatePet(){
  petArea.className="";
  if(currentPet.happiness>70) petArea.classList.add("happy");
  if(currentPet.hunger<30) petArea.classList.add("hungry");
}
function updatePet(data){
  db.ref(`users/${userId}/pet`).update(data);
}
function feedPet(){ effect("🍎"); updatePet({hunger:100,happiness:currentPet.happiness+5}); }
function playPet(){ effect("🎾"); updatePet({happiness:100,hunger:currentPet.hunger-10}); }
function dressPet(){ updatePet({style:(currentPet.style+1)%4}); }
function effect(e){
  const d=document.createElement("div");
  d.className="effect"; d.innerText=e;
  effectLayer.appendChild(d);
  setTimeout(()=>d.remove(),1500);
}

// CALENDAR
function addEvent(){
  db.ref(`users/${userId}/events`).push({
    name:eventName.value,
    date:eventDate.value
  });
}
function loadCalendar(){
  db.ref(`users/${userId}/events`).on("value",s=>{
    calendar.innerHTML="";
    Object.values(s.val()||{}).forEach(e=>{
      calendar.innerHTML+=`<div class="event-card">${e.date} – ${e.name}</div>`;
    });
  });
}

// CHAT
function sendMessage(){
  db.ref("chat").push({u:userId,m:message.value});
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

// VIDEO (basic)
let stream, pc;
async function startCall(){
  stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  localVideo.srcObject=stream;
  pc=new RTCPeerConnection();
  stream.getTracks().forEach(t=>pc.addTrack(t,stream));
}
async function shareScreen(){
  const s=await navigator.mediaDevices.getDisplayMedia({video:true});
  s.getTracks().forEach(t=>pc.addTrack(t,s));
}
