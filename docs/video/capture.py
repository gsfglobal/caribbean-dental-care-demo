"""Registrazione deterministica del sito reale (clock finto di Playwright): ogni frame = 1/24 s.
Uso: python3 capture.py <segmento|all>"""
import asyncio, sys, os, math
from playwright.async_api import async_playwright

B = "http://localhost:4321"
FPS = 24
DT = 1000 / FPS
ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
ease = lambda t: 0.5 - 0.5 * math.cos(math.pi * max(0, min(1, t)))

class Rec:
    def __init__(self, pg, name):
        self.pg, self.dir, self.i = pg, f"frames/{name}", 0
        os.makedirs(self.dir, exist_ok=True)
    async def frame(self):
        await self.pg.clock.run_for(42)
        await self.pg.screenshot(path=f"{self.dir}/{self.i:05d}.jpg", type="jpeg", quality=92)
        self.i += 1

async def prep(ctx, mobile=False):
    pg = await ctx.new_page()
    await pg.clock.install()
    cdp = await ctx.new_cdp_session(pg)
    await cdp.send("Animation.enable")
    await cdp.send("Animation.setPlaybackRate", {"playbackRate": 0.08 if not mobile else 0.12})
    return pg

async def settle(pg, url):
    await pg.goto(B + url)
    await pg.add_style_tag(content="html{scroll-behavior:auto!important}")
    await pg.evaluate("try{sessionStorage.setItem('cdc-demo-banner','0')}catch(e){}")
    await pg.clock.run_for(300)

async def scroll_to(r, y0, y1, n):
    for k in range(n):
        await r.pg.evaluate(f"window.scrollTo(0,{y0 + (y1 - y0) * ease(k / (n - 1))})")
        await r.frame()

async def seg_hero(b):
    ctx = await b.new_context(viewport={"width": 1920, "height": 1080})
    pg = await prep(ctx); await settle(pg, "/"); await pg.reload(); await pg.add_style_tag(content="html{scroll-behavior:auto!important}")
    r = Rec(pg, "s2_hero")
    for k in range(200):
        a = k / 200 * 2 * math.pi
        await pg.mouse.move(1270 + 260 * math.cos(a), 560 + 170 * math.sin(a * 1.3))
        await r.frame()
    await ctx.close()

async def seg_scroll(b):
    ctx = await b.new_context(viewport={"width": 1920, "height": 1080})
    pg = await prep(ctx); await settle(pg, "/"); await pg.clock.run_for(1500)
    r = Rec(pg, "s3_scroll")
    end = await pg.evaluate("document.querySelector('#urgent-title').closest('section').offsetTop - 120")
    await scroll_to(r, 0, end, 330)
    for _ in range(12): await r.frame()
    await ctx.close()

async def seg_treat(b):
    ctx = await b.new_context(viewport={"width": 1920, "height": 1080})
    pg = await prep(ctx); await settle(pg, "/")
    y = await pg.evaluate("document.querySelector('#treat-title').closest('section').offsetTop + 60")
    await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'))"); await pg.clock.run_for(800)
    r = Rec(pg, "s4_treat")
    cards = await pg.eval_on_selector_all("#treat-title ~ * a, section:has(#treat-title) ul a", "els=>els.slice(0,6).map(e=>{const b=e.getBoundingClientRect();return [b.x+b.width*0.6,b.y+b.height*0.5]})")
    for k in range(108):
        c = cards[min(5, k // 18)]
        await pg.mouse.move(c[0] + 40 * math.sin(k / 5), c[1] + 25 * math.cos(k / 6))
        await r.frame()
    await pg.mouse.click(cards[4][0], cards[4][1]); await pg.wait_for_url("**/kronen/")
    await pg.add_style_tag(content="html{scroll-behavior:auto!important}")
    for _ in range(36): await r.frame()
    await scroll_to(r, 0, 520, 60)
    for _ in range(12): await r.frame()
    await ctx.close()

async def seg_mobile(b):
    ctx = await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg = await prep(ctx, True); await settle(pg, "/"); await pg.reload(); await pg.add_style_tag(content="html{scroll-behavior:auto!important}")
    r = Rec(pg, "s5_mobile")
    for _ in range(30): await r.frame()
    end = await pg.evaluate("document.querySelector('#aesth-title').closest('section').offsetTop - 80")
    await scroll_to(r, 0, end, 200)
    for _ in range(14): await r.frame()
    await ctx.close()

async def seg_form_admin(b):
    ctx = await b.new_context(viewport={"width": 1920, "height": 1080})
    pg = await prep(ctx); await settle(pg, "/contact/")
    y = await pg.evaluate("document.querySelector('#form-title').closest('section').offsetTop - 30")
    await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'))"); await pg.clock.run_for(3000)
    r = Rec(pg, "s6_form")
    for _ in range(12): await r.frame()
    name, phone = "Sandra Fictief", "+599 700 2468"
    for k in range(1, len(name) + 1):
        await pg.fill("#name", name[:k]); await r.frame()
    for _ in range(4): await r.frame()
    for k in range(1, len(phone) + 1):
        await pg.fill("#phone", phone[:k]); await r.frame()
    await pg.select_option("#moment", "Ochtend"); [await r.frame() for _ in range(10)]
    await pg.select_option("#subject", "Controle of gebitsreiniging"); [await r.frame() for _ in range(12)]
    await pg.check("input[name=consent]"); [await r.frame() for _ in range(12)]
    btn = await pg.locator("button[type=submit]").bounding_box()
    await pg.mouse.move(btn["x"] + 60, btn["y"] + 25); [await r.frame() for _ in range(10)]
    await pg.mouse.click(btn["x"] + 60, btn["y"] + 25)
    for _ in range(72): await r.frame()
    # dashboard
    r2 = Rec(pg, "s7_admin")
    await pg.goto(B + "/admin/"); await pg.clock.run_for(200)
    for _ in range(18): await r2.frame()
    await pg.click("text=Demo openen")
    for _ in range(60): await r2.frame()
    await pg.click("nav[aria-label=Beheer] >> text=Aanvragen")
    for _ in range(48): await r2.frame()
    await pg.click("td >> text=Sandra Fictief")
    for _ in range(36): await r2.frame()
    await pg.click("label:has-text('Contact opgenomen')")
    for _ in range(18): await r2.frame()
    await pg.fill("textarea", "Teruggebeld — afspraak voor controle gepland.")
    for _ in range(18): await r2.frame()
    await pg.click("text=Notitie opslaan")
    for _ in range(24): await r2.frame()
    await pg.keyboard.press("Escape")
    for _ in range(36): await r2.frame()
    await ctx.close()

SEGS = {"hero": seg_hero, "scroll": seg_scroll, "treat": seg_treat, "mobile": seg_mobile, "form": seg_form_admin}

async def main(which):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=ARGS)
        for k in (SEGS if which == "all" else [which]):
            await SEGS[k](b); print("done", k, flush=True)
        await b.close()

asyncio.run(main(sys.argv[1]))
