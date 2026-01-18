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

function showApp(user) {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("app-container").style.display = "block";
  document.getElementById("user-email").innerText = user.email;
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("app-container").style.display = "none";
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    showApp(user);
  }
});

 
