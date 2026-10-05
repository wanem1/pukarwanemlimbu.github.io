/*
  Work section: vertical cards, stuck together with no gaps, that keep the look of the old table
  (grey label cells, thin borders, blue project link) with big images shown in full.
  Run in the folder that contains index.html:   node apply-gallery.js
  Works whether you still have the old table or one of the earlier card versions.
  Makes a backup first (index.html.before-gallery). Safe to run twice.
*/
const fs = require('fs');
if (!fs.existsSync('index.html')) { console.error('Run this in the folder that contains index.html'); process.exit(1); }
let h = fs.readFileSync('index.html', 'utf8');
const need = (ok, what) => { if (!ok) { console.error('Could not find ' + what + '. Nothing was changed.'); process.exit(1); } };

const rowRe = /g\.innerHTML=W\.map\([\s\S]*?\.join\(''\);/;
need(rowRe.test(h), 'the code that builds the work list (g.innerHTML=W.map...)');
fs.writeFileSync('index.html.before-gallery', h);

if (!h.includes('id="cards"')) {                                   // still the old table: convert the structure first
  const tbl = /<div class="tblwrap"><table id="tbl">[\s\S]*?<\/table><\/div>/;
  need(tbl.test(h), 'the Work table markup');
  need(h.includes("g=$('#tbl tbody')"), "g=$('#tbl tbody')");
  need(h.includes("e.target.closest('tr')"), "closest('tr')");
  need(h.includes("g.querySelectorAll('tr')"), "g.querySelectorAll('tr')");
  h = h.replace(tbl, '<div id="cards" class="cards"></div>')
       .replace("g=$('#tbl tbody')", "g=$('#cards')")
       .replace("e.target.closest('tr')", "e.target.closest('.card')")
       .replace("g.querySelectorAll('tr')", "g.querySelectorAll('.card')");
}

h = h.replace(rowRe, () => "g.innerHTML=W.map((w,i)=>`<button type=\"button\" class=\"card\" data-i=\"${i}\" data-t=\"${w.t}\"><span class=\"art\" style=\"background:${w.bg}\"><img src=\"${w.img}\" alt=\"${w.n}\" loading=\"lazy\"></span><span class=\"row\"><span class=\"k\">Project</span><span class=\"v t\">${w.n}</span></span><span class=\"row\"><span class=\"k\">Type</span><span class=\"v\">${w.t}</span></span><span class=\"row\"><span class=\"k\">Tags</span><span class=\"v\">${w.k}</span></span></button>`).join('');");

const errLine = "g.addEventListener('error',e=>{if(e.target.tagName==='IMG')e.target.hidden=true},true);";
if (!h.includes("classList.add('loaded')") && h.includes(errLine)) {
  h = h.replace(errLine, errLine + "\ng.addEventListener('load',e=>{if(e.target.tagName==='IMG')e.target.parentNode.classList.add('loaded')},true);\ng.querySelectorAll('.art img').forEach(i=>{if(i.complete&&i.naturalWidth)i.parentNode.classList.add('loaded')});");
}

const css = `/* joined work cards */
.cards{column-width:300px;column-gap:0;border-top:2px solid var(--mute);border-left:2px solid var(--mute);margin:6px 0 10px}
.card{display:block;width:100%;padding:0;margin:0;text-align:left;font:inherit;color:inherit;background:var(--cell);border:0;border-right:2px solid var(--mute);border-bottom:2px solid var(--mute);cursor:pointer;break-inside:avoid;-webkit-column-break-inside:avoid;page-break-inside:avoid}
.card:hover,.card:focus-visible{outline:2px solid var(--link);outline-offset:-2px}
.card[hidden]{display:none}
.card .art{display:block;aspect-ratio:4/5;overflow:hidden}
.card .art.loaded{aspect-ratio:auto}
.card .art img{display:block;width:100%;height:auto}
.card .art img[hidden]{display:none}
.card .row{display:grid;grid-template-columns:78px 1fr;border-top:1px solid var(--mute)}
.card .k{background:var(--th);padding:7px 8px;font-weight:700;font-size:13px;text-align:center;border-right:1px solid var(--mute)}
.card .v{padding:7px 10px;font-size:14px;overflow-wrap:anywhere}
.card .t{color:var(--link)}
.card:hover .t{text-decoration:underline}
#dlg{border:2px solid var(--mute)}
@media (max-width:760px){.card .row{grid-template-columns:62px 1fr}.card .k,.card .v{font-size:12.5px;padding:6px}}
@media (max-width:520px){.cards{column-width:auto;column-count:1}}
@media (prefers-reduced-motion:reduce){.card{transition:none}}
`;
const blockRe = /\/\* (?:boxy|flat|table-style|joined) work cards \*\/[\s\S]*?@media \(prefers-reduced-motion:reduce\)\{\.card\{transition:none\}\}\n/;
h = blockRe.test(h) ? h.replace(blockRe, () => css) : h.replace('</style>', css + '</style>');
fs.writeFileSync('index.html', h);
console.log('Done. Work is now joined vertical cards with big images and no gaps (backup: index.html.before-gallery).');
