/* ============================================================
   EDIT THIS FILE — everything you need to personalise is here.
   No other file needs to change for a normal setup.
   ============================================================ */
window.SITE_CONFIG = {

  /* ---------- 1. Your mandal / group ---------- */
  mandalName:      "श्री गणेश उत्सव मंडळ",          // shown in Devanagari in the hero
  mandalNameEn:    "Shree Ganesh Utsav Mandal",     // English name, used in the nav + footer
  tagline:         "Ganeshotsav 2026",
  cityLine:        "Pune, Maharashtra",             // small line under the hero title

  /* ---------- 2. Festival dates (YYYY-MM-DD, 24h time) ----------
     Verify these against your local panchang before going live.  */
  sthapanaDateTime: "2026-09-14T11:02:00",          // Ganesh Chaturthi — countdown target
  visarjanDate:     "2026-09-25",                   // Anant Chaturdashi
  festivalYear:     "2026",

  /* ---------- 3. Donations ----------
     UPI ID = the VPA money should land in, e.g. "mandal@okhdfcbank".
     After changing it run:  python3 tools/make_qr.py   (regenerates the QR)   */
  upiId:        "yourmandal@upi",                   // <-- REPLACE
  upiPayeeName: "Shree Ganesh Utsav Mandal",        // <-- REPLACE (name shown in the payer's UPI app)
  qrImage:      "assets/qr.svg",                    // or drop in your bank's QR as assets/qr.png
  qrIsSample:   true,                               // set to false once the real QR is in place

  /* Where the money goes — shown prominently on the donate card. */
  causeName:    "Anna Daan & school-kit drive",     // <-- REPLACE
  causeLine:    "100% of what we collect is passed on — nothing is kept by the mandal.",

  /* ---------- 4. Contact ---------- */
  phone:      "+919999999999",                      // <-- REPLACE (with country code, no spaces)
  phoneLabel: "+91 99999 99999",
  whatsapp:   "919999999999",                       // <-- REPLACE (country code, digits only)
  email:      "",                                   // optional — leave "" to hide
  address:    "Mandap ground, MG Road, Pune 411001",
  mapsUrl:    "https://maps.google.com/?q=Pune",    // <-- REPLACE with your pinned location

  instagram:  "",                                   // optional, full URL. "" hides the icon
  youtube:    "",                                   // optional, full URL

  /* ---------- 5. Music ----------

     A) The playlist section (Spotify).
        In Spotify, open your playlist -> ... -> Share -> Copy link to playlist,
        and paste it below. Anything Spotify gives you works: a full link, a
        spotify:playlist:... URI, or just the ID. An album or a single song
        link works too.
        Leave it "" and the whole playlist section disappears from the page.
        The playlist must be PUBLIC or visitors will see an empty player. */
  spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DWWewwIBnx9QZ",                              // <-- PASTE YOUR SPOTIFY LINK

  /*   B) The background track behind the little music button.
        Drop an mp3 at assets/audio/aarti.mp3 (use audio you have the rights to).
        If the file is missing, a gentle temple-bell ambience is synthesised
        in the browser instead, so the button always works. */
  musicSrc:    "assets/audio/aarti.mp3",
  musicVolume: 0.55,

  /* ---------- 6. Behaviour ---------- */
  showWelcomeGate: true,   // the "Enter" splash that lets a visitor opt into sound
  showPetals:      true    // falling marigold petals
};
