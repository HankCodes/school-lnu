
const cacheName = 'v1'

// Default files to always cache
const cacheFiles = [
  './',
  './index.html',
  './css/style.css',
  './image/spa-background.jpg',
  './js/app.js',
  './js/hanks-desktop-element/hanks-desktop.js',
  './js/hanks-desktop-element/hanksDesktopTemplates.js',
  './js/hanks-taskbar-element/hanks-taskbar.js',
  './js/hanks-memory/image/hanks-memory-bg.png',
  './js/hanks-minesweeper/images/mine_1.svg',
  './js/hanks-minesweeper/images/minesweeper-logo.svg'
]

const cacheDefaultResouces = async function (e) {
  console.log('ServiceWorker installed')
  // Opens cache
  const cache = await this.caches.open(cacheName)
  // Adds all default files to cache
  return cache.addAll(cacheFiles)
}

const removeCacheVersion = async function (e) {
  const cacheNames = await this.caches.keys()
  const oldCacheName = cacheNames.find(name => name !== cacheName)
  this.caches.delete(oldCacheName)
}

const fetchNCache = async function (e) {
  let resp = '' // Server response
  try {
    const match = await this.caches.match(e.request)

    if (match !== undefined) {
      console.log('ServiceWorker: Found resource in cache')
      return match
    }
  } catch (err) {
    console.log('ServiceWorker: An error occured when fetching resouces from cache', err)
  }

  try {
    const requestClone = e.request.clone()
    resp = await this.fetch(requestClone)

    console.log('ServiceWorker: Fetches resource from server')

    if (!resp) {
      return resp
    }
  } catch (err) {
    console.log('ServiceWorker: An error occured when fetching resource from server', err)
  }

  try {
    const respClone = resp.clone()
    const cache = await this.caches.open(cacheName)
    cache.add(e.request.clone(), respClone)

    if (cache.match(e.request.clone(), respClone)) {
      console.log('ServiceWorker sucessfully cached the resouce')
    }

    return resp
  } catch (err) {
    console.log('ServiceWorker: An error occured when caching files', err)
  }
}

this.addEventListener('install', async e => {
  e.waitUntil(cacheDefaultResouces())
})
this.addEventListener('activate', async e => {
  e.waitUntil(removeCacheVersion())
})

this.addEventListener('fetch', async e => {
  e.respondWith(fetchNCache(e))
})
