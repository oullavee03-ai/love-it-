self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open("love-cache").then(c=>
      c.addAll(["./","index.html","style.css","app.js"])
    )
  );
});
