# -*- coding: utf-8 -*-
"""B 站封面合成：art/<id>.png（Arena 生图，无文字）+ 代码叠加中文标题。
输出 out/<id>_16x9.jpg（1920x1080）与 out/<id>_4x3.jpg（1440x1080），对应 B 站投稿的两种封面比例。
用法：python3 make_covers.py [id ...]
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
PAPER, INK, PERI, MID, FREE = (18, 16, 16), (242, 226, 200), (224, 106, 58), (168, 153, 130), (232, 87, 122)
ACC = {'claude': PERI, 'ds': (77, 107, 254), 'gpt': (63, 168, 142)}

C = {
 'ep01': dict(tag='AI娘线性代数课 · EP 01', num='01', title=['方程组', '与矩阵'], sub='消元 · 矩阵乘法 · 求逆 · LU', chips=['Leon 第1章', '3B1B式图解', '零基础'], acc='claude'),
 'ep02': dict(tag='AI娘线性代数课 · EP 02', num='02', title=['行列式'], sub='面积、体积，和“会不会塌”', chips=['Leon 第2章', '3B1B式图解', '零基础'], acc='ds'),
 'ep03': dict(tag='AI娘线性代数课 · EP 03', num='03', title=['向量空间'], sub='子空间 · 线性无关 · 基 · 秩', chips=['Leon 第3章', '3B1B式图解', '零基础'], acc='gpt'),
 'ep04': dict(tag='AI娘线性代数课 · EP 04', num='04', title=['线性变换'], sub='矩阵，就是空间的动作', chips=['Leon 第4章', '3B1B式图解', '零基础'], acc='claude'),
 'ep05': dict(tag='AI娘线性代数课 · EP 05', num='05', title=['正交性'], sub='垂直，就是最近', chips=['Leon 第5章', '3B1B式图解', '零基础'], acc='ds'),
 'ep06': dict(tag='AI娘线性代数课 · EP 06', num='06', title=['特征值'], sub='那些方向不变的向量', chips=['Leon 第6章', '3B1B式图解', '零基础'], acc='gpt'),
 'spx': dict(tag='AI娘线性代数课 · 特别篇', num='75', title=['期中', '速成版'], sub='75 分钟 · 9 份真题 · 8 类题型', chips=['考前必看', '真题逐步讲', '考前十条'], acc='claude', stamp='救急'),
 'sp1': dict(tag='特别篇 1/7 · 期中真题精讲', num='1', title=['含参', '方程组'], sub='三张平面的三种结局', chips=['2018–19', '2024–25', '2025–26'], acc='claude'),
 'sp2': dict(tag='特别篇 2/7 · 期中真题精讲', num='2', title=['初等矩阵', 'LU 与逆'], sub='每年必考的 10 分，怎么稳拿', chips=['7/7 年必考', '乘数归位', '逆印章'], acc='ds'),
 'sp3': dict(tag='特别篇 3/7 · 期中真题精讲', num='3', title=['行列式'], sub='公式连击 + 余子式“偷梁换柱”', chips=['填空秒杀', '4×4 消元', '伴随'], acc='gpt'),
 'sp4': dict(tag='特别篇 4/7 · 期中真题精讲', num='4', title=['子空间', '与相关性'], sub='判定、证明、反例，一套带走', chips=['三道闸门', '朗斯基', '证明模板'], acc='ds'),
 'sp5': dict(tag='特别篇 5/7 · 期中真题精讲', num='5', title=['过渡矩阵'], sub='Leon 与同济的“约定之战”', chips=['两副眼镜', '坐标', '自检'], acc='claude'),
 'sp6': dict(tag='特别篇 6/7 · 期中真题精讲', num='6', title=['RREF', '反推'], sub='压轴题 + 一道原题有 bug', chips=['24 分压轴', '丝线读心术', '四个子空间'], acc='gpt', stamp='压轴'),
 'sp7': dict(tag='特别篇 7/7 · 期中真题精讲', num='7', title=['判断题', '闪电战'], sub='整卷导航 · 120 分钟怎么分', chips=['反例速查', '整卷地图', '附加题'], acc='claude', x43=0.36),
}


def font(path, size):
    return ImageFont.truetype(path, size, index=2)  # index 2 = SC in Noto CJK ttc


def compose(cid, W, H):
    cfg = C[cid]
    art = Image.open(f'art/{cid}.png').convert('RGB')
    sc = max(W / art.width, H / art.height)
    art = art.resize((round(art.width * sc), round(art.height * sc)), Image.LANCZOS)
    if W / H > 1.6:
        x0 = art.width - W  # 16:9: crop from the left, the character lives on the right
    else:
        # 4:3: keep the character (≈73% of art width) at ≈68% of the frame
        x0 = art.width * 0.73 - W * 0.68
        if cfg.get('x43') is not None:  # per-cover anchor: art fraction placed at 40% of frame
            x0 = art.width * cfg['x43'] - W * 0.40
        x0 = int(min(art.width - W, max(0, x0)))
    y0 = (art.height - H) // 2
    img = art.crop((x0, y0, x0 + W, y0 + H)).convert('RGBA')
    # left gradient for readability
    grad = Image.new('L', (W, 1))
    for x in range(W):
        t = x / (W * (0.62 if W / H > 1.6 else 0.66))
        grad.putpixel((x, 0), int(255 * max(0, min(1, 1 - t)) ** 1.4 * 0.93))
    grad = grad.resize((W, H))
    img = Image.composite(Image.new('RGBA', (W, H), PAPER + (255,)), img, grad)
    d = ImageDraw.Draw(img)
    narrow = W / H < 1.6
    X = 90 if narrow else 110
    top = 120
    acc = ACC[cfg['acc']]
    # faint outline numeral
    big = font(SERIF, 640)
    lay = Image.new('RGBA', (W, H)); ld = ImageDraw.Draw(lay)
    ld.text((X - 30, top - 40), cfg['num'], font=big, fill=(0, 0, 0, 0), stroke_width=4, stroke_fill=PERI + (60,))
    img = Image.alpha_composite(img, lay); d = ImageDraw.Draw(img)
    # tag line
    ft = font(SANS, 46)
    d.rectangle((X, top + 10, X + 10, top + 58), fill=acc)
    d.text((X + 30, top + 4), cfg['tag'], font=ft, fill=INK)
    # title
    y = top + 110
    n = max(len(s) for s in cfg['title'])
    size = 220 if n <= 3 else (190 if n <= 4 else 160)
    if narrow:
        size = min(size, int(W * 0.5 / n))
    fT = font(SERIF, size)
    for line in cfg['title']:
        # dark halo for legibility, then heavy cream text (stroke thickens Bold → Black)
        halo = Image.new('RGBA', (W, H)); hd = ImageDraw.Draw(halo)
        hd.text((X, y), line, font=fT, fill=PAPER + (255,), stroke_width=18, stroke_fill=PAPER + (255,))
        halo = halo.filter(ImageFilter.GaussianBlur(14))
        img = Image.alpha_composite(img, halo); d = ImageDraw.Draw(img)
        d.text((X + 6, y + 8), line, font=fT, fill=(0, 0, 0), stroke_width=3, stroke_fill=(0, 0, 0))
        d.text((X, y), line, font=fT, fill=INK, stroke_width=3, stroke_fill=INK)
        y += int(size * 1.12)
    # underline + subtitle
    d.rectangle((X, y + 18, X + 140, y + 30), fill=PERI)
    fs = font(SANS, 62)
    sw = d.textlength(cfg['sub'], font=fs)
    while sw > W * 0.6:
        fs = font(SANS, fs.size - 2); sw = d.textlength(cfg['sub'], font=fs)
    plate = Image.new('RGBA', (W, H)); pd = ImageDraw.Draw(plate)
    pd.rounded_rectangle((X - 22, y + 46, X + sw + 26, y + 46 + 92), radius=14, fill=PAPER + (225,))
    img = Image.alpha_composite(img, plate); d = ImageDraw.Draw(img)
    d.text((X, y + 52), cfg['sub'], font=fs, fill=PERI, stroke_width=1, stroke_fill=PERI)
    # chips
    fc = font(SANS, 40)
    cy = H - 150
    cx = X
    for ch in cfg['chips']:
        tw = d.textlength(ch, font=fc)
        d.rounded_rectangle((cx, cy, cx + tw + 56, cy + 78), radius=39, outline=INK, width=3, fill=(18, 16, 16, 255))
        d.text((cx + 28, cy + 12), ch, font=fc, fill=INK)
        cx += tw + 56 + 22
    # optional stamp
    if cfg.get('stamp'):
        st = Image.new('RGBA', (420, 220)); sd = ImageDraw.Draw(st)
        sd.rounded_rectangle((10, 10, 410, 210), radius=22, outline=FREE, width=12)
        sd.text((210, 112), cfg['stamp'], font=font(SANS, 130), fill=FREE, anchor='mm')
        st = st.rotate(14, expand=True, resample=Image.BICUBIC)
        if narrow:  # 4:3: small stamp in the lower-right, clear of faces
            st = st.resize((int(st.width * 0.62), int(st.height * 0.62)), Image.LANCZOS)
            img.alpha_composite(st, (W - st.width - 50, H - st.height - 60))
        else:
            sx = X + int(d.textlength(cfg['title'][0], font=fT)) + 40
            img.alpha_composite(st, (min(sx, W - st.width - 60), top + 70))
    # thin frame
    d = ImageDraw.Draw(img)
    d.rectangle((24, 24, W - 25, H - 25), outline=PERI + (120,), width=2)
    return img.convert('RGB')


if __name__ == '__main__':
    os.makedirs('out', exist_ok=True)
    ids = sys.argv[1:] or [k for k in C if os.path.exists(f'art/{k}.png')]
    for cid in ids:
        for (W, H, tag) in [(1920, 1080, '16x9'), (1440, 1080, '4x3')]:
            compose(cid, W, H).save(f'out/{cid}_{tag}.jpg', quality=92)
        print('ok', cid)
