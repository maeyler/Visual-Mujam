const OLD ='Mujam2', CACHE ='Mujam3'
const FILES = [
  '/Visual-Mujam/',
  '/Visual-Mujam/Mujam.html',
  '/Visual-Mujam/Mujam.css',
  '/Visual-Mujam/Mujam.js',
  '/Visual-Mujam/Utilities.js',
  '/Visual-Mujam/buckwalter.js',
  '/Visual-Mujam/iqra3.09.html',
  '/Visual-Mujam/images/small.png',
  '/Visual-Mujam/images/large.png',
  '/Visual-Mujam/manifest.json',
  '/Visual-Mujam/data.txt',
  '/Iqra3/data/Quran.txt',
  '/Iqra3/data/Kuran.txt',
  '/Iqra3/data/iqra.names',
  '/Iqra3/image/sura.png',
  '/Iqra3/image/me_quran.ttf'
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
    caches.delete(OLD)
    .then(r => { if (r) console.log('deleted', OLD) })
  )
}
addEventListener('activate', activateCB);

