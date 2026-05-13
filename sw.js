const CACHE_NAME = 'aps-tools-v26';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './medicamentos.json',

  /* --- Mapeamento de Imagens da Interface e Escalas --- */
  './imagens/icon-192.png',
  './imagens/icon-512.png',
  './imagens/pentagonos.png',
  './imagens/cubo.png',
  './imagens/leao.png',
  './imagens/rino.png',
  './imagens/camelo.png',
  './imagens/ricardo.png',
  './imagens/rogerio.png',
  './imagens/eduardo.png',
  './imagens/tiago.png',
  './imagens/aline.png',

  /* --- Mapeamento de Scripts --- */
  './escalas/calculadora_gestacional.js',
  './escalas/chads.js',
  './escalas/ckd_epi.js',
  './escalas/coelho_savassi.js',
  './escalas/cronometro.js',
  './escalas/efs.js',
  './escalas/edmonton.js',
  './escalas/erg.js',
  './escalas/findrisc.js',
  './escalas/gina.js',
  './escalas/gold.js',
  './escalas/hasbled.js',
  './escalas/imc_avancado.js',
  './escalas/imc_simples.js',
  './escalas/ivcf20.js',
  './escalas/katz.js',
  './escalas/lawton.js',
  './escalas/mdsupdrs.js',
  './escalas/meem.js',
  './escalas/moca.js',
  './escalas/nihss.js',
  './escalas/pneumo_basicas.js',
  './escalas/pps.js',
  './escalas/risco_ad.js',
  './escalas/schwartz.js',
  './escalas/tabagismo.js',
  './escalas/cuidasm.js',
  './escalas/dengue.js',
  './escalas/twist.js',
  './escalas/alvarado.js',
  './escalas/wells.js',
  './escalas/glasgow.js',
  './curvas_crescimento.js'
];

// Instalação: Salva todos os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação: Limpa os caches antigos (v1) quando o v2 assume
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação: Responde com os arquivos do cache se estiver offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache local
        }
        return fetch(event.request); // Tenta buscar no servidor
      })
  );
});