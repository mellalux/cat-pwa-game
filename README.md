# Kassi 2D PWA mäng

Lihtne iPadile sobiv PWA mäng kassile. Ava `index.html` HTTPS serveris ja lisa iPadis Home Screenile.

## Käivitamine lokaalselt

```bash
npx serve .
```

või

```bash
python3 -m http.server 5173
```

PWA service worker töötab korralikult HTTPS peal või localhostis.

## iPadis kasutamine

1. Laadi kaust serverisse, näiteks Netlify, Vercel, GitHub Pages või oma veebiserver.
2. Ava link Safaris.
3. Vajuta Share → Add to Home Screen.
4. Käivita ikoonilt täisekraanil.

## Muutmine

- `mode` valikud: hiir, laser, sulg.
- `speedLevel` määrab kiiruse.
- Kogu mäng on failis `index.html`.
