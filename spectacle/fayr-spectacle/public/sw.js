if (!self.define) {
    let e,
        a = {};
    const i = (i, s) => (
        (i = new URL(i + ".js", s).href),
        a[i] ||
            new Promise((a) => {
                if ("document" in self) {
                    const e = document.createElement("script");
                    (e.src = i), (e.onload = a), document.head.appendChild(e);
                } else (e = i), importScripts(i), a();
            }).then(() => {
                let e = a[i];
                if (!e) throw new Error(`Module ${i} didn’t register its module`);
                return e;
            })
    );
    self.define = (s, n) => {
        const o = e || ("document" in self ? document.currentScript.src : "") || location.href;
        if (a[o]) return;
        let c = {};
        const r = (e) => i(e, o),
            d = { module: { uri: o }, exports: c, require: r };
        a[o] = Promise.all(s.map((e) => d[e] || r(e))).then((e) => (n(...e), c));
    };
}
define(["./workbox-6316bd60"], function (e) {
    "use strict";
    importScripts(),
        self.skipWaiting(),
        e.clientsClaim(),
        e.precacheAndRoute(
            [
                {
                    url: "/_next/static/chunks/2435105f-f7379f4a82e62950.js",
                    revision: "f7379f4a82e62950",
                },
                {
                    url: "/_next/static/chunks/516-2eba5a18b3843a43.js",
                    revision: "2eba5a18b3843a43",
                },
                {
                    url: "/_next/static/chunks/framework-81da43a8dcd978d9.js",
                    revision: "81da43a8dcd978d9",
                },
                {
                    url: "/_next/static/chunks/main-c5653dd48d44fc25.js",
                    revision: "c5653dd48d44fc25",
                },
                {
                    url: "/_next/static/chunks/pages/_app-61b81a977f1d6c4c.js",
                    revision: "61b81a977f1d6c4c",
                },
                {
                    url: "/_next/static/chunks/pages/_error-0509152792d2b207.js",
                    revision: "0509152792d2b207",
                },
                {
                    url: "/_next/static/chunks/pages/auth/signin-7670a1ced8ea9de0.js",
                    revision: "7670a1ced8ea9de0",
                },
                {
                    url: "/_next/static/chunks/pages/auth/signup-975c3af792b18de5.js",
                    revision: "975c3af792b18de5",
                },
                {
                    url: "/_next/static/chunks/pages/content/spectaclepass-79ce8e666053feec.js",
                    revision: "79ce8e666053feec",
                },
                {
                    url: "/_next/static/chunks/pages/index-1fa6e1226250cc78.js",
                    revision: "1fa6e1226250cc78",
                },
                {
                    url: "/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",
                    revision: "99442aec5788bccac9b2f0ead2afdd6b",
                },
                {
                    url: "/_next/static/chunks/webpack-fd1bc4a65a80e5c8.js",
                    revision: "fd1bc4a65a80e5c8",
                },
                { url: "/_next/static/css/d3e030f856b5cc29.css", revision: "d3e030f856b5cc29" },
                {
                    url: "/_next/static/vFtq7Lnk10r3p8rK0_KwS/_buildManifest.js",
                    revision: "7db83803717d668855a770acd01f21c7",
                },
                {
                    url: "/_next/static/vFtq7Lnk10r3p8rK0_KwS/_middlewareManifest.js",
                    revision: "fb2823d66b3e778e04a3f681d0d2fb19",
                },
                {
                    url: "/_next/static/vFtq7Lnk10r3p8rK0_KwS/_ssgManifest.js",
                    revision: "b6652df95db52feb4daf4eca35380933",
                },
                {
                    url: "/assets/PinClipart.com_mardi-gras-clip-art_2597404.png",
                    revision: "3dd51ba7a026522a76a6fa50d9a58f7e",
                },
                { url: "/assets/calendar-sharp.svg", revision: "123fdc865c1dbe0b40df806469e3a4ed" },
                { url: "/assets/check.svg", revision: "3fc114d40ee2af653d4f582d2bdcc405" },
                {
                    url: "/assets/chevron-back-circle-sharp.svg",
                    revision: "438321cd33a8e2aa8570358998d8c5dc",
                },
                {
                    url: "/assets/chevron-back-sharp.svg",
                    revision: "5e817b1aaaf910f28712486b287a1080",
                },
                {
                    url: "/assets/chevron-forward-circle.svg",
                    revision: "f2510d27e2758f9ebb68ab8877bf6e2b",
                },
                { url: "/assets/close-circle.svg", revision: "422e99f21bbe70afdeb2f479314db18f" },
                { url: "/assets/create-sharp.svg", revision: "c74313aa2c880d73cf6a4c0c45d1f2af" },
                { url: "/assets/eye-sharp.svg", revision: "afc22c2643809184dd82962b0444d475" },
                {
                    url: "/assets/eyeglasses-310516_960_720.webp",
                    revision: "aeb9cdb508a1e69d908043a272c77b12",
                },
                { url: "/assets/klipartz.com.png", revision: "86056e515bfee6bfd794dc50b209744f" },
                { url: "/assets/qr-code-sharp.svg", revision: "b84f94dfed866d33d3a773953f0c5128" },
                { url: "/assets/questionmark.svg", revision: "992a7dc804fdb4371829e5a7f8189a06" },
                {
                    url: "/assets/undraw_selfie_re_h9um.svg",
                    revision: "a05d550dc752a514d298172c9b78ce42",
                },
                { url: "/assets/zeiss_logo.svg", revision: "77d7793bf32269ac2570011a268b1be0" },
                {
                    url: "/assets/zeiss_vision_center_osnabrueck.png",
                    revision: "4ab9e0817e04c0e02df17486d99b1f4c",
                },
                { url: "/fonts/sfproregular.ttf", revision: "d09549c1ab4a5947a007561521e45da3" },
                { url: "/images/favicon.ico", revision: "c30c7d42707a47a3f4591831641e50dc" },
                {
                    url: "/images/pwaIcon/android/android-launchericon-144-144.png",
                    revision: "ffefb3bd6cd58b00acc792d0314f749d",
                },
                {
                    url: "/images/pwaIcon/android/android-launchericon-192-192.png",
                    revision: "a069db4d63a3ec5982d3be9f45741dcf",
                },
                {
                    url: "/images/pwaIcon/android/android-launchericon-48-48.png",
                    revision: "371f100f42b0711a766656aa5a6a70b0",
                },
                {
                    url: "/images/pwaIcon/android/android-launchericon-512-512.png",
                    revision: "b85fa9844f384d9cb4e0b88c77523892",
                },
                {
                    url: "/images/pwaIcon/android/android-launchericon-72-72.png",
                    revision: "375a75b950d17b14a9694cb909ee4b47",
                },
                {
                    url: "/images/pwaIcon/android/android-launchericon-96-96.png",
                    revision: "105db2da73085394188cf0363a0e1670",
                },
                {
                    url: "/images/pwaIcon/ios/100.png",
                    revision: "77c4296f15b9580f362a5da2acd1394c",
                },
                {
                    url: "/images/pwaIcon/ios/1024.png",
                    revision: "534714d98d630595db999066347453fc",
                },
                {
                    url: "/images/pwaIcon/ios/114.png",
                    revision: "7e5e21c76e7dcc811c57b37e3b238204",
                },
                {
                    url: "/images/pwaIcon/ios/120.png",
                    revision: "344bcf74cc3d7160862fc2ecb07c273f",
                },
                {
                    url: "/images/pwaIcon/ios/128.png",
                    revision: "61726bfd809b1d9d9e401c8d587d0106",
                },
                {
                    url: "/images/pwaIcon/ios/144.png",
                    revision: "ffefb3bd6cd58b00acc792d0314f749d",
                },
                {
                    url: "/images/pwaIcon/ios/152.png",
                    revision: "88024621cf25ab5e00e175b42454396a",
                },
                { url: "/images/pwaIcon/ios/16.png", revision: "567aa8594b402fe6f259ddc943ea1787" },
                {
                    url: "/images/pwaIcon/ios/167.png",
                    revision: "b254cdf2ede0dd9157a25ab898288d3e",
                },
                {
                    url: "/images/pwaIcon/ios/180.png",
                    revision: "fe6be06c3bec6cef490057843221fa2c",
                },
                {
                    url: "/images/pwaIcon/ios/192.png",
                    revision: "a069db4d63a3ec5982d3be9f45741dcf",
                },
                { url: "/images/pwaIcon/ios/20.png", revision: "4de1002da8310adfde85688a4b9c091a" },
                {
                    url: "/images/pwaIcon/ios/256.png",
                    revision: "da627cde49e188da32bc993ec4e9413a",
                },
                { url: "/images/pwaIcon/ios/29.png", revision: "ed2f00f49ca6b38a561df288037c28da" },
                { url: "/images/pwaIcon/ios/32.png", revision: "a2f38bb9fdcf95e0f4e9a4fc0a7d2771" },
                { url: "/images/pwaIcon/ios/40.png", revision: "982679987a89afec28e142c50cf1e0c7" },
                { url: "/images/pwaIcon/ios/50.png", revision: "4e288ca5aac53669b84b5be23b3a4c18" },
                {
                    url: "/images/pwaIcon/ios/512.png",
                    revision: "b85fa9844f384d9cb4e0b88c77523892",
                },
                { url: "/images/pwaIcon/ios/57.png", revision: "1b1843f7f94cc86853077ff1c614e56c" },
                { url: "/images/pwaIcon/ios/58.png", revision: "0a546cd7832560afdcbd2e80bdf358dd" },
                { url: "/images/pwaIcon/ios/60.png", revision: "0cd905a6c111a9d1528bad7fdc92a27f" },
                { url: "/images/pwaIcon/ios/64.png", revision: "c56e5a9e13264dacbaeb559612dff875" },
                { url: "/images/pwaIcon/ios/72.png", revision: "375a75b950d17b14a9694cb909ee4b47" },
                { url: "/images/pwaIcon/ios/76.png", revision: "cb807279d78903cf6c35970eaf0921aa" },
                { url: "/images/pwaIcon/ios/80.png", revision: "edd07160ea99f326fa66796b17019e54" },
                { url: "/images/pwaIcon/ios/87.png", revision: "ec7afb1f0f05240360f85bb11b8d9be7" },
                {
                    url: "/images/pwaIcon/windows11/LargeTile.scale-100.png",
                    revision: "d94125d7565e715f227dcc49d48e3d89",
                },
                {
                    url: "/images/pwaIcon/windows11/LargeTile.scale-125.png",
                    revision: "3ed9d71ac32b886341c070eec82afd6e",
                },
                {
                    url: "/images/pwaIcon/windows11/LargeTile.scale-150.png",
                    revision: "980ce03604f344200d5d35f5bf0dc9ff",
                },
                {
                    url: "/images/pwaIcon/windows11/LargeTile.scale-200.png",
                    revision: "3eafd7129a19537cd229acd972f04bb6",
                },
                {
                    url: "/images/pwaIcon/windows11/LargeTile.scale-400.png",
                    revision: "e2c067a69a049430a6f50c4742fbc868",
                },
                {
                    url: "/images/pwaIcon/windows11/SmallTile.scale-100.png",
                    revision: "3022aaa0bb33ede3b855782d84296fa5",
                },
                {
                    url: "/images/pwaIcon/windows11/SmallTile.scale-125.png",
                    revision: "238e940f9b203ac2db2b5fc26280fd63",
                },
                {
                    url: "/images/pwaIcon/windows11/SmallTile.scale-150.png",
                    revision: "b78d0ad7d6843455bdc84c03e8ea8265",
                },
                {
                    url: "/images/pwaIcon/windows11/SmallTile.scale-200.png",
                    revision: "dd93e8d542f3ca783504f176b20743ed",
                },
                {
                    url: "/images/pwaIcon/windows11/SmallTile.scale-400.png",
                    revision: "55ca2a4bfaa3e4e9fb22ac05a0c6fc98",
                },
                {
                    url: "/images/pwaIcon/windows11/SplashScreen.scale-100.png",
                    revision: "ae759c3d499af0c5f8de775340e8cda1",
                },
                {
                    url: "/images/pwaIcon/windows11/SplashScreen.scale-125.png",
                    revision: "37f39e9ef43bd81231f8861e748654c5",
                },
                {
                    url: "/images/pwaIcon/windows11/SplashScreen.scale-150.png",
                    revision: "8faffc2929161c18853cf1178da49b3e",
                },
                {
                    url: "/images/pwaIcon/windows11/SplashScreen.scale-200.png",
                    revision: "83aa16f9635c031e18de4d2b7d2a4757",
                },
                {
                    url: "/images/pwaIcon/windows11/SplashScreen.scale-400.png",
                    revision: "4092e7ba1d628142b96ddb8bfef12e75",
                },
                {
                    url: "/images/pwaIcon/windows11/Square150x150Logo.scale-100.png",
                    revision: "75c86360510c1b8a6d3e71a6cf404cc9",
                },
                {
                    url: "/images/pwaIcon/windows11/Square150x150Logo.scale-125.png",
                    revision: "3494ef2cf75c841b456ffc06bc8760bd",
                },
                {
                    url: "/images/pwaIcon/windows11/Square150x150Logo.scale-150.png",
                    revision: "5685376ca585286e6b87796d5d6f9fa7",
                },
                {
                    url: "/images/pwaIcon/windows11/Square150x150Logo.scale-200.png",
                    revision: "4f40553b6ff78ea9b95e453eb68821b3",
                },
                {
                    url: "/images/pwaIcon/windows11/Square150x150Logo.scale-400.png",
                    revision: "f1ae37d9614f93bd2753573e645a5612",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
                    revision: "9faa61a8ce4da134e68cb9f8b17248ac",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
                    revision: "753c585c5e8f459cf7afd73d741c5882",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
                    revision: "44b93ee7fbe4c81878f14140ddb57ed1",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
                    revision: "8e6d3ecc2e7e8d82607508eb607aa95f",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
                    revision: "01244cb6843782423eb139175dc93f23",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
                    revision: "27c4167661de9b48af1a3df391dff375",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
                    revision: "5673e75994a68ad25e8665bc638faab4",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
                    revision: "8e00c4f7d5265eaa5861be0de8e2129e",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
                    revision: "9f9699ce8af02106b7b75416bea54280",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
                    revision: "70f47764cd22f0e6acf9794ac3056bcf",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
                    revision: "4b55f163cafc5227ca698f4c02f5d589",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
                    revision: "178b5fc6dfe7f32fa5a2f5ac4d8cdb3b",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
                    revision: "b4373f052ae746ffa7b34caa37bb401e",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
                    revision: "0780c83287821d992be6a2b541e936f9",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
                    revision: "ac9ec6cbc0138bdeebf43e654624aa93",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
                    revision: "9faa61a8ce4da134e68cb9f8b17248ac",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
                    revision: "753c585c5e8f459cf7afd73d741c5882",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
                    revision: "44b93ee7fbe4c81878f14140ddb57ed1",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
                    revision: "8e6d3ecc2e7e8d82607508eb607aa95f",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
                    revision: "01244cb6843782423eb139175dc93f23",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
                    revision: "27c4167661de9b48af1a3df391dff375",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
                    revision: "5673e75994a68ad25e8665bc638faab4",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
                    revision: "8e00c4f7d5265eaa5861be0de8e2129e",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
                    revision: "9f9699ce8af02106b7b75416bea54280",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
                    revision: "70f47764cd22f0e6acf9794ac3056bcf",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
                    revision: "4b55f163cafc5227ca698f4c02f5d589",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
                    revision: "178b5fc6dfe7f32fa5a2f5ac4d8cdb3b",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
                    revision: "b4373f052ae746ffa7b34caa37bb401e",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
                    revision: "0780c83287821d992be6a2b541e936f9",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
                    revision: "ac9ec6cbc0138bdeebf43e654624aa93",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.scale-100.png",
                    revision: "9f9699ce8af02106b7b75416bea54280",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.scale-125.png",
                    revision: "e189fc9a16c04e0191fb00b1ceb38f3f",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.scale-150.png",
                    revision: "b0b0763fa8414daff948c18719fb9e8d",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.scale-200.png",
                    revision: "94abcc01e4341f11f2c7bf7d34e5e0be",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.scale-400.png",
                    revision: "f50e67de6f7d0a67a15f734451703717",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-16.png",
                    revision: "9faa61a8ce4da134e68cb9f8b17248ac",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-20.png",
                    revision: "753c585c5e8f459cf7afd73d741c5882",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-24.png",
                    revision: "44b93ee7fbe4c81878f14140ddb57ed1",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-256.png",
                    revision: "8e6d3ecc2e7e8d82607508eb607aa95f",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-30.png",
                    revision: "01244cb6843782423eb139175dc93f23",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-32.png",
                    revision: "27c4167661de9b48af1a3df391dff375",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-36.png",
                    revision: "5673e75994a68ad25e8665bc638faab4",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-40.png",
                    revision: "8e00c4f7d5265eaa5861be0de8e2129e",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-44.png",
                    revision: "9f9699ce8af02106b7b75416bea54280",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-48.png",
                    revision: "70f47764cd22f0e6acf9794ac3056bcf",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-60.png",
                    revision: "4b55f163cafc5227ca698f4c02f5d589",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-64.png",
                    revision: "178b5fc6dfe7f32fa5a2f5ac4d8cdb3b",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-72.png",
                    revision: "b4373f052ae746ffa7b34caa37bb401e",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-80.png",
                    revision: "0780c83287821d992be6a2b541e936f9",
                },
                {
                    url: "/images/pwaIcon/windows11/Square44x44Logo.targetsize-96.png",
                    revision: "ac9ec6cbc0138bdeebf43e654624aa93",
                },
                {
                    url: "/images/pwaIcon/windows11/StoreLogo.scale-100.png",
                    revision: "4e288ca5aac53669b84b5be23b3a4c18",
                },
                {
                    url: "/images/pwaIcon/windows11/StoreLogo.scale-125.png",
                    revision: "49d6b8fd485d9ba7adb86512bece7386",
                },
                {
                    url: "/images/pwaIcon/windows11/StoreLogo.scale-150.png",
                    revision: "42a34c24cbf0997d361917bdf68c07a3",
                },
                {
                    url: "/images/pwaIcon/windows11/StoreLogo.scale-200.png",
                    revision: "77c4296f15b9580f362a5da2acd1394c",
                },
                {
                    url: "/images/pwaIcon/windows11/StoreLogo.scale-400.png",
                    revision: "38b7cacb78e2e4d8527ee3af948e0a02",
                },
                {
                    url: "/images/pwaIcon/windows11/Wide310x150Logo.scale-100.png",
                    revision: "9164174407afe643fbdee9a89a68a7cc",
                },
                {
                    url: "/images/pwaIcon/windows11/Wide310x150Logo.scale-125.png",
                    revision: "52a2bbee8c9b79cc835632d41c2efe3b",
                },
                {
                    url: "/images/pwaIcon/windows11/Wide310x150Logo.scale-150.png",
                    revision: "0352022d79316cd443139d4b3763dbeb",
                },
                {
                    url: "/images/pwaIcon/windows11/Wide310x150Logo.scale-200.png",
                    revision: "ae759c3d499af0c5f8de775340e8cda1",
                },
                {
                    url: "/images/pwaIcon/windows11/Wide310x150Logo.scale-400.png",
                    revision: "83aa16f9635c031e18de4d2b7d2a4757",
                },
                { url: "/manifest.json", revision: "30151de30b343fc1f3b45b003f414729" },
                { url: "/vercel.svg", revision: "26bf2d0adaf1028a4d4c6ee77005e819" },
            ],
            { ignoreURLParametersMatching: [] },
        ),
        e.cleanupOutdatedCaches(),
        e.registerRoute(
            "/",
            new e.NetworkFirst({
                cacheName: "start-url",
                plugins: [
                    {
                        cacheWillUpdate: async ({ request: e, response: a, event: i, state: s }) =>
                            a && "opaqueredirect" === a.type
                                ? new Response(a.body, {
                                      status: 200,
                                      statusText: "OK",
                                      headers: a.headers,
                                  })
                                : a,
                    },
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
            new e.CacheFirst({
                cacheName: "google-fonts-webfonts",
                plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
            new e.StaleWhileRevalidate({
                cacheName: "google-fonts-stylesheets",
                plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-font-assets",
                plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-image-assets",
                plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /\/_next\/image\?url=.+$/i,
            new e.StaleWhileRevalidate({
                cacheName: "next-image",
                plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:mp3|wav|ogg)$/i,
            new e.CacheFirst({
                cacheName: "static-audio-assets",
                plugins: [
                    new e.RangeRequestsPlugin(),
                    new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:mp4)$/i,
            new e.CacheFirst({
                cacheName: "static-video-assets",
                plugins: [
                    new e.RangeRequestsPlugin(),
                    new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
                ],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:js)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-js-assets",
                plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:css|less)$/i,
            new e.StaleWhileRevalidate({
                cacheName: "static-style-assets",
                plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /\/_next\/data\/.+\/.+\.json$/i,
            new e.StaleWhileRevalidate({
                cacheName: "next-data",
                plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            /\.(?:json|xml|csv)$/i,
            new e.NetworkFirst({
                cacheName: "static-data-assets",
                plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            ({ url: e }) => {
                if (!(self.origin === e.origin)) return !1;
                const a = e.pathname;
                return !a.startsWith("/api/auth/") && !!a.startsWith("/api/");
            },
            new e.NetworkFirst({
                cacheName: "apis",
                networkTimeoutSeconds: 10,
                plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            ({ url: e }) => {
                if (!(self.origin === e.origin)) return !1;
                return !e.pathname.startsWith("/api/");
            },
            new e.NetworkFirst({
                cacheName: "others",
                networkTimeoutSeconds: 10,
                plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
            }),
            "GET",
        ),
        e.registerRoute(
            ({ url: e }) => !(self.origin === e.origin),
            new e.NetworkFirst({
                cacheName: "cross-origin",
                networkTimeoutSeconds: 10,
                plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
            }),
            "GET",
        );
});
