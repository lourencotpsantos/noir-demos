/* Hammam Almanzor price list, transcribed from the four price-list images on
   hammamalmanzor.com/tarifas-hammam-y-estetica/ (read 19 Nov 2026, undated).
   p = price in euros; from = "desde"; ask = "Consultar"; min = duration in minutes when published. */
window.HA_DATA = {
  phone: '34625446175',
  email: 'info@hammamalmanzor.com',
  cats: [
    { id: 'hammam', es: 'Hammam', en: 'Hammam',
      note: { es: 'Baño árabe de vapor: enjabonado, exfoliación y masaje. Incluye aromaterapia, musicoterapia, jabón beldi, toalla, zapatillas, guante tradicional de un solo uso y té árabe con hierbas aromáticas.', en: 'Arab steam bath: soaping, exfoliation and massage. Includes aromatherapy, music therapy, Beldi soap, towel, slippers, a single-use traditional glove and Arab tea with aromatic herbs.' },
      groups: [
        { es: 'Hammam', en: 'Hammam', items: [
          { id: 'h1', es: 'Individual', en: 'Single', p: 80, min: 60 },
          { id: 'h2', es: 'Pareja', en: 'Couple', p: 155, min: 60 } ] },
        { es: 'Hammam con tratamiento corporal (exfoliación + mascarilla reafirmante + crema corporal)', en: 'Hammam with body treatment (exfoliation + firming mask + body cream)', items: [
          { id: 'b1', es: 'Chocolate de leche', en: 'Milk chocolate', p: 90 },
          { id: 'b2', es: 'Canela', en: 'Cinnamon', p: 90 },
          { id: 'b3', es: 'Yogur con miel', en: 'Yoghurt with honey', p: 90 },
          { id: 'b4', es: 'Café con aceite de argán', en: 'Coffee with argan oil', p: 90 } ] } ] },
    { id: 'masaje', es: 'Masajes', en: 'Massage',
      groups: [
        { es: '60 minutos', en: '60 minutes', items: [
          { id: 'm1', es: 'Relajante', en: 'Relaxing', short: { es: 'Masaje relajante', en: 'Relaxing massage' }, p: 65, min: 60 },
          { id: 'm2', es: 'Masaje muscular (deep tissue)', en: 'Deep tissue', short: { es: 'Masaje muscular', en: 'Deep tissue massage' }, p: 65, min: 60 },
          { id: 'm3', es: 'Terapéutico o anticelulítico', en: 'Therapeutic or slimming', p: 65, min: 60 },
          { id: 'm4', es: 'Deportivo', en: 'Sports', p: 65, min: 60 },
          { id: 'm5', es: 'Pindas herbales', en: 'Herbal pindas', p: 65, min: 60 } ] },
        { es: '45 minutos', en: '45 minutes', items: [
          { id: 'm6', es: 'Reflexología podal', en: 'Foot reflexology', p: 60, min: 45 } ] },
        { es: '30 minutos', en: '30 minutes', items: [
          { id: 'm7', es: 'Masaje craneal hindú', en: 'Indian head massage', p: 40, min: 30 },
          { id: 'm8', es: 'Facial y hombros', en: 'Face and shoulders', short: { es: 'Masaje facial y hombros', en: 'Face and shoulder massage' }, p: 40, min: 30 },
          { id: 'm9', es: 'Terapéutico o anticelulítico', en: 'Therapeutic or slimming', p: 40, min: 30 },
          { id: 'm10', es: 'Pindas herbales', en: 'Herbal pindas', p: 40, min: 30 } ] } ] },
    { id: 'facial', es: 'Facial', en: 'Facials',
      groups: [
        { es: 'Tratamiento facial', en: 'Facial treatment', items: [
          { id: 'f1', es: 'Limpieza de cutis (forma de cejas, vapor, alta frecuencia, masaje facial y hombros)', en: 'Skin cleansing (brow shaping, steam, high frequency, face and shoulder massage)', short: { es: 'Limpieza de cutis', en: 'Skin cleansing' }, p: 65 },
          { id: 'f2', es: 'Lifting japonés', en: 'Japanese lifting', p: 80 },
          { id: 'f3', es: 'Dermapen', en: 'Dermapen', p: 90 } ] } ] },
    { id: 'manos', es: 'Manos y pies', en: 'Hands & feet',
      groups: [
        { es: 'Manicura', en: 'Manicure', items: [
          { id: 'n1', es: 'Manicura', en: 'Manicure', p: 15 },
          { id: 'n2', es: 'Esmaltado permanente (Shellac)', en: 'Permanent colour (Shellac)', p: 15 },
          { id: 'n3', es: 'Quitar esmalte permanente + manicura', en: 'Remove permanent colour + manicure', p: 20 },
          { id: 'n4', es: 'Maquillar', en: 'Varnish', p: 6 },
          { id: 'n5', es: 'Limar y maquillar', en: 'File and varnish', p: 12 },
          { id: 'n6', es: 'Tratamiento de parafina, manos', en: 'Paraffin treatment, hands', p: 15 } ] },
        { es: 'Pedicura', en: 'Pedicure', items: [
          { id: 'p1', es: 'Pedicura (peeling + masaje)', en: 'Pedicure (peeling + massage)', p: 35 },
          { id: 'p2', es: 'Color permanente (Shellac)', en: 'Permanent colour (Shellac)', p: 17 },
          { id: 'p3', es: 'Tratamiento de parafina, pies', en: 'Paraffin treatment, feet', p: 20 } ] } ] },
    { id: 'depila', es: 'Depilación', en: 'Hair removal',
      groups: [
        { es: 'Al hilo', en: 'Threading', items: [
          { id: 'd1', es: 'Cejas', en: 'Eyebrows', p: 15 },
          { id: 'd2', es: 'Labio', en: 'Lip', p: 10 },
          { id: 'd3', es: 'Labios y barbilla', en: 'Lips and chin', p: 10 },
          { id: 'd4', es: 'Axilas', en: 'Underarms', p: 15 },
          { id: 'd5', es: 'Cara', en: 'Face', p: 25 } ] },
        { es: 'Con cera', en: 'Waxing', items: [
          { id: 'w1', es: 'Piernas enteras', en: 'Full legs', p: 27 },
          { id: 'w2', es: 'Medias piernas', en: 'Half legs', p: 18 },
          { id: 'w3', es: 'Ingles', en: 'Basic bikini', p: 16 },
          { id: 'w4', es: 'Ingles completas', en: 'Full bikini', p: 25, from: true },
          { id: 'w5', es: 'Brazos', en: 'Arms', p: 15 },
          { id: 'w6', es: 'Glúteos', en: 'Gluteus', p: 10 },
          { id: 'w7', es: 'Facial', en: 'Face', p: 20 },
          { id: 'w8', es: 'Labio superior + barbilla', en: 'Upper lip + chin', p: 10 },
          { id: 'w9', es: 'Espalda', en: 'Back', p: 25 },
          { id: 'w10', es: 'Pecho', en: 'Chest', p: 25 },
          { id: 'w11', es: 'Axilas', en: 'Underarms', p: 10 },
          { id: 'w12', es: 'Cejas', en: 'Eyebrows', p: 10 } ] } ] },
    { id: 'maquillaje', es: 'Maquillaje', en: 'Make-up',
      groups: [
        { es: 'Maquillaje, cejas y pestañas', en: 'Make-up, brows and lashes', items: [
          { id: 'k1', es: 'Maquillaje', en: 'Make-up', p: 30, from: true },
          { id: 'k2', es: 'Maquillaje de novia y prueba', en: 'Bridal make-up and trial', p: 70, from: true },
          { id: 'k3', es: 'Tinte de cejas o pestañas', en: 'Eyebrow or eyelash tint', p: 15 },
          { id: 'k4', es: 'Extensiones de pestañas', en: 'Eyelash extensions', p: 60, from: true },
          { id: 'k5', es: 'Microblading', en: 'Microblading', p: 200 } ] } ] },
    { id: 'pelo', es: 'Peluquería', en: 'Hair',
      groups: [
        { es: 'Tratamientos capilares', en: 'Hair treatments', items: [
          { id: 'c1', es: 'Vapor + aceites esenciales + masaje de cabeza', en: 'Steam + essential oils + head massage', p: 70 },
          { id: 'c2', es: 'Alisado de queratina', en: 'Keratin straightening', p: 130, from: true } ] },
        { es: 'Corte', en: 'Haircut', items: [
          { id: 'c3', es: 'Señora', en: 'Ladies', p: 15 },
          { id: 'c4', es: 'Lavado + corte caballero', en: 'Wash + men’s cut', p: 15 },
          { id: 'c5', es: 'Niño', en: 'Kids', p: 12 },
          { id: 'c6', es: 'Espuma, gel o cera', en: 'Foam, gel or wax', p: 3 },
          { id: 'c7', es: 'Servicio lavacabeza', en: 'Hair wash', p: 5 } ] },
        { es: 'Peinado', en: 'Blow-dry & styling', items: [
          { id: 'c8', es: 'Corto', en: 'Short', p: 15 },
          { id: 'c9', es: 'Medio', en: 'Medium', p: 18 },
          { id: 'c10', es: 'Largo', en: 'Long', p: 25, from: true },
          { id: 'c11', es: 'Ondulado o rizado', en: 'Wavy or curly', p: 25, from: true },
          { id: 'c12', es: 'Peinado de novia', en: 'Bridal hairstyle', p: 70, from: true },
          { id: 'c13', es: 'Recogido', en: 'Hair up', ask: true } ] },
        { es: 'Color', en: 'Colour', items: [
          { id: 'c14', es: 'Pelo corto', en: 'Short hair', p: 25 },
          { id: 'c15', es: 'Pelo medio', en: 'Medium hair', p: 30 },
          { id: 'c16', es: 'Pelo largo', en: 'Long hair', p: 30, from: true },
          { id: 'c17', es: 'Raíces', en: 'Roots', p: 30 } ] },
        { es: 'Mechas', en: 'Highlights', items: [
          { id: 'c18', es: 'Corto', en: 'Short', p: 45 },
          { id: 'c19', es: 'Medio', en: 'Medium', p: 50, from: true },
          { id: 'c20', es: 'Largo', en: 'Long', p: 60, from: true } ] } ] }
  ],
  /* builder add-ons (subset of the list above) */
  addons: ['m1', 'm2', 'm6', 'm7', 'm8', 'f1', 'f2', 'p1', 'n2']
};
