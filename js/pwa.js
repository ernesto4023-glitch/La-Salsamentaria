/* ==========================================
   LA SALSAMENTARIA
   INSTALACIÓN PWA
========================================== */

let deferredPrompt = null;

const installButton = document.getElementById("install-app");

const installInfo = document.getElementById("install-info");


/* ==========================================
   COMPROBAR INSTALACIÓN
========================================== */

function isInstalled() {

    return window.matchMedia(
        "(display-mode: standalone)"
    ).matches || window.navigator.standalone === true;

}


/* ==========================================
   REGISTRAR SERVICE WORKER
========================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registration =
                await navigator.serviceWorker.register(
                    "./sw.js",
                    {
                        scope: "./"
                    }
                );

            console.log(
                "PWA registrada correctamente:",
                registration.scope
            );

        } catch (error) {

            console.error(
                "Error al registrar la PWA:",
                error
            );

        }

    });

}


/* ==========================================
   CAPTURAR INSTALACIÓN
========================================== */

window.addEventListener("beforeinstallprompt", event => {

    event.preventDefault();

    deferredPrompt = event;

    if (installButton && !isInstalled()) {

        installButton.hidden = false;

    }

});


/* ==========================================
   BOTÓN INSTALAR
========================================== */

if (installButton) {

    if (isInstalled()) {

        installButton.hidden = true;

    }

    installButton.addEventListener("click", async () => {

        if (isInstalled()) return;

        if (deferredPrompt) {

            const promptEvent = deferredPrompt;

            deferredPrompt = null;

            await promptEvent.prompt();

            const choice = await promptEvent.userChoice;

            if (choice.outcome === "accepted") {

                installButton.hidden = true;

            }

        } else {

            const isIOS =
                /iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (installInfo) {

                installInfo.textContent = isIOS

                    ? "Para instalarla, abre Compartir en tu navegador y selecciona Agregar a pantalla de inicio."

                    : "Abre el menú de tu navegador y selecciona Instalar aplicación o Agregar a pantalla de inicio.";

                installInfo.hidden = false;

            }

        }

    });

}


/* ==========================================
   INSTALACIÓN COMPLETADA
========================================== */

window.addEventListener("appinstalled", () => {

    deferredPrompt = null;

    if (installButton) {

        installButton.hidden = true;

    }

    if (installInfo) {

        installInfo.hidden = true;

    }

    console.log("La Salsamentaria instalada");

});