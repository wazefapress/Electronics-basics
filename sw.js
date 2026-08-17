// اسم النسخة المخبأة (Cache Name)
const CACHE_NAME = 'electronics-app-v1';

// قائمة بجميع الملفات والصفحات التي نريد تخزينها
const urlsToCache = [
  './',
  './index.html',
  './atom.html',
  './battery.html',
  './power.html',
  './ohm-law.html',
  './resistor.html',
  './capacitor.html',
  './diod.html',
  './zener.html',
  './diod-half.html',
  './diod-full.html',
  './transistor-amp.html',
  './transistor-key.html',
  './requlator.html',
  './requlator-s.html',
  './timer.html',
  './op-amp741.html',
  './logic-gates.html',
  './manifest.json',
  
  // يفضل أيضاً تخزين ملفات CSS و الخطوط الخارجية لكي يعمل التطبيق بشكل كامل بدون إنترنت
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// حدث التثبيت (Install Event) - حفظ الملفات في الكاش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // تفعيل النسخة الجديدة فوراً
});

// حدث الجلب (Fetch Event) - جلب الملفات من الكاش إذا انقطع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في الكاش، قم بإرجاعه
        if (response) {
          return response;
        }
        
        // إذا لم يكن في الكاش، حاول جلبه من الإنترنت
        return fetch(event.request).then(
          function(response) {
            // التحقق من صحة الاستجابة
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // إذا نجح الجلب، نقوم بحفظ نسخة جديدة في الكاش للمستقبل
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// حدث التفعيل (Activate Event) - تنظيف الكاش القديم عند التحديث
self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // حذف النسخ القديمة
          }
        })
      );
    })
  );
  self.clients.claim(); // التحكم في الصفحات المفتوحة فوراً
});