/* Cañadú — concept site by Noir Digital. Vanilla JS, no framework, no build step. */
(function () {
  'use strict';

  var PHONE_WA = '34952602719';
  var EMAIL = 'canadu.malaga@gmail.com';
  var TZ = 'Europe/Madrid';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia && matchMedia('(pointer: fine)').matches;

  /* ---------- Translations (Spanish lives in the HTML; English here) ---------- */
  var EN = {
    skip: 'Skip to content',
    brandSub: 'Vegetarian · Málaga',
    navAria: 'Main',
    navStory: 'About', navMood: 'In the mood for…', navMenu: 'Menu', navGallery: 'Gallery', navGift: 'Gift', navVisit: 'Visit us',
    ctaBookShort: 'Book',
    heroEyebrow: 'Plaza de la Merced · Málaga old town',
    heroTitle: 'Creative, traditional <em>and above all, healthy.</em>',
    heroLead: 'A vegetarian restaurant in the heart of Málaga, cooking with organic produce from local Málaga growers, with dishes for vegans, coeliacs and meat-eaters alike.',
    ctaBook: 'Book a table', ctaMenu: 'See the menu',
    heroRating: '<strong>4.5</strong> on Google · 2,000+ reviews',
    openChecking: 'Checking opening hours…',
    altHero: 'Colourful salad with tomato, radish, carrot, red cabbage and spinach on a wooden table',
    heroTag: 'Organic Málaga produce',
    stampText: 'VEGETARIAN · ORGANIC · MÁLAGA ·',
    scrollCue: 'Scroll down to our story',
    mq1: 'Organic Málaga produce', mq2: 'Vegan options', mq3: 'Gluten-free', mq4: 'Fresh juices', mq5: 'Organic wines', mq6: 'Homemade desserts', mq7: 'Daily set menu',
    altHuerta: 'Market stall with fresh cauliflower, radishes, broccoli and spring onions',
    altInterior: 'Warm dining room with wooden tables, tablecloths and paintings on the walls',
    storyEyebrow: 'Our story',
    storyTitle: 'The best of the <span class="scribble">market garden</span>, right on Plaza de la Merced',
    storyP1: 'A few steps from Picasso’s birthplace, Cañadú has spent years proving to Málaga that eating vegetarian means eating well. Our menu starts with organic produce from Málaga’s market gardens and time-honoured recipes, cooked with care and a creative touch.',
    storyP2: 'Salads, hot soups, ajoblanco, couscous, our apple and pine-nut croquettes, pasta, rice dishes, fresh juices, organic wines and homemade desserts like tiramisu. And every day, a healthy, affordable set menu.',
    pill1t: 'Organic produce', pill1d: 'Local and seasonal.',
    pill2t: 'For everyone', pill2d: 'Vegetarians, vegans, coeliacs… and everyone else.',
    pill3t: 'Daily set menu', pill3d: 'Healthy, varied and affordable.',
    moodEyebrow: 'To whet your appetite',
    moodTitle: 'What are you in the mood for <span class="scribble">today</span>?',
    moodLead: 'Pick how you feel and we will plate up an idea. Tap any dish to see it up close.',
    moodsAria: 'Choose a mood',
    moodFresh: 'Fresh', moodComfort: 'Comforting', moodLight: 'Light', moodSweet: 'Sweet',
    moodLink: 'See these dishes on the menu',
    plateNote: 'Illustrative photos · sample menu',
    menuEyebrow: 'The menu',
    menuTitle: 'Dishes full of <span class="scribble">colour</span>, flavour and variety',
    sampleBadge: 'Sample menu',
    sampleNote: 'Dishes based on those described on canadu.es; prices and allergens are illustrative for this proposal. The restaurant confirms its real menu.',
    tabsAria: 'Menu categories', filtersAria: 'Dietary filters',
    fVegan: 'Vegan', fGf: 'Gluten-free', fNf: 'Nut-free',
    emptyText: 'No dish in this category matches all the filters.',
    emptyBtn: 'Clear filters',
    dailyK: 'Every day', dailyT: 'A healthy, affordable daily menu', dailyD: 'Ask about today’s menu when you book.',
    legendAria: 'Allergen key',
    aGluten: 'Gluten', aMilk: 'Dairy', aEgg: 'Egg', aNuts: 'Nuts', aSesame: 'Sesame', aSoy: 'Soy',
    galEyebrow: 'Gallery', galTitle: 'We eat with our <span class="scribble">eyes</span> first',
    altEggplant: 'Roasted aubergine with red onion, coriander and nuts',
    altBowl: 'Salad bowl with avocado, chickpeas, cherry tomatoes and red cabbage',
    altHummus: 'Plate of hummus with olive oil, spices and pitta bread',
    altJuices: 'Fresh fruit and vegetable juices surrounded by fresh fruit',
    altStreet: 'Sunny street in Málaga’s historic centre with a church tower in the distance',
    altCouscous: 'Couscous with roasted peppers, sweetcorn, beans and green sauce',
    altMarket: 'Crates of purple aubergines and courgettes at a market',
    altTiramisu: 'Slice of homemade tiramisu dusted with cocoa',
    photoNote: 'Sample photography (Unsplash). The final site would use real photos of Cañadú.',
    revTitle: 'More than 2,000 diners have rated us on Google',
    revText: '<strong>4.5 out of 5</strong> on Google, from more than 2,000 reviews.',
    revLink: 'Read the reviews on Google Maps',
    revSource: 'Source: Google Maps, average rating and review count (November 2026).',
    bookEyebrow: 'Reservations', bookTitle: 'Book your table in a <span class="scribble">minute</span>',
    bookLead: 'Choose a day, time and party size. We open a ready-written WhatsApp message or email: just send it and the restaurant will confirm.',
    bookPhone: 'Rather call?',
    bookDiet: 'Tell us about allergies or preferences and we will take them into account.',
    fDate: 'Day', fPeople: 'Guests', fTime: 'Time', fName: 'Name', fNotes: 'Dietary notes', optional: '(optional)',
    fNotesPh: 'E.g. two vegans, one coeliac',
    sendWa: 'Send via WhatsApp', sendMail: 'Send via email',
    formHint: 'Nothing is sent automatically: you review the message before sending it. Your booking is confirmed when the restaurant replies.',
    gcKicker: 'Gift card', gcFor: 'For', gcFrom: 'From', gcValue: 'Value', gcFoot: 'A meal on Plaza de la Merced',
    flipBtn: 'Flip the card',
    giftEyebrow: 'Gift card', giftTitle: 'Give <span class="scribble">Cañadú</span>',
    giftLead: 'A healthy, delicious meal is a gift that always hits the spot. Pick an amount and we will prepare the message to request the card from the restaurant.',
    gAmount: 'Amount', gTo: 'For (name)', gFrom: 'From',
    giftWa: 'Request via WhatsApp', giftMail: 'Request via email',
    giftHint: 'Sample amounts. Prefer to buy online?', giftShop: 'Cañadú gift voucher shop',
    visitEyebrow: 'Visit us', visitTitle: 'In the heart of the old <span class="scribble">town</span>',
    clockLegend: 'Green arc: opening hours (Málaga time)',
    hoursCaption: 'Opening hours', hDay: 'Day', hLunch: 'Lunch', hDinner: 'Dinner',
    hoursSource: 'Hours as published on canadu.es. Bank holidays: please check with the restaurant.',
    directions: 'Get directions',
    altCathedral: 'Málaga cathedral tower seen from a narrow street in the old town',
    mapLoad: 'Show interactive map',
    contactTitle: 'Get in touch', cPhone: 'Phone',
    skylineT: 'Illustration of Plaza de la Merced in Málaga: the obelisk, the trees, balconied façades, the Santiago church tower and Gibralfaro castle behind',
    footTag: 'Vegetarian restaurant · Málaga old town',
    footDemo: 'Design proposal by Noir Digital (Marbella). Not the restaurant’s official website.',
    footPhotos: 'Photos from Unsplash, see',
    close: 'Close', ddAllergens: 'Allergens',
    ddNote: 'Illustrative photo. Sample price and allergens: always check with the staff.',
    lbAria: 'Enlarged gallery', lbPrev: 'Previous photo', lbNext: 'Next photo',
    barAria: 'Quick actions', barCall: 'Call', barBook: 'Book', barMenu: 'Menu',
    badge: 'Concept by Noir Digital · not the official site'
  };

  /* Strings used only by scripts, in both languages */
  var T = {
    es: {
      title: 'Cañadú · Restaurante vegetariano en Málaga',
      desc: 'Cañadú, restaurante vegetariano en la Plaza de la Merced de Málaga. Cocina creativa, tradicional y sana con producto de la huerta ecológica malagueña. Opciones veganas y sin gluten.',
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      openUntil: 'Abierto ahora · hasta las {t}',
      closedOpens: 'Cerrado ahora · abre hoy a las {t}',
      closedTomorrow: 'Cerrado ahora · abre mañana a las {t}',
      clock: 'Reloj de 24 horas: en Málaga son las {t}. {s}',
      all: 'Todo',
      count: function (n) { return n === 1 ? '1 plato' : n + ' platos'; },
      lunch: 'Comida', dinner: 'Cena',
      noSlots: 'No quedan horas libres este día. Prueba con otro.',
      people: function (n) { return n === 1 ? '1 persona' : n + ' personas'; },
      morePeople: 'Más de 12 (grupo)',
      errDate: 'Elige un día a partir de hoy.',
      errTime: 'Elige una hora.',
      errName: 'Escribe tu nombre para la reserva.',
      errFrom: 'Escribe tu nombre para que sepan de quién es el regalo.',
      opened: 'Hemos abierto el mensaje en {c}. Revísalo y pulsa enviar.',
      wa: 'WhatsApp', mail: 'tu app de correo',
      vegan: 'Vegano', gf: 'Sin gluten',
      allergens: 'Alérgenos: ', noAlg: 'Sin alérgenos principales (muestra)',
      details: 'Ver detalles',
      photoAlt: '{n}, foto ilustrativa',
      moodSel: 'Selección: {m}', moodClear: 'Quitar la selección «{m}»',
      moods: { fresh: 'Fresco', comfort: 'Reconfortante', light: 'Ligero', sweet: 'Dulce' },
      lbCount: '{i} / {n}',
      giftLive: 'Vista previa: tarjeta de {a} €, para {to}, de parte de {from}.',
      nobody: 'sin nombre',
      bookMsg: function (d) {
        return 'Hola, Cañadú. Me gustaría reservar una mesa:\n' +
          '• Día: ' + d.date + '\n• Hora: ' + d.time + '\n• Personas: ' + d.people + '\n• Nombre: ' + d.name +
          (d.notes ? '\n• Notas dietéticas: ' + d.notes : '') + '\n\n¿Me podéis confirmar? ¡Gracias!';
      },
      bookSubject: function (d) { return 'Reserva: ' + d.date + ', ' + d.time + ', ' + d.people; },
      giftMsg: function (d) {
        return 'Hola, Cañadú. Me gustaría regalar una tarjeta regalo:\n' +
          '• Importe: ' + d.amount + ' €\n' + (d.to ? '• Para: ' + d.to + '\n' : '') + '• De parte de: ' + d.from +
          '\n\n¿Cómo puedo pagarla y recibirla? ¡Gracias!';
      },
      giftSubject: function (d) { return 'Tarjeta regalo de ' + d.amount + ' €'; },
      mapTitle: 'Mapa de Cañadú, Plaza de la Merced 21, Málaga',
      locale: 'es-ES'
    },
    en: {
      title: 'Cañadú · Vegetarian restaurant in Málaga',
      desc: 'Cañadú, a vegetarian restaurant on Plaza de la Merced in Málaga. Creative, traditional, healthy cooking with organic local produce. Vegan and gluten-free options.',
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      openUntil: 'Open now · until {t}',
      closedOpens: 'Closed now · opens today at {t}',
      closedTomorrow: 'Closed now · opens tomorrow at {t}',
      clock: '24-hour clock: it is {t} in Málaga. {s}',
      all: 'All',
      count: function (n) { return n === 1 ? '1 dish' : n + ' dishes'; },
      lunch: 'Lunch', dinner: 'Dinner',
      noSlots: 'No times left on this day. Please try another.',
      people: function (n) { return n === 1 ? '1 guest' : n + ' guests'; },
      morePeople: 'More than 12 (group)',
      errDate: 'Choose a day from today onwards.',
      errTime: 'Choose a time.',
      errName: 'Add your name for the booking.',
      errFrom: 'Add your name so they know who the gift is from.',
      opened: 'We opened the message in {c}. Check it and press send.',
      wa: 'WhatsApp', mail: 'your email app',
      vegan: 'Vegan', gf: 'Gluten-free',
      allergens: 'Allergens: ', noAlg: 'No major allergens (sample)',
      details: 'See details',
      photoAlt: '{n}, illustrative photo',
      moodSel: 'Selection: {m}', moodClear: 'Clear the “{m}” selection',
      moods: { fresh: 'Fresh', comfort: 'Comforting', light: 'Light', sweet: 'Sweet' },
      lbCount: '{i} / {n}',
      giftLive: 'Preview: €{a} card, for {to}, from {from}.',
      nobody: 'no name yet',
      bookMsg: function (d) {
        return 'Hello Cañadú, I would like to book a table:\n' +
          '• Day: ' + d.date + '\n• Time: ' + d.time + '\n• Guests: ' + d.people + '\n• Name: ' + d.name +
          (d.notes ? '\n• Dietary notes: ' + d.notes : '') + '\n\nCould you confirm? Thank you!';
      },
      bookSubject: function (d) { return 'Booking: ' + d.date + ', ' + d.time + ', ' + d.people; },
      giftMsg: function (d) {
        return 'Hello Cañadú, I would like to buy a gift card:\n' +
          '• Amount: €' + d.amount + '\n' + (d.to ? '• For: ' + d.to + '\n' : '') + '• From: ' + d.from +
          '\n\nHow can I pay for it and receive it? Thank you!';
      },
      giftSubject: function (d) { return 'Gift card, €' + d.amount; },
      mapTitle: 'Map of Cañadú, Plaza de la Merced 21, Málaga',
      locale: 'en-GB'
    }
  };

  /* ---------- Sample menu (dish names from canadu.es; prices/allergens illustrative) ---------- */
  var CATS = [
    { id: 'all' },
    { id: 'starters', es: 'Entrantes', en: 'Starters' },
    { id: 'salads', es: 'Ensaladas', en: 'Salads' },
    { id: 'mains', es: 'Principales', en: 'Mains' },
    { id: 'desserts', es: 'Postres', en: 'Desserts' },
    { id: 'drinks', es: 'Bebidas', en: 'Drinks' }
  ];
  var ALG = {
    gluten: { icon: 'i-wheat', es: 'Gluten', en: 'Gluten' },
    milk: { icon: 'i-milk', es: 'Lácteos', en: 'Dairy' },
    egg: { icon: 'i-egg', es: 'Huevo', en: 'Egg' },
    nuts: { icon: 'i-nut', es: 'Frutos secos', en: 'Nuts' },
    sesame: { icon: 'i-sesame', es: 'Sésamo', en: 'Sesame' },
    soy: { icon: 'i-soy', es: 'Soja', en: 'Soy' }
  };
  var DISHES = [
    { id: 'croquetas', c: 'starters', p: 8.5, a: ['gluten', 'milk', 'nuts'], es: ['Croquetas de manzana y piñones', 'Una de las favoritas de la casa: cremosas, dulces y tostadas.'], en: ['Apple and pine-nut croquettes', 'A house favourite: creamy, gently sweet and golden.'] },
    { id: 'endivias', c: 'starters', p: 7.9, v: 1, a: ['sesame'], es: ['Endivias con hummus de remolacha', 'Hojas crujientes de endivia con hummus de remolacha.'], en: ['Endives with beetroot hummus', 'Crisp endive leaves with a vivid beetroot hummus.'] },
    { id: 'ajoblanco', c: 'starters', p: 6.5, v: 1, a: ['gluten', 'nuts'], es: ['Ajoblanco', 'La sopa fría malagueña de almendra y ajo, con uvas.'], en: ['Ajoblanco', 'Málaga’s classic chilled almond and garlic soup, with grapes.'] },
    { id: 'sopa', c: 'starters', p: 5.9, v: 1, a: [], es: ['Sopa caliente del día', 'Verduras de temporada de la huerta. Pregunta por la de hoy.'], en: ['Hot soup of the day', 'Seasonal market-garden vegetables. Ask about today’s.'] },
    { id: 'griega', c: 'salads', p: 9.5, a: ['milk'], es: ['Ensalada griega', 'Tomate, pepino, aceitunas, cebolla morada y queso feta.'], en: ['Greek salad', 'Tomato, cucumber, olives, red onion and feta.'] },
    { id: 'huerta', c: 'salads', p: 9, v: 1, a: [], es: ['Ensalada de la huerta', 'Hojas y verduras de temporada con vinagreta de la casa.'], en: ['Market-garden salad', 'Seasonal leaves and vegetables with house vinaigrette.'] },
    { id: 'cuscus', c: 'mains', p: 11.5, v: 1, a: ['gluten', 'nuts'], es: ['Cuscús a los frutos secos', 'Cuscús especiado con verduras y frutos secos tostados.'], en: ['Couscous with nuts', 'Spiced couscous with vegetables and toasted nuts.'] },
    { id: 'berenjena', c: 'mains', p: 12.5, a: ['milk', 'nuts'], es: ['Berenjena rellena', 'Rellena de champiñones y frutos secos, gratinada al horno.'], en: ['Stuffed aubergine', 'Filled with mushrooms and nuts, baked au gratin.'] },
    { id: 'arroz', c: 'mains', p: 12, v: 1, a: ['nuts', 'soy'], es: ['Arroz persa', 'Arroz integral con almendras, champiñones, tofu y especias.'], en: ['Persian rice', 'Brown rice with almonds, mushrooms, tofu and spices.'] },
    { id: 'callos', c: 'mains', p: 10.5, v: 1, a: [], es: ['Callos vegetarianos', 'Nuestra versión del guiso tradicional, con garbanzos.'], en: ['Vegetarian callos', 'Our take on the traditional Spanish stew, with chickpeas.'] },
    { id: 'pasta', c: 'mains', p: 10, a: ['gluten', 'milk'], es: ['Pasta del día', 'De nuestro amplio surtido de pastas. Pregunta por la salsa de hoy.'], en: ['Pasta of the day', 'From our wide range of pasta. Ask about today’s sauce.'] },
    { id: 'tiramisu', c: 'desserts', p: 5.5, a: ['gluten', 'milk', 'egg'], es: ['Tiramisú casero', 'Hecho en casa, como todos nuestros postres.'], en: ['Homemade tiramisu', 'Made in-house, like all our desserts.'] },
    { id: 'tarta', c: 'desserts', p: 5.5, v: 1, a: ['gluten'], es: ['Tarta vegana casera', 'Pregunta por la tarta del día.'], en: ['Homemade vegan cake', 'Ask about today’s cake.'] },
    { id: 'zumo', c: 'drinks', p: 4.2, v: 1, a: [], es: ['Zumo natural', 'Recién exprimido, de fruta y verdura.'], en: ['Fresh juice', 'Freshly pressed fruit and vegetables.'] },
    { id: 'vino', c: 'drinks', p: 3.8, a: [], es: ['Vino ecológico', 'Copa de vino ecológico, tinto o blanco.'], en: ['Organic wine', 'A glass of organic red or white.'] },
    { id: 'te', c: 'drinks', p: 2.5, v: 1, a: [], es: ['Té o infusión', 'Selección de tés e infusiones.'], en: ['Tea or herbal tea', 'A selection of teas and infusions.'] }
  ];
  var BY_ID = {};
  DISHES.forEach(function (d) { d.gf = d.a.indexOf('gluten') < 0; d.nf = d.a.indexOf('nuts') < 0; d.vg = !!d.v; BY_ID[d.id] = d; });
  var MOODS = {
    fresh: ['griega', 'endivias', 'ajoblanco', 'zumo'],
    comfort: ['sopa', 'callos', 'croquetas', 'arroz'],
    light: ['huerta', 'endivias', 'sopa', 'te'],
    sweet: ['tiramisu', 'tarta', 'zumo', 'te']
  };

  /* ---------- Opening hours (canadu.es) ---------- */
  function hoursFor(day) { // 0 = Sunday
    var lateClose = (day === 5 || day === 6) ? 23 * 60 + 30 : 23 * 60;
    return [[13 * 60 + 15, 16 * 60], [19 * 60, lateClose]];
  }
  var DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
  function fmt(min) { var h = Math.floor(min / 60), m = min % 60; return (h % 24) + ':' + (m < 10 ? '0' : '') + m; }
  function madridNow() {
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false })
        .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) {
      var n = new Date();
      return { y: n.getFullYear(), mo: n.getMonth() + 1, d: n.getDate(), day: n.getDay(), min: n.getHours() * 60 + n.getMinutes() };
    }
    var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { y: +parts.year, mo: +parts.month, d: +parts.day, day: map[parts.weekday], min: (+parts.hour % 24) * 60 + (+parts.minute) };
  }
  function isoDate(y, mo, d) { return y + '-' + (mo < 10 ? '0' : '') + mo + '-' + (d < 10 ? '0' : '') + d; }

  /* ---------- Helpers ---------- */
  var lang = 'es';
  try { if (localStorage.getItem('canadu-lang') === 'en') lang = 'en'; } catch (e) {}
  var state = { cat: 'all', filters: { vegan: false, gf: false, nf: false }, mood: null, plateMood: 'fresh' };
  var ES = {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function tr(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function priceFmt(p) { return new Intl.NumberFormat(T[lang].locale, { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(p); }
  function catName(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i][lang]; return ''; }
  function onIdle(fn) { (window.requestIdleCallback || function (f) { return setTimeout(f, 1); })(fn, { timeout: 1200 }); }

  function captureSpanish() {
    $$('[data-i18n]').forEach(function (el) { ES[el.dataset.i18n] = el.innerHTML; });
    $$('[data-i18n-alt]').forEach(function (el) { ES[el.dataset.i18nAlt] = el.getAttribute('alt'); });
    $$('[data-i18n-aria]').forEach(function (el) { ES[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
    $$('[data-i18n-placeholder]').forEach(function (el) { ES[el.dataset.i18nPlaceholder] = el.getAttribute('placeholder'); });
  }

  /* ---------- Word-by-word headline ---------- */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = part; frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    el.classList.add('split-ready');
  }

  function applyLang(next) {
    lang = next;
    var dict = lang === 'en' ? EN : ES;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-alt]').forEach(function (el) { var v = dict[el.dataset.i18nAlt]; if (v != null) el.setAttribute('alt', v); });
    $$('[data-i18n-aria]').forEach(function (el) { var v = dict[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    $$('[data-i18n-placeholder]').forEach(function (el) { var v = dict[el.dataset.i18nPlaceholder]; if (v != null) el.setAttribute('placeholder', v); });
    document.title = T[lang].title;
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', T[lang].desc);
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    try { localStorage.setItem('canadu-lang', lang); } catch (e) {}
    $$('[data-split]').forEach(splitWords);
    $$('.reveal.in .scribble').forEach(function () {}); // scribbles inside revealed blocks stay drawn via CSS
    if (menuBuilt) { buildMenu(); updateMenu(false); renderTabs(); }
    renderHours(); renderStatus(); renderPeople(); renderSlots(); clearErrors(); renderMoodChip();
    if (plateBuilt) renderPlate(state.plateMood, false);
    updateGiftPreview(true);
    if (currentDish) fillDish(currentDish);
    refreshLightbox();
    var mf = $('#map-frame iframe'); if (mf) mf.title = T[lang].mapTitle;
  }

  /* ---------- Menu: tabs, filters, FLIP, sheet ---------- */
  var menuBuilt = false, nodes = {};
  function renderTabs() {
    var wrap = $('#menu-tabs'); if (!wrap) return;
    wrap.innerHTML = '';
    CATS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tab'; b.id = 'tab-' + c.id;
      b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'menu-panel');
      var sel = c.id === state.cat;
      b.setAttribute('aria-selected', String(sel)); b.tabIndex = sel ? 0 : -1;
      b.textContent = c.id === 'all' ? T[lang].all : c[lang];
      b.dataset.cat = c.id;
      wrap.appendChild(b);
    });
    $('#menu-panel').setAttribute('aria-labelledby', 'tab-' + state.cat);
    requestAnimationFrame(moveInk);
  }
  function moveInk() {
    var ink = $('#tab-ink'), b = $('.tab[aria-selected="true"]');
    if (!ink || !b) return;
    ink.style.width = Math.max(b.offsetWidth - 24, 12) + 'px';
    ink.style.transform = 'translateX(' + (b.offsetLeft + 12) + 'px)';
  }

  function dishCard(d) {
    var tx = d[lang];
    var tags = '';
    if (d.vg) tags += '<span class="tag"><svg aria-hidden="true"><use href="#i-leaf"/></svg>' + T[lang].vegan + '</span>';
    if (d.gf) tags += '<span class="tag">' + T[lang].gf + '</span>';
    var algNames = d.a.map(function (k) { return ALG[k][lang]; }).join(', ');
    var alg = d.a.length ? '<span class="allergens" role="img" aria-label="' + T[lang].allergens + algNames + '">' +
      d.a.map(function (k) { return '<span class="alg" title="' + ALG[k][lang] + '"><svg aria-hidden="true"><use href="#' + ALG[k].icon + '"/></svg></span>'; }).join('') + '</span>' : '';
    return '<button type="button" class="dish" data-id="' + d.id + '" aria-haspopup="dialog">' +
      '<span class="dish-thumb"><img src="img/dish/' + d.id + '-t.webp" width="72" height="72" loading="lazy" decoding="async" alt=""></span>' +
      '<span class="dish-name">' + tx[0] + '</span><span class="dish-price">' + priceFmt(d.p) + '</span>' +
      '<span class="dish-desc">' + tx[1] + '</span><span class="dish-tags">' + tags + alg + '</span></button>';
  }
  function buildMenu() {
    var list = $('#dishes'); if (!list) return;
    list.innerHTML = '';
    DISHES.forEach(function (d) {
      var li = document.createElement('li'); li.className = 'dish-item'; li.innerHTML = dishCard(d);
      list.appendChild(li); nodes[d.id] = li;
    });
    menuBuilt = true;
  }
  function matches(d) {
    var f = state.filters;
    return (state.cat === 'all' || d.c === state.cat) && (!f.vegan || d.vg) && (!f.gf || d.gf) && (!f.nf || d.nf) &&
      (!state.mood || MOODS[state.mood].indexOf(d.id) >= 0);
  }
  function updateMenu(animate) {
    var first = {}, doAnim = animate && !RM && Element.prototype.animate;
    if (doAnim) DISHES.forEach(function (d) { var n = nodes[d.id]; if (!n.hidden) first[d.id] = n.getBoundingClientRect(); });
    var shown = 0;
    DISHES.forEach(function (d) { var ok = matches(d); nodes[d.id].hidden = !ok; if (ok) shown++; });
    $('#menu-empty').hidden = shown > 0;
    $('#menu-count').textContent = T[lang].count(shown);
    if (!doAnim) return;
    DISHES.forEach(function (d) {
      var n = nodes[d.id]; if (n.hidden) return;
      var last = n.getBoundingClientRect(), f = first[d.id];
      if (f) {
        var dx = f.left - last.left, dy = f.top - last.top;
        if (dx || dy) n.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' });
      } else {
        n.animate([{ opacity: 0, transform: 'scale(.92) translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)', delay: 80 });
      }
    });
  }
  function selectTab(id, focus) {
    state.cat = id;
    $$('.tab').forEach(function (b) {
      var sel = b.dataset.cat === id;
      b.setAttribute('aria-selected', String(sel)); b.tabIndex = sel ? 0 : -1;
      if (sel && focus) { b.focus(); b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    });
    $('#menu-panel').setAttribute('aria-labelledby', 'tab-' + id);
    moveInk(); updateMenu(true);
  }
  function renderMoodChip() {
    var chip = $('#mood-chip'); if (!chip) return;
    if (!state.mood) { chip.hidden = true; return; }
    var m = T[lang].moods[state.mood];
    $('#mood-chip-text').textContent = tr(T[lang].moodSel, { m: m });
    chip.setAttribute('aria-label', tr(T[lang].moodClear, { m: m }));
    chip.hidden = false;
  }
  function initMenu() {
    renderTabs(); buildMenu(); updateMenu(false);
    var tabs = $('#menu-tabs');
    tabs.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) selectTab(b.dataset.cat, false); });
    tabs.addEventListener('keydown', function (e) {
      var keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (keys.indexOf(e.key) < 0) return;
      e.preventDefault();
      var ids = CATS.map(function (c) { return c.id; });
      var i = ids.indexOf(state.cat);
      if (e.key === 'ArrowRight') i = (i + 1) % ids.length;
      if (e.key === 'ArrowLeft') i = (i - 1 + ids.length) % ids.length;
      if (e.key === 'Home') i = 0;
      if (e.key === 'End') i = ids.length - 1;
      selectTab(ids[i], true);
    });
    $$('.chip[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var k = chip.dataset.filter;
        state.filters[k] = !state.filters[k];
        chip.setAttribute('aria-pressed', String(state.filters[k]));
        updateMenu(true);
      });
    });
    $('#mood-chip').addEventListener('click', function () { state.mood = null; renderMoodChip(); updateMenu(true); var c = $('.chip[data-filter]'); if (c) c.focus(); });
    $('#clear-filters').addEventListener('click', function () {
      Object.keys(state.filters).forEach(function (k) { state.filters[k] = false; });
      state.mood = null; renderMoodChip();
      $$('.chip[data-filter]').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      updateMenu(true);
      var first = $('.chip[data-filter]'); if (first) first.focus();
    });
    $('#dishes').addEventListener('click', function (e) { var b = e.target.closest('.dish'); if (b) openDish(b.dataset.id); });
    window.addEventListener('resize', moveInk);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk);
  }

  /* Dish sheet */
  var lastFocus = null, currentDish = null, refreshLightbox = function () {};
  function openDish(id) {
    var dlg = $('#dish-dialog'); if (!BY_ID[id] || !dlg) return;
    fillDish(id);
    lastFocus = document.activeElement;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function fillDish(id) {
    var d = BY_ID[id]; currentDish = id;
    var tx = d[lang];
    $('#dd-cat').textContent = catName(d.c);
    $('#dd-title').textContent = tx[0];
    $('#dd-price').textContent = priceFmt(d.p);
    $('#dd-desc').textContent = tx[1];
    var tags = '';
    if (d.vg) tags += '<span class="tag"><svg aria-hidden="true"><use href="#i-leaf"/></svg>' + T[lang].vegan + '</span>';
    if (d.gf) tags += '<span class="tag">' + T[lang].gf + '</span>';
    $('#dd-tags').innerHTML = tags;
    $('#dd-alg').innerHTML = d.a.length ? d.a.map(function (k) {
      return '<li><svg aria-hidden="true"><use href="#' + ALG[k].icon + '"/></svg>' + ALG[k][lang] + '</li>';
    }).join('') : '<li>' + T[lang].noAlg + '</li>';
    var img = $('#dd-img');
    img.src = 'img/dish/' + d.id + '.webp';
    img.alt = tr(T[lang].photoAlt, { n: tx[0] });
  }
  function wireDialog(dlg) {
    if (!dlg) return;
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
    dlg.addEventListener('close', function () { if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); });
  }

  /* ---------- Mood picker ---------- */
  var plateBuilt = false;
  function renderPlate(mood, animate) {
    state.plateMood = mood;
    var plate = $('#plate'), list = $('#mood-list'); if (!plate) return;
    $$('.p-dish', plate).forEach(function (old) {
      if (!animate || RM) { old.remove(); return; }
      old.classList.add('leave'); setTimeout(function () { old.remove(); }, 320);
    });
    MOODS[mood].forEach(function (id, i) {
      var d = BY_ID[id];
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'p-dish p' + i + (animate && !RM ? ' enter' : '');
      b.dataset.id = id;
      b.setAttribute('aria-label', d[lang][0] + ', ' + priceFmt(d.p) + '. ' + T[lang].details);
      b.style.setProperty('--fx', ((i % 2 ? 1 : -1) * (120 + i * 30)) + 'px');
      b.style.setProperty('--fy', (i < 2 ? -140 : 160) + 'px');
      b.innerHTML = '<img src="img/dish/' + id + '-t.webp" width="320" height="320" alt="" decoding="async">';
      plate.appendChild(b);
      if (animate && !RM) setTimeout(function () { b.style.transitionDelay = (i * 90) + 'ms'; b.classList.remove('enter'); setTimeout(function () { b.style.transitionDelay = ''; }, 900 + i * 90); }, 340);
    });
    list.innerHTML = MOODS[mood].map(function (id, i) {
      var d = BY_ID[id];
      return '<li style="--i:' + i + '"><button type="button" data-id="' + id + '">' + d[lang][0] + '</button><span class="mp">' + priceFmt(d.p) + '</span></li>';
    }).join('');
    plateBuilt = true;
  }
  function initMood() {
    var section = $('#apetece'); if (!section) return;
    var go = function () { if (!plateBuilt) renderPlate(state.plateMood, true); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { go(); io.disconnect(); } }, { rootMargin: '0px 0px -25% 0px' });
      io.observe(section);
    } else go();
    $$('.mood-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.mood-btn').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderPlate(b.dataset.mood, true);
      });
    });
    section.addEventListener('click', function (e) {
      var t = e.target.closest('.p-dish, .mood-list button'); if (t) openDish(t.dataset.id);
    });
    $('#mood-link').addEventListener('click', function () {
      state.mood = state.plateMood; state.cat = 'all';
      if (menuBuilt) { renderTabs(); renderMoodChip(); updateMenu(false); }
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function initLightbox() {
    var btns = $$('.m-btn'), dlg = $('#lightbox'); if (!dlg || !btns.length) return;
    var img = $('#lb-img'), idx = 0, startX = null;
    function show(i, dir) {
      idx = (i + btns.length) % btns.length;
      var b = btns[idx], thumb = $('img', b);
      var apply = function () {
        img.src = b.dataset.full; img.alt = thumb.alt;
        $('#lb-cap').textContent = thumb.alt;
        $('#lb-count').textContent = tr(T[lang].lbCount, { i: idx + 1, n: btns.length });
        img.classList.remove('swap-l', 'swap-r');
      };
      if (dir && !RM) { img.classList.add(dir > 0 ? 'swap-l' : 'swap-r'); setTimeout(apply, 180); } else apply();
    }
    refreshLightbox = function () { if (img.getAttribute('src')) show(idx); };
    btns.forEach(function (b, i) {
      b.setAttribute('aria-haspopup', 'dialog');
      b.addEventListener('click', function () { lastFocus = b; show(i); dlg.showModal(); });
    });
    $('#lb-prev').addEventListener('click', function () { show(idx - 1, -1); });
    $('#lb-next').addEventListener('click', function () { show(idx + 1, 1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1, 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1, -1); }
    });
    dlg.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    dlg.addEventListener('pointerup', function (e) {
      if (startX == null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    dlg.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) dlg.close(); });
    dlg.addEventListener('close', function () { if (lastFocus) lastFocus.focus({ preventScroll: true }); });
  }

  /* ---------- Hours, status, clock ---------- */
  function renderHours() {
    var body = $('#hours-body'); if (!body) return;
    var today = madridNow().day;
    body.innerHTML = DAY_ORDER.map(function (d) {
      var h = hoursFor(d);
      return '<tr' + (d === today ? ' class="today"' : '') + '><th scope="row">' + T[lang].days[d] + '</th><td>' +
        fmt(h[0][0]) + '–' + fmt(h[0][1]) + '</td><td>' + fmt(h[1][0]) + '–' + fmt(h[1][1]) + '</td></tr>';
    }).join('');
  }
  function statusNow() {
    var n = madridNow(), h = hoursFor(n.day);
    for (var i = 0; i < h.length; i++) if (n.min >= h[i][0] && n.min < h[i][1]) return { open: true, text: tr(T[lang].openUntil, { t: fmt(h[i][1]) }), n: n };
    for (var j = 0; j < h.length; j++) if (n.min < h[j][0]) return { open: false, text: tr(T[lang].closedOpens, { t: fmt(h[j][0]) }), n: n };
    return { open: false, text: tr(T[lang].closedTomorrow, { t: fmt(hoursFor((n.day + 1) % 7)[0][0]) }), n: n };
  }
  function renderStatus() {
    var s = statusNow();
    $$('[data-open-status]').forEach(function (el) {
      el.classList.toggle('is-open', s.open); el.classList.toggle('is-closed', !s.open);
      var t = $('.open-text', el); if (t) { t.textContent = s.text; t.removeAttribute('data-i18n'); }
    });
    var clock = $('#clock');
    if (clock) {
      clock.setAttribute('aria-label', tr(T[lang].clock, { t: fmt(s.n.min), s: s.text }));
      clock.classList.toggle('night', s.n.min < 7 * 60 + 30 || s.n.min >= 20 * 60 + 30);
      if (clock.dataset.shown) clock.style.setProperty('--rot', (s.n.min / 1440 * 360) + 'deg');
    }
  }
  function polar(minutes, r) { var a = (minutes / 1440) * 2 * Math.PI - Math.PI / 2; return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; }
  function initClock() {
    var ticks = $('#clk-ticks'), open = $('#clk-open'); if (!ticks) return;
    var svgNS = 'http://www.w3.org/2000/svg', html = '';
    for (var h = 0; h < 24; h++) {
      var major = h % 6 === 0, p1 = polar(h * 60, 92 - (major ? 12 : 7)), p2 = polar(h * 60, 88);
      html += '<line class="' + (major ? 'major' : '') + '" x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '"/>';
      if (major) { var t = polar(h * 60, 60); html += '<text x="' + t[0].toFixed(1) + '" y="' + (t[1] + 4.5).toFixed(1) + '" text-anchor="middle">' + h + '</text>'; }
    }
    ticks.innerHTML = html;
    var today = madridNow().day;
    open.innerHTML = hoursFor(today).map(function (r) {
      var a = polar(r[0], 76), b = polar(r[1], 76), large = (r[1] - r[0]) > 720 ? 1 : 0;
      return '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'A76 76 0 ' + large + ' 1 ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '"/>';
    }).join('');
    void svgNS;
    var clock = $('#clock');
    var reveal = function () { clock.dataset.shown = '1'; renderStatus(); };
    if ('IntersectionObserver' in window && !RM) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { setTimeout(reveal, 200); io.disconnect(); } }, { threshold: .5 });
      io.observe(clock);
    } else reveal();
  }

  /* ---------- Booking ---------- */
  var dateInput, slotsWrap, peopleSel;
  function slotsFor(iso) {
    var p = iso.split('-').map(Number);
    var day = new Date(p[0], p[1] - 1, p[2]).getDay();
    var h = hoursFor(day), out = [];
    // Last seating: 45 min before lunch closes, 60 min before dinner closes.
    for (var t = 13 * 60 + 30; t <= h[0][1] - 45; t += 30) out.push({ m: t, g: 'lunch' });
    for (var u = h[1][0]; u <= h[1][1] - 60; u += 30) out.push({ m: u, g: 'dinner' });
    return out;
  }
  function todayIso() { var n = madridNow(); return isoDate(n.y, n.mo, n.d); }
  function renderPeople() {
    if (!peopleSel) return;
    var cur = peopleSel.value || '2', opts = '';
    for (var i = 1; i <= 12; i++) opts += '<option value="' + i + '">' + T[lang].people(i) + '</option>';
    opts += '<option value="13+">' + T[lang].morePeople + '</option>';
    peopleSel.innerHTML = opts; peopleSel.value = cur;
  }
  function renderSlots() {
    if (!slotsWrap || !dateInput) return;
    var prev = (slotsWrap.querySelector('input:checked') || {}).value;
    var iso = dateInput.value;
    if (!iso) { slotsWrap.innerHTML = ''; return; }
    var isToday = iso === todayIso(), nowMin = madridNow().min;
    var html = '', group = '', any = false;
    slotsFor(iso).forEach(function (s) {
      if (s.g !== group) { group = s.g; html += '<p class="slot-group" aria-hidden="true">' + T[lang][s.g] + '</p>'; }
      var past = isToday && s.m <= nowMin + 30;
      if (!past) any = true;
      var v = fmt(s.m);
      html += '<label class="slot"><input type="radio" name="time" value="' + v + '"' + (past ? ' disabled' : '') +
        (v === prev && !past ? ' checked' : '') + ' aria-label="' + T[lang][s.g] + ' ' + v + '"><span>' + v + '</span></label>';
    });
    if (!any) html += '<p class="slots-empty">' + T[lang].noSlots + '</p>';
    slotsWrap.innerHTML = html;
  }
  function longDate(iso) {
    var p = iso.split('-').map(Number);
    return new Intl.DateTimeFormat(T[lang].locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(p[0], p[1] - 1, p[2], 12));
  }
  function setErr(input, errEl, msg) {
    errEl.textContent = msg || ''; errEl.hidden = !msg;
    if (input) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
  }
  function clearErrors() {
    $$('.err').forEach(function (e) { e.hidden = true; e.textContent = ''; });
    $$('[aria-invalid]').forEach(function (e) { e.removeAttribute('aria-invalid'); });
  }
  function openChannel(channel, text, subject) {
    var url;
    if (channel === 'mail') {
      url = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      window.location.href = url;
    } else {
      url = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(text);
      var w = window.open(url, '_blank', 'noopener');
      if (!w) window.location.href = url;
    }
    return url;
  }
  function initBooking() {
    var form = $('#book-form'); if (!form) return;
    dateInput = $('#b-date'); slotsWrap = $('#b-slots'); peopleSel = $('#b-people');
    dateInput.min = todayIso();
    var n = madridNow();
    var d = new Date(n.y, n.mo - 1, n.d, 12);
    if (n.min > 21 * 60) d.setDate(d.getDate() + 1);
    dateInput.value = isoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    var max = new Date(n.y, n.mo - 1, n.d + 120, 12);
    dateInput.max = isoDate(max.getFullYear(), max.getMonth() + 1, max.getDate());
    renderPeople(); peopleSel.value = '2'; renderSlots();
    dateInput.addEventListener('change', function () {
      renderSlots();
      if (dateInput.value && dateInput.value >= dateInput.min) setErr(dateInput, $('#b-date-err'), '');
    });
    slotsWrap.addEventListener('change', function () { setErr(null, $('#b-time-err'), ''); });
    var nameIn = $('#b-name');
    nameIn.addEventListener('blur', function () { if (nameIn.value.trim() === '' && nameIn.dataset.touched) setErr(nameIn, $('#b-name-err'), T[lang].errName); });
    nameIn.addEventListener('input', function () { nameIn.dataset.touched = '1'; if (nameIn.value.trim()) setErr(nameIn, $('#b-name-err'), ''); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var channel = (e.submitter && e.submitter.dataset.channel) || 'wa';
      var ok = true, firstBad = null, dv = dateInput.value;
      if (!dv || dv < dateInput.min) { setErr(dateInput, $('#b-date-err'), T[lang].errDate); ok = false; firstBad = firstBad || dateInput; }
      var slot = slotsWrap.querySelector('input:checked');
      if (!slot) { setErr(null, $('#b-time-err'), T[lang].errTime); ok = false; firstBad = firstBad || slotsWrap.querySelector('input:not(:disabled)') || dateInput; }
      var name = nameIn.value.trim();
      if (!name) { setErr(nameIn, $('#b-name-err'), T[lang].errName); ok = false; firstBad = firstBad || nameIn; }
      if (!ok) { firstBad.focus(); return; }
      var data = {
        date: longDate(dv), time: slot.value,
        people: peopleSel.value === '13+' ? T[lang].morePeople : T[lang].people(+peopleSel.value),
        name: name, notes: $('#b-notes').value.trim()
      };
      form.dataset.lastUrl = openChannel(channel, T[lang].bookMsg(data), T[lang].bookSubject(data));
      $('#book-status').textContent = tr(T[lang].opened, { c: T[lang][channel] });
    });
  }

  /* ---------- Gift card (3D flip + live preview) ---------- */
  var giftTimer;
  function updateGiftPreview(silent) {
    var form = $('#gift-form'); if (!form) return;
    var amt = (form.querySelector('input[name=amount]:checked') || {}).value || '50';
    var to = $('#g-to').value.trim(), from = $('#g-from').value.trim();
    $$('.gc-amt').forEach(function (e) { e.textContent = amt; });
    $$('.gc-to').forEach(function (e) { e.textContent = to || '—'; });
    $$('.gc-from').forEach(function (e) { e.textContent = from || '—'; });
    if (silent) return;
    clearTimeout(giftTimer);
    giftTimer = setTimeout(function () {
      $('#gift-live').textContent = tr(T[lang].giftLive, { a: amt, to: to || T[lang].nobody, from: from || T[lang].nobody });
    }, 700);
  }
  function initGift() {
    var form = $('#gift-form'); if (!form) return;
    var flip = $('#flip'), fromIn = $('#g-from');
    var setFlip = function (back) { flip.classList.toggle('flipped', back); };
    form.addEventListener('change', function (e) { if (e.target.name === 'amount') { setFlip(false); updateGiftPreview(); } });
    form.addEventListener('focusin', function (e) {
      if (e.target.id === 'g-to' || e.target.id === 'g-from') setFlip(true);
      else if (e.target.name === 'amount') setFlip(false);
    });
    form.addEventListener('input', function (e) { if (e.target.type === 'text') updateGiftPreview(); });
    $('#flip-btn').addEventListener('click', function () { setFlip(!flip.classList.contains('flipped')); });
    fromIn.addEventListener('input', function () { if (fromIn.value.trim()) setErr(fromIn, $('#g-from-err'), ''); });
    if (FINE && !RM) {
      var inner = $('#flip-inner');
      flip.addEventListener('pointermove', function (e) {
        var r = flip.getBoundingClientRect();
        inner.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 14).toFixed(2) + 'deg');
        inner.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 10).toFixed(2) + 'deg');
      });
      flip.addEventListener('pointerleave', function () { inner.style.setProperty('--ry', '0deg'); inner.style.setProperty('--rx', '0deg'); });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var channel = (e.submitter && e.submitter.dataset.channel) || 'wa';
      var from = fromIn.value.trim();
      if (!from) { setErr(fromIn, $('#g-from-err'), T[lang].errFrom); fromIn.focus(); return; }
      var data = { amount: form.querySelector('input[name=amount]:checked').value, to: $('#g-to').value.trim(), from: from };
      form.dataset.lastUrl = openChannel(channel, T[lang].giftMsg(data), T[lang].giftSubject(data));
    });
    updateGiftPreview(true);
  }

  /* ---------- Map (click to load) ---------- */
  function initMap() {
    var btn = $('#map-load'); if (!btn) return;
    btn.addEventListener('click', function () {
      var frame = $('#map-frame');
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Restaurante Vegetariano Cañadú, Plaza de la Merced 21, 29012 Málaga') + '&z=17&output=embed&hl=' + lang;
      ifr.title = T[lang].mapTitle; ifr.loading = 'lazy'; ifr.referrerPolicy = 'no-referrer-when-downgrade';
      frame.innerHTML = ''; frame.appendChild(ifr); ifr.focus();
    });
  }

  /* ---------- Reveal, count-up, skyline ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0;
    var nf = new Intl.NumberFormat(T[lang].locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (RM) { el.textContent = nf.format(target); return; }
    var t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / 1400, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = nf.format(target * e);
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  function initReveal() {
    var els = $$('.reveal, .m-item, .skyline');
    if (!('IntersectionObserver' in window) || RM) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target; t.classList.add('in'); io.unobserve(t);
        $$('[data-count]', t).forEach(countUp);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scroll + pointer driven motion (one rAF loop) ---------- */
  function initMotion() {
    var header = $('.site-header'), prog = $('.scroll-progress span');
    var hero = $('#inicio'), flora = $$('.fl'), vines = $$('.vine');
    var px = 0, py = 0, ticking = false;
    if (RM) vines.forEach(function (v) { v.classList.add('static'); });
    function frame() {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      header.classList.toggle('scrolled', y > 8);
      var max = document.documentElement.scrollHeight - vh;
      if (prog) prog.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : 0);
      if (RM) return;
      if (y < hero.offsetHeight + 100) {
        flora.forEach(function (f) {
          var d = +f.style.getPropertyValue('--d') || 1;
          f.style.transform = 'translate3d(' + (px * d * 26).toFixed(1) + 'px,' + (-y * d * .28 + py * d * 18).toFixed(1) + 'px,0)';
        });
      }
      vines.forEach(function (v) {
        var r = v.parentElement.getBoundingClientRect();
        var p = Math.min(Math.max((vh * .85 - r.top) / (r.height * .9), 0), 1);
        v.style.setProperty('--p', p.toFixed(3));
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    if (FINE && !RM) {
      hero.addEventListener('pointermove', function (e) { px = e.clientX / window.innerWidth - .5; py = e.clientY / window.innerHeight - .5; req(); });
      hero.addEventListener('pointerleave', function () { px = 0; py = 0; req(); });
    }
    req();
  }

  /* ---------- Boot ---------- */
  captureSpanish();
  if (lang === 'en') applyLang('en'); else $$('[data-split]').forEach(splitWords);
  initMotion(); initReveal(); renderStatus();
  setInterval(renderStatus, 60000);
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }); });
  wireDialog($('#dish-dialog'));
  // Below-the-fold widgets are built once the first paint is done.
  onIdle(function () {
    initMenu(); initMood(); initBooking(); initGift(); initMap(); initLightbox(); initClock(); renderHours();
  });
})();
