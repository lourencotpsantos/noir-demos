/* Autoescuelas Correcaminos · concept by Noir Digital. Vanilla JS, no backend. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var WA_NUMBER = '34633857883';
  var EMAIL = 'autoescuelacorrecaminos@hotmail.com';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }

  /* ---------- i18n ---------- */
  // Spanish lives in the HTML; English here. Spanish originals are captured at load.
  var EN = {
    skip: 'Skip to content',
    brandLabel: 'Autoescuelas Correcaminos, home',
    navLabel: 'Main',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    navLicences: 'Licences', navHow: 'How it works', navQuiz: 'Which licence?', navBranches: 'Branches', navFaq: 'FAQ', navContact: 'Contact',
    ctaEnrol: 'Enrol online', ctaCall: 'Call us',
    heroAlt: 'A young learner at the wheel of a car listening to his instructor in the passenger seat',
    heroEyebrow: 'Driving school in Málaga · 4 branches',
    heroTitle1: 'Your licence,', heroTitle2: 'at full speed.',
    heroLead: 'Car and motorbike in Huelin, Olletas, Centro and Suárez. Evening classes until 9 pm, online practice tests and instructors who stay with you until exam day.',
    heroFactsLabel: 'Key facts',
    factGoogle: 'on Google', factBranches: 'branches in Málaga', factLicences: 'car and motorbike',
    licEyebrow: 'Licences and courses',
    licTitle: 'Pick your licence. We’ll get you to a pass.',
    licLead: 'Car, motorbike and moped. Each branch confirms its prices: here you can see where they will go on the final site.',
    carAlt: 'Driver’s seat view: hand on the wheel and a sunny road ahead',
    tagPopular: 'Most popular',
    licBKicker: 'Car', licBTitle: 'Licence B',
    metaAge: 'Minimum age', metaDuration: 'Duration', metaDrives: 'You can ride', metaNext: 'Next dates',
    age18: '18 years', age16: '16 years', age15: '15 years',
    weeksPace: 'weeks, at your pace',
    licB1: 'Theory classes and online tests',
    licB2: 'Lessons with your instructor in a dual-control car',
    licB3: 'DGT exam booking and support on the day',
    from: 'From', extraClass: 'Single practical lesson:',
    ctaEnrolThis: 'Enrol', ctaAskDates: 'Ask for dates', ctaHowWorks: 'See how it works',
    motoAlt: 'Training motorbikes with learner L plates',
    kickerMoto: 'Motorbike', licA2Title: 'Licence A2', licA2Drives: 'Motorbikes up to 35 kW',
    licA21: 'Motorbike-specific theory', licA22: 'Practice on a closed track and in town',
    scooterAlt: 'Helmeted rider on a city street',
    licA1Title: 'Licence A1', licA1Drives: 'Up to 125 cc and 11 kW',
    licA11: 'Ideal if you want to ride before you turn 18',
    kickerMoped: 'Moped', licAMTitle: 'Licence AM', licAMDrives: 'Mopeds up to 50 cc and 45 km/h',
    kickerCourse: 'Course', intTitle: 'Intensive theory',
    intText: 'The full syllabus packed into a few weeks, so you can sit the theory exam sooner.',
    kickerForeign: 'From abroad?', forTitle: 'Foreign licence',
    forText: 'We’ll guide you if you need to exchange your licence or get a Spanish one. We can also help you in English.',
    licFine: 'Ages and categories per Spain’s General Drivers’ Regulations. Text in square brackets marks details the school will supply.',
    howEyebrow: 'How it works', howTitle: 'From sign-up to licence in four steps.',
    practiceAlt: 'Instructor handing the car keys to a student sitting at the wheel',
    step1Title: 'Enrol', step1Text: 'Online on this site or at any of our four branches. We’ll tell you which documents to bring.',
    step2Title: 'Theory', step2Text: 'Classroom lessons and online DGT-style tests. The exam has 30 questions and you pass with 3 mistakes or fewer.',
    step3Title: 'Driving lessons', step3Text: 'Behind the wheel from day one with your instructor, on the Málaga streets where you’ll be tested. Morning or afternoon slots.',
    step4Title: 'Practical exam', step4Text: 'We put you forward when you’re ready and come with you. Results are published on the DGT website.',
    dgtGrade: 'Check your result on the DGT site',
    quizEyebrow: 'Quick quiz', quizTitle: 'Which licence do I need?', quizLead: 'Four questions, under a minute. We’ll recommend a licence and a course.',
    q1: 'How old are you?', q1a: '15 years old', q1b: '16 or 17', q1c: '18 or older',
    phPrice: '[price]', phDate: '[date]',
    q2: 'What do you want to drive?', q2a: 'A car', q2b: 'A motorbike', q2c: 'A 50 cc moped or scooter',
    q3: 'Do you already hold a licence?', q3a: 'No, none', q3b: 'Spanish licence B for 3+ years', q3c: 'Licence B for under 3 years', q3d: 'A licence from another country',
    q4: 'How soon do you need it?', q4a: 'As soon as possible', q4b: 'At my own pace',
    back: 'Back', next: 'Next', seeResult: 'See my result',
    resEyebrow: 'We recommend', resEnrol: 'Enrol with this option', restart: 'Retake quiz',
    resFine: 'General guidance. We’ll confirm your case at the branch.',
    brEyebrow: 'Branches', brTitle: 'Four branches in Málaga city. Pick the one on your way.',
    malagaAlt: 'Málaga street with a white car stopped at a pedestrian crossing',
    hours: 'Hours', monFri: 'Monday to Friday', phone: 'Phone',
    map: 'Get directions', mapSr: '(opens Google Maps)', mainOffice: 'Main office',
    centroNote: 'Parallel to Armengual de la Mota', suarezNote: 'Suárez–Miraflores area',
    hoursFine: 'General hours published by the school. [Confirm hours for this branch.]',
    whyEyebrow: 'Why Correcaminos', whyTitle: 'What sets us apart, no small print.',
    why1T: '4 branches in Málaga', why1: 'Huelin, Olletas, Centro and Suárez–Miraflores: enrol at whichever is closest.',
    why2T: 'Open until 9 pm', why2: 'Monday to Friday, mornings and afternoons, to fit around school or work.',
    why3T: 'Online tests and student area', why3: 'Practise theory on your phone with DGT-style questions, whenever you like.',
    why4T: 'Car and motorbike under one roof', why4: 'Licences B, A2, A1 and AM, so you can stay with us when you move up.',
    revEyebrow: 'Reviews', revTitle: 'Google rating', starsLabel: '4.7 out of 5 stars',
    revText: 'Average Google rating from our students.',
    revSrc: 'Source: Google, Olletas branch listing (329 reviews, checked November 2026). Other branches have their own listings.',
    revCta: 'Read reviews on Google',
    enrEyebrow: 'Online enrolment', enrTitle: 'Book your place in a minute.',
    enrLead: 'Fill in your details and send them to us on WhatsApp or by email. We’ll reply to confirm times and paperwork.',
    enrP1: 'No online payment, no account to create', enrP2: 'Your details are only used to contact you', enrP3: 'You can also call us:',
    fLicence: 'Licence or course', fChoose: 'Choose an option',
    optB: 'Licence B (car)', optA2: 'Licence A2 (motorbike)', optA1: 'Licence A1 (125 cc motorbike)', optAM: 'Licence AM (moped)', optINT: 'Intensive theory course', optFOR: 'I have a foreign licence',
    eLicence: 'Choose the licence or course you’re interested in.',
    fBranch: 'Branch', eBranch: 'Choose the branch that suits you best.',
    fSchedule: 'Preferred schedule', fMorning: 'Morning', fAfternoon: 'Afternoon',
    fName: 'Full name', eName: 'Add your name so we know who we’re replying to.',
    fPhone: 'Phone', ePhone: 'Check your phone number: we need at least 9 digits.',
    fSendWa: 'Send on WhatsApp', fSendMail: 'Send by email',
    fFine: 'WhatsApp or your email app will open with the message ready, addressed to 633 857 883 or autoescuelacorrecaminos@hotmail.com. Nothing is sent until you confirm.',
    faqEyebrow: 'FAQ', faqTitle: 'What everyone asks before they start.',
    faq1Q: 'What is the DGT theory exam like?',
    faq1A: 'For licence B it’s a 30-question multiple-choice test with three possible answers. You have 30 minutes and pass with no more than 3 mistakes. Once you pass, you have two years to pass the practical exam.',
    faq2Q: 'And the practical exam?',
    faq2A: 'It takes place in real traffic, with a DGT examiner and your instructor in the car. They assess how you drive in everyday traffic situations. We put you forward when your instructor sees you’re ready.',
    faq3Q: 'I have a licence from another country. Can I drive in Spain?',
    faq3A1: 'Licences from the European Union and the European Economic Area are valid in Spain. If your licence is from outside the EU, you can drive with it for six months after becoming a legal resident.',
    faq3A2: 'After that, if your country has an agreement with Spain, you can exchange it at the DGT. If it doesn’t, you’ll need to get a Spanish licence, and we’ll help you from day one. Check your case on the DGT website or ask us.',
    faq4Q: 'What is the intensive course?',
    faq4A: 'It’s a theory course that packs the syllabus into a few weeks with back-to-back classes, so you can sit the exam sooner. Ask your branch about the next dates.',
    faq5Q: 'I already have a car licence. Can I ride a motorbike?',
    faq5A: 'Licence B lets you ride mopeds (what AM covers). If you’ve held licence B for more than three years, in Spain you can also ride motorbikes up to 125 cc and 11 kW. For bigger bikes you need A2.',
    faq6Q: 'How do I check my exam result?',
    faq6A: 'The DGT publishes results on its online portal. You’ll need your DNI or NIE and the exam date.',
    ctEyebrow: 'Contact', ctTitle: 'Talk to us however you like.',
    ctPhone: 'Phone', ctPhoneS: 'Main office, Olletas', ctWaS: 'Message or call our mobile', ctMailS: 'We’ll reply as soon as we can', ctHoursV: 'Monday to Friday',
    ftText: 'Driving school in Málaga with branches in Huelin, Olletas, Centro and Suárez. Car and motorbike licences.',
    ftStudents: 'Students', ftStudentsLabel: 'Student links', ftPortal: 'Student area and online tests',
    ftLegal: 'Legal', ftLegalLabel: 'Legal information', ftNotice: 'Legal notice [pending]', ftPrivacy: 'Privacy [pending]', ftCookies: 'Cookies [pending]',
    ftCredit: 'Photos: Unsplash and Pexels. Concept design: Noir Digital.',
    barLabel: 'Quick actions', barCall: 'Call', barEnrol: 'Enrol',
    dashGoogle: 'on Google',
    tk1: 'Licence B', tk2: 'Motorbike A2 · A1 · AM', tk3: '4 branches in Málaga', tk4: 'Classes until 9 pm', tk5: 'Online tests', tk6: 'Enrol online',
    howLead: 'Scroll down and drive the route: this is your journey with us.',
    tryTest: 'Try 5 questions now', step5Title: 'Licence!', step5Text: 'Your name here. Start today and this is where your road ends.',
    mlTitle: 'Driving licence',
    miniEyebrow: 'Test your theory', miniTitle: 'Would you pass today? 5 DGT-style questions.', miniLead: 'Signs, speed limits and right of way. Instant answers.',
    miniEndText: 'The real exam has 30 questions and you can get 3 wrong. With our classes and online tests you’ll walk in ready.',
    miniCta: 'Practise the whole syllabus with us',
    flipLabel: 'Flip the card', flipHint: 'Your licence…',
    brLead: 'Tap a pin on the map to see that branch.',
    mapCap: 'Schematic map of Málaga with the four branches', mapRiver: 'Guadalmedina river', mapOld: 'Old town', mapPort: 'Port', mapSea: 'Mediterranean Sea',
    mapNote: 'Schematic only, not to scale. Use “Get directions” for the exact location.',
    badge: 'Concept by Noir Digital · not the official website'
  };

  var ES_DYN = { menuOpen: 'Abrir menú', menuClose: 'Cerrar menú', next: 'Siguiente', seeResult: 'Ver mi resultado' };

  var lang = 'es';
  var esText = {};
  var esAttr = [];
  var textNodes = document.querySelectorAll('[data-i18n]');
  textNodes.forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (!(k in esText)) esText[k] = el.textContent;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var p = pair.split(':');
      esAttr.push([el, p[0], p[1], el.getAttribute(p[0])]);
    });
  });
  function t(k) {
    if (lang === 'en') return EN[k] != null ? EN[k] : (esText[k] || ES_DYN[k] || k);
    return esText[k] != null ? esText[k] : (ES_DYN[k] || EN[k] || k);
  }
  function L(es, en) { return lang === 'en' ? en : es; }

  var langHooks = [];
  function applyLang(next) {
    lang = next === 'en' ? 'en' : 'es';
    document.documentElement.lang = lang;
    textNodes.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      el.textContent = lang === 'en' && EN[k] != null ? EN[k] : esText[k];
    });
    esAttr.forEach(function (row) {
      row[0].setAttribute(row[1], lang === 'en' && EN[row[2]] != null ? EN[row[2]] : row[3]);
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    document.title = L('Autoescuelas Correcaminos · Autoescuela en Málaga · Coche y moto', 'Autoescuelas Correcaminos · Driving school in Málaga · Car and motorbike');
    langHooks.forEach(function (fn) { fn(); });
    try { localStorage.setItem('cc-lang', lang); } catch (e) {}
  }
  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = $('nav');
  function syncMenuLabel() {
    menuBtn.setAttribute('aria-label', t(menuBtn.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen'));
  }
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    syncMenuLabel();
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });
  langHooks.push(syncMenuLabel);

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Scroll: road progress + journey ---------- */
  var rpFill = $('rp-fill'), rpCar = $('rp-car');
  var journey = $('journey'), car = $('car'), roadFill = $('road-fill');
  var stops = journey ? Array.prototype.slice.call(journey.querySelectorAll('[data-stop]')) : [];
  var stopY = [];
  var confettiDone = false;

  function measure() {
    stopY = stops.map(function (s) {
      var node = s.querySelector('.stop-node');
      return s.offsetTop + node.offsetTop + node.offsetHeight / 2;
    });
  }

  function confetti() {
    if (confettiDone || REDUCED) return;
    confettiDone = true;
    var box = $('confetti');
    var colors = ['#FF5B14', '#FFC233', '#0F1330', '#ffffff', '#2BD66B'];
    for (var i = 0; i < 42; i++) {
      var b = document.createElement('b');
      var ang = Math.random() * Math.PI * 2;
      var dist = 90 + Math.random() * 130;
      b.style.setProperty('--c', colors[i % colors.length]);
      b.style.setProperty('--dx', Math.round(Math.cos(ang) * dist) + 'px');
      b.style.setProperty('--dy', Math.round(Math.sin(ang) * dist - 40) + 'px');
      b.style.setProperty('--r', Math.round(Math.random() * 720 - 360) + 'deg');
      b.style.animationDelay = (Math.random() * 0.15) + 's';
      box.appendChild(b);
    }
    setTimeout(function () { box.innerHTML = ''; }, 2200);
  }

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    rpFill.style.transform = 'scaleX(' + p + ')';
    rpCar.style.transform = 'translateX(' + Math.round(p * (window.innerWidth - 18)) + 'px)';

    if (!journey) return;
    var r = journey.getBoundingClientRect();
    var h = journey.offsetHeight;
    var jp = REDUCED ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / h));
    var carY = jp * (h - 48);
    car.style.transform = 'translateY(' + carY.toFixed(1) + 'px)';
    roadFill.style.transform = 'scaleY(' + jp.toFixed(3) + ')';
    var tip = carY + 40;
    stops.forEach(function (s, i) {
      var lit = tip >= stopY[i] - 6 || jp >= 0.995;
      if (lit !== s.classList.contains('lit')) s.classList.toggle('lit', lit);
      if (lit && i === stops.length - 1) confetti();
    });
  }
  var ticking = false;
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', function () { measure(); requestTick(); });
  window.addEventListener('load', function () { measure(); requestTick(); setTimeout(function () { document.documentElement.classList.add('anim-on'); }, 1200); });

  /* ---------- Course cards: tilt ---------- */
  if (!REDUCED) {
    document.querySelectorAll('.card').forEach(function (card) {
      var resetT;
      function tilt(e, strength) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.transition = 'transform .15s ease-out';
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * strength).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * strength).toFixed(2) + 'deg) translateY(-4px)';
        card.style.setProperty('--gx', (x * 100).toFixed(0) + '%');
        card.style.setProperty('--gy', (y * 100).toFixed(0) + '%');
        card.classList.add('tilting');
      }
      function reset() {
        card.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
        card.style.transform = '';
        card.classList.remove('tilting');
      }
      card.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') tilt(e, 9); });
      card.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') reset(); });
      card.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse') return;
        clearTimeout(resetT); tilt(e, 12);
      });
      ['pointerup', 'pointercancel'].forEach(function (ev) {
        card.addEventListener(ev, function (e) { if (e.pointerType !== 'mouse') resetT = setTimeout(reset, 220); });
      });
    });
  }

  /* ---------- Mini theory test ---------- */
  function roundaboutSign() {
    var cx = 60, cy = 60, R = 27, out = '';
    for (var k = 0; k < 3; k++) {
      // counter-clockwise arrows, as on the Spanish R-402 sign
      var a0 = (k * 120 + 20) * Math.PI / 180, a1 = (k * 120 + 100) * Math.PI / 180;
      var x0 = cx + R * Math.cos(a0), y0 = cy - R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = cy - R * Math.sin(a1);
      out += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + R + ' ' + R + ' 0 0 0 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke="#fff" stroke-width="8"/>';
      var tx = -Math.sin(a1), ty = -Math.cos(a1); // tangent (ccw direction in screen space)
      var nx = Math.cos(a1), ny = -Math.sin(a1);
      var tipX = x1 + tx * 11, tipY = y1 + ty * 11;
      out += '<path d="M' + (x1 + nx * 9).toFixed(1) + ' ' + (y1 + ny * 9).toFixed(1) + ' L' + tipX.toFixed(1) + ' ' + tipY.toFixed(1) + ' L' + (x1 - nx * 9).toFixed(1) + ' ' + (y1 - ny * 9).toFixed(1) + 'Z" fill="#fff"/>';
    }
    return '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#fff"/><circle cx="60" cy="60" r="52" fill="#1F4FBF"/>' + out + '</svg>';
  }
  var SIGNS = {
    stop: '<svg viewBox="0 0 120 120"><polygon points="37,3 83,3 117,37 117,83 83,117 37,117 3,83 3,37" fill="#fff"/><polygon points="39,8 81,8 112,39 112,81 81,112 39,112 8,81 8,39" fill="#C8102E"/><text x="60" y="71" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="31" fill="#fff">STOP</text></svg>',
    yield: '<svg viewBox="0 0 120 120"><polygon points="8,16 112,16 60,108" fill="#fff" stroke="#C8102E" stroke-width="12" stroke-linejoin="round"/></svg>',
    motorway: '<svg viewBox="0 0 120 120"><rect x="6" y="6" width="108" height="108" rx="12" fill="#1F4FBF" stroke="#fff" stroke-width="4"/><rect x="18" y="34" width="84" height="10" fill="#fff"/><rect x="30" y="44" width="7" height="14" fill="#fff"/><rect x="83" y="44" width="7" height="14" fill="#fff"/><polygon points="28,102 52,102 57,52 50,52" fill="#fff"/><polygon points="68,102 92,102 70,52 63,52" fill="#fff"/></svg>',
    town: '<svg viewBox="0 0 120 120"><rect x="6" y="30" width="108" height="60" rx="8" fill="#fff" stroke="#111" stroke-width="5"/><text x="60" y="68" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="21" fill="#111">MÁLAGA</text></svg>',
    roundabout: roundaboutSign()
  };
  var MINI = [
    { sign: 'stop',
      q: ['¿Qué te obliga a hacer esta señal?', 'What does this sign require you to do?'],
      o: [['Reducir la velocidad y pasar si no viene nadie', 'Slow down and go if nobody is coming'], ['Detenerte por completo y ceder el paso', 'Come to a full stop and give way'], ['Detenerte solo si hay otros vehículos', 'Stop only if there are other vehicles']],
      a: 1,
      ex: ['La señal de STOP obliga siempre a detenerse por completo en la línea de detención y ceder el paso, venga o no alguien.', 'A STOP sign always requires a full stop at the stop line and giving way, whether or not anyone is coming.'] },
    { sign: 'yield',
      q: ['Ante esta señal, ¿qué debes hacer?', 'What must you do at this sign?'],
      o: [['Detenerte siempre', 'Always stop'], ['Ceder el paso, deteniéndote solo si es necesario', 'Give way, stopping only if necessary'], ['Nada: tienes prioridad', 'Nothing: you have priority']],
      a: 1,
      ex: ['«Ceda el paso» obliga a dejar pasar a los vehículos de la vía a la que te incorporas. Solo tienes que parar si viene alguien.', '“Give way” means letting vehicles on the road you are joining go first. You only have to stop if someone is coming.'] },
    { sign: 'motorway',
      q: ['¿Velocidad máxima de un turismo en autopista o autovía?', 'Top speed for a car on a motorway or dual carriageway (autovía)?'],
      o: [['100 km/h', '100 km/h'], ['120 km/h', '120 km/h'], ['130 km/h', '130 km/h']],
      a: 1,
      ex: ['Turismos y motos: 120 km/h en autopistas y autovías, salvo que las señales indiquen otro límite.', 'Cars and motorbikes: 120 km/h on motorways and autovías, unless signs show a different limit.'] },
    { sign: 'town',
      q: ['Entras en Málaga. En una calle con un solo carril por sentido, ¿cuál es el límite genérico?', 'You enter Málaga. On a street with one lane in each direction, what is the default limit?'],
      o: [['50 km/h', '50 km/h'], ['40 km/h', '40 km/h'], ['30 km/h', '30 km/h']],
      a: 2,
      ex: ['Desde 2021, en vías urbanas de un carril por sentido el límite es 30 km/h. Es 20 km/h en calles de plataforma única y 50 km/h con dos o más carriles por sentido.', 'Since 2021, urban roads with one lane per direction are limited to 30 km/h. It is 20 km/h on single-level shared streets and 50 km/h with two or more lanes per direction.'] },
    { sign: 'roundabout',
      q: ['En una glorieta, ¿quién tiene prioridad?', 'At a roundabout, who has priority?'],
      o: [['Los vehículos que van a entrar', 'Vehicles about to enter'], ['Los vehículos que ya circulan por ella', 'Vehicles already on the roundabout'], ['El vehículo más grande', 'The largest vehicle']],
      a: 1,
      ex: ['Quien ya circula dentro de la glorieta tiene preferencia sobre quien quiere entrar.', 'Traffic already on the roundabout has priority over traffic wanting to enter.'] }
  ];
  var mi = 0, miAnswers = [];
  var miSign = $('mini-sign'), miQ = $('mini-question'), miOpts = $('mini-opts'), miFb = $('mini-feedback'), miNext = $('mini-next');
  var miStage = $('mini-stage'), miEnd = $('mini-end'), miCount = $('mini-count');
  var miDots = $('mini-dots').children;

  function miRender(animate) {
    var item = MINI[mi], idx = lang === 'en' ? 1 : 0;
    miCount.textContent = L('Pregunta ', 'Question ') + (mi + 1) + L(' de ', ' of ') + MINI.length;
    for (var d = 0; d < miDots.length; d++) {
      miDots[d].className = d < miAnswers.length ? (miAnswers[d] ? 'ok' : 'ko') : (d === mi ? 'cur' : '');
    }
    if (animate) { miSign.innerHTML = SIGNS[item.sign]; miStage.classList.remove('swap'); void miStage.offsetWidth; miStage.classList.add('swap'); }
    else if (!miSign.innerHTML) miSign.innerHTML = SIGNS[item.sign];
    miQ.textContent = item.q[idx];
    miOpts.innerHTML = '';
    var answered = miAnswers.length > mi;
    item.o.forEach(function (o, j) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mo';
      b.innerHTML = '<span class="mo-l" aria-hidden="true">' + 'ABC'[j] + '</span><span class="mo-t"></span><span class="mo-mark" aria-hidden="true"></span>';
      b.querySelector('.mo-t').textContent = o[idx];
      b.addEventListener('click', function () { miAnswer(j); });
      miOpts.appendChild(b);
    });
    if (answered) miMark(miAnswers.chosen ? miAnswers.chosen[mi] : item.a, false);
    else { miFb.textContent = ''; miFb.className = 'mini-feedback'; miNext.hidden = true; }
  }
  function miMark(j, fresh) {
    var item = MINI[mi], idx = lang === 'en' ? 1 : 0;
    var btns = miOpts.querySelectorAll('.mo');
    btns.forEach(function (b, k) {
      b.disabled = true;
      if (k === item.a) { b.classList.add('ok'); b.querySelector('.mo-mark').textContent = '✓'; }
      else if (k === j) { b.classList.add('ko'); b.querySelector('.mo-mark').textContent = '✗'; }
    });
    var ok = j === item.a;
    miFb.className = 'mini-feedback ' + (ok ? 'ok' : 'ko');
    miFb.innerHTML = '<strong></strong><span></span>';
    miFb.querySelector('strong').textContent = ok ? L('¡Correcto!', 'Correct!') : L('Casi. La buena es la ' + 'ABC'[item.a] + '.', 'Not quite. The answer is ' + 'ABC'[item.a] + '.');
    miFb.querySelector('span').textContent = item.ex[idx];
    miNext.textContent = mi < MINI.length - 1 ? L('Siguiente pregunta', 'Next question') : L('Ver mi resultado', 'See my score');
    miNext.hidden = false;
    if (fresh) miNext.focus();
  }
  function miAnswer(j) {
    if (miAnswers.length > mi) return;
    miAnswers.chosen = miAnswers.chosen || [];
    miAnswers.chosen[mi] = j;
    miAnswers.push(j === MINI[mi].a);
    miDots[mi].className = miAnswers[mi] ? 'ok' : 'ko';
    miMark(j, true);
  }
  function miShowEnd(focus) {
    var score = miAnswers.filter(Boolean).length;
    miStage.hidden = true; miEnd.hidden = false;
    for (var d = 0; d < miDots.length; d++) miDots[d].className = miAnswers[d] ? 'ok' : 'ko';
    miCount.textContent = L('Resultado', 'Your score');
    $('score-num').textContent = score + '/' + MINI.length;
    var arc = $('score-arc');
    arc.style.strokeDashoffset = 100;
    requestAnimationFrame(function () { requestAnimationFrame(function () { arc.style.strokeDashoffset = 100 - score / MINI.length * 100; }); });
    $('mini-end-title').textContent = score === 5 ? L('¡Pleno! Vas sobrado para el teórico.', 'Perfect score! You’re ready for theory.')
      : score >= 3 ? L('¡Muy bien! Te falta un empujón.', 'Nice work! Just a little push to go.')
      : L('Buen comienzo. Con nosotros lo bordas.', 'Good start. With us you’ll nail it.');
    if (focus) miEnd.focus();
  }
  miNext.addEventListener('click', function () {
    if (mi < MINI.length - 1) { mi++; miRender(true); miQ.focus(); }
    else miShowEnd(true);
  });
  $('mini-restart').addEventListener('click', function () {
    mi = 0; miAnswers = []; miEnd.hidden = true; miStage.hidden = false; miRender(true); miQ.focus();
  });
  langHooks.push(function () { if (!miEnd.hidden) miShowEnd(false); else miRender(false); });

  /* ---------- Licence quiz ---------- */
  var quizForm = $('quiz-form');
  var qs = quizForm.querySelectorAll('.q');
  var nextBtn = $('quiz-next'), backBtn = $('quiz-back');
  var ringArc = $('ring-arc'), ringNum = $('ring-num'), count = $('quiz-count');
  var resultBox = $('quiz-result'), quizTop = document.querySelector('.quiz-top'), flip = $('flip');
  var step = 0, lastResult = null;
  var names = ['age', 'vehicle', 'has', 'pace'];
  function answer(name) { var c = quizForm.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : null; }

  function renderQuiz(dir) {
    qs.forEach(function (q, i) {
      q.hidden = i !== step;
      q.classList.remove('enter', 'enter-back');
      if (i === step && dir && !REDUCED) { void q.offsetWidth; q.classList.add(dir > 0 ? 'enter' : 'enter-back'); }
    });
    ringArc.style.strokeDashoffset = 100 - (step + 1) / qs.length * 100;
    ringNum.textContent = step + 1;
    count.textContent = L('Pregunta ', 'Question ') + (step + 1) + L(' de ', ' of ') + qs.length;
    backBtn.hidden = step === 0;
    nextBtn.disabled = !answer(names[step]);
    nextBtn.textContent = step === qs.length - 1 ? t('seeResult') : t('next');
  }
  quizForm.addEventListener('change', function () { nextBtn.disabled = !answer(names[step]); });
  quizForm.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.type === 'radio') { e.preventDefault(); if (!nextBtn.disabled) nextBtn.click(); }
  });
  quizForm.addEventListener('submit', function (e) { e.preventDefault(); });
  function focusFirst() {
    var q = qs[step];
    var target = q.querySelector('input:checked') || q.querySelector('input');
    if (target) target.focus({ preventScroll: true });
  }
  nextBtn.addEventListener('click', function () {
    if (!answer(names[step])) return;
    if (step < qs.length - 1) { step++; renderQuiz(1); focusFirst(); } else finishQuiz();
  });
  backBtn.addEventListener('click', function () { if (step > 0) { step--; renderQuiz(-1); focusFirst(); } });
  $('quiz-restart').addEventListener('click', function () {
    quizForm.reset(); step = 0; lastResult = null;
    resultBox.hidden = true; quizForm.hidden = false; quizTop.hidden = false;
    renderQuiz(-1); focusFirst();
  });
  flip.addEventListener('click', function () { flip.classList.toggle('flipped'); });

  var R = {
    B: { cat: 'B', es: ['Permiso B · Coche', 'El permiso de coche: teórico, prácticas con tu profesor y examen de la DGT.'], en: ['Licence B · Car', 'The car licence: theory, lessons with your instructor and the DGT exam.'], enrol: 'B' },
    Bwait: { cat: 'B', es: ['Permiso B, a partir de los 18', 'Aún no puedes examinarte de coche. Mientras tanto, con el AM (desde 15) o el A1 (desde 16) ya puedes moverte en moto.'], en: ['Licence B, from age 18', 'You can’t take the car test yet. Meanwhile, AM (from 15) or A1 (from 16) gets you moving on two wheels.'], enrol: 'B' },
    FOR: { cat: 'B', es: ['Canje o permiso B español', 'Si tu país tiene convenio con España puedes canjear tu permiso en la DGT; si no, te preparamos el permiso B. Te orientamos sobre tu caso.'], en: ['Exchange or Spanish licence B', 'If your country has an agreement with Spain you can exchange your licence at the DGT; if not, we’ll prepare you for licence B. We’ll advise on your case.'], enrol: 'FOR' },
    A2: { cat: 'A2', es: ['Permiso A2 · Moto', 'Motos de hasta 35 kW. Teórico específico, prácticas en circuito cerrado y en circulación.'], en: ['Licence A2 · Motorbike', 'Motorbikes up to 35 kW. Bike-specific theory, closed-track practice and riding in traffic.'], enrol: 'A2' },
    A2b3: { cat: 'A2', es: ['Permiso A2 · Moto', 'Con tu B de más de 3 años ya puedes llevar motos de hasta 125 cc en España. Si quieres algo más grande, el siguiente paso es el A2.'], en: ['Licence A2 · Motorbike', 'With licence B held for 3+ years you can already ride up to 125 cc in Spain. For anything bigger, A2 is your next step.'], enrol: 'A2' },
    A1: { cat: 'A1', es: ['Permiso A1 · Moto 125', 'Desde los 16 años: motos de hasta 125 cc y 11 kW.'], en: ['Licence A1 · 125 cc bike', 'From age 16: motorbikes up to 125 cc and 11 kW.'], enrol: 'A1' },
    AM: { cat: 'AM', es: ['Permiso AM · Ciclomotor', 'Desde los 15 años: ciclomotores de hasta 50 cc y 45 km/h.'], en: ['Licence AM · Moped', 'From age 15: mopeds up to 50 cc and 45 km/h.'], enrol: 'AM' },
    AMcovered: { cat: 'B ✓', es: ['Ya lo tienes cubierto', 'Tu permiso B ya te permite conducir ciclomotores. Si quieres una moto de verdad, mira el A2.'], en: ['You’re already covered', 'Your licence B already lets you ride mopeds. If you want a proper motorbike, look at A2.'], enrol: 'A2' },
    AMonly: { cat: 'AM', es: ['Permiso AM · Ciclomotor', 'Con 15 años, el AM es tu permiso: ciclomotores de hasta 50 cc. A los 16 podrás pasar al A1.'], en: ['Licence AM · Moped', 'At 15, AM is your licence: mopeds up to 50 cc. At 16 you can move up to A1.'], enrol: 'AM' }
  };
  function decide(a) {
    var hasB = a.has === 'b' || a.has === 'b3';
    if (a.vehicle === 'car') { if (a.has === 'foreign') return 'FOR'; return a.age !== '18' ? 'Bwait' : 'B'; }
    if (a.vehicle === 'moto') { if (a.age === '15') return 'AMonly'; if (a.age === '16') return 'A1'; return a.has === 'b3' ? 'A2b3' : 'A2'; }
    return hasB ? 'AMcovered' : 'AM';
  }
  function finishQuiz() {
    var a = {}; names.forEach(function (n) { a[n] = answer(n); });
    lastResult = { key: decide(a), pace: a.pace };
    showResult(lastResult, true);
  }
  function showResult(res, fresh) {
    var r = R[res.key], txt = r[lang];
    $('res-cat').textContent = r.cat;
    $('res-licence').textContent = txt[0];
    $('res-text').textContent = txt[1];
    $('res-course').textContent = res.pace === 'fast'
      ? L('Curso recomendado: teórico intensivo, para presentarte antes al examen. Pídenos las próximas fechas.', 'Recommended course: intensive theory, to sit the exam sooner. Ask us for the next dates.')
      : L('Curso recomendado: clases regulares de mañana o tarde, con test online.', 'Recommended course: regular classes in the morning or afternoon, plus online tests.');
    $('res-enrol').setAttribute('data-enrol', res.pace === 'fast' && r.enrol === 'B' ? 'INT' : r.enrol);
    quizForm.hidden = true; quizTop.hidden = true; resultBox.hidden = false;
    if (fresh) {
      resultBox.focus();
      flip.classList.remove('flipped');
      if (REDUCED) flip.classList.add('flipped');
      else setTimeout(function () { flip.classList.add('flipped'); }, 450);
    }
  }
  langHooks.push(function () { renderQuiz(0); if (lastResult) showResult(lastResult, false); });

  /* ---------- Branch map ---------- */
  var pins = Array.prototype.slice.call(document.querySelectorAll('.pin'));
  function selectPin(i, focus) {
    pins.forEach(function (p, k) {
      var on = k === i;
      p.setAttribute('aria-selected', String(on));
      p.tabIndex = on ? 0 : -1;
      $(p.getAttribute('aria-controls')).classList.toggle('active', on);
    });
    if (focus) pins[i].focus();
  }
  pins.forEach(function (p, i) {
    p.addEventListener('click', function () { selectPin(i, false); });
    p.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % pins.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + pins.length) % pins.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = pins.length - 1;
      if (n !== null) { e.preventDefault(); selectPin(n, true); }
    });
  });
  if (pins.length) selectPin(1, false);

  /* ---------- Enrol links pre-select licence ---------- */
  var selLicence = $('f-licence');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-enrol]');
    if (!a) return;
    var v = a.getAttribute('data-enrol');
    if (selLicence.querySelector('option[value="' + v + '"]')) {
      selLicence.value = v;
      selLicence.closest('.field').classList.remove('invalid');
    }
  });

  /* ---------- Enrol form → WhatsApp / mailto ---------- */
  var form = $('enrol-form');
  var status = $('form-status');
  var fields = {
    licence: { el: selLicence, ok: function (v) { return !!v; } },
    branch: { el: $('f-branch'), ok: function (v) { return !!v; } },
    name: { el: $('f-name'), ok: function (v) { return v.trim().length >= 2; } },
    phone: { el: $('f-phone'), ok: function (v) { return v.replace(/\D/g, '').length >= 9; } }
  };
  function check(key, show) {
    var f = fields[key], good = f.ok(f.el.value), wrap = f.el.closest('.field');
    if (show) {
      wrap.classList.toggle('invalid', !good);
      f.el.setAttribute('aria-invalid', String(!good));
      f.el.setAttribute('aria-describedby', 'e-' + key);
    }
    return good;
  }
  Object.keys(fields).forEach(function (k) {
    var el = fields[k].el;
    el.addEventListener('blur', function () { if (el.value !== '') check(k, true); });
    ['input', 'change'].forEach(function (ev) {
      el.addEventListener(ev, function () { if (el.closest('.field').classList.contains('invalid')) check(k, true); });
    });
  });
  function optionText(sel) { var o = sel.options[sel.selectedIndex]; return o ? o.textContent.trim() : ''; }
  function buildMessage() {
    var sched = form.querySelector('input[name="schedule"]:checked').value;
    var schedTxt = sched === 'morning' ? L('Mañana', 'Morning') : L('Tarde', 'Afternoon');
    var name = fields.name.el.value.trim(), phone = fields.phone.el.value.trim();
    var lic = optionText(selLicence), branch = fields.branch.el.value;
    if (lang === 'en') {
      return 'Hello Autoescuelas Correcaminos! I’d like to enrol.\n\n• Licence/course: ' + lic + '\n• Branch: ' + branch +
        '\n• Preferred schedule: ' + schedTxt + '\n• Name: ' + name + '\n• Phone: ' + phone + '\n\n(Sent from the website enrolment form)';
    }
    return '¡Hola, Autoescuelas Correcaminos! Quiero matricularme.\n\n• Permiso/curso: ' + lic + '\n• Sede: ' + branch +
      '\n• Horario preferido: ' + schedTxt + '\n• Nombre: ' + name + '\n• Teléfono: ' + phone + '\n\n(Enviado desde el formulario de matrícula de la web)';
  }
  var channel = 'wa';
  form.querySelectorAll('button[type="submit"]').forEach(function (b) {
    b.addEventListener('click', function () { channel = b.getAttribute('data-channel'); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(fields).forEach(function (k) { if (!check(k, true) && !firstBad) firstBad = fields[k].el; });
    if (firstBad) {
      status.className = 'form-status error';
      status.textContent = L('Casi listo: revisa los campos marcados.', 'Almost there: please check the highlighted fields.');
      firstBad.focus();
      return;
    }
    var msg = buildMessage(), url;
    if (channel === 'mail') {
      var subject = L('Solicitud de matrícula · ', 'Enrolment request · ') + optionText(selLicence);
      url = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg);
      window.location.href = url;
    } else {
      url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
    }
    status.className = 'form-status';
    status.textContent = channel === 'mail'
      ? L('Se ha abierto tu correo con el mensaje listo. Solo te queda pulsar enviar.', 'Your email app should open with the message ready. Just press send.')
      : L('Se ha abierto WhatsApp con el mensaje listo. Solo te queda pulsar enviar.', 'WhatsApp should open with the message ready. Just press send.');
    form.setAttribute('data-last-url', url);
  });

  /* ---------- Init ---------- */
  $('year').textContent = new Date().getFullYear();
  measure();
  var saved = null;
  try { saved = localStorage.getItem('cc-lang'); } catch (e) {}
  if (saved === 'en') applyLang('en'); else { renderQuiz(0); miRender(false); }
  onScroll();
})();
