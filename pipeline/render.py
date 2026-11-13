# -*- coding: utf-8 -*-
"""逐帧渲染：Playwright 驱动 Chrome 调用 window.renderAt(t)，JPEG 管道送 ffmpeg。
用法（在项目根目录）：
  联系表 / 单帧：uv run --with playwright python pipeline/render.py ch01/p0_sample --frames 3 8.5 14 --outdir ch01/p0_sample/out/frames
  完整视频：    uv run --with playwright python pipeline/render.py ch01/p0_sample --video --jobs 3 --enc h264_nvenc
  选项：--channel chrome（用本机 Chrome；省略则用 Playwright 自带 Chromium）--fps 60 --start/--end 秒
输出：<段>/out/video_noaudio.mp4、<段>/out/timeline.json（混音与字幕用）
"""
import argparse, base64, functools, http.server, json, os, socketserver, subprocess, sys, threading, time
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()


def serve():
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, httpd.server_address[1]


def open_page(p, port, seg, channel):
    args = ['--use-angle=d3d11' if os.name == 'nt' else '--use-gl=angle', '--enable-gpu-rasterization', '--ignore-gpu-blocklist',
            '--force-color-profile=srgb', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
    b = p.chromium.launch(channel=channel or None, args=args, headless=True)
    pg = b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/{seg}/index.html?render', wait_until='load')
    try:
        pg.wait_for_function('window.__ready === true || window.__error', timeout=60000)
    except Exception:
        pass
    err = pg.evaluate('window.__error || null')
    if err or not pg.evaluate('window.__ready === true'):
        raise SystemExit(f'页面未就绪：{err}\n' + '\n'.join(errs))
    return b, pg


GRAB = "t => { window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.95); }"


def render_chunk(job):
    seg, _, channel, fps, f0, f1, out, enc = job
    from playwright.sync_api import sync_playwright
    httpd, port = serve()  # 每个子进程自带静态服务器（Windows spawn 下父进程的服务器不可靠）
    vcodec = (['-c:v', 'h264_nvenc', '-preset', 'p6', '-tune', 'hq', '-rc', 'vbr', '-cq', '16', '-b:v', '0'] if enc == 'h264_nvenc'
              else ['-c:v', 'libx264', '-preset', 'medium', '-crf', '15'])
    ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', str(fps), '-i', '-',
                           *vcodec, '-pix_fmt', 'yuv420p', '-r', str(fps), out], stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b, pg = open_page(p, port, seg, channel)
        t0 = time.time()
        for f in range(f0, f1):
            url = pg.evaluate(GRAB, f / fps)
            ff.stdin.write(base64.b64decode(url.split(',', 1)[1]))
            if (f - f0) % 300 == 0: print(f'  [{f0}-{f1}] {f - f0}/{f1 - f0}  {time.time() - t0:.0f}s', flush=True)
        b.close()
    ff.stdin.close(); ff.wait(); httpd.shutdown()
    if ff.returncode: raise SystemExit(f'ffmpeg 失败：{out}')
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('seg'); ap.add_argument('--frames', nargs='*', type=float); ap.add_argument('--outdir')
    ap.add_argument('--video', action='store_true'); ap.add_argument('--fps', type=int, default=60)
    ap.add_argument('--jobs', type=int, default=3); ap.add_argument('--enc', default='libx264')
    ap.add_argument('--channel', default=''); ap.add_argument('--start', type=float, default=0); ap.add_argument('--end', type=float)
    a = ap.parse_args()
    seg = a.seg.strip('/').replace('\\', '/')
    httpd, port = serve()
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = open_page(p, port, seg, a.channel)
        tl = pg.evaluate('window.TIMELINE'); total = pg.evaluate('window.DURATION')
        outd = ROOT / seg / 'out'; outd.mkdir(parents=True, exist_ok=True)
        (outd / 'timeline.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'时长 {total:.2f}s，台词 {len(tl["seq"])}，音效 {len(tl["sfx"])}')
        if a.frames:
            od = Path(a.outdir or outd / 'frames'); od.mkdir(parents=True, exist_ok=True)
            for t in a.frames:
                url = pg.evaluate(GRAB, t)
                (od / f't{t:06.2f}.jpg').write_bytes(base64.b64decode(url.split(',', 1)[1]))
            print('frames →', od)
        b.close()
    if a.video:
        end = min(a.end or total, total); F0, F1 = round(a.start * a.fps), round(end * a.fps)
        n = max(1, a.jobs); step = (F1 - F0 + n - 1) // n
        jobs = [(seg, port, a.channel, a.fps, F0 + i * step, min(F1, F0 + (i + 1) * step), str(outd / f'_chunk{i}.mp4'), a.enc) for i in range(n) if F0 + i * step < F1]
        t0 = time.time()
        with ProcessPoolExecutor(len(jobs)) as ex:
            parts = list(ex.map(render_chunk, jobs))
        lst = outd / '_chunks.txt'; lst.write_text(''.join(f"file '{Path(x).name}'\n" for x in parts), encoding='utf-8')
        out = outd / 'video_noaudio.mp4'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(out)], check=True)
        for x in parts: os.remove(x)
        lst.unlink()
        print(f'视频 → {out}  （{F1 - F0} 帧，{time.time() - t0:.0f}s）')
    httpd.shutdown()


if __name__ == '__main__':
    main()
