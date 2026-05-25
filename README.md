# Cat 2D PWA Game

A simple PWA game for cats, designed for iPad. Open `index.html` on an HTTPS server and add it to your iPad Home Screen.
A simple PWA game for cats, designed for iPad. Open `index.html` on an HTTPS server ja lisa see iPadi Home Screenile.

## Running locally

```bash
npx serve .
```

or

```bash
python3 -m http.server 5173
```

The PWA service worker works properly on HTTPS or localhost.

## Using on iPad

1. Upload the folder to a server, e.g. Netlify, Vercel, GitHub Pages, or your own web server.
2. Open the link in Safari.
3. Tap Share → Add to Home Screen.
4. Launch from the icon in fullscreen.

## Kaustastruktuur

- Põhifailid: `index.html`, `manifest.webmanifest`
- Stiilid: `css/styles.css`
- Pildid: `images/icon-192.svg`, `images/icon-512.svg`
- JavaScript: `js/main.js`, `js/sound.js`, `js/sw.js`
- Helid: `snd/burst.mp3`, `snd/catch_feather.mp3`, `snd/catch_laser.mp3`, `snd/catch_mouse.mp3`, `snd/mode.mp3`, `snd/start.mp3`

## Kohandamine

- `mode` valikud: mouse, laser, feather
- `speedLevel` määrab kiiruse
- Põhiloogika on failis `js/main.js`

## Features (extended)

- Touch and click support for all controls and gameplay.
- Animated mouse tail and larger mouse for better cat interaction.
- Easily add your own sounds by replacing the files in the `snd/` folder.
- Works offline after first load (PWA).
- Responsive design for all iPad screen sizes.

---

For more info, see also `README-sound.en.md`.
