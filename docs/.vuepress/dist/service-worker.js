/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "6d0cb42633c3b5495cfd724548be6a90"
  },
  {
    "url": "archives/index.html",
    "revision": "f9bff5b0cef9c6c93792b11ccbb9a67c"
  },
  {
    "url": "assets/css/0.styles.1ac74570.css",
    "revision": "0afab0384c2018d0ea35bbe8eeae6b24"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.b52431e5.js",
    "revision": "f13e7565f6ad52517dfe2b72ced393c6"
  },
  {
    "url": "assets/js/11.270e6b2b.js",
    "revision": "cd7898998aaec157058c6dceb8a2adb6"
  },
  {
    "url": "assets/js/12.b1b481c0.js",
    "revision": "7a71fdb37fc5c56119eb061faef243ec"
  },
  {
    "url": "assets/js/13.478c3a4c.js",
    "revision": "236dff88ecbcbef8fa0140002ae789b3"
  },
  {
    "url": "assets/js/14.d198872d.js",
    "revision": "dd4b4c30c6bea4319002e010d13f7299"
  },
  {
    "url": "assets/js/15.26731815.js",
    "revision": "51b31df70ebf2da2a5db404bb1e81e13"
  },
  {
    "url": "assets/js/16.6195d00e.js",
    "revision": "028d6f13580ccd56abf234664c1a098a"
  },
  {
    "url": "assets/js/17.4e5e0b7f.js",
    "revision": "e71ad8a3106884540cad3ea3a378db3c"
  },
  {
    "url": "assets/js/18.88b6cd8b.js",
    "revision": "c562888fc53f41f4ec8286a7029a4803"
  },
  {
    "url": "assets/js/19.dddb20bb.js",
    "revision": "c94eeb07d1c5e54fc188f444ab7a03af"
  },
  {
    "url": "assets/js/2.f36e1316.js",
    "revision": "512cce930fd1f516f057087079d1b977"
  },
  {
    "url": "assets/js/3.738acb67.js",
    "revision": "6f136e2c140bc0099ea33c5f0f7ed8fa"
  },
  {
    "url": "assets/js/4.efbf2f21.js",
    "revision": "915fb44150ae664d50c8468510e19a07"
  },
  {
    "url": "assets/js/5.08c1d800.js",
    "revision": "60ffaa98a1305020aa3d994fbc7fd568"
  },
  {
    "url": "assets/js/6.928faf93.js",
    "revision": "adcbee9ed767c30eb11e2637da16bd87"
  },
  {
    "url": "assets/js/7.99ec363d.js",
    "revision": "1dd6ac3a3a364e6be8d7415650c342e7"
  },
  {
    "url": "assets/js/8.6c1407ab.js",
    "revision": "676016706603710a77b69288befcd52b"
  },
  {
    "url": "assets/js/9.702cc898.js",
    "revision": "095ae8f6f9e0b08be89433e3527a6548"
  },
  {
    "url": "assets/js/app.586101e3.js",
    "revision": "91fdf857427c33d9efedc874ad91d22a"
  },
  {
    "url": "friends/index.html",
    "revision": "978e2a5e41cd486d915beec4c4091fa1"
  },
  {
    "url": "HelloWorld.html",
    "revision": "decb55a231af97cf204739c90f8b1d15"
  },
  {
    "url": "img/b.jpg",
    "revision": "aadfc5250e6b913fd4fe60d991aecc7e"
  },
  {
    "url": "img/logo.png",
    "revision": "65db7504e6731477f0720f960245ec6c"
  },
  {
    "url": "img/me.png",
    "revision": "0a4ec47308b9a961c72f648eb16a3818"
  },
  {
    "url": "index.html",
    "revision": "742ff0bb9a092d791e580bc946384aab"
  },
  {
    "url": "java/AQS_source_code_parse.html",
    "revision": "a8f89f448f91d7bfbc2ada9c371658af"
  },
  {
    "url": "java/index.html",
    "revision": "c567141fff9842860ee681cc57dcedec"
  },
  {
    "url": "java/mybatis_spring_boot_source_code_parse.html",
    "revision": "35646ab40a8d0b37756d4a0b12ff226f"
  },
  {
    "url": "java/spring_boot_creates_and_starts_the_embedded_tomcat_container.html",
    "revision": "6b292f3ef55bbe217c4d45834aefc412"
  },
  {
    "url": "java/spring.html",
    "revision": "680b26bfdf280c160c709dfb4d90a845"
  },
  {
    "url": "java/threadLocal_parse.html",
    "revision": "77af6c57f936f9ad0a107f9b36055bb7"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
