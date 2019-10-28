const CACHE ='Mujam2'
const FILES = [
  '/Visual-Mujam/',
  '/Visual-Mujam/Mujam.html',
  '/Visual-Mujam/Mujam.css',
  '/Visual-Mujam/Mujam.js',
  '/Visual-Mujam/data.txt',
  '/Visual-Mujam/Utilities.js',
  '/Visual-Mujam/buckwalter.js',
  '/Visual-Mujam/images/small.png',
  '/Visual-Mujam/images/large.png',
  '/Visual-Mujam/manifest.json'
]
function installCB(e) {
  console.log(CACHE, e);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
self.addEventListener('install', installCB)

function cacheCB(e) { //cache first
  e.respondWith(
    caches.match(e.request)
    .then(r => {
       if (r) return r
       console.log('not in', CACHE, e.request.url)
       return fetch(e.request)
    })
    .catch(console.log)
  )
}
self.addEventListener('fetch', cacheCB)

function activateCB(e) {
  console.log(CACHE, e);
  e.waitUntil(
    caches.delete('VM')
    .then(r => { if (r) console.log('deleted VM') })
  )
}
addEventListener('activate', activateCB);

