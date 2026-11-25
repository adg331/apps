# NetApp × Neocloud 合作与案例汇总（2026-11）

信息时点：2026-11-25

## 结论

截至 2026-11-25，公开可查、和 NetApp Novus 明确挂钩的 neocloud 只有两家：宣布计划采用的 Nebul，以及在 INSIGHT 2026 同台的 Lambda。emma 是基于 ONTAP 的主权 AI 联合方案，不涉及 Novus。三者都没有公开写明“已部署 / 已投产”。

- Nebul（荷兰）：2026-11-10 宣布计划采用 Novus，自称“第一家采用 Novus 的 neocloud”。
- Lambda（美国）：2026-09-30 INSIGHT 第二天主题演讲同台，称双方在合作为 1 万卡以上的集群提供存储。没有独立新闻稿。
- emma（卢森堡）：2026-10/11 宣布与 NetApp 战略合作，数据层是 ONTAP（文件 + 对象），面向欧洲主权 AI。
- Novus 定位：面向 AI 工厂、neocloud 和 GPU 即服务商；聚合吞吐最高 100 TB/s，可支撑约 5 万张 GPU。

## 案例总表

按时间倒序。“可信度”指来源层级：官方新闻稿 > 官方演讲/财报 > 媒体转述。

| 时间 | 对象 | 类型 | NetApp 产品 | 公开状态 | 可信度 |
| --- | --- | --- | --- | --- | --- |
| 2026-11-10 | [Nebul](https://www.itpro.com/cloud/cloud-computing/netapp-secures-another-neocloud-customer-for-its-novus-service)（荷兰莱顿） | 欧洲主权 AI neocloud | Novus | 宣布计划采用，“will underpin expansion” | 官方新闻稿 |
| 2026-10～11 | [emma](https://www.storagenewsletter.com/2026/11/02/netapp-and-emma-technologies-collaborate-to-deliver-sovereign-ai-to-european-enterprises/)（卢森堡） | 云中立 neocloud，自有欧洲机房 GPU | ONTAP（文件 + 对象） | 战略合作，未写上市时间 | 官方稿转载 |
| 2026-10-06 | Open Innovation AI（阿联酋） | 主权 AI 平台，非典型 neocloud | 未确认 | 探索性技术合作 | 仅搜索摘要 |
| 2026-09-30 | [Lambda](https://www.itpro.com/cloud/live/netapp-insight-2026-live-all-the-news-updates-and-announcements-from-las-vegas)（美国） | GPU 云 neocloud | Novus | 同台演讲，“working together to provide storage” | 官方演讲（媒体转述） |
| FY26 Q4 财报 | 未具名“美国前五 neocloud” | GPU 云 neocloud | 未公开 | 已签大单 | 财报电话会 |

## 逐条详情

### Nebul × Novus（2026-11-10，SC26 期间）

- Nebul：2022 年成立，总部荷兰莱顿，在做主权 AI 平台 Intelligent Cloud。
- 内容：Novus 将支撑 Intelligent Cloud 的扩展；因为基于 ONTAP，现有 NetApp 客户的数据可延伸进主权云。
- 措辞：新闻稿“exploring opportunities”；ITPro“unveiled plans to adopt”、“will underpin expansion”。没有上线日期、GPU 数量或机房位置。
- 引语：Nebul 创始人兼 CEO Arnold Juffer“We are proud to be the first neocloud to adopt this technology.” NetApp EMEA 和拉美区高级副总裁 Willem Hendrickx 强调受监管行业对合规、安全和多租户的要求。
- NetApp 官网已有 Nebul 多语种客户案例页（/customers/nebul/）。
- 第三方博客称 Nebul 同时在用 ONTAP、VAST Data 和 DDN Infinia，非官方来源。

### Lambda × Novus（2026-09-30，INSIGHT 2026 第二天主题演讲）

- 同台：NetApp 首席平台与技术官 Arindam Banerjee，Lambda 云服务总裁 David Ward，环节主题是“Novus 现在在真实环境里怎么用”。
- Ward 原话：“Lambda and NetApp have been working together to provide storage for that environment, and it's one of the first of its kind.”
- ITPro 转述：双方合作向一家未具名客户交付一套 1 万张以上 GPU 的 superintelligence 集群；Lambda 正把服务扩展到存储。
- 未搜到 NetApp 或 Lambda 为此发的独立新闻稿。

### emma × ONTAP（StorageNewsletter 2026-11-02 转载）

- emma：全称 Emma Technologies，总部卢森堡，官网 emma.ms；云中立平台，自有欧洲机房 GPU。未公开机房数量和 GPU 规模。
- 分工：NetApp 用 ONTAP 在同一架构里提供文件和对象存储，服务 emma 的多租户 AI 环境；emma 提供 GPU 算力和云平台。负载可跑在公有云、emma 机房或自建环境。
- 未提 Novus、AFX、StorageGRID、AI Data Engine。
- 措辞：“strategic collaboration”、“joint solution”。原文没有“joint venture”，ITPro 写成合资不准确。
- 引语：emma 创始人兼 CEO Dmitry Panenkov“With NetApp, we can give them a clear answer.” Willem Hendrickx“European enterprises should never have to choose between AI innovation and data sovereignty.”

### 未具名美国前五 neocloud（FY26 Q4 财报电话会）

- CEO George Kurian 提到拿下一家“美国前五大 neocloud”大单，未公开名称。可能是 Lambda，未证实。

### Open Innovation AI（2026-10-06，AI Everything Abu Dhabi）

- 阿联酋公司，与 NetApp 做主权 AI 基础设施的探索性技术合作，覆盖训练、推理和智能体负载。仅有搜索摘要，原文未读。

## NetApp Novus 产品要点

Novus 于 2026-09-29 在 INSIGHT 2026 发布，是元数据与数据分离的 ONTAP 架构，官方称已可订购。

| 项目 | 要点 |
| --- | --- |
| 定位 | 面向运行 AI 工厂的组织，如 neocloud 和 GPU 即服务商 |
| 吞吐 | 聚合最高 100 TB/s，可支撑约 5 万张 GPU |
| 规模 | ZB 级文件系统，有效容量数十 EB |
| 架构 | 元数据层 Lattice（分片 KV 存储，随文件数扩展）；GPU 客户端直接读写底层存储，不经过控制器转发（pNFS） |
| 首发硬件 | 元数据跑在认证的 Supermicro 服务器，数据层是跑 ONTAP 的 AFF A90 |
| 能耗 | 比其他 NFS 方案最多省电 31%（NetApp 产品管理副总裁 Gunna Marripudi） |
| 部署形态 | 将扩展到传统一体机之外的部署模式 |
| 合作方 | NVIDIA 是主要合作伙伴；NetApp 宣布收购 PEAK:AIO 以加强元数据技术（2026-11-02 已完成） |

常用话术（均为 NetApp 自己的说法）：

- 传统架构下 GPU 利用率可能低于 30%。
- 5 万卡集群需要 100 TB/s 累计带宽；过去的集群一般在 1 万卡左右。
- Kurian：“The first zettabyte-scale file system on the planet. Let that sink in”；把去年全球出货的数据中心容量（约 2,000 EB）统一进一个命名空间。

## 相关发布

| 时间 | 发布 | 要点 |
| --- | --- | --- |
| 2026-09-30 | Supermicro 战略合作 | 联合验证 AI 基础设施，目标客户包括 AI 工厂、企业、neocloud 和主权 AI（仅搜索摘要） |
| 2026-09-29 | [Keystone Sovereign](https://www.itpro.com/cloud/cloud-storage/netapp-eyes-data-sovereignty-gains-with-new-keystone-service) | Keystone 存储即服务的主权版。客户自选硬件放本地或托管机房；元数据跑在 NetApp 托管的欧洲主权云，支持全部在欧洲本地。先在欧洲经济区逐国推出，德国、法国最早，英国也在首批；日本、韩国大概 2027 年跟进 |
| 2026-09-29 | AI Data Engine（AIDE）更新 | 支持跨任意环境和存储架构的异构数据发现；客户可免费做 6 个月数据映射 |

Keystone 副总裁兼总经理 Ivan Iannaccone：“Sovereignty isn't just about control of your data, but is [also about] operational control.” 他估计明年主权云支出约 300 亿美元（本人估计）。

## 引用口径与注意事项

对外引用时，状态一律按原文最保守的说法写。

| 对象 | 建议写法 | 避免写法 | 原因 |
| --- | --- | --- | --- |
| Nebul | “宣布采用 Novus” | “已部署”“已上线” | 新闻稿为 exploring / will underpin，无上线日期 |
| Nebul | “首批采用 Novus 的 neocloud 之一” | “第一家” | ITPro 标题称“another”、正文称“the latest”；Lambda 9 月已同台 |
| Lambda | “在 INSIGHT 2026 上介绍与 NetApp 合作的 Novus 实践” | “Lambda 客户案例”“已投产” | 无独立新闻稿，媒体转述未写部署状态 |
| emma | “基于 ONTAP 的主权 AI 联合方案” | “Novus 客户”“合资公司” | 原稿未提 Novus，也无 joint venture 字样 |
| 美国前五 neocloud | “NetApp 称拿下一家美国前五 neocloud” | 点名 Lambda 或其他公司 | 未公开客户名 |
| Novus 性能 | “NetApp 称最高 100 TB/s” | 把数字写成实测结果 | 均为厂商口径；ITPro 偶有“Tbps”笔误 |

其他：还没找到 NetApp 与 CoreWeave、Nebius、Crusoe、Nscale 的公开合作或案例。

## 待跟进

- [ ] Q2 FY2027（2026-08～10 月）财报 2026-12-01 盘后发布：看电话会是否点名 Novus / neocloud 客户
- [ ] 读 Nebul 新闻稿原文（netapp.com 对自动抓取返回 403，需手动打开）
- [ ] 读 2026-06-25 NetApp × SK Telecom 新闻稿正文，判断是否算 neocloud 案例
- [ ] 查 Lambda 是否有独立公告或客户案例页
- [ ] 读 Open Innovation AI 合作原文，确认涉及的 NetApp 产品

## 来源

已读全文：

- [ITPro：NetApp Insight 2026 live](https://www.itpro.com/cloud/live/netapp-insight-2026-live-all-the-news-updates-and-announcements-from-las-vegas)
- [ITPro：NetApp Novus 发布](https://www.itpro.com/infrastructure/the-first-zettabyte-scale-file-system-on-the-planet-let-that-sink-in-netapp-novus-has-ai-factory-bottlenecks-in-the-crosshairs)
- [ITPro：Keystone Sovereign](https://www.itpro.com/cloud/cloud-storage/netapp-eyes-data-sovereignty-gains-with-new-keystone-service)
- [ITPro：NetApp secures another neocloud customer for its Novus service](https://www.itpro.com/cloud/cloud-computing/netapp-secures-another-neocloud-customer-for-its-novus-service)
- [StorageNewsletter：NetApp and Emma Technologies Collaborate…](https://www.storagenewsletter.com/2026/11/02/netapp-and-emma-technologies-collaborate-to-deliver-sovereign-ai-to-european-enterprises/)

仅搜索摘要（未读全文或无法访问）：

- [NetApp 新闻稿：Nebul Adopts NetApp Novus](https://www.netapp.com/newsroom/press-releases/news-rel-20261110-964363/)（403）
- [NetApp 新闻稿 2026-06-25](https://www.netapp.com/newsroom/press-releases/news-rel-20260625-215359/)（403）
- [NetApp 新闻稿：Novus 发布](https://www.netapp.com/newsroom/press-releases/news-rel-20260929-745367/)
- [NetApp FY26 Q4 财报电话会记录](https://s21.q4cdn.com/371534297/files/doc_financials/2026/q4/NTAP-Q4-and-FY2026-Earnings-Transcript.pdf)
- [StorageNewsletter：NetApp × Supermicro](https://www.storagenewsletter.com/2026/09/30/netapp-insight-2026-netapp-and-supermicro-collaborate-to-power-ai-at-any-scale/)
- [StorageReview：Novus pNFS + AFF A90](https://www.storagereview.com/news/netapp-novus-pnfs-metadata-aff-a90-data-nodes-100-tb-s-ai-factory)
- [Futurum：Novus 与 PEAK:AIO](https://futurumgroup.com/insights/netapp-novus-peakaio-and-netapps-two-market-ai-strategy/)
- [WAM：Open Innovation AI × NetApp](https://www.wam.ae/en/article/c2lun1f-open-innovation-and-netapp-announce-collaboration)
- [第三方博客：DDN joins NetApp and VAST Data at Nebul](https://netapp-blackbox.pages.dev/news/2026-10-22-ddn-joins-netapp-and-vast-data-at-dutch-neocloud/)
