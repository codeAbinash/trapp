const cacheData = {
  showCacheThenFetch: {
    name: 'trapp-show-cache-then-fetch-v1',
    valid: 'trapp-show-cache-then-fetch',
  },
  emojiCache: {
    name: 'emoji-cache-v1',
    valid: 'emoji-cache',
  },
  fontCache: {
    name: 'trapp-font-cache-v1',
    valid: 'trapp-font-cache',
  },
  userProfile: {
    name: 'trapp-user-profile-v1',
    valid: 'trapp-user-profile',
  },
  static: {
    name: 'trapp-static-files-v1',
    valid: 'trapp-static-files',
    urls: [
      // While loading don't load the spinner 😆🤣
      // 'https://codeabinash.github.io/trapp/assets/spinner.svg',
    ],
  },
}

function existCacheName(cacheName) {
  for (let key in cacheData)
    if (cacheName.startsWith(cacheData[key].valid) && cacheName !== cacheData[key].name) return true
  return false
}

self.addEventListener('install', (event) => {
  console.log('Caching Shell Assets')
  event.waitUntil(
    caches.open(cacheData.static.name).then((cache) => {
      console.log('Caching Shell Assets Done')
      cache.addAll(cacheData.static.urls)
    }),
  )
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated')
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!existCacheName(key)) return
          console.log('Deleting old cache', key)
          return caches.delete(key)
        }),
      ),
    ),
  )
})

self.addEventListener('fetch', (event) => {
  const url = event.request.url
  // If the request includes the start link then clear the cache
  if (url.startsWith('https://dataabinash.github.io/emoji')) {
    // Never load emojis again
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        if (cacheResponse) return cacheResponse
        const fetchUrl = fetch(event.request).then((fetchResponse) => {
          return caches.open(cacheData.emojiCache.name).then((cache) => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
        return cacheResponse || fetchUrl
      }),
    )
  } else if (url.endsWith('.ttf') || url.endsWith('.woff2') || url.endsWith('.woff')) {
    // Never load fonts again
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        if (cacheResponse) return cacheResponse
        const fetchUrl = fetch(event.request).then((fetchResponse) => {
          return caches.open(cacheData.fontCache.name).then((cache) => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
        return cacheResponse || fetchUrl
      }),
    )
  }
  //   else if (url.includes('https://trapp.vercel.app/')) {
  // if (url.includes('trapp/icons/reset.svg')) {
  //   console.log('Deleting all cache');
  //   caches.keys().then((cacheNames) => {
  //     console.log(cacheNames);
  //     return Promise.all(
  //       cacheNames.map((cacheName) => {
  //         return caches.delete(cacheName);
  //       }),
  //     );
  //   });
  // } else
  //  event.respondWith(
  //    caches.match(event.request).then((cacheResponse) => {
  //      const fetchUrl = fetch(event.request).then((fetchResponse) => {
  //        return caches.open(cacheData.showCacheThenFetch.name).then((cache) => {
  //          cache.put(event.request, fetchResponse.clone())
  //          return fetchResponse
  //        })
  //      })
  //      return cacheResponse || fetchUrl
  //    }),
  //  )
  //   }
  else if (
    (url.includes('https://trapp-sigma.vercel.app') || url.includes('http://localhost')) &&
    (url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.svg') ||
      url.endsWith('.gif') ||
      url.endsWith('.ico') ||
      url.endsWith('.webp'))
  ) {
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        const fetchUrl = fetch(event.request).then((fetchResponse) => {
          return caches.open(cacheData.showCacheThenFetch.name).then((cache) => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
        return cacheResponse || fetchUrl
      }),
    )
  } else if (
    url.startsWith('https://trappmartialarts.com/storage/users/profiles/') &&
    (url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.svg') ||
      url.endsWith('.gif') ||
      url.endsWith('.ico') ||
      url.endsWith('.webp'))
  ) {
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        const fetchUrl = fetch(event.request).then((fetchResponse) => {
          return caches.open(cacheData.userProfile.name).then((cache) => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
        return cacheResponse || fetchUrl
      }),
    )
  } else {
    // Always load from internet
    event.respondWith(fetch(event.request))
  }
})
