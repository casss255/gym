/* ---------- Food data ----------
   k = [kcal, protein g, carbs g, fat g] per 100 g (cooked unless noted; oats and whey are dry).
   c = food group (decides diet fit), a = allergens, u = household unit used for display,
   m = most grams that make sense in one meal (keeps portions realistic for very large targets). */
const ING = {
  chicken_breast: { n: ['Chicken breast', 'Dada ayam'], k: [165, 31, 0, 3.6], c: 'meat', m: 300 },
  chicken_thigh: { n: ['Chicken thigh (skinless)', 'Paha ayam (tanpa kulit)'], k: [209, 26, 0, 10.9], c: 'meat', m: 300 },
  beef_lean: { n: ['Lean beef', 'Daging sapi tanpa lemak'], k: [217, 26, 0, 12], c: 'meat', m: 280 },
  egg: { n: ['Egg', 'Telur'], k: [155, 12.6, 1.1, 10.6], c: 'egg', a: ['egg'], u: { g: 50, en: ['egg', 'eggs'], id: ['butir', 'butir'] }, m: 200 },
  egg_white: { n: ['Egg white', 'Putih telur'], k: [52, 10.9, 0.7, 0.2], c: 'egg', a: ['egg'], u: { g: 33, en: ['egg white', 'egg whites'], id: ['putih telur', 'putih telur'] }, m: 165 },
  salmon: { n: ['Salmon', 'Salmon'], k: [206, 22, 0, 12], c: 'fish', a: ['fish'], m: 250 },
  tuna: { n: ['Canned tuna (in water)', 'Tuna kaleng (dalam air)'], k: [116, 26, 0, 0.8], c: 'fish', a: ['fish'], m: 200 },
  white_fish: { n: ['White fish (tilapia or cod)', 'Ikan putih (nila atau kakap)'], k: [128, 26, 0, 2.7], c: 'fish', a: ['fish'], m: 280 },
  shrimp: { n: ['Shrimp', 'Udang'], k: [99, 24, 0.2, 0.3], c: 'shell', a: ['shellfish'], m: 250 },
  tempeh: { n: ['Tempeh', 'Tempe'], k: [192, 20.3, 7.6, 10.8], c: 'plant', a: ['soy'], m: 220 },
  tofu: { n: ['Firm tofu', 'Tahu'], k: [144, 17.3, 2.8, 8.7], c: 'plant', a: ['soy'], m: 320 },
  greek_yogurt: { n: ['Greek yogurt (plain, low-fat)', 'Yogurt Yunani (plain, rendah lemak)'], k: [59, 10.2, 3.6, 0.4], c: 'dairy', a: ['dairy'], m: 350 },
  cottage: { n: ['Cottage cheese', 'Keju cottage'], k: [72, 12.4, 2.7, 1], c: 'dairy', a: ['dairy'], m: 300 },
  whey: { n: ['Whey protein powder', 'Protein whey bubuk'], k: [400, 80, 8, 6], c: 'dairy', a: ['dairy'], u: { g: 30, half: true, en: ['scoop', 'scoops'], id: ['sendok takar', 'sendok takar'] }, m: 60 },
  lentils: { n: ['Lentils', 'Lentil'], k: [116, 9, 20, 0.4], c: 'plant' },
  chickpeas: { n: ['Chickpeas', 'Kacang arab'], k: [164, 8.9, 27.4, 2.6], c: 'plant' },
  kidney_beans: { n: ['Kidney beans', 'Kacang merah'], k: [127, 8.7, 22.8, 0.5], c: 'plant' },
  edamame: { n: ['Edamame', 'Edamame'], k: [121, 11.9, 8.9, 5.2], c: 'plant', a: ['soy'] },
  milk: { n: ['Low-fat milk', 'Susu rendah lemak'], k: [50, 3.4, 4.8, 2], c: 'dairy', a: ['dairy'], m: 400 },
  soy_milk: { n: ['Soy milk (unsweetened)', 'Susu kedelai (tanpa gula)'], k: [33, 2.9, 1.7, 1.6], c: 'plant', a: ['soy'], m: 400 },
  rice_white: { n: ['White rice', 'Nasi putih'], k: [130, 2.7, 28.2, 0.3], c: 'plant' },
  rice_brown: { n: ['Brown rice', 'Nasi merah'], k: [123, 2.7, 25.6, 1], c: 'plant' },
  oats: { n: ['Rolled oats (dry)', 'Oat (kering)'], k: [389, 16.9, 66.3, 6.9], c: 'plant', a: ['gluten'], m: 100 },
  potato: { n: ['Potato (boiled)', 'Kentang rebus'], k: [87, 1.9, 20, 0.1], c: 'plant' },
  sweet_potato: { n: ['Sweet potato', 'Ubi jalar'], k: [90, 2, 20.7, 0.2], c: 'plant' },
  pasta: { n: ['Pasta', 'Pasta'], k: [158, 5.8, 30.9, 0.9], c: 'plant', a: ['gluten'] },
  bread: { n: ['Whole-wheat bread', 'Roti gandum'], k: [247, 13, 41, 3.4], c: 'plant', a: ['gluten'], u: { g: 30, en: ['slice', 'slices'], id: ['lembar', 'lembar'] }, m: 120 },
  rice_noodles: { n: ['Rice noodles (bihun)', 'Bihun'], k: [109, 0.9, 25, 0.2], c: 'plant' },
  quinoa: { n: ['Quinoa', 'Quinoa'], k: [120, 4.4, 21.3, 1.9], c: 'plant' },
  banana: { n: ['Banana', 'Pisang'], k: [89, 1.1, 22.8, 0.3], c: 'plant', u: { g: 110, half: true, en: ['banana', 'bananas'], id: ['buah', 'buah'] }, m: 220 },
  apple: { n: ['Apple', 'Apel'], k: [52, 0.3, 13.8, 0.2], c: 'plant', u: { g: 180, half: true, en: ['apple', 'apples'], id: ['buah', 'buah'] }, m: 360 },
  papaya: { n: ['Papaya', 'Pepaya'], k: [43, 0.5, 10.8, 0.3], c: 'plant' },
  mixed_berries: { n: ['Mixed berries', 'Beri campur'], k: [57, 0.7, 14.5, 0.3], c: 'plant' },
  broccoli: { n: ['Broccoli', 'Brokoli'], k: [35, 2.4, 7.2, 0.4], c: 'plant' },
  spinach: { n: ['Spinach', 'Bayam'], k: [23, 3, 3.8, 0.3], c: 'plant' },
  kangkung: { n: ['Water spinach (kangkung)', 'Kangkung'], k: [19, 2.6, 3.1, 0.2], c: 'plant' },
  cabbage: { n: ['Cabbage', 'Kol'], k: [25, 1.3, 5.8, 0.1], c: 'plant' },
  carrot: { n: ['Carrot', 'Wortel'], k: [35, 0.8, 8.2, 0.2], c: 'plant' },
  tomato: { n: ['Tomato', 'Tomat'], k: [18, 0.9, 3.9, 0.2], c: 'plant' },
  cucumber: { n: ['Cucumber', 'Timun'], k: [15, 0.7, 3.6, 0.1], c: 'plant' },
  green_beans: { n: ['Green beans', 'Buncis'], k: [35, 1.9, 7.9, 0.3], c: 'plant' },
  salad_greens: { n: ['Mixed salad leaves', 'Daun salad campur'], k: [17, 1.4, 2.9, 0.2], c: 'plant' },
  olive_oil: { n: ['Olive oil', 'Minyak zaitun'], k: [884, 0, 0, 100], c: 'plant', m: 25 },
  oil: { n: ['Cooking oil', 'Minyak goreng'], k: [884, 0, 0, 100], c: 'plant', m: 25 },
  peanut_butter: { n: ['Peanut butter', 'Selai kacang'], k: [588, 25, 20, 50], c: 'plant', a: ['nuts'], m: 40 },
  almonds: { n: ['Almonds', 'Almond'], k: [579, 21, 22, 50], c: 'plant', a: ['nuts'], m: 40 },
  avocado: { n: ['Avocado', 'Alpukat'], k: [160, 2, 8.5, 14.7], c: 'plant', m: 150 },
  chia: { n: ['Chia seeds', 'Biji chia'], k: [486, 16.5, 42, 31], c: 'plant', m: 30 },
};

/* Diet fit: a recipe needs the strictest level among its ingredients. */
const DIET_LEVEL = { plant: 0, egg: 1, dairy: 1, fish: 2, shell: 2, meat: 3 };
const DIET_RANK = { vegan: 0, veg: 1, pesc: 2, omni: 3 };

/* Component roles: P protein, C carb, F fat, V vegetable, O other (scaled, never adjusted). */
function rcp(id, slot, cuisine, name, comps, vegCore) {
  const parts = comps.map(([ing, g, role]) => ({ ing, g, role }));
  const level = Math.max(...parts.map(c => DIET_LEVEL[ING[c.ing].c]));
  const al = [...new Set(parts.flatMap(c => ING[c.ing].a || []))];
  return { id, slot, cuisine, n: name, comps: parts, diet: ['vegan', 'veg', 'pesc', 'omni'][level], al, vegCore: !!vegCore };
}

/* slot: b breakfast, m main (lunch or dinner), s snack. cuisine: id Indonesian-style, intl international. */
const RECIPES = [
  rcp('b_oats_whey', 'b', 'intl', ['Protein oats with banana', 'Oat protein dengan pisang'], [['oats', 50, 'C'], ['milk', 200, 'O'], ['whey', 30, 'P'], ['banana', 110, 'C'], ['almonds', 10, 'F']]),
  rcp('b_oats_yogurt', 'b', 'intl', ['Greek yogurt oat bowl', 'Mangkuk oat dan yogurt Yunani'], [['oats', 50, 'C'], ['greek_yogurt', 150, 'P'], ['mixed_berries', 80, 'C'], ['chia', 10, 'F']]),
  rcp('b_eggs_toast', 'b', 'intl', ['Eggs on toast with avocado', 'Telur di atas roti dengan alpukat'], [['egg', 150, 'P'], ['bread', 60, 'C'], ['avocado', 50, 'F'], ['tomato', 80, 'V']]),
  rcp('b_omelette_toast', 'b', 'intl', ['Omelette with toast', 'Omelet dengan roti'], [['egg', 100, 'P'], ['egg_white', 66, 'P'], ['bread', 60, 'C'], ['spinach', 60, 'V'], ['tomato', 50, 'V'], ['olive_oil', 5, 'F']]),
  rcp('b_nasi_goreng', 'b', 'id', ['Nasi goreng with egg', 'Nasi goreng telur'], [['rice_white', 180, 'C'], ['egg', 100, 'P'], ['oil', 8, 'F'], ['cabbage', 50, 'V'], ['carrot', 30, 'V']]),
  rcp('b_bubur_ayam', 'b', 'id', ['Chicken rice porridge (bubur ayam)', 'Bubur ayam'], [['rice_white', 130, 'C'], ['chicken_breast', 90, 'P'], ['egg', 50, 'P'], ['oil', 4, 'F'], ['cabbage', 40, 'V']]),
  rcp('b_tempeh_bowl', 'b', 'id', ['Tempeh and rice bowl', 'Mangkuk tempe dan nasi'], [['tempeh', 100, 'P'], ['rice_brown', 120, 'C'], ['oil', 6, 'F'], ['spinach', 60, 'V'], ['tomato', 50, 'V']]),
  rcp('b_tofu_scramble', 'b', 'intl', ['Tofu scramble on toast', 'Orak tahu di atas roti'], [['tofu', 150, 'P'], ['bread', 60, 'C'], ['avocado', 40, 'F'], ['spinach', 60, 'V']]),
  rcp('b_cottage_fruit', 'b', 'intl', ['Cottage cheese, papaya and toast', 'Keju cottage, pepaya, dan roti'], [['cottage', 200, 'P'], ['papaya', 150, 'C'], ['bread', 30, 'C'], ['almonds', 15, 'F']]),
  rcp('b_smoothie', 'b', 'intl', ['Banana protein smoothie', 'Smoothie pisang protein'], [['banana', 110, 'C'], ['whey', 30, 'P'], ['milk', 250, 'O'], ['oats', 30, 'C'], ['peanut_butter', 15, 'F']]),
  rcp('b_vegan_oats', 'b', 'intl', ['Soy milk oats with berries', 'Oat susu kedelai dengan beri'], [['oats', 60, 'C'], ['soy_milk', 250, 'O'], ['chia', 10, 'F'], ['mixed_berries', 80, 'C'], ['peanut_butter', 10, 'F']]),
  rcp('b_sweetpotato_chickpea', 'b', 'intl', ['Sweet potato and chickpea plate', 'Ubi jalar dan kacang arab'], [['sweet_potato', 200, 'C'], ['chickpeas', 100, 'P'], ['avocado', 50, 'F'], ['spinach', 60, 'V']]),

  rcp('m_chicken_rice', 'm', 'intl', ['Chicken breast with rice', 'Dada ayam dengan nasi'], [['chicken_breast', 150, 'P'], ['rice_white', 180, 'C'], ['broccoli', 120, 'V'], ['olive_oil', 8, 'F']]),
  rcp('m_ayam_bakar', 'm', 'id', ['Grilled chicken with rice (ayam bakar)', 'Ayam bakar dengan nasi'], [['chicken_thigh', 140, 'P'], ['rice_white', 180, 'C'], ['kangkung', 120, 'V'], ['oil', 8, 'F']]),
  rcp('m_beef_potato', 'm', 'intl', ['Lean beef with potatoes', 'Daging sapi dengan kentang'], [['beef_lean', 140, 'P'], ['potato', 250, 'C'], ['green_beans', 120, 'V'], ['olive_oil', 6, 'F']]),
  rcp('m_salmon_rice', 'm', 'intl', ['Salmon rice bowl', 'Mangkuk nasi salmon'], [['salmon', 130, 'P'], ['rice_brown', 180, 'C'], ['broccoli', 120, 'V'], ['olive_oil', 4, 'F']]),
  rcp('m_ikan_goreng', 'm', 'id', ['Pan-fried fish with rice (ikan goreng)', 'Ikan goreng dengan nasi'], [['white_fish', 150, 'P'], ['rice_white', 180, 'C'], ['spinach', 100, 'V'], ['oil', 8, 'F']]),
  rcp('m_tuna_pasta', 'm', 'intl', ['Tuna pasta', 'Pasta tuna'], [['tuna', 120, 'P'], ['pasta', 180, 'C'], ['tomato', 120, 'V'], ['olive_oil', 10, 'F']]),
  rcp('m_shrimp_bihun', 'm', 'id', ['Stir-fried shrimp with bihun', 'Bihun goreng udang'], [['shrimp', 140, 'P'], ['rice_noodles', 220, 'C'], ['cabbage', 80, 'V'], ['carrot', 40, 'V'], ['oil', 8, 'F']]),
  rcp('m_tempeh_tofu_rice', 'm', 'id', ['Tempeh and tofu with rice', 'Tempe dan tahu dengan nasi'], [['tempeh', 90, 'P'], ['tofu', 100, 'P'], ['rice_white', 180, 'C'], ['kangkung', 120, 'V'], ['oil', 8, 'F']]),
  rcp('m_tofu_stirfry', 'm', 'intl', ['Tofu stir-fry with brown rice', 'Tumis tahu dengan nasi merah'], [['tofu', 200, 'P'], ['rice_brown', 180, 'C'], ['broccoli', 100, 'V'], ['carrot', 40, 'V'], ['oil', 8, 'F']]),
  rcp('m_lentil_rice', 'm', 'intl', ['Lentil stew with rice', 'Sup lentil dengan nasi'], [['lentils', 200, 'P'], ['rice_white', 150, 'C'], ['spinach', 100, 'V'], ['oil', 8, 'F']]),
  rcp('m_chickpea_bowl', 'm', 'intl', ['Chickpea quinoa bowl', 'Mangkuk quinoa dan kacang arab'], [['chickpeas', 150, 'P'], ['quinoa', 150, 'C'], ['salad_greens', 80, 'V'], ['tomato', 60, 'V'], ['avocado', 40, 'F'], ['olive_oil', 5, 'F']]),
  rcp('m_gado_gado', 'm', 'id', ['Gado-gado with egg and tofu', 'Gado-gado dengan telur dan tahu'], [['egg', 100, 'P'], ['tofu', 100, 'P'], ['potato', 150, 'C'], ['peanut_butter', 20, 'F'], ['cabbage', 80, 'V'], ['green_beans', 80, 'V'], ['cucumber', 40, 'V']], true),
  rcp('m_beef_stirfry', 'm', 'id', ['Beef stir-fry with rice', 'Tumis daging sapi dengan nasi'], [['beef_lean', 130, 'P'], ['rice_white', 180, 'C'], ['green_beans', 100, 'V'], ['carrot', 40, 'V'], ['oil', 8, 'F']]),
  rcp('m_chicken_sweetpotato', 'm', 'intl', ['Chicken with sweet potato', 'Ayam dengan ubi jalar'], [['chicken_breast', 150, 'P'], ['sweet_potato', 250, 'C'], ['spinach', 100, 'V'], ['olive_oil', 8, 'F']]),
  rcp('m_soto_ayam', 'm', 'id', ['Chicken noodle soup (soto ayam)', 'Soto ayam bihun'], [['chicken_breast', 130, 'P'], ['rice_noodles', 180, 'C'], ['cabbage', 80, 'V'], ['carrot', 40, 'V'], ['oil', 4, 'F']]),
  rcp('m_tuna_rice_bowl', 'm', 'intl', ['Tuna rice bowl', 'Mangkuk nasi tuna'], [['tuna', 120, 'P'], ['rice_brown', 150, 'C'], ['salad_greens', 100, 'V'], ['cucumber', 60, 'V'], ['avocado', 40, 'F'], ['olive_oil', 6, 'F']]),
  rcp('m_edamame_bowl', 'm', 'intl', ['Edamame and tofu rice bowl', 'Mangkuk nasi edamame dan tahu'], [['edamame', 100, 'P'], ['tofu', 100, 'P'], ['rice_brown', 160, 'C'], ['cabbage', 80, 'V'], ['oil', 5, 'F']]),
  rcp('m_kidney_rice', 'm', 'intl', ['Kidney bean rice plate', 'Nasi dengan kacang merah'], [['kidney_beans', 180, 'P'], ['rice_white', 150, 'C'], ['tomato', 80, 'V'], ['avocado', 40, 'F']]),
  rcp('m_telur_dadar', 'm', 'id', ['Omelette with rice (telur dadar)', 'Telur dadar dengan nasi'], [['egg', 150, 'P'], ['rice_white', 180, 'C'], ['cabbage', 60, 'V'], ['carrot', 40, 'V'], ['oil', 8, 'F']]),
  rcp('m_cottage_pasta', 'm', 'intl', ['Cottage cheese pasta', 'Pasta keju cottage'], [['pasta', 180, 'C'], ['cottage', 150, 'P'], ['tomato', 100, 'V'], ['spinach', 80, 'V'], ['olive_oil', 8, 'F']]),

  rcp('s_yogurt_berries', 's', 'intl', ['Greek yogurt with berries', 'Yogurt Yunani dengan beri'], [['greek_yogurt', 150, 'P'], ['mixed_berries', 80, 'C'], ['almonds', 10, 'F']]),
  rcp('s_eggs_apple', 's', 'intl', ['Boiled eggs and an apple', 'Telur rebus dan apel'], [['egg', 100, 'P'], ['apple', 180, 'C']]),
  rcp('s_whey_banana', 's', 'intl', ['Whey shake with banana', 'Shake whey dengan pisang'], [['whey', 30, 'P'], ['banana', 110, 'C'], ['milk', 200, 'O']]),
  rcp('s_cottage_papaya', 's', 'intl', ['Cottage cheese with papaya', 'Keju cottage dengan pepaya'], [['cottage', 150, 'P'], ['papaya', 150, 'C']]),
  rcp('s_tuna_toast', 's', 'intl', ['Tuna on toast', 'Tuna di atas roti'], [['tuna', 60, 'P'], ['bread', 30, 'C'], ['cucumber', 40, 'V'], ['olive_oil', 3, 'F']]),
  rcp('s_edamame_fruit', 's', 'intl', ['Edamame and an apple', 'Edamame dan apel'], [['edamame', 120, 'P'], ['apple', 180, 'C']]),
  rcp('s_tempeh_fried', 's', 'id', ['Pan-fried tempeh (tempe goreng)', 'Tempe goreng'], [['tempeh', 80, 'P'], ['oil', 5, 'F'], ['cucumber', 60, 'V']]),
  rcp('s_pb_apple_soy', 's', 'intl', ['Apple, peanut butter and soy milk', 'Apel, selai kacang, dan susu kedelai'], [['apple', 180, 'C'], ['peanut_butter', 20, 'F'], ['soy_milk', 200, 'O']]),
  rcp('s_chickpeas', 's', 'intl', ['Roasted chickpeas', 'Kacang arab panggang'], [['chickpeas', 100, 'P'], ['olive_oil', 4, 'F']]),
  rcp('s_sweetpotato_avocado', 's', 'intl', ['Sweet potato with avocado', 'Ubi jalar dengan alpukat'], [['sweet_potato', 150, 'C'], ['avocado', 50, 'F']]),
];

const RECIPE_BY_ID = Object.fromEntries(RECIPES.map(r => [r.id, r]));
