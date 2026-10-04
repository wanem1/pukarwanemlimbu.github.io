/*
  contact.js: sends the contact form to your Gmail through Web3Forms (free).
  Setup: put your access key in content.js ->  contact: { accessKey: "YOUR_KEY" }
  Without a key, the form opens the visitor's email app instead, so nothing breaks.
*/
(function () {
  const f = document.getElementById('contact-form');
  if (!f) return;
  const CFG = (typeof SITE !== 'undefined' && SITE.contact) || {};
  const EMAIL = (typeof SITE !== 'undefined' && SITE.email) || '';
  const $ = id => document.getElementById(id);
  const name = $('cf-name'), mail = $('cf-mail'), sub = $('cf-sub'), msg = $('cf-msg'), bot = $('cf-bot'), btn = $('cf-send'), out = $('cf-status');
  let last = 0;

  const say = (t, ok) => { out.textContent = t; out.className = 'cstat' + (ok === true ? ' ok' : ok === false ? ' bad' : ''); };
  const valid = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (bot.checked) return;                                        /* hidden trap field: bots tick it, people never see it */
    const n = name.value.trim(), m = mail.value.trim(), s = sub.value.trim(), t = msg.value.trim();
    if (!n || !m || !t) { say('Please fill in your name, email and message.', false); return; }
    if (!valid(m)) { say('That email address does not look right.', false); return; }
    if (Date.now() - last < 15000) { say('Please wait a few seconds before sending again.', false); return; }

    if (!CFG.accessKey) {                                           /* not connected yet: fall back to the visitor's email app */
      location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(s || 'Message from your portfolio') +
        '&body=' + encodeURIComponent(t + '\n\n' + n + ' (' + m + ')');
      say('The form is not connected yet, so your email app should open instead.');
      return;
    }

    btn.disabled = true; say('Sending...');
    try {
      const r = await fetch(CFG.endpoint || 'https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CFG.accessKey,
          subject: 'Portfolio message: ' + (s || 'no subject'),
          from_name: 'Portfolio contact form',
          name: n, email: m, message: t
        })
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.success) { last = Date.now(); f.reset(); say('Thank you! Your message was sent. I will reply by email soon.', true); }
      else say('Sorry, the message could not be sent' + (j.message ? ' (' + j.message + ')' : '') + '. You can email me directly at ' + EMAIL + '.', false);
    } catch (err) {
      say('Sorry, something went wrong. You can email me directly at ' + EMAIL + '.', false);
    }
    btn.disabled = false;
  });
})();
