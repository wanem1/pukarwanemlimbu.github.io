/*
  Run from your project folder (the one with index.html and content.js):
      node apply-discussion.js
  It backs up your files (*.bak), swaps the old in-page discussion code for discussion.js,
  adds the Supabase script tags and a little CSS, and adds the config keys to content.js.
  Safe to run twice.
*/
const fs = require('fs');
const read = f => fs.readFileSync(f, 'utf8');
if (!fs.existsSync('index.html') || !fs.existsSync('content.js') || !fs.existsSync('discussion.js')) {
  console.error('Run this in the folder that contains index.html, content.js and discussion.js'); process.exit(1);
}
let html = read('index.html'), cfg = read('content.js');

if (html.includes('src="discussion.js"')) {
  console.log('index.html already uses discussion.js, skipping the page changes.');
} else {
  const a = html.search(/\(function\s*\(\s*\)\s*\{\s*const KEY\s*=\s*'pwl-thread-v2'/);
  if (a < 0) { console.error('Could not find the old discussion block (it starts with: const KEY=\'pwl-thread-v2\'). Remove it by hand, see INSTALL.md.'); process.exit(1); }
  const rest = html.slice(a + 10);
  const m = rest.search(/\n\s*\(function\s*\(\s*\)\s*\{\s*\n?\s*const cv\s*=\s*\$\('#gl'\)/);
  if (m < 0) { console.error('Could not find where the old discussion block ends. Remove it by hand, see INSTALL.md.'); process.exit(1); }
  fs.writeFileSync('index.html.bak', html);
  html = html.slice(0, a) + html.slice(a + 10 + m + 1);
  const tags = '<script src="content.js"></script>\n<script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script defer src="discussion.js"></script>';
  if (!html.includes('<script src="content.js"></script>')) { console.error('Could not find <script src="content.js"></script> in index.html.'); process.exit(1); }
  html = html.replace('<script src="content.js"></script>', tags);
  if (!html.includes('.lnk{')) html = html.replace('</style>', '.lnk{background:none;border:0;color:var(--link);font:inherit;cursor:pointer;padding:0;text-decoration:underline}\n</style>');
  fs.writeFileSync('index.html', html);
  console.log('index.html updated (backup: index.html.bak)');
}

if (/supabase\s*:/.test(cfg)) {
  console.log('content.js already has a supabase section, skipping.');
} else {
  const em = (cfg.match(/email\s*:\s*"([^"]+)"/) || [])[1] || '';
  fs.writeFileSync('content.js.bak', cfg);
  cfg = cfg.replace(/const SITE\s*=\s*\{/, 'const SITE = {\n\n  // Discussion backend. Leave url and anonKey empty to keep the local test mode.\n  supabase: { url: "", anonKey: "" },\n  artistEmail: "' + em + '",\n');
  fs.writeFileSync('content.js', cfg);
  console.log('content.js updated (backup: content.js.bak). Now fill in supabase.url and supabase.anonKey.');
}
