/* Clínica Veterinaria Estepona · concept by Noir Digital · vanilla JS, no dependencies */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');

  var WA = '34630875543';
  var EMAIL = 'clinvetestepona@hotmail.com';

  /* ------------------------------------------------------------------ i18n */
  var EN = {
    docTitle: 'Clínica Veterinaria Estepona · Medicine and surgery for your pet',
    skip: 'Skip to content', brandAria: 'Clínica Veterinaria Estepona, home', navAria: 'Main',
    navServices: 'Services', navPlanner: 'Vaccine planner', navTeam: 'Team', navHours: 'Hours', navContact: 'Contact',
    langAria: 'Language', sosShort: 'Emergency', ctaBookShort: 'Book a visit', menuOpen: 'Open menu',
    altHero: 'A smiling woman hugs her black-coated dog in a sunny meadow',
    heroRating: '275 reviews on Google', heroLangs: 'We speak Spanish, English and Polish',
    openChecking: 'Checking opening hours…',
    heroTitleA: 'Caring for the ones', heroTitleB: 'you love most.',
    heroLead: 'Medicine and surgery for dogs, cats and small mammals in Estepona. In-house lab, diagnostic imaging, a fully equipped operating theatre and a warm welcome from the very first visit.',
    ctaBook: 'Book a visit', ctaSos: 'Emergency now',
    factAddress: 'C/ Monterroso 51, Estepona', factParking: 'Parking in front of the clinic', factLangs: 'Español · English · Polski',
    sosTitle: 'Is it an emergency?',
    sosText: 'Please call before you come so we can get ready. If you can’t talk, send us a WhatsApp telling us what’s happening.',
    sosNote: 'Emergency hours outside normal opening: [to be confirmed with the clinic]',
    callLabel: 'Call', callMobile: 'Mobile',
    altClinic: 'A chihuahua standing on an exam table while gentle hands steady it',
    photoTag: 'Illustrative photo', aboutKicker: 'Since October 2015',
    aboutTitle: 'A neighbourhood clinic with hospital-grade care.',
    aboutP1: 'Led by Dr Ewa Marta Zakrzewska, vet and owner, Clínica Veterinaria Estepona provides small-animal medicine and surgery with personal, caring attention.',
    aboutP2: 'Our commitment: to improve families’ quality of life by looking after their pets’ health.',
    factsAria: 'The clinic in numbers', fact1: 'of facilities', fact2: 'equipped consulting rooms', fact3: 'hospital places', fact4: 'full operating theatre and prep room',
    servKicker: 'Services', servTitle: 'Everything your pet needs, under one roof.', servLead: 'Tap a service to see what it includes.',
    sConsult: 'Veterinary consultations', sConsultS: 'Dogs, cats, small mammals and rodents.',
    sVacc: 'Vaccines and prevention', sVaccS: 'Vaccinations, parasite control and check-ups.',
    sSurg: 'Specialist surgery', sSurgS: 'From spaying and neutering to abdominal, thoracic or eye surgery.',
    sTrauma: 'Traumatology and orthopaedics', sTraumaS: 'Fractures, ligaments, dysplasia and neurosurgery.',
    sImg: 'Diagnostic imaging', sImgS: 'Digital X-ray, ultrasound and endoscopy.',
    sLab: 'In-house laboratory', sLabS: 'Blood, urine and other tests, with results in minutes.',
    sAnes: 'Anaesthesia and pain control', sAnesS: 'Protocols tailored to each patient.',
    sHosp: 'Hospitalisation', sHospS: 'Climate-controlled, video-monitored ward with a cats-only area.',
    sGroom: 'Grooming', sGroomS: 'Bath and trim with products suited to coat and skin.',
    sShop: 'Specialist pet shop', sShopS: 'Clinical nutrition, parasite control and accessories.',
    priceNote: 'Prices: [price] · the clinic will tell you the cost before any treatment.',
    close: 'Close', sheetSrc: 'Information taken from the clinic’s current website.', sheetBook: 'Book a visit for this',
    planKicker: 'Vaccine planner', planTitle: 'New puppy or kitten at home?',
    planLead: 'Enter their date of birth and we’ll show you an approximate calendar of their first visits: vaccines, deworming, microchip and check-ups.',
    planSpecies: 'Your pet is a…', pDog: 'Puppy', pCat: 'Kitten', planBirth: 'Date of birth (approximate is fine)',
    planGo: 'See their calendar', planExample: 'Try with 8 weeks', planBook: 'Book the next visit',
    planDiscA: 'For guidance only.', planDiscB: 'Every animal is different: vaccines, dates and legal requirements are decided by your vet. Please check with your vet.',
    teamKicker: 'The team', teamTitle: 'Vets from four countries. One standard of care.',
    teamLead: 'Which language would you like to be seen in? Pick one to see who speaks it.',
    filterAria: 'Filter by language', fAll: 'Everyone', fEs: 'Español', fEn: 'English', fPl: 'Polski', fDe: 'Deutsch', fRu: 'Русский / Українська',
    r1: 'Vet, director and owner',
    b1: 'Qualified in Lublin (Poland, 2008), with postgraduate training in Small Animal Surgery and Orthopaedics (Madrid, 2016). Interests: surgery, orthopaedics, oncology and cell therapies.',
    r2: 'Vet · surgery and orthopaedics',
    b2: 'Doctorate in Animal Medicine and Surgery (University of Murcia), with master’s degrees in advanced surgery, traumatology, orthopaedics, neurosurgery and diagnostic techniques. Interests: surgery, orthopaedics, anaesthesiology and radiology.',
    r3: 'Vet · internal medicine',
    b3: 'Graduated from the University of Córdoba and worked for years in clinics and hospitals in Germany and Spain. Interests: endocrinology, cardiology, ophthalmology, ultrasound, dermatology and neurology. Also speaks Italian.',
    r4: 'Vet · dentistry and exotics',
    b4: 'Graduated from the University of Lviv (Ukraine, 2004), with advanced studies in parasitology and infectious diseases. Interests: dentistry, ophthalmology, gastroenterology, urology and exotic animals.',
    r5: 'Veterinary nurse assistant',
    b5: 'Trained as a veterinary assistant at the clinic itself, with a background in horse riding and handling exotic animals.',
    teamNote: 'Team as listed on the clinic’s current website · [confirm current team and photos]',
    hoursKicker: 'Hours', hoursTitle: 'When to find us', hoursCaption: 'Weekly opening hours',
    d1: 'Monday', d2: 'Tuesday', d3: 'Wednesday', d4: 'Thursday', d5: 'Friday', d6: 'Saturday', d0: 'Sunday', closed: 'Closed',
    hoursSrc: 'Hours as shown on Google Maps (November 2026). Public holidays and emergencies: [to be confirmed].',
    altCuddle: 'A dog and a cat curled up together on the grass',
    revKicker: 'Reviews', revCount: 'Average rating on Google from 275 reviews', revTopics: 'Topics Google highlights in the reviews:',
    topic1: 'English-speaking staff', topic2: 'Polish-speaking vet', revLink: 'Read the reviews on Google',
    revSrc: 'Source: Google Maps, checked on 18 November 2026.',
    bookKicker: 'Book a visit', bookTitle: 'Four steps and you’re done.',
    bookLead: 'Prepare your request here and send it by WhatsApp or email. The clinic will confirm the day and time.',
    altFriends: 'A golden-haired dog plays with a tortoiseshell kitten on a blanket',
    st1: 'Who is the visit for?', petDog: 'Dog', petCat: 'Cat', petSmall: 'Rabbit or rodent', petOther: 'Other',
    petName: 'Pet’s name', optional: '(optional)',
    st2: 'What’s the reason?', rsConsult: 'Consultation: not feeling well', rsVaccine: 'Vaccine or deworming', rsCheck: 'General check-up',
    rsSurgery: 'Surgical assessment or neutering', rsTests: 'Tests or diagnostic imaging', rsGroom: 'Grooming', rsOther: 'Something else',
    notes: 'Tell us a bit more',
    st3: 'Which day and time suit you?', st3Hint: 'Monday to Friday, 11:00 to 18:00. This is a preference: the clinic will confirm.',
    dayAria: 'Preferred day', slotAria: 'Preferred time',
    st4: 'Your contact details', ownerName: 'Your name', ownerPhone: 'Phone', phoneHint: 'For example: 600 123 456 or +44 7700 900123',
    ownerEmail: 'Email', prefLang: 'Preferred language',
    st5: 'Your request is ready', st5Hint: 'Choose how to send it. Your app will open with the message already written; you decide whether to send it.',
    sendWa: 'Send by WhatsApp', sendMail: 'Send by email', restart: 'Start again', back: 'Back', next: 'Continue',
    faqKicker: 'FAQ', faqTitle: 'What people often ask us',
    q1: 'Which animals do you treat?', a1: 'Dogs and cats, as well as small mammals and rodents. Several team members have a special interest in exotic animals: ask us about your pet.',
    q2: 'Do you handle emergencies?', a2: 'Yes. Call 951 518 244 or WhatsApp 630 875 543 before you come. Emergency hours outside normal opening: [to be confirmed with the clinic].',
    q3: 'Which languages do you speak?', a3: 'Spanish and English, and Polish too. Some team members also speak German, Italian, Russian or Ukrainian.',
    q4: 'Is there parking?', a4: 'Yes, there is a parking area in front of the clinic, easy to reach from Estepona town centre and from the motorway.',
    q5: 'Do you run tests at the clinic?', a5: 'Yes. Our in-house lab handles blood, stool and urine tests, cytology and more, with results in minutes.',
    q6: 'How do I book grooming?', a6: 'By phone, in person, or with the form on this page by choosing “Grooming” as the reason.',
    q7: 'How much is a consultation?', a7: '[price] · The clinic will tell you the cost before any test or treatment.',
    q8: 'Which payment methods do you accept?', a8: '[payment methods, to be confirmed with the clinic]',
    contactKicker: 'Contact', contactTitle: 'Come and see us in Estepona', mobileLabel: '(mobile and WhatsApp)',
    contactHours: 'Monday to Friday, 11:00 – 18:00', igPh: 'Instagram: [correct link]', directions: 'Get directions',
    mapLoad: 'Show interactive map', mapNote: 'The Google map only loads if you ask for it.',
    footAddr: 'C/ Monterroso 51 · 29680 Estepona · +34 951 518 244',
    footDemo: 'Design concept created by Noir Digital (Marbella) as a proposal. This is not the clinic’s official website. Illustrative photos from Unsplash; credits in CREDITS.md.',
    sosDTitle: 'Veterinary emergency',
    sosDText: 'Stay calm and call us. If your pet isn’t breathing, is bleeding heavily, has swallowed something toxic or can’t get up, come as quickly as you can.',
    sosWa: 'Message on WhatsApp', mbarAria: 'Quick actions',
    badge: 'Noir Digital concept · not the official website',
    pupAria: 'Say hello to the puppy', sinceRing: 'SINCE 2015 · ESTEPONA · WITH CARE ·',
    dsKicker: 'A day at the clinic', dsTitle: 'From 11:00 to 18:00, in good hands.', dsLead: 'Scroll slowly and spend a day with us.',
    ds1w: '11:00 · Arrival', ds1t: 'We open the doors', ds1: 'Parking in front of the clinic and a team that can help you in Spanish, English or Polish.',
    ds2w: 'Consultation', ds2t: 'A calm, careful exam', ds2: 'Two equipped consulting rooms for dogs, cats, small mammals and rodents.',
    ds3w: 'Laboratory', ds3t: 'Results in minutes', ds3: 'Our in-house lab tests blood, urine and more, without sending samples to another city.',
    ds4w: 'Surgery and hospital care', ds4t: 'Care when it’s needed', ds4: 'A full operating theatre with a prep room, and a climate-controlled, video-monitored ward with 20 places and a cats-only area.',
    ds5w: '18:00 · Home', ds5t: 'Back home', ds5: 'We close at 18:00. Emergency hours outside normal opening: [to be confirmed with the clinic].',
    dsNote: 'Illustrative tour, based on the facilities described on the clinic’s current website.',
    grBirth: 'Birth', grYear: '1 year'
  };

  /* dynamic strings */
  var T = {
    es: {
      open: 'Abierto ahora · cierra a las 18:00', closedOpensToday: 'Cerrado · abre hoy a las 11:00',
      closedOpensTomorrow: 'Cerrado · abre mañana a las 11:00', closedOpensMon: 'Cerrado · abre el lunes a las 11:00',
      today: 'Hoy', step: 'Paso {n} de 4', done: 'Listo',
      errPet: 'Elija el tipo de mascota para continuar.', errReason: 'Elija un motivo para continuar.',
      errDay: 'Elija un día para continuar.', errSlot: 'Elija una hora (o «Cualquier hora»).',
      errOwner: 'Escriba su nombre para que la clínica sepa a quién llamar.', errPhone: 'Revise el teléfono: necesitamos al menos 9 cifras.',
      errEmail: 'El correo parece incompleto. Puede dejarlo vacío.',
      anyTime: 'Cualquier hora', menuClose: 'Cerrar menú', menuOpen: 'Abrir menú',
      sumPet: 'Mascota', sumReason: 'Motivo', sumWhen: 'Preferencia', sumOwner: 'Nombre', sumPhone: 'Teléfono', sumEmail: 'Correo', sumLang: 'Idioma', sumNotes: 'Notas',
      pets: { dog: 'Perro', cat: 'Gato', small: 'Conejo o roedor', other: 'Otro' },
      reasons: { consult: 'Consulta: no está bien', vaccine: 'Vacuna o desparasitación', checkup: 'Revisión general', surgery: 'Valoración quirúrgica o esterilización', tests: 'Análisis o diagnóstico por imagen', grooming: 'Peluquería', other: 'Otro motivo' },
      langs: { es: 'Español', en: 'English', pl: 'Polski' },
      msgHello: 'Hola, me gustaría pedir cita en la Clínica Veterinaria Estepona.', msgThanks: 'Gracias.', mailSubject: 'Solicitud de cita',
      teamCount: '{n} miembros del equipo hablan este idioma.', teamAll: 'Mostrando todo el equipo.',
      planErrEmpty: 'Indique una fecha de nacimiento.', planErrFuture: 'La fecha no puede ser futura.', planErrOld: 'Revise la fecha: parece demasiado antigua.',
      ageWeeks: { dog: 'Su cachorro tiene {n} semanas.', cat: 'Su gatito tiene {n} semanas.' },
      ageMonths: { dog: 'Su cachorro tiene {n} meses.', cat: 'Su gatito tiene {n} meses.' },
      ageAdult: { dog: 'Su perro ya tiene más de un año: toca la revisión anual y los refuerzos.', cat: 'Su gato ya tiene más de un año: toca la revisión anual y los refuerzos.' },
      ageNewborn: 'Aún es muy pequeño: la primera visita suele ser hacia las 6–8 semanas.',
      stDone: 'Hecho', stNext: 'Próximo', stLater: 'Más adelante', weeks: 'semanas', months: 'meses', from: 'Hacia el',
      dateLocale: 'es-ES'
    },
    en: {
      open: 'Open now · closes at 18:00', closedOpensToday: 'Closed · opens today at 11:00',
      closedOpensTomorrow: 'Closed · opens tomorrow at 11:00', closedOpensMon: 'Closed · opens Monday at 11:00',
      today: 'Today', step: 'Step {n} of 4', done: 'Ready',
      errPet: 'Choose the type of pet to continue.', errReason: 'Choose a reason to continue.',
      errDay: 'Choose a day to continue.', errSlot: 'Choose a time (or “Any time”).',
      errOwner: 'Enter your name so the clinic knows who to call.', errPhone: 'Please check the phone number: we need at least 9 digits.',
      errEmail: 'The email looks incomplete. You can leave it empty.',
      anyTime: 'Any time', menuClose: 'Close menu', menuOpen: 'Open menu',
      sumPet: 'Pet', sumReason: 'Reason', sumWhen: 'Preference', sumOwner: 'Name', sumPhone: 'Phone', sumEmail: 'Email', sumLang: 'Language', sumNotes: 'Notes',
      pets: { dog: 'Dog', cat: 'Cat', small: 'Rabbit or rodent', other: 'Other' },
      reasons: { consult: 'Consultation: not feeling well', vaccine: 'Vaccine or deworming', checkup: 'General check-up', surgery: 'Surgical assessment or neutering', tests: 'Tests or diagnostic imaging', grooming: 'Grooming', other: 'Something else' },
      langs: { es: 'Español', en: 'English', pl: 'Polski' },
      msgHello: 'Hello, I would like to book a visit at Clínica Veterinaria Estepona.', msgThanks: 'Thank you.', mailSubject: 'Appointment request',
      teamCount: '{n} team members speak this language.', teamAll: 'Showing the whole team.',
      planErrEmpty: 'Please enter a date of birth.', planErrFuture: 'The date can’t be in the future.', planErrOld: 'Please check the date: it looks too far back.',
      ageWeeks: { dog: 'Your puppy is {n} weeks old.', cat: 'Your kitten is {n} weeks old.' },
      ageMonths: { dog: 'Your puppy is {n} months old.', cat: 'Your kitten is {n} months old.' },
      ageAdult: { dog: 'Your dog is over a year old: time for the yearly check-up and boosters.', cat: 'Your cat is over a year old: time for the yearly check-up and boosters.' },
      ageNewborn: 'Still very young: the first visit is usually at around 6–8 weeks.',
      stDone: 'Done', stNext: 'Next', stLater: 'Later', weeks: 'weeks', months: 'months', from: 'Around',
      dateLocale: 'en-GB'
    }
  };

  /* services sheet content (from the clinic's own service pages) */
  var SERVICES = {
    consult: { ic: 's-consult', title: 'sConsult', reason: 'consult',
      es: ['Dos consultas completamente equipadas para diagnosticar y tratar a perros, gatos, pequeños mamíferos y roedores.', ['Gastroenterología, endocrinología y dermatología', 'Cardiología y neumología', 'Urología y nefrología', 'Oftalmología y neurología', 'Odontología y estomatología', 'Enfermedades infecciosas y parasitarias', 'Pediatría y geriatría', 'Ginecología, obstetricia y control de gestación', 'Reproducción asistida e inseminación artificial']],
      en: ['Two fully equipped consulting rooms to diagnose and treat dogs, cats, small mammals and rodents.', ['Gastroenterology, endocrinology and dermatology', 'Cardiology and pulmonology', 'Urology and nephrology', 'Ophthalmology and neurology', 'Dentistry and oral health', 'Infectious and parasitic diseases', 'Paediatrics and geriatrics', 'Gynaecology, obstetrics and pregnancy monitoring', 'Assisted reproduction and artificial insemination']] },
    vaccines: { ic: 's-vaccine', title: 'sVacc', reason: 'vaccine',
      es: ['Prevención para cada etapa de la vida, siempre después de que un veterinario examine a su mascota.', ['Vacunación de cachorros, gatitos y adultos [pautas y precios por confirmar]', 'Antiparasitarios internos (lombrices, tenias) y externos (pulgas, garrapatas, mosquitos)', 'Diagnóstico precoz en laboratorio propio de enfermedades transmitidas por garrapatas y mosquitos', 'Pruebe el planificador de vacunas orientativo de esta página']],
      en: ['Prevention for every stage of life, always after a vet has examined your pet.', ['Vaccination for puppies, kittens and adults [schedules and prices to be confirmed]', 'Internal (worms, tapeworms) and external (fleas, ticks, mosquitoes) parasite control', 'Early diagnosis in our own lab of diseases spread by ticks and mosquitoes', 'Try the guidance vaccine planner on this page']] },
    surgery: { ic: 's-surgery', title: 'sSurg', reason: 'surgery',
      es: ['Desde cirugías electivas, como castraciones y esterilizaciones, hasta procedimientos de mayor complejidad.', ['Respiratoria: síndrome braquicefálico, colapso traqueal, laringe', 'Abdominal: cuerpos extraños, torsión gástrica, bazo, hígado', 'Urinaria: cálculos renales y vesicales, uretrostomía', 'Reproductiva: castración y ovariohisterectomía por mínima incisión, cesáreas', 'Oftálmica: entropión, ectropión, tercer párpado', 'Torácica, oral y faríngea', 'Ortopédica, traumatológica y neurocirugía', 'Electrobisturí, monitorización multiparamétrica y banco de sangre disponible']],
      en: ['From elective procedures such as neutering and spaying to more complex surgery.', ['Respiratory: brachycephalic syndrome, tracheal collapse, larynx', 'Abdominal: foreign bodies, gastric torsion, spleen, liver', 'Urinary: kidney and bladder stones, urethrostomy', 'Reproductive: minimally invasive castration and spay, caesareans', 'Eye: entropion, ectropion, third eyelid', 'Thoracic, oral and pharyngeal', 'Orthopaedic, trauma and neurosurgery', 'Electrosurgery, multiparameter monitoring and a blood bank on hand']] },
    trauma: { ic: 's-bone', title: 'sTrauma', reason: 'consult',
      es: ['Consulta ortopédica especializada, diagnóstico y tratamiento médico y quirúrgico del aparato locomotor.', ['Fracturas y luxaciones, con fijación interna y externa', 'Roturas de ligamentos y hernias discales', 'Artrosis, artritis y tendinitis', 'Displasia de cadera y de codo en animales jóvenes', 'Cirugía correctiva y reparadora, neurocirugía', 'Infiltraciones, factores de crecimiento, PRP y células madre']],
      en: ['Specialist orthopaedic consultations, diagnosis and medical and surgical treatment of the musculoskeletal system.', ['Fractures and dislocations, with internal and external fixation', 'Ligament tears and slipped discs', 'Osteoarthritis, arthritis and tendinitis', 'Hip and elbow dysplasia in young animals', 'Corrective and reconstructive surgery, neurosurgery', 'Joint injections, growth factors, PRP and stem cells']] },
    imaging: { ic: 's-xray', title: 'sImg', reason: 'tests',
      es: ['Radiología digital y ecografía de alta definición, junto a un examen clínico minucioso.', ['Rayos X digitales, también con contraste (mielografías, urografías, estudios digestivos)', 'Ecografía abdominal, torácica, locomotora y reproductiva', 'Biopsias y citologías ecoguiadas', 'Endoscopia: rinoscopia, broncoscopia, gastroscopia, colonoscopia, cistoscopia, laparoscopia y artroscopia']],
      en: ['Digital radiology and high-definition ultrasound, alongside a thorough clinical exam.', ['Digital X-ray, including contrast studies (myelography, urography, digestive studies)', 'Abdominal, thoracic, musculoskeletal and reproductive ultrasound', 'Ultrasound-guided biopsies and cytology', 'Endoscopy: rhinoscopy, bronchoscopy, gastroscopy, colonoscopy, cystoscopy, laparoscopy and arthroscopy']] },
    lab: { ic: 's-lab', title: 'sLab', reason: 'tests',
      es: ['Laboratorio propio y automatizado, con resultados en cuestión de minutos: sin esperar días ni enviar muestras a otra ciudad.', ['Análisis de sangre, heces y orina', 'Líquido cefalorraquídeo y sinovial', 'Citologías', 'Diagnóstico precoz de enfermedades infecciosas y transmitidas por parásitos', 'También damos apoyo a otras clínicas de la zona']],
      en: ['Our own automated lab, with results in minutes: no waiting days or sending samples to another city.', ['Blood, stool and urine tests', 'Cerebrospinal and synovial fluid', 'Cytology', 'Early diagnosis of infectious and parasite-borne diseases', 'We also support other clinics in the area']] },
    anaesthesia: { ic: 's-pain', title: 'sAnes', reason: 'surgery',
      es: ['Cada paciente recibe un plan de anestesia y analgesia según su estado, edad y procedimiento, tras una valoración prequirúrgica.', ['Neuroleptoanalgesia', 'Anestesia total intravenosa (TIVA)', 'Anestesia general inhalada', 'Anestesia local y locorregional, como la epidural', 'Anestesia multimodal']],
      en: ['Each patient gets an anaesthesia and pain-relief plan based on their condition, age and procedure, after a pre-surgical assessment.', ['Neuroleptanalgesia', 'Total intravenous anaesthesia (TIVA)', 'Inhalation general anaesthesia', 'Local and regional anaesthesia, such as epidurals', 'Multimodal anaesthesia']] },
    hospital: { ic: 's-sleep', title: 'sHosp', reason: 'consult',
      es: ['Una sala de más de 30 m², climatizada y videovigilada, para pacientes desde razas miniatura hasta gigantes.', ['Capacidad para 20 pacientes a la vez', 'Espacio reservado solo para gatos', 'Oxigenoterapia, emisores de calor y bombas de infusión', 'Medidas de bioseguridad para pacientes infecciosos', 'Mesa de exploración en la propia sala para evitar traslados']],
      en: ['A climate-controlled, video-monitored ward of over 30 m², for patients from toy breeds to giant breeds.', ['Room for 20 patients at a time', 'A space reserved for cats only', 'Oxygen therapy, heat sources and infusion pumps', 'Biosecurity measures for infectious patients', 'An exam table in the ward itself to avoid moving patients']] },
    grooming: { ic: 's-groom', title: 'sGroom', reason: 'grooming',
      es: ['Baño y peluquería con los productos de higiene más adecuados para cada tipo de pelo, piel y necesidad.', ['Cita en persona, por teléfono (951 518 244 / 630 875 543) o con el formulario de esta página', 'Precios: [precio]']],
      en: ['Bathing and grooming with the hygiene products best suited to each coat, skin and need.', ['Book in person, by phone (951 518 244 / 630 875 543) or with the form on this page', 'Prices: [price]']] },
    shop: { ic: 's-shop', title: 'sShop', reason: 'other',
      es: ['Una tienda especializada dentro de la propia clínica.', ['Nutrición clínica para piel, digestivo, articulaciones, sistema urinario, problemas endocrinos y sobrepeso', 'Antiparasitarios internos y externos', 'Champús terapéuticos e higiene bucodental, según prescripción', 'Juguetes, correas, collares, camas, transportines, rascadores y ropa', 'Si algo no está en stock, se lo conseguimos']],
      en: ['A specialist shop inside the clinic.', ['Clinical nutrition for skin, digestion, joints, urinary health, endocrine problems and weight', 'Internal and external parasite control', 'Therapeutic shampoos and dental care, as prescribed', 'Toys, leads, collars, beds, carriers, scratching posts and clothing', 'If something isn’t in stock, we’ll get it for you']] }
  };

  /* planner milestones (weeks from birth): general guidance only */
  var PLAN = {
    dog: [
      { w: 6, w2: 8, es: ['Primera visita y primera vacuna', 'Revisión completa, primera dosis de la vacuna polivalente (moquillo, parvovirus, hepatitis…) y desparasitación.'], en: ['First visit and first vaccine', 'Full check-up, first dose of the core combination vaccine (distemper, parvovirus, hepatitis…) and deworming.'] },
      { w: 10, w2: 12, es: ['Segunda dosis', 'Refuerzo de la vacuna polivalente y desparasitación, según indique su veterinario.'], en: ['Second dose', 'Booster of the combination vaccine and deworming, as your vet advises.'] },
      { w: 12, w2: 16, es: ['Microchip y rabia', 'En Andalucía la identificación con microchip y la vacuna antirrábica son obligatorias; su veterinario le dirá cuándo ponerlas.'], en: ['Microchip and rabies', 'In Andalusia, microchip identification and rabies vaccination are compulsory; your vet will tell you when to do them.'] },
      { w: 14, w2: 16, es: ['Última dosis de cachorro', 'Cierra la primovacunación. A partir de aquí, paseos y socialización con más tranquilidad.'], en: ['Final puppy dose', 'Completes the primary course. From here, walks and socialising with more peace of mind.'] },
      { w: 26, w2: 28, es: ['Revisión de los 6 meses', 'Prevención de la leishmaniosis (muy presente en la costa) y consulta sobre esterilización.'], en: ['Six-month check-up', 'Leishmaniasis prevention (common on the coast) and a chat about neutering.'] },
      { w: 52, w2: 56, es: ['Primer refuerzo anual', 'Revisión general y refuerzos. Después, una visita al año como mínimo.'], en: ['First yearly booster', 'General check-up and boosters. After that, at least one visit a year.'] }
    ],
    cat: [
      { w: 8, w2: 9, es: ['Primera visita y primera vacuna', 'Revisión completa, primera dosis de la vacuna trivalente (panleucopenia, rinotraqueítis, calicivirus) y desparasitación.'], en: ['First visit and first vaccine', 'Full check-up, first dose of the core vaccine (panleukopenia, rhinotracheitis, calicivirus) and deworming.'] },
      { w: 12, w2: 13, es: ['Segunda dosis', 'Refuerzo de la trivalente. Su veterinario valorará la vacuna de la leucemia felina según su estilo de vida.'], en: ['Second dose', 'Booster of the core vaccine. Your vet will consider the feline leukaemia vaccine depending on lifestyle.'] },
      { w: 12, w2: 16, es: ['Microchip y rabia', 'En Andalucía la normativa también incluye a los gatos; su veterinario le indicará la edad y la pauta.'], en: ['Microchip and rabies', 'In Andalusia the rules also cover cats; your vet will tell you the age and schedule.'] },
      { w: 16, w2: 17, es: ['Última dosis de gatito', 'Cierra la primovacunación de gatito.'], en: ['Final kitten dose', 'Completes the kitten primary course.'] },
      { w: 26, w2: 28, es: ['Revisión de los 6 meses', 'Peso, dientes y consulta sobre esterilización.'], en: ['Six-month check-up', 'Weight, teeth and a chat about neutering.'] },
      { w: 52, w2: 56, es: ['Primer refuerzo anual', 'Revisión general y refuerzos. Después, una visita al año como mínimo.'], en: ['First yearly booster', 'General check-up and boosters. After that, at least one visit a year.'] }
    ]
  };

  var ES = {};
  $$('[data-i18n]').forEach(function (el) { ES[el.dataset.i18n] = el.textContent; });
  $$('[data-i18n-alt]').forEach(function (el) { ES[el.dataset.i18nAlt] = el.getAttribute('alt'); });
  $$('[data-i18n-aria]').forEach(function (el) { ES[el.dataset.i18nAria] = el.getAttribute('aria-label'); });

  var lang = 'es';
  try { if (localStorage.getItem('cve-lang') === 'en') lang = 'en'; } catch (e) {}
  function t(k) { return T[lang][k]; }
  function fmt(s, n) { return s.replace('{n}', n); }

  function applyLang(next) {
    lang = next;
    var dict = lang === 'en' ? EN : ES;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $$('[data-i18n-alt]').forEach(function (el) { var v = dict[el.dataset.i18nAlt]; if (v != null) el.setAttribute('alt', v); });
    $$('[data-i18n-aria]').forEach(function (el) { var v = dict[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    try { localStorage.setItem('cve-lang', lang); } catch (e) {}
    $$('[data-sos-wa]').forEach(function (a) { a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lang === 'en' ? 'Hello, I have an emergency with my pet.' : 'Hola, tengo una urgencia con mi mascota.'); });
    updateOpen();
    if (sheetKey) fillSheet(sheetKey);
    renderDays(); renderSlots();
    syncPlang();
    updateStepUI();
    if (!$('#plan-result').hidden) runPlanner(true);
    if (curStep === 5) buildSummary();
    updateTeamCount();
    var mb = $('.menu-btn'); if (mb) mb.setAttribute('aria-label', mb.getAttribute('aria-expanded') === 'true' ? t('menuClose') : t('menuOpen'));
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }); });

  /* ------------------------------------------------------------------ header + menu */
  var header = $('.site-header');
  var menuBtn = $('.menu-btn');
  var nav = $('#main-nav');
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', t('menuOpen')); }
  menuBtn.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? t('menuClose') : t('menuOpen'));
    if (open) { var f = $('a', nav); if (f) f.focus(); }
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuBtn.focus(); } });

  /* active nav link */
  if ('IntersectionObserver' in window) {
    var links = {};
    $$('a', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var a = links[e.target.id]; if (a && e.isIntersecting) { $$('a', nav).forEach(function (x) { x.classList.remove('active'); x.removeAttribute('aria-current'); }); a.classList.add('active'); a.setAttribute('aria-current', 'true'); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  /* ------------------------------------------------------------------ open status (Europe/Madrid, Google hours Mon–Fri 11–18) */
  function madridNow() {
    try {
      var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { d: days[o.weekday], m: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { var n = new Date(); return { d: n.getDay(), m: n.getHours() * 60 + n.getMinutes() }; }
  }
  function updateOpen() {
    var n = madridNow();
    var weekday = n.d >= 1 && n.d <= 5;
    var open = weekday && n.m >= 660 && n.m < 1080;
    var txt;
    if (open) txt = t('open');
    else if (weekday && n.m < 660) txt = t('closedOpensToday');
    else if (n.d >= 1 && n.d <= 4) txt = t('closedOpensTomorrow');
    else if (n.d === 0) txt = t('closedOpensTomorrow');
    else txt = t('closedOpensMon');
    nowMin = n.m; if (clockOn) setClock();
    var s1 = $('[data-open-status]'); if (s1) s1.textContent = txt;
    var s2 = $('[data-open-status2]'); if (s2) s2.textContent = txt;
    var dot = $('[data-open-dot]'); if (dot) dot.classList.toggle('is-open', open);
    var pill = $('[data-open-pill]'); if (pill) pill.classList.toggle('is-open', open);
    $$('.hours-table tr').forEach(function (tr) {
      var isT = parseInt(tr.dataset.day, 10) === n.d;
      tr.classList.toggle('today', isT);
      var th = $('th', tr); if (isT) th.setAttribute('data-today', t('today')); else th.removeAttribute('data-today');
    });
  }
  setInterval(updateOpen, 60000);

  /* ------------------------------------------------------------------ reveal + counters */
  function countUp(el) {
    var end = parseInt(el.dataset.count, 10), pre = el.dataset.prefix || '';
    if (reduced) { el.textContent = pre + end; return; }
    var t0 = null, dur = 1300;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur); var v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = pre + v; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  $$('[data-count]').forEach(function (el) { el.textContent = (el.dataset.prefix || '') + el.dataset.count; });
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        var c = $('[data-count]', e.target); if (c) countUp(c);
        if (e.target.classList.contains('hours-card')) { clockOn = true; setClock(); }
        var sc = $('[data-score]', e.target); if (sc) scoreUp(sc);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach(function (el, i) { el.style.transitionDelay = ((i % 4) * 70) + 'ms'; io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------ paw trails */
  var NS = 'http://www.w3.org/2000/svg';
  var trails = [];
  /* sample an SVG path made of M / C / S commands with plain maths (no layout reads) */
  function samplePath(d) {
    var tok = d.match(/[MCS]|-?\d*\.?\d+/g), i = 0, cmd, pts = [], cx = 0, cy = 0, lx = 0, ly = 0;
    function n() { return parseFloat(tok[i++]); }
    function cubic(x1, y1, x2, y2, x, y) {
      for (var k = 1; k <= 40; k++) {
        var t = k / 40, u = 1 - t;
        pts.push([u * u * u * cx + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x, u * u * u * cy + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y]);
      }
      lx = x2; ly = y2; cx = x; cy = y;
    }
    while (i < tok.length) {
      if (/[MCS]/.test(tok[i])) cmd = tok[i++];
      if (cmd === 'M') { cx = n(); cy = n(); lx = cx; ly = cy; pts.push([cx, cy]); cmd = 'C'; }
      else if (cmd === 'C') cubic(n(), n(), n(), n(), n(), n());
      else if (cmd === 'S') { var rx = 2 * cx - lx, ry = 2 * cy - ly; cubic(rx, ry, n(), n(), n(), n()); }
      else i++;
    }
    return pts;
  }
  function buildTrail(svg) {
    var pts = samplePath($('.trail-guide', svg).getAttribute('d'));
    var step = parseFloat(svg.dataset.step) || 44;
    var prints = [], side = 1, acc = step / 2, frag = document.createDocumentFragment();
    for (var j = 1; j < pts.length; j++) {
      var dx = pts[j][0] - pts[j - 1][0], dy = pts[j][1] - pts[j - 1][1], seg = Math.sqrt(dx * dx + dy * dy);
      while (acc <= seg) {
        var f = acc / seg, x0 = pts[j - 1][0] + dx * f, y0 = pts[j - 1][1] + dy * f, ang = Math.atan2(dy, dx);
        var off = 10 * side; side = -side;
        var x = x0 + Math.cos(ang + Math.PI / 2) * off, y = y0 + Math.sin(ang + Math.PI / 2) * off;
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (ang * 180 / Math.PI + 90).toFixed(1) + ')');
        var u = document.createElementNS(NS, 'use');
        u.setAttribute('href', '#paw'); u.setAttribute('x', '-11'); u.setAttribute('y', '-11'); u.setAttribute('width', '22'); u.setAttribute('height', '22');
        u.setAttribute('class', 'print');
        g.appendChild(u); frag.appendChild(g); prints.push(u);
        acc += step;
      }
      acc -= seg;
    }
    svg.appendChild(frag);
    svg.classList.add('ready');
    return { svg: svg, prints: prints, shown: 0 };
  }
  function setTrail(tr, n) {
    if (n === tr.shown) return;
    tr.prints.forEach(function (p, i) { p.classList.toggle('on', i < n); });
    tr.shown = n;
  }
  /* trails are only measured while near the viewport */
  var trailIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    var y = window.scrollY;
    es.forEach(function (e) { trails.forEach(function (tr) { if (tr.svg === e.target) { tr.near = e.isIntersecting; tr.top = e.boundingClientRect.top + y; tr.h = e.boundingClientRect.height; } }); });
    scrollDirty = true; schedule();
  }, { rootMargin: '40% 0px' }) : null;
  function updateTrails() { scrollDirty = true; schedule(); }
  function initTrails() {
    $$('[data-trail]').forEach(function (svg) { var tr = buildTrail(svg); tr.near = !trailIO; trails.push(tr); if (trailIO) trailIO.observe(svg); });
    if (reduced) { trails.forEach(function (tr) { setTrail(tr, tr.prints.length); }); return; }
    var heroTr = trails.filter(function (tr) { return tr.svg.classList.contains('trail-hero'); })[0];
    if (heroTr) {
      heroTr.auto = true;
      var k = 0;
      var tick = function () { k++; setTrail(heroTr, k); if (k < heroTr.prints.length) setTimeout(tick, 110); };
      setTimeout(tick, 250);
    }
    updateTrails();
  }
  if (document.readyState === 'complete') setTimeout(initTrails, 300);
  else window.addEventListener('load', function () { setTimeout(initTrails, 300); });

  window.addEventListener('scroll', function () { scrollDirty = true; schedule(); }, { passive: true });

  /* ------------------------------------------------------------------ services sheet */
  var sheet = $('#service-sheet');
  var sheetKey = null, sheetOpener = null;
  function fillSheet(key) {
    var s = SERVICES[key]; var d = s[lang];
    $('#sheet-title').textContent = (lang === 'en' ? EN : ES)[s.title];
    $('.sheet-ic use', sheet).setAttribute('href', '#' + s.ic);
    $('.sheet-lead', sheet).textContent = d[0];
    var ul = $('.sheet-list', sheet); ul.innerHTML = '';
    d[1].forEach(function (li, i) { var el = document.createElement('li'); el.textContent = li; el.style.setProperty('--i', i); ul.appendChild(el); });
  }
  function openDialog(dlg) {
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function closeDialog(dlg) { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); }
  $$('[data-service]').forEach(function (b) {
    b.addEventListener('click', function () { sheetKey = b.dataset.service; sheetOpener = b; fillSheet(sheetKey); openDialog(sheet); });
  });
  $('[data-close-sheet]').addEventListener('click', function () { closeDialog(sheet); });
  sheet.addEventListener('close', function () { sheetKey = null; if (sheetOpener) sheetOpener.focus(); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeDialog(sheet); });
  $('[data-sheet-book]').addEventListener('click', function () {
    var r = SERVICES[sheetKey] && SERVICES[sheetKey].reason;
    sheetOpener = null; closeDialog(sheet);
    if (r) presetReason(r);
  });

  /* SOS dialog */
  var sos = $('#sos-dialog'), sosOpener = null;
  $$('[data-open-sos]').forEach(function (b) { b.addEventListener('click', function () { sosOpener = b; openDialog(sos); }); });
  $('[data-close-sos]').addEventListener('click', function () { closeDialog(sos); });
  sos.addEventListener('click', function (e) { if (e.target === sos) closeDialog(sos); });
  sos.addEventListener('close', function () { if (sosOpener) sosOpener.focus(); });

  /* ------------------------------------------------------------------ team language filter */
  var teamFilter = 'all';
  function updateTeamCount() {
    var el = $('#team-count'); if (!el) return;
    if (teamFilter === 'all') { el.textContent = t('teamAll'); return; }
    el.textContent = fmt(t('teamCount'), $$('.member.match').length);
  }
  $$('.lang-filter .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      teamFilter = c.dataset.filter;
      $$('.lang-filter .chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      $$('.member').forEach(function (m) {
        var langs = m.dataset.langs.split(' ');
        var hit = teamFilter === 'all' || langs.indexOf(teamFilter) > -1;
        m.classList.toggle('dim', !hit);
        m.classList.toggle('match', teamFilter !== 'all' && hit);
        $$('.member-langs li', m).forEach(function (li) {
          var l = li.getAttribute('lang');
          var on = teamFilter !== 'all' && (l === teamFilter || (teamFilter === 'ru' && l === 'uk'));
          li.classList.toggle('hit', on);
        });
      });
      updateTeamCount();
      setHellos();
    });
  });

  /* ------------------------------------------------------------------ vaccination planner */
  var DAY = 864e5;
  function todayMid() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function toISO(d) { var m = d.getMonth() + 1, dd = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd; }
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var fmtCache = {};
  function fmtDate(d, opts) {
    opts = opts || { day: 'numeric', month: 'long', year: 'numeric' };
    var key = t('dateLocale') + JSON.stringify(opts);
    if (!fmtCache[key]) fmtCache[key] = new Intl.DateTimeFormat(t('dateLocale'), opts);
    return fmtCache[key].format(d);
  }
  var birthIn = $('#birth');
  birthIn.max = toISO(todayMid());
  var planNext = null;

  function runPlanner(silent) {
    var err = $('#plan-error');
    err.hidden = true; birthIn.removeAttribute('aria-invalid');
    var sp = ($('input[name="species"]:checked') || {}).value || 'dog';
    if (!birthIn.value) { err.textContent = t('planErrEmpty'); err.hidden = false; birthIn.setAttribute('aria-invalid', 'true'); if (!silent) birthIn.focus(); return; }
    var b = parseISO(birthIn.value), now = todayMid();
    if (b > now) { err.textContent = t('planErrFuture'); err.hidden = false; birthIn.setAttribute('aria-invalid', 'true'); return; }
    if ((now - b) / DAY > 365 * 25) { err.textContent = t('planErrOld'); err.hidden = false; birthIn.setAttribute('aria-invalid', 'true'); return; }
    var ageDays = Math.floor((now - b) / DAY), ageW = Math.floor(ageDays / 7);
    var ageTxt;
    if (ageDays > 365) ageTxt = T[lang].ageAdult[sp];
    else if (ageW < 4) ageTxt = t('ageNewborn');
    else if (ageW < 17) ageTxt = fmt(T[lang].ageWeeks[sp], ageW);
    else ageTxt = fmt(T[lang].ageMonths[sp], Math.floor(ageDays / 30.44));
    $('#plan-age').textContent = ageTxt;
    var ol = $('#timeline'); ol.innerHTML = '';
    var fill = document.createElement('span'); fill.className = 'fill'; ol.appendChild(fill);
    planNext = null;
    var lastDone = -1;
    PLAN[sp].forEach(function (m, i) {
      var start = new Date(b.getTime() + m.w * 7 * DAY), end = new Date(b.getTime() + m.w2 * 7 * DAY);
      var state = end < now ? 'done' : 'later';
      if (state === 'done') lastDone = i;
      if (state !== 'done' && !planNext) { state = 'next'; planNext = { date: start < now ? now : start, sp: sp }; }
      var li = document.createElement('li');
      li.className = 'tl-item ' + state; li.style.setProperty('--i', i);
      var range = m.w2 > m.w + 1 ? m.w + '–' + m.w2 + ' ' + t('weeks') : m.w + ' ' + t('weeks');
      if (m.w >= 52) range = '12 ' + t('months');
      else if (m.w >= 26) range = '6 ' + t('months');
      li.innerHTML = '<span class="tl-dot" aria-hidden="true"><svg viewBox="0 0 40 40"><use href="#paw"/></svg></span>' +
        '<p class="tl-when"><span class="tl-range"></span><span class="tl-date"></span><span class="tl-badge"></span></p>' +
        '<h3 class="tl-title"></h3><p class="tl-desc"></p>';
      $('.tl-range', li).textContent = range;
      $('.tl-date', li).textContent = t('from') + ' ' + fmtDate(start, { day: 'numeric', month: 'short', year: 'numeric' });
      $('.tl-badge', li).textContent = state === 'done' ? t('stDone') : state === 'next' ? t('stNext') : t('stLater');
      $('.tl-title', li).textContent = m[lang][0];
      $('.tl-desc', li).textContent = m[lang][1];
      ol.appendChild(li);
    });
    $('#plan-result').hidden = false;
    var items = $$('.tl-item', ol);
    var gp = $('#grow-pet'), gf = $('#grow-fill'), pos = Math.min(1, ageDays / 365);
    $('use', gp).setAttribute('href', sp === 'cat' ? '#sit-cat' : '#sit-dog');
    gp.classList.remove('hop'); gf.style.transform = 'scaleX(0)'; gp.style.transform = 'translateX(26px) scale(.5)';
    requestAnimationFrame(function () {
      var target = lastDone >= 0 ? items[Math.min(items.length - 1, lastDone + (planNext ? 1 : 0))] : null;
      var full = ol.offsetHeight - 12;
      fill.style.transform = 'scaleY(' + (target && full > 0 ? Math.min(1, (target.offsetTop + 4) / full) : 0) + ')';
      var w = gp.parentNode.offsetWidth;
      gf.style.transform = 'scaleX(' + pos + ')';
      gp.style.transform = 'translateX(' + Math.round(26 + pos * (w - 52)) + 'px) scale(' + (0.5 + 0.5 * pos).toFixed(3) + ')';
      if (!reduced) gp.classList.add('hop');
    });
    if (!silent && !reduced) $('#plan-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  $('#planner-form').addEventListener('submit', function (e) { e.preventDefault(); runPlanner(false); });
  $$('input[name="species"]').forEach(function (r) { r.addEventListener('change', function () { if (birthIn.value && !$('#plan-result').hidden) runPlanner(true); }); });
  $('#plan-example').addEventListener('click', function () {
    birthIn.value = toISO(new Date(todayMid().getTime() - 56 * DAY));
    runPlanner(false);
  });
  $('#plan-book').addEventListener('click', function () {
    var sp = ($('input[name="species"]:checked') || {}).value || 'dog';
    var pr = $('input[name="pet"][value="' + sp + '"]'); if (pr) pr.checked = true;
    var rr = $('input[name="reason"][value="vaccine"]'); if (rr) rr.checked = true;
    if (planNext) { var iso = toISO(nextOpenDay(planNext.date)); if (dayList.indexOf(iso) > -1) selDay = iso; }
    renderDays();
    goStep(3, true);
  });

  /* ------------------------------------------------------------------ booking flow */
  var form = $('#book-form');
  var curStep = 1, lastStep = 0;
  var selDay = null, selSlot = null;
  var dayList = [];
  function nextOpenDay(d) { var x = new Date(d.getTime()); while (x.getDay() === 0 || x.getDay() === 6) x = new Date(x.getTime() + DAY); return x; }
  function buildDayList() {
    dayList = [];
    var d = new Date(todayMid().getTime() + DAY);
    while (dayList.length < 15) { if (d.getDay() !== 0 && d.getDay() !== 6) dayList.push(toISO(d)); d = new Date(d.getTime() + DAY); }
  }
  buildDayList();
  function radioKeys(container, sel, onPick) {
    container.addEventListener('keydown', function (e) {
      var items = $$(sel, container); var i = items.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length;
      if (n !== null) { e.preventDefault(); items[n].focus(); onPick(items[n]); }
    });
  }
  function renderDays() {
    var box = $('#days'); if (!box) return;
    box.innerHTML = '';
    dayList.forEach(function (iso, i) {
      var d = parseISO(iso);
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'radio'); b.dataset.day = iso;
      var on = iso === selDay;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on || (!selDay && i === 0) ? 0 : -1;
      b.setAttribute('aria-label', fmtDate(d, { weekday: 'long', day: 'numeric', month: 'long' }));
      b.innerHTML = '<small></small><b></b><small></small>';
      var sm = $$('small', b);
      sm[0].textContent = fmtDate(d, { weekday: 'short' }).replace('.', '');
      $('b', b).textContent = d.getDate();
      sm[1].textContent = fmtDate(d, { month: 'short' }).replace('.', '');
      b.addEventListener('click', function () { pickDay(b); });
      box.appendChild(b);
    });
    var cur = $('.day[aria-checked="true"]', box);
    if (cur && cur.scrollIntoView && curStep === 3) { box.scrollLeft = cur.offsetLeft - 20; }
  }
  function pickDay(b) {
    selDay = b.dataset.day;
    $$('.day').forEach(function (x) { var on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    clearErr(3);
  }
  function renderSlots() {
    var box = $('#slots'); if (!box) return;
    box.innerHTML = '';
    var slots = [];
    for (var m = 660; m < 1080; m += 30) slots.push((m / 60 | 0) + ':' + (m % 60 ? '30' : '00'));
    slots.push('any');
    slots.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'slot' + (s === 'any' ? ' any' : ''); b.setAttribute('role', 'radio'); b.dataset.slot = s;
      var on = s === selSlot;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on || (!selSlot && i === 0) ? 0 : -1;
      b.textContent = s === 'any' ? t('anyTime') : s;
      b.addEventListener('click', function () { pickSlot(b); });
      box.appendChild(b);
    });
  }
  function pickSlot(b) {
    selSlot = b.dataset.slot;
    $$('.slot').forEach(function (x) { var on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    clearErr(3);
  }
  radioKeys($('#days'), '.day', pickDay);
  radioKeys($('#slots'), '.slot', pickSlot);
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 200); };
  idle(function () { renderDays(); renderSlots(); });

  function showErr(n, msg, field) {
    var el = $('[data-err="' + n + '"]'); el.textContent = msg; el.hidden = false;
    if (field) { field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-errormessage', 'err-' + n); }
  }
  function clearErr(n) { var el = $('[data-err="' + n + '"]'); if (el) { el.hidden = true; el.textContent = ''; } }
  $$('[data-err]').forEach(function (el) { el.id = 'err-' + el.dataset.err; });

  function validPhone(v) { return (v.replace(/\D/g, '').length >= 9); }
  function validEmail(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function validate(n) {
    clearErr(n);
    if (n === 1 && !$('input[name="pet"]:checked')) { showErr(1, t('errPet')); return false; }
    if (n === 2 && !$('input[name="reason"]:checked')) { showErr(2, t('errReason')); return false; }
    if (n === 3) {
      if (!selDay) { showErr(3, t('errDay')); return false; }
      if (!selSlot) { showErr(3, t('errSlot')); return false; }
    }
    if (n === 4) {
      var o = $('#owner'), p = $('#phone'), m = $('#email');
      [o, p, m].forEach(function (f) { f.removeAttribute('aria-invalid'); });
      if (!o.value.trim()) { showErr(4, t('errOwner'), o); o.focus(); return false; }
      if (!validPhone(p.value)) { showErr(4, t('errPhone'), p); p.focus(); return false; }
      if (!validEmail(m.value.trim())) { showErr(4, t('errEmail'), m); m.focus(); return false; }
    }
    return true;
  }
  /* blur-first validation for the contact fields; clear instantly when fixed */
  ['#owner', '#phone', '#email'].forEach(function (id) {
    var f = $(id);
    f.addEventListener('input', function () {
      if (f.getAttribute('aria-invalid') === 'true') {
        var ok = id === '#owner' ? !!f.value.trim() : id === '#phone' ? validPhone(f.value) : validEmail(f.value.trim());
        if (ok) { f.removeAttribute('aria-invalid'); clearErr(4); }
      }
    });
    f.addEventListener('blur', function () {
      if (!f.value) return;
      if (id === '#phone' && !validPhone(f.value)) showErr(4, t('errPhone'), f);
      if (id === '#email' && !validEmail(f.value.trim())) showErr(4, t('errEmail'), f);
    });
  });
  $$('input[name="pet"]').forEach(function (r) { r.addEventListener('change', function () { clearErr(1); }); });
  $$('input[name="reason"]').forEach(function (r) { r.addEventListener('change', function () { clearErr(2); }); });

  var plangTouched = false;
  $$('input[name="plang"]').forEach(function (r) { r.addEventListener('change', function () { plangTouched = true; }); });
  function syncPlang() { if (plangTouched) return; var r = $('input[name="plang"][value="' + lang + '"]'); if (r) r.checked = true; }
  syncPlang();
  function updateStepUI() {
    var pct = Math.min(1, (curStep - 1) / 4);
    $('#steps-fill').style.transform = 'scaleX(' + pct + ')';
    $('#steps-run').style.transform = 'translateX(' + (pct * 100) + '%)';
    if (curStep !== lastStep) {
      var sp = $('#steps-paw');
      if (lastStep && !reduced && sp.animate) sp.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 480, easing: 'ease-out' });
      lastStep = curStep;
    }
    $('#step-count').textContent = curStep <= 4 ? fmt(t('step'), curStep) : t('done');
    $('#step-back').hidden = curStep === 1;
    $('#step-nav').hidden = curStep === 5;
  }
  function goStep(n, scroll) {
    curStep = n;
    $$('.step', form).forEach(function (s) { s.hidden = parseInt(s.dataset.step, 10) !== n; });
    updateStepUI();
    if (n === 3) renderDays();
    if (n === 5) { buildSummary(); burst(); }
    var target = $('.step[data-step="' + n + '"]', form);
    var first = n === 5 ? target : $('input:not([type=hidden]), button.day, textarea', target);
    if (scroll) $('#cita').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () {
      if (n === 3) { var d = $('.day[tabindex="0"]'); if (d) d.focus({ preventScroll: true }); return; }
      if (first) first.focus({ preventScroll: !!scroll || n === 1 });
    }, scroll ? 450 : 30);
  }
  $('#step-next').addEventListener('click', function () { if (validate(curStep)) goStep(curStep + 1); });
  $('#step-back').addEventListener('click', function () { if (curStep > 1) goStep(curStep - 1); });
  form.addEventListener('submit', function (e) { e.preventDefault(); if (curStep < 5 && validate(curStep)) goStep(curStep + 1); });
  $('#book-restart').addEventListener('click', function () { form.reset(); plangTouched = false; syncPlang(); selDay = null; selSlot = null; renderDays(); renderSlots(); goStep(1); });

  function presetReason(r) {
    var rr = $('input[name="reason"][value="' + r + '"]'); if (rr) rr.checked = true;
    goStep($('input[name="pet"]:checked') ? 3 : 1, true);
  }

  function data() {
    var pet = ($('input[name="pet"]:checked') || {}).value, reason = ($('input[name="reason"]:checked') || {}).value;
    var when = selDay ? fmtDate(parseISO(selDay), { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + (selSlot === 'any' ? t('anyTime').toLowerCase() : selSlot) : '';
    return {
      pet: T[lang].pets[pet] + ($('#pet-name').value.trim() ? ' (' + $('#pet-name').value.trim() + ')' : ''),
      reason: T[lang].reasons[reason], notes: $('#notes').value.trim(), when: when,
      owner: $('#owner').value.trim(), phone: $('#phone').value.trim(), email: $('#email').value.trim(),
      plang: T[lang].langs[($('input[name="plang"]:checked') || {}).value || 'es']
    };
  }
  function buildSummary() {
    var d = data(), dl = $('#summary'); dl.innerHTML = '';
    var rows = [['sumPet', d.pet], ['sumReason', d.reason], ['sumWhen', d.when], ['sumOwner', d.owner], ['sumPhone', d.phone]];
    if (d.email) rows.push(['sumEmail', d.email]);
    rows.push(['sumLang', d.plang]);
    if (d.notes) rows.push(['sumNotes', d.notes]);
    rows.forEach(function (r) {
      var div = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = t(r[0]); dd.textContent = r[1]; div.appendChild(dt); div.appendChild(dd); dl.appendChild(div);
    });
    var lines = [t('msgHello'), ''];
    rows.forEach(function (r) { lines.push('• ' + t(r[0]) + ': ' + r[1]); });
    lines.push('', t('msgThanks'));
    var text = lines.join('\n');
    $('#send-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    $('#send-mail').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(t('mailSubject') + ': ' + d.pet) + '&body=' + encodeURIComponent(text);
  }
  updateStepUI();

  /* ------------------------------------------------------------------ map (click to load) */
  $('#map-load').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Calle Monterroso 51, 29680 Estepona') + '&z=16&output=embed';
    f.title = lang === 'en' ? 'Map: C/ Monterroso 51, Estepona' : 'Mapa: C/ Monterroso 51, Estepona';
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    var fr = $('#map-frame'); fr.innerHTML = ''; fr.appendChild(f);
  });

  /* ------------------------------------------------------------------ hide mobile bar while typing */
  var mbar = $('.mbar');
  var TXT = 'input[type=text], input[type=tel], input[type=email], input[type=date], textarea';
  document.addEventListener('focusin', function (e) { if (e.target.matches(TXT)) mbar.classList.add('hide'); });
  document.addEventListener('focusout', function (e) { if (e.target.matches(TXT)) mbar.classList.remove('hide'); });

  /* ================================================================== premium motion layer
     One rAF scheduler for everything scroll/pointer driven: all reads first, then all writes.
     Nothing loops while idle; IntersectionObserver switches work on and off. */
  var IOK = 'IntersectionObserver' in window;
  var rafId = 0, scrollDirty = true;
  function schedule() { if (!rafId) rafId = requestAnimationFrame(frame); }

  /* pause looping CSS animations of sections that are off-screen */
  if (IOK) {
    var offIO = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('off', !e.isIntersecting); }); }, { rootMargin: '80px 0px' });
    $$('main > section, .site-footer').forEach(function (s) { offIO.observe(s); });
  }

  /* scroll progress fallback where CSS scroll timelines are missing */
  var sdOK = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
  var spBar = $('.sp-bar'), spRun = $('.sp-run');

  /* hero: pointer parallax, scroll parallax, eyes that follow you */
  var heroEl = $('.hero'), heroVis = true, pup = $('.hero-pup');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var layers = [[$('.hero-photo'), -7, 0.05], [$('.rating-card'), 12, -0.04], [$('.lang-card'), 16, -0.07], [$('.hero-squiggle'), -12, 0.09], [pup, 16, -0.1]];
  var eyes = $$('.hp-blink > circle', pup), pupils = $$('.hp-pupil', pup);
  var ptr = { x: 0, y: 0, tx: 0, ty: 0, cx: -1, cy: -1, active: false };
  var trackT = 0;
  if (IOK) new IntersectionObserver(function (es) { heroVis = es[0].isIntersecting; if (heroVis) { scrollDirty = true; schedule(); } }).observe(heroEl);
  function track(cx, cy, hold) {
    ptr.cx = cx; ptr.cy = cy; ptr.active = true;
    ptr.tx = Math.max(-1, Math.min(1, (cx / window.innerWidth - 0.5) * 2));
    ptr.ty = Math.max(-1, Math.min(1, (cy / window.innerHeight - 0.5) * 2));
    pup.classList.add('tracking');
    clearTimeout(trackT);
    if (hold) trackT = setTimeout(function () { ptr.active = false; ptr.tx = 0; ptr.ty = 0; pup.classList.remove('tracking'); pupils.forEach(function (p) { p.style.transform = ''; }); schedule(); }, hold);
    schedule();
  }
  if (!reduced) {
    if (fine) window.addEventListener('pointermove', function (e) { if (heroVis && e.pointerType === 'mouse') track(e.clientX, e.clientY, 4000); }, { passive: true });
    heroEl.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') track(e.clientX, e.clientY, 2200); }, { passive: true });
  }
  var happyT = 0;
  pup.addEventListener('click', function () {
    pup.classList.remove('happy'); void pup.offsetWidth; pup.classList.add('happy');
    clearTimeout(happyT); happyT = setTimeout(function () { pup.classList.remove('happy'); }, 1150);
  });

  /* a day at the clinic: pinned, scroll-told */
  var dsTrack = $('.ds-track'), dsStage = $('.ds-stage'), dsArt = $('.ds-art'), dsOn = false, dsScene = 0, dsTimeTxt = '';
  var dsItems = $$('.ds-scenes li'), dsDots = $$('.ds-dots span');
  var dsH = $('.ds-ck-h'), dsM = $('.ds-ck-m'), dsSun = $('.ds-sunarm'), dsTime = $('.ds-time');
  var stageH = 0, headH = 64, dsTop = 0, dsHt = 1, docH = 0;
  /* layout is read only here (on enter / resize / load), never inside the scroll frame */
  function measure() {
    var y = window.scrollY;
    stageH = dsStage.offsetHeight; headH = header.offsetHeight;
    var r = dsTrack.getBoundingClientRect(); dsTop = r.top + y; dsHt = r.height;
    trails.forEach(function (tr) { if (tr.near) { var q = tr.svg.getBoundingClientRect(); tr.top = q.top + y; tr.h = q.height; } });
    docH = document.documentElement.scrollHeight;
    scrollDirty = true; schedule();
  }
  if (IOK && !reduced) new IntersectionObserver(function (es) { dsOn = es[0].isIntersecting; if (dsOn) measure(); }).observe(dsTrack);
  var rsT = 0;
  window.addEventListener('resize', function () { clearTimeout(rsT); rsT = setTimeout(measure, 120); }, { passive: true });
  window.addEventListener('load', function () { setTimeout(measure, 400); });
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function frame() {
    rafId = 0;
    var again = false;
    /* ---- reads ---- */
    var sy = window.scrollY, vh = window.innerHeight;
    var eyeR = (heroVis && ptr.active && !reduced) ? eyes.map(function (e) { return e.getBoundingClientRect(); }) : null;
    /* ---- writes ---- */
    if (scrollDirty) {
      header.classList.toggle('scrolled', sy > 8);
      if (!sdOK && docH) { var pr = Math.max(0, Math.min(1, sy / Math.max(1, docH - vh))); spBar.style.transform = 'scaleX(' + pr.toFixed(4) + ')'; spRun.style.transform = 'translateX(' + (pr * 100).toFixed(2) + '%)'; spRun.style.opacity = pr > 0.01 ? '1' : '0'; }
      if (!reduced) trails.forEach(function (tr) {
        if (!tr.near || tr.auto || tr.top == null) return;
        var prog = Math.max(0, Math.min(1, (vh * 0.92 - (tr.top - sy)) / (tr.h + vh * 0.45)));
        setTrail(tr, Math.round(prog * tr.prints.length));
      });
      if (dsOn) {
        var span = Math.max(1, dsHt - stageH);
        var p = Math.max(0, Math.min(1, (headH - (dsTop - sy)) / span));
        var sc = Math.min(dsItems.length - 1, Math.floor(p * dsItems.length));
        var mins = 660 + Math.min(1, p * 1.25) * 420; /* reaches 18:00 as the last scene starts */
        dsH.style.transform = 'rotate(' + (mins / 2).toFixed(1) + 'deg)';
        dsM.style.transform = 'rotate(' + (mins * 6).toFixed(1) + 'deg)';
        dsSun.style.transform = 'rotate(' + (-70 + Math.min(1, p * 1.25) * 140).toFixed(1) + 'deg)';
        var tm = Math.floor(mins / 10) * 10, txt = pad(Math.floor(tm / 60)) + ':' + pad(tm % 60);
        if (txt !== dsTimeTxt) { dsTime.textContent = txt; dsTimeTxt = txt; }
        if (sc !== dsScene) {
          dsScene = sc; dsArt.setAttribute('data-scene', sc);
          dsItems.forEach(function (li, i) { li.classList.toggle('on', i === sc); });
          dsDots.forEach(function (d, i) { d.classList.toggle('on', i === sc); });
        }
      }
    }
    if (heroVis && !reduced) {
      ptr.x += (ptr.tx - ptr.x) * 0.12; ptr.y += (ptr.ty - ptr.y) * 0.12;
      if (Math.abs(ptr.tx - ptr.x) > 0.002 || Math.abs(ptr.ty - ptr.y) > 0.002) again = true;
      var syc = Math.min(sy, 900);
      layers.forEach(function (l) { if (l[0]) l[0].style.translate = (ptr.x * l[1]).toFixed(2) + 'px ' + (ptr.y * l[1] * 0.6 + syc * l[2]).toFixed(2) + 'px'; });
      if (eyeR) eyeR.forEach(function (r, i) {
        var dx = ptr.cx - (r.left + r.width / 2), dy = ptr.cy - (r.top + r.height / 2), d = Math.sqrt(dx * dx + dy * dy) || 1;
        var k = Math.min(1, d / 160) * 3.9;
        pupils[i].style.transform = 'translate(' + (dx / d * k).toFixed(2) + 'px,' + (dy / d * k).toFixed(2) + 'px)';
      });
    }
    scrollDirty = false;
    if (again) schedule();
  }

  /* services: tilt + glare on fine pointers */
  if (fine && !reduced) $$('.serv-card').forEach(function (c) {
    var r = null, ev = null, busy = false;
    c.addEventListener('pointerenter', function () { r = c.getBoundingClientRect(); c.classList.add('tilting'); });
    c.addEventListener('pointermove', function (e) {
      ev = e; if (busy || !r) return; busy = true;
      requestAnimationFrame(function () {
        busy = false; if (!r) return;
        var fx = (ev.clientX - r.left) / r.width, fy = (ev.clientY - r.top) / r.height;
        c.style.setProperty('--ry', ((fx - 0.5) * 9).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((0.5 - fy) * 7).toFixed(2) + 'deg');
        c.style.setProperty('--gx', (fx * 100).toFixed(1) + '%');
        c.style.setProperty('--gy', (fy * 100).toFixed(1) + '%');
      });
    }, { passive: true });
    c.addEventListener('pointerleave', function () { r = null; c.classList.remove('tilting'); ['--rx', '--ry', '--gx', '--gy'].forEach(function (k) { c.style.removeProperty(k); }); });
  });

  /* team: hello bubbles in each member's languages */
  var HELLO = { es: '¡Hola!', en: 'Hi!', pl: 'Cześć!', de: 'Hallo!', it: 'Ciao!', ru: 'Привет!', uk: 'Привіт!' };
  $$('.member').forEach(function (m) {
    var b = document.createElement('span'); b.className = 'hello'; b.setAttribute('aria-hidden', 'true'); m.appendChild(b);
  });
  function setHellos() {
    $$('.member').forEach(function (m) {
      var ls = $$('.member-langs li', m).map(function (li) { return li.getAttribute('lang'); }), out;
      if (teamFilter !== 'all' && m.classList.contains('match')) out = ls.filter(function (l) { return l === teamFilter || (teamFilter === 'ru' && l === 'uk'); });
      else out = ls.slice(0, 3);
      $('.hello', m).textContent = out.map(function (l) { return HELLO[l]; }).join(' · ');
    });
  }
  setHellos();

  /* hours: a clock showing Madrid time */
  var clockOn = reduced || !IOK, nowMin = madridNow().m;
  function setClock() {
    var h = $('.hc-h'), m = $('.hc-m'); if (!h) return;
    var hh = (nowMin / 60) % 12, mm = nowMin % 60;
    h.style.transform = 'rotate(' + (hh * 30).toFixed(1) + 'deg)';
    m.style.transform = 'rotate(' + (360 + mm * 6) + 'deg)';
  }

  /* reviews: score counts up once */
  function scoreUp(el) {
    var end = 4.8; if (reduced) return;
    var t0 = null;
    (function st(ts) { if (!t0) t0 = ts; var q = Math.min(1, (ts - t0) / 1200), v = end * (1 - Math.pow(1 - q, 3)); el.textContent = v.toFixed(1).replace('.', ','); if (q < 1) requestAnimationFrame(st); else el.textContent = el.dataset.score; })(performance.now());
  }

  /* booking: a little burst of paws and hearts when the request is ready */
  function burst() {
    var box = $('#confetti'); if (!box || reduced) return;
    box.innerHTML = '';
    var cols = ['#e8835a', '#f3c165', '#2b6a60', '#cfe4dc'];
    for (var k = 0; k < 16; k++) {
      var i = document.createElement('i');
      i.style.setProperty('--a', Math.round(k * 22.5 + (k % 2 ? 8 : -8)) + 'deg');
      i.style.setProperty('--d', 58 + (k % 3) * 22);
      i.style.setProperty('--k', k);
      i.style.color = cols[k % 4];
      i.innerHTML = '<svg fill="currentColor"><use href="#' + (k % 3 ? 'paw' : 'i-heart') + '"/></svg>';
      box.appendChild(i);
    }
  }

  if (!sdOK || !reduced) { scrollDirty = true; schedule(); }

  /* init */
  if (lang === 'en') applyLang('en'); else updateOpen();
  header.classList.toggle('scrolled', window.scrollY > 8);
})();
