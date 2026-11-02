KELLEM SECONDARY SCHOOL — MOBILE APP VERSION

This package turns the existing website into an installable Progressive Web App (PWA). It retains the school's pages, photos, student portal and CHUCHA AI features, and adds app icons, an install prompt and offline caching.

INSTALL ON ANDROID
1. Upload the contents of the site folder to a web host with HTTPS enabled.
2. Open the website in Chrome on the Android phone.
3. Tap “Install Kellem App” when it appears, or use Chrome menu > Install app / Add to Home screen.
4. Open Kellem School from the phone's app list or home screen.

INSTALL ON IPHONE / IPAD
1. Open the HTTPS website in Safari.
2. Tap Share > Add to Home Screen.

LOCAL TESTING
PWAs require HTTPS or localhost. From inside the site folder, run: python -m http.server 8000
Then open http://localhost:8000 in a browser on the same computer. For phone testing, deploy to an HTTPS host.

IMPORTANT
- This is an installable web app, not a compiled APK or App Store package. It works on Android and iOS through supported browsers.
- Student accounts and points in the supplied website are still stored in the browser's local storage. They do not sync between devices and are not protected by a production school database. Do not use real or sensitive student credentials until a secure backend is implemented.
- Offline support caches the website files. Some external links and browser speech features may still require internet/device support.
