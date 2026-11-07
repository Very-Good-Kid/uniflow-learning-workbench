/* ============================================================
   全站搜索 —— 顶栏搜索框的数据层与面板组件
   ------------------------------------------------------------
   搜的是「对象」，不是页面。学生输入「高数」，要的是作业、课件、
   下一节课在哪——而不是一个叫「课程与任务」的菜单项。

   五类对象，顺序就是优先级：
     task    任务       → tasks.html?id=
     resource 资料      → library.html?open=
     schedule 日程      → schedule.html?event=&date=
     course   课程      → schedule.html?course=
     note     消息      → messages.html?id=

   数据全部走演示态 Store（Store / EventStore / NotifyStore），
   接真实接口时把下面的 tasks() / resources() / … 换成 fetch 即可，
   打分、分组、跳转都不用动。
   ============================================================ */

(function () {
  var M = window.MOCK || {};
  var DOW = ['日', '一', '二', '三', '四', '五', '六'];

  /* ---------- 取数 ---------- */
  function tasks()     { return window.Store ? window.Store.tasks() : []; }
  function resources() {
    /* 已下架的资料（系统管理里 status='off'）不进搜索，
       否则面板能搜到、资料库却看不到 */
    return (M.resources || []).filter(function (r) { return r.status !== 'off'; });
  }
  function events()    { return window.EventStore ? window.EventStore.events() : []; }
  function courses()   { return M.courses || []; }
  function notes()     { return window.NotifyStore ? window.NotifyStore.list() : []; }

  /* ---------- 工具 ---------- */
  function norm(s) { return String(s == null ? '' : s).toLowerCase().trim(); }

  function mmdd(iso) {
    var p = String(iso).split('-');
    return p[1] + '/' + p[2];
  }

  function dowOf(iso) {
    var p = String(iso).split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]).getDay();
  }

  /* b - a，按天；给不出结果返回 null */
  function dayDiff(a, b) {
    if (!a || !b) return null;
    var pa = String(a).split('-').map(Number);
    var pb = String(b).split('-').map(Number);
    var ta = new Date(pa[0], pa[1] - 1, pa[2]).getTime();
    var tb = new Date(pb[0], pb[1] - 1, pb[2]).getTime();
    return Math.round((tb - ta) / 86400000);
  }

  function sizeText(kb) {
    if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
    return kb + ' KB';
  }

  /* 命中打分：整串等于 > 开头命中 > 中间命中。
     越靠前的命中越相关，这是搜索排序里最省事也最有效的一条规则。 */
  function hitScore(hay, kw) {
    var s = norm(hay);
    if (!s) return 0;
    var i = s.indexOf(kw);
    if (i < 0) return 0;
    if (i === 0) return s.length === kw.length ? 100 : 84;
    return 56 - Math.min(24, i);
  }

  /* 简称匹配：按字序逐个找，允许跳字。
     学生搜「高数」不会打「高等数学」，搜「计网」不会打「计算机网络」——
     不做这一条，「高数」一条都搜不出来，搜索等于残废。
     分数上限 26，永远低于任何连续命中的下限 32，所以只是补召回，
     不会把真正连着的匹配挤下去。 */
  function subseqScore(hay, kw) {
    if (kw.length < 2) return 0;
    var s = norm(hay);
    var pos = -1;
    var gap = 0;
    for (var i = 0; i < kw.length; i++) {
      var next = s.indexOf(kw[i], pos + 1);
      if (next < 0) return 0;
      if (pos >= 0) gap += next - pos - 1;
      pos = next;
    }
    /* 字隔太远就不是简称了，是巧合 */
    if (gap > kw.length * 3) return 0;
    return 26 - Math.min(12, gap);
  }

  /* 多字段取最高分。权重：标题 3 / 课程名 1.6 / 正文 1 */
  function scoreOf(fields, kw) {
    var best = 0;
    for (var i = 0; i < fields.length; i++) {
      var s = hitScore(fields[i][0], kw) * fields[i][1];
      if (s <= 0) s = subseqScore(fields[i][0], kw) * fields[i][1];
      if (s > best) best = s;
    }
    return best;
  }

  /* 把命中词切成片段，模板里逐段渲染，不用 v-html——
     mock 数据是自己写的，但拼接 HTML 这条路一旦开了，接真实接口就是 XSS 入口。
     连续命中整段标；只有简称匹配时才逐字标，否则用户看不出为什么命中。 */
  function segs(text, kw) {
    var raw = String(text == null ? '' : text);
    if (!kw) return [{ t: raw, hit: false }];
    var low = raw.toLowerCase();
    var out = [];
    var from = 0;
    var i = low.indexOf(kw);
    while (i >= 0) {
      if (i > from) out.push({ t: raw.slice(from, i), hit: false });
      out.push({ t: raw.slice(i, i + kw.length), hit: true });
      from = i + kw.length;
      i = low.indexOf(kw, from);
    }
    if (from < raw.length) out.push({ t: raw.slice(from), hit: false });
    if (from > 0) return out;

    /* 连续没命中，退回逐字标 */
    var marks = {};
    var pos = -1;
    for (var j = 0; j < kw.length; j++) {
      var next = low.indexOf(kw[j], pos + 1);
      if (next < 0) return [{ t: raw, hit: false }];
      marks[next] = 1;
      pos = next;
    }
    out = [];
    for (var k = 0; k < raw.length; k++) {
      var last = out[out.length - 1];
      var hit = !!marks[k];
      if (last && last.hit === hit) last.t += raw[k];
      else out.push({ t: raw[k], hit: hit });
    }
    return out;
  }

  var STATUS = {
    pending: '待完成',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  };

  /* 截止时间的说法和任务页保持一致：今天 / 明天 / 昨天 / M/D */
  function taskMeta(t) {
    if (!t.date) return { text: '无截止', tone: 'muted' };
    var closed = t.status === 'completed' || t.status === 'cancelled';
    var d = dayDiff(M.today, t.date);
    if (closed) return { text: mmdd(t.date), tone: 'muted' };
    if (d < 0) return { text: '逾期 ' + Math.abs(d) + ' 天', tone: 'alert' };
    /* 红色口径和任务页 isSoon 一致：今天、明天都算「快到了」 */
    if (d === 0) return { text: '今天 ' + (t.due || ''), tone: 'alert' };
    if (d === 1) return { text: '明天 ' + (t.due || ''), tone: 'alert' };
    if (d === -1) return { text: '昨天 ' + (t.due || ''), tone: 'muted' };
    return { text: mmdd(t.date) + ' ' + (t.due || ''), tone: '' };
  }

  /* ---------- 分类定义 ---------- */
  var GROUPS = [
    { key: 'task',     label: '任务', icon: 'check' },
    { key: 'resource', label: '资料', icon: 'file'  },
    { key: 'schedule', label: '日程', icon: 'clock' },
    { key: 'course',   label: '课程', icon: 'cap'   },
    { key: 'note',     label: '消息', icon: 'bell'  }
  ];

  /* ---------- 各类型条目 ---------- */
  function taskItems(kw) {
    var out = [];
    tasks().forEach(function (t) {
      var sc = scoreOf([[t.title, 3], [t.course_name, 1.6], [t.description, 1]], kw);
      if (!sc) return;
      /* 已取消的排到后面去：它还在库里，但通常不是你要找的 */
      if (t.status === 'cancelled') sc *= 0.4;
      var meta = taskMeta(t);
      out.push({
        uid: 'task-' + t.id,
        group: 'task',
        icon: 'check',
        title: t.title,
        segsTitle: segs(t.title, kw),
        sub: [t.course_name || '未关联课程', STATUS[t.status] || ''].join(' · '),
        segsSub: segs([t.course_name || '未关联课程', STATUS[t.status] || ''].join(' · '), kw),
        meta: meta.text,
        tone: meta.tone,
        href: 'tasks.html?id=' + t.id,
        score: sc
      });
    });
    return out;
  }

  function resourceItems(kw) {
    var out = [];
    resources().forEach(function (r) {
      var sc = scoreOf([[r.title, 3], [r.course_name, 1.6], [r.description, 1], [r.category, 1]], kw);
      if (!sc) return;
      var sub = r.course_name + ' · ' + r.category;
      out.push({
        uid: 'res-' + r.id,
        group: 'resource',
        icon: 'file',
        title: r.title,
        segsTitle: segs(r.title, kw),
        sub: sub,
        segsSub: segs(sub, kw),
        meta: String(r.ext || '').toUpperCase() + ' · ' + sizeText(r.size),
        tone: '',
        href: 'library.html?open=' + r.id,
        score: sc
      });
    });
    return out;
  }

  function scheduleItems(kw) {
    var out = [];
    var all = tasks();
    events().forEach(function (ev) {
      var title = ev.title;
      if (ev.event_type === 'study') {
        var t = null;
        for (var i = 0; i < all.length; i++) if (all[i].id === ev.task_id) { t = all[i]; break; }
        title = ev.title || (t ? t.title : '学习时段');
      }
      var sc = scoreOf([[title, 3], [ev.location, 1]], kw);
      if (!sc) return;
      var sub = mmdd(ev.date) + ' 周' + DOW[dowOf(ev.date)] + (ev.location ? ' · ' + ev.location : '');
      out.push({
        uid: 'ev-' + ev.id,
        group: 'schedule',
        icon: 'clock',
        title: title,
        segsTitle: segs(title, kw),
        sub: sub,
        segsSub: segs(sub, kw),
        meta: ev.start + '–' + ev.end,
        tone: ev.event_type === 'exam' ? 'alert' : '',
        href: 'schedule.html?event=' + ev.id + '&date=' + ev.date,
        score: sc
      });
    });
    return out;
  }

  /* 课程按课程名去重：高数一周两次，搜出来不该是两条一样的 */
  function courseItems(kw) {
    var out = [];
    var seen = {};
    courses().forEach(function (c) {
      if (seen[c.name]) return;
      seen[c.name] = 1;
      var sc = scoreOf([[c.name, 3], [c.teacher, 1], [c.classroom, 1]], kw);
      if (!sc) return;
      out.push({
        uid: 'course-' + c.id,
        group: 'course',
        icon: 'cap',
        title: c.name,
        segsTitle: segs(c.name, kw),
        sub: c.teacher + ' · ' + c.classroom,
        segsSub: segs(c.teacher + ' · ' + c.classroom, kw),
        meta: '周' + DOW[c.weekday % 7] + ' ' + c.start_time,
        tone: '',
        href: 'schedule.html?course=' + c.id,
        score: sc
      });
    });
    return out;
  }

  function noteItems(kw) {
    var out = [];
    notes().forEach(function (n) {
      var sc = scoreOf([[n.title, 3], [n.summary, 1.4], [n.source_name, 1], [n.body, 0.8]], kw);
      if (!sc) return;
      if (n.expired) sc *= 0.5;
      var sub = n.source_name + ' · ' + String(n.created_at).slice(5, 16);
      out.push({
        uid: 'note-' + n.id,
        group: 'note',
        icon: 'bell',
        title: n.title,
        segsTitle: segs(n.title, kw),
        sub: sub,
        segsSub: segs(sub, kw),
        meta: (!n.read && !n.expired) ? '未读' : '',
        tone: (!n.read && !n.expired) ? 'brand' : '',
        href: 'messages.html?id=' + n.id,
        score: sc
      });
    });
    return out;
  }

  var BUILDERS = {
    task: taskItems,
    resource: resourceItems,
    schedule: scheduleItems,
    course: courseItems,
    note: noteItems
  };

  window.AppSearch = {
    /* 列表页的过滤也走这一条，保证「面板上说有几条」和「点进来有几条」对得上。
       各页原本的 indexOf 只认连续命中，搜「高数」进资料页会变成 0 条。 */
    hit: function (text, kw) {
      var q = norm(kw);
      if (!q) return true;
      return hitScore(text, q) > 0 || subseqScore(text, q) > 0;
    },

    /* 搜索结果：返回按类型分好组的数据，组内已排序、已截断 */
    search: function (kw, per) {
      var q = norm(kw);
      if (!q) return [];
      var limit = per || 4;
      return GROUPS.map(function (g) {
        var items = BUILDERS[g.key](q);
        items.sort(function (a, b) { return b.score - a.score; });
        return {
          key: g.key,
          label: g.label,
          total: items.length,
          items: items.slice(0, limit),
          more: items.length > limit,
          allHref: g.key === 'task'     ? 'tasks.html?q=' + encodeURIComponent(kw.trim())
                 : g.key === 'resource' ? 'library.html?q=' + encodeURIComponent(kw.trim())
                 : g.key === 'note'     ? 'messages.html?q=' + encodeURIComponent(kw.trim())
                 : 'schedule.html'
        };
      }).filter(function (g) { return g.total; });
  },

  /* 空态：还没输入时，按「去哪个页面找」给入口。
     不编「最近搜索」——原型里没有搜索历史这个数据，不该造假数据充数。 */
  overview: function () {
    var t = tasks().filter(function (x) { return x.status !== 'cancelled'; }).length;
    var r = resources().length;
    var ev = events().length;
    var names = {};
    courses().forEach(function (c) { names[c.name] = 1; });
    var un = window.NotifyStore ? window.NotifyStore.list().length : 0;
    return [
      { key: 'task', label: '任务', sub: t + ' 项待办与历史任务', icon: 'list', href: 'tasks.html' },
      { key: 'resource', label: '资料', sub: r + ' 份课件、习题与笔记', icon: 'book', href: 'library.html' },
      { key: 'schedule', label: '日程与课程', sub: ev + ' 项安排 · ' + Object.keys(names).length + ' 门课程', icon: 'calendar', href: 'schedule.html' },
      { key: 'note', label: '消息', sub: un + ' 条通知与提醒', icon: 'bell', href: 'messages.html' }
    ];
  }
};

  /* ============================================================
     搜索面板组件
     挂在顶栏里，聚焦即开；Esc 关，↑↓ 选，↵ 打开，Ctrl K 唤起
     ============================================================ */
  window.AppSearchBox = {
    name: 'AppSearchBox',
    data: function () {
      return {
        q: '',
        open: false,
        sel: 0,
        groups: [],
        /* 空态的分类入口也进同一套键盘选择，否则 Ctrl K 之后按 ↓ 没反应，
           用户会以为坏了 */
        cats: [],
        flat: []
      };
    },
    computed: {
      kw: function () { return this.q.trim().toLowerCase(); },
      /* 空态时 flat 装的是分类入口，不算搜索结果，页脚不能显示「共 4 条」 */
      total: function () { return this.kw ? this.flat.length : 0; }
    },
    watch: {
      q: function () { this.refresh(); }
    },
    mounted: function () {
      var self = this;
      this._onKey = function (ev) {
        if ((ev.ctrlKey || ev.metaKey) && String(ev.key).toLowerCase() === 'k') {
          ev.preventDefault();
          self.open = true;
          self.$nextTick(function () { if (self.$refs.inp) self.$refs.inp.focus(); });
        }
      };
      this._onDoc = function (ev) {
        if (!self.open) return;
        if (self.$el && self.$el.contains(ev.target)) return;
        self.open = false;
      };
      window.addEventListener('keydown', this._onKey);
      document.addEventListener('mousedown', this._onDoc);
    },
    beforeUnmount: function () {
      window.removeEventListener('keydown', this._onKey);
      document.removeEventListener('mousedown', this._onDoc);
    },
    methods: {
      refresh: function () {
        var flat = [];

        if (!this.kw) {
          this.groups = [];
          this.cats = window.AppSearch.overview().map(function (c, i) {
            c._i = i;
            flat.push(c);
            return c;
          });
          this.flat = flat;
          this.sel = 0;
          return;
        }

        this.cats = [];
        var gs = window.AppSearch.search(this.q, 4);
        gs.forEach(function (g) {
          g.items.forEach(function (it) {
            it._i = flat.length;
            flat.push(it);
          });
        });
        this.groups = gs;
        this.flat = flat;
        if (this.sel > flat.length - 1) this.sel = 0;
      },

      openPanel: function () {
        this.open = true;
        this.refresh();
      },

      close: function () {
        this.open = false;
        this.q = '';
        this.sel = 0;
        this.groups = [];
        this.cats = [];
        this.flat = [];
      },

      move: function (d) {
        var n = this.flat.length;
        if (!n) return;
        this.sel = (this.sel + d + n) % n;
        var self = this;
        this.$nextTick(function () {
          var rows = self.$refs.rows;
          if (!rows) return;
          var el = Array.isArray(rows) ? rows[self.sel] : (self.sel === 0 ? rows : null);
          if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
        });
      },

      onKey: function (ev) {
        if (ev.key === 'ArrowDown') { ev.preventDefault(); this.move(1); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); this.move(-1); }
        else if (ev.key === 'Enter') {
          ev.preventDefault();
          var it = this.flat[this.sel] || this.flat[0];
          if (it) this.go(it.href);
        } else if (ev.key === 'Escape') {
          ev.preventDefault();
          this.close();
          if (this.$refs.inp) this.$refs.inp.blur();
        }
      },

      go: function (href) { location.href = href; }
    },
    template: [
      '<div class="search" :class="{ on: open }">',
      '  <span class="s-ico"><app-icon name="search" :size="16"></app-icon></span>',
      '  <input ref="inp" v-model="q" autocomplete="off" spellcheck="false"',
      '         placeholder="搜索任务、资料、课程、日程…"',
      '         @focus="openPanel" @keydown="onKey" />',
      '  <span class="kbd s-kbd" v-if="!q">Ctrl K</span>',
      '  <button class="s-clear" v-else title="清空" @mousedown.prevent="q = \'\'">',
      '    <app-icon name="x" :size="13"></app-icon>',
      '  </button>',

      '  <div class="srch-panel" v-if="open">',

      /* 空态：还没输入，给分类入口 */
      '    <div class="srch-scroll" v-if="!kw">',
      '      <div class="srch-hint">在这些地方找</div>',
      '      <div class="srch-row cat" v-for="c in cats" :key="c.key" ref="rows"',
      '           :class="{ sel: sel === c._i }"',
      '           @mousedown.prevent="go(c.href)" @mouseenter="sel = c._i">',
      '        <span class="srch-ico"><app-icon :name="c.icon" :size="15"></app-icon></span>',
      '        <div class="srch-main">',
      '          <div class="srch-title">{{ c.label }}</div>',
      '          <div class="srch-sub">{{ c.sub }}</div>',
      '        </div>',
      '        <span class="srch-go">去<app-icon name="chev-right" :size="13"></app-icon></span>',
      '      </div>',
      '    </div>',

      /* 结果 */
      '    <div class="srch-scroll" v-else>',
      '      <div class="srch-sec" v-for="g in groups" :key="g.key">',
      '        <div class="srch-sec-hd">',
      '          <span class="sh-name">{{ g.label }}</span>',
      '          <span class="sh-num">{{ g.total }}</span>',
      '          <span class="sp"></span>',
      '          <span class="sh-all" v-if="g.more" @mousedown.prevent="go(g.allHref)">查看全部</span>',
      '        </div>',
      '        <div class="srch-row" v-for="it in g.items" :key="it.uid" ref="rows"',
      '             :class="{ sel: sel === it._i }"',
      '             @mousedown.prevent="go(it.href)" @mouseenter="sel = it._i">',
      '          <span class="srch-ico"><app-icon :name="it.icon" :size="15"></app-icon></span>',
      '          <div class="srch-main">',
      '            <div class="srch-title">',
      '              <template v-for="(s, si) in it.segsTitle" :key="si">',
      '                <mark v-if="s.hit">{{ s.t }}</mark><span v-else>{{ s.t }}</span>',
      '              </template>',
      '            </div>',
      '            <div class="srch-sub">',
      '              <template v-for="(s, si) in it.segsSub" :key="si">',
      '                <mark v-if="s.hit">{{ s.t }}</mark><span v-else>{{ s.t }}</span>',
      '              </template>',
      '            </div>',
      '          </div>',
      '          <span class="srch-meta" :class="it.tone" v-if="it.meta">{{ it.meta }}</span>',
      '        </div>',
      '      </div>',

      '      <div class="srch-none" v-if="!total">',
      '        <div class="sn-t">没有找到「{{ q.trim() }}」</div>',
      '        <div class="sn-s">可以搜任务标题、课程名、文件名、日程标题或通知标题。<br/>换个词，或者拆短一点试试。</div>',
      '      </div>',
      '    </div>',

      '    <div class="srch-foot">',
      '      <span class="sf-keys" v-if="!kw">输入关键词，或点上面的分类</span>',
      '      <span class="sf-keys" v-else-if="total"><b>↑↓</b> 选择 <b>↵</b> 打开 <b>esc</b> 关闭</span>',
      '      <span class="sf-keys" v-else>换个词，或者拆短一点</span>',
      '      <span class="sp"></span>',
      '      <span class="sf-num" v-if="total">共 {{ total }} 条结果</span>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n')
  };
})();
