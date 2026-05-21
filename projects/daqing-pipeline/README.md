# DaQin Pipeline Dashboard Pro

这是根据 `DaQin Pipeline Dashboard — 产品设计文档` 重构后的离线单文件仪表盘。

## 直接使用

双击打开 `index.html` 即可。它是纯前端单文件 HTML：

- 无后端依赖
- 无外部 JS / CSS / CDN
- 不联网
- 数据通过粘贴或文件导入
- Scholar Notes、收藏、审核结果、设置使用浏览器 `localStorage` 持久化

## 已实现模块

1. Dashboard：粘贴/导入 `certification_report.json`，显示 rating、blockers、warnings、四维完成度。
2. Evidence Browser：导入 `evidence_ledger.jsonl`，支持 source/entity/keyword 过滤、分页、详情、收藏、插入笔记。
3. Review Queue：作为 Evidence Browser 子标签，导入 `evidence_review_queue.jsonl`，支持批准/拒绝/存疑，批准满 30 条显示可提交。
4. Scholar Notes：新建、删除、标签、Markdown 实时预览、插入证据、导出 Markdown/JSON、刷新持久化。
5. Format Checker：检测空泛表达、古籍引用缺卷篇、注释体系混用、段落过长、书名号嵌套风险、观点缺出处。
6. Quick Actions：五个流水线命令速查和复制。
7. Settings：路径配置、目标阈值、本地数据概览、工作区导入/导出。

## 样例文件

`sample/` 目录提供：

- `certification_report.sample.json`
- `evidence_ledger.sample.jsonl`
- `evidence_review_queue.sample.jsonl`
- `thesis_sample.md`

## 推荐给 OpenClaw 的落地方式

把 `index.html` 放到 DaQin 项目根目录，或放入静态托管目录。浏览器打开后：

1. Dashboard 导入 `reports/certification_report.json`
2. Evidence Browser 导入 `data/evidence_ledger.jsonl`
3. Review Queue 导入审核队列 JSONL
4. Notes 日常记录读书笔记和证据摘录
5. Format Checker 粘贴论文 Markdown 做初筛

## 注意

浏览器安全机制不允许本地 HTML 直接读取 `C:\Users\...` 文件路径，也不能直接执行命令。因此 Quick Actions 只提供命令复制，不会假装执行本地命令。
