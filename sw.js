const CACHE ='VM'
const FILES = [
  '/Iqra3/',
  '/Iqra3/iqra.css',
  '/Iqra3/icon.png',
  '/Iqra3/image/sura.png',
  '/Iqra3/Quran.txt',
  '/Iqra3/Kuran.txt',
  '/Iqra3/iqra.names',
  '/Iqra3/me_quran.ttf',
  '/Iqra3/manifest.json',
  '/Visual-Mujam/',
  '/Visual-Mujam/Mujam.html#r=sjd',
  '/Visual-Mujam/Mujam.html',
  '/Visual-Mujam/Mujam.css',
  '/Visual-Mujam/Mujam.js',
  '/Visual-Mujam/data.txt',
  '/Visual-Mujam/Utilities.js',
  '/Visual-Mujam/buckwalter.js',
  '/Visual-Mujam/manifest.json'
]
function installCB(e) {
  console.log('install', e);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
self.addEventListener('install', installCB)

function cacheCB(e) { //cache first
  let req = e.request, found = false;
  for (let f of FILES)
    if (req.url.endsWith(f)) {
      found = true; break
    }
  if (!found) console.log('not found', req.url);
  let p = found? caches.match(req) : fetch(req)
  e.respondWith(
    p.then(r1 => r1, console.log)
  )
}
self.addEventListener('fetch', cacheCB)

