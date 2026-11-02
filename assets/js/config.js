/* ============================================================
   全局配置 —— 改品牌名、导航、学期等只需要动这一个文件
   所有页面与外壳组件都读 window.APP_CONFIG
   ============================================================ */

window.APP_CONFIG = {

  /* ---------- 品牌 ---------- */
  brand: {
    // 改这一行即可全站改名（外壳会读取 name 与 sub）
    name: '高校智能学习平台',
    sub: 'LEARNING WORKBENCH',
    // 侧边栏方块标记里的字，两个字以内
    mark: '学'
  },

  version: 'v0.9 · 原型',

  /* ---------- 一级导航 ----------
     href 为空的表示该页原型尚未交付，点击给提示
     顶栏用户区点击直接进个人中心，没有下拉菜单
     （「消息与通知」不占一级菜单，走顶栏铃铛）           */
  nav: [
    { key: 'home',     label: '学习工作台',   icon: 'grid',     href: 'home.html' },
    { key: 'tasks',    label: '课程与任务',   icon: 'list',     href: 'tasks.html' },
    { key: 'schedule', label: '日程',         icon: 'calendar', href: 'schedule.html' },
    { key: 'plan',     label: 'AI 学习规划',  icon: 'sparkle',  href: 'ai-plan.html' },
    { key: 'library',  label: '学习资料库',   icon: 'book',     href: 'library.html' },
    { key: 'profile',  label: '个人中心',     icon: 'user',     href: 'profile.html' }
  ],

  navFoot: { key: 'admin', label: '系统管理', icon: 'setting', href: 'admin.html' },

  /* ---------- 学期（演示数据） ---------- */
  term: {
    id: 1,
    name: '2026-2027 学年 第一学期',
    // 第 1 周周一
    startDate: '2026-08-31',
    totalWeeks: 20
  },

  termOptions: [
    { label: '2026-2027 学年 第一学期', value: 1 },
    { label: '2025-2026 学年 第二学期', value: 2 }
  ],

  /* ---------- 演示账号 ---------- */
  demoUser: {
    name: '张三',
    /* 顶栏只显示脱敏学号：教室投影、宿舍共用电脑上不该裸奔 */
    studentId: '2026210001',
    studentIdMasked: '2026****01',
    nickname: '小张',
    college: '计算机科学与技术学院',
    major: '计算机科学与技术'
  },

  /* 未读数不在这里配。它由 mock.js 的 NotifyStore.unreadCount() 算，
     只有没引 mock.js 的页面（交付清单）才拿不到，那种页面也不该有角标。 */
};
