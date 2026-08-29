#!/usr/bin/env python3
"""
Regenerate the donation QR code (assets/qr.svg) from the UPI details.

    pip install qrcode                 # pure python, no other dependency
    python3 tools/make_qr.py           # reads the UPI ID from assets/js/config.js
    python3 tools/make_qr.py --pa mandal@okhdfcbank --pn "Shree Ganesh Utsav Mandal"
    python3 tools/make_qr.py --am 101  # fixed amount instead of "any amount"
    python3 tools/make_qr.py --no-logo # plain QR, no marigold in the middle

If your bank gave you a printed QR, you can skip this entirely: save that
image as assets/qr.png and set  qrImage: "assets/qr.png"  in config.js.
"""
import argparse, os, re, sys
from urllib.parse import quote

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "assets", "js", "config.js")
OUT    = os.path.join(ROOT, "assets", "qr.svg")

GOLD, MAROON, MARIGOLD, DARK = "#F0B429", "#7B1E2B", "#FFB627", "#241019"


def from_config(key, default=""):
    """Pull a single string value out of config.js without needing a JS parser."""
    try:
        with open(CONFIG, encoding="utf-8") as fh:
            src = fh.read()
    except OSError:
        return default
    m = re.search(r'^\s*%s\s*:\s*"([^"]*)"' % re.escape(key), src, re.M)
    return m.group(1) if m else default


def upi_uri(pa, pn, am, note):
    parts = ["pa=" + quote(pa), "pn=" + quote(pn), "cu=INR"]
    if am:
        parts.append("am=" + quote(str(am)))
    if note:
        parts.append("tn=" + quote(note))
    return "upi://pay?" + "&".join(parts)


def marigold(cx, cy, r):
    """A small flower for the centre of the QR — no font needed, so it always renders."""
    import math
    out = ['<circle cx="%.2f" cy="%.2f" r="%.2f" fill="#fff"/>' % (cx, cy, r),
           '<circle cx="%.2f" cy="%.2f" r="%.2f" fill="none" stroke="%s" stroke-width="%.2f"/>'
           % (cx, cy, r * .93, MAROON, r * .12)]
    for i in range(8):
        a = i * math.pi / 4
        out.append('<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s"/>'
                   % (cx + math.cos(a) * r * .42, cy + math.sin(a) * r * .42, r * .26, MARIGOLD))
    out.append('<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s"/>' % (cx, cy, r * .27, GOLD))
    return "".join(out)


def build_svg(data, px=1000, border=4, logo=True):
    try:
        import qrcode
    except ImportError:
        sys.exit("Missing dependency. Run:  pip install qrcode")

    q = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% recovery, so a centre logo is safe
        box_size=1, border=border,
    )
    q.add_data(data)
    q.make(fit=True)
    matrix = q.get_matrix()
    n = len(matrix)
    scale = px / n

    # one path for every dark module — small file, crisp at any size
    d = []
    for y, row in enumerate(matrix):
        x = 0
        while x < n:
            if row[x]:
                run = 1
                while x + run < n and row[x + run]:
                    run += 1
                d.append("M%g %gh%gv1h-%gz" % (x, y, run, run))
                x += run
            else:
                x += 1

    svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" '
        'role="img" aria-label="UPI QR code">' % (n, n, px, px),
        '<rect width="%d" height="%d" fill="#ffffff"/>' % (n, n),
        '<path d="%s" fill="%s" shape-rendering="crispEdges"/>' % ("".join(d), DARK),
    ]
    if logo:
        svg.append(marigold(n / 2, n / 2, n * .085))
    svg.append("</svg>")
    return "\n".join(svg), n, scale


def main():
    ap = argparse.ArgumentParser(description="Generate the UPI donation QR.")
    ap.add_argument("--pa", help="UPI ID / VPA (default: read from config.js)")
    ap.add_argument("--pn", help="Payee name shown in the payer's app")
    ap.add_argument("--am", help="Fixed amount in rupees (omit to let the donor choose)")
    ap.add_argument("--tn", default="", help="Note attached to the payment")
    ap.add_argument("--out", default=OUT, help="Output path")
    ap.add_argument("--no-logo", action="store_true", help="Plain QR without the centre flower")
    a = ap.parse_args()

    pa = a.pa or from_config("upiId")
    pn = a.pn or from_config("upiPayeeName") or from_config("mandalNameEn") or "Ganesh Mandal"
    tn = a.tn or ("Ganeshotsav %s donation" % from_config("festivalYear", ""))

    if not pa:
        sys.exit("No UPI ID. Set upiId in assets/js/config.js or pass --pa.")
    if "@" not in pa:
        sys.exit("'%s' does not look like a UPI ID (expected something like mandal@okicici)." % pa)

    uri = upi_uri(pa, pn, a.am, tn.strip())
    svg, n, _ = build_svg(uri, logo=not a.no_logo)

    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write(svg)

    print("QR written to %s  (%d×%d modules)" % (os.path.relpath(a.out, ROOT), n, n))
    print("encodes: %s" % uri)
    if pa == "yourmandal@upi":
        print("\n!! That is still the placeholder UPI ID.")
        print("   Put your real one in assets/js/config.js, re-run this script,")
        print("   and set qrIsSample: false so the warning badge disappears.")


if __name__ == "__main__":
    main()
