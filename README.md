# Cat 2D PWA Game

A simple PWA game for cats, designed for iPad. Open `index.html` on an HTTPS server and add it to your iPad Home Screen.

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

## Customization

- `mode` options: mouse, laser, feather.
- `speedLevel` sets the speed.
- The whole game logic is in `index.html`.

## Features (extended)

- Touch and click support for all controls and gameplay.
- Animated mouse tail and larger mouse for better cat interaction.
- Easily add your own sounds by replacing the files in the root folder.
- Works offline after first load (PWA).
- Responsive design for all iPad screen sizes.

---

For more info, see also `README-sound.en.md`.
