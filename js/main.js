/* =========================================================
   Vishal Vishwakarma — Portfolio (GUI + terminal overlay)
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     DATA
     ============================================================ */
  const ICONS = {
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .9-8.91 6 6 0 0 0-11.6-1.3A4.5 4.5 0 0 0 7 19h10.5z"/><path d="M12 11.2l2.4.85v1.7c0 1.45-1 2.4-2.4 3-1.4-.6-2.4-1.55-2.4-3v-1.7L12 11.2z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    term: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  };
  const EXPERTISE = [
    ['cpu', 'AI / LLM Security', "The newest attack surface, shipped weekly. I test LLM features for prompt injection, data leakage, insecure tool-use and model abuse — and weaponise GPTs to speed up the hunt."],
    ['cloud', 'Cloud Security', "Cloud is the new perimeter. I hunt exposed buckets, over-permissive IAM, leaked keys and metadata SSRF across AWS, GCP and Azure — turning misconfigs into demonstrable impact."],
    ['globe', 'Web App Pentesting', "Where the real money still hides. I go deep on auth, access control and business logic — the flaws scanners can't reason about — not just the easy reflected XSS."],
    ['code', 'API Penetration Testing', "Modern apps are just APIs wearing a UI. I pull apart REST and GraphQL for the BOLA/IDOR and mass-assignment bugs that quietly hand over other people's data."],
    ['server', 'Infrastructure Pentesting', "Once I have a foothold I look for the way up and across — the misconfig, the forgotten host, the reused credential that turns one box into the whole network."],
    ['search', 'Recon / OSINT', "Half of every engagement is finding what the target forgot it owns. I map the full external footprint and mine open & dark-web sources for exposure nobody's watching."],
    ['term', 'Security Automation', "I'd rather build the tool once than run the same check a hundred times. Python pipelines turn recon and exploitation into something that scales across a program."],
    ['target', 'Adversary Emulation', "Not a checklist — a story. I replay real threat-actor TTPs end to end against MITRE ATT&CK so a client sees exactly how a breach against them would unfold."],
    ['mail', 'Phishing Simulation', "People are the perimeter. I run convincing phishing and post-exploitation campaigns with Evilginx and Gophish, then turn the fallout into training that sticks."],
  ];
  const TIMELINE = [
    ['Feb 2025 — Present', 'Associate Consultant — Offensive Security', 'NetSentries', '', 'Intelligence-led penetration testing for banks, fintechs and e-commerce — the kind where the brief is "here\'s our domain, good luck."'],
    ['May 2023 — Jan 2025', 'Junior Security Analyst', 'FireCompass', '★ Star Performer', 'Red teaming, adversary emulation and the automation behind it — feeding straight into the FireCompass CART platform.'],
    ['May 2022 — Present', 'CrowdSource Researcher', 'Bugcrowd · Yogosha Strike Force', 'Freelance', 'Manual penetration testing on private programs; root-causing and closing bugs with dev teams.'],
    ['Jun 2022 — May 2023', 'Security Analyst (Intern)', 'Codewits Solutions', '', 'R&D on a SaaS Security Posture Management product; compliance mapping (NIST, PCI-DSS, SOC 2, CIS, HIPAA).'],
  ];
  const CERTS = [
    ['alteredsecurity.com', 'Certified Red Team Professional (CRTP)', 'Altered Security'],
    ['secops.group', 'Certified AI/ML Pentester (C-AI/MLPen)', 'The SecOps Group'],
    ['aws.amazon.com', 'AWS Certified Solutions Architect – Associate', 'Amazon Web Services'],
    ['cyberwarfare.live', 'Certified Red Team Infra Dev (CRT-ID)', 'CyberWarFare Labs'],
    ['cyberwarfare.live', 'Certified Red Team Analyst (CRTA)', 'CyberWarFare Labs'],
    ['cyberwarfare.live', 'Multi-Cloud Red Team Analyst (MCRTA)', 'CyberWarFare Labs'],
    ['ine.com', 'eLearnSecurity Jr. Penetration Tester (eJPT)', 'INE · eLearnSecurity'],
    ['tcm-sec.com', 'Practical Ethical Hacking (PEH)', 'TCM Security'],
  ];
  const CVES = ['CVE-2022-1728','CVE-2022-1754','CVE-2022-1775','CVE-2022-1803','CVE-2022-1812','CVE-2022-1848','CVE-2023-0299','CVE-2023-0569'];
  const RECS = [
    ['Yash Vardhan Tripathi','AI & Offensive Security','YT','Vishal is an exceptionally talented offensive security professional with a strong command over penetration testing and practical exploitation. His approach is structured, his findings are always high-quality, and he consistently delivers more than expected. I highly recommend him for any pentesting, red teaming or application security role.'],
    ['Debjyoti Bose','R&D & DevOps Leadership','DB','Vishal remains curious and always up for the challenge of breaking apart new processes and techniques. He particularly stood out by powering our cloud security product using cutting-edge AI APIs — helping us leapfrog most of the competition in days, not weeks.'],
    ['Joy Sen','Director, Cyber Security · FireCompass','JS','Vishal was with us at FC and I found him to be a very straightforward and technically aware individual. A great team player with attention to detail, a great sense of timing, and reliable for both immediate and long-term commitments. Wishing him the very best.'],
    ['Sanket K','Security Architect · Red Teamer','SK','I had the pleasure of working closely with Vishal and he consistently impressed me with his technical skills. He played a key role in red team assessments and Attack Surface Management, uncovering critical vulnerabilities. His bug-bounty expertise and automation significantly boosted team efficiency.'],
    ['Prashant Saini','OSEP · OSCP · CRTE','PS','Vishal and I collaborated on multiple red teaming assessments where he consistently demonstrated expertise and solid methodology. His exceptional bug-bounty skills aided ASM for clients, uncovering critical vulns, and his automation greatly benefited the team.'],
    ['Saransh Saraf','Sr. Security Engineer · WatchGuard','SS','Vishal is a very talented security researcher. His ability to think and see out of the box has been one of the key points of his contribution, and he is skilled with various technologies and methodologies.'],
    ['Arif Baig','Information Security Manager','AB','I recommend Vishal for any role in Cyber Security. We worked together on a cloud security product project. He is dedicated — as seen in his bug-bounty findings and YouTube channel — and makes sure tasks are completed in the assigned time frame.'],
  ];
  const ROADMAP = [
    ['Fundamentals','HTTP/S, DNS, TLS, Linux and a scripting language (Python/Bash).'],
    ['Vuln classes','Start with IDOR, reflected XSS, info-disclosure & subdomain takeover.'],
    ['Practice','PortSwigger Web Security Academy, TryHackMe, HTB, Juice Shop.'],
    ['Platform','HackerOne / Bugcrowd / Intigriti — start with VDPs, skip mega-programs.'],
    ['Recon → test','subfinder → httpx → gau → ffuf/Nuclei; one target ~7 days, depth > breadth.'],
    ['Report','Clear title, CVSS, repro steps, working PoC and real business impact.'],
  ];
  const CHECKLIST = [
    ['① Recon','scope · subdomains · live hosts · ports · tech stack · dorking · leaks · takeover · cloud buckets'],
    ['② Content discovery','dir brute · JS parsing · params · API/Swagger/GraphQL · wayback · admin/staging'],
    ['③ Auth & session','login/reset · user enum · MFA/OTP · JWT · OAuth/SSO · logout invalidation'],
    ['④ Access & logic','IDOR/BOLA · priv-esc · forced browsing · business logic · mass assignment · rate limits'],
    ['⑤ Injection & input','XSS · SQLi/NoSQLi · SSRF · SSTI/cmd · XXE/deser · upload/traversal · CSRF'],
    ['⑥ Report & validate','in-scope? · PoC · impact · CVSS · repro steps · remediation'],
  ];

  /* ============================================================
     RENDER GUI
     ============================================================ */
  $('#expertiseGrid').innerHTML = EXPERTISE.map(([ic, t, d]) => `
    <article class="xcard reveal">
      <div class="xcard__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[ic]}</svg></div>
      <h3>${t}</h3><p>${d}</p>
    </article>`).join('');

  $('#timeline').innerHTML = TIMELINE.map(([date, role, org, badge, desc]) => `
    <div class="tl reveal">
      <div class="tl__meta"><span class="tl__date">${date}</span>${badge ? `<span class="tl__badge">${badge}</span>` : ''}</div>
      <h3>${role}</h3><p class="tl__org">${org}</p><p>${desc}</p>
    </div>`).join('');

  $('#certList').innerHTML = CERTS.map(([dom, name, iss]) => `
    <li><img class="cert-logo" src="https://www.google.com/s2/favicons?sz=64&domain=${dom}" alt="" width="34" height="34" loading="lazy" />
    <span class="cert-info"><span class="cert-name">${name}</span><span class="cert-iss">${iss}</span></span></li>`).join('');

  $('#cveList').innerHTML = CVES.map((c) => `<span class="cve">${c}</span>`).join('');

  $('#roadmap').innerHTML = ROADMAP.map(([t, d]) => `<li><b>${t}.</b> ${d}</li>`).join('');
  $('#bbChecklist').innerHTML = CHECKLIST.map(([p, d]) => `<li><b>${p}</b> — ${d}</li>`).join('');

  // recommendations carousel
  $('#recTrack').innerHTML = RECS.map(([nm, rl, av, txt]) => `
    <div class="rec__slide"><article class="rec__card">
      <span class="rec__q">&ldquo;</span><p class="rec__txt">${txt}</p>
      <div class="rec__by"><span class="rec__av">${av}</span><span><span class="rec__nm">${nm}</span><br><span class="rec__rl">${rl}</span></span></div>
    </article></div>`).join('');

  /* ============================================================
     GUI INTERACTIONS
     ============================================================ */
  // sticky nav
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // mobile burger
  const burger = $('#navBurger'), navLinks = $('#navLinks');
  const closeMenu = () => { navLinks.classList.remove('is-open'); burger.classList.remove('is-open'); };
  burger.addEventListener('click', () => { navLinks.classList.toggle('is-open'); burger.classList.toggle('is-open'); });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', closeMenu));

  // active link spy
  const linkMap = new Map();
  $$('#navLinks a').forEach((a) => { const id = a.getAttribute('href').replace('#', ''); if (id) linkMap.set(id, a); });
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { linkMap.forEach((l) => l.classList.remove('is-active')); const a = linkMap.get(e.target.id); if (a) a.classList.add('is-active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  // reveal
  const reveals = $$('.reveal');
  if (reduce) reveals.forEach((el) => el.classList.add('is-visible'));
  else {
    const ro = new IntersectionObserver((es, ob) => es.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('is-visible'), Math.min(i * 50, 220)); ob.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => ro.observe(el));
  }

  // stat counters
  const co = new IntersectionObserver((es, ob) => es.forEach((e) => {
    if (!e.isIntersecting) return; const el = e.target, t = parseInt(el.dataset.count, 10) || 0;
    if (reduce) { el.textContent = t + '+'; ob.unobserve(el); return; }
    const start = performance.now(), dur = 1300;
    const step = (now) => { const p = Math.min((now - start) / dur, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + '+'; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); ob.unobserve(el);
  }), { threshold: 0.6 });
  $$('.stat b').forEach((b) => co.observe(b));

  // scroll cue
  const cue = $('#scrollCue'); if (cue) cue.addEventListener('click', () => $('#about').scrollIntoView({ behavior: 'smooth' }));

  // theme
  const applyTheme = (t) => { document.body.classList.toggle('light', t === 'light'); try { localStorage.setItem('vv_theme', t); } catch (e) {} };
  try { if (localStorage.getItem('vv_theme') === 'light') document.body.classList.add('light'); } catch (e) {}
  $('#themeBtn').addEventListener('click', () => applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

  // recommendations carousel
  (function () {
    const track = $('#recTrack'), slides = $$('.rec__slide', track), dotsWrap = $('#recDots');
    if (!slides.length) return;
    let idx = 0, timer = null;
    const dots = slides.map((_, i) => { const b = document.createElement('button'); b.className = 'rec__dot' + (i ? '' : ' is-active'); b.type = 'button'; b.addEventListener('click', () => { go(i); restart(); }); dotsWrap.appendChild(b); return b; });
    function go(n) { idx = (n + slides.length) % slides.length; track.style.transform = `translateX(-${idx * 100}%)`; dots.forEach((d, i) => d.classList.toggle('is-active', i === idx)); }
    function start() { if (!reduce && !timer) timer = setInterval(() => go(idx + 1), 5500); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }
    $('#recPrev').addEventListener('click', () => { go(idx - 1); restart(); });
    $('#recNext').addEventListener('click', () => { go(idx + 1); restart(); });
    const rec = $('.rec'); rec.addEventListener('mouseenter', stop); rec.addEventListener('mouseleave', start);
    go(0); start();
  })();

  /* ============================================================
     TERMINAL ENGINE
     ============================================================ */
  const output = $('#output'), body = $('#termBody'), input = $('#cmdInput'), typed = $('#typed');
  const PROMPT = `<span class="prompt"><span class="usr">visitor@vishal</span> <span class="tilde">~</span> <span class="dollar">$</span></span>`;
  const ASCII = String.raw`
 ██╗   ██╗██╗███████╗██╗  ██╗ █████╗ ██╗
 ██║   ██║██║██╔════╝██║  ██║██╔══██╗██║
 ██║   ██║██║███████╗███████║███████║██║
 ╚██╗ ██╔╝██║╚════██║██╔══██║██╔══██║██║
  ╚████╔╝ ██║███████║██║  ██║██║  ██║███████╗
   ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝`;
  const banner = () => [
    `<pre class="ascii">${ASCII}</pre>`,
    `<span class="b">Vishal Vishwakarma</span> <span class="dim">// rootxvishal</span>`,
    `<span class="o">Offensive Security Consultant &amp; Security Analyst</span>`,
    `<span class="m">AI / LLM Pentesting · Cloud Security · Red Team · Bug Bounty</span>`,
    ``,
    `Type <span class="g">help</span> to see commands — or hit <span class="o">close ✕</span> to browse the full site.`,
  ];
  const C = {
    help: () => ['<span class="o">Available commands</span>','',
      '  <span class="g">about</span>           who I am','  <span class="g">skills</span>          technical expertise',
      '  <span class="g">experience</span>      work history','  <span class="g">certs</span>           certifications & education',
      '  <span class="g">cves</span>            disclosed vulnerabilities','  <span class="g">recommendations</span> what people say',
      '  <span class="g">bugbounty</span>       beginner roadmap','  <span class="g">checklist</span>       research workflow',
      '  <span class="g">contact</span>         get in touch','  <span class="g">socials</span>         social links',
      '  <span class="g">whoami</span>          visitor info','  <span class="g">banner</span> · <span class="g">theme</span> · <span class="g">clear</span> · <span class="g">exit</span>','',
      '<span class="dim">↑/↓ history · Tab autocomplete · Ctrl+L clear · Esc closes the terminal</span>'],
    about: () => ['<span class="b">Vishal Vishwakarma</span> <span class="dim">// rootxvishal</span>','<span class="o">Associate Consultant — Offensive Security @ NetSentries</span>','',
      'I break into things before someone with worse intentions does — thinking','like the attacker against banks, fintechs and the platforms that move money.','',
      'These days that means <span class="c">AI / LLM penetration testing</span> and <span class="c">cloud security</span>:','pressure-testing the models, features and infra teams ship faster than they','can secure. Black-box, zero-knowledge, automation-heavy. Equally a <span class="c">security','analyst</span> — turning tool noise into what is actually exploitable.','',
      '<span class="dim">8 CVEs · Hall of Fame @ 300+ orgs (Google, Sony, BBC) · Yogosha Strike Force</span>'],
    skills: () => ['<span class="o">Technical expertise</span>',''].concat(EXPERTISE.map(([, t]) => `  <span class="o">●</span> <span class="b">${t}</span>`)).concat(['','<span class="dim">Tooling:</span> Burp · Nuclei · Metasploit · Nessus · AWS/GCP/Azure · Docker · LLM APIs · Python']),
    experience: () => ['<span class="o">Work history</span>',''].concat(TIMELINE.flatMap(([d, r, o, b]) => [`<span class="o">${d}</span>  <span class="b">${r}</span> <span class="dim">· ${o}</span>${b ? ` <span class="g">${b}</span>` : ''}`])),
    certs: () => ['<span class="o">Certifications</span>',''].concat(CERTS.map(([, n, i]) => `  <span class="g">•</span> ${n} <span class="dim">— ${i}</span>`)).concat(['','<span class="dim">Education:</span> BCA — Rabindranath Tagore University (2020–2023)']),
    cves: () => ['<span class="o">8 disclosed CVEs</span>','', '  ' + CVES.map((c) => `<span class="c">${c}</span>`).join('   ')],
    recommendations: () => ['<span class="o">7 LinkedIn recommendations</span> <span class="dim">(summaries)</span>',''].concat(RECS.flatMap(([n, r, , t]) => [`<span class="b">${n}</span> <span class="dim">· ${r}</span>`, `  <span class="m">"${t.slice(0, 96)}..."</span>`])).concat(['','<span class="dim">Full text →</span> <a href="https://www.linkedin.com/in/vishalvishw10/" target="_blank" rel="noopener">linkedin.com/in/vishalvishw10</a>']),
    bugbounty: () => ['<span class="o">Bug Bounty — Beginner Roadmap</span>',''].concat(ROADMAP.map(([t, d], i) => `  <span class="g">${i + 1}. ${t}</span>  <span class="m">${d}</span>`)),
    checklist: () => ['<span class="o">Bug Bounty Research Checklist</span>',''].concat(CHECKLIST.map(([p, d]) => `  <span class="g">${p}</span>  <span class="m">${d}</span>`)),
    contact: () => ['<span class="o">Let\'s work together.</span>','',
      '  <span class="dim">email </span>    <a href="mailto:rootxvishal@proton.me">rootxvishal@proton.me</a>',
      '  <span class="dim">linkedin</span>  <a href="https://www.linkedin.com/in/vishalvishw10/" target="_blank" rel="noopener">linkedin.com/in/vishalvishw10</a>',
      '  <span class="dim">github</span>    <a href="https://github.com/vishalvishw10" target="_blank" rel="noopener">github.com/vishalvishw10</a>',
      '  <span class="dim">medium</span>    <a href="https://medium.com/@rootxvishal" target="_blank" rel="noopener">medium.com/@rootxvishal</a>'],
    socials: () => C.contact(),
    blog: () => ['<span class="o">Writing & media</span>','','  <a href="https://medium.com/@rootxvishal" target="_blank" rel="noopener">Medium</a> — bug-bounty & CTF write-ups','  <span class="c">YouTube</span> — The Cyber Explorers'],
    whoami: () => { const tz = (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || 'unknown'; return ['<span class="o">visitor</span>','', `  user      <span class="g">guest</span>`, `  platform  ${esc((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '?')}`, `  timezone  ${esc(tz)}`, `  time      ${esc(new Date().toString())}`, '', '<span class="dim">Nothing is logged — all client-side.</span>']; },
    banner: () => banner(),
    sudo: () => ['<span class="r">Permission denied.</span> Nice try though. 🛡️'],
    ls: () => ['about  skills  experience  certs  cves  recommendations  bugbounty  checklist  contact  socials  blog'],
    pwd: () => ['/home/vishal/offsec'], date: () => [esc(new Date().toString())],
    hire: () => ['<span class="o">Smart move.</span> → <a href="mailto:rootxvishal@proton.me">rootxvishal@proton.me</a>'],
    exit: () => { closeTerm(); return ['<span class="dim">Closing terminal… enjoy the site. Reopen any time with the</span> <span class="o">&gt;_</span> <span class="dim">button.</span>']; },
  };
  const ALIAS = { '?': 'help', man: 'help', rec: 'recommendations', recs: 'recommendations', bb: 'bugbounty', bounty: 'bugbounty', cve: 'cves', cert: 'certs', skill: 'skills', exp: 'experience', social: 'socials', email: 'contact', me: 'whoami', who: 'whoami', writing: 'blog', youtube: 'blog' };

  const history = []; let hIdx = -1;
  const appendBlock = (lines) => { const d = document.createElement('div'); d.className = 'block'; d.innerHTML = lines.map((l) => `<div class="line">${l === '' ? '&nbsp;' : l}</div>`).join(''); output.appendChild(d); };
  const scrollDown = () => { body.scrollTop = body.scrollHeight; };
  const sync = () => { typed.textContent = input.value; };
  const focusInput = () => input.focus();

  function run(raw) {
    const cmd = raw.trim();
    const e = document.createElement('div'); e.className = 'line echo'; e.innerHTML = `${PROMPT} <span>${esc(cmd)}</span>`; output.appendChild(e);
    if (cmd === '') { scrollDown(); return; }
    history.push(cmd); hIdx = history.length;
    let name = cmd.split(/\s+/)[0].toLowerCase(); const args = cmd.split(/\s+/).slice(1);
    if (name === 'clear' || name === 'cls') { output.innerHTML = ''; return; }
    if (name === 'echo') { appendBlock([esc(args.join(' ')) || '&nbsp;']); scrollDown(); return; }
    if (name === 'theme') { applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'); appendBlock([`<span class="dim">Theme →</span> <span class="o">${document.body.classList.contains('light') ? 'light' : 'dark'}</span>`]); scrollDown(); return; }
    name = ALIAS[name] || name;
    const h = C[name];
    appendBlock(typeof h === 'function' ? h(args) : [`<span class="r">command not found:</span> ${esc(cmd.split(/\s+/)[0])}`, `<span class="dim">Type</span> <span class="g">help</span> <span class="dim">for the list.</span>`]);
    scrollDown();
  }

  input.addEventListener('input', sync);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); const v = input.value; input.value = ''; sync(); run(v); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); if (history.length) { hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx] || ''; sync(); } }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); if (history.length) { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; sync(); } }
    else if (ev.key === 'Tab') { ev.preventDefault(); const f = input.value.trim().toLowerCase(); if (f) { const m = Object.keys(C).concat(Object.keys(ALIAS)).find((c) => c.startsWith(f)); if (m) { input.value = m; sync(); } } }
    else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'l') { ev.preventDefault(); output.innerHTML = ''; }
    else if (ev.key === 'Escape') { closeTerm(); }
  });
  $('#terminal').addEventListener('click', (ev) => { if (ev.target.tagName !== 'A' && ev.target.tagName !== 'BUTTON') focusInput(); });

  // quick command chips
  ['help', 'about', 'skills', 'certs', 'recommendations', 'contact'].forEach((cmd) => {
    const b = document.createElement('button'); b.className = 'qbtn'; b.type = 'button'; b.textContent = cmd;
    b.addEventListener('click', () => { run(cmd); focusInput(); }); $('#quickcmds').appendChild(b);
  });

  /* ============================================================
     TERMINAL OPEN / CLOSE
     ============================================================ */
  function openTerm() { document.body.classList.add('terminal-open'); setTimeout(focusInput, 60); }
  function closeTerm() { document.body.classList.remove('terminal-open'); }
  $('#openTerminal').addEventListener('click', openTerm);
  $('#termCloseX').addEventListener('click', closeTerm);
  $('#termClose').addEventListener('click', closeTerm);
  $('#termEnter').addEventListener('click', closeTerm);

  // boot terminal
  appendBlock(banner()); scrollDown();
  if (document.body.classList.contains('terminal-open')) setTimeout(focusInput, 120);
})();
