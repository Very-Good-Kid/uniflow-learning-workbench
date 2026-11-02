/* ============================================================
   外壳组件：侧边栏 + 顶栏 + 图标
   页面里用 <app-shell active="schedule">…</app-shell> 包裹内容
   ============================================================ */

(function () {
  const C = window.APP_CONFIG;

  const ICONS = {
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.2 5.3l1.3 1.3L8 4.1"/><path d="M4.2 11.3l1.3 1.3L8 10.1"/><path d="M4.2 17.3l1.3 1.3L8 16.1"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 10h17M8 3.2v3.6M16 3.2v3.6"/><path d="M7.6 13.6h2M14.4 13.6h2M7.6 17h2"/>',
    sparkle: '<path d="M11 3.4l1.6 4.5 4.5 1.6-4.5 1.6L11 15.6l-1.6-4.5L4.9 9.5l4.5-1.6z"/><path d="M18.2 15.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>',
    book: '<path d="M5 4.6h11.3A2.7 2.7 0 0 1 19 7.3V19.4H7.6A2.6 2.6 0 0 1 5 16.8z"/><path d="M5 16.8a2.6 2.6 0 0 1 2.6-2.6H19"/><path d="M8.8 8h6"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.9 20.2c0-3.6 3.2-6.2 7.1-6.2s7.1 2.6 7.1 6.2"/>',
    setting: '<circle cx="12" cy="12" r="3.1"/><path d="M12 2.9v2.3M12 18.8v2.3M4.6 12H2.3M21.7 12h-2.3M6.8 6.8L5.2 5.2M18.8 18.8l-1.6-1.6M17.2 6.8l1.6-1.6M5.2 18.8l1.6-1.6"/>',
    bell: '<path d="M18 8.9a6 6 0 1 0-12 0c0 4.6-1.9 5.9-1.9 5.9h15.8S18 13.5 18 8.9z"/><path d="M10.2 19.4a2 2 0 0 0 3.6 0"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.5 15.5l4.1 4.1"/>',
    'chev-left': '<path d="M14.6 6.2l-6 5.8 6 5.8"/>',
    'chev-right': '<path d="M9.4 6.2l6 5.8-6 5.8"/>',
    'chev-down': '<path d="M6.4 9.6l5.6 5.6 5.6-5.6"/>',
    plus: '<path d="M12 5.2v13.6M5.2 12h13.6"/>',
    warning: '<path d="M12 4.6l8.4 14.8H3.6z"/><path d="M12 9.8v4.1M12 16.9h.01"/>',
    clock: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3.1 1.9"/>',
    cap: '<path d="M12 4.2l8.8 3.9-8.8 3.9-8.8-3.9z"/><path d="M6.2 10.1v4.1c0 1.6 2.6 3.2 5.8 3.2s5.8-1.6 5.8-3.2v-4.1"/>',
    pin: '<path d="M12 20.6s6.3-5.9 6.3-10.6a6.3 6.3 0 1 0-12.6 0c0 4.7 6.3 10.6 6.3 10.6z"/><circle cx="12" cy="9.8" r="2.3"/>',
    lock: '<rect x="5.2" y="10.4" width="13.6" height="9.4" rx="2"/><path d="M8.4 10.4V8a3.6 3.6 0 0 1 7.2 0v2.4"/>',
    check: '<path d="M5 12.4l4.6 4.6L19 7.4"/>',
    file: '<path d="M6.6 3.8h6.8L18 8.4V20H6.6z"/><path d="M13.4 3.8v4.6H18"/>',
    x: '<path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4"/>',
    'arrow-right': '<path d="M4.8 12h13M12.8 6.6l5.4 5.4-5.4 5.4"/>',
    info: '<circle cx="12" cy="12" r="8.4"/><path d="M12 11.2v5M12 8.1h.01"/>'
  };

  window.AppIcon = {
    name: 'AppIcon',
    props: {
      name: { type: String, default: 'grid' },
      size: { type: [Number, String], default: 18 }
    },
    computed: {
      inner() { return ICONS[this.name] || ICONS.grid; }
    },
    template:
      '<svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ' +
      'style="display:block;flex:0 0 auto" v-html="inner"></svg>'
  };

  window.AppShell = {
    name: 'AppShell',
    props: { active: { type: String, default: '' } },
    data() {
      return {
        brand: C.brand,
        nav: C.nav,
        foot: C.navFoot,
        version: C.version,
        user: C.demoUser,
        /* 未读数走 NotifyStore；没引 mock.js 的页面（交付清单）没有角标 */
        unread: window.NotifyStore ? window.NotifyStore.unreadCount() : 0
      };
    },
    mounted() {
      /* 消息页改已读时要让角标跟着变。这是全站唯一「页面写、外壳读」
         的数据，所以用事件广播，不靠 props 逐层传。 */
      const self = this;
      this._onNotify = function () {
        self.unread = window.NotifyStore ? window.NotifyStore.unreadCount() : 0;
      };
      window.addEventListener('notify:change', this._onNotify);
    },
    beforeUnmount() {
      if (this._onNotify) window.removeEventListener('notify:change', this._onNotify);
    },
    methods: {
      go(item) {
        if (item.href) { location.href = item.href; return; }
        if (!item.href) {
          TDesign.MessagePlugin.info('「' + item.label + '」原型在下一批交付');
        }
      },
      /* 用户区不是菜单，点一下直接进个人中心 */
      goProfile() {
        if (/profile\.html$/.test(location.pathname)) return;
        location.href = 'profile.html';
      },
      openNotify() {
        if (/messages\.html$/.test(location.pathname)) return;
        location.href = 'messages.html';
      }
    },
    template: [
      '<div class="shell">',
      '  <aside class="sidebar">',
      '    <div class="brand">',
      '      <div class="brand-mark"><app-icon name="cap" :size="19" /></div>',
      '      <div class="brand-text">',
      '        <div class="brand-name">{{ brand.name }}</div>',
      '        <div class="brand-sub">{{ brand.sub }}</div>',
      '      </div>',
      '    </div>',
      '    <nav class="nav">',
      '      <div v-for="item in nav" :key="item.key" class="nav-item"',
      '           :class="{ active: item.key === active }" @click="go(item)">',
      '        <app-icon :name="item.icon" :size="18" />',
      '        <span>{{ item.label }}</span>',
      '      </div>',
      '    </nav>',
      '    <div class="nav-foot">',
      '      <div class="nav-item" :class="{ active: foot.key === active }" @click="go(foot)">',
      '        <app-icon :name="foot.icon" :size="18" />',
      '        <span>{{ foot.label }}</span>',
      '      </div>',
      '      <div class="ver">{{ version }}</div>',
      '    </div>',
      '  </aside>',
      '  <div class="main">',
      '    <header class="topbar">',
      '      <app-search-box />',
      '      <div class="tb-right">',
      '        <button class="icon-btn" title="消息与通知" @click="openNotify">',
      '          <t-badge :count="unread" :offset="[3, -1]"><app-icon name="bell" :size="19" /></t-badge>',
      '        </button>',
      '        <div class="tb-divider"></div>',
      '        <div class="user-chip" title="个人中心" @click="goProfile">',
      '          <t-avatar size="30px" style="background:var(--brand-1);color:var(--brand-8);font-size:12px">{{ user.name[0] }}</t-avatar>',
      '          <div class="user-meta"><b>{{ user.name }}</b><span>{{ user.studentIdMasked }}</span></div>',
      '        </div>',
      '      </div>',
      '    </header>',
      '    <main class="content"><slot></slot></main>',
      '  </div>',
      '</div>'
    ].join('\n')
  };

  /* 统一挂载：注册 TDesign 与两个全局组件 */
  window.mountApp = function (options) {
    const app = Vue.createApp(options);
    app.use(TDesign);
    app.component('app-icon', window.AppIcon);
    app.component('app-shell', window.AppShell);
    if (window.AppSearchBox) app.component('app-search-box', window.AppSearchBox);
    return app.mount('#app');
  };

  /* ============================================================
     全站通用工具：时间换算、日期运算、演示口径
     页面里用 window.AppUtil 取，不要每个页面各写一份
     ============================================================ */
  const DOW = ['日', '一', '二', '三', '四', '五', '六'];

  window.AppUtil = {
    DOW: DOW,

    /* 'HH:mm' → 分钟数 */
    hm(t) {
      const p = String(t).split(':');
      return Number(p[0]) * 60 + Number(p[1]);
    },

    /* 分钟数 → 'HH:mm' */
    fmt(min) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    },

    /* 分钟数 → '2 小时 40 分' */
    durText(min) {
      const h = Math.floor(min / 60);
      const m = Math.round(min % 60);
      if (!h) return m + ' 分钟';
      return m ? h + ' 小时 ' + m + ' 分' : h + ' 小时';
    },

    /* 'YYYY-MM-DD' → '11/18' */
    mmdd(iso) {
      const p = String(iso).split('-');
      return p[1] + '/' + p[2];
    },

    /* 'YYYY-MM-DD' → '11 月 18 日 周三' */
    cnDate(iso) {
      const p = String(iso).split('-').map(Number);
      const d = new Date(p[0], p[1] - 1, p[2]);
      return p[1] + ' 月 ' + p[2] + ' 日 周' + DOW[d.getDay()];
    },

    addDays(iso, n) {
      const p = String(iso).split('-').map(Number);
      const dt = new Date(p[0], p[1] - 1, p[2] + n);
      return dt.getFullYear() + '-' +
        ('0' + (dt.getMonth() + 1)).slice(-2) + '-' +
        ('0' + dt.getDate()).slice(-2);
    },

    dowOf(iso) {
      const p = String(iso).split('-').map(Number);
      return new Date(p[0], p[1] - 1, p[2]).getDay();
    },

    /* 两个日期差几天，b - a；给不出结果返回 null */
    dayDiff(a, b) {
      if (!a || !b) return null;
      const pa = String(a).split('-').map(Number);
      const pb = String(b).split('-').map(Number);
      const ta = new Date(pa[0], pa[1] - 1, pa[2]).getTime();
      const tb = new Date(pb[0], pb[1] - 1, pb[2]).getTime();
      return Math.round((tb - ta) / 86400000);
    },

    /* 演示用的「现在」：11/18 16:40，和课表页保持同一个口径 */
    NOW: 16 * 60 + 40
  };
})();
