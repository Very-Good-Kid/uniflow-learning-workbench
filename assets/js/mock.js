/* ============================================================
   演示数据 —— 字段名与后端 models 对齐，方便开发照原型接接口
   course          : backend/src/models/index.ts → course
   task            : → task
   study_session   : → study_session
   schedule_event  : → schedule_event
   原型用 date + start/end 表示时间，真实接口返回 start_at / end_at
   ============================================================ */

window.MOCK = {

  /* 演示当天的日期（第 12 周周三），课程表用「今天」高亮这一列 */
  today: '2026-11-18',

  /* ---------- 课程（course 表） ---------- */
  courses: [
    { id: 1,  name: '高等数学',       teacher: '李明华', classroom: '教1-201', weekday: 1, start_time: '08:00', end_time: '09:40', start_week: 1,  end_week: 16, credit: 5 },
    { id: 2,  name: '高等数学',       teacher: '李明华', classroom: '教1-201', weekday: 3, start_time: '08:00', end_time: '09:40', start_week: 1,  end_week: 16, credit: 5 },
    { id: 3,  name: '数据结构',       teacher: '王振宇', classroom: '教2-203', weekday: 2, start_time: '10:00', end_time: '11:40', start_week: 1,  end_week: 16, credit: 4 },
    { id: 4,  name: '计算机网络',     teacher: '陈静',   classroom: '教3-102', weekday: 4, start_time: '10:00', end_time: '11:40', start_week: 1,  end_week: 16, credit: 4 },
    { id: 5,  name: '大学英语',       teacher: '周敏',   classroom: '教3-101', weekday: 1, start_time: '14:00', end_time: '15:40', start_week: 1,  end_week: 16, credit: 3 },
    { id: 6,  name: '操作系统',       teacher: '刘峰',   classroom: '教1-305', weekday: 2, start_time: '16:00', end_time: '17:40', start_week: 1,  end_week: 16, credit: 4 },
    { id: 7,  name: '数据库实验',     teacher: '赵慧',   classroom: '机房B1',  weekday: 5, start_time: '14:00', end_time: '15:40', start_week: 3,  end_week: 17, credit: 1 },
    { id: 8,  name: '大学物理',       teacher: '孙立',   classroom: '教2-105', weekday: 4, start_time: '14:00', end_time: '15:40', start_week: 1,  end_week: 16, credit: 4 },
    { id: 9,  name: '体育（羽毛球）', teacher: '杨涛',   classroom: '体育馆',  weekday: 3, start_time: '16:00', end_time: '17:40', start_week: 1,  end_week: 16, credit: 1 },
    /* 第 8 周已结课，用来验证周次过滤：第 12 周不应出现 */
    { id: 10, name: '形势与政策',     teacher: '何蕾',   classroom: '教4-201', weekday: 5, start_time: '08:00', end_time: '09:40', start_week: 1,  end_week: 8,  credit: 1 }
  ],

  /* ---------- 统一任务（task 表） ----------
     字段对齐交接文档阶段 1：source / source_type / course_id / due_at /
     estimated_minutes / priority / status / user_modified
     原型把 due_at 拆成 date + due 两个字段，方便拼展示    */
  tasks: [
    { id: 1,  source: 'platform', source_type: 'assignment', title: '高等数学作业',           course_id: 1, course_name: '高等数学',
      description: '第五章第一节课后习题 1–12 题，写到作业本上拍照提交。',
      date: '2026-11-19', due: '23:59', estimated_minutes: 60,  priority: 4, status: 'pending',
      estimate_source: 'ai',   user_modified: false, created_at: '2026-11-16 09:12' },

    { id: 2,  source: 'platform', source_type: 'assignment', title: '数据结构实验报告',       course_id: 3, course_name: '数据结构',
      description: '二叉排序树的插入、删除与遍历，实验报告按模板写，附运行截图。',
      date: '2026-11-22', due: '23:59', estimated_minutes: 180, priority: 5, status: 'in_progress',
      estimate_source: 'ai',   user_modified: false, created_at: '2026-11-15 20:03' },

    { id: 3,  source: 'manual',   source_type: 'project',    title: '计算机网络实验',         course_id: 4, course_name: '计算机网络',
      description: '用 Wireshark 抓一次 TCP 三次握手，整理时序图。',
      date: '2026-11-23', due: '23:59', estimated_minutes: 90,  priority: 3, status: 'pending',
      estimate_source: 'user', user_modified: true,  created_at: '2026-11-14 16:20' },

    { id: 4,  source: 'manual',   source_type: 'review',     title: '高数习题（第三章）',     course_id: 1, course_name: '高等数学',
      description: '导数与微分这一章的计算题，期中考前必须刷完。',
      date: '2026-11-21', due: '23:59', estimated_minutes: 120, priority: 4, status: 'pending',
      estimate_source: 'user', user_modified: true,  created_at: '2026-11-13 21:40' },

    { id: 5,  source: 'import',   source_type: 'reading',    title: '英语六级词汇',           course_id: 5, course_name: '大学英语',
      description: '从词表软件导出的 600 个待背词，按批次过。',
      date: '2026-11-28', due: '23:59', estimated_minutes: 180, priority: 2, status: 'pending',
      estimate_source: 'ai',   user_modified: false, created_at: '2026-11-10 07:30' },

    { id: 6,  source: 'platform', source_type: 'assignment', title: '操作系统 第三章习题',    course_id: 6, course_name: '操作系统',
      description: '进程调度算法相关习题，第 3、5、8 题必做。',
      date: '2026-11-20', due: '23:59', estimated_minutes: 45,  priority: 3, status: 'pending',
      estimate_source: 'ai',   user_modified: false, created_at: '2026-11-17 10:05' },

    { id: 7,  source: 'manual',   source_type: 'review',     title: '大学物理 期中复习',      course_id: 8, course_name: '大学物理',
      description: '波动光学和刚体转动两块，重点看老师画线的例题。',
      date: '2026-11-20', due: '18:00', estimated_minutes: 150, priority: 5, status: 'pending',
      estimate_source: 'user', user_modified: true,  created_at: '2026-11-12 19:22' },

    { id: 8,  source: 'platform', source_type: 'assignment', title: '数据库实验 预习报告',    course_id: 7, course_name: '数据库实验',
      description: '实验四之前要交的预习报告，写清楚 ER 设计和建表语句。',
      date: '2026-11-24', due: '23:59', estimated_minutes: 60,  priority: 2, status: 'pending',
      estimate_source: 'ai',   user_modified: false, created_at: '2026-11-17 15:48' },

    /* 没有截止时间的任务：接口允许进计划，但界面必须明确提示 */
    { id: 9,  source: 'manual',   source_type: 'project',    title: '课程设计选题调研',       course_id: null, course_name: '',
      description: '期末课程设计还没定题，先看看往届题目再定方向。',
      date: null, due: null, estimated_minutes: 240, priority: 3, status: 'pending',
      estimate_source: 'user', user_modified: true,  created_at: '2026-11-11 14:00' },

    /* 已完成 / 已取消，用来验证状态筛选与统计口径 */
    { id: 10, source: 'platform', source_type: 'assignment', title: '高等数学作业（第十一周）', course_id: 1, course_name: '高等数学',
      description: '第四章课后习题，已提交。',
      date: '2026-11-12', due: '23:59', estimated_minutes: 60,  priority: 4, status: 'completed',
      estimate_source: 'ai',   user_modified: false, created_at: '2026-11-09 08:50' },

    { id: 11, source: 'import',   source_type: 'reading',    title: '计算机网络 课后阅读',    course_id: 4, course_name: '计算机网络',
      description: '教材第 5 章拓展阅读，老师说不考，先取消。',
      date: '2026-11-25', due: '23:59', estimated_minutes: 40,  priority: 1, status: 'cancelled',
      estimate_source: 'user', user_modified: true,  created_at: '2026-11-08 11:11' }
  ],

  /* ---------- 学习时段（study_session，已确认的会生成 schedule_event） ----------
     status 取 proposed | confirmed | started | completed | skipped | cancelled
     11-16、11-17 两段已经过去，标 completed，首页的「已投入」按它算  */
  sessions: [
    { id: 1, plan_id: 3, task_id: 1, date: '2026-11-16', start: '19:00', end: '20:00', status: 'completed', created_by: 'ai',  locked: false },
    { id: 2, plan_id: 3, task_id: 2, date: '2026-11-17', start: '19:00', end: '20:40', status: 'completed', created_by: 'ai',  locked: false },
    { id: 3, plan_id: 3, task_id: 5, date: '2026-11-18', start: '19:00', end: '20:00', status: 'confirmed', created_by: 'user', locked: true  },
    { id: 4, plan_id: 3, task_id: 3, date: '2026-11-19', start: '19:00', end: '20:00', status: 'confirmed', created_by: 'ai',  locked: false },
    { id: 5, plan_id: 3, task_id: 4, date: '2026-11-20', start: '19:00', end: '20:40', status: 'confirmed', created_by: 'ai',  locked: false },
    { id: 6, plan_id: 3, task_id: 2, date: '2026-11-21', start: '10:00', end: '11:30', status: 'confirmed', created_by: 'ai',  locked: false },
    /* 候选：计划未确认，不生成正式日程，课表里用虚线圈出 */
    { id: 7, plan_id: 5, task_id: 5, date: '2026-11-21', start: '14:00', end: '15:30', status: 'proposed', created_by: 'ai', locked: false },
    { id: 8, plan_id: 5, task_id: 3, date: '2026-11-22', start: '10:00', end: '11:30', status: 'proposed', created_by: 'ai', locked: false }
  ],

  /* ---------- 日程事件（schedule_event 表，不含课程，课程单独取 course） ---------- */
  events: [
    { id: 11, event_type: 'study',    session_id: 1, task_id: 1, title: '',               date: '2026-11-16', start: '19:00', end: '20:00', location: '图书馆 3F',      is_fixed: true,  source: 'plan', status: 'active' },
    { id: 12, event_type: 'study',    session_id: 2, task_id: 2, title: '',               date: '2026-11-17', start: '19:00', end: '20:40', location: '图书馆 3F',      is_fixed: true,  source: 'plan', status: 'active' },
    { id: 13, event_type: 'study',    session_id: 3, task_id: 5, title: '',               date: '2026-11-18', start: '19:00', end: '20:00', location: '宿舍',           is_fixed: true,  source: 'plan', status: 'active' },
    { id: 14, event_type: 'study',    session_id: 4, task_id: 3, title: '',               date: '2026-11-19', start: '19:00', end: '20:00', location: '图书馆 2F',      is_fixed: true,  source: 'plan', status: 'active' },
    { id: 15, event_type: 'study',    session_id: 5, task_id: 4, title: '',               date: '2026-11-20', start: '19:00', end: '20:40', location: '图书馆 3F',      is_fixed: true,  source: 'plan', status: 'active' },
    { id: 16, event_type: 'study',    session_id: 6, task_id: 2, title: '',               date: '2026-11-21', start: '10:00', end: '11:30', location: '图书馆 3F',      is_fixed: true,  source: 'plan', status: 'active' },
    { id: 17, event_type: 'personal', session_id: null, task_id: null, title: '社团例会',        date: '2026-11-17', start: '12:00', end: '13:00', location: '学生活动中心302', is_fixed: false, source: 'user', status: 'active' },
    { id: 18, event_type: 'personal', session_id: null, task_id: null, title: '导师答疑',        date: '2026-11-18', start: '12:30', end: '13:30', location: '信科楼 A305',    is_fixed: false, source: 'user', status: 'active' },
    /* 与 11-20 19:00 的学习时段重叠，用来演示冲突状态 */
    { id: 19, event_type: 'exam',     session_id: null, task_id: null, title: '大学物理 期中考试', date: '2026-11-20', start: '19:00', end: '20:40', location: '教2-105',     is_fixed: true,  source: 'user', status: 'active' }
  ],

  /* ---------- 计划（study_plan 表） ---------- */
  plans: [
    { id: 3, title: '第 12 周学习计划', status: 'confirmed', source: 'ai', version: 2, confirmed_at: '2026-11-15 21:04' },
    { id: 5, title: '周末补排（待确认）', status: 'proposed', source: 'ai', version: 1, confirmed_at: null }
  ],

  /* ---------- 资料（resource 表） ----------
     字段按交接文档阶段 5 定：id、title、course_id、course_name、
     category、ext、size(KB)、updated_at、uploaded_by、download_count。
     放在这里而不是资料库页里，是因为顶栏全局搜索也要读它。
     cover_h 只服务卡片流的瀑布流错落，真实接口不需要这个字段。
     status 只服务系统管理：'off' 表示已下架，资料库与全局搜索都
     不显示已下架资料；不写该字段默认正常上架。                      */
  resources: [
    { id: 1,  title: '第五章 定积分 课件',              course_id: 1, course_name: '高等数学',   category: '课件', ext: 'pdf',  size: 3240, updated_at: '2026-11-18', uploaded_by: '李明华', download_count: 186, cover_h: 108,
      description: '定积分的概念、性质与计算，含换元法和分部积分的例题讲解。老师标注的第 3.2 节为本章重点。' },
    { id: 2,  title: '第三章 导数与微分 课件',          course_id: 1, course_name: '高等数学',   category: '课件', ext: 'pdf',  size: 2860, updated_at: '2026-11-06', uploaded_by: '李明华', download_count: 241, cover_h: 84,
      description: '导数定义、求导法则、高阶导数与微分。附课堂随堂练习题。' },
    { id: 3,  title: '期中真题（2019-2025）',           course_id: 1, course_name: '高等数学',   category: '复习', ext: 'zip',  size: 8600, updated_at: '2026-11-15', uploaded_by: '李明华', download_count: 312, cover_h: 84,
      description: '七年期中真题打包，含参考答案。按题型分为计算、证明、应用题三部分。' },
    { id: 4,  title: '课后习题答案 第五、六章',          course_id: 1, course_name: '高等数学',   category: '习题', ext: 'pdf',  size: 1720, updated_at: '2026-11-10', uploaded_by: '李明华', download_count: 268, cover_h: 84,
      description: '第五、六章课后习题完整解答，证明题给出思路说明。' },
    { id: 5,  title: '公式速查表',                      course_id: 1, course_name: '高等数学',   category: '笔记', ext: 'md',   size: 46,   updated_at: '2026-11-14', uploaded_by: '张三',   download_count: 57,  cover_h: 84,
      description: '自己整理的极限、导数、积分公式速查，考前翻一遍用。' },

    { id: 6,  title: '第 5 章 树与二叉树',              course_id: 3, course_name: '数据结构',   category: '课件', ext: 'pdf',  size: 4580, updated_at: '2026-11-17', uploaded_by: '王振宇', download_count: 154, cover_h: 108,
      description: '二叉树的遍历、线索二叉树、哈夫曼树。实验二会用到这一章的代码模板。' },
    { id: 7,  title: '实验二 二叉排序树 参考实现',      course_id: 3, course_name: '数据结构',   category: '习题', ext: 'md',   size: 32,   updated_at: '2026-11-16', uploaded_by: '王振宇', download_count: 98,  cover_h: 84,
      description: '插入、删除、查找的完整实现，删除节点的三种情况都有注释。仅供参照，别直接交。' },
    { id: 8,  title: '期末复习提纲',                    course_id: 3, course_name: '数据结构',   category: '复习', ext: 'docx', size: 620,  updated_at: '2026-11-12', uploaded_by: '王振宇', download_count: 203, cover_h: 84,
      description: '按章节梳理考点，标了必考和了解两档。图论部分是重点。' },
    { id: 9,  title: '课堂笔记（全学期）',              course_id: 3, course_name: '数据结构',   category: '笔记', ext: 'pdf',  size: 5240, updated_at: '2026-11-08', uploaded_by: '张三',   download_count: 41,  cover_h: 84,
      description: '从绪论到图的整学期笔记，手写扫描版，字有点丑但内容全。' },
    { id: 10, title: '图论算法动画演示',                course_id: 3, course_name: '数据结构',   category: '课件', ext: 'zip',  size: 12400, updated_at: '2026-10-29', uploaded_by: '王振宇', download_count: 76,  cover_h: 84,
      status: 'off', off_reason: '版权待确认，联系上传者补授权后恢复',
      description: 'DFS、BFS、Dijkstra、最小生成树的动画演示，双击 index.html 运行。' },

    { id: 11, title: '第 5 章 传输层',                  course_id: 4, course_name: '计算机网络', category: '课件', ext: 'pptx', size: 6120, updated_at: '2026-11-18', uploaded_by: '陈静',   download_count: 132, cover_h: 96,
      description: 'TCP 三次握手、四次挥手、拥塞控制。实验三要用 Wireshark 抓这个过程。' },
    { id: 12, title: '实验三 Wireshark 抓包指南',       course_id: 4, course_name: '计算机网络', category: '习题', ext: 'pdf',  size: 1180, updated_at: '2026-11-16', uploaded_by: '陈静',   download_count: 165, cover_h: 96,
      description: '从安装到过滤表达式，一步步教到能导出时序图。常见问题附在最后一页。' },
    { id: 13, title: '期中复习重点',                    course_id: 4, course_name: '计算机网络', category: '复习', ext: 'docx', size: 380,  updated_at: '2026-11-13', uploaded_by: '陈静',   download_count: 224, cover_h: 96,
      description: '物理层到传输层的高频考点，计算题集中在子网划分和滑动窗口。' },
    { id: 14, title: '历年真题汇编',                    course_id: 4, course_name: '计算机网络', category: '复习', ext: 'pdf',  size: 4960, updated_at: '2026-11-09', uploaded_by: '陈静',   download_count: 189, cover_h: 108,
      description: '近五年期末真题，按章归类，答案单独放在末尾。' },

    { id: 15, title: '进程调度 课件',                   course_id: 6, course_name: '操作系统',   category: '课件', ext: 'pptx', size: 3480, updated_at: '2026-11-17', uploaded_by: '刘峰',   download_count: 117, cover_h: 96,
      description: 'FCFS、SJF、优先级、时间片轮转的对比，含甘特图演算过程。' },
    { id: 16, title: '第三章习题答案',                  course_id: 6, course_name: '操作系统',   category: '习题', ext: 'pdf',  size: 960,  updated_at: '2026-11-11', uploaded_by: '刘峰',   download_count: 143, cover_h: 96,
      description: '进程调度相关习题解答，第 3、5、8 题是必做的三道。' },
    { id: 17, title: '内存管理思维导图',                course_id: 6, course_name: '操作系统',   category: '笔记', ext: 'png',  size: 840,  updated_at: '2026-11-05', uploaded_by: '张三',   download_count: 28,  cover_h: 108,
      status: 'off', off_reason: '内容与新版课件重复，先下架观察',
      description: '分页、分段、段页式的对比，一张图看完这一章。' },

    { id: 18, title: '六级高频词汇表',                  course_id: 5, course_name: '大学英语',   category: '笔记', ext: 'md',   size: 128,  updated_at: '2026-11-15', uploaded_by: '张三',   download_count: 34,  cover_h: 96,
      description: '按考试出现频次排序的 1200 词，去掉已经会的那部分。' },
    { id: 19, title: '写作模板（议论文）',              course_id: 5, course_name: '大学英语',   category: '笔记', ext: 'docx', size: 210,  updated_at: '2026-11-07', uploaded_by: '周敏',   download_count: 96,  cover_h: 96,
      description: '三段式议论文骨架，开头结尾各有三套替换句式，避免全篇一个模板。' },
    { id: 20, title: '六级听力真题（2024-2026）',       course_id: 5, course_name: '大学英语',   category: '复习', ext: 'zip',  size: 34600, updated_at: '2026-11-03', uploaded_by: '周敏',   download_count: 78,  cover_h: 96,
      description: '音频 + 原文 + 答案，按年份分文件夹。文件较大，建议校内网下载。' },

    { id: 21, title: '波动光学 课件',                   course_id: 8, course_name: '大学物理',   category: '课件', ext: 'pdf',  size: 4120, updated_at: '2026-11-14', uploaded_by: '孙立',   download_count: 128, cover_h: 108,
      description: '干涉、衍射、偏振三节。期中考试这一章占 30 分左右。' },
    { id: 22, title: '期中押题卷',                      course_id: 8, course_name: '大学物理',   category: '复习', ext: 'pdf',  size: 1420, updated_at: '2026-11-18', uploaded_by: '孙立',   download_count: 267, cover_h: 96,
      description: '按去年题型出的模拟卷，难度略高于真题，附评分标准。' },
    { id: 23, title: '实验报告模板',                    course_id: 8, course_name: '大学物理',   category: '习题', ext: 'docx', size: 340,  updated_at: '2026-10-27', uploaded_by: '孙立',   download_count: 152, cover_h: 96,
      description: '实验报告的固定格式，别改页边距，打印会跑版。' },

    { id: 24, title: '实验四 建表与查询 参考实现',      course_id: 7, course_name: '数据库实验', category: '习题', ext: 'md',   size: 58,   updated_at: '2026-11-17', uploaded_by: '赵慧',   download_count: 87,  cover_h: 96,
      description: '预习报告里要求的 ER 设计和建表语句，写完对照一下有没有漏字段。' }
  ],

  /* ---------- 消息与通知 ----------
     source     : academic 教务在线 / course 课程 / system 系统提醒 / ai AI 规划
     type       : notice 公告 / remind 提醒 / conflict 冲突 / plan 计划结果 / update 更新
     target     : 这条消息指向哪儿。kind 取 task|schedule|plan|library|none，
                  object_id 是目标对象的 id，label 是给人看的名字。
                  接真实接口时后端应返回 object_type + object_id，前端拼路由，
                  不要把 href 存进数据库。
     extract    : 能从这条消息里提取出的任务草稿（教务/课程类通知才有）。
                  设计文档明确暂缓「自动识别与任务提取」，所以这里是人工确认，
                  学生在消息页点「提取为任务」才生成，不做静默抽取。
     expired    : 时间过了就没有意义的提醒。失效消息不做未读计数。       */
  notifications: [
    { id: 1, source: 'academic', source_name: '教务处', type: 'notice',
      title: '关于第 13 周教学安排调整的通知',
      summary: '11 月 25 日（周三）下午全校停课，涉及课程需与任课教师确认补课时间。',
      body: '各学院、各教学单位：\n\n因学校秋季运动会安排，第 13 周周三（11 月 25 日）下午第 5 至第 8 节的课程停上。请各学院通知到相关任课教师与学生，由任课教师自行安排补课时间，并在教学管理系统内登记。\n\n受影响的课程包括《计算机网络》《大学物理》等，具体以各学院通知为准。运动会当天上午课程照常进行。',
      created_at: '2026-11-18 15:20', read: false, expired: false,
      course_id: null, course_name: '',
      target: { kind: 'schedule', object_id: null, label: '第 13 周日程', sub: '11 月 23 日至 29 日' },
      extract: { title: '确认第 13 周周三下午的补课安排', course_id: 4, course_name: '计算机网络', date: '2026-11-25', due: '18:00', description: '教务处通知：11 月 25 日下午停课，需与陈静老师确认计算机网络实验的补课时间。' },
      attachments: [{ name: '关于第13周教学安排调整的通知.pdf', size: '186 KB' }] },

    { id: 2, source: 'academic', source_name: '教务处', type: 'notice',
      title: '2026-2027 学年第一学期期末考试安排预通知',
      summary: '期末考试拟定于第 19 至 20 周进行，具体安排以正式通知为准。',
      body: '各学院：\n\n本学期期末考试拟定于第 19 周至第 20 周（2027 年 1 月 4 日至 1 月 17 日）进行。考试日程、考场安排与监考名单将在第 15 周前另行发布。\n\n请同学们合理安排复习计划，提前关注课程结课时间。本通知为预通知，不作为最终考试安排依据。',
      created_at: '2026-11-17 10:05', read: true, expired: false,
      course_id: null, course_name: '',
      target: { kind: 'none', object_id: null, label: '', sub: '' },
      extract: null, attachments: [] },

    { id: 3, source: 'academic', source_name: '教务处', type: 'notice',
      title: '大学物理期中考试考场安排',
      summary: '11 月 20 日 19:00–20:40，教 2-105，请提前 15 分钟入场。',
      body: '《大学物理》期中考试安排在 11 月 20 日（周五）19:00 至 20:40，考场为教 2-105。\n\n请携带学生证入场，按座位表就座。考试期间不得使用任何电子设备，草稿纸由考场统一提供。',
      created_at: '2026-11-13 09:30', read: true, expired: false,
      course_id: 8, course_name: '大学物理',
      target: { kind: 'schedule', object_id: 19, label: '大学物理 期中考试', sub: '11 月 20 日 19:00 教 2-105' },
      extract: null, attachments: [] },

    { id: 4, source: 'academic', source_name: '教务处', type: 'notice',
      title: '关于开展本学期期中教学检查的通知',
      summary: '检查时间为 11 月 9 日至 13 日，现已结束。',
      body: '为掌握本学期教学运行情况，学校于第 11 周（11 月 9 日至 13 日）开展期中教学检查，内容包括课堂教学秩序、作业布置与批改、实验开出情况等。\n\n检查已结束，结果另行反馈至各学院。',
      created_at: '2026-11-06 08:40', read: true, expired: true,
      course_id: null, course_name: '',
      target: { kind: 'none', object_id: null, label: '', sub: '' },
      extract: null, attachments: [] },

    { id: 5, source: 'course', source_name: '陈静 · 计算机网络', type: 'update',
      title: '补充阅读：TCP 拥塞控制的两篇论文',
      summary: '课上提到的两篇论文已上传到资料库，下节课会抽查提问。',
      body: '课上提到的两篇论文已经传到学习资料库，在《计算机网络》下可以看到：\n\n一篇是 Jacobson 关于慢启动与拥塞避免的经典文章，另一篇是比较 AQM 机制的综述。不需要精读，重点看慢启动、拥塞避免、快重传三部分，下节课会请同学讲一下自己的理解。\n\n实验三的抓包报告里如果能引用其中任何一篇的结论，会有加分。',
      created_at: '2026-11-18 11:42', read: false, expired: false,
      course_id: 4, course_name: '计算机网络',
      target: { kind: 'library', object_id: 11, label: '计算机网络 的资料', sub: '第 5 章 传输层 · 共 4 份' },
      extract: { title: '读 TCP 拥塞控制的两篇论文', course_id: 4, course_name: '计算机网络', date: '2026-11-22', due: '23:59', description: '陈静老师要求：慢启动、拥塞避免、快重传三部分，下节课抽查。资料在资料库《计算机网络》下。' },
      attachments: [] },

    { id: 6, source: 'course', source_name: '李明华 · 高等数学', type: 'notice',
      title: '第五章课后习题更正：第 8 题条件有误',
      summary: '教材第 8 题漏了一个条件，以课件第 42 页的版本为准。',
      body: '第五章课后习题第 8 题，教材上漏印了「函数在区间上连续」这个条件，按原题做会得到两个答案。\n\n以课件第 42 页的版本为准，补上这个条件后答案唯一。已经做过的同学不用重做，把条件补在题干上就行。',
      created_at: '2026-11-17 16:20', read: true, expired: false,
      course_id: 1, course_name: '高等数学',
      target: { kind: 'task', object_id: 1, label: '高等数学作业', sub: '截止 11 月 19 日 23:59' },
      extract: null, attachments: [] },

    { id: 7, source: 'course', source_name: '王振宇 · 数据结构', type: 'notice',
      title: '实验报告模板已更新',
      summary: '新增「测试用例与运行截图」一节，请重新下载模板。',
      body: '实验报告的模板更新了，新增「测试用例与运行截图」一节，占 20 分。\n\n已经按旧模板写完的同学，把这一节补在「实验结果」后面就可以，不用整篇重写。模板在资料库《数据结构》下，文件名是「实验报告模板 v2」。',
      created_at: '2026-11-16 19:05', read: true, expired: false,
      course_id: 3, course_name: '数据结构',
      target: { kind: 'task', object_id: 2, label: '数据结构实验报告', sub: '截止 11 月 22 日 23:59' },
      extract: null, attachments: [] },

    { id: 8, source: 'system', source_name: '系统提醒', type: 'remind',
      title: '高等数学作业明晚 23:59 截止，还有 60 分钟没排进日程',
      summary: '这项任务预计 60 分钟，本周剩余可用时间 5 小时 20 分。',
      body: '《高等数学作业》的截止时间是 11 月 19 日 23:59，预计需要 60 分钟，目前还没有在日程里安排学习时段。\n\n本周剩余可用时间 5 小时 20 分，够排。需要我帮你找个空档吗？',
      created_at: '2026-11-18 16:10', read: false, expired: false, urgent: true,
      course_id: 1, course_name: '高等数学',
      target: { kind: 'task', object_id: 1, label: '高等数学作业', sub: '截止 11 月 19 日 23:59 · 未排时段' },
      extract: null, attachments: [] },

    { id: 9, source: 'system', source_name: '系统提醒', type: 'remind',
      title: '今晚 19:00「英语六级词汇」学习时段即将开始',
      summary: '地点在宿舍，预计 60 分钟，已完成 0%。',
      body: '你在日程里排了今晚 19:00 到 20:00 背六级词汇，地点是宿舍。\n\n开始和结束后都可以在日程里直接标记，标记过的时段会计入本周学习时长。',
      created_at: '2026-11-18 09:00', read: true, expired: false,
      course_id: 5, course_name: '大学英语',
      target: { kind: 'schedule', object_id: 13, label: '英语六级词汇', sub: '今天 19:00–20:00 宿舍' },
      extract: null, attachments: [] },

    { id: 10, source: 'system', source_name: '系统提醒', type: 'conflict',
      title: '11 月 20 日 19:00 的学习时段与大学物理期中考试冲突',
      summary: '两个安排完全重叠，这段学习时间实际上不存在。',
      body: '你在 11 月 20 日 19:00 到 20:40 排了《大学物理 期中复习》，同一时段还有《大学物理 期中考试》，两个安排完全重叠。\n\n考试是固定安排，不能移动。这段复习需要改到别的时间，否则这一项计划实际执行不了。',
      created_at: '2026-11-17 21:30', read: false, expired: false, urgent: true,
      course_id: 8, course_name: '大学物理',
      target: { kind: 'schedule', object_id: 15, label: '大学物理 期中复习', sub: '11 月 20 日 19:00 与考试重叠' },
      extract: null, attachments: [] },

    { id: 11, source: 'system', source_name: '系统提醒', type: 'remind',
      title: '11 月 16 日 19:00 的学习时段没有开始',
      summary: '已过结束时间，这一时段按跳过处理，不计入学习时长。',
      body: '11 月 16 日 19:00 到 20:00 排了《高等数学作业》的学习时段，但没有开始和完成的记录，已按跳过处理。\n\n跳过的时段不计入本周学习时长。如果实际做了，可以在日程里补记为已完成。',
      created_at: '2026-11-16 20:05', read: true, expired: true,
      course_id: 1, course_name: '高等数学',
      target: { kind: 'none', object_id: null, label: '', sub: '' },
      extract: null, attachments: [] },

    { id: 12, source: 'ai', source_name: 'AI 学习规划', type: 'plan',
      title: '周末补排方案已生成，等你确认',
      summary: '2 个候选时段，共 3 小时。确认后才会写进日程。',
      body: '按你这周的进度和剩下的截止时间，排了 2 个周末时段：\n\n周六 14:00–15:30 背六级词汇，周日 10:00–11:30 做计算机网络实验。两段都避开了课程和其他安排，没有冲突。\n\n确认之前不会写进日程，你可以逐个拖动或者直接删掉不要的那一段。',
      created_at: '2026-11-18 10:15', read: false, expired: false,
      course_id: null, course_name: '',
      target: { kind: 'plan', object_id: 5, label: '周末补排（待确认）', sub: '2 个候选时段 · 共 3 小时' },
      extract: null, attachments: [] },

    { id: 13, source: 'ai', source_name: 'AI 学习规划', type: 'plan',
      title: '第 12 周学习计划已确认',
      summary: '生成 6 个学习时段，共 8 小时 10 分。',
      body: '第 12 周的学习计划已经确认，6 个学习时段已写进日程。\n\n本周已投入 2 小时 40 分，完成 1 项任务。按目前的节奏，这周的截止时间都能赶上，只有大学物理期中复习排得比较紧。',
      created_at: '2026-11-15 21:04', read: true, expired: false,
      course_id: null, course_name: '',
      target: { kind: 'schedule', object_id: null, label: '本周日程', sub: '第 12 周 · 6 个学习时段' },
      extract: null, attachments: [] },

    { id: 14, source: 'ai', source_name: 'AI 学习规划', type: 'plan',
      title: '大学物理期中复习排不满，还差 40 分钟',
      summary: '截止前可用时间不足，建议缩短目标或占用周五晚上。',
      body: '《大学物理 期中复习》预计需要 150 分钟，但 11 月 20 日考试之前只剩 110 分钟的可用时间，差 40 分钟。\n\n两个办法：把复习目标缩到 110 分钟，只看波动光学和刚体转动的例题；或者占用周五晚上，但那段时间和考试冲突，需要先把原来的学习时段挪走。',
      created_at: '2026-11-14 20:30', read: true, expired: false,
      course_id: 8, course_name: '大学物理',
      target: { kind: 'plan', object_id: null, label: '重新规划大学物理复习', sub: '当前缺口 40 分钟' },
      extract: null, attachments: [] }
  ],

  /* ---------- 用户（user 表，系统管理用） ----------
     字段对齐交接文档阶段 6.1：role 取 student | admin，
     status 取 active | disabled。张三是种子管理员（演示假设当前
     登录的就是它），「最后一个管理员」的保护逻辑要在页面上验。
     auth_account 是统一身份认证下发的账号，登录页用它而不是学号；
     真实值由认证中心返回，这里用姓名拼音占位。                    */
  users: [
    { id: 1,  student_id: '2026210001', auth_account: 'zhangsan',    name: '张三',   college: '计算机科学与技术学院', major: '计算机科学与技术',   role: 'admin',   status: 'active',   created_at: '2026-08-30', last_login_at: '2026-11-18 16:32' },
    { id: 2,  student_id: '2026210002', auth_account: 'lisi',        name: '李四',   college: '计算机科学与技术学院', major: '计算机科学与技术',   role: 'student', status: 'active',   created_at: '2026-08-30', last_login_at: '2026-11-18 08:15' },
    { id: 3,  student_id: '2026210003', auth_account: 'wangwu',      name: '王五',   college: '计算机科学与技术学院', major: '计算机科学与技术',   role: 'student', status: 'disabled', created_at: '2026-08-30', last_login_at: '2026-11-02 21:40' },
    { id: 4,  student_id: '2026210004', auth_account: 'zhaoliu',     name: '赵六',   college: '软件工程学院',         major: '软件工程',           role: 'student', status: 'active',   created_at: '2026-08-31', last_login_at: '2026-11-17 19:05' },
    { id: 5,  student_id: '2026210005', auth_account: 'chenxiaoyu',  name: '陈晓雨', college: '软件工程学院',         major: '软件工程',           role: 'student', status: 'active',   created_at: '2026-08-31', last_login_at: '2026-11-18 12:48' },
    { id: 6,  student_id: '2026210006', auth_account: 'zhoutianlei', name: '周天磊', college: '通信与信息工程学院',   major: '通信工程',           role: 'student', status: 'active',   created_at: '2026-09-01', last_login_at: '2026-11-16 22:10' },
    { id: 7,  student_id: '2026210007', auth_account: 'wuyutong',    name: '吴语桐', college: '经济管理学院',         major: '信息管理与信息系统', role: 'student', status: 'active',   created_at: '2026-09-01', last_login_at: '2026-11-15 14:26' },
    { id: 8,  student_id: '2026210008', auth_account: 'zhengyiming', name: '郑一鸣', college: '计算机科学与技术学院', major: '人工智能',           role: 'student', status: 'active',   created_at: '2026-09-02', last_login_at: '2026-11-18 09:54' },
    { id: 9,  student_id: '2026210009', auth_account: 'fenglan',     name: '冯岚',   college: '光电工程学院',         major: '电子科学与技术',     role: 'student', status: 'active',   created_at: '2026-09-02', last_login_at: '2026-11-14 18:33' },
    { id: 10, student_id: '2026210010', auth_account: 'heziang',     name: '何子昂', college: '计算机科学与技术学院', major: '计算机科学与技术',   role: 'admin',   status: 'active',   created_at: '2026-08-30', last_login_at: '2026-11-17 23:02' }
  ],

  /* ---------- 公告（announcement 表，交接文档阶段 6.4） ----------
     发布后由后端写入消息中心（source = system）。expires_at 过了
     即失效，失效逻辑与消息的 expired 同口径：不再计入未读。         */
  announcements: [
    { id: 1, title: '学习资料库开放上传，欢迎共享课程笔记',
      body: '学习资料库已开放上传入口。课件、笔记、习题都可以传，上传前请确认内容为本人整理或已获授权，涉及版权的资料会被下架。\n\n路径：学习资料库 → 选择课程 → 上传资料。',
      published_at: '2026-11-16 10:00', expires_at: '2026-12-31 23:59', created_by: '张三' },
    { id: 2, title: '第 12 周 AI 学习规划功能试用征集',
      body: 'AI 学习规划进入试用阶段，欢迎在使用中通过个人中心反馈问题。本周日晚 22:00 前反馈的同学优先处理。',
      published_at: '2026-11-10 09:00', expires_at: '2026-11-15 22:00', created_by: '张三' }
  ],

  /* ---------- 数据源同步状态（第一期只读，交接文档阶段 6.6） ----------
     第一期不做接入配置界面，只有状态、失败原因和手动触发。
     unified_auth 必须已接通：登录页的主入口就是它，这里若写「申请中」
     两边就互相打脸。演示「申请中」的边界态改用 library_loan 这一条。   */
  dataSources: [
    { id: 'academic', name: '教务在线', scope: '课表 · 任务 · 学期校历',
      status: 'connected', last_sync_at: '2026-11-18 06:00', last_ok_at: '2026-11-18 06:00',
      last_error: null, schedule: '每天 06:00 自动同步', fail_streak: 0 },
    { id: 'unified_auth', name: '统一身份认证', scope: '登录 · 学籍信息',
      status: 'connected', last_sync_at: '2026-11-18 08:12', last_ok_at: '2026-11-18 08:12',
      last_error: null, schedule: '每次登录时校验', fail_streak: 0 },
    { id: 'library_loan', name: '图书馆借阅', scope: '借阅中书目 · 到期提醒',
      status: 'not_configured', last_sync_at: null, last_ok_at: null,
      last_error: null, schedule: '—', fail_streak: 0 }
  ],

  /* ---------- 系统配置（system_config 表，阶段 6.5） ----------
     界面化只留全局运营口径：学期基准、资料上传限制。
     提醒提前量、AI 估算是学生个人偏好（个人中心·学习偏好/通知与提醒）；
     冲突检测是 Planner 安全硬约束，无开关；时段上限是算法常量。
     部署级配置（JWT / CORS / 数据库 / 存储硬上限 / API Key）走环境变量。
     term_start 与 config.js 的 APP_CONFIG.term.startDate 保持一致。  */
  config: {
    term_name: '2026-2027 学年 第一学期',
    term_start: '2026-08-31',
    upload: {
      exts: ['pdf', 'docx', 'pptx', 'xlsx', 'zip', 'md', 'png', 'jpg'],
      max_mb: 50
    }
  }
};

/* ============================================================
   演示态存储 —— 只包 tasks
   真实实现由后端 task 接口承担，这里是为了让「在课程与任务页新建 / 完成
   一条任务，回到首页能看到变化」这条路走得通。
   存在 sessionStorage：同一标签页内跨页面共享，关掉标签页就恢复初始数据。
   ============================================================ */
(function () {
  var KEY = 'uniflow.proto.tasks.v1';
  var M = window.MOCK;
  var INIT = JSON.parse(JSON.stringify(M.tasks));

  /* 页面里直接读 MOCK.tasks 的地方（如课表页查任务标题）也拿到同一份 */
  function save(list) {
    M.tasks = list;
    try { sessionStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  try {
    var raw = sessionStorage.getItem(KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      /* 空数组也是合法状态：任务被删光了，不该回落到初始数据 */
      if (Array.isArray(saved)) M.tasks = saved;
    }
  } catch (e) {}

  function stamp() {
    var d = new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  window.Store = {
    tasks: function () { return M.tasks.slice(); },

    get: function (id) {
      for (var i = 0; i < M.tasks.length; i++) if (M.tasks[i].id === id) return M.tasks[i];
      return null;
    },

    add: function (t) {
      t.id = Date.now();
      t.created_at = t.created_at || stamp();
      t.updated_at = t.created_at;
      t.user_modified = true;
      M.tasks.push(t);
      save(M.tasks.slice());
      return t;
    },

    patch: function (id, fields) {
      var t = this.get(id);
      if (!t) return null;
      Object.keys(fields).forEach(function (k) { t[k] = fields[k]; });
      t.updated_at = stamp();
      t.user_modified = true;
      save(M.tasks.slice());
      return t;
    },

    remove: function (id) {
      save(M.tasks.filter(function (t) { return t.id !== id; }));
    },

    /* 演示用：把任务恢复成初始数据 */
    reset: function () {
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      M.tasks = JSON.parse(JSON.stringify(INIT));
      return M.tasks;
    }
  };
})();

/* ============================================================
   日程与候选时段的演示态存储 —— 只服务日程页
   页面拿 events() / sessions() 的副本做响应式数据，改完之后 commit()
   把结果写回 MOCK 并落 sessionStorage；关掉标签页回到初始数据。
   commit 只改 MOCK 里原数组的内容，不换引用，避免别的页面拿到失效的旧数组。
   ============================================================ */
(function () {
  var EK = 'uniflow.proto.events.v1';
  var SK = 'uniflow.proto.sessions.v1';
  var M = window.MOCK;

  function saveE() { try { sessionStorage.setItem(EK, JSON.stringify(M.events)); } catch (e) {} }
  function saveS() { try { sessionStorage.setItem(SK, JSON.stringify(M.sessions)); } catch (e) {} }

  try {
    var re = sessionStorage.getItem(EK);
    if (re) { var a = JSON.parse(re); if (Array.isArray(a)) M.events = a; }
    var rs = sessionStorage.getItem(SK);
    if (rs) { var b = JSON.parse(rs); if (Array.isArray(b)) M.sessions = b; }
  } catch (e) {}

  window.EventStore = {
    /* 返回副本数组，页面直接拿去做响应式数据；
       改完调用 commit() 把结果写回 MOCK 并落 sessionStorage */
    events: function () { return M.events.slice(); },

    sessions: function () { return M.sessions.slice(); },

    commit: function (events, sessions) {
      if (events) {
        M.events.length = 0;
        events.forEach(function (e) { M.events.push(e); });
      }
      if (sessions) {
        M.sessions.length = 0;
        sessions.forEach(function (s) { M.sessions.push(s); });
      }
      saveE();
      saveS();
    },

    reset: function () {
      try {
        sessionStorage.removeItem(EK);
        sessionStorage.removeItem(SK);
      } catch (e) {}
    }
  };
})();

/* ============================================================
   消息与通知的演示态存储
   和其它两个 store 一个套路，多一件事：这是全站唯一「页面改、
   外壳读」的数据，所以每次写要发 notify:change 事件，
   让顶栏铃铛的角标跟着变（AppShell 在 mounted 里监听）。
   失效消息不计入未读。
   ============================================================ */
(function () {
  var NK = 'uniflow.proto.notify.v1';
  var M = window.MOCK;
  var INIT = JSON.parse(JSON.stringify(M.notifications));

  function save(list) {
    M.notifications = list;
    try { sessionStorage.setItem(NK, JSON.stringify(list)); } catch (e) {}
  }

  try {
    var raw = sessionStorage.getItem(NK);
    if (raw) {
      var saved = JSON.parse(raw);
      /* 空数组也是合法状态，不该回落到初始数据 */
      if (Array.isArray(saved)) M.notifications = saved;
    }
  } catch (e) {}

  function emit() {
    try { window.dispatchEvent(new CustomEvent('notify:change')); } catch (e) {}
  }

  window.NotifyStore = {
    list: function () { return M.notifications.slice(); },

    get: function (id) {
      for (var i = 0; i < M.notifications.length; i++) {
        if (M.notifications[i].id === id) return M.notifications[i];
      }
      return null;
    },

    /* 未读数：已失效的不算，它已经不需要你处理了 */
    unreadCount: function () {
      return M.notifications.filter(function (n) {
        return !n.read && !n.expired;
      }).length;
    },

    patch: function (id, fields) {
      var n = this.get(id);
      if (!n) return null;
      Object.keys(fields).forEach(function (k) { n[k] = fields[k]; });
      save(M.notifications.slice());
      emit();
      return n;
    },

    markAllRead: function () {
      M.notifications.forEach(function (n) {
        if (!n.expired) n.read = true;
      });
      save(M.notifications.slice());
      emit();
      return this.unreadCount();
    },

    /* 系统管理发布公告时走这里：公告即「系统提醒」来源，
       发布后顶栏角标要立刻 +1。n 需要带全消息字段（title / summary /
       body / target / extract / attachments），由调用方组装。 */
    add: function (n) {
      n.id = Date.now();
      n.read = false;
      n.expired = false;
      M.notifications.unshift(n);
      save(M.notifications.slice());
      emit();
      return n;
    },

    reset: function () {
      try { sessionStorage.removeItem(NK); } catch (e) {}
      M.notifications = JSON.parse(JSON.stringify(INIT));
      emit();
      return M.notifications;
    }
  };
})();

/* ============================================================
   系统管理的演示态存储 —— 用户 / 资料 / 公告 / 配置
   套路与 EventStore 一致：页面拿副本改，commit() 写回 MOCK 并落
   sessionStorage。资料状态必须落盘：资料库页和全局搜索都读
   MOCK.resources，下架状态不同步过去就会出现「搜索能看到、
   资料库看不到」的分裂。
   ============================================================ */
(function () {
  var M = window.MOCK;
  var KEYS = { users: 'uniflow.proto.admin.users.v1', courses: 'uniflow.proto.admin.courses.v1', resources: 'uniflow.proto.admin.res.v1', announcements: 'uniflow.proto.admin.ann.v1', config: 'uniflow.proto.admin.cfg.v2' };
  var INIT = {
    users: JSON.parse(JSON.stringify(M.users)),
    courses: JSON.parse(JSON.stringify(M.courses)),
    resources: JSON.parse(JSON.stringify(M.resources)),
    announcements: JSON.parse(JSON.stringify(M.announcements)),
    config: JSON.parse(JSON.stringify(M.config))
  };

  Object.keys(KEYS).forEach(function (k) {
    try {
      var raw = sessionStorage.getItem(KEYS[k]);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved != null) M[k] = saved;
      }
    } catch (e) {}
  });

  window.AdminStore = {
    users: function () { return JSON.parse(JSON.stringify(M.users)); },
    courses: function () { return JSON.parse(JSON.stringify(M.courses)); },
    resources: function () { return JSON.parse(JSON.stringify(M.resources)); },
    announcements: function () { return JSON.parse(JSON.stringify(M.announcements)); },
    config: function () { return JSON.parse(JSON.stringify(M.config)); },

    commit: function (fields) {
      Object.keys(fields).forEach(function (k) {
        if (!KEYS[k]) return;
        M[k] = fields[k];
        try { sessionStorage.setItem(KEYS[k], JSON.stringify(fields[k])); } catch (e) {}
      });
    },

    reset: function () {
      Object.keys(KEYS).forEach(function (k) {
        try { sessionStorage.removeItem(KEYS[k]); } catch (e) {}
        M[k] = JSON.parse(JSON.stringify(INIT[k]));
      });
      return true;
    }
  };
})();
