/* Notaría Sánchez · Membrado concept by Noir Digital — content data (ES is also in the HTML) */
window.NSM = {};

/* English strings for static [data-i18n] elements */
NSM.en = {
  skip: 'Skip to content', brandSub: 'Notary · Calle Larios', navLabel: 'Main',
  navDocs: 'What to bring', navBuy: 'Buying a home', navForeign: 'Foreign buyers', navTeam: 'The office', navVisit: 'Contact',
  langLabel: 'Language', ctaBook: 'Request appointment',
  badge: 'Noir Digital concept · not the official website',
  heroKicker: 'Notary in Málaga', heroL1: 'Every signature,', heroL2: 'clearly explained.',
  heroLede: 'Deeds, powers of attorney, wills and inheritances in the very centre of Málaga. Prepare your visit here: see which documents to bring, how a property purchase works step by step, and request an appointment without a phone call.',
  heroCta1: 'What do I need to bring?', heroCta2: 'Request an appointment',
  factRating: 'Google', factReviews: '· 82 reviews', factWhere: 'Where', factWhereV: '2nd floor, Calle Larios',
  factLang: 'Languages', factLangV: 'Spanish · [English to be confirmed]',
  heroCap: 'Calle Marqués de Larios · illustrative image',
  strip: 'Google reviews mention above all <em>how clearly things are explained</em> and the time taken to answer questions.',
  docsEyebrow: 'Prepare your visit', docsTitle: 'What do I need to bring?',
  docsLede: 'Choose the procedure, answer two or three questions and get your document list. Tick it off as you gather everything, print it or send it with your appointment request.',
  procLabel: 'Procedure', sheetK: 'Document list',
  orientT: 'Guidance only.', orientD: 'A general example list. Every case is different: always confirm the exact documents with the notary before your appointment.',
  stampT: 'List complete', actPrint: 'Print list', actMail: 'Email it to me', actBook: 'Book for this procedure',
  buyEyebrow: 'Buying a property', buyTitle: 'From reservation to keys, step by step.',
  buyLede: 'How buying a home in Spain usually works, and where the notary comes in. Adjust the route to your case.',
  buyCase: 'Your case', tgMort: 'With a mortgage', tgFor: 'Foreign buyer',
  buyOrient: 'A general description of the usual process, not advice for your particular case.',
  forCap: 'Calle Marqués de Larios · illustrative image', forEyebrow: 'Orientative guide',
  forTitle: 'Buying a home in Málaga from abroad',
  forLede: 'Seven stages, from the first formality to the last tax. Move along the map and watch your passport get stamped at each step.',
  forOrient: 'General information. Confirm the requirements for your case with the notary before you travel.',
  teamEyebrow: 'The office', teamTitle: 'A notary office on Calle Larios.', roleNotary: 'Notary',
  victorNote: 'Several Google reviews mention him by name.', staffT: 'Officers and staff', staffD: '[photos and roles to be confirmed with the office]',
  scoreMeta: '82 reviews on Google', pt1k: 'Most mentioned', pt1v: 'Clear explanations of every document',
  pt2k: 'Also', pt2v: 'Trust, and time to answer questions', pt3k: 'Source', pt3v: 'Summary of topics in public reviews · not literal quotes',
  bookEyebrow: 'Appointment request', bookTitle: 'Request your appointment in writing.',
  bookLede: 'Fill in the form and your email app opens with the request already written for the office. You review it and send it; nothing is sent from this page.',
  fName: 'Full name', eName: 'Please add your name so the office knows who to reply to.', fEmail: 'Email',
  eEmail: 'Please check the email address: it looks incomplete.', fPhone: 'Phone', optional: '(optional)',
  fProc: 'Procedure', fSlot: 'Preferred time', slotM: 'Morning', slotA: 'Afternoon [to be confirmed]', slotX: 'Any time',
  fWhen: 'Possible dates', fWhenPh: 'e.g. week of 1 December', fLang: 'Contact language', fMsg: 'Message',
  fList: 'Attach my document list to the email', fSend: 'Open my email with the request',
  fNote: 'Sent to: formulario@sanchez-membrado.org (the address used by the current website form). The office will confirm the day and time.',
  ltTo: 'To', ltCap: 'Email preview · updates as you type',
  visitEyebrow: 'Getting here', visitTitle: 'In the heart of Málaga.',
  visitNote: 'Calle Larios is pedestrianised: if you come by car, plan to use one of the car parks in the centre.',
  visitMap: 'Open in Google Maps', cPhone: 'Phone', cMail: 'Email', cHours: 'Hours',
  cHoursV: 'Opens at 09:30 (per Google) · [full hours to be confirmed]',
  footOrient: 'The information on this website is general guidance; it does not replace the office’s advice on your case.',
  footImg: 'Illustrative images of Calle Marqués de Larios (Wikimedia Commons, CC0). They do not show the office or its staff.',
  footDemo: 'Design concept by Noir Digital. Not the official website of the notary office. No form sends any data.',
  barLabel: 'Quick actions', barCall: 'Call', barMail: 'Email', barBook: 'Book',
  firmaEyebrow: 'The moment of signing', firmaTitle: 'The signing.',
  firmaLede: 'What the notary does when you sign a deed, in four gestures.',
  fs1t: 'Identifies who signs', fs1d: 'Checks the identity of each party against their original document.',
  fs2t: 'Explains the document', fs2d: 'Reads or explains the deed so you know exactly what you are signing.',
  fs3t: 'Checks the payments', fs3d: 'Records in the deed the means by which payment is made.',
  fs4t: 'Authorises the deed', fs4d: 'With the notary’s signature and seal the document is authorised, and the office sends the electronic copy to the Registry.',
  firmaOrient: 'A general description of a typical signing. Illustrative document and signature.',
  ddK: 'Deed of sale', ddNum: 'Number', ddP1: 'In Málaga, on [—] [—] 20[—].',
  ddP2: 'Before me, the Notary, the parties appear, whom I identify by their identity documents.',
  ddH: 'They grant', ddFe: 'I attest.',
  scrollCue: 'Discover', folderTab: 'File', folderCap: 'Each ticked document is filed in your folder.',
  ppStages: 'Stages', ppPrev: 'Previous', ppNext: 'Next stage', ppPlay: 'Play the whole journey', ppReplay: 'Replay the journey',
  ppNote1: 'A power of attorney lets someone sign for you; if granted outside Spain, usually with an apostille and translation.',
  ppNote2: 'The notary is an impartial public official between the parties; for personal advice many buyers also have their own lawyer.'
};

/* Dynamic UI strings */
NSM.ui = {
  es: { of: 'de', ready: 'documentos listos', steps: 'pasos en su recorrido', who: 'Quién', notary: 'Papel del notario', docs: 'Qué preparar', open: 'Ver detalle', close: 'Cerrar', mailSubj: 'Mi lista de documentos', bookSubj: 'Solicitud de cita', hello: 'Buenos días:', want: 'Quisiera solicitar cita para', slot: 'Preferencia', when: 'Fechas posibles', phone: 'Teléfono', lang: 'Idioma de contacto', listHead: 'Mi lista de documentos (orientativa)', thanks: 'Un saludo,', menuMail: 'Abrir correo', printed: 'Lista orientativa · confirme siempre con la notaría · Notaría Sánchez · Membrado, C/ Marqués de Larios 6, 2ª planta, Málaga · 952 21 54 75', slots: { m: 'mañana', a: 'tarde', x: 'indiferente' }, langs: { es: 'español', en: 'inglés' }, enSwitchBack: 'Volver a español', other: 'Otro trámite', stage: 'Etapa', role: 'Papel de la notaría', replay: 'Repetir el viaje', play: 'Recorrer todo el viaje', filed: 'archivado', endT: 'Las llaves, en sus manos.', endD: 'La compra está completa.' },
  en: { of: 'of', ready: 'documents ready', steps: 'steps in your route', who: 'Who', notary: 'The notary’s role', docs: 'What to prepare', open: 'See detail', close: 'Close', mailSubj: 'My document list', bookSubj: 'Appointment request', hello: 'Good morning,', want: 'I would like to request an appointment for', slot: 'Preferred time', when: 'Possible dates', phone: 'Phone', lang: 'Contact language', listHead: 'My document list (guidance only)', thanks: 'Kind regards,', menuMail: 'Open email', printed: 'Guidance only · always confirm with the notary · Notaría Sánchez · Membrado, C/ Marqués de Larios 6, 2nd floor, Málaga · +34 952 21 54 75', slots: { m: 'morning', a: 'afternoon', x: 'any time' }, langs: { es: 'Spanish', en: 'English' }, enSwitchBack: 'Volver a español', other: 'Other procedure', stage: 'Stage', role: 'The notary’s role', replay: 'Replay the journey', play: 'Play the whole journey', filed: 'filed', endT: 'Keys in hand.', endD: 'The purchase is complete.' }
};

/* Checklist builder: procedures, questions and documents (orientative) */
NSM.procs = [
  { id: 'compra', n: 'I', t: { es: 'Compraventa de vivienda', en: 'Property purchase or sale' }, s: { es: 'Comprar o vender un inmueble', en: 'Buying or selling a property' },
    q: [
      { id: 'role', type: 'seg', t: { es: 'Usted es…', en: 'You are…' }, c: [['buy', { es: 'Comprador', en: 'Buyer' }], ['sell', { es: 'Vendedor', en: 'Seller' }]], d: 'buy' },
      { id: 'mort', type: 'yn', t: { es: '¿Hay hipoteca nueva para la compra?', en: 'Is there a new mortgage for the purchase?' }, d: true, when: function (s) { return s.role === 'buy'; } },
      { id: 'debt', type: 'yn', t: { es: '¿Queda hipoteca pendiente sobre la vivienda?', en: 'Is there an outstanding mortgage on the property?' }, d: false, when: function (s) { return s.role === 'sell'; } },
      { id: 'for', type: 'yn', t: { es: '¿Algún firmante es extranjero?', en: 'Is any signatory a foreign national?' }, d: false }
    ],
    g: [
      { t: { es: 'Identidad', en: 'Identity' }, i: [
        { t: { es: 'DNI, NIE o pasaporte en vigor de cada firmante (original)', en: 'Valid Spanish ID, NIE or passport of each signatory (original)' } },
        { t: { es: 'NIE de cada firmante extranjero', en: 'NIE number of each foreign signatory' }, n: { es: 'Número de identidad de extranjero. Conviene tramitarlo con antelación.', en: 'Spanish foreigner identity number. Best arranged well in advance.' }, w: function (s) { return s.for; } },
        { t: { es: 'Estado civil y, si está casado, datos del cónyuge y régimen económico', en: 'Marital status and, if married, spouse details and matrimonial property regime' }, n: { es: 'Si hubo capitulaciones matrimoniales, tráigalas.', en: 'If there is a marriage contract, bring it.' } }
      ] },
      { t: { es: 'La vivienda', en: 'The property' }, i: [
        { t: { es: 'Escritura de propiedad actual', en: 'Current title deed' }, w: function (s) { return s.role === 'sell'; } },
        { t: { es: 'Último recibo del IBI', en: 'Latest IBI (property tax) receipt' }, w: function (s) { return s.role === 'sell'; } },
        { t: { es: 'Certificado de la comunidad de propietarios de estar al corriente de pago', en: 'Certificate from the owners’ association that fees are paid up' }, w: function (s) { return s.role === 'sell'; } },
        { t: { es: 'Certificado de eficiencia energética', en: 'Energy performance certificate' }, w: function (s) { return s.role === 'sell'; } },
        { t: { es: 'Certificado del banco con la deuda pendiente de la hipoteca', en: 'Bank certificate of the outstanding mortgage balance' }, n: { es: 'Para cancelarla en la firma; coordínelo con su banco y con la notaría.', en: 'To cancel it at signing; coordinate with your bank and the office.' }, w: function (s) { return s.role === 'sell' && s.debt; } },
        { t: { es: 'Contrato de arras o de reserva, si lo hay', en: 'Deposit (arras) or reservation contract, if any' } }
      ] },
      { t: { es: 'El pago', en: 'Payment' }, i: [
        { t: { es: 'Justificantes de los medios de pago (transferencias o cheques bancarios)', en: 'Proof of the means of payment (bank transfers or bank cheques)' }, n: { es: 'En la escritura se identifican los pagos.', en: 'Payments are identified in the deed.' }, w: function (s) { return s.role === 'buy'; } },
        { t: { es: 'Número de cuenta donde recibirá el precio', en: 'Bank account where you will receive the price' }, w: function (s) { return s.role === 'sell'; } }
      ] },
      { t: { es: 'Hipoteca', en: 'Mortgage' }, w: function (s) { return s.role === 'buy' && s.mort; }, i: [
        { t: { es: 'Documentación precontractual del banco (FEIN y FiAE)', en: 'Pre-contract documents from the bank (FEIN and FiAE)' } },
        { t: { es: 'Cita previa en la notaría para el acta de transparencia', en: 'A prior appointment at the notary for the mortgage transparency act' }, n: { es: 'Es una visita anterior a la firma en la que el notario le explica el préstamo.', en: 'A visit before signing in which the notary explains the loan to you.' } }
      ] },
      { t: { es: 'Si es extranjero', en: 'If you are a foreign national' }, w: function (s) { return s.for; }, i: [
        { t: { es: 'Intérprete, si no domina el castellano', en: 'An interpreter, if you are not fluent in Spanish' }, n: { es: 'Debe entender lo que firma; confirme con la notaría cómo organizarlo.', en: 'You must understand what you sign; confirm with the office how to arrange it.' } },
        { t: { es: 'Poder notarial, si no podrá asistir a la firma', en: 'A power of attorney, if you cannot attend the signing' }, n: { es: 'Si se firma fuera de España, puede necesitar apostilla y traducción.', en: 'If signed outside Spain, it may need an apostille and translation.' } }
      ] }
    ] },

  { id: 'poder', n: 'II', t: { es: 'Poder notarial', en: 'Power of attorney' }, s: { es: 'Que otra persona firme por usted', en: 'Someone else signs for you' },
    q: [
      { id: 'kind', type: 'seg', t: { es: '¿Para qué?', en: 'What for?' }, c: [['gen', { es: 'General', en: 'General' }], ['spec', { es: 'Un trámite concreto', en: 'One specific act' }]], d: 'spec' },
      { id: 'abroad', type: 'yn', t: { es: '¿Se usará fuera de España?', en: 'Will it be used outside Spain?' }, d: false },
      { id: 'for', type: 'yn', t: { es: '¿Necesita intérprete?', en: 'Do you need an interpreter?' }, d: false }
    ],
    g: [
      { t: { es: 'Quien da el poder', en: 'The person granting it' }, i: [
        { t: { es: 'DNI, NIE o pasaporte en vigor (original)', en: 'Valid Spanish ID, NIE or passport (original)' } },
        { t: { es: 'NIE, si es extranjero y lo tiene', en: 'NIE number, if you are a foreign national and have one' } }
      ] },
      { t: { es: 'Quien lo recibe', en: 'The attorney' }, i: [
        { t: { es: 'Nombre completo y número de documento del apoderado', en: 'Full name and ID number of the attorney' }, n: { es: 'Normalmente el apoderado no necesita acudir.', en: 'The attorney normally does not need to attend.' } }
      ] },
      { t: { es: 'El encargo', en: 'The task' }, i: [
        { t: { es: 'Descripción del acto: qué podrá hacer el apoderado', en: 'What the attorney will be able to do' } },
        { t: { es: 'Datos del inmueble o asunto (p. ej. referencia catastral)', en: 'Details of the property or matter (e.g. cadastral reference)' }, w: function (s) { return s.kind === 'spec'; } },
        { t: { es: 'País donde se usará: puede requerir apostilla y traducción', en: 'Country where it will be used: may need an apostille and translation' }, w: function (s) { return s.abroad; } },
        { t: { es: 'Intérprete, a coordinar con la notaría', en: 'An interpreter, arranged with the office' }, w: function (s) { return s.for; } }
      ] }
    ] },

  { id: 'testamento', n: 'III', t: { es: 'Testamento', en: 'Will' }, s: { es: 'Dejar sus deseos por escrito', en: 'Put your wishes in writing' },
    q: [
      { id: 'abroadAssets', type: 'yn', t: { es: '¿Tiene bienes en otro país?', en: 'Do you own assets in another country?' }, d: false },
      { id: 'for', type: 'yn', t: { es: '¿Es usted extranjero?', en: 'Are you a foreign national?' }, d: false }
    ],
    g: [
      { t: { es: 'Para la firma', en: 'For the signing' }, i: [
        { t: { es: 'DNI, NIE o pasaporte en vigor (original)', en: 'Valid Spanish ID, NIE or passport (original)' } },
        { t: { es: 'Nombres completos de herederos, legatarios y, si procede, tutores', en: 'Full names of heirs, legatees and, if relevant, guardians' } },
        { t: { es: 'Una idea del reparto que desea', en: 'An idea of how you want to distribute your estate' }, n: { es: 'El notario le explicará las opciones y los límites legales.', en: 'The notary will explain the options and legal limits.' } }
      ] },
      { t: { es: 'Casos especiales', en: 'Special cases' }, w: function (s) { return s.abroadAssets || s.for; }, i: [
        { t: { es: 'Relación de bienes en el extranjero', en: 'A list of assets held abroad' }, w: function (s) { return s.abroadAssets; } },
        { t: { es: 'Coméntelo en la notaría: qué ley quiere que rija su sucesión', en: 'Raise it with the office: which law you want to govern your estate' }, w: function (s) { return s.for; } },
        { t: { es: 'Intérprete, si no domina el castellano', en: 'An interpreter, if you are not fluent in Spanish' }, w: function (s) { return s.for; } }
      ] }
    ] },

  { id: 'herencia', n: 'IV', t: { es: 'Herencia', en: 'Inheritance' }, s: { es: 'Aceptar y repartir una herencia', en: 'Accept and divide an estate' },
    q: [
      { id: 'will', type: 'seg', t: { es: '¿Había testamento?', en: 'Was there a will?' }, c: [['yes', { es: 'Sí', en: 'Yes' }], ['no', { es: 'No', en: 'No' }], ['dk', { es: 'No lo sé', en: 'Not sure' }]], d: 'dk' },
      { id: 'prop', type: 'yn', t: { es: '¿Hay inmuebles en la herencia?', en: 'Does the estate include property?' }, d: true }
    ],
    g: [
      { t: { es: 'Sobre el fallecimiento', en: 'About the death' }, i: [
        { t: { es: 'Certificado literal de defunción', en: 'Full death certificate' } },
        { t: { es: 'Certificado de Últimas Voluntades', en: 'Certificate from the Registry of Last Wills' }, n: { es: 'Indica si hubo testamento y ante qué notario.', en: 'Shows whether there was a will and before which notary.' } },
        { t: { es: 'Certificado de seguros de vida', en: 'Certificate of life insurance policies' } },
        { t: { es: 'Copia autorizada del último testamento', en: 'Authorised copy of the last will' }, w: function (s) { return s.will !== 'no'; } },
        { t: { es: 'Declaración de herederos (si no hay testamento)', en: 'Declaration of heirs (if there is no will)' }, n: { es: 'Es un acta notarial previa; consulte cómo iniciarla.', en: 'A prior notarial act; ask how to start it.' }, w: function (s) { return s.will !== 'yes'; } }
      ] },
      { t: { es: 'Herederos', en: 'Heirs' }, i: [
        { t: { es: 'DNI, NIE o pasaporte de cada heredero', en: 'Spanish ID, NIE or passport of each heir' } },
        { t: { es: 'Libro de familia', en: 'Family book (Libro de familia)' } }
      ] },
      { t: { es: 'Bienes', en: 'Assets' }, i: [
        { t: { es: 'Escrituras de los inmuebles y último recibo del IBI', en: 'Property title deeds and latest IBI receipt' }, w: function (s) { return s.prop; } },
        { t: { es: 'Certificados bancarios de saldos a la fecha del fallecimiento', en: 'Bank certificates of balances at the date of death' } },
        { t: { es: 'Datos de vehículos, acciones u otros bienes, si los hay', en: 'Details of vehicles, shares or other assets, if any' } }
      ] },
      { t: { es: 'Impuestos', en: 'Taxes' }, i: [
        { t: { es: 'Pregunte por los plazos del Impuesto de Sucesiones', en: 'Ask about the deadlines for Inheritance Tax' }, n: { es: 'Hay plazos fiscales; confírmelos con la notaría o su asesor.', en: 'There are tax deadlines; confirm them with the office or your adviser.' } }
      ] }
    ] },

  { id: 'sociedad', n: 'V', t: { es: 'Constituir sociedad', en: 'Company formation' }, s: { es: 'Crear una sociedad limitada', en: 'Set up a limited company (S.L.)' },
    q: [
      { id: 'cash', type: 'yn', t: { es: '¿El capital se aporta en dinero?', en: 'Is the capital contributed in cash?' }, d: true },
      { id: 'for', type: 'yn', t: { es: '¿Hay socios extranjeros?', en: 'Are there foreign partners?' }, d: false }
    ],
    g: [
      { t: { es: 'Antes de la firma', en: 'Before signing' }, i: [
        { t: { es: 'Certificación negativa de denominación (Registro Mercantil Central)', en: 'Company name availability certificate (Central Companies Registry)' } },
        { t: { es: 'Certificado bancario del depósito del capital', en: 'Bank certificate of the capital deposit' }, w: function (s) { return s.cash; } },
        { t: { es: 'Descripción de las aportaciones no dinerarias', en: 'Description of non-cash contributions' }, w: function (s) { return !s.cash; } }
      ] },
      { t: { es: 'Socios y administración', en: 'Partners and management' }, i: [
        { t: { es: 'DNI, NIE o pasaporte de cada socio y administrador', en: 'Spanish ID, NIE or passport of each partner and director' } },
        { t: { es: 'NIE de cada socio extranjero', en: 'NIE number of each foreign partner' }, w: function (s) { return s.for; } },
        { t: { es: 'Poder (con apostilla, si procede) del socio que no asista', en: 'Power of attorney (apostilled if needed) for any partner not attending' }, w: function (s) { return s.for; } },
        { t: { es: 'Datos para identificar al titular real', en: 'Information to identify the beneficial owner' } }
      ] },
      { t: { es: 'Estatutos', en: 'Articles of association' }, i: [
        { t: { es: 'Objeto social, domicilio y actividad', en: 'Corporate purpose, registered address and activity' } },
        { t: { es: 'Capital, reparto entre socios y órgano de administración', en: 'Capital, split between partners and type of management body' } }
      ] }
    ] }
];

/* Property purchase timeline (orientative). f: 'mort' | 'for' = only shown for that case */
NSM.steps = [
  { f: 'for', ic: 'M4 6h16v12H4zM8 10h4M8 14h8M15.5 9.5a1.5 1.5 0 1 1 0 .01', t: { es: 'Obtener el NIE', en: 'Get your NIE' },
    d: { es: 'Quien no es español necesita un NIE para comprar. Conviene tramitarlo antes de reservar.', en: 'Non-Spanish buyers need an NIE to buy. It is best arranged before you reserve.' },
    who: { es: 'Comprador (o su representante)', en: 'Buyer (or their representative)' },
    nt: { es: 'La notaría le pedirá el NIE para la escritura.', en: 'The office will ask for your NIE for the deed.' } },
  { ic: 'M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h3', t: { es: 'Reserva y contrato de arras', en: 'Reservation and deposit contract' },
    d: { es: 'Las partes fijan precio, plazo y una señal. Suele firmarse en la agencia o entre particulares.', en: 'The parties agree price, timing and a deposit. Usually signed at the agency or privately.' },
    who: { es: 'Comprador y vendedor', en: 'Buyer and seller' },
    nt: { es: 'Es un contrato privado: no requiere notario. Tráigalo a la firma.', en: 'A private contract: no notary required. Bring it to the signing.' } },
  { ic: 'M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 0 1 0-13zM15.5 15.5L21 21', t: { es: 'Comprobaciones', en: 'Checks' },
    d: { es: 'Titularidad y cargas (nota simple), deudas de comunidad e IBI, situación urbanística.', en: 'Ownership and charges (land registry extract), owners’ association and IBI debts, planning status.' },
    who: { es: 'Comprador, con su asesor', en: 'Buyer, with their adviser' },
    nt: { es: 'Antes de firmar, la notaría consulta la información del Registro de la Propiedad.', en: 'Before signing, the office checks the Land Registry information.' } },
  { f: 'mort', ic: 'M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18', t: { es: 'Hipoteca y acta de transparencia', en: 'Mortgage and transparency act' },
    d: { es: 'El banco entrega la oferta (FEIN y FiAE). Después, una visita previa a la notaría.', en: 'The bank provides its offer (FEIN and FiAE). Then a prior visit to the notary.' },
    who: { es: 'Comprador y banco', en: 'Buyer and bank' },
    nt: { es: 'El notario le explica las condiciones del préstamo y levanta el acta antes de la firma.', en: 'The notary explains the loan terms to you and records the act before signing.' } },
  { ic: 'M4 19c3-1 4-4 6-4s1 3 3 3 3-6 7-9M14 5l5 5', t: { es: 'Firma de la escritura', en: 'Signing the deed' },
    d: { es: 'Comprador, vendedor y, si hay hipoteca, el banco, firman ante notario. Se entregan el precio y las llaves.', en: 'Buyer, seller and, with a mortgage, the bank sign before the notary. Price and keys are handed over.' },
    who: { es: 'Todas las partes', en: 'All parties' },
    nt: { es: 'Identifica a las partes, explica la escritura, comprueba los medios de pago y autoriza el documento.', en: 'Identifies the parties, explains the deed, checks the means of payment and authorises the document.' } },
  { ic: 'M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3S9.5 10.5 12 11s4.5 1.3 4.5 3.3-2 3.2-4.5 3.2-4.5-1.3-4.5-3', t: { es: 'Impuestos', en: 'Taxes' },
    d: { es: 'ITP en vivienda usada, o IVA y AJD en obra nueva. El vendedor, la plusvalía municipal.', en: 'Transfer tax on resale homes, or VAT and stamp duty on new builds. The seller pays the municipal capital gains tax.' },
    who: { es: 'Comprador y vendedor', en: 'Buyer and seller' },
    nt: { es: 'Pregunte en la notaría por la gestión de impuestos [servicio por confirmar].', en: 'Ask the office about tax filing [service to be confirmed].' } },
  { ic: 'M4 20V8l8-4 8 4v12M4 20h16M9 20v-6h6v6M8 10h.01M16 10h.01', t: { es: 'Registro de la Propiedad', en: 'Land Registry' },
    d: { es: 'La compra se inscribe a nombre del comprador en el Registro de la Propiedad.', en: 'The purchase is registered in the buyer’s name at the Land Registry.' },
    who: { es: 'Comprador o gestoría', en: 'Buyer or agency' },
    nt: { es: 'La notaría remite la copia electrónica de la escritura al Registro.', en: 'The office sends the electronic copy of the deed to the Registry.' } },
  { ic: 'M13 3L5 13h6l-1 8 8-10h-6z', t: { es: 'Suministros y recibos', en: 'Utilities and bills' },
    d: { es: 'Cambio de titular de luz, agua y comunidad, y domiciliación del IBI.', en: 'Transfer electricity, water and community fees into your name, and set up IBI payments.' },
    who: { es: 'Comprador', en: 'Buyer' },
    nt: { es: 'Sin intervención notarial. Guarde su copia de la escritura.', en: 'No notarial role. Keep your copy of the deed.' } }
];

/* Foreign buyer's map: passport stages (orientative). EN leads; ES shown underneath in Spanish mode. */
NSM.passport = [
  { k: 'NIE', shape: 'circle', color: '#8c2f26', rot: -8,
    en: { s: 'NIE', t: 'Get your NIE', d: 'Your foreigner identity number. You need it to buy, to pay the taxes and to sign the deed. It can be requested in Spain or at a Spanish consulate, ideally before you reserve.', n: 'The office will ask for your NIE for the deed.' },
    es: { s: 'NIE', t: 'Obtenga su NIE', d: 'Su número de identidad de extranjero. Lo necesita para comprar, pagar los impuestos y firmar la escritura. Puede pedirse en España o en un consulado español, mejor antes de reservar.', n: 'La notaría le pedirá el NIE para la escritura.' } },
  { k: 'BANK', shape: 'rect', color: '#1f2d52', rot: 6,
    en: { s: 'Bank', t: 'Open a Spanish bank account', d: 'Most buyers open one: it makes paying the price, the taxes and the bills simpler. Keep proof of every transfer.', n: 'Payments are identified in the deed.' },
    es: { s: 'Banco', t: 'Abra una cuenta en España', d: 'La mayoría de compradores abre una: simplifica el pago del precio, los impuestos y los recibos. Guarde el justificante de cada transferencia.', n: 'En la escritura se identifican los pagos.' } },
  { k: 'ARRAS', shape: 'oval', color: '#2f5d50', rot: -4,
    en: { s: 'Reservation', t: 'Reserve and sign the deposit contract', d: 'Price, timing and a deposit (arras) are agreed, usually through the agency or privately.', n: 'A private contract: no notary needed. Bring it to the signing.' },
    es: { s: 'Reserva', t: 'Reserve y firme las arras', d: 'Se acuerdan precio, plazo y una señal (arras), normalmente en la agencia o entre particulares.', n: 'Contrato privado: no requiere notario. Tráigalo a la firma.' } },
  { k: 'CHECKS', shape: 'rect', color: '#4b3f72', rot: -10,
    en: { s: 'Checks', t: 'Run the checks', d: 'Ownership and charges (land registry extract), community and IBI debts, planning status. Many buyers work with their own lawyer.', n: 'Before signing, the office checks the Land Registry information.' },
    es: { s: 'Comprobaciones', t: 'Haga las comprobaciones', d: 'Titularidad y cargas (nota simple), deudas de comunidad e IBI, situación urbanística. Muchos compradores cuentan con su propio abogado.', n: 'Antes de firmar, la notaría consulta la información del Registro.' } },
  { k: 'FIRMA', shape: 'circle', color: '#8c2f26', rot: 9,
    en: { s: 'Signing', t: 'Sign before the notary', d: 'Buyer, seller and, with a mortgage, the bank sign the deed. If you are not fluent in Spanish, an interpreter may be needed. Can’t travel? A power of attorney.', n: 'The notary identifies the parties, explains the deed and checks the payments.' },
    es: { s: 'Firma', t: 'Firme ante notario', d: 'Comprador, vendedor y, si hay hipoteca, el banco firman la escritura. Si no domina el castellano, puede necesitar intérprete. ¿No puede viajar? Un poder.', n: 'El notario identifica a las partes, explica la escritura y comprueba los pagos.' } },
  { k: 'REGISTRO', shape: 'oval', color: '#1f2d52', rot: -6,
    en: { s: 'Registry', t: 'Land Registry', d: 'The purchase is registered in your name at the Land Registry.', n: 'The office sends the electronic copy of the deed to the Registry.' },
    es: { s: 'Registro', t: 'Registro de la Propiedad', d: 'La compra se inscribe a su nombre en el Registro de la Propiedad.', n: 'La notaría remite la copia electrónica de la escritura al Registro.' } },
  { k: 'TAX', shape: 'rect', color: '#2f5d50', rot: 5,
    en: { s: 'Taxes', t: 'Pay the purchase taxes', d: 'Transfer tax on resale homes, or VAT and stamp duty on new builds, within their deadlines. Ask your adviser about non-resident obligations.', n: 'Ask the office about tax filing [service to be confirmed].' },
    es: { s: 'Impuestos', t: 'Pague los impuestos de la compra', d: 'ITP en vivienda usada, o IVA y AJD en obra nueva, dentro de sus plazos. Consulte con su asesor las obligaciones como no residente.', n: 'Pregunte en la notaría por la gestión de impuestos [servicio por confirmar].' } }
];
