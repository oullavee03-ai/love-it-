// 🚀 YOUR FIREBASE CONFIG (from your project)
const firebaseConfig = {
  apiKey: "PASTE_YOURS_HERE",
  authDomain: "our-love-app-20c4f.firebaseapp.com",
  databaseURL: "https://our-love-app-20c4f-default-rtdb.firebaseio.com",
  projectId: "our-love-app-20c4f",
  storageBucket: "our-love-app-20c4f.appspot.com",
  messagingSenderId: "PASTE_YOURS_HERE",
  appId: "PASTE_YOURS_HERE"
};

// 🧠 Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// ✅ SIGN UP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("auth-message").innerText = "Signed up! You can now log in.";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}

// ✅ LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      showApp(userCredential.user);
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}

// ✅ SHOW APP AFTER LOGIN
function showApp(user) {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("app-container").style.display = "block";
  document.getElementById("user-email").innerText = user.email;
}

// ✅ LOGOUT
function logout() {
  auth.signOut().then(() => {
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("app-container").style.display = "none";
  });
}

// 🔁 KEEP USER LOGGED IN
auth.onAuthStateChanged((user) => {
  if (user) {
    showApp(user);
  }
});
