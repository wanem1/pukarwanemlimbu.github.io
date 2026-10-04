/* Builds every Markdown file in docs/ into a page in the coursework folder, plus an index page.
   Usage: npm install   (once)   then   node build.js        */
const fs = require('fs'), path = require('path');
const matter = require('gray-matter'), { marked } = require('marked');
const cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const OUT = path.resolve(cfg.outDir), DOCS = path.resolve('docs');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CSS = fs.readFileSync('template.css', 'utf8');
fs.mkdirSync(OUT, { recursive: true });

function shell(title, desc, body, extraHead = '') {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">${extraHead}
<style>${CSS}</style></head><body>
<header><a class="site" href="${cfg.homeLink}"><b>${esc(cfg.siteName)}</b></a><nav><a href="${cfg.homeLink}">Portfolio</a><a href="index.html">${esc(cfg.sectionName)}</a></nav></header>
${body}</body></html>`;
}

const docs = [];
for (const f of fs.readdirSync(DOCS).filter(f => f.endsWith('.md') && !f.startsWith('_'))) {
  const { data: m, content } = matter(fs.readFileSync(path.join(DOCS, f), 'utf8'));
  if (m.draft) continue;
  m.slug = m.slug || f.replace(/\.md$/, '');
  let md = content;
  const notes = [];                                              // footnotes: [^1]: text
  md = md.replace(/^\[\^(\d+)\]:\s*(.+)$/gm, (_, n, t) => { notes.push([n, t]); return ''; });
  md = md.replace(/\[\^(\d+)\]/g, (_, n) => `<sup id="fnref-${n}"><a href="#fn-${n}">${n}</a></sup>`);
  let html = marked.parse(md, { gfm: true });
  const toc = [];
  html = html.replace(/<h([234])>(.*?)<\/h\1>/g, (_, l, t) => { const id = slug(t); if (l < 4) toc.push([+l, id, t.replace(/<[^>]+>/g, '')]); return `<h${l} id="${id}">${t}</h${l}>`; });
  html = html.replace(/<p><img src="([^"]+)" alt="([^"]*)"[^>]*><\/p>/g, (_, src, alt) => {
    const has = fs.existsSync(path.join(DOCS, src));
    return `<figure>${has ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : `<div class="ph">Image not added yet</div>`}<figcaption>${alt}</figcaption></figure>`; });
  html = html.replace(/<table>/g, '<div class="tblwrap"><table>').replace(/<\/table>/g, '</table></div>');
  html = html.replace(/<p>(Table \d+[:.][^<]*)<\/p>/g, '<p class="cap">$1</p>');
  html = html.replace(/(<h2 id="(?:references|sources)">[\s\S]*?<\/h2>)([\s\S]*)$/, '$1<div class="refs">$2</div>');
  if (notes.length) html += `<section class="notes"><h2 id="notes">Notes</h2><ol>${notes.map(([n, t]) => `<li id="fn-${n}">${marked.parseInline(t)} <a href="#fnref-${n}">Back</a></li>`).join('')}</ol></section>`;

  const parts = String(m.author || '').trim().split(/\s+/), last = parts.pop() || '', ini = parts.map(p => p[0] + '.').join(' ');
  const year = String(m.date || '').slice(0, 4);
  const url = `${cfg.baseUrl.replace(/\/$/, '')}/${path.basename(OUT)}/${m.slug}.html`;
  const cite = `${last}, ${ini} (${year}). ${m.title}. ${m.moduleName ? m.moduleName + ' (' + m.module + '), ' : ''}${m.institution || ''}. ${m.type || 'Coursework'}. Available at: ${url}`;
  const rows = [['Module', [m.module, m.moduleName].filter(Boolean).join(': ')], ['Institution', m.institution], ['Level', m.level], ['Type', m.type], ['Author', m.author], ['Date', m.date], ['Word count', m.words && Number(m.words).toLocaleString('en-GB')], ['Grade', m.grade]].filter(r => r[1]);
  const art = m.layout === 'article';
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).length, mins = Math.max(1, Math.round(words / 220));
  const body = art ? `<div class="wrap art"><main><nav class="crumb"><a href="index.html">${esc(cfg.sectionName)}</a>${m.category ? ' / ' + esc(m.category) : ''}</nav>
<h1>${esc(m.title)}</h1><p class="lead">${esc(m.standfirst || m.summary || '')}</p>
<p class="byline"><b>${esc(m.author)}</b> | ${esc(m.date)} | ${mins} min read${m.adapted ? ' | ' + esc(m.adapted) : ''}</p>
${(m.points || []).length ? `<div class="points"><b>In brief</b><ul>${m.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>` : ''}
<article>${html}</article>
<p class="rights">${esc(m.rights || cfg.rights || '')}</p>
<section class="cite"><h2 id="cite">How to cite this article</h2><p id="ct">${esc(last + ', ' + ini + ' (' + year + '). ' + m.title + '. [Online] Available at: ' + url)} [Accessed <span id="ad"></span>].</p><div class="actions"><button type="button" id="cp">Copy citation</button><button type="button" onclick="window.print()">Print or save as PDF</button><span id="cs" role="status"></span></div></section></main>
<aside><table class="info">${[['Author', m.author], ['Published', m.date], ['Reading time', mins + ' min']].map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}${m.tags && m.tags.length ? `<tr><th>Topics</th><td>${m.tags.map(t => `<span class="tag">${esc(t)}</span>`).join(' ')}</td></tr>` : ''}</table>
<details class="toc" open><summary>In this article</summary><ol>${toc.map(([l, id, t]) => `<li class="l${l}"><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol></details></aside></div>
<script>const d=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});document.getElementById('ad').textContent=d;document.getElementById('cp').onclick=async()=>{const t=document.getElementById('ct').textContent;try{await navigator.clipboard.writeText(t);document.getElementById('cs').textContent='Copied.'}catch(e){document.getElementById('cs').textContent='Select the citation text and copy it.'}};</script>` : `<div class="wrap"><main><nav class="crumb"><a href="index.html">${esc(cfg.sectionName)}</a> / ${esc(m.module || '')}</nav>
<h1>${esc(m.title)}</h1><p class="lead">${esc(m.summary || '')}</p>
<p class="notice"><b>Note:</b> ${esc(cfg.notice)}</p>
<div class="actions"><button type="button" id="cp">Copy citation</button><button type="button" onclick="window.print()">Print or save as PDF</button><span id="cs" role="status"></span></div>
<article>${html}</article>
<section class="cite"><h2 id="cite">Cite this page</h2><p id="ct">${esc(cite)} [Accessed <span id="ad"></span>].</p></section></main>
<aside><table class="info">${rows.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}${m.tags && m.tags.length ? `<tr><th>Tags</th><td>${m.tags.map(t => `<span class="tag">${esc(t)}</span>`).join(' ')}</td></tr>` : ''}</table>
<details class="toc" open><summary>Contents</summary><ol>${toc.map(([l, id, t]) => `<li class="l${l}"><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol></details></aside></div>
<script>const d=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});document.getElementById('ad').textContent=d;
document.getElementById('cp').onclick=async()=>{const t=document.getElementById('ct').textContent;try{await navigator.clipboard.writeText(t);document.getElementById('cs').textContent='Copied.'}catch(e){document.getElementById('cs').textContent='Select the text under "Cite this page" and copy it.'}};</script>`;
  const meta = `<meta name="citation_title" content="${esc(m.title)}"><meta name="citation_author" content="${esc(m.author)}"><meta name="citation_publication_date" content="${esc(m.date)}">`;
  fs.writeFileSync(path.join(OUT, m.slug + '.html'), shell(`${m.title} | ${cfg.siteName}`, m.summary || m.title, body, meta));
  docs.push(m);
}
const imgSrc = path.join(DOCS, 'images');
if (fs.existsSync(imgSrc)) fs.cpSync(imgSrc, path.join(OUT, 'images'), { recursive: true });

docs.sort((a, b) => String(b.date).localeCompare(String(a.date)));
const tags = [...new Set(docs.flatMap(d => d.tags || []))];
const idx = `<div class="wrap one"><main><h1>${esc(cfg.sectionName)}</h1><p class="lead">${esc(cfg.intro)}</p>
<input id="q" type="search" placeholder="Search" aria-label="Search">
<div class="filters">${['All', ...tags].map((t, i) => `<button type="button" aria-pressed="${i === 0}" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>
<div id="list">${docs.map(d => `<a class="card" href="${d.slug}.html" data-tags="${esc((d.tags || []).join('|'))}"><b>${esc(d.title)}</b><span class="meta">${esc([d.category || d.module, d.type, String(d.date)].filter(Boolean).join(' | '))}</span><span>${esc(d.standfirst || d.summary || '')}</span></a>`).join('')}</div></main></div>
<script>let tag='All';const q=document.getElementById('q'),cs=[...document.querySelectorAll('.card')];
function f(){const s=q.value.toLowerCase();cs.forEach(c=>c.hidden=!((tag==='All'||c.dataset.tags.split('|').includes(tag))&&c.textContent.toLowerCase().includes(s)))}
q.oninput=f;document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{tag=b.dataset.t;document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));f()});</script>`;
fs.writeFileSync(path.join(OUT, 'index.html'), shell(`${cfg.sectionName} | ${cfg.siteName}`, cfg.intro, idx));
console.log(`Built ${docs.length} page(s) into ${OUT}`);
