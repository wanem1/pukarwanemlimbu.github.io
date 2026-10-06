/*
  Adds a "Latest articles" section (3 newest + a "View all articles" button) to the main page,
  with links in the sidebar and the Contents box. The articles come from articles/latest.js,
  which the article kit writes every time you run:  node build.js
  Run in the folder that contains index.html:   node apply-articles.js
  Makes a backup first (index.html.before-articles). Safe to run twice.
*/
const fs = require('fs');
if (!fs.existsSync('index.html')) { console.error('Run this in the folder that contains index.html'); process.exit(1); }
let h = fs.readFileSync('index.html', 'utf8');
if (h.includes('id="articles-sec"')) { console.log('Already added, nothing to do.'); process.exit(0); }
const need = (ok, what) => { if (!ok) { console.error('Could not find ' + what + '. Nothing was changed.'); process.exit(1); } };
need(h.includes('<div id="pager"></div>'), 'the Work pager (<div id="pager"></div>)');
need(h.includes('<script src="content.js"></script>'), '<script src="content.js"></script>');
need(h.includes('</body>'), '</body>');
fs.writeFileSync('index.html.before-articles', h);

h = h.replace('<div id="pager"></div>', `<div id="pager"></div>

  <section id="articles-sec">
    <h2 id="articles">Latest articles</h2>
    <div class="acards" id="acards"></div>
    <p class="more"><a class="btn-more" id="amore" href="articles/index.html">View all articles &#9656;</a></p>
  </section>`);
h = h.replace('<script src="content.js"></script>', '<script src="content.js"></script>\n<script src="articles/latest.js"></script>');
h = h.replace('<a href="#work">Work</a><a href="#viewer">3D viewer</a>', '<a href="#work">Work</a><a href="#articles" data-art-link>Articles</a><a href="#viewer">3D viewer</a>');
h = h.replace('<li><a href="#viewer">3D viewer</a></li>', '<li><a href="#articles" data-art-link>Latest articles</a></li><li><a href="#viewer">3D viewer</a></li>');

const css = `/* latest articles */
.acards{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));border-top:2px solid var(--mute);border-left:2px solid var(--mute);margin:6px 0 14px}
.acard{display:flex;flex-direction:column;min-width:0;background:var(--cell);color:inherit;text-decoration:none;border-right:2px solid var(--mute);border-bottom:2px solid var(--mute)}
.acard:hover,.acard:focus-visible{outline:2px solid var(--link);outline-offset:-2px}
.acard .ak{background:var(--th);padding:8px 12px;font-weight:700;font-size:13px;border-bottom:1px solid var(--mute)}
.acard .at{display:block;padding:14px 14px 6px;color:var(--link);font-size:19px;line-height:1.3;font-weight:700}
.acard:hover .at{text-decoration:underline}
.acard .as{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;padding:0 14px 14px;font-size:14px;line-height:1.55;flex:1}
.acard .am{background:var(--th);padding:8px 12px;font-size:12.5px;color:var(--mute);border-top:1px solid var(--mute)}
.btn-more{display:inline-block;border:2px solid var(--mute);background:var(--th);color:var(--ink);padding:10px 20px;font-weight:700;text-decoration:none}
.btn-more:hover,.btn-more:focus-visible{border-color:var(--link);color:var(--link)}
section[hidden],li[hidden],[data-art-link][hidden]{display:none!important}
@media (max-width:900px){.acards{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.acards{grid-template-columns:1fr}}
`;
h = h.replace('</style>', css + '</style>');

const js = `<script>
(function(){
  const sec=document.getElementById('articles-sec');if(!sec)return;
  let list=(typeof ARTICLES!=='undefined'&&ARTICLES)||((typeof SITE!=='undefined'&&SITE.articles)||[]);
  list=list.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const links=document.querySelectorAll('[data-art-link]');
  if(!list.length){sec.hidden=true;links.forEach(l=>(l.closest('li')||l).hidden=true);return}
  const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmt=d=>{const m=/^(\\d{4})-(\\d{2})/.exec(String(d));return m?M[+m[2]-1]+' '+m[1]:String(d||'')};
  const top=list.slice(0,3),box=document.getElementById('acards');
  box.style.setProperty('--n',top.length);
  top.forEach(a=>{const c=document.createElement('a');c.className='acard';c.href=a.url;
    [['ak',a.category||'Article'],['at',a.title],['as',a.summary||''],['am',[fmt(a.date),a.mins?a.mins+' min read':''].filter(Boolean).join('  |  ')]]
      .forEach(([k,t])=>{const s=document.createElement('span');s.className=k;s.textContent=t;c.appendChild(s)});box.appendChild(c)});
  const more=document.getElementById('amore');
  if(typeof ARTICLES_INDEX!=='undefined')more.href=ARTICLES_INDEX;
  more.textContent=(list.length>top.length?'View all '+list.length+' articles':'View all articles')+' \\u25B8';
})();
</script>
`;
h = h.replace('</body>', js + '</body>');
fs.writeFileSync('index.html', h);
console.log('Done. "Latest articles" added (backup: index.html.before-articles). Run node build.js in coursework-kit to refresh articles/latest.js.');
