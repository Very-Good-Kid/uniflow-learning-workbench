# 高校智能学习工作台 · 界面层静态交互原型

为「高校智能学习工作台」后端项目（Vue 3 + Cordis + MySQL，见交接文档）配套做的**界面层静态交互原型**。它不含任何真实后端：数据全部来自本地 mock，用来在写代码之前把页面结构、交互流程和状态细节定下来，开发照着实现即可。

## 在线访问

- GitHub Pages：<https://very-good-kid.github.io/uniflow-learning-workbench/>（入口为交付清单页 index.html）
- 备用链接（WorkBuddy 托管，临时）：<https://uniflow-prototype.app.workbuddy.host/?sharecode=CNASW56UXD>

## 怎么跑

纯静态、零构建、不依赖任何 CDN。两种方式任选：

1. 直接双击任意 `*.html`，浏览器本地打开；
2. 或者起个本地服务（推荐，体验和线上一致）：

```bash
python -m http.server 8080
# 访问 http://localhost:8080
```

## 页面清单

| 文件 | 页面 | 说明 |
|---|---|---|
| `index.html` | 交付清单 | 全部页面的导航入口，含批次与对应交接文档章节 |
| `home.html` | 学习工作台（首页） | 概览四格 / 今日安排 / 待办快速完成 / AI 规划入口 |
| `tasks.html` | 课程与任务 | 两行筛选、批量操作、详情·编辑·新建抽屉，支持 `?id=`、`?new=1` 深链接 |
| `schedule.html` | 日程 | 七列周视图，真实钟点 7:00–23:00，冲突检测，点空白格新建，支持 `?date=` / `?event=` / `?course=` |
| `ai-plan.html` | AI 学习规划 | 左对话 + 右候选计划，文本入口 + 意图识别，确认后写回日程 |
| `library.html` | 学习资料库 | 列表 / 卡片流双视图，课程筛选卡带，详情抽屉，支持 `?q=` |
| `messages.html` | 消息与通知 | 顶栏铃铛对应的完整页面 |
| `profile.html` | 个人中心 | 含可用时间设置（周视图格子勾选） |
| `admin.html` | 系统管理 | 面向管理员视角的管理页 |

所有页面共用侧边栏 7 项导航与顶栏；顶栏支持 **Ctrl+K 全局搜索**（搜任务、资料、日程、课程、消息五类对象，支持「高数 / 计网」等课程简称）。

## 目录结构

```
├── index.html              交付清单（入口）
├── home / tasks / schedule / ai-plan / library / messages / profile / admin .html
└── assets/
    ├── css/app.css         设计令牌 + 全部布局样式
    ├── js/config.js        品牌、导航、学期、演示账号配置
    ├── js/mock.js          演示数据（字段对齐 backend/src/models/index.ts）
    ├── js/shell.js         外壳组件、图标库、mountApp()
    ├── js/search.js        顶栏全局搜索（数据层 + 面板组件）
    └── vendor/             Vue 3.4.38 + TDesign Vue Next 1.20.10（本地 UMD）
```

## 设计与实现约定

以下约定是原型阶段反复打磨后定下来的，开发实现时请保持一致：

- **配色为学术绿体系**：主色 `#006D5B`，全部令牌只在 `app.css` 的 `:root` 定义一次（`--brand-*` / `--warm*` / `--indigo*` / `--alert*`），并已接线 TDesign 主题变量。
- **日程块只编码「能不能动」**：课程 = 实心深绿底白字（来自教务，不可改）；自己添加 / AI 已确认 = 灰底（可改可删）；待确认 = 白底虚线（未生效）。类型差异只用块左侧 3px 色条暗示（学习时段靛蓝 / 个人琥珀 / 考试赭红）。
- **品牌名集中配置**：改名只动 `assets/js/config.js` 的 `brand.name`，禁止逐页替换。
- **mock 字段对齐后端模型**：`mock.js` 的字段名与 `backend/src/models/index.ts` 保持一致，接接口时不需要二次映射。
- **演示态用 sessionStorage 持久化**：任务走 `window.Store`，日程走 `window.EventStore`（同标签页跨页面共享，关标签页复位）。修改数据必须通过 `commit()` 写回，直接改 `MOCK.tasks` / `MOCK.events` 不会触发界面更新。
- **学期演示口径**：2026–2027 学年第一学期第 12 周（11/16–11/22），「今天」为 11/18 周三。页面里所有统计数字由 mock 数据实时计算，未写死。
- **AI 规划页的文本是唯一入口**：抽屉与按钮只负责把结构化选择翻译成一句话塞进输入框，统一走同一个 `send()`；排学习时段前会先扣除该任务已排时长，避免重复排期。
- **周末保留**：课表默认显示周末列，可用时间可勾选周末，规划器允许把学习时段排到周末。

## 状态说明

本原型为高保真交互演示：mock 数据 + 状态变化 + 弹窗 / 抽屉 / Toast 均可操作，但所有数据不落库、刷新（或关闭标签页）后演示态复位。具体到接口的改造方案见《高校智能学习工作台开发交接文档》。
