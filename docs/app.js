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
let userId = null;

// AUTH
function signup() {
  auth.createUserWithEmailAndPassword(
    email.value, password.value
  ).then(() => authStatus("Account created 💖"))
   .catch(e => authStatus(e.message));
}

function login() {
  auth.signInWithEmailAndPassword(
    email.value, password.value
  ).then(u => initUser(u.user))
   .catch(e => authStatus(e.message));
}

function logout() {
  auth.signOut();
  authDiv(true);
}

auth.onAuthStateChanged(u => { if(u) initUser(u); });

function authStatus(msg){ document.getElementById("auth-status").innerText=msg; }
function authDiv(show){
  auth.style.display = show?"block":"none";
  app.style.display = show?"none":"block";
}

function initUser(user){
  userId = user.uid;
  authDiv(false);
  initPet();
  loadMood();
  loadCalendar();
  loadChat();
  loadFeed();
}

// MOOD
function saveMood(){
  db.ref(`users/${userId}/mood`).set({ text:mood.value, time:Date.now() });
}
function loadMood(){
  db.ref(`users/${userId}/mood`).on("value",s=>{
    if(s.val()) moodMessage.innerText="Last mood: "+s.val().text;
  });
}

// PET
function initPet(){
  db.ref(`users/${userId}/pet`).once("value",s=>{
    if(!s.exists()){
      db.ref(`users/${userId}/pet`).set({
        hunger:70, clean:70, happy:70, style:0, age:0
      });
    }
  });
  db.ref(`users/${userId}/pet`).on("value",s=>{
    const p=s.val();
    petStatus.innerText=`Hunger:${p.hunger} Clean:${p.clean} Happy:${p.happy}`;
    petClothes.src=`./images/clothes/cloth${p.style}.png`;
  });
}

function petUpdate(obj){
  db.ref(`users/${userId}/pet`).update(obj);
}
function effect(e){
  const s=document.createElement("span");
  s.className="effect"; s.innerText=e;
  effectLayer.appendChild(s);
  setTimeout(()=>s.remove(),1200);
}

function feedPet(){ effect("🍎"); petUpdate({hunger:90, happy:80}); }
function bathePet(){ effect("🫧"); petUpdate({clean:100}); }
function bathroomPet(){ effect("🚽"); }
function brushTeeth(){ effect("🪥"); }
function playPet(){ effect("🎮"); }
function dressPet(){ petUpdate({style:Date.now()%3}); }

// CALENDAR
function addEvent(){
  db.ref(`users/${userId}/events`).push({
    name:eventName.value, date:eventDate.value
  });
}
function loadCalendar(){
  db.ref(`users/${userId}/events`).on("value",s=>{
    calendar.innerHTML="";
    for(let i in s.val()){
      calendar.innerHTML+=`<p>${s.val()[i].date} - ${s.val()[i].name}</p>`;
    }
  });
}

// CHAT
function sendMessage(){
  db.ref("chat").push({user:userId,text:message.value});
}
function loadChat(){
  db.ref("chat").on("value",s=>{
    chat.innerHTML="";
    for(let i in s.val()){
      chat.innerHTML+=`<p>${s.val()[i].text}</p>`;
    }
  });
}

// FEED
function postFeed(){
  db.ref("feed").push({user:userId,text:feedMessage.value});
}
function loadFeed(){
  db.ref("feed").on("value",s=>{
    feed.innerHTML="";
    for(let i in s.val()){
      feed.innerHTML+=`<p>${s.val()[i].text}</p>`;
    }
  });
}

// VIDEO (BASIC LOCAL)
async function startCall(){
  const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  localVideo.srcObject=stream;
}


