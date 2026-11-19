"""E2E: modulo contatti → dashboard demo; link tel/WhatsApp; overflow orizzontale; errori console.
Uso: python3 tests/e2e.py http://localhost:4321"""
import sys, asyncio, urllib.parse
from playwright.async_api import async_playwright
BASE = sys.argv[1].rstrip("/")
PAGES = ["/", "/behandelingen/", "/behandelingen/kiespijn/", "/over-ons/", "/voor-patienten/", "/contact/", "/privacy/", "/admin/"]
ok = True
def check(c, msg):
    global ok
    print(("PASS " if c else "FAIL ") + msg); ok = ok and c
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        for w in (390, 768, 1440):
            ctx = await b.new_context(viewport={"width": w, "height": 900})
            pg = await ctx.new_page(); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            for path in PAGES:
                await pg.goto(BASE + path, wait_until="networkidle")
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                check(sw <= w, f"{w}px {path} nessuno scroll orizzontale ({sw})")
            check(not errs, f"{w}px nessun errore console {errs[:3]}")
            await ctx.close()
        ctx = await b.new_context(viewport={"width": 1280, "height": 900}); pg = await ctx.new_page()
        await pg.goto(BASE + "/", wait_until="networkidle")
        tels = await pg.eval_on_selector_all("a[href^='tel:']", "els => [...new Set(els.map(e => e.getAttribute('href')))]")
        check(tels == ["tel:+5997178106"], f"link telefono {tels}")
        was = await pg.eval_on_selector_all("a[href*='wa.me']", "els => [...new Set(els.map(e => e.getAttribute('href')))]")
        msg = "Goedendag, ik wil graag een afspraak aanvragen bij Caribbean Dental Care. Kunt u mij helpen?"
        check(was == ["https://wa.me/5997178106?text=" + urllib.parse.quote(msg, safe="-_.!~*'()")], f"link WhatsApp {was}")
        h1 = await pg.eval_on_selector_all("h1", "els => els.length")
        check(h1 == 1, f"un solo H1 in home ({h1})")
        # modulo: errori di validazione
        await pg.goto(BASE + "/contact/", wait_until="networkidle")
        await pg.click("button[type=submit]")
        check(await pg.locator("#name-error").count() == 1, "validazione: errore nome")
        await pg.wait_for_timeout(2600)
        await pg.fill("#name", "Test Persoon"); await pg.fill("#phone", "+599 700 1234")
        await pg.select_option("#subject", "Controle of gebitsreiniging"); await pg.check("input[name=consent]")
        await pg.click("button[type=submit]")
        await pg.wait_for_selector("text=Bedankt, uw aanvraag is verzonden.")
        txt = await pg.inner_text("[role=status]")
        check("pas bevestigd" in txt and "Demoversie" in txt, "conferma: non promette appuntamento + dichiara demo")
        # dashboard
        await pg.goto(BASE + "/admin/", wait_until="networkidle")
        await pg.click("text=Demo openen")
        await pg.click("nav[aria-label=Beheer] >> text=Aanvragen")
        check(await pg.locator("td >> text=Test Persoon").count() == 1, "la richiesta compare nella dashboard")
        await pg.click("td >> text=Test Persoon")
        await pg.click("label:has-text('In behandeling')")
        await pg.keyboard.press("Escape")
        check(await pg.locator("tr:has-text('Test Persoon') >> text=In behandeling").count() == 1, "cambio stato salvato")
        await b.close()
    print("ALL OK" if ok else "SOME FAILED"); sys.exit(0 if ok else 1)
asyncio.run(main())
