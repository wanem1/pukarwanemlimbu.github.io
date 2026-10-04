/*
  Run from your project folder (the one with index.html and content.js):
      node apply-contact.js
  Adds the contact form to the Contact section, the contact.js script tag, a little CSS,
  and a "contact" entry in content.js. Makes backups first. Safe to run twice.
*/
const fs = require('fs');
if (!fs.existsSync('index.html') || !fs.existsSync('content.js') || !fs.existsSync('contact.js')) {
  console.error('Run this in the folder that contains index.html, content.js and contact.js'); process.exit(1);
}
let html = fs.readFileSync('index.html', 'utf8'), cfg = fs.readFileSync('content.js', 'utf8');

const FORM = `
  <form class="cf" id="contact-form" novalidate>
    <div class="row">
      <div><label for="cf-name">Name</label><input id="cf-name" maxlength="80" autocomplete="name" required></div>
      <div><label for="cf-mail">Your email</label><input id="cf-mail" type="email" maxlength="120" autocomplete="email" inputmode="email" required></div>
    </div>
    <label for="cf-sub">Subject (optional)</label><input id="cf-sub" maxlength="120">
    <label for="cf-msg">Message</label><textarea id="cf-msg" maxlength="2000" required></textarea>
    <input type="checkbox" id="cf-bot" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit" id="cf-send">Send message</button> <span id="cf-status" class="cstat" role="status" aria-live="polite"></span>
  </form>`;
const CSS = '.cstat{font-size:13px;margin-left:8px}\n.cstat.ok{color:#3cb371}\n.cstat.bad{color:#e5534b}\n';

if (html.includes('id="contact-form"')) {
  console.log('index.html already has the contact form, skipping.');
} else {
  const re = /(<h2 id="contact">Contact<\/h2>[\s\S]*?<div class="box idea">[\s\S]*?<\/div>)/;
  if (!re.test(html)) { console.error('Could not find the Contact section (<h2 id="contact"> followed by the "Idea" box). Add the form by hand, see INSTALL.md.'); process.exit(1); }
  fs.writeFileSync('index.html.before-contact', html);
  html = html.replace(re, '$1' + FORM);
  const tag = '<script defer src="contact.js"></script>';
  if (!html.includes(tag)) {
    if (html.includes('<script defer src="discussion.js"></script>')) html = html.replace('<script defer src="discussion.js"></script>', '<script defer src="discussion.js"></script>\n' + tag);
    else if (html.includes('<script src="content.js"></script>')) html = html.replace('<script src="content.js"></script>', '<script src="content.js"></script>\n' + tag);
    else { console.error('Could not find a place for the script tag. Add ' + tag + ' before </body> by hand.'); process.exit(1); }
  }
  if (!html.includes('.cstat{')) html = html.replace('</style>', CSS + '</style>');
  fs.writeFileSync('index.html', html);
  console.log('index.html updated (backup: index.html.before-contact)');
}
if (/contact\s*:\s*\{/.test(cfg)) {
  console.log('content.js already has a contact section, skipping.');
} else {
  fs.writeFileSync('content.js.before-contact', cfg);
  cfg = cfg.replace(/const SITE\s*=\s*\{/, 'const SITE = {\n\n  // Contact form: paste your Web3Forms access key here (see INSTALL.md).\n  contact: { accessKey: "" },\n');
  fs.writeFileSync('content.js', cfg);
  console.log('content.js updated (backup: content.js.before-contact). Now paste your access key.');
}
