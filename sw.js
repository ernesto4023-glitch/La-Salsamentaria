/* ==========================================
   LA SALSAMENTARIA
   SERVICE WORKER PWA
========================================== */

const CACHE_VERSION = "v1";

const CACHE_PREFIX = "salsamentaria-pwa-";

const STATIC_CACHE = CACHE_PREFIX + "static-" + CACHE_VERSION;

const IMAGE_CACHE = CACHE_PREFIX + "images-" + CACHE_VERSION;


/* ==========================================
   ARCHIVOS PRINCIPALES
========================================== */

const APP_SHELL = [

    "./index.html",

    "./manifest.json",

    "./css/style.css",
    "./css/components.css",
    "./css/responsive.css",

    "./js/app.js",
    "./js/config.js",
    "./js/products.js",
    "./js/categories.js",
    "./js/search.js",
    "./js/cart.js",
    "./js/storage.js",
    "./js/whatsapp.js",
    "./js/ui.js",
    "./js/pwa.js",

    "./data/products.json",
    "./data/categories.json",

    "./assets/img/logo.png",
    "./assets/img/hero-salsamentaria.jpg",

    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/icon-maskable-512.png",
    "./assets/icons/apple-touch-icon.png"

];


/* ==========================================
   INSTALACIÓN
========================================== */

self.addEventListener("install", event => {

    event.waitUntil(

        (async () => {

            const cache = await caches.open(STATIC_CACHE);

            const files = APP_SHELL.map(path => {

                return new URL(
                    path,
                    self.registration.scope
                ).href;

            });

            await cache.addAll(files);

            await self.skipWaiting();

        })()

    );

});


/* ==========================================
   ACTIVACIÓN Y LIMPIEZA
========================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        (async () => {

            const keys = await caches.keys();

            await Promise.all(

                keys.map(key => {

                    const isOurCache =
                        key.startsWith(CACHE_PREFIX);

                    const isCurrent =
                        key === STATIC_CACHE ||
                        key === IMAGE_CACHE;

                    if (isOurCache && !isCurrent) {

                        return caches.delete(key);

                    }

                })

            );

            await self.clients.claim();

        })()

    );

});


/* ==========================================
   NETWORK FIRST
   PRIORIDAD A DATOS ACTUALIZADOS
========================================== */

async function networkFirst(request, fallback = null) {

    try {

        const response = await fetch(request);

        if (response.ok) {

            const cache = await caches.open(STATIC_CACHE);

            try {

                await cache.put(
                    request,
                    response.clone()
                );

            } catch (error) {

                console.warn(
                    "No se pudo actualizar la caché:",
                    error
                );

            }

        }

        return response;

    } catch (error) {

        const cached = await caches.match(request);

        if (cached) return cached;

        if (fallback) {

            const fallbackResponse =
                await caches.match(fallback);

            if (fallbackResponse) {
                return fallbackResponse;
            }

        }

        return Response.error();

    }

}


/* ==========================================
   CACHE FIRST
   IMÁGENES DEL CATÁLOGO
========================================== */

async function cacheFirst(request) {

    const cache = await caches.open(IMAGE_CACHE);

    const cached = await cache.match(request);

    if (cached) return cached;

    const response = await fetch(request);

    if (response.ok) {

        try {

            await cache.put(
                request,
                response.clone()
            );

        } catch (error) {

            console.warn(
                "No se pudo guardar la imagen:",
                error
            );

        }

    }

    return response;

}


/* ==========================================
   INTERCEPTAR SOLICITUDES
========================================== */

self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    /* No interceptar otros dominios */

    if (url.origin !== self.location.origin) return;


    /* PÁGINAS */

    if (request.mode === "navigate") {

        const offlinePage = new URL(
            "./index.html",
            self.registration.scope
        ).href;

        event.respondWith(
            networkFirst(request, offlinePage)
        );

        return;

    }


    /* DATOS JSON */

    if (url.pathname.endsWith(".json")) {

        event.respondWith(
            networkFirst(request)
        );

        return;

    }


    /* IMÁGENES */

    if (request.destination === "image") {

        event.respondWith(
            cacheFirst(request)
        );

        return;

    }


    /* CSS, JAVASCRIPT Y OTROS ARCHIVOS */

    event.respondWith(
        networkFirst(request)
    );

});