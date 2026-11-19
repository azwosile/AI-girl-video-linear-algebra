# AI娘线性代数课

用 AI 娘角色讲线性代数的系列动画课，几何直觉参照 3Blue1Brown《Essence of Linear Algebra》。主讲 **Claude**，辅讲 **GPT**，学生 **大肥鱼（DeepSeek 娘）**。

- **教材主线**：Leon《Linear Algebra with Applications》第 9 版；对照同济《线性代数》第六版与《学习辅导与习题全解》，章节顺序与记号差异由 GPT 在片中单独点出。
- **画面**：3Blue1Brown 式几何动画，构成主义三色平涂剪纸视觉（[视觉规范](docs/视觉规范.md) v1 初定奶油纸底，v2 定稿为深色海报底 `#121010` + 奶油 `#F2E2C8` / 橙 `#E06A3A` 配色）。Canvas 2D、three.js、MathJax 共用一条 `renderAt(t)` 引擎时间轴，全项目仅保留一份渲染引擎。
- **声音**：GPT-SoVITS 本地克隆配音（声线沿用同系列微积分课 / Git 课），配音前经 `g2p_lint` 做发音审查，配音后逐句做 ASR（Paraformer）复核，字幕与朗读稿分开维护、逐句对应。
- **规格与包装**：1920×1080 · 60 fps（同时提供 720p60），响度 −16 LUFS，内嵌章节标记；由 After Effects 制作片头、段落卡与片尾包装后合成为单集完整成片，并在正片之外配套**期中特别篇**（75 分钟速成版 + 7 集真题精讲）。
- **成片**：在 [Releases](https://github.com/azwosile/AI-girl-video-linear-algebra/releases) 下载（正片第 1–6 集 + 期中特别篇速成版 + 期中特别篇 1–7，共 14 个 Release）。

## 成片下载

### 正片（第 1–6 章）

| 集数 | 内容 | Release | 段数 | 时长 |
|---|---|---|---|---|
| 第 1 集 | 方程组与矩阵（Leon 第 1 章） | [ep1](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/ep1) | 11 段 | `43:45` |
| 第 2 集 | 行列式（Leon 第 2 章） | [ep2](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/ep2) | 9 段 | `39:13` |
| 第 3 集 | 向量空间（Leon 第 3 章） | [ep3](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/ep3) | 10 段 | `38:37` |
| 第 4 集 | 线性变换（Leon 第 4 章） | [ep4](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/ep4) | 8 段 | `35:12` |
| 第 5 集 | 正交性（Leon 第 5 章） | [ep5](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/ep5) | 10 段 | `38:29` |
| 第 6 集 | 特征值（Leon 第 6 章） | [ep6](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/ep6) | 11 段 | `42:56` |

> 后续规划：第 7 章（数值线性代数，已在第 6 集片尾预告）尚待制作，暂未发布 Release。

### 期中特别篇（第 1–3 章真题精讲）

| 集数 | 内容 | Release | 段数 | 时长 |
|---|---|---|---|---|
| 速成版 | 期中速成版（第 1–3 章，9 份真题 8 类题型） | [spx](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/spx) | 9 段 | `74:56` |
| 期中特别篇 1 | 含参方程组 | [sp1](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/sp1) | 7 段 | `24:14` |
| 期中特别篇 2 | 初等矩阵、LU 与逆 | [sp2](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/sp2) | 5 段 | `19:06` |
| 期中特别篇 3 | 行列式 | [sp3](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/sp3) | 6 段 | `17:14` |
| 期中特别篇 4 | 向量空间与子空间 | [sp4](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/sp4) | 6 段 | `19:13` |
| 期中特别篇 5 | 基、坐标与过渡矩阵 | [sp5](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/sp5) | 6 段 | `15:07` |
| 期中特别篇 6 | 秩与 RREF 反推 | [sp6](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/sp6) | 7 段 | `20:24` |
| 期中特别篇 7 | 判断题闪电战与整卷导航 | [sp7](https://github.com/azwosile/AI-girl-video-linear-algebra/releases/tag/sp7) | 3 段 | `11:19` |

每个 Release 均包含 4 个文件：`1080p60`（`AI-girl-LA-<tag>-1080p.mp4`）、`720p60`（`AI-girl-LA-<tag>-720p.mp4`，两者均内嵌章节标记），以及 `16:9` / `4:3` 封面（`AI-girl-LA-<tag>-cover-16x9.jpg`、`AI-girl-LA-<tag>-cover-4x3.jpg`）。

> **1080p 体积说明**：`ep1`–`ep6` 与 `spx` 的原版 `1080p60` 成片文件超过 GitHub Releases 单文件 2 GiB 上限，Release 中的 `1080p60` 版本已使用 NVIDIA NVENC 压缩重编码至 2 GiB 以内（保留 `1920×1080`、60 fps、音频规格与内嵌章节标记）。

<details><summary>分段与章节明细</summary>

**第 1 集 · 方程组与矩阵（`ep1` · 11 段 · `43:45`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 1.1 线性方程组 |
| `03:01` | 1.2 行阶梯形 |
| `05:29` | 1.2 齐次方程组与应用 |
| `09:28` | 1.3 向量与 Ax |
| `14:45` | 1.3 矩阵乘法 |
| `18:59` | 1.4 矩阵代数 |
| `23:20` | 1.5 初等矩阵与求逆 |
| `27:16` | 1.5 三角分解 LU |
| `31:26` | 1.6 分块矩阵 |
| `35:09` | 复习 · 上篇 · 概念串讲 |
| `39:12` | 复习 · 下篇 · 期中真题 |
| `43:34` | 片尾 · 下一集预告 |

**第 2 集 · 行列式（`ep2` · 9 段 · `39:13`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 2.1 行列式是什么 |
| `04:26` | 2.1 三阶与余子式展开 |
| `08:28` | 2.1 三条直接推论 |
| `11:52` | 2.2 行变换怎样改变行列式 |
| `16:11` | 2.2 奇异判定、消元法与乘积公式 |
| `20:41` | 2.3 伴随矩阵与克拉默法则 |
| `25:06` | 2.3 应用：密码与叉积 |
| `29:06` | 复习 · 上篇 · 判断题 |
| `33:09` | 复习 · 下篇 · 期中真题 |
| `39:03` | 片尾 · 下一集预告 |

**第 3 集 · 向量空间（`ep3` · 10 段 · `38:37`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 3.1 向量空间 |
| `03:53` | 3.2 子空间 |
| `07:09` | 3.2 张成 |
| `10:35` | 3.3 线性无关 |
| `14:30` | 3.4 基与维数 |
| `18:09` | 3.5 换基 |
| `21:15` | 3.6 行空间与列空间 |
| `24:33` | 3.6 秩与零化度 |
| `27:44` | 复习 · 上篇 · 判断题 12 道 |
| `33:16` | 复习 · 下篇 · 期中真题 |
| `38:27` | 片尾 · 下一集预告 |

**第 4 集 · 线性变换（`ep4` · 8 段 · `35:12`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 4.1 线性变换是什么 |
| `04:13` | 4.1 核与像 |
| `08:17` | 4.2 标准矩阵 |
| `12:22` | 4.2 任意基下的矩阵 |
| `16:31` | 4.2 计算机图形学 |
| `19:50` | 4.3 相似 |
| `24:50` | 复习 · 判断题 10 道 |
| `29:46` | 复习 · 计算题与同济题型 |
| `35:02` | 片尾 · 下一集预告 |

**第 5 集 · 正交性（`ep5` · 10 段 · `38:29`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 5.1 点积：长度、夹角、正交 |
| `03:45` | 5.1 投影：影子公式 |
| `07:21` | 5.2 正交子空间与四个基本子空间 |
| `11:20` | 5.3 最小二乘 |
| `14:34` | 5.3 数据拟合 |
| `17:52` | 5.4 内积空间 |
| `21:25` | 5.5 标准正交基与正交矩阵 |
| `25:22` | 5.6 施密特正交化与 QR |
| `29:30` | 复习 · 判断题 10 道 |
| `34:24` | 复习 · 计算题、同济题型与小结 |
| `38:18` | 片尾 · 下一集预告 |

**第 6 集 · 特征值（`ep6` · 11 段 · `42:56`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 6.1 方向不变的向量 |
| `03:47` | 6.1 特征多项式、迹与行列式 |
| `07:51` | 6.2 线性微分方程组 |
| `11:58` | 6.3 对角化 |
| `15:59` | 6.3 马尔可夫链与矩阵指数 |
| `20:03` | 6.4 对称矩阵与谱定理 |
| `23:44` | 6.5 奇异值分解 |
| `27:32` | 6.6 二次型 |
| `30:56` | 6.7 正定矩阵 |
| `34:36` | 复习 · 判断题 10 道 |
| `38:35` | 复习 · 计算题、同济题型与小结 |
| `42:46` | 片尾 · 下一集预告 |

**期中特别篇 · 速成版（第 1–3 章）（`spx` · 9 段 · `74:56`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:07` | 开场 · 路线图 |
| `02:07` | 第 1 段 · 含参方程组 |
| `10:34` | 第 2 段 · 初等矩阵 · LU · 逆 |
| `22:19` | 第 3 段 · 行列式 |
| `32:57` | 第 4 段 · 子空间 |
| `40:03` | 第 5 段 · 线性相关 |
| `47:30` | 第 6 段 · 过渡矩阵 |
| `57:50` | 第 7 段 · RREF 反推 |
| `67:39` | 第 8 段 · 判断题闪电战 + 考前十条 |

**期中特别篇 1 · 含参方程组（`sp1` · 7 段 · `24:14`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 1.1 开场：含参方程组怎么考 |
| `02:31` | 1.2 三张平面（2018–19 第1题） |
| `07:43` | 1.3 列塌进平面 |
| `12:13` | 1.4 系数就是解 |
| `15:43` | 1.5 自由变量 ≠ 无穷多解 |
| `18:01` | 1.6 矩阵方程 |
| `21:46` | 1.7 置换矩阵求逆 |
| `24:04` | 片尾 · 下一集预告 |

**期中特别篇 2 · 初等矩阵、LU 与逆（`sp2` · 5 段 · `19:06`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 2.1 同一个矩阵考两次 |
| `04:58` | 2.2 带分数的 LU + 逆（2020–21 第3题） |
| `08:25` | 2.3 LU 解 AX = B（2024–25 第5题） |
| `12:13` | 2.4 初等矩阵印章（2018–19 第2题） |
| `16:20` | 2.5 由 E 读出 L（填空速算） |
| `18:56` | 片尾 · 下一集预告 |

**期中特别篇 3 · 行列式（`sp3` · 6 段 · `17:14`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 3.1 公式填空连击 |
| `03:07` | 3.2 余子式组合 = 偷梁换柱 |
| `07:26` | 3.3 消元 4×4 + 拼出来的 B（2017–18 第4题） |
| `10:43` | 3.4 零多的行列式 + 伴随 |
| `12:40` | 3.5 先乘再算 |
| `14:59` | 3.6 两道判断题 |
| `17:04` | 片尾 · 下一集预告 |

**期中特别篇 4 · 向量空间与子空间（`sp4` · 6 段 · `19:13`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 4.1 怪数乘：公理逐条过 |
| `03:32` | 4.2 函数和多项式里的子空间 |
| `07:12` | 4.3 交集是，并集不是 |
| `09:31` | 4.4 数向量的相关性：三把刀 |
| `13:00` | 4.5 朗斯基与系数向量 |
| `16:43` | 4.6 证明：交为零 ⇒ 无关 |
| `19:02` | 片尾 · 下一集预告 |

**期中特别篇 5 · 基、坐标与过渡矩阵（`sp5` · 6 段 · `15:07`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 5.1 约定之战：Leon vs 同济 |
| `01:59` | 5.2 最新卷第5题（2025–26） |
| `05:36` | 5.3 再练一题（2017–18 第7题） |
| `07:48` | 5.4 从标准基出发 |
| `10:47` | 5.5 多项式空间里换基 |
| `12:43` | 5.6 已知 S 求新基 |
| `14:56` | 片尾 · 下一集预告 |

**期中特别篇 6 · 秩与 RREF 反推（`sp6` · 7 段 · `20:24`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 6.1 RREF 读心术 |
| `01:49` | 6.2 2025–26 第4题 |
| `05:00` | 6.3 2024–25 第4题 |
| `07:57` | 6.4 两道同型题连做 |
| `10:52` | 6.5 2022–23 第2题 |
| `12:36` | 6.6 这道题有 bug（2017–18 第8题） |
| `16:02` | 6.7 零空间与小题合集 |
| `20:13` | 片尾 · 下一集预告 |

**期中特别篇 7 · 判断题闪电战与整卷导航（`sp7` · 3 段 · `11:19`）**

| 起点 | 章节 |
|---|---|
| `00:00` | 片头 |
| `00:08` | 7.1 判断题闪电战 |
| `06:42` | 7.2 整卷导航 |
| `08:41` | 7.3 附加题 |
| `11:09` | 片尾 · 下一集预告 |

</details>

## 目录结构

```
AI娘线性代数课/
├─ README.md                 本文件
├─ docs/                     全部文档（制作计划与报告、视觉规范、角色与配音、B 站发布文案等）
│  ├─ 特别篇文稿/            特别篇 1–7 逐字稿与分集资料
│  └─ covers/                16:9 / 4:3 成品封面（ep01–ep05、spx、sp1–sp7）
├─ engine/                   全项目唯一一份渲染引擎（各段通过 /engine/... 引用，不复制）
│  ├─ core/                  util.js · timeline.js · stage.js · boot.js
│  ├─ style/                 tokens.js（视觉 token）· motifs.js · kit.js
│  ├─ tex/                   tex.js（TeX 路径缓存绘制、逐字揭示与公式变形）
│  ├─ la2d/                  plane.js · detviz.js · mboard.js
│  ├─ la3d/                  space3d.js · planes3d.js（three.js 离屏合成）
│  ├─ cast/                  cast.js · director.js（角色立绘与表情调度）
│  └─ vendor/three/          锁定的 three.js 与线条扩展依赖
├─ pipeline/                 台词检验、配音、ASR、渲染、混音与字幕流水线
│  ├─ g2p_lint.py            配音前多音字发音审查（配套 pron.py / pron.json）
│  ├─ mathcheck.py           math.json sympy 数值验算
│  ├─ tex_build.mjs          MathJax 3 离线生成 tex_cache.json
│  ├─ fonts.py               思源 / Noto Sans 字体子集化（woff2）
│  ├─ tts.py                 GPT-SoVITS 批量配音
│  ├─ asr.py                 Paraformer 逐句 ASR 复核
│  ├─ prep.py                配音转 48 kHz、调速、压停顿 → durations.json
│  ├─ render.py              Playwright + Chrome 并行逐帧渲染（window.renderAt(t)）
│  ├─ mix.py                 人声 + 音效 + BGM（人声闪避与交叉淡化）混音
│  ├─ srt.py                 生成 out/subs.srt 字幕
│  ├─ cutout.py              角色立绘抠图脚本
│  ├─ build.sh               统一出片入口（render → mix → srt → loudnorm → 720p 预览）
│  └─ test/                  无浏览器 dryrun.mjs、times.mjs、sheet.py 等检查工具
├─ assets/                   项目自包含素材（不跨课程目录引用）
│  ├─ voice_ref/             Claude / GPT / 大肥鱼等参考音与 refs.json
│  ├─ characters/            cutout/ 抠图立绘差分
│  ├─ fonts/                 子集化 woff2 字体（SmileySans、LA-Serif、LA-Sans、LA-Latin）
│  ├─ music/                 BGM（bgm.mp3）与 LICENSE.txt
│  ├─ sfx/                   程序合成音效 wav
│  ├─ style_ref/             视觉参考图
│  └─ exam/                  期中真题高清裁切图
├─ ch01/ … ch05/             第 1–5 章正片工程，每章含各分段子目录（lines.py、scene.js、tex.json、math.json 等）
│                            （ch01/ 另含早期 p0_sample/、p1_preview/、trial/；ch03/–ch05/ 另有 common.js、_gen/；ch05/ 含 qc.txt）
├─ sp/                       特别篇公用组件（common.js）、原题裁切表（exam_crops.json）与讲稿/验算脚本（script/）
├─ spx/                      期中特别篇速成版工程（x0/–x8/、verify.py、_exp/ 等）
├─ sp1/ … sp7/               期中特别篇 1–7 工程（各集含 s1/–sN/ 分段；sp6/ 另有 kit.js）
├─ ae/                       After Effects 包装工程与脚本（spx_title.aep、sp_pack_build.js、out/spx_title.mp4）
├─ ep/                       单集包装合成脚本与章节元数据（ep_split.py / .json、sp_compose.py / .json、ep*_meta.txt、sp*_meta.txt、wm.png）
├─ covers/                   封面底图（art/）与合成脚本（make_covers.py、interim_art.py）
└─ tools/                    通用与发布工具
   ├─ gh_release.py          创建/更新 GitHub Releases 并幂等上传 1080p / 720p / 封面
   ├─ exam_crop.py           真题页面渲染与题干裁切
   ├─ qc_ch.py               整章成片时长、响度、停顿与语速质检
   ├─ sheet.py / smoke.mjs   联系表抽帧与冒烟检查
   ├─ sp_lines.py            特别篇台词辅助生成
   └─ host/                  宿主机批处理运行脚本
```

**仓库里没有的东西**（见 `.gitignore`）：
- `参考书籍和PPT/`：版权教材（Leon 第 9 版、同济第六版）、课件与期中真题原件。
- `**/out/`、`**/frames/`、`**/vo/`、`**/vo48/`、`**/vo_v1/`、`**/tex_cache.json`、`**/__pycache__/`、`node_modules/`、`*.log`：渲染输出与成片（统一发在 Releases，含 `out/gh_1080p/`）、生成的配音与 48 kHz 音频、TeX 路径缓存、依赖与运行日志。
- `pipeline/_from_calc/`：早期从微积分课拷入的参考实现。
- `assets/characters/raw/`、`assets/fonts/src/`、`.cache48/`：大体积生图原稿、源字体文件与 48 kHz 音频缓存。
- `ep/pack/`、`ep/chk/`、`ep/cct/`、`ep/*_progress.txt`、`ep/*_filter.txt`、`ep/*_list.txt`：单集包装与 ffmpeg concat 中间文件。
- `**/_sheets/`、`.DS_Store`、`Thumbs.db`：QA 联系表与系统临时文件。

## 制作与发布流程

以下以正片第 5 章某段 `ch05/s5_1a` 及第 5 集打包为例（在项目根目录执行，`$PY` 指向 GPT-SoVITS 环境 `python.exe`）：

```bash
# 1. 台词生成与配音前校验（发音审查、sympy 数学验算、TeX 路径缓存）
python ch05/s5_1a/lines.py
$PY pipeline/g2p_lint.py ch05/s5_1a
python pipeline/mathcheck.py ch05/s5_1a
node pipeline/tex_build.mjs ch05/s5_1a

# 2. 配音（先启动 GPT-SoVITS api_v2.py，端口 9880）、ASR 复核与音频预处理
$PY pipeline/tts.py ch05/s5_1a
python pipeline/asr.py ch05/s5_1a            # 独立 CPU 环境用 QA_DEVICE=cpu，输出 qa_asr.txt
$PY pipeline/prep.py ch05/s5_1a              # 转 48 kHz、调速、压停顿 → durations.json

# 3. 逐帧渲染、混音与封装（Playwright + Chrome → mix.py → srt.py → loudnorm -16 LUFS）
bash pipeline/build.sh ch05/s5_1a --jobs 3

# 4. AE 包装与单集合成（先由 After Effects 渲染片头/段落卡/片尾包装，再合成为单集 mp4）
python ep/ep_split.py 5                      # 正片第 1–5 集；特别篇 1–7 使用 python ep/sp_compose.py <1..7>

# 5. 生成双比例封面（在 covers/ 下执行，成品归档至 docs/covers/）
(cd covers && python make_covers.py ep05)

# 6. 上传 GitHub Releases（ep1–ep5 与 spx 的 1080p60 需先经 NVENC 压缩至 < 2 GiB 到 out/gh_1080p/）
python tools/gh_release.py ep5               # 支持 --skip-missing；省略 tag 时处理全部 13 个
```

主要依赖：GPT-SoVITS v2Pro、funasr + pypinyin（ASR）、sympy（数学验算）、FFmpeg、Node.js（`mathjax-full`）、uv + Playwright（Chrome）、Pillow（封面合成）、requests（Release 上传）、Adobe After Effects（包装渲染）。

## 素材与许可

- **角色形象与项目许可**：Claude、GPT、大肥鱼（DeepSeek 娘）角色形象源自社区同人作品（收录于 [shuaizenge/ai-girls](https://github.com/shuaizenge/ai-girls) 的 ZipZipPipe 等作者原作；其中 DeepSeek 娘设计采用 **CC BY-NC-SA 4.0**，其余原作作者说明允许非商用分享与再创作、无统一标准许可证），片中立绘在此基础上结合构成主义视觉规范衍生绘制。**本项目整体按非商用处理，成片按 CC BY-NC-SA 4.0 分享。**
- **配音、音效与音乐**：大肥鱼参考音来自 ModelScope `YinZilu/da-fei-yu-girl-voice-zh`（**CC BY-NC 4.0**）；Claude 与 GPT 参考音为平台 TTS 合成后经 GPT-SoVITS 本地克隆，不使用真人声优声音。BGM 为“Easy Lemon” Kevin MacLeod (incompetech.com)（**CC BY 4.0**），片尾署名；音效位于 `assets/sfx/`。
- **字体**：思源宋体（Noto Serif SC）、思源黑体（Noto Sans SC）、Noto Sans 与得意黑（Smiley Sans）均采用 **SIL OFL 1.1**，按项目实际用字子集化后以 woff2 形式内嵌于 `assets/fonts/`。
- **版权教材与真题**：Leon《Linear Algebra with Applications》第 9 版、同济《线性代数》第六版、课件与历年期中真题原件版权归各自权利人所有，仅作本地对照参考，置于 `.gitignore` 排除的 `参考书籍和PPT/` 中，**不入库**。
- **名称与商标声明**：Claude、GPT、DeepSeek 等名称与商标归各自权利人所有；片中为社区同人形象，不代表各 AI 厂商官方。
