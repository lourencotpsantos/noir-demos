/* Pura Cepa demo data.
   Every wine, gin, tapa, cheese and price below is transcribed from the bar's own published carta
   ("PURA CEPA - LA CALA DE MIJAS.pdf", the Google Drive file linked from its Google listing, read 19 Nov 2026).
   Spelling of a few names was tidied (e.g. "Shapphire" -> "Sapphire"). Bottle prices are not published, so the
   site shows "[precio]". Pairings and style notes are general guidance written for the demo, not the bar's words. */
(function () {
  'use strict';

  /* Wine styles: colour of the liquid in the glass + a general style note (ES/EN). */
  var S = {
    fino:   { c: '#e9dc9c', es: 'Seco, salino y punzante: crianza bajo velo de flor.', en: 'Dry, saline and tangy: aged under a veil of flor.' },
    amon:   { c: '#c4842f', es: 'Seco y avellanado: primero bajo flor, después oxidativo.', en: 'Dry and nutty: first under flor, then oxidative.' },
    palo:   { c: '#ad6327', es: 'Raro y elegante: nariz de amontillado, cuerpo de oloroso.', en: 'Rare and elegant: an amontillado nose with an oloroso body.' },
    olor:   { c: '#86431b', es: 'Seco, profundo y untuoso: nuez, cuero y madera noble.', en: 'Dry, deep and rich: walnut, leather and old oak.' },
    mosc:   { c: '#d5a03f', es: 'Dulce y aromático: azahar, miel y uva pasa.', en: 'Sweet and aromatic: orange blossom, honey and raisin.' },
    px:     { c: '#3b1709', es: 'Muy dulce y denso: higo, dátil, café y cacao.', en: 'Very sweet and dense: fig, date, coffee and cocoa.' },
    blanco: { c: '#ece2a2', es: 'Blanco fresco: fruta, flor y acidez viva.', en: 'Fresh white: fruit, flowers and lively acidity.' },
    blancob:{ c: '#e2c56c', es: 'Blanco con crianza o barrica: más volumen y untuosidad.', en: 'Oak- or lees-aged white: rounder and fuller.' },
    tinto:  { c: '#7b1b2e', es: 'Tinto joven o roble: fruta roja y taninos amables.', en: 'Young or lightly oaked red: red fruit and soft tannins.' },
    tintog: { c: '#561121', es: 'Tinto de guarda: estructura, fruta negra y madera.', en: 'Age-worthy red: structure, dark fruit and oak.' },
    rosado: { c: '#e9998a', es: 'Rosado: fruta roja fresca y final seco.', en: 'Rosé: fresh red fruit and a dry finish.' },
    burb:   { c: '#efe0a4', b: 1, es: 'Burbuja fina, fresca y versátil.', en: 'Fine, fresh and versatile bubbles.' },
    burbr:  { c: '#f0b3a3', b: 1, es: 'Burbuja rosada: fresa, frescura y finura.', en: 'Pink bubbles: strawberry, freshness and finesse.' },
    tawny:  { c: '#9a4a24', es: 'Oporto oxidativo: frutos secos, caramelo y especia.', en: 'Oxidative port: nuts, caramel and spice.' },
    ruby:   { c: '#6c1424', es: 'Oporto de fruta: cereza negra y ciruela.', en: 'Fruit-led port: black cherry and plum.' },
    wport:  { c: '#e0c27a', es: 'Oporto blanco: miel, cáscara de naranja y almendra.', en: 'White port: honey, orange peel and almond.' },
    madeira:{ c: '#a5622a', es: 'Madeira: acidez eléctrica, caramelo y nuez.', en: 'Madeira: electric acidity, caramel and walnut.' },
    tokaji: { c: '#d0962b', es: 'Dulce húngaro: albaricoque, miel y gran acidez.', en: 'Hungarian sweet wine: apricot, honey and bright acidity.' },
    vrojo:  { c: '#6b2014', es: 'Vermut rojo: hierbas, naranja amarga y especia.', en: 'Red vermouth: herbs, bitter orange and spice.' },
    vblanco:{ c: '#e8d79a', es: 'Vermut blanco: floral, cítrico y herbáceo.', en: 'White vermouth: floral, citrus and herbal.' },
    brandy: { c: '#8d4a1d', es: 'Destilado de vino envejecido en madera.', en: 'Wine spirit aged in oak.' }
  };

  /* Type groups used by the filter chips. */
  var T = {
    gen:  { es: 'Generosos', en: 'Sherry' },
    bla:  { es: 'Blancos', en: 'Whites' },
    tin:  { es: 'Tintos', en: 'Reds' },
    ros:  { es: 'Rosados', en: 'Rosés' },
    esp:  { es: 'Burbujas', en: 'Sparkling' },
    dul:  { es: 'Dulces', en: 'Sweet' },
    gen2: { es: 'Oporto y Madeira', en: 'Port & Madeira' },
    ver:  { es: 'Vermut y brandy', en: 'Vermouth & brandy' }
  };

  /* Zones used by the region filter and by the cellar shelves (north to south, then abroad). */
  var Z = {
    gal: { es: 'Galicia', en: 'Galicia' },
    cyl: { es: 'Castilla y León', en: 'Castilla y León' },
    rio: { es: 'La Rioja', en: 'La Rioja' },
    est: { es: 'Cataluña y Levante', en: 'Catalonia & the east' },
    and: { es: 'Andalucía', en: 'Andalusia' },
    int: { es: 'Internacional', en: 'International' }
  };

  /* n name · t type group · s style · r region as printed · z zone · g grapes · p price (glass) · ml serving · b bodega */
  var W = [
    // Generosos 75 ml
    { n: 'Manzanilla Papirusa', t: 'gen', s: 'fino', r: 'Jerez', z: 'and', g: 'Palomino', p: 4.90, ml: 75, b: 'Bodegas Lustau' },
    { n: 'Manzanilla Maruja', t: 'gen', s: 'fino', r: 'Sanlúcar de Barrameda', z: 'and', g: 'Palomino', p: 5.25, ml: 75, b: 'Bodegas Juan Piñero' },
    { n: 'Fino El Puerto', t: 'gen', s: 'fino', r: 'Jerez', z: 'and', g: 'Palomino', p: 4.90, ml: 75, b: 'Bodegas Lustau' },
    { n: 'Amontillado Gutiérrez Colosía', t: 'gen', s: 'amon', r: 'El Puerto de Santa María', z: 'and', g: 'Palomino', p: 5.90, ml: 75, b: 'Bodegas Gutiérrez Colosía' },
    { n: 'Amontillado Piñero V.O.R.S.', t: 'gen', s: 'amon', r: 'Sanlúcar de Barrameda', z: 'and', g: 'Palomino', p: 10.50, ml: 75, b: 'Bodegas Juan Piñero' },
    { n: 'Palo Cortado Great Duke', t: 'gen', s: 'palo', r: 'Sanlúcar de Barrameda', z: 'and', g: 'Palomino', p: 5.90, ml: 75, b: 'Bodegas Juan Piñero' },
    { n: 'Palo Cortado Lustau V.O.R.S.', t: 'gen', s: 'palo', r: 'Jerez', z: 'and', g: 'Palomino', p: 13.50, ml: 75, b: 'Bodegas Lustau' },
    { n: 'Oloroso Gutiérrez Colosía', t: 'gen', s: 'olor', r: 'El Puerto de Santa María', z: 'and', g: 'Palomino', p: 5.90, ml: 75, b: 'Bodegas Gutiérrez Colosía' },
    { n: 'Oloroso Piñero V.O.R.S.', t: 'gen', s: 'olor', r: 'Sanlúcar de Barrameda', z: 'and', g: 'Palomino', p: 10.50, ml: 75, b: 'Bodegas Juan Piñero' },
    // Dulces 75 ml
    { n: 'Moscatel Señorío de Broches', t: 'dul', s: 'mosc', r: 'Málaga', z: 'and', g: 'Moscatel de Alejandría', p: 4.90, ml: 75, b: 'Bodegas Dimobe' },
    { n: 'Moscatel Zumbral', t: 'dul', s: 'mosc', r: 'Málaga', z: 'and', g: 'Moscatel de Alejandría', p: 4.90, ml: 75, b: 'Bodegas Dimobe', x: { es: 'Moscatel soleado', en: 'Sun-dried Moscatel' } },
    { n: 'BF Maestro', t: 'dul', s: 'mosc', r: 'Ronda', z: 'and', g: 'Moscatel de Alejandría', p: 5.90, ml: 75, b: 'Bodegas Doña Felisa' },
    { n: 'Pedro Ximénez Gutiérrez Colosía', t: 'dul', s: 'px', r: 'Sanlúcar de Barrameda', z: 'and', g: 'Pedro Ximénez', p: 5.90, ml: 75, b: 'Bodegas Gutiérrez Colosía' },
    { n: 'Pedro Ximénez Don PX 2002', t: 'dul', s: 'px', r: 'Montilla-Moriles', z: 'and', g: 'Pedro Ximénez', p: 9.00, ml: 75, b: 'Bodegas Toro Albalá' },
    { n: 'Pedro Ximénez Convento 1946', t: 'dul', s: 'px', r: 'Montilla-Moriles', z: 'and', g: 'Pedro Ximénez', p: 110.00, ml: 75, b: 'Bodegas Toro Albalá', x: { es: '100 puntos Parker, según la carta', en: '100 Parker points, as stated on the list' } },
    { n: 'Grand Tokaji Edes Szamorodni 2018', t: 'dul', s: 'tokaji', r: 'Tokaj, Hungría', z: 'int', g: 'Furmint', p: 6.50, ml: 75 },
    { n: 'Oremus Vega Sicilia 5 Puttonyos 2014', t: 'dul', s: 'tokaji', r: 'Tokaj, Hungría', z: 'int', g: 'Furmint', p: 15.50, ml: 75 },
    // Blancos 150 ml
    { n: '40 Vendimias Sauvignon Blanc', t: 'bla', s: 'blanco', r: 'Rueda', z: 'cyl', g: 'Sauvignon Blanc', p: 4.90, ml: 150 },
    { n: '40 Vendimias Verdejo', t: 'bla', s: 'blanco', r: 'Rueda', z: 'cyl', g: 'Verdejo', p: 4.90, ml: 150 },
    { n: 'Blanquito', t: 'bla', s: 'blanco', r: 'Rías Baixas', z: 'gal', g: 'Albariño', p: 4.90, ml: 150 },
    { n: 'Malapipa', t: 'bla', s: 'blanco', r: 'Mijas', z: 'and', g: 'Moscatel, Pedro Ximénez y Colombard', p: 4.90, ml: 150 },
    { n: 'Viña Eguia', t: 'bla', s: 'blanco', r: 'La Rioja', z: 'rio', g: 'Viura y Tempranillo Blanco', p: 4.90, ml: 150 },
    { n: 'Honeymoon', t: 'bla', s: 'blanco', r: 'Penedès', z: 'est', g: 'Parellada', p: 5.50, ml: 150 },
    { n: 'Cloe', t: 'bla', s: 'blanco', r: 'Ronda', z: 'and', g: 'Chardonnay', p: 5.90, ml: 150 },
    { n: 'As Glorias', t: 'bla', s: 'blanco', r: 'Ribeira Sacra', z: 'gal', g: 'Godello', p: 6.50, ml: 150 },
    { n: 'El Aeronauta', t: 'bla', s: 'blanco', r: 'Valdeorras', z: 'gal', g: 'Godello', p: 6.90, ml: 150 },
    { n: 'Cosme Palacio Reserva', t: 'bla', s: 'blancob', r: 'La Rioja', z: 'rio', g: 'Viura', p: 7.90, ml: 150 },
    { n: 'Petit de Matasnos', t: 'bla', s: 'blanco', r: 'Castilla y León', z: 'cyl', g: 'Viognier, Chardonnay, Verdejo y Albillo', p: 7.90, ml: 150 },
    { n: 'Caserío de Dueñas Fermentado en Barrica', t: 'bla', s: 'blancob', r: 'Rueda', z: 'cyl', g: 'Verdejo', p: 8.90, ml: 150 },
    { n: 'Caníbal', t: 'bla', s: 'blancob', r: 'Mijas', z: 'and', g: 'Chardonnay', p: 9.50, ml: 150 },
    { n: 'El Paraguas', t: 'bla', s: 'blanco', r: 'Ribeiro', z: 'gal', g: 'Treixadura', p: 9.60, ml: 150 },
    { n: 'Markiss', t: 'bla', s: 'blanco', r: 'Ronda', z: 'and', g: 'Sauvignon Blanc', p: 15.90, ml: 150 },
    { n: 'Belondrade y Lurton', t: 'bla', s: 'blancob', r: 'Rueda', z: 'cyl', g: 'Verdejo', p: 16.95, ml: 150 },
    { n: 'Viña Gravonia', t: 'bla', s: 'blancob', r: 'La Rioja', z: 'rio', g: 'Viura', p: 16.95, ml: 150 },
    { n: 'As Sortes', t: 'bla', s: 'blancob', r: 'Valdeorras', z: 'gal', g: 'Godello', p: 21.90, ml: 150 },
    // Tintos 150 ml
    { n: 'Viña María Luisa', t: 'tin', s: 'tinto', r: 'La Rioja', z: 'rio', g: 'Tempranillo', p: 4.90, ml: 150 },
    { n: 'Claus', t: 'tin', s: 'tinto', r: 'Ribera del Duero', z: 'cyl', g: 'Tinta Fina', p: 4.90, ml: 150 },
    { n: 'Flor de Malvajío', t: 'tin', s: 'tinto', r: 'Mijas', z: 'and', g: 'Syrah y Merlot', p: 5.50, ml: 150 },
    { n: 'Malvajío "Tinto de Garaje"', t: 'tin', s: 'tinto', r: 'Mijas', z: 'and', g: 'Syrah', p: 6.90, ml: 150 },
    { n: 'Doble Doce', t: 'tin', s: 'tinto', r: 'Ronda', z: 'and', g: 'Cabernet Sauvignon y Merlot', p: 7.50, ml: 150 },
    { n: 'MMM Machomann', t: 'tin', s: 'tinto', r: 'Murcia', z: 'est', g: 'Monastrell', p: 7.90, ml: 150 },
    { n: 'Secreto', t: 'tin', s: 'tintog', r: 'Ribera del Duero', z: 'cyl', g: 'Tempranillo, Cabernet Sauvignon y Malbec', p: 7.90, ml: 150, x: { es: '98 % Tempranillo, 2 % Cabernet Sauvignon y Malbec', en: '98% Tempranillo, 2% Cabernet Sauvignon & Malbec' } },
    { n: 'Alonso del Yerro', t: 'tin', s: 'tintog', r: 'Ribera del Duero', z: 'cyl', g: 'Tinta Fina', p: 8.90, ml: 150 },
    { n: 'La Mateo', t: 'tin', s: 'tinto', r: 'La Rioja', z: 'rio', g: 'Tempranillo, Garnacha y Graciano', p: 8.90, ml: 150 },
    { n: 'Cosme Palacio Reserva Viñedos Viejos', t: 'tin', s: 'tintog', r: 'La Rioja', z: 'rio', g: 'Tempranillo', p: 9.90, ml: 150 },
    { n: 'Caníbal Tinto', t: 'tin', s: 'tintog', r: 'Mijas', z: 'and', g: 'Syrah y Cabernet Sauvignon', p: 11.90, ml: 150 },
    { n: 'La Hormiga de Antídoto', t: 'tin', s: 'tintog', r: 'Ribera del Duero', z: 'cyl', g: 'Tinta Fina', p: 12.90, ml: 150 },
    { n: 'Conde de los Andes 2017', t: 'tin', s: 'tintog', r: 'La Rioja', z: 'rio', g: 'Tempranillo', p: 12.90, ml: 150 },
    { n: 'Bassus', t: 'tin', s: 'tinto', r: 'Utiel-Requena', z: 'est', g: 'Pinot Noir', p: 14.90, ml: 150 },
    { n: 'Paydos', t: 'tin', s: 'tintog', r: 'Toro', z: 'cyl', g: 'Tinta de Toro', p: 15.50, ml: 150 },
    { n: 'Viña Tondonia', t: 'tin', s: 'tintog', r: 'La Rioja', z: 'rio', g: 'Tempranillo, Garnacha y Graciano', p: 15.90, ml: 150 },
    { n: 'Numanthia', t: 'tin', s: 'tintog', r: 'Toro', z: 'cyl', g: 'Tinta de Toro', p: 21.00, ml: 150 },
    { n: 'Mercure', t: 'tin', s: 'tintog', r: 'Ronda', z: 'and', g: 'Petit Verdot', p: 23.50, ml: 150 },
    { n: 'María', t: 'tin', s: 'tintog', r: 'Ribera del Duero', z: 'cyl', g: 'Tinta Fina', p: 24.90, ml: 150 },
    { n: 'Mauro V.S.', t: 'tin', s: 'tintog', r: 'Castilla y León', z: 'cyl', g: 'Tempranillo', p: 27.90, ml: 150 },
    { n: 'Vega Sicilia Valbuena 5º Año', t: 'tin', s: 'tintog', r: 'Ribera del Duero', z: 'cyl', g: 'Tinta Fina y Merlot', p: 42.75, ml: 150 },
    { n: 'Flor de Pingus', t: 'tin', s: 'tintog', r: 'Ribera del Duero', z: 'cyl', g: 'Tinta Fina', p: 48.50, ml: 150 },
    // Rosados 150 ml
    { n: 'Marmellans', t: 'ros', s: 'rosado', r: 'Cataluña', z: 'est', g: 'Syrah y Garnacha', p: 5.50, ml: 150 },
    { n: 'Cloe Rosé', t: 'ros', s: 'rosado', r: 'Ronda', z: 'and', g: 'Garnacha', p: 5.90, ml: 150 },
    // Espumosos y champagne 150 ml
    { n: 'Bocchoris Brut Nature', t: 'esp', s: 'burb', r: 'Cava', z: 'est', g: 'Xarel·lo, Macabeo y Parellada', p: 4.90, ml: 150 },
    { n: 'Prosecco', t: 'esp', s: 'burb', r: 'Italia', z: 'int', g: 'Glera', p: 5.50, ml: 150 },
    { n: 'Prosecco Rosé', t: 'esp', s: 'burbr', r: 'Véneto, Italia', z: 'int', g: 'Pinot Noir', p: 6.90, ml: 150 },
    { n: 'Cloe Espumoso', t: 'esp', s: 'burb', r: 'Ronda', z: 'and', g: 'Sauvignon Blanc', p: 8.50, ml: 150 },
    { n: 'Jean de Burigny', t: 'esp', s: 'burb', r: 'Champagne, Francia', z: 'int', g: 'Chardonnay, Pinot Noir y Pinot Meunier', p: 12.50, ml: 150 },
    { n: 'Barons de Rothschild Blanc de Blancs', t: 'esp', s: 'burb', r: 'Champagne, Francia', z: 'int', g: 'Chardonnay', p: 29.50, ml: 150 },
    { n: 'Barons de Rothschild Rosé', t: 'esp', s: 'burbr', r: 'Champagne, Francia', z: 'int', g: 'Chardonnay y Pinot Noir', p: 29.50, ml: 150 },
    // Oporto y Madeira 75 ml
    { n: 'Niepoort Tawny', t: 'gen2', s: 'tawny', r: 'Vila Nova de Gaia, Portugal', z: 'int', g: '', p: 4.95, ml: 75 },
    { n: 'Niepoort Ruby', t: 'gen2', s: 'ruby', r: 'Vila Nova de Gaia, Portugal', z: 'int', g: '', p: 4.95, ml: 75 },
    { n: 'White Port Andresen 10 Years', t: 'gen2', s: 'wport', r: 'Oporto, Portugal', z: 'int', g: '', p: 6.00, ml: 75 },
    { n: 'Quinta do Crasto LBV', t: 'gen2', s: 'ruby', r: 'Douro, Portugal', z: 'int', g: '', p: 6.90, ml: 75 },
    { n: 'Andresen 10 Years Old Tawny', t: 'gen2', s: 'tawny', r: 'Oporto, Portugal', z: 'int', g: '', p: 7.50, ml: 75 },
    { n: 'Quinta do Crasto Colheita 2003', t: 'gen2', s: 'tawny', r: 'Douro, Portugal', z: 'int', g: '', p: 12.50, ml: 75 },
    { n: 'Andresen Colheita 1982', t: 'gen2', s: 'tawny', r: 'Douro, Portugal', z: 'int', g: '', p: 19.75, ml: 75 },
    { n: 'Barbeito Medium Sweet', t: 'gen2', s: 'madeira', r: 'Madeira, Portugal', z: 'int', g: '', p: 4.90, ml: 75 },
    { n: 'Barbeito Medium Dry', t: 'gen2', s: 'madeira', r: 'Madeira, Portugal', z: 'int', g: '', p: 4.90, ml: 75 },
    { n: "Justino's Colheita 2003 Medium Rich", t: 'gen2', s: 'madeira', r: 'Madeira, Portugal', z: 'int', g: '', p: 13.50, ml: 75 },
    { n: "Justino's Malvasia 1997", t: 'gen2', s: 'madeira', r: 'Madeira, Portugal', z: 'int', g: 'Malvasía', p: 13.95, ml: 75 },
    { n: "Justino's Colheita 1998 Rich", t: 'gen2', s: 'madeira', r: 'Madeira, Portugal', z: 'int', g: '', p: 15.90, ml: 75 },
    // Vermut 100 ml, brandy y cognac 100 ml
    { n: 'Vermut Manuel Aragón', t: 'ver', s: 'vrojo', r: 'Chiclana de la Frontera', z: 'and', g: '', p: 4.95, ml: 100, b: 'Bodegas Manuel Aragón' },
    { n: 'Vermut Lustau Rojo', t: 'ver', s: 'vrojo', r: 'Jerez', z: 'and', g: '', p: 4.95, ml: 100, b: 'Bodegas Lustau' },
    { n: 'Vermut Lustau Blanco', t: 'ver', s: 'vblanco', r: 'Jerez', z: 'and', g: '', p: 4.95, ml: 100, b: 'Bodegas Lustau' },
    { n: 'Vermut Petroni Blanco / Tinto', t: 'ver', s: 'vrojo', r: 'Galicia', z: 'gal', g: '', p: 5.50, ml: 100, b: 'Vermutería de Galicia' },
    { n: 'Vermut San Bernabé', t: 'ver', s: 'vrojo', r: 'La Rioja', z: 'rio', g: '', p: 6.25, ml: 100, b: 'Bodegas Vinícola Real' },
    { n: 'Lustau Solera Reserva', t: 'ver', s: 'brandy', r: 'Jerez', z: 'and', g: '', p: 7.90, ml: 100, b: 'Bodegas Lustau', x: { es: 'Brandy', en: 'Brandy' } },
    { n: 'Diez Mil Botellas', t: 'ver', s: 'brandy', r: 'Jerez', z: 'and', g: '', p: 12.50, ml: 100, b: 'Bodegas Ximénez-Spínola', x: { es: 'Brandy', en: 'Brandy' } },
    { n: 'Juan Sebastián El Cano', t: 'ver', s: 'brandy', r: 'El Puerto de Santa María', z: 'and', g: '', p: 29.50, ml: 100, b: 'Bodegas Gutiérrez Colosía', x: { es: 'Brandy', en: 'Brandy' } },
    { n: 'Pierre Ferrand 10th Generation', t: 'ver', s: 'brandy', r: 'Cognac, Francia', z: 'int', g: '', p: 14.90, ml: 100, x: { es: 'Cognac', en: 'Cognac' } }
  ];

  /* Gin & tonics. Signature serves, alcohol-free, then the full list by country as printed. Prices per G&T. */
  var SIG = [
    { n: 'The Special One', p: 13, d: { es: "Greenall's con infusión de frutos rojos", en: "Greenall's with a red-berry infusion" }, tint: 'pink' },
    { n: 'La Pomada', p: 13, d: { es: 'Gin Xoriguer (Menorca) con limón premium', en: 'Xoriguer gin (Menorca) with premium lemon' }, tint: 'lemon' },
    { n: 'Melón & Albahaca', p: 13, d: { es: 'Ampersand Melon, tónica india y albahaca', en: 'Ampersand Melon gin, Indian tonic and basil' }, tint: 'green' },
    { n: 'The Smoke Ginger', p: 20, d: { es: 'Gin Mare, ginger beer Fever-Tree, menta y jengibre ahumado', en: 'Gin Mare, Fever-Tree ginger beer, mint and smoked ginger' }, tint: 'amber' },
    { n: 'The Black Forest', p: 16, d: { es: 'Monkey 47 con tónica india', en: 'Monkey 47 with Indian tonic' }, tint: 'clear' },
    { n: 'The Gold Gin', p: 16, d: { es: 'Gold Grail Gin, tónica mediterránea y oro', en: 'Gold Grail gin, Mediterranean tonic and gold' }, tint: 'gold' },
    { n: 'Pura Cepa Spritz', p: 12, d: { es: 'Licor de naranja Canonita, prosecco rosé y tónica de pomelo', en: 'Canonita orange liqueur, pink prosecco and grapefruit tonic' }, tint: 'orange' }
  ];
  var ZERO = [
    { n: 'Undone 0,0', o: 'Alemania', p: 13 },
    { n: 'Tanqueray 0,0', o: 'Inglaterra', p: 12 },
    { n: 'Whitley Neill Raspberry 0,0', o: 'Inglaterra', p: 12 },
    { n: 'Whitley Neill Rhubarb & Ginger 0,0', o: 'Inglaterra', p: 12 }
  ];

  /* Country blocks: "Name|origin|price" separated by ";". */
  var GC = {
    es: { es: 'España', en: 'Spain', l: "Martes Santo Flor de Iris|Huelva|12;Martes Santo Frutos Rojos|Huelva|12;Martes Santo Organic|Huelva|12;Master's Gin||12;Master's Pink||12;Master's Green Apple||12;Newberry Gin|Albolote, Granada|12;Bridge|Barcelona|12;Nordes|Galicia|12;Ñ Elite Premium|Córdoba|13;Obsession Classic|Sevilla|12;Obsession Orange|Sevilla|12;Obsession Purple|Sevilla|12;Obsession Red|Sevilla|12;Rives Orange|El Puerto de Santa María|12;Rives Pink|El Puerto de Santa María|12;Rives Sloe Gin|El Puerto de Santa María|12;Rives 1880|El Puerto de Santa María|12;Rives Exotica Berry & Cinnamon|Cádiz|12;Rives Tridestilada|El Puerto de Santa María|13;119 Gin|Benicasim|12;1890 Exotica Mora y Canela|Sevilla|12;Alambique Mandarina|Cádiz|13;Platu|Galicia|12;Cannagin|Córdoba|12;Rigo 1947 Fresa|Sevilla|12;Rigo 1947 Naranja|Sevilla|12;Blue Bottle|Navarra|13;Santamanía Leyenda Urbana|Madrid|13;Bruni Atarfe|Granada|13;Santamanía Reserva|Madrid|13;Carmela Guayaba|Gran Canaria|12;Seven Deadly Sins|Valencia|13;Oceánica|Galicia|12;Siderit Gingerlime|Cantabria|13;Oceánica Strawberry|Galicia|12;Siderit Hibiscus|Cantabria|13;Colinas Melon|Cartagena, Murcia|12;Siderit Original|Cantabria|13;Cool|Granada|12;Siderit Reserve Juniper Cask|Cantabria|18;D'Stills Almond|Madrid|12;Siderit Reserve Rum Barrel|Cantabria|18;D'Stills Dry Gin|Madrid|12;Siderit Reserve Sherry Oak|Cantabria|18;D'Stills Orange|Madrid|12;Sikkim Bilberry|Murcia|13;D'Stills Strawberry|Madrid|12;Sikkim Fraise|Murcia|13;F de Formentera|Formentera|13;Sikkim Greenery|Murcia|13;Gin Ser del Sur|Sevilla|12;Sikkim Privée|Murcia|13;Gin 12/11 Gold Limited Edition|Granada|17;Simbuya Purple|Málaga|12;Gin 12/11|Granada|12;Simbuya|Málaga|13;Gin Bahía|Donostia|13;Status 21|Gran Canaria|12;Wint & Lila Strawberry||12;Gin Mare \"Capri\"||14;Wint & Lila||12;Gin Mare|Barcelona|13;Xoriguer|Menorca|12;25 Lolita's|Galicia|12;XQ Apple|Alcobendas, Madrid|13;Gin Raw|Barcelona|13;XQ Strawberry|Alcobendas, Madrid|13;Ginabelle|O Rosal, Galicia|13;Zayt|Jaén|13;Ginial Rosé||12;Burdon Dry Gin|El Puerto de Santa María|12;Ginial|Ciudad Real|12;Burdon Cerezas|El Puerto de Santa María|12;Gipsy Blu|El Puerto de Santa María|13;Burdon Hierbabuena|El Puerto de Santa María|12;Gipsy Gin|El Puerto de Santa María|13;Gin Harbour|Barcelona|13;Imagic Gin|Álava|12;Gin MG|Barcelona|12;In 33 F|Jerez|13;Gin MG Rosa|Barcelona|12;Le Tribute|Barcelona|14;Ampersand Arándanos Azules||12;Legend Numantium|Soria|13;Ampersand Fresas Dulces||12;Lola y Vera|Madrid|13;Ampersand Mango Chilli||12;M5|La Rioja|16;Ampersand Melon||12;Macaronesian Eternal Spring Pink|Tenerife|12;311||12;Wingy Dry Gin||12;Miña||12;Wingy Red Fruit Gin||12;Vetton Dry||13;Marsh|Sanlúcar de Barrameda|13;Vetton Pink||13" },
    en: { es: 'Inglaterra', en: 'England', l: "Beefeater 24|London|13;Pink 47|London|12;Beefeater Reserva|London|18;Pink Royal|London|13;Berkeley Square|London|12;Plymouth Sloe|London|13;Bloom|London|13;Plymouth Navy Strength|Plymouth|14;Bloom Fruit Vanilla|London|13;Plymouth|Plymouth|13;Bombay Citron Pressé||13;Ramsbury|Marlborough|13;Bombay Bramble|Cheshire|13;Star of Bombay|Cheshire|13;Bombay Sapphire|Cheshire|12;Sipsmith|London|14;Bombay Sunset|Cheshire|13;Tanqueray Lovage|London|14;Boodles|London|13;Tanqueray Malacca|London|14;Bowtie|Essex|13;Tanqueray Rangpur|London|13;Boxer Gin|London|13;Tanqueray Sevilla|London|13;Brecon Limited Special Edition||13;Tanqueray Ten|London|12;Brecon Special Reserve||12;The Botanicals|London|12;Brockmans|London|13;The King of Soho|London|13;Broker's Pink|London|12;The Tower Bridge|London|13;Broker's|London|12;Whitley Neill Aloe & Cucumber||13;Bulldog|London|12;Whitley Neill Blood Orange||13;BW Bayswater|London|13;Whitley Neill Elderflower||13;Ish London Dry Gin||13;Whitley Neill Handcrafted||13;Cubical Mango||13;Whitley Neill Lemongrass & Ginger||13;Cubical Ultrapremium||14;Whitley Neill Nettle||13;Cubical Kiss||13;Whitley Neill Pink Grapefruit||13;Fifty Pounds|London|12;Whitley Neill Rhubarb & Ginger||13;Garden Tiger|Cirencester|14;Geranium|London|12;William Chase Elegant|London|14;Greenall's Wildberry|London|12;Bosford Rosé||12;Greenall's|London|12;Mermaid Dry Gin||13;Hayman's Family Reserve|London|12;Hayman's London Dry Gin|London|12;Hayman's Old Tom|London|12;Hayman's Royal Dock Navy Strength|London|12;Hayman's Sloe Gin|London|12;Jinzu|London|12;Mermaid Zest Gin||13;London Nº1|London|12;London Nº3|London|13;Martin Miller's 9 Moons|London|18;Martin Miller's Summerful|London|13;Martin Miller's Winterful|London|13;Martin Miller's|London|12;Martin Miller's Westbourne|London|14;Mombasa Club|London|14;Mombasa Colonel's Reserve||15;Mombasa Lemon|London|12;Mombasa Strawberry|London|12;Whitley Neill Raspberry||13;Whitley Neill Blueberry||13;NB Gin||12;NB Navy Strength||13;Old English|West Midlands|13;Opihr Oriental Original|London|13;Opihr Oriental Europe|London|13;Opihr Oriental Arabian|London|13;Opihr Oriental Far East|London|13;Oxley|London|17" },
    fr: { es: 'Francia', en: 'France', l: "G'Vine Floraison|Cognac|13;Osmoz Dry|Jarnac-Champagne|12;Osmoz Citius|Jarnac-Champagne|13;Citadelle|Cognac|13;Citadelle Réserve|Cognac|15;Citadelle No Mistake Old Tom||18;Magellan|Cognac|13;Fair Juniper|París|13;Gold 999.9|Alsacia|13;Saffron Gin|Dijon|13;Blossom Dry Gin||13;Blossom Gran Reserva||13;Blossom Peach||13;Source Gin||12;Tangara||12;G'Vine Nouaison|Cognac|13;Diplôme Dry Gin|Dijon|13;Sorgin||14" },
    pt: { es: 'Portugal', en: 'Portugal', l: "Foxtale Dry Gin||13;Foxtale Citrus Gin||12;Foxtale Pink Gin||12;Gin 13||12;Lisboa||13;Sharish||13;Sharish Blue Magic||14;Adamvs||15;Adamvs Organic Signature Edition 2021||16" },
    de: { es: 'Alemania', en: 'Germany', l: "Monkey 47|Lossburg|16;Monkey 47 Sloe Gin|Lossburg|16;Monkey 47 Barrel Cut||47;North Sea Gin|Kampen|15;Ferdinand's|Saarburg|13;Ferdinand's Quince|Saarburg|14;The Duke|Múnich|14;Amato||12;Kiesel||14;Elephant Gin|Hamburgo|14" },
    it: { es: 'Italia', en: 'Italy', l: "Gin del Professore Monsieur|Asti|13;Gin del Professore Madame|Asti|13;Malfy Originale|Moncalieri|13;Malfy Limone|Moncalieri|13;Malfy Arancia|Moncalieri|13;Malfy Rosa|Moncalieri|13;VI Hills Italian Dry Gin||12;Aqualvce||14;Villa Ascenti|Turín|13;Kapriol Dry Gin||14;Kapriol Old Tom||14;Kapriol Sloe Gin||12;Ginarte|Apeninos|13;Luxardo|Zara|13;Simple Gin||13;David|Toscana|16" },
    nl: { es: 'Países Bajos', en: 'Netherlands', l: "Black Tomato||16;Ketel 1||13;Skully Oriental Citrus||13;Skully Tangerina||13;Skully Wasabi|Berkel-Enschot|13;Sloane's|Zevenaar|14;Voortrekker|Zevenaar|13;Wenneker Elderflower||12;Wenneker Let the Story Begin||14;Wenneker Original||12;Wenneker Oude Proever||12;Wenneker Zeer Oude||13;Zeeland||12" },
    us: { es: 'EE. UU.', en: 'USA', l: "Aviation|Oregón|15;Farmer's Organic|Nueva York|13;Bluecoat American Dry Gin|Filadelfia|12;Seagram's|Nueva York|12;Nº 209|California|14" },
    be: { es: 'Bélgica', en: 'Belgium', l: "Marula||13;Butcher Meat Gin||14;Marula Pomegranate||13;Filliers 28 Dry Gin|Deinze|14;Filliers Pine Blossom|Deinze|14;Gaugin Beach||14;Gaugin Classic||14;Gaugin Mountain||14" },
    jp: { es: 'Japón', en: 'Japan', l: "135 East Hyogo Dry Gin||14;Roku Gin|Osaka|12;Kokoro||12;Nikka Coffey|Tokio|14;Okinawa|Okinawa|22;Ki No Bi|Kioto|16;Ki No Tea|Kioto|18;Ki No Tou|Kioto|18;Ki No Bi Sei|Kioto|18" },
    fi: { es: 'Finlandia', en: 'Finland', l: "Napue|Isokyrö|14;Koskue|Isokyrö|14;Kalevala||12;Kalevala Blue Label||13" },
    sc: { es: 'Escocia', en: 'Scotland', l: "Isle of Colonsay||13;Edinburgh Gin|Edimburgo|13;Edinburgh Seaside Gin|Edimburgo|13;Boë|Edimburgo|13;Boë Violet|Edimburgo|13;Hendrick's|Girvan|13;Hendrick's Lunar|Girvan|14;Hendrick's Midsummer Solstice||13;The Botanist|Islay|13" },
    no: { es: 'Noruega', en: 'Norway', l: "Kimerud||15;Kimerud Botanicals||15;Kimerud Pink||15" },
    ie: { es: 'Irlanda', en: 'Ireland', l: "Dingle|Kerry|14" },
    dk: { es: 'Dinamarca', en: 'Denmark', l: "Copenhagen Dry||13;Copenhagen Oak||15;Copenhagen Orange||13" },
    mx: { es: 'México', en: 'Mexico', l: "Veracruz||13" },
    at: { es: 'Austria', en: 'Austria', l: "Blue Austrian Vintage||13" },
    ve: { es: 'Venezuela', en: 'Venezuela', l: "Canaima||14" },
    au: { es: 'Australia', en: 'Australia', l: "Lark's Tasmanian \"Godfather\"|Tasmania|14" },
    ec: { es: 'Ecuador', en: 'Ecuador', l: "Gin Crespo|Los Andes|13" }
  };

  var G = [];
  Object.keys(GC).forEach(function (k) {
    GC[k].l.split(';').forEach(function (row) {
      var a = row.split('|');
      G.push({ n: a[0], o: a[1], p: +a[2], c: k });
    });
  });

  /* Allergen keys as on the carta: gl gluten, pe pescado, hu huevo, la lactosa, fs frutos secos, so soja, su sulfitos. */
  var AL = {
    gl: { es: 'Gluten', en: 'Gluten' },
    pe: { es: 'Pescado', en: 'Fish' },
    hu: { es: 'Huevo', en: 'Egg' },
    la: { es: 'Lactosa', en: 'Lactose' },
    fs: { es: 'Frutos secos', en: 'Nuts' },
    so: { es: 'Soja', en: 'Soy' },
    su: { es: 'Sulfitos', en: 'Sulphites' }
  };

  /* Tapas y raciones: tp tapa price, rp ración price, a allergens. */
  var TAPAS = [
    { id: 'jamon', es: 'Jamón ibérico de bellota con tosta de tomate', en: 'Acorn-fed Iberian ham with tomato toast', tp: 13, rp: 24, a: ['gl'] },
    { id: 'caviar', es: 'Caviar tradicional Río Frío (15 g)', en: 'Traditional Río Frío caviar (15 g)', rp: 45, a: ['pe'] },
    { id: 'ostra', es: 'Ostra francesa (1 ud.)', en: 'French oyster (1 pc)', tp: 5, a: ['pe'] },
    { id: 'anchoas', es: 'Anchoas del Cantábrico con tomate y aceite de oliva (6 uds.)', en: 'Cantabrian anchovies with tomato and olive oil (6 pcs)', rp: 16.5, a: ['pe'] },
    { id: 'gilda', es: 'Gilda de anchoa o sardina ahumada (1 ud.)', en: 'Gilda of anchovy or smoked sardine (1 pc)', tp: 3.5, a: ['pe'] },
    { id: 'sardina', es: 'Tosta de sardina ahumada con tomate y fresa (1 ud.)', en: 'Smoked sardine toast with tomato and strawberry (1 pc)', tp: 3.5, a: ['pe', 'gl'] },
    { id: 'banderilla', es: 'Banderilla de atún rojo y queso (1 ud.)', en: 'Bluefin tuna and cheese skewer (1 pc)', tp: 2.5, a: ['pe', 'la'] },
    { id: 'lomo', es: 'Tapa de lomo, salchichón o chorizo ibérico de bellota', en: 'Acorn-fed Iberian loin, salchichón or chorizo', tp: 9.5, a: [] },
    { id: 'manchego', es: 'Queso manchego', en: 'Manchego cheese', tp: 6.9, rp: 10.5, a: ['la'] },
    { id: 'tabla', es: 'Tabla ibérica de bellota con tosta de pan y tomate', en: 'Acorn-fed Iberian board with tomato toast', rp: 32, a: [] },
    { id: 'cecina', es: 'Cecina de wagyu con tosta de pan y tomate', en: 'Cured wagyu cecina with tomato toast', rp: 16.5, a: ['gl'] },
    { id: 'rabo', es: 'Croquetas de rabo de toro', en: 'Oxtail croquettes', tp: 6.9, rp: 10.5, a: ['hu', 'gl', 'la'], u: { es: '4 / 6 uds.', en: '4 / 6 pcs' } },
    { id: 'croq', es: 'Croquetas de pollo y jamón', en: 'Chicken and ham croquettes', tp: 6.9, rp: 10.5, a: ['hu', 'gl', 'la'], u: { es: '4 / 6 uds.', en: '4 / 6 pcs' } },
    { id: 'ensaladilla', es: 'Ensaladilla rusa con ventresca de atún', en: 'Russian salad with tuna belly', tp: 8.9, a: ['pe', 'su', 'hu'] },
    { id: 'mojama', es: 'Mojama de atún rojo con almendras', en: 'Cured bluefin tuna (mojama) with almonds', tp: 5.9, rp: 9.9, a: ['pe', 'fs'] },
    { id: 'salmon', es: 'Salmón ahumado noruego con salsa tártara y grisines', en: 'Norwegian smoked salmon with tartare sauce and breadsticks', rp: 17.5, a: ['pe', 'gl'] },
    { id: 'carpaccio', es: 'Carpaccio de buey gallego con queso manchego', en: 'Galician beef carpaccio with Manchego', rp: 16.5, a: ['la'] },
    { id: 'palitos', es: 'Palitos de pollo caseros', en: 'Homemade chicken strips', rp: 13.5, a: ['gl'] },
    { id: 'esparragos', es: 'Espárragos trigueros', en: 'Green asparagus', tp: 10.5, a: [] },
    { id: 'padron', es: 'Pimientos de Padrón', en: 'Fried Padrón peppers', tp: 6.9, a: [] },
    { id: 'torreznos', es: 'Torreznos de Mijas', en: 'Torreznos from Mijas (crispy pork belly)', tp: 8.5, a: [] }
  ];
  var DULCES = [
    { id: 'choco', es: 'Tarta cremosa de chocolate', en: 'Creamy chocolate cake', rp: 8.9, a: ['hu', 'la'] },
    { id: 'tartaqueso', es: 'Tarta de queso manchego con coulis de frutos rojos', en: 'Manchego cheesecake with red-fruit coulis', rp: 8.9, a: ['hu', 'su', 'la'] }
  ];
  /* International cheeses: name, country, milk, ageing (as printed). */
  var QUESOS = [
    ['Manchego', 'es', 'oveja', '8 meses|8 months'],
    ['Taleggio', 'it', 'vaca', '40 días|40 days'],
    ['Munster Fermier', 'fr', 'vaca', '2–3 meses|2–3 months'],
    ["L'Etivaz AOC", 'ch', 'vaca', '5–13 meses|5–13 months'],
    ['Mahón DOP Curado', 'es', 'vaca', '6–8 meses|6–8 months'],
    ["Comté d'Estive", 'fr', 'vaca', '28 meses|28 months'],
    ['Brillat-Savarin Fermier', 'fr', 'vaca', '1 mes|1 month'],
    ['Majorero Curado DOP', 'es', 'cabra', '3 meses|3 months'],
    ['Gouda de granja', 'nl', 'vaca', '48 meses|48 months'],
    ['Ocaña', 'es', 'cabra y oveja', '8 meses|8 months'],
    ['Époisses au Marc', 'fr', 'vaca', '40 días|40 days'],
    ['Rufino', 'es', 'cabra', '2 meses|2 months'],
    ['San Simón da Costa DOP', 'es', 'vaca', '45–60 días|45–60 days'],
    ['Pecorino trufado', 'it', 'oveja', '5 meses|5 months'],
    ['Cheddar West Country DOP', 'gb', 'vaca', '20 meses|20 months'],
    ['Blue 61', 'it', 'vaca', '3 meses|3 months'],
    ['Stilton', 'gb', 'vaca', '12 meses|12 months'],
    ['Cashel Blue', 'ie', 'vaca', '105 días|105 days']
  ];
  var PAIS = { es: ['España', 'Spain'], it: ['Italia', 'Italy'], fr: ['Francia', 'France'], ch: ['Suiza', 'Switzerland'], nl: ['Países Bajos', 'Netherlands'], gb: ['Inglaterra', 'England'], ie: ['Irlanda', 'Ireland'] };
  var LECHE = { 'oveja': 'Sheep', 'vaca': 'Cow', 'cabra': 'Goat', 'cabra y oveja': 'Goat & sheep' };

  /* Pairing wheel: segments (styles) and, for each tapa, the suggested segment and wines (by exact name in W).
     General sommelier guidance written for the demo. */
  var SEG = [
    { k: 'fino', es: 'Fino y manzanilla', en: 'Fino & manzanilla', c: '#e9dc9c' },
    { k: 'oxid', es: 'Amontillado y oloroso', en: 'Amontillado & oloroso', c: '#a85d26' },
    { k: 'blanco', es: 'Blanco fresco', en: 'Crisp white', c: '#ece2a2' },
    { k: 'blancob', es: 'Blanco con barrica', en: 'Oaked white', c: '#e2c56c' },
    { k: 'burb', es: 'Burbujas', en: 'Bubbles', c: '#f3e7b8' },
    { k: 'rosado', es: 'Rosado', en: 'Rosé', c: '#e9998a' },
    { k: 'tinto', es: 'Tinto joven', en: 'Young red', c: '#8e2236' },
    { k: 'tintog', es: 'Tinto de guarda', en: 'Age-worthy red', c: '#5a1222' },
    { k: 'dulce', es: 'Dulce y fortificado', en: 'Sweet & fortified', c: '#5b2810' }
  ];
  var PAIR = {
    jamon: { k: 'fino', w: ['Manzanilla Maruja', 'Fino El Puerto', 'Amontillado Gutiérrez Colosía'], es: 'La sal y la grasa del ibérico piden la punzada seca de un vino bajo flor.', en: 'The salt and fat of Iberian ham call for the dry bite of a flor-aged wine.' },
    caviar: { k: 'burb', w: ['Jean de Burigny', 'Barons de Rothschild Blanc de Blancs', 'Bocchoris Brut Nature'], es: 'Burbuja fina y acidez para limpiar el paladar entre perla y perla.', en: 'Fine bubbles and acidity to reset the palate between pearls.' },
    ostra: { k: 'burb', w: ['Barons de Rothschild Blanc de Blancs', 'Jean de Burigny', 'Manzanilla Papirusa'], es: 'Yodo y burbuja: el clásico que nunca falla.', en: 'Brine and bubbles: the classic that never fails.' },
    anchoas: { k: 'fino', w: ['Manzanilla Papirusa', 'Manzanilla Maruja', 'Blanquito'], es: 'Salinidad con salinidad: la manzanilla alarga el sabor del Cantábrico.', en: 'Salt meets salt: manzanilla stretches the taste of the Cantabrian sea.' },
    gilda: { k: 'fino', w: ['Manzanilla Maruja', 'Vermut Lustau Blanco', 'Fino El Puerto'], es: 'Picante, vinagre y anchoa: un generoso seco o un vermut blanco.', en: 'Chilli, vinegar and anchovy: a dry sherry or a white vermouth.' },
    sardina: { k: 'blanco', w: ['Blanquito', 'As Glorias', 'Cloe Rosé'], es: 'El ahumado y la fresa se llevan bien con un blanco atlántico.', en: 'Smoke and strawberry sit well with an Atlantic white.' },
    banderilla: { k: 'blanco', w: ['El Paraguas', 'Blanquito', 'Fino El Puerto'], es: 'Atún y queso: frescura y algo de textura.', en: 'Tuna and cheese: freshness with a little texture.' },
    lomo: { k: 'tinto', w: ['Viña María Luisa', 'La Mateo', 'Amontillado Gutiérrez Colosía'], es: 'Embutido ibérico y un tinto de fruta, o un amontillado para los curiosos.', en: 'Iberian charcuterie with a fruity red, or an amontillado for the curious.' },
    manchego: { k: 'oxid', w: ['Oloroso Gutiérrez Colosía', 'Alonso del Yerro', 'Paydos'], es: 'Queso curado y oloroso: nuez con nuez.', en: 'Aged cheese and oloroso: nut meets nut.' },
    tabla: { k: 'fino', w: ['Manzanilla Maruja', 'Amontillado Piñero V.O.R.S.', 'Conde de los Andes 2017'], es: 'Una tabla para compartir: empieza con manzanilla y termina con un Rioja de guarda.', en: 'A board to share: start with manzanilla, finish with an aged Rioja.' },
    cecina: { k: 'tintog', w: ['Paydos', 'Numanthia', 'Alonso del Yerro'], es: 'Carne curada intensa, tinto con cuerpo de Toro o Ribera.', en: 'Intense cured beef wants a full red from Toro or Ribera.' },
    rabo: { k: 'tintog', w: ['Alonso del Yerro', 'Cosme Palacio Reserva Viñedos Viejos', 'Caníbal Tinto'], es: 'El guiso de rabo pide taninos y fruta negra.', en: 'Braised oxtail asks for tannin and dark fruit.' },
    croq: { k: 'burb', w: ['Bocchoris Brut Nature', 'Fino El Puerto', 'Honeymoon'], es: 'Fritura cremosa: la burbuja corta y refresca.', en: 'Creamy and fried: bubbles cut through and refresh.' },
    ensaladilla: { k: 'fino', w: ['Manzanilla Papirusa', 'Bocchoris Brut Nature', '40 Vendimias Sauvignon Blanc'], es: 'Mayonesa y ventresca, una manzanilla bien fría.', en: 'Mayonnaise and tuna belly with an ice-cold manzanilla.' },
    mojama: { k: 'oxid', w: ['Amontillado Gutiérrez Colosía', 'Palo Cortado Great Duke', 'Fino El Puerto'], es: 'Mojama y almendra: el amontillado repite la nota tostada.', en: 'Mojama and almonds: amontillado echoes the toasted note.' },
    salmon: { k: 'blanco', w: ['Markiss', '40 Vendimias Sauvignon Blanc', 'Prosecco Rosé'], es: 'Ahumado y salsa tártara: un sauvignon con nervio.', en: 'Smoke and tartare sauce: a zesty sauvignon.' },
    carpaccio: { k: 'tinto', w: ['Bassus', 'Flor de Malvajío', 'Cloe Rosé'], es: 'Carne cruda y manchego: tinto ligero, casi un pinot.', en: 'Raw beef and Manchego: a light red, ideally pinot.' },
    palitos: { k: 'rosado', w: ['Marmellans', 'Cloe Rosé', 'Prosecco'], es: 'Rebozado casero y un rosado fresco.', en: 'Homemade crumb with a fresh rosé.' },
    esparragos: { k: 'blanco', w: ['40 Vendimias Sauvignon Blanc', 'Markiss', 'Manzanilla Papirusa'], es: 'El espárrago es difícil: sauvignon blanc o manzanilla.', en: 'Asparagus is tricky: sauvignon blanc or manzanilla.' },
    padron: { k: 'blanco', w: ['Blanquito', 'El Aeronauta', 'Fino El Puerto'], es: 'Unos pican y otros no: un blanco gallego, como manda la tradición.', en: 'Some are hot, some are not: a Galician white, as tradition says.' },
    torreznos: { k: 'tinto', w: ['Flor de Malvajío', 'Claus', 'MMM Machomann'], es: 'Crujiente y graso: tinto joven de Mijas.', en: 'Crunchy and rich: a young red from Mijas.' },
    quesos: { k: 'dulce', w: ['Niepoort Ruby', 'Pedro Ximénez Gutiérrez Colosía', 'Grand Tokaji Edes Szamorodni 2018'], es: 'Azules como Stilton o Cashel Blue: oporto o un PX.', en: 'Blues like Stilton or Cashel Blue: port or a PX.' },
    choco: { k: 'dulce', w: ['Pedro Ximénez Don PX 2002', 'Niepoort Ruby', 'Quinta do Crasto LBV'], es: 'Chocolate y PX: higo, cacao y café.', en: 'Chocolate and PX: fig, cocoa and coffee.' },
    tartaqueso: { k: 'dulce', w: ['Moscatel Señorío de Broches', 'Oremus Vega Sicilia 5 Puttonyos 2014', 'BF Maestro'], es: 'Queso y frutos rojos con un moscatel malagueño.', en: 'Cheese and red fruit with a Málaga moscatel.' }
  };

  /* Agenda: the daily tasting is real (carta). Everything else is an example and is labelled as such. */
  var EVENTS_WEEKLY = [
    { dow: 4, h: '20:30', es: 'Noche de generosos', en: 'Sherry night', d: { es: 'Fino, amontillado y oloroso en vertical.', en: 'Fino, amontillado and oloroso side by side.' } },
    { dow: 6, h: '21:30', es: 'Música en directo', en: 'Live music', d: { es: 'Acústico en la barra.', en: 'Acoustic set by the bar.' } },
    { dow: 0, h: '18:00', es: 'Gin & tonic de temporada', en: 'Seasonal gin & tonic', d: { es: 'Una ginebra invitada y su tónica.', en: 'A guest gin and its tonic.' } }
  ];

  window.PC = { S: S, T: T, Z: Z, W: W, SIG: SIG, ZERO: ZERO, GC: GC, G: G, AL: AL, TAPAS: TAPAS, DULCES: DULCES, QUESOS: QUESOS, PAIS: PAIS, LECHE: LECHE, SEG: SEG, PAIR: PAIR, EVENTS_WEEKLY: EVENTS_WEEKLY };
})();
