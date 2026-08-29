# Ganeshotsav website

A single-page site for a Ganpati mandal — darshan and aarti timings, the
day-by-day programme, a UPI QR for donations, festival music, and a clear
promise that the money collected goes to a social cause.

Plain HTML, CSS and JavaScript. No build step, no framework, no server.
Open `index.html` and it runs.

---

## What's in the box

| | |
|---|---|
| **Responsive** | Built mobile-first; laid out for phones, then tablets (900px) and laptops (1100px+). |
| **Donation QR** | A real, scannable UPI QR generated from your UPI ID, plus a "open my UPI app" button that works on phones and preset amount chips. |
| **Music** | A floating button plays your aarti track. If you haven't added one, the page synthesises a soft temple bell + drone so the button still works. |
| **Countdown** | Counts down to sthapana, switches to visarjan once the festival starts, then thanks visitors afterwards. |
| **Festival feel** | Falling marigold petals, a slow mandala, a lit diya, garland dividers — all switched off automatically for anyone who has "reduce motion" turned on. |
| **Accessible** | Keyboard navigable, skip link, ARIA labels, visible focus rings. |

---

## Setting it up

### 1. Your details — `assets/js/config.js`

This is the only file you need for a normal setup. Open it and change the
values marked `<-- REPLACE`: mandal name, city, festival dates, UPI ID,
phone, WhatsApp number, address, Maps link, and the cause you're donating to.

### 2. The donation QR

Two ways, pick one.

**A. Generate it from your UPI ID** (recommended — the QR then carries the
payee name and a payment note):

```bash
pip install qrcode          # one small pure-python package
python3 tools/make_qr.py    # reads upiId from config.js, writes assets/qr.svg
```

Then set `qrIsSample: false` in `config.js` so the red "sample" badge goes away.

Useful flags:

```bash
python3 tools/make_qr.py --pa mandal@okhdfcbank --pn "Shree Ganesh Utsav Mandal"
python3 tools/make_qr.py --am 101      # fixed amount instead of "any amount"
python3 tools/make_qr.py --no-logo     # plain QR, no marigold in the middle
```

**B. Use the QR your bank or payment app gave you.** Save the image as
`assets/qr.png` and set `qrImage: "assets/qr.png"` and `qrIsSample: false`
in `config.js`.

> **Scan it yourself before you print or publish it.** Open your own UPI app,
> scan the QR on the page, and check that the name shown is the right account.
> Do this every time you regenerate it.

### 3. Music

Save your track as `assets/audio/aarti.mp3`. Use audio you have the rights to
— your own recording, something licensed, or a Creative Commons track. See
`assets/audio/README.txt`.

Nothing autoplays. Visitors choose sound on the welcome screen, and can mute
any time from the button at the bottom-left. That's deliberate: browsers block
autoplay anyway, and a page that starts shouting is a page people close.

### 4. Photos

In `index.html`, find the `<div class="gallery">` block. Each tile looks like:

```html
<figure class="gtile reveal" data-emoji="🪔"><figcaption>Sandhya aarti</figcaption></figure>
```

Drop an image inside it and the emoji placeholder disappears:

```html
<figure class="gtile reveal"><img src="assets/img/aarti.jpg" alt="Evening aarti">
  <figcaption>Sandhya aarti</figcaption></figure>
```

Also replace the hero copy, the timings in the **Darshan** section and the
eleven cards in the **Programme** section with your own — they're all plain
HTML with comments marking what to change.

### 5. Share card

`assets/img/og-cover.jpg` is what appears when someone shares the link on
WhatsApp. To redo it, edit `tools/og-cover.html` and screenshot it at exactly
1200×630, or just replace the jpg with a photo of your mandap.

---

## Looking at it locally

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

Opening `index.html` by double-clicking works too, though a local server is
closer to the real thing.

## Publishing it

**GitHub Pages** — push this repo, then Settings → Pages → deploy from your
branch, root folder. Live in a minute or two, free, and it handles festival
traffic fine.

**Netlify / Vercel / Cloudflare Pages** — drag the folder into their dashboard.
No build command, publish directory is the root.

Any plain web host works too: upload the files as-is over FTP.

---

## Before you go live — checklist

- [ ] Every `<-- REPLACE` in `config.js` is filled in
- [ ] `qrIsSample` is `false` and the red badge is gone
- [ ] You scanned the QR with your own phone and the right account name came up
- [ ] Dates checked against the panchang (2026 defaults: sthapana 14 Sep, visarjan 25 Sep)
- [ ] Phone number, WhatsApp and the Maps pin all open the right thing
- [ ] The named cause is one you can actually hand the money to
- [ ] Checked on a real phone, not just a resized laptop window

## A note on collecting money

You're asking strangers for money and promising to pass it on. Worth doing
properly:

- Use an account that exists only for this, so the total is easy to prove.
- Write the running total on a board at the mandap, as the page promises.
- Keep the transfer receipt and put it on this page afterwards.
- The footer says donations aren't tax-deductible. Only change that if the
  receiving organisation is actually registered to issue 80G receipts.

---

## Structure

```
index.html               the whole page
assets/css/style.css     all styling
assets/js/config.js      everything you edit
assets/js/app.js         countdown, QR/UPI, petals, music, menu
assets/qr.svg            generated donation QR
assets/img/og-cover.jpg  WhatsApp/social share card
assets/audio/            put aarti.mp3 here
tools/make_qr.py         regenerates the QR
tools/og-cover.html      source for the share card
```

॥ गणपती बाप्पा मोरया ॥
