/*  ao fazer requisição, adiciona cabeçalho
self.addEventListener('fetch', function (event) {
  console.log('teste pwa')
  let req = new Request(event.request, {
      headers: { "foo": "bar" }
  });
  event.respondWith(fetch(req));
});*/

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('cache-v1').then(function (cache) {
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

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
