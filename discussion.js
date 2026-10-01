/*
  discussion.js: Page / Discussion tabs + threaded discussion.

  Two modes:
   1) LOCAL (default): posts are saved only in the visitor's own browser. Good for testing.
   2) LIVE: shared comments stored in Supabase. Turn it on by filling SITE.supabase in content.js.
*/
(function () {
  const $ = s => document.querySelector(s);
  const CFG = (typeof SITE !== 'undefined' && SITE.supabase) || {};
  const SB = window.supabase;
  const LIVE = !!(CFG.url && CFG.anonKey && SB && SB.createClient);
  const sb = LIVE ? SB.createClient(CFG.url, CFG.anonKey) : null;
  const ARTIST_EMAIL = String((typeof SITE !== 'undefined' && SITE.artistEmail) || '').toLowerCase();

  const box = $('#dbody'), sortEl = $('#dsort'), sc0 = document.scrollingElement || document.documentElement;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const ago = t => { const m = Math.max(1, Math.round((Date.now() - t) / 6e4)); if (m < 60) return m + ' min ago'; const h = Math.round(m / 60); if (h < 24) return h + ' h ago'; return Math.round(h / 24) + ' d ago'; };
  const rid = () => { try { const a = new Uint8Array(12); crypto.getRandomValues(a); return Array.from(a, b => b.toString(16).padStart(2, '0')).join(''); } catch (e) { return Math.random().toString(36).slice(2) + Date.now().toString(36); } };
  const store = (k, v) => { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
  const read = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* this browser's own vote choices and anonymous voter id */
  const VK = 'pwl-votes-v2';
  let votes = {}; try { const w = JSON.parse(read(VK) || 'null'); if (w && typeof w === 'object') votes = w; } catch (e) {}
  const saveVotes = () => store(VK, JSON.stringify(votes));
  let voter = read('pwl-voter'); if (!voter || voter.length < 8) { voter = rid(); store('pwl-voter', voter); }

  /* ---------------- data layer ---------------- */
  const H = 3600e3;
  const seeds = () => { const n = Date.now(); return [
    { id: 'a1', p: null, n: 'Sample visitor', m: 'Clean layout and the 3D viewer is a great touch. (example comment)', r: 5, t: n - 52 * H, v: 4 },
    { id: 'a2', p: 'a1', n: 'Pukar', a: 1, m: 'Thanks! More models are coming soon. (example reply)', r: 0, t: n - 40 * H, v: 2 },
    { id: 'a3', p: 'a2', n: '', m: 'Looking forward to it. (example reply)', r: 0, t: n - 30 * H, v: 1 },
    { id: 'b1', p: null, n: '', m: 'Would love to see more process shots. (example comment)', r: 4, t: n - 20 * H, v: 2 },
    { id: 'b2', p: 'b1', n: 'Pukar', a: 1, m: 'Noted, breakdowns are on the way. (example reply)', r: 0, t: n - 10 * H, v: 1 }]; };

  const LK = 'pwl-thread-v2';
  const local = {
    items: null,
    load() { if (this.items) return; let v = null; try { v = JSON.parse(read(LK)); } catch (e) {} this.items = Array.isArray(v) ? v : seeds(); },
    save() { store(LK, JSON.stringify(this.items)); },
    async list() { this.load(); return this.items.map(c => Object.assign({}, c)); },
    async add(c) { this.load(); const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      this.items.push({ id, p: c.p, n: c.n, m: c.m, r: c.r, a: c.a ? 1 : 0, t: Date.now(), v: 0 }); this.save(); return id; },
    async vote(id, val, prev) { this.load(); const c = this.items.find(x => x.id === id); if (c) { c.v += val - prev; this.save(); } },
    async remove() {}
  };

  const remote = {
    async list() {
      const { data, error } = await sb.from('comments_public').select('*').order('created_at', { ascending: true }).limit(1000);
      if (error) throw error;
      return data.map(r => ({ id: r.id, p: r.parent_id, n: r.author, m: r.body, r: r.rating, a: r.is_artist, t: Date.parse(r.created_at), v: r.score }));
    },
    async add(c) {
      if (c.a) {
        const { data, error } = await sb.from('comments').insert({ parent_id: c.p, author: 'Pukar', body: c.m, rating: 0, is_artist: true }).select('id').single();
        if (error) throw error; return data.id;
      }
      const { data, error } = await sb.rpc('post_comment', { p_parent: c.p, p_author: c.n, p_body: c.m, p_rating: c.r });
      if (error) throw error; return data;
    },
    async vote(id, val) { const { error } = await sb.rpc('vote_comment', { p_comment: id, p_voter: voter, p_value: val }); if (error) throw error; },
    async remove(id) { const { error } = await sb.from('comments').delete().eq('id', id); if (error) throw error; }
  };
  const db = LIVE ? remote : local;

  /* ---------------- state ---------------- */
  let items = [], artist = false, offline = false, lastPost = 0;
  const collapsed = new Set();
  const kids = id => items.filter(c => c.p === id);
  const count = id => kids(id).reduce((a, c) => a + 1 + count(c.id), 0);
  const sorted = a => { const k = sortEl.value; return a.slice().sort((x, y) => k === 'new' ? y.t - x.t : k === 'old' ? x.t - y.t : (y.v - x.v) || (y.t - x.t)); };

  async function refresh() {
    try { items = await db.list(); offline = false; } catch (e) { offline = true; }
    render();
  }

  /* ---------------- artist login (live mode only) ---------------- */
  async function checkArtist() {
    if (!LIVE) return;
    try { const { data } = await sb.auth.getSession(); const e = data && data.session && data.session.user && data.session.user.email; artist = !!e && e.toLowerCase() === ARTIST_EMAIL; } catch (e) { artist = false; }
  }
  function authBar() {
    let bar = $('#dauth'); if (!LIVE) return;
    if (!bar) { bar = el('div', 'mut'); bar.id = 'dauth'; $('#davg').after(bar); }
    bar.textContent = '';
    if (artist) {
      bar.append('Artist mode is on. ');
      const o = el('button', 'lnk', 'Log out'); o.type = 'button';
      o.onclick = async () => { await sb.auth.signOut(); artist = false; authBar(); rebuildForm(); render(); };
      bar.appendChild(o);
    } else {
      const b = el('button', 'lnk', 'Artist login'); b.type = 'button';
      b.onclick = async () => {
        if (!ARTIST_EMAIL) return;
        const { error } = await sb.auth.signInWithOtp({ email: ARTIST_EMAIL, options: { shouldCreateUser: false, emailRedirectTo: location.href.split('#')[0] } });
        bar.textContent = error ? 'Could not send the login link.' : 'Check your email for the login link.';
      };
      bar.appendChild(b);
    }
  }

  /* ---------------- UI ---------------- */
  function form(parent, top) {
    const f = el('form', 'cf'); f.noValidate = true;
    const row = el('div', 'row'); if (!top) row.style.gridTemplateColumns = '1fr';
    const n = el('input'); n.maxLength = 40; n.placeholder = 'Name (optional)'; n.setAttribute('aria-label', 'Name (optional)'); row.appendChild(n);
    let r = null;
    if (top) { r = el('select'); [['0', 'No rating'], ['5', '5 stars'], ['4', '4 stars'], ['3', '3 stars'], ['2', '2 stars'], ['1', '1 star']].forEach(o => { const op = el('option', null, o[1]); op.value = o[0]; r.appendChild(op); }); r.setAttribute('aria-label', 'Rating (optional)'); row.appendChild(r); }
    const t = el('textarea'); t.maxLength = 500; t.placeholder = top ? 'Write a review or start a thread' : 'Write a reply'; t.setAttribute('aria-label', 'Comment'); t.style.marginTop = '8px';
    const hp = el('input', 'hp'); hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true');
    let ck = null, lb = null;
    if (!LIVE || artist) { lb = el('label'); lb.style.cssText = 'display:flex;gap:6px;align-items:center;margin-top:6px'; ck = el('input'); ck.type = 'checkbox'; ck.style.width = 'auto'; lb.append(ck, LIVE ? 'Post as the artist' : 'Post as the artist (demo only)'); }
    const bt = el('button', null, top ? 'Post' : 'Reply'); bt.type = 'submit';
    const ms = el('span'); ms.style.cssText = 'font-size:12px;margin-left:8px'; ms.setAttribute('role', 'status');
    f.append(row, t, hp); if (lb) f.appendChild(lb); f.append(bt, ms);
    if (!top) { const c = el('button', null, 'Cancel'); c.type = 'button'; c.style.marginLeft = '6px'; c.onclick = () => f.remove(); f.appendChild(c); }
    f.onsubmit = async e => {
      e.preventDefault(); if (hp.value) return;
      const m = t.value.trim(); if (!m) { ms.textContent = 'Please write something first.'; return; }
      if (Date.now() - lastPost < 8000) { ms.textContent = 'Please wait a few seconds between posts.'; return; }
      const asArtist = !!(ck && ck.checked);
      bt.disabled = true; ms.textContent = 'Posting...';
      try {
        const id = await db.add({ p: parent, n: asArtist ? 'Pukar' : n.value.trim().slice(0, 40), m: m.slice(0, 500), r: r ? +r.value : 0, a: asArtist });
        lastPost = Date.now();
        try { votes[id] = 1; saveVotes(); await db.vote(id, 1, 0); } catch (e2) {}
        if (parent) collapsed.delete(parent);
        t.value = ''; if (r) r.value = '0'; ms.textContent = top ? 'Posted.' : '';
        await refresh();
      } catch (err) { ms.textContent = 'Could not post right now. Please try again later.'; }
      bt.disabled = false;
    };
    return f;
  }
  function rebuildForm() { const h = $('#dform'); h.textContent = ''; h.appendChild(form(null, true)); }

  function node(c, depth) {
    const col = collapsed.has(c.id), d = el('div', 'th' + (col ? ' col' : ''));
    const h = el('div', 'hd');
    const cb = el('button', null, col ? '[+]' : '[\u2013]'); cb.type = 'button'; cb.setAttribute('aria-label', col ? 'Expand thread' : 'Collapse thread');
    cb.onclick = () => { col ? collapsed.delete(c.id) : collapsed.add(c.id); render(); };
    h.append(cb, el('b', null, c.n || 'Anonymous'));
    if (c.a) h.appendChild(el('span', 'badge', 'Artist'));
    if (c.r) { const st = el('span', 'st', '\u2605'.repeat(c.r) + '\u2606'.repeat(5 - c.r)); st.setAttribute('aria-label', c.r + ' out of 5 stars'); h.appendChild(st); }
    h.appendChild(el('span', null, ago(c.t)));
    if (col && count(c.id)) h.appendChild(el('span', null, '(' + count(c.id) + ' hidden)'));
    const tx = el('div', 'tx', c.m), ac = el('div', 'ac');
    const up = el('button', null, '\u25B2'), dn = el('button', null, '\u25BC'), sc = el('span', null, String(c.v));
    up.type = dn.type = 'button'; up.setAttribute('aria-label', 'Upvote'); dn.setAttribute('aria-label', 'Downvote');
    up.setAttribute('aria-pressed', votes[c.id] === 1); dn.setAttribute('aria-pressed', votes[c.id] === -1);
    const vote = async x => {
      const cur = votes[c.id] || 0, nx = cur === x ? 0 : x;
      try { await db.vote(c.id, nx, cur); } catch (e) { return; }
      c.v += nx - cur; if (nx) votes[c.id] = nx; else delete votes[c.id]; saveVotes(); render();
    };
    up.onclick = () => vote(1); dn.onclick = () => vote(-1);
    const rp = el('button', null, 'Reply'); rp.type = 'button'; const slot = el('div');
    rp.onclick = () => { if (slot.firstChild) { slot.textContent = ''; return; } slot.appendChild(form(c.id, false)); slot.querySelector('textarea').focus(); };
    ac.append(up, sc, dn, rp);
    if (LIVE && artist) {
      const del = el('button', null, 'Delete'); del.type = 'button';
      del.onclick = async () => { if (!confirm('Delete this comment and its replies?')) return; try { await db.remove(c.id); await refresh(); } catch (e) {} };
      ac.appendChild(del);
    }
    const k = el('div', 'kids' + (depth >= 5 ? ' flat' : ''));
    sorted(kids(c.id)).forEach(x => k.appendChild(node(x, depth + 1)));
    const bd = el('div', 'tb'); bd.append(tx, ac, slot, k); d.append(h, bd); return d;
  }

  function render() {
    const st = sc0.scrollTop; box.textContent = '';
    if (offline) box.appendChild(el('p', null, 'The discussion is temporarily offline. Please try again later.'));
    else {
      sorted(items.filter(c => c.p === null)).forEach(c => box.appendChild(node(c, 0)));
      if (!items.length) box.appendChild(el('p', null, 'No comments yet. Be the first.'));
    }
    const rs = items.filter(c => c.r && c.p === null), n = items.length;
    const txt = offline ? '' : (rs.length ? 'Average rating: ' + (rs.reduce((a, c) => a + c.r, 0) / rs.length).toFixed(1) + ' out of 5 from ' + rs.length + ' review' + (rs.length > 1 ? 's' : '') + '. ' : '') + n + ' comment' + (n === 1 ? '' : 's') + ' in the discussion.';
    const a = $('#avg'); if (a) a.textContent = txt; const b = $('#davg'); if (b) b.textContent = txt;
    sc0.scrollTop = st;
  }

  /* ---------------- Page / Discussion tabs ---------------- */
  let cur = 'page', busy = false;
  function switchTo(n, cb) {
    if (busy) return;
    if (n === cur) { cb && cb(); return; }
    const A = $('#v-' + cur), B = $('#v-' + n), calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    busy = true;
    const done = () => {
      A.hidden = true; A.classList.remove('out'); B.classList.add('out'); B.hidden = false; void B.offsetWidth; B.classList.remove('out');
      cur = n; ['page', 'disc'].forEach(k => { const t = $('#t-' + k); t.classList.toggle('on', k === n); t.setAttribute('aria-selected', k === n); });
      $('#q').style.visibility = n === 'page' ? 'visible' : 'hidden';
      window.scrollTo(0, 0); dispatchEvent(new Event('resize')); if (n === 'disc') refresh(); busy = false; cb && cb();
    };
    if (calm) done(); else { A.classList.add('out'); setTimeout(done, 180); }
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab]');
    if (t) { e.preventDefault(); switchTo(t.dataset.tab); return; }
    const a = e.target.closest('a[href^="#"]');
    if (a && cur === 'disc') { e.preventDefault(); const id = a.getAttribute('href').slice(1), tg = id && id !== 'top' ? document.getElementById(id) : null; switchTo('page', () => tg ? tg.scrollIntoView() : window.scrollTo(0, 0)); }
  });
  sortEl.onchange = render;

  /* ---------------- start ---------------- */
  (async () => {
    const note = $('#v-disc .box'); if (LIVE && note) note.hidden = true;
    if (LIVE) { await checkArtist(); sb.auth.onAuthStateChange(() => { checkArtist().then(() => { authBar(); rebuildForm(); render(); }); }); }
    rebuildForm(); authBar(); await refresh();
  })();
})();
