const CACHE_NAME = 'cache-v1';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        '/',
        '/index',
        '/_js/Autor.js',
        '/_js/CrudeProdutos.js',
        '/_js/Detalhes.js',
        '/_js/LisProdutos.js',
        '/_js/ProdutoStore.js',
        '/manifest.json',
        '/worker.js',
        '/views/admins.ejs',
        '/views/cabecalho.ejs',
        '/views/produtos.ejs',
        '/views/criar_admin.ejs',
        '/views/editar.ejs',
        '/views/index.ejs',
        '/views/login.ejs',
        '/views/push.ejs',
        '/views/sobre.ejs'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('cache-') && cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
