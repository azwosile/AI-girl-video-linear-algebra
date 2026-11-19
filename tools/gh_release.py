# -*- coding: utf-8 -*-
"""创建/更新 AI娘线性代数课 GitHub Releases 并上传成片与封面资产。

用法：
    python tools/gh_release.py [--skip-missing] [--no-proxy] [tag...]

不传 tag 时处理全部 15 个标签（ep1–ep7、spx、sp1–sp7）。
Token 运行时从 Git Credential Manager 获取，不打印、不落盘。
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import BinaryIO

import requests

ROOT = Path(__file__).resolve().parent.parent
REPO = "azwosile/AI-girl-video-linear-algebra"
TARGET_COMMITISH = "main"
GCM = "D:/DeepSeek Harness WorkSpace/ShunCode/resources/app/extensions/shuncode/runtime/git/mingw64/bin/git-credential-manager.exe"
DEFAULT_PROXY = "http://127.0.0.1:7890"
MAX_ASSET_BYTES = 2 * 1024**3  # GitHub Releases 单文件严格上限 2 GiB
MAX_RETRIES = 4
UPLOAD_CHUNK_SIZE = 1024 * 1024  # 1 MiB 流式上传分块
PROGRESS_INTERVAL_SEC = 30.0
UPLOAD_TIMEOUT = (30, 7200)  # 单文件最长 2 小时
API_TIMEOUT = 30

# 各 Release 配置：(tag, title, seg_count, path_1080p, path_720p, cover_prefix, meta_path, nvenc_reencoded, make_latest)
SPECS = [
    ("ep1", "第 1 集 · 方程组与矩阵", 11, "out/gh_1080p/AI-girl-LA-ep1-1080p.mp4", "out/AI娘线性代数课_第1集_方程组与矩阵_720p.mp4", "docs/covers/ep01", "ep/ep1_meta.txt", True, "false"),
    ("ep2", "第 2 集 · 行列式", 9, "out/gh_1080p/AI-girl-LA-ep2-1080p.mp4", "out/AI娘线性代数课_第2集_行列式_720p.mp4", "docs/covers/ep02", "ep/ep2_meta.txt", True, "false"),
    ("ep3", "第 3 集 · 向量空间", 10, "out/gh_1080p/AI-girl-LA-ep3-1080p.mp4", "out/AI娘线性代数课_第3集_向量空间_720p.mp4", "docs/covers/ep03", "ep/ep3_meta.txt", True, "false"),
    ("ep4", "第 4 集 · 线性变换", 8, "out/gh_1080p/AI-girl-LA-ep4-1080p.mp4", "out/AI娘线性代数课_第4集_线性变换_720p.mp4", "docs/covers/ep04", "ep/ep4_meta.txt", True, "false"),
    ("ep5", "第 5 集 · 正交性", 10, "out/gh_1080p/AI-girl-LA-ep5-1080p.mp4", "out/AI娘线性代数课_第5集_正交性_720p.mp4", "docs/covers/ep05", "ep/ep5_meta.txt", True, "false"),
    ("ep6", "第 6 集 · 特征值", 11, "out/gh_1080p/AI-girl-LA-ep6-1080p.mp4", "out/AI娘线性代数课_第6集_特征值_720p.mp4", "docs/covers/ep06", "ep/ep6_meta.txt", True, "false"),
    ("ep7", "第 7 集 · 数值线性代数", 12, "out/gh_1080p/AI-girl-LA-ep7-1080p.mp4", "out/AI娘线性代数课_第7集_数值线性代数_720p.mp4", "docs/covers/ep07", "ep/ep7_meta.txt", True, "true"),
    ("spx", "期中特别篇 · 速成版（第1–3章）", 9, "out/gh_1080p/AI-girl-LA-spx-1080p.mp4", "spx/out/特别篇速成版_期中90分钟_720p.mp4", "docs/covers/spx", "spx/out/meta.txt", True, "false"),
    ("sp1", "期中特别篇 1 · 含参方程组", 7, "out/AI娘线性代数课_期中特别篇1_含参方程组.mp4", "out/AI娘线性代数课_期中特别篇1_含参方程组_720p.mp4", "docs/covers/sp1", "ep/sp1_meta.txt", False, "false"),
    ("sp2", "期中特别篇 2 · 初等矩阵、LU 与逆", 5, "out/AI娘线性代数课_期中特别篇2_初等矩阵、LU与逆.mp4", "out/AI娘线性代数课_期中特别篇2_初等矩阵、LU与逆_720p.mp4", "docs/covers/sp2", "ep/sp2_meta.txt", False, "false"),
    ("sp3", "期中特别篇 3 · 行列式", 6, "out/AI娘线性代数课_期中特别篇3_行列式.mp4", "out/AI娘线性代数课_期中特别篇3_行列式_720p.mp4", "docs/covers/sp3", "ep/sp3_meta.txt", False, "false"),
    ("sp4", "期中特别篇 4 · 向量空间与子空间", 6, "out/AI娘线性代数课_期中特别篇4_向量空间与子空间.mp4", "out/AI娘线性代数课_期中特别篇4_向量空间与子空间_720p.mp4", "docs/covers/sp4", "ep/sp4_meta.txt", False, "false"),
    ("sp5", "期中特别篇 5 · 基、坐标与过渡矩阵", 6, "out/AI娘线性代数课_期中特别篇5_基、坐标与过渡矩阵.mp4", "out/AI娘线性代数课_期中特别篇5_基、坐标与过渡矩阵_720p.mp4", "docs/covers/sp5", "ep/sp5_meta.txt", False, "false"),
    ("sp6", "期中特别篇 6 · 秩与 RREF 反推", 7, "out/AI娘线性代数课_期中特别篇6_秩与RREF反推.mp4", "out/AI娘线性代数课_期中特别篇6_秩与RREF反推_720p.mp4", "docs/covers/sp6", "ep/sp6_meta.txt", False, "false"),
    ("sp7", "期中特别篇 7 · 判断题闪电战与整卷导航", 3, "out/AI娘线性代数课_期中特别篇7_判断题闪电战与整卷导航.mp4", "out/AI娘线性代数课_期中特别篇7_判断题闪电战与整卷导航_720p.mp4", "docs/covers/sp7", "ep/sp7_meta.txt", False, "false"),
]

SPEC_MAP = {row[0]: row for row in SPECS}


class Logger:
    """将状态日志同时写入 out/gh_release_<pid>.log 与标准输出（按行打开/追加/关闭并捕获 OSError）。"""

    def __init__(self, log_path: Path) -> None:
        self._log_path = log_path
        try:
            self._log_path.parent.mkdir(parents=True, exist_ok=True)
        except OSError:
            pass

    def log(self, *parts: object) -> None:
        stamp = time.strftime("%Y-%m-%d %H:%M:%S")
        line = f"[{stamp}] " + " ".join(str(p) for p in parts)
        try:
            print(line, flush=True)
        except OSError:
            pass
        try:
            self._log_path.parent.mkdir(parents=True, exist_ok=True)
            with self._log_path.open("a", encoding="utf-8") as fp:
                fp.write(line + "\n")
        except OSError:
            pass

    def close(self) -> None:
        pass


class ChunkedUploadStream:
    """1 MiB 分块流式读取包装器，支持 __len__ 并每 30 秒输出实时上传速率与 ETA。"""

    def __init__(
        self,
        fp: BinaryIO,
        total_size: int,
        asset_name: str,
        logger: Logger,
        chunk_size: int = UPLOAD_CHUNK_SIZE,
        log_interval: float = PROGRESS_INTERVAL_SEC,
    ) -> None:
        self._fp = fp
        self._total = total_size
        self._name = asset_name
        self._logger = logger
        self._chunk_size = chunk_size
        self._log_interval = log_interval
        self._sent = 0
        self._t0 = time.monotonic()
        self._last_log = self._t0

    def __len__(self) -> int:
        return self._total

    def read(self, size: int = -1) -> bytes:
        read_len = self._chunk_size if (size is None or size < 0 or size < self._chunk_size) else size
        chunk = self._fp.read(read_len)
        if not chunk:
            return b""
        self._sent += len(chunk)
        now = time.monotonic()
        if now - self._last_log >= self._log_interval:
            elapsed = max(now - self._t0, 1e-3)
            speed_mbs = (self._sent / 1048576.0) / elapsed
            pct = (self._sent * 100.0 / self._total) if self._total else 100.0
            rem_bytes = max(self._total - self._sent, 0)
            eta_sec = (rem_bytes / (self._sent / elapsed)) if self._sent > 0 else 0.0
            self._logger.log(
                self._name,
                "progress",
                f"{self._sent / 1048576:.1f}/{self._total / 1048576:.1f} MiB",
                f"({pct:.1f}%)",
                f"{speed_mbs:.2f} MB/s",
                f"ETA {eta_sec:.0f}s",
            )
            self._last_log = now
        return chunk


def fmt_mmss(ms: int) -> str:
    """将毫秒四舍五入格式化为 mm:ss。"""
    sec = (ms + 500) // 1000
    return f"{sec // 60:02d}:{sec % 60:02d}"


def parse_chapters(meta_path: Path) -> list[dict[str, object]]:
    """解析 FFMETADATA1 文件中的章节 START/END（毫秒）与标题。"""
    chapters: list[dict[str, object]] = []
    cur: dict[str, object] | None = None
    with meta_path.open("r", encoding="utf-8") as fh:
        for raw in fh:
            line = raw.strip()
            if not line or line.startswith(";"):
                continue
            if line == "[CHAPTER]":
                if cur is not None:
                    chapters.append(cur)
                cur = {}
                continue
            if cur is not None and "=" in line:
                k, v = line.split("=", 1)
                if k in ("START", "END"):
                    cur[k] = int(v)
                elif k == "title":
                    cur["title"] = v
                elif k == "TIMEBASE":
                    cur["TIMEBASE"] = v
    if cur is not None:
        chapters.append(cur)
    return chapters


def build_release_body(spec: tuple) -> str:
    """根据 meta.txt 章节信息生成 Release 说明正文。"""
    tag, title, seg_count, _p1080, _p720, _cov, meta_rel, nvenc_reencoded, _latest = spec
    chapters = parse_chapters(ROOT / meta_rel)
    if not chapters:
        raise ValueError(f"未解析到章节：{meta_rel}")
    total_ms = int(chapters[-1]["END"])
    dur_str = fmt_mmss(total_ms)
    total_sec = total_ms / 1000.0

    rows = []
    for ch in chapters:
        st = int(ch["START"])
        ed = int(ch["END"])
        ch_dur = (ed - st) / 1000.0
        rows.append(f"| {fmt_mmss(st)} | {fmt_mmss(ed)} | {ch_dur:.1f} s | {ch['title']} |")
    chapter_table = "\n".join(rows)

    nvenc_note = ""
    if nvenc_reencoded:
        nvenc_note = (
            "\n> **体积说明**：为符合 GitHub Releases 单文件 `< 2 GiB` 限制，"
            "`1080p60` 成片已使用 NVIDIA NVENC 压缩重编码（保留 `1920×1080`、60 fps、内嵌章节标记与音频规格）。\n"
        )

    return (
        f"AI娘线性代数课 **{title}**，共 {seg_count} 段，总长 `{dur_str}`（{total_sec:.1f} s）。\n"
        f"视频规格：`H.264 + AAC 48 kHz 立体声，60 fps，内嵌章节标记，响度 −16 LUFS`。\n"
        f"{nvenc_note}\n"
        f"### 附件说明\n"
        f"- `AI-girl-LA-{tag}-1080p.mp4`：1080p60 完整成片（内嵌章节标记）\n"
        f"- `AI-girl-LA-{tag}-720p.mp4`：720p60 轻量版（内嵌章节标记）\n"
        f"- `AI-girl-LA-{tag}-cover-16x9.jpg`：16:9 横版封面（1920×1080）\n"
        f"- `AI-girl-LA-{tag}-cover-4x3.jpg`：4:3 卡片封面（1440×1080）\n\n"
        f"### 章节时间轴\n"
        f"| 起点 | 终点 | 时长 | 章节 |\n"
        f"|---|---|---|---|\n"
        f"{chapter_table}\n\n"
        f"### 许可声明\n"
        f"本项目整体按**非商用**处理，成片按 **CC BY-NC-SA 4.0** 分享；"
        f"角色为社区同人形象，AI 名称与商标归各自权利人，教材版权归原出版社所有。"
        f"仓库主页：[azwosile/{REPO.split('/')[1]}](https://github.com/{REPO})。"
    )


def get_github_token() -> str:
    """运行时从 Git Credential Manager 读取 GitHub Token（不落盘、不打印）。"""
    env = {**os.environ, "GCM_INTERACTIVE": "never"}
    proc = subprocess.run(
        [GCM, "get"],
        input="protocol=https\nhost=github.com\n\n",
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        env=env,
        timeout=30,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"GCM 退出码 {proc.returncode}")
    for line in proc.stdout.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            if k == "password" and v:
                return v
    raise RuntimeError("GCM 未返回 GitHub password/token")


def build_session(token: str, no_proxy: bool = False) -> requests.Session:
    """构造带认证头与代理设置的 requests.Session。"""
    sess = requests.Session()
    if no_proxy:
        sess.trust_env = False
        sess.proxies.clear()
    else:
        http_proxy = os.environ.get("HTTP_PROXY") or os.environ.get("http_proxy")
        https_proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
        if not http_proxy and not https_proxy:
            http_proxy = https_proxy = DEFAULT_PROXY
        else:
            http_proxy = http_proxy or https_proxy
            https_proxy = https_proxy or http_proxy
        sess.proxies.update({"http": http_proxy, "https": https_proxy})

    sess.headers.update(
        {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
    )
    return sess


def api_request(sess: requests.Session, method: str, url: str, **kwargs) -> requests.Response:
    """带重试的轻量 GitHub REST API 请求。"""
    kwargs.setdefault("timeout", API_TIMEOUT)
    last_exc: Exception | None = None
    for attempt in range(MAX_RETRIES):
        try:
            resp = sess.request(method, url, **kwargs)
            if resp.status_code < 500 and resp.status_code != 429:
                return resp
            last_exc = RuntimeError(f"HTTP {resp.status_code}")
        except requests.RequestException as exc:
            last_exc = exc
        if attempt + 1 < MAX_RETRIES:
            time.sleep(2**attempt)
    raise RuntimeError(f"API 请求失败 ({method} {url}): {last_exc}")


def list_assets(sess: requests.Session, rel_url: str) -> dict[str, dict]:
    """拉取 Release 现有资产字典 {name: asset_obj}。"""
    resp = api_request(sess, "GET", f"{rel_url}/assets?per_page=100")
    if resp.status_code >= 300:
        raise RuntimeError(f"获取资产列表失败: HTTP {resp.status_code} {resp.text[:200]}")
    return {a["name"]: a for a in resp.json()}


def ensure_release(sess: requests.Session, spec: tuple, body: str, logger: Logger) -> dict:
    """创建或更新 Release，返回 Release JSON 对象。"""
    tag, title, *_rest, make_latest = spec
    rel_name = f"AI娘线性代数课 {title}"
    r = api_request(sess, "GET", f"https://api.github.com/repos/{REPO}/releases/tags/{tag}")
    if r.status_code == 200:
        rel = r.json()
        patch_payload: dict[str, object] = {"name": rel_name, "body": body}
        if make_latest == "true":
            patch_payload["make_latest"] = "true"
        pr = api_request(sess, "PATCH", rel["url"], json=patch_payload)
        if pr.status_code >= 300:
            raise RuntimeError(f"{tag} 更新失败: HTTP {pr.status_code} {pr.text[:300]}")
        rel = pr.json()
        logger.log(tag, "updated", f"id={rel['id']}", f"url={rel['html_url']}")
        return rel

    if r.status_code != 404:
        raise RuntimeError(f"{tag} 查询失败: HTTP {r.status_code} {r.text[:300]}")

    create_payload = {
        "tag_name": tag,
        "target_commitish": TARGET_COMMITISH,
        "name": rel_name,
        "body": body,
        "draft": False,
        "prerelease": False,
        "make_latest": make_latest,
    }
    cr = api_request(sess, "POST", f"https://api.github.com/repos/{REPO}/releases", json=create_payload)
    if cr.status_code >= 300:
        raise RuntimeError(f"{tag} 创建失败: HTTP {cr.status_code} {cr.text[:300]}")
    rel = cr.json()
    logger.log(tag, "created", f"id={rel['id']}", f"url={rel['html_url']}")
    return rel


def upload_asset(
    sess: requests.Session,
    rel: dict,
    local_path: Path,
    asset_name: str,
    label: str,
    content_type: str,
    have: dict[str, dict],
    logger: Logger,
) -> bool:
    """幂等上传单个资产；体积超限、未就绪或 4 次重试仍失败则返回 False。"""
    size = local_path.stat().st_size
    if size >= MAX_ASSET_BYTES:
        logger.log(asset_name, "ERROR", f"size={size} >= {MAX_ASSET_BYTES} (2 GiB limit)")
        return False

    existing = have.get(asset_name)
    if existing is not None:
        if existing.get("state") == "uploaded" and existing.get("size") == size:
            logger.log(asset_name, "skip", f"size={size}")
            return True
        logger.log(asset_name, "delete_stale", f"state={existing.get('state')}", f"size={existing.get('size')}")
        api_request(sess, "DELETE", existing["url"])

    upload_url = f"https://uploads.github.com/repos/{REPO}/releases/{rel['id']}/assets"
    for attempt in range(MAX_RETRIES):
        t0 = time.monotonic()
        try:
            with local_path.open("rb") as fh:
                stream = ChunkedUploadStream(fh, size, asset_name, logger)
                resp = sess.post(
                    upload_url,
                    params={"name": asset_name, "label": label},
                    data=stream,
                    headers={"Content-Type": content_type, "Content-Length": str(size)},
                    timeout=UPLOAD_TIMEOUT,
                )
            if resp.status_code < 300:
                data = resp.json()
                if data.get("state") == "uploaded" and data.get("size") == size:
                    elapsed = max(time.monotonic() - t0, 1e-3)
                    speed_mbs = (size / 1048576.0) / elapsed
                    logger.log(
                        asset_name,
                        "uploaded",
                        f"size={size}",
                        f"{size / 1048576:.1f} MiB",
                        f"{elapsed:.1f}s",
                        f"{speed_mbs:.2f} MB/s",
                    )
                    return True
                logger.log(asset_name, "try", attempt + 1, f"unexpected_state={data.get('state')}", f"size={data.get('size')}")
            else:
                logger.log(asset_name, "try", attempt + 1, f"HTTP {resp.status_code}", resp.text[:200])
        except Exception as exc:
            logger.log(asset_name, "try", attempt + 1, "ERR", type(exc).__name__, str(exc)[:200])

        # 清理可能残留的未完成资产后再等待退避
        try:
            for name, asset in list_assets(sess, rel["url"]).items():
                if name == asset_name:
                    api_request(sess, "DELETE", asset["url"])
        except Exception as clean_exc:
            logger.log(asset_name, "cleanup_err", type(clean_exc).__name__, str(clean_exc)[:150])

        if attempt + 1 < MAX_RETRIES:
            backoff = 2 ** (attempt + 1)
            time.sleep(backoff)

    logger.log(asset_name, "FAILED", f"after {MAX_RETRIES} attempts")
    return False


def is_mp4_ready(local_path: Path, expected_dur_sec: float) -> tuple[bool, str]:
    """检查 MP4 是否已写完并可完整读取（防止上传编码中的半成品）。"""
    size1 = local_path.stat().st_size
    if size1 <= 0:
        return False, "size=0"
    try:
        proc = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(local_path)],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=30,
        )
        if proc.returncode != 0 or not proc.stdout.strip():
            return False, "ffprobe failed (moov missing or unreadable)"
        actual_dur = float(proc.stdout.strip())
    except FileNotFoundError:
        actual_dur = expected_dur_sec
    except (ValueError, subprocess.SubprocessError) as exc:
        return False, f"ffprobe error: {exc}"

    if abs(actual_dur - expected_dur_sec) > 5.0:
        return False, f"duration={actual_dur:.2f}s != expected={expected_dur_sec:.2f}s"

    time.sleep(0.2)
    size2 = local_path.stat().st_size
    if size2 != size1:
        return False, f"file still growing ({size1} -> {size2})"
    return True, ""


def build_jobs(spec: tuple, dur_str: str) -> list[tuple[Path, str, str, str]]:
    """构造某 Release 的 4 个待上传资产清单（按体积从小到大：cover-16x9 -> cover-4x3 -> 720p -> 1080p）。"""
    tag, title, _seg, p1080, p720, cov_prefix, _meta, nvenc_reencoded, _latest = spec
    note_1080 = "NVENC 压缩 <2GiB，内嵌章节" if nvenc_reencoded else "内嵌章节"
    return [
        (ROOT / f"{cov_prefix}_16x9.jpg", f"AI-girl-LA-{tag}-cover-16x9.jpg", f"{title} 封面 16:9", "image/jpeg"),
        (ROOT / f"{cov_prefix}_4x3.jpg", f"AI-girl-LA-{tag}-cover-4x3.jpg", f"{title} 封面 4:3", "image/jpeg"),
        (ROOT / p720, f"AI-girl-LA-{tag}-720p.mp4", f"{title} 720p60（{dur_str}，内嵌章节）", "video/mp4"),
        (ROOT / p1080, f"AI-girl-LA-{tag}-1080p.mp4", f"{title} 1080p60（{dur_str}，{note_1080}）", "video/mp4"),
    ]


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

    parser = argparse.ArgumentParser(description="上传 AI娘线性代数课 GitHub Releases")
    parser.add_argument("--skip-missing", action="store_true", help="跳过本地尚未生成的资产文件")
    parser.add_argument("--no-proxy", action="store_true", help="直连 GitHub，不使用 HTTP/HTTPS 代理")
    parser.add_argument("tags", nargs="*", help="指定要处理的标签（如 ep1 sp1），省略则处理全部 13 个")
    args = parser.parse_args(argv)

    target_tags = args.tags if args.tags else [row[0] for row in SPECS]
    unknown = [t for t in target_tags if t not in SPEC_MAP]
    if unknown:
        print(f"未知标签: {', '.join(unknown)}；可选: {', '.join(SPEC_MAP)}", file=sys.stderr)
        return 2

    log_path = ROOT / "out" / f"gh_release_{os.getpid()}.log"
    logger = Logger(log_path)
    failures = 0

    try:
        try:
            token = get_github_token()
        except Exception as exc:
            logger.log("NO TOKEN", type(exc).__name__, str(exc))
            return 1

        sess = build_session(token, no_proxy=args.no_proxy)
        logger.log(
            "START",
            f"tags={','.join(target_tags)}",
            f"skip_missing={args.skip_missing}",
            f"no_proxy={args.no_proxy}",
            f"log={log_path.relative_to(ROOT)}",
        )

        for tag in target_tags:
            spec = SPEC_MAP[tag]
            try:
                chapters = parse_chapters(ROOT / spec[6])
                expected_dur_sec = int(chapters[-1]["END"]) / 1000.0
                dur_str = fmt_mmss(int(chapters[-1]["END"]))
                body = build_release_body(spec)
                rel = ensure_release(sess, spec, body, logger)
                have = list_assets(sess, rel["url"])
            except Exception as exc:
                logger.log(tag, "RELEASE_ERR", type(exc).__name__, str(exc)[:300])
                failures += 1
                continue

            for local_path, asset_name, label, ctype in build_jobs(spec, dur_str):
                if not local_path.exists():
                    if args.skip_missing:
                        logger.log(asset_name, "skip_missing", str(local_path.relative_to(ROOT)))
                        continue
                    logger.log(asset_name, "MISSING_FILE", str(local_path.relative_to(ROOT)))
                    failures += 1
                    continue
                if local_path.suffix.lower() == ".mp4":
                    ready, reason = is_mp4_ready(local_path, expected_dur_sec)
                    if not ready:
                        if args.skip_missing:
                            logger.log(asset_name, "skip_incomplete", reason)
                            continue
                        logger.log(asset_name, "INCOMPLETE_MP4", reason)
                        failures += 1
                        continue
                ok = upload_asset(sess, rel, local_path, asset_name, label, ctype, have, logger)
                if not ok:
                    failures += 1

        logger.log("DONE", f"failures={failures}")
    finally:
        logger.close()

    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
