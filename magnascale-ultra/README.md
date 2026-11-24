# Bay 21 · MagnaScale Ultra L
采用 Codex `deck-demo/assets/template.html` 生成，共 21 幕。页面内容、CSS、SVG 与 JavaScript 内联于 `index.html`，保留站点公共门禁与图标引用。

## 内容来源
原始文件在 `/Users/dan/ntap-docs/wiki-docs/Ultra-L/`，正文与讲者备注均已提取核对，原始资料未复制到站点。
- A：《【外部使用】【产品介绍】联想分布式存储MagnaScale Ultra 介绍 v1.2.pptx》，39 页。
- B：《MagnaScale Ultra L版本产品介绍20260410.pptx》，20 页。
- C：《MagnaScale UltraL 版本软件培训.pptx》，25 页。
- D：《MagnaScale Ultra(L) 技术白皮书 V5.0.pdf》（2025-03），66 页；页码按正文页。用于纠删码级别与容错规则、重建、目录级冗余、配额 / QoS / 生命周期、块与容器接口、GDS。
每幕底部列对应页码；内部备注不展示。资料时间为 2026 年 4 月前后，非当前版本发布公告。

## 演示边界
- 150 / 90 GB/s 为源资料单节点读 / 写观测值，缺少完整测试条件，不是性能承诺。
- 不采用招标指标作为已验证规格，不将 Roadmap / TBD GA 当作已发布功能。
- 纠删码级别（N = 2/4/8/16，M = 1–4，最高约 94%）与「节点数 ≥ N+M 为节点级、否则为磁盘级」规则取自白皮书 D；分片轮转放置为示意。容量预留比例为可调示例，计算非产品 Sizing。
- LiSA 为独立平台，历史 DXN / CXN 案例不作为 Ultra L 同配置性能证明。
- 讲解视频 `ultra-deep.mp4`：2026-11-03 按 21 幕新版页面重写旁白（19 段）并整条换用 Ava（en-US-AvaMultilingualNeural，+8%），约 7 分 06 秒；旧晓晓版稿子、配音与动画源备份在 `teaser/archive-xiaoxiao/`。
- 2026-11-03：正文中的「示意 / 不代表」类说明收拢到脚注与末幕；各幕补白皮书规格卡片；重画第 7、8、9 幕图示（前端 / 后端切片传输量、TCP / RDMA / GDS 拷贝路径、NEST 请求次数）；新增第 19 幕「产品组合」，验证清单与价值顺延为第 20、21 幕。

## 维护与预览
沿用模板的章节导航、横向滑轨、滚轮 / 键盘 / 触屏与圆点。data-sec 连续排列，data-jump 从 0 计数。
从仓库根目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，访问 `http://127.0.0.1:8765/magnascale-ultra/`。
通过公共门禁正常访问；保留 `#scene-N` 章节链接。

视频源文件、配音与时间轴在已忽略的 `teaser/` 目录，使用已迁移的 demo-video 工具链。
