"""临时封面底图（Arena 生图额度用尽时的替补）：网格 + 大圆盘 + 角色抠图 + 主题图形。"""
from PIL import Image, ImageDraw, ImageFilter
import math, random, sys
W, H = 1376, 768
PAPER, INK, PERI = (18, 16, 16), (242, 226, 200), (224, 106, 58)
CUT = '/home/user/mcp/chars2/cut/'

def base():
    im = Image.new('RGB', (W, H), PAPER); d = ImageDraw.Draw(im, 'RGBA')
    for x in range(0, W, 48): d.line([(x, 0), (x, H)], fill=INK + (18,))
    for y in range(0, H, 48): d.line([(0, y), (W, y)], fill=INK + (18,))
    return im, d

def disc(d, cx, cy, r):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(30, 24, 22, 255))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=PERI + (230,), width=4)
    d.ellipse([cx - r - 18, cy - r - 18, cx + r + 18, cy + r + 18], outline=PERI + (60,), width=1)

def paste(im, name, h, cx, by):
    c = Image.open(CUT + name + '.png').convert('RGBA'); bb = c.getbbox(); c = c.crop(bb)
    c = c.resize((int(c.width * h / c.height), h), Image.LANCZOS)
    sh = Image.new('RGBA', c.size, (0, 0, 0, 0)); sh.putalpha(c.getchannel('A').point(lambda a: a * 0.5))
    im.paste((0, 0, 0), (cx - c.width // 2 + 10, by - h + 8), sh.filter(ImageFilter.GaussianBlur(8)).getchannel('A'))
    im.paste(c, (cx - c.width // 2, by - h), c)

def sp6():
    im, d = base(); cx, cy = 1010, 384; disc(d, cx, cy, 330)
    xs = [720, 800, 880, 1140, 1220, 1300]
    for i, x in enumerate(xs):
        d.rectangle([x, 120, x + 34, 650], fill=(INK if i % 3 else PERI) + (40,), outline=INK + (90,))
    for a, b in [(0, 2), (1, 2), (3, 5), (4, 5), (0, 4)]:
        x1, x2 = xs[a] + 17, xs[b] + 17
        pts = [(x1 + (x2 - x1) * t / 20, 200 + 60 * math.sin(math.pi * t / 20) + a * 30) for t in range(21)]
        d.line(pts, fill=PERI + (200,), width=3)
    random.seed(6)
    for _ in range(14):
        y = random.randint(60, 700); x0 = random.randint(600, 900)
        d.rectangle([x0, y, x0 + random.randint(200, 600), y + random.randint(2, 6)], fill=(230, 50, 40, 110))
    paste(im, 'gpt_cross', 700, 1010, 768)
    st = Image.new('RGBA', (300, 130), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    sd.rounded_rectangle([6, 6, 294, 124], 14, outline=(225, 60, 45, 230), width=8)
    sd.rounded_rectangle([22, 22, 278, 108], 8, outline=(225, 60, 45, 150), width=3)
    st = st.rotate(14, expand=True, resample=Image.BICUBIC); im.paste(st, (1110, 70), st)
    return im

def sp7():
    im, d = base(); cx, cy = 1010, 400; disc(d, cx, cy, 340)
    for k in range(36):
        a = 2 * math.pi * k / 36
        d.line([(cx + 360 * math.cos(a), cy + 360 * math.sin(a)), (cx + 520 * math.cos(a), cy + 520 * math.sin(a))], fill=PERI + (70,), width=3)
    random.seed(7)
    for i in range(7):
        sw, sh = 120, 160; sheet = Image.new('RGBA', (sw, sh), INK + (230,)); sd = ImageDraw.Draw(sheet)
        for j in range(6): sd.line([(14, 24 + j * 20), (sw - 14, 24 + j * 20)], fill=(120, 110, 100, 200), width=3)
        sheet = sheet.rotate(random.randint(-35, 35), expand=True, resample=Image.BICUBIC)
        im.paste(sheet, (random.randint(640, 1260), random.randint(20, 600)), sheet)
    def check(x, y, s): d.line([(x, y), (x + s * .35, y + s * .4), (x + s, y - s * .5)], fill=(63, 168, 142, 255), width=16)
    def cross(x, y, s): d.line([(x, y), (x + s, y + s)], fill=(225, 60, 45, 255), width=16); d.line([(x + s, y), (x, y + s)], fill=(225, 60, 45, 255), width=16)
    check(700, 150, 110); cross(1230, 90, 90); check(1240, 560, 90)
    paste(im, 'gpt_proud', 560, 1210, 768)
    paste(im, 'ds_happy', 560, 790, 768)
    paste(im, 'claude_point', 640, 1000, 768)
    return im

for k in sys.argv[1:] or ['sp6', 'sp7']:
    globals()[k]().save(f'art/{k}.png'); print('art', k)
