/* Ichiban · menu data, transcribed from the restaurant's own PDF menu (ichibanmarbella.com/menu/menu.pdf, Dec 2023).
   Prices in euros as printed. "ask" = the PDF marks the dish with * ("check availability and prices").
   Allergens (al) are ORIENTATIVE: inferred by Noir Digital from the listed ingredients, not copied from the PDF icons.
   Codes: gl gluten · cr crustaceans · eg egg · fi fish · so soy · mi milk · se sesame · mo molluscs
   Tags: v vegetarian (named as such or plant-only ingredients) · sp spicy (chilli icon or "spicy" in the PDF) · nr no raw fish · new "Novedad" in the PDF */
window.ICHIBAN_MENU = {
  cats: [
    { id: 'nigiri',   en: 'Nigiri',            es: 'Nigiri',              jp: '握り' },
    { id: 'rolls',    en: 'Special rolls',     es: 'Rollos especiales',   jp: '巻き' },
    { id: 'maki',     en: 'Maki & hand rolls', es: 'Maki y conos',        jp: '巻き' },
    { id: 'sashimi',  en: 'Sashimi & platters',es: 'Sashimi y mixtos',    jp: '刺身' },
    { id: 'starters', en: 'Starters & salads', es: 'Entrantes y ensaladas', jp: '前菜' },
    { id: 'tempura',  en: 'Tempura & fried',   es: 'Tempura y fritos',    jp: '天ぷら' },
    { id: 'teppan',   en: 'Teppanyaki',        es: 'Teppanyaki',          jp: '鉄板焼き' },
    { id: 'rice',     en: 'Rice & noodles',    es: 'Arroz y tallarines',  jp: 'ご飯' },
    { id: 'sets',     en: 'Set menus',         es: 'Menús',               jp: '定食' }
  ],
  dishes: [
    /* ---------- Nigiri (2 pieces) ---------- */
    { c: 'nigiri', n: '1', t: 'Hamachi', en: 'Yellowtail', es: 'Pez limón', p: '6,95', u: '2', al: ['fi'] },
    { c: 'nigiri', n: '5', t: 'Suzuki', en: 'Sea bass', es: 'Lubina', p: '4,75', u: '2', al: ['fi'] },
    { c: 'nigiri', n: '6', t: 'Butterfish', en: 'Butterfish', es: 'Pez mantequilla', p: '5,50', u: '2', al: ['fi'] },
    { c: 'nigiri', n: '8', t: 'Ebi', en: 'Shrimp', es: 'Gambas', p: '4,75', u: '2', al: ['cr'], tg: ['nr'], img: 'nigiri-ebi', alt: { en: 'Shrimp and salmon nigiri on a slate', es: 'Nigiri de gamba y salmón sobre pizarra' } },
    { c: 'nigiri', n: '10', t: 'Sake', en: 'Salmon', es: 'Salmón', p: '4,95', u: '2', al: ['fi'], img: 'nigiri-salmon', alt: { en: 'A row of salmon and shrimp nigiri on a black tray', es: 'Una fila de nigiri de salmón y gamba en una bandeja negra' } },
    { c: 'nigiri', n: '11', t: 'Maguro', en: 'Tuna', es: 'Atún', p: '5,90', u: '2', al: ['fi'] },
    { c: 'nigiri', n: '12', t: 'Toro', en: 'Fatty tuna', es: 'Ventresca de atún', p: '7,50', u: '2', al: ['fi'], img: 'nigiri-mixed', alt: { en: 'Assorted nigiri including tuna, salmon and tamago', es: 'Nigiri variados con atún, salmón y tamago' } },
    { c: 'nigiri', n: '12C', t: 'Toro + uni + caviar', en: 'Fatty tuna, sea urchin and caviar', es: 'Ventresca, erizo y caviar', p: '14,50', u: '2', al: ['fi'], tg: ['ask'] },
    { c: 'nigiri', n: '6T', t: 'Butterfish & truffle', en: 'Butterfish with truffle', es: 'Pez mantequilla con trufa', p: '6,25', u: '2', al: ['fi'] },
    { c: 'nigiri', n: '19', t: 'Ikura', en: 'Salmon roe', es: 'Huevas de salmón', p: '8,50', u: '2', al: ['fi'] },
    { c: 'nigiri', n: '20', t: 'Tobico', en: 'Red flying-fish roe', es: 'Huevas de pez volador rojo', p: '5,95', u: '2', al: ['fi'] },
    { c: 'nigiri', n: '18', t: 'Uni', en: 'Sea urchin roe', es: 'Huevas de erizo', p: '9,50', u: '2', al: [] },
    { c: 'nigiri', n: '13', t: 'Wagyu nigiri vario', en: 'Wagyu nigiri selection', es: 'Nigiri de wagyu variado', p: '19,50', u: '4', al: [], tg: ['ask', 'nr'] },
    { c: 'nigiri', n: '1A', t: 'Yellow tail aburi', en: 'Seared yellowtail', es: 'Pez limón soasado', p: '6,95', u: '2', al: ['fi'], hot: 1 },
    { c: 'nigiri', n: '5A', t: 'Seabass aburi', en: 'Seared sea bass', es: 'Lubina soasada', p: '5,50', u: '2', al: ['fi'], hot: 1 },
    { c: 'nigiri', n: '10A', t: 'Salmon aburi', en: 'Seared salmon', es: 'Aburi de salmón', p: '5,95', u: '2', al: ['fi'], hot: 1, img: 'aburi', alt: { en: 'Sushi being seared with a blowtorch flame', es: 'Sushi soasado con la llama de un soplete' } },
    { c: 'nigiri', n: '11A', t: 'Tuna aburi foie', en: 'Seared tuna with foie gras', es: 'Aburi de atún con foie', p: '8,00', u: '2', al: ['fi'], hot: 1 },
    { c: 'nigiri', n: '12A', t: 'Toro aburi', en: 'Seared fatty tuna', es: 'Ventresca soasada', p: '8,95', u: '2', al: ['fi'], hot: 1 },
    { c: 'nigiri', n: '15', t: 'Eel', en: 'Eel', es: 'Anguila', p: '6,95', u: '2', al: ['fi', 'gl', 'so'], hot: 1, tg: ['nr'] },

    /* ---------- Special rolls ---------- */
    { c: 'rolls', n: 'S1', t: 'Green Dragon', en: 'Green dragon roll', es: 'Dragón verde', p: '14,95', u: '8', al: [], img: 'roll-chop', alt: { en: 'Chopsticks lifting an avocado-topped sushi roll', es: 'Palillos sosteniendo un rollo de sushi con aguacate' } },
    { c: 'rolls', n: 'S2', t: 'Rainbow Roll', en: 'Rainbow roll', es: 'Rollo arco iris', p: '15,50', u: '8', al: [] },
    { c: 'rolls', n: 'S3', t: 'Spicy Salmon', en: 'Spicy salmon roll', es: 'Salmón picante', p: '13,95', u: '8', al: ['fi'], tg: ['sp'] },
    { c: 'rolls', n: 'S4', t: 'Black Pearl Roll', en: 'Black pearl roll', es: 'Rollo de perla negra', p: '14,95', u: '8', al: [] },
    { c: 'rolls', n: 'S6', t: 'Rock Roll', en: 'Rock roll', es: 'Rock roll', p: '15,50', u: '8', al: [] },
    { c: 'rolls', n: '35', t: 'California Tobiko', en: 'California roll with flying-fish roe', es: 'Rollo California tobiko', p: '13,50', u: '8', al: ['fi', 'cr', 'eg'] },
    { c: 'rolls', n: 'S7', t: 'Deluxe Vegetarian Roll', en: 'Deluxe vegetarian roll', es: 'Rollo deluxe vegetariano', p: '14,95', u: '8', al: [], tg: ['v', 'nr'] },
    { c: 'rolls', n: '37', t: 'Soft Shell Crab', en: 'Soft-shell crab roll', es: 'Rollo especial de cangrejo', p: '15,95', u: '4', al: ['cr', 'gl'], tg: ['nr'] },
    { c: 'rolls', n: 'S10', t: 'Spicy Tuna Roll', en: 'Spicy tuna roll', es: 'Rollo de atún picante', p: [['4', '12,50'], ['8', '17,95']], al: ['fi', 'eg'], tg: ['sp'] },
    { c: 'rolls', n: 'S5', t: 'Ninja Kicker', en: 'Deep-fried maki', es: 'Maki frito', p: '12,95', u: '4', al: ['gl'] },
    { c: 'rolls', n: 'S9', t: 'Salmon Deluxe Roll', en: 'Salmon deluxe, no rice', es: 'Salmón deluxe, sin arroz', p: '14,50', u: '4', al: ['fi'] },
    { c: 'rolls', n: 'S12', t: 'Naruto Roll', en: 'Fried fish, chives, tobiko, mayo, cheese, truffle', es: 'Pez frito, cebollino, tobiko, mayonesa, queso, trufa', p: '17,50', u: '8', al: ['fi', 'gl', 'eg', 'mi'] },
    { c: 'rolls', n: 'S13', t: 'Shinobi Roll', en: 'Salmon, chives, tobiko, foie gras, cheese, sesame', es: 'Salmón, cebollino, tobiko, foie, queso, sésamo', p: [['4', '10,50'], ['8', '18,95']], al: ['fi', 'mi', 'se'] },
    { c: 'rolls', n: 'S14', t: 'Volcano Maki', en: 'Salmon, tuna, avocado, tobiko, fried onion', es: 'Salmón, atún, aguacate, tobiko, cebolla frita', p: [['4', '10,00'], ['8', '18,50']], al: ['fi', 'gl'], img: 'roll-roe', alt: { en: 'Sushi rolls topped with orange roe and sauce', es: 'Rollos de sushi con huevas naranjas y salsa' } },
    { c: 'rolls', n: 'S15', t: 'Last Samurai', en: 'Avocado, cucumber, tobiko, crab meat, eel', es: 'Aguacate, pepino, tobiko, carne de cangrejo, anguila', p: '19,95', u: '8', al: ['fi', 'cr', 'gl', 'so'], tg: ['ask'] },
    { c: 'rolls', n: 'S16', t: 'Wagyu Maki Deluxe', en: 'Cheese, avocado, asparagus, chives, foie gras, flambéed wagyu', es: 'Queso, aguacate, espárrago, cebollino, foie, wagyu flambeado', p: '26,50', al: ['mi'], tg: ['ask', 'new', 'nr'] },
    { c: 'rolls', n: 'S17', t: 'Maki Ikanago', en: 'Avocado, salmon, mayo, tobiko', es: 'Aguacate, salmón, mayonesa, tobiko', p: '16,50', al: ['fi', 'eg'], tg: ['ask', 'new'] },
    { c: 'rolls', n: 'S18', t: 'Maki Kaiseki Spicy', en: 'Avocado, salmon, tuna, sea bass, cheese, wasabi tobiko', es: 'Aguacate, salmón, atún, lubina, queso, tobiko de wasabi', p: '17,50', al: ['fi', 'mi'], tg: ['ask', 'new', 'sp'] },

    /* ---------- Maki (6 pcs unless noted) & hand rolls (1 pc) ---------- */
    { c: 'maki', n: '26', t: 'Cucumber Roll', en: 'Cucumber roll', es: 'Rollo de pepino', p: '5,50', u: '6', al: [], tg: ['v', 'nr'] },
    { c: 'maki', n: '27', t: 'Avocado Roll', en: 'Avocado roll', es: 'Rollo de aguacate', p: '5,50', u: '6', al: [], tg: ['v', 'nr'] },
    { c: 'maki', n: '28', t: 'Pickle Roll', en: 'Pickled radish roll', es: 'Rollo de nabo', p: '5,50', u: '6', al: [], tg: ['v', 'nr'] },
    { c: 'maki', n: '29', t: 'Tuna Roll', en: 'Tuna roll', es: 'Rollo de atún', p: '6,50', u: '6', al: ['fi'] },
    { c: 'maki', n: '30', t: 'Salmon Roll', en: 'Salmon roll', es: 'Rollo de salmón', p: '5,95', u: '6', al: ['fi'] },
    { c: 'maki', n: '31', t: 'Tempura Maki', en: 'Prawn tempura roll', es: 'Maki de langostino', p: '10,50', u: '8', al: ['cr', 'gl', 'eg'], tg: ['nr'] },
    { c: 'maki', n: '32', t: 'California Roll', en: 'California roll', es: 'Rollo California', p: '10,50', u: '8', al: ['fi', 'cr', 'eg'], tg: ['nr'] },
    { c: 'maki', n: '34', t: 'Avocado Salmon Roll', en: 'Avocado and salmon roll', es: 'Rollo de aguacate y salmón', p: '10,50', u: '8', al: ['fi'], img: 'roll-sesame', alt: { en: 'Sesame-coated sushi rolls on a black plate', es: 'Rollos de sushi con sésamo sobre un plato negro' } },
    { c: 'maki', n: '41', t: 'Salmon', en: 'Salmon hand roll', es: 'Cono de salmón', p: '5,50', u: '1', al: ['fi'] },
    { c: 'maki', n: '42', t: 'Spicy tuna', en: 'Spicy tuna hand roll', es: 'Cono de atún picante', p: '5,50', u: '1', al: ['fi', 'eg'], tg: ['sp'] },
    { c: 'maki', n: '43', t: 'Tuna', en: 'Tuna hand roll', es: 'Cono de atún', p: '5,50', u: '1', al: ['fi'] },
    { c: 'maki', n: '44', t: 'Eel', en: 'Eel hand roll', es: 'Cono de anguila', p: '5,95', u: '1', al: ['fi', 'gl', 'so'], tg: ['nr'] },
    { c: 'maki', n: '46', t: 'California', en: 'California hand roll', es: 'Cono California', p: '5,50', u: '1', al: ['fi', 'cr', 'eg'], tg: ['nr'] },
    { c: 'maki', n: '47', t: 'Prawn', en: 'Prawn hand roll', es: 'Cono de langostino', p: '5,75', u: '1', al: ['cr'], tg: ['nr'] },

    /* ---------- Sashimi (4 / 8 pcs) & mixed platters ---------- */
    { c: 'sashimi', n: '51', t: 'Butterfish', en: 'Butterfish', es: 'Pez mantequilla', p: [['4', '6,95'], ['8', '13,50']], al: ['fi'] },
    { c: 'sashimi', n: '56', t: 'Tuna', en: 'Tuna', es: 'Atún', p: [['4', '7,95'], ['8', '15,50']], al: ['fi'] },
    { c: 'sashimi', n: '57', t: 'Fatty tuna', en: 'Fatty tuna', es: 'Ventresca de atún', p: [['4', '9,55'], ['8', '18,50']], al: ['fi'] },
    { c: 'sashimi', n: '59', t: 'Salmon', en: 'Salmon', es: 'Salmón', p: [['4', '6,95'], ['8', '11,95']], al: ['fi'], img: 'sashimi', alt: { en: 'Assorted sashimi slices on a dark plate', es: 'Lonchas de sashimi variado sobre un plato oscuro' } },
    { c: 'sashimi', n: '50', t: 'Mackerel', en: 'Mackerel', es: 'Caballa', p: '9,50', al: ['fi'] },
    { c: 'sashimi', n: '52', t: 'Seabass', en: 'Sea bass, thin cut', es: 'Lubina, corte fino', p: [['4', '6,50'], ['8', '12,50']], al: ['fi'] },
    { c: 'sashimi', n: '54', t: 'Octopus', en: 'Octopus, thin cut', es: 'Pulpo, corte fino', p: [['4', '6,75'], ['8', '13,50']], al: ['mo'] },
    { c: 'sashimi', n: '55', t: 'Red snapper', en: 'Red snapper, thin cut', es: 'Pargo, corte fino', p: [['4', '8,75'], ['8', '16,50']], al: ['fi'], tg: ['ask'] },
    { c: 'sashimi', n: '58', t: 'Yellow tail', en: 'Yellowtail, thin cut', es: 'Pez limón, corte fino', p: [['4', '9,50'], ['8', '17,50']], al: ['fi'] },
    { c: 'sashimi', n: '63', t: 'Eel', en: 'Eel, thin cut', es: 'Anguila, corte fino', p: [['4', '7,95'], ['8', '15,90']], al: ['fi', 'gl', 'so'], tg: ['nr'] },
    { c: 'sashimi', n: '64', t: 'Sushi mixed', en: 'Mixed sushi platter', es: 'Sushi mixto', p: '19,95', u: '12', al: ['fi'], img: 'sushi-mixed', alt: { en: 'Mixed sushi on a long black plate with chopsticks', es: 'Sushi mixto en una bandeja negra alargada con palillos' } },
    { c: 'sashimi', n: '65', t: 'Sashimi mixed', en: 'Mixed sashimi platter', es: 'Sashimi mixto', p: '22,95', u: '20', al: ['fi'] },
    { c: 'sashimi', n: '65S', t: 'Small sashimi mixed', en: 'Small mixed sashimi', es: 'Sashimi mixto pequeño', p: '13,75', u: '9', al: ['fi'] },
    { c: 'sashimi', n: '66', t: 'Maki mixed', en: 'Mixed maki platter', es: 'Maki mixto', p: '22,95', u: '20', al: ['fi'] },
    { c: 'sashimi', n: '69', t: 'Deluxe sashimi', en: 'Salmon, tuna, fatty tuna, eel, butterfish', es: 'Salmón, atún, ventresca, anguila, pez mantequilla', p: '35,50', u: '20', al: ['fi', 'gl', 'so'], img: 'sashimi-deluxe', alt: { en: 'A deluxe sashimi platter on crushed ice', es: 'Una bandeja de sashimi deluxe sobre hielo picado' } },

    /* ---------- Starters, salads, soups ---------- */
    { c: 'starters', n: '70', t: 'Gyoza', en: 'Japanese pork dumplings', es: 'Empanadillas japonesas de cerdo', p: '5,50', u: '4', al: ['gl', 'so'], tg: ['nr'], img: 'gyoza', alt: { en: 'Pan-fried gyoza dumplings on a black plate', es: 'Gyozas a la plancha sobre un plato negro' } },
    { c: 'starters', n: '70A', t: 'Vegetarian gyoza', en: 'Vegetable dumplings', es: 'Empanadillas vegetarianas', p: '5,50', u: '4', al: ['gl', 'so'], tg: ['v', 'nr'] },
    { c: 'starters', n: '72', t: 'Edamame', en: 'Japanese soy beans', es: 'Judías japonesas', p: '5,50', al: ['so'], tg: ['v', 'nr'], img: 'edamame', alt: { en: 'A bowl of salted edamame pods', es: 'Un cuenco de edamame con sal' } },
    { c: 'starters', n: '72A', t: 'Chilli edamame', en: 'Spicy Japanese soy beans', es: 'Judías japonesas picantes', p: '5,50', al: ['so'], tg: ['v', 'nr', 'sp'] },
    { c: 'starters', n: '73', t: 'Yakitori', en: 'Chicken on a skewer', es: 'Pincho de pollo', p: '5,50', al: ['gl', 'so'], tg: ['nr'], img: 'yakitori', alt: { en: 'Two grilled chicken skewers with a slice of lemon', es: 'Dos brochetas de pollo a la parrilla con una rodaja de limón' } },
    { c: 'starters', n: '75', t: 'Tuna tartare', en: 'With avocado and tobiko', es: 'Tartar de atún con aguacate y tobiko', p: '16,50', al: ['fi'] },
    { c: 'starters', n: '76', t: 'Salmon tartare', en: 'With avocado and tobiko', es: 'Tartar de salmón con aguacate y tobiko', p: '14,50', al: ['fi'], img: 'tartar', alt: { en: 'Salmon tartare in a black bowl', es: 'Tartar de salmón en un cuenco negro' } },
    { c: 'starters', n: '78', t: 'Deep-fried shrimp', en: 'Fried prawns', es: 'Langostino frito', p: '4,95', u: '5', al: ['cr', 'gl'], tg: ['nr'] },
    { c: 'starters', n: '79', t: 'Chicken wings with lemon', en: 'Chicken wings with lemon', es: 'Alitas de pollo con limón', p: '6,50', al: ['gl'], tg: ['nr'] },
    { c: 'starters', n: '80', t: 'Tokyo mini roll', en: 'Tokyo mini rolls', es: 'Rollito de Tokio', p: '5,95', al: ['gl'], tg: ['nr'] },
    { c: 'starters', n: '80A', t: 'Vegetarian mini roll', en: 'Vegetarian Tokyo mini rolls', es: 'Rollito de Tokio vegetariano', p: '4,95', al: ['gl'], tg: ['v', 'nr'] },
    { c: 'starters', n: '81', t: 'Tataki maguro', en: 'Seared, chilled sliced tuna', es: 'Atún soasado frío en láminas', p: '12,50', al: ['fi', 'so'] },
    { c: 'starters', n: '82', t: 'Tataki de gyu', en: 'Seared, chilled sliced beef', es: 'Ternera soasada fría en láminas', p: '13,50', al: ['so'], tg: ['nr'] },
    { c: 'starters', n: '85', t: 'Tiradito hamachi', en: 'Slices of yellowtail', es: 'Láminas de pez limón', p: '11,50', al: ['fi'] },
    { c: 'starters', n: '87', t: 'Chuka wakame', en: 'Chuka seaweed salad', es: 'Ensalada de algas chuka', p: '6,50', al: ['se'], tg: ['v', 'nr'] },
    { c: 'starters', n: '89', t: 'Salmon sashimi salad', en: 'Salmon sashimi salad', es: 'Ensalada de sashimi de salmón', p: '7,50', al: ['fi'], img: 'salmon-salad', alt: { en: 'Salmon sashimi with wasabi in a blue-patterned bowl', es: 'Sashimi de salmón con wasabi en un cuenco con dibujo azul' } },
    { c: 'starters', n: '90', t: 'Avocado salad', en: 'Avocado, mango and cucumber', es: 'Aguacate, mango y pepino', p: '6,50', al: [], tg: ['v', 'nr'], img: 'avocado-salad', alt: { en: 'Seaweed and sliced avocado salad', es: 'Ensalada de algas y aguacate laminado' } },
    { c: 'starters', n: '90A', t: 'Avocado prawn salad', en: 'Avocado salad with prawns', es: 'Ensalada de aguacate con gambas', p: '8,95', al: ['cr'], tg: ['nr', 'sp'] },
    { c: 'starters', n: '91', t: 'Miso shiru', en: 'Miso soup', es: 'Sopa de miso', p: '3,95', al: ['so'], tg: ['nr'], img: 'miso', alt: { en: 'Miso soup with tofu and seaweed in a lacquered bowl', es: 'Sopa de miso con tofu y algas en un cuenco lacado' } },
    { c: 'starters', n: '92', t: 'Seafood spicy soup', en: 'Spicy seafood soup', es: 'Sopa de marisco picante', p: '5,50', al: ['cr', 'mo'], tg: ['nr', 'sp'] },
    { c: 'starters', n: '93', t: 'Teshiro', en: 'Seafood soup', es: 'Sopa de mariscos', p: '5,50', al: ['cr', 'mo', 'fi'], tg: ['nr'] },

    /* ---------- Tempura & hui (breaded) ---------- */
    { c: 'tempura', n: '94', t: 'Ebi tempura', en: 'Prawn tempura', es: 'Tempura de langostino', p: '10,95', al: ['cr', 'gl', 'eg'], tg: ['nr'], img: 'tempura', alt: { en: 'Prawn tempura on a plate in a restaurant', es: 'Tempura de langostino en un plato' } },
    { c: 'tempura', n: '95', t: 'Yasai tempura', en: 'Vegetable tempura', es: 'Tempura de verduras', p: '9,50', al: ['gl', 'eg'], tg: ['v', 'nr'] },
    { c: 'tempura', n: '96', t: 'Mariwase tempura', en: 'Mixed tempura', es: 'Tempura mixta', p: '10,95', al: ['cr', 'gl', 'eg'], tg: ['nr'] },
    { c: 'tempura', n: '97', t: 'Niku hui', en: 'Breaded fried pork', es: 'Cerdo empanado frito', p: null, al: ['gl', 'eg'], tg: ['nr', 'ask'] },
    { c: 'tempura', n: '98', t: 'Tori hui', en: 'Breaded fried chicken', es: 'Pollo empanado frito', p: '10,95', al: ['gl', 'eg'], tg: ['nr'] },
    { c: 'tempura', n: '99', t: 'Ebi hui', en: 'Breaded fried prawn', es: 'Langostino empanado frito', p: '14,95', al: ['cr', 'gl', 'eg'], tg: ['nr'] },

    /* ---------- Teppanyaki à la carte (all served with broccoli) ---------- */
    { c: 'teppan', n: '100', t: 'Sake', en: 'Salmon', es: 'Salmón', p: '17,50', al: ['fi', 'so'], tg: ['nr'], img: 'tep-salmon', alt: { en: 'Glazed grilled salmon in a hot iron pan', es: 'Salmón glaseado a la plancha en una sartén de hierro' } },
    { c: 'teppan', n: '101', t: 'Japanese chicken curry', en: 'Chicken curry', es: 'Pollo al curry', p: '12,95', al: ['gl'], tg: ['nr', 'sp'], img: 'curry', alt: { en: 'Chicken curry with white rice', es: 'Pollo al curry con arroz blanco' } },
    { c: 'teppan', n: '102', t: 'Teriyaki tori', en: 'Teriyaki chicken', es: 'Pollo teriyaki', p: '15,95', al: ['gl', 'so'], tg: ['nr'], img: 'tep-chicken', alt: { en: 'Teriyaki chicken served on a sizzling black plate', es: 'Pollo teriyaki servido en una plancha negra chisporroteante' } },
    { c: 'teppan', n: '103', t: 'Gyu niku', en: 'Beef tenderloin', es: 'Solomillo de ternera', p: '22,95', al: ['so'], tg: ['nr'], img: 'tep-beef', alt: { en: 'Seared beef slices with wasabi and salt', es: 'Láminas de ternera a la plancha con wasabi y sal' } },
    { c: 'teppan', n: '104', t: 'Ramu jure', en: 'Lamb fillet', es: 'Filete de cordero', p: '19,95', al: ['so'], tg: ['nr', 'sp'] },
    { c: 'teppan', n: '106', t: 'Beef roll', en: 'Beef roll', es: 'Rollo de ternera', p: '20,95', al: ['so'], tg: ['nr'] },
    { c: 'teppan', n: '208', t: 'Ebi', en: 'Prawns', es: 'Langostino', p: '21,95', al: ['cr'], tg: ['nr'] },
    { c: 'teppan', n: '210', t: 'Hotategai', en: 'Scallops', es: 'Vieiras', p: '19,95', al: ['mo'], tg: ['nr'], img: 'scallop', alt: { en: 'Seared scallops served on the shell', es: 'Vieiras a la plancha servidas en su concha' } },
    { c: 'teppan', n: '211', t: 'Ise ebi', en: 'Lobster: 400–600 g, 600–800 g or 800–1000 g', es: 'Langosta: 400–600 g, 600–800 g u 800–1000 g', p: null, al: ['cr'], tg: ['nr', 'ask'] },
    { c: 'teppan', n: '213', t: 'Red king prawn', en: 'Carabineros', es: 'Carabineros', p: null, al: ['cr'], tg: ['nr', 'ask'] },
    { c: 'teppan', n: '214', t: 'Wagyū 100 g', en: 'Japanese beef', es: 'Ternera japonesa', p: null, al: [], tg: ['nr', 'ask'], img: 'wagyu', alt: { en: 'Thin slices of marbled wagyu beef', es: 'Láminas finas de ternera wagyu veteada' } },

    /* ---------- Rice & noodles ---------- */
    { c: 'rice', n: '108', t: 'Yaki mesi', en: 'Fried rice with vegetables', es: 'Arroz frito con verduras', p: '5,75', al: ['eg', 'so'], tg: ['nr'], img: 'yakimesi', alt: { en: 'Fried rice with broccoli and greens', es: 'Arroz frito con brócoli y hojas verdes' } },
    { c: 'rice', n: '109', t: 'Tori don', en: 'Japanese rice with chicken', es: 'Arroz japonés con pollo', p: '11,50', al: ['so'], tg: ['nr'] },
    { c: 'rice', n: '110', t: 'Gyu don', en: 'Japanese rice with beef', es: 'Arroz japonés con ternera', p: '13,95', al: ['so'], tg: ['nr'], img: 'donburi', alt: { en: 'A donburi rice bowl in a blue-and-white bowl', es: 'Un donburi en un cuenco azul y blanco' } },
    { c: 'rice', n: '111', t: 'Unagi don', en: 'Japanese rice with eel', es: 'Arroz japonés con anguila', p: '14,95', al: ['fi', 'gl', 'so'], tg: ['nr'] },
    { c: 'rice', n: '112', t: 'Yasai yaki soba', en: 'Soba noodles with vegetables', es: 'Tallarines soba con verduras', p: '7,50', al: ['gl', 'so'], tg: ['v', 'nr'] },
    { c: 'rice', n: '113', t: 'Gyu yaki soba', en: 'Soba noodles with beef', es: 'Tallarines soba con ternera', p: '9,50', al: ['gl', 'so'], tg: ['nr'] },
    { c: 'rice', n: '115', t: 'Gyu yaki udon', en: 'Udon noodles with beef', es: 'Tallarines udon con ternera', p: '9,95', al: ['gl', 'so'], tg: ['nr'], img: 'udon', alt: { en: 'Steaming udon noodles with beef in a blue-rimmed bowl', es: 'Udon humeante con ternera en un cuenco de borde azul' } },

    /* ---------- Set menus (price per person) ---------- */
    { c: 'sets', n: 'Osaka', t: 'Menu Osaka', en: 'Salad · miso soup · 4 spicy salmon maki · 4 avocado salmon maki · 4 California tobiko · coffee or tea', es: 'Ensalada · sopa de miso · 4 maki de salmón picante · 4 maki de aguacate y salmón · 4 California tobiko · café o té', p: '23,95', pp: 1, al: ['fi', 'cr', 'eg', 'so'], tg: ['sp'], img: 'roll-dark', alt: { en: 'Sushi rolls on a dark plate', es: 'Rollos de sushi en un plato oscuro' } },
    { c: 'sets', n: 'Sapporo', t: 'Menu Sapporo', en: 'Deep-fried shrimp · miso soup or salad · mixed sashimi · beef tenderloin on the hot stone · chips · coffee or tea', es: 'Langostino frito · sopa de miso o ensalada · sashimi mixto · solomillo de ternera a la piedra · patatas · café o té', p: '25,95', pp: 1, al: ['cr', 'gl', 'fi', 'so'], img: 'show-stone', alt: { en: 'Steak on a hot stone with flames behind', es: 'Carne a la piedra con llamas detrás' } }
  ],
  extras: [
    { en: 'Chilli sauce', es: 'Salsa picante', p: '1,50' },
    { en: 'Teriyaki sauce', es: 'Salsa teriyaki', p: '1,50' },
    { en: 'Ginger', es: 'Jengibre', p: '1,00' }
  ]
};
