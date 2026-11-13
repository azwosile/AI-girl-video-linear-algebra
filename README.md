# AI娘线性代数课

用 AI 娘角色讲线性代数的系列动画课，几何直觉参照 3Blue1Brown《Essence of Linear Algebra》。
主讲 **Claude**，辅讲 **GPT**，学生 **大肥鱼（DeepSeek 娘）**。

- **主教材**：Leon《Linear Algebra with Applications》第 9 版（`参考书籍和PPT/textbook/线性代数英文版(9版）.pdf`）
- **对照教材**：同济《线性代数》第六版与《学习辅导与习题全解》（Yoget/Tongji-University-Linear-algebra）
- **画面**：奶油纸底 + 构成主义三色平涂。Canvas 2D、three.js、MathJax 共用一条 `renderAt(t)` 时间轴
- **声音**：GPT-SoVITS 本地克隆，声线与微积分课一致
- **规格**：1920×1080 · 60 fps · 每段 5–10 分钟 · 一章分 P0…Pn

> 2026-11-13 重建：旧版已整体废弃，见 `docs/旧项目问题清单.md`。旧目录为 `../AI娘线性代数课_旧版废弃_20261113`（仅留档，新项目不引用其中任何文件）。

## 目录

```
AI娘线性代数课/
├─ README.md
├─ docs/                  技术栈 · 视觉规范 · 角色与配音 · 旧项目问题清单 · 决策记录
├─ engine/                全项目唯一一份渲染引擎（各段不复制，直接引用）
│  └─ vendor/             three.js、MathJax 等离线依赖（锁定版本）
├─ pipeline/              台词 → 配音 → ASR → prep → 渲染 → 混音 → 成片 的脚本
│  └─ _from_calc/         从微积分课拷来的参考实现（只读，按 docs/技术栈.md 重写后删除）
├─ assets/
│  ├─ voice_ref/          GPT-SoVITS 参考音（从 Git 课复制，自包含）
│  ├─ characters/         raw/ 生图原稿 · cutout/ 抠图分层
│  ├─ style_ref/          视觉参考图
│  ├─ fonts/ music/ sfx/
├─ ch01/ … ch07/          每章一个工程，内含 pN/ 分段
├─ tools/                 通用小工具（不允许堆一次性 _job_*.sh）
└─ 参考书籍和PPT/          教材、课件、期中真题（不进 git）
```

## 状态

| 阶段 | 状态 |
|---|---|
| 技术栈与视觉方向 | ✅ 已定（2026-11-13） |
| 引擎 POC（2D 网格变换 + 3D + TeX 变形） | ⏳ 下一步 |
| 角色构成主义立绘 | ⏳ |
| 第 1 章大纲 | ⏳ |
