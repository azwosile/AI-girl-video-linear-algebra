# 联系表：python pipeline/test/sheet.py <帧目录> <输出前缀> [每张帧数 12] [列 3]
import sys, glob, os
from PIL import Image, ImageDraw
d, pre = sys.argv[1], sys.argv[2]; per = int(sys.argv[3]) if len(sys.argv) > 3 else 12; cols = int(sys.argv[4]) if len(sys.argv) > 4 else 3
fs = sorted(glob.glob(os.path.join(d, '*.jpg'))); W, H = 640, 360
for k in range(0, len(fs), per):
    grp = fs[k:k + per]; rows = (len(grp) + cols - 1) // cols
    S = Image.new('RGB', (cols * W, rows * H), (0, 0, 0)); g = ImageDraw.Draw(S)
    for i, f in enumerate(grp):
        im = Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS); x, y = i % cols * W, i // cols * H
        S.paste(im, (x, y)); g.rectangle([x, y, x + 92, y + 22], fill=(0, 0, 0)); g.text((x + 4, y + 4), os.path.basename(f)[1:-4], fill=(255, 255, 0))
    S.save(f'{pre}_{k // per + 1}.jpg', quality=85); print(f'{pre}_{k // per + 1}.jpg')
