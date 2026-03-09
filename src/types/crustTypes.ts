// ============================================================
// CRUST TYPES — families, base formulas, and recipe presets
// pairsWell: pie type IDs this crust is recommended for
// ============================================================

export interface CrustRecipe {
  name: string;
  emoji: string;
  description: string;
  group?: string;
  pairsWell: string[];
  ingredients: { name: string; amount: number }[];
}

export interface CrustType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  baseFormula: { name: string; amount: number }[];
  recipes: CrustRecipe[];
}

export const crustTypes: CrustType[] = [

  // ══════════════════════════════════════════════════════════
  // 1. ALL-BUTTER FLAKY CRUST
  // ══════════════════════════════════════════════════════════
  {
    id: 'all-butter',
    name: 'All-Butter Flaky Crust',
    emoji: '🧈',
    description: 'The gold standard of pie crusts — pure butter layered into flour for maximum flavor and flakiness.',
    baseFormula: [
      { name: 'All-Purpose Flour', amount: 300 },
      { name: 'Unsalted Butter', amount: 225 },
      { name: 'Ice Water', amount: 90 },
      { name: 'Salt', amount: 6 },
      { name: 'Granulated Sugar', amount: 10 },
    ],
    recipes: [
      {
        group: 'Single Crust',
        name: 'All-Butter Single Crust',
        emoji: '🧈',
        description: 'One perfectly flaky butter crust — for custard, cream, and open-face pies.',
        pairsWell: ['custard', 'meringue', 'chess', 'sugar-syrup', 'mousse'],
        ingredients: [
          { name: 'All-Purpose Flour', amount: 150 },
          { name: 'Unsalted Butter', amount: 113 },
          { name: 'Ice Water', amount: 45 },
          { name: 'Salt', amount: 4 },
          { name: 'Granulated Sugar', amount: 5 },
        ],
      },
      {
        group: 'Double Crust',
        name: 'All-Butter Double Crust',
        emoji: '🥧',
        description: 'Two-crust butter pastry — for apple, cherry, blueberry, peach, and pot pies.',
        pairsWell: ['fruit-double', 'savory-pastry'],
        ingredients: [
          { name: 'All-Purpose Flour', amount: 300 },
          { name: 'Unsalted Butter', amount: 225 },
          { name: 'Ice Water', amount: 90 },
          { name: 'Salt', amount: 7 },
          { name: 'Granulated Sugar', amount: 10 },
        ],
      },
      {
        group: 'Blind Bake',
        name: 'Par-Baked Butter Shell',
        emoji: '⬜',
        description: 'A fully blind-baked shell ready for no-bake or wet custard fillings.',
        pairsWell: ['cream', 'acid-set', 'layered-cream', 'mousse'],
        ingredients: [
          { name: 'All-Purpose Flour', amount: 150 },
          { name: 'Unsalted Butter', amount: 113 },
          { name: 'Ice Water', amount: 45 },
          { name: 'Salt', amount: 4 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // 2. SHORTENING / LARD CRUST
  // ══════════════════════════════════════════════════════════
  {
    id: 'shortening',
    name: 'Shortening Crust',
    emoji: '🏺',
    description: 'Classic American diner crust — shortening creates a softer, more tender crumb that holds its shape when sliced.',
    baseFormula: [
      { name: 'All-Purpose Flour', amount: 300 },
      { name: 'Shortening', amount: 130 },
      { name: 'Ice Water', amount: 80 },
      { name: 'Salt', amount: 5 },
    ],
    recipes: [
      {
        group: 'Traditional American',
        name: 'Classic Shortening Single Crust',
        emoji: '🏺',
        description: 'The original American pie crust — tender, pliable, and easy to work with.',
        pairsWell: ['custard', 'chess', 'sugar-syrup', 'meringue'],
        ingredients: [
          { name: 'All-Purpose Flour', amount: 150 },
          { name: 'Shortening', amount: 65 },
          { name: 'Ice Water', amount: 40 },
          { name: 'Salt', amount: 3 },
        ],
      },
      {
        group: 'Traditional American',
        name: 'Butter-Shortening Blend Double Crust',
        emoji: '⭐',
        description: 'Best of both worlds — shortening\'s tenderness + butter\'s flavor. The most popular competition pie crust.',
        pairsWell: ['fruit-double', 'savory-pastry'],
        ingredients: [
          { name: 'All-Purpose Flour', amount: 300 },
          { name: 'Unsalted Butter', amount: 113 },
          { name: 'Shortening', amount: 65 },
          { name: 'Ice Water', amount: 80 },
          { name: 'Salt', amount: 6 },
          { name: 'Granulated Sugar', amount: 8 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // 3. GRAHAM CRACKER CRUMB CRUST
  // ══════════════════════════════════════════════════════════
  {
    id: 'graham',
    name: 'Graham Cracker Crust',
    emoji: '🍪',
    description: 'Ground graham crackers pressed with butter — the ideal base for no-bake and chilled pies.',
    baseFormula: [
      { name: 'Graham Cracker Crumbs', amount: 200 },
      { name: 'Unsalted Butter', amount: 85 },
      { name: 'Granulated Sugar', amount: 40 },
    ],
    recipes: [
      {
        group: 'Classic Graham',
        name: 'Classic Graham Cracker Crust',
        emoji: '🍪',
        description: 'The simple, toasty, sweet base for cheesecakes, key lime, and icebox pies.',
        pairsWell: ['acid-set', 'cream', 'layered-cream', 'mousse'],
        ingredients: [
          { name: 'Graham Cracker Crumbs', amount: 200 },
          { name: 'Unsalted Butter', amount: 85 },
          { name: 'Granulated Sugar', amount: 35 },
          { name: 'Salt', amount: 2 },
        ],
      },
      {
        group: 'Chocolate & Nut',
        name: 'Chocolate Wafer Crust',
        emoji: '🍫',
        description: 'Ground chocolate wafers make an intensely dark crumb — perfect for chocolate cream or peanut butter pies.',
        pairsWell: ['cream', 'mousse', 'layered-cream'],
        ingredients: [
          { name: 'Graham Cracker Crumbs', amount: 170 },
          { name: 'Dutch Cocoa Powder', amount: 30 },
          { name: 'Unsalted Butter', amount: 85 },
          { name: 'Granulated Sugar', amount: 35 },
          { name: 'Salt', amount: 2 },
        ],
      },
      {
        group: 'Chocolate & Nut',
        name: 'Pecan Crumb Crust',
        emoji: '🥜',
        description: 'Toasted pecan meal pressed with brown butter — a gluten-friendly, nutty alternative to graham.',
        pairsWell: ['cream', 'acid-set', 'mousse', 'chess'],
        ingredients: [
          { name: 'Pecans', amount: 200 },
          { name: 'Brown Sugar (Dark)', amount: 35 },
          { name: 'Unsalted Butter', amount: 55 },
          { name: 'Salt', amount: 2 },
          { name: 'Cinnamon', amount: 2 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // 4. SWEET TART / PÂTE SUCRÉE
  // ══════════════════════════════════════════════════════════
  {
    id: 'pate-sucree',
    name: 'Sweet Tart Crust (Pâte Sucrée)',
    emoji: '🟡',
    description: 'A French-style short crust — cookies-and-cream tender, not flaky. Used for elegant tarts and dessert pies that need a sturdier shell.',
    baseFormula: [
      { name: 'All-Purpose Flour', amount: 200 },
      { name: 'Unsalted Butter', amount: 130 },
      { name: 'Powdered Sugar', amount: 80 },
      { name: 'Whole Egg (large)', amount: 50 },
      { name: 'Salt', amount: 2 },
      { name: 'Vanilla Extract', amount: 3 },
    ],
    recipes: [
      {
        group: 'Pâte Sucrée',
        name: 'Classic Pâte Sucrée',
        emoji: '🟡',
        description: 'The French sweet crust — crumbly-tender like shortbread, ideal for custard tarts and lemon curd tarts.',
        pairsWell: ['meringue', 'custard', 'chess', 'acid-set'],
        ingredients: [
          { name: 'All-Purpose Flour', amount: 200 },
          { name: 'Unsalted Butter', amount: 130 },
          { name: 'Powdered Sugar', amount: 80 },
          { name: 'Whole Egg (large)', amount: 50 },
          { name: 'Salt', amount: 2 },
          { name: 'Vanilla Extract', amount: 3 },
        ],
      },
      {
        group: 'Pâte Sucrée',
        name: 'Chocolate Pâte Sucrée',
        emoji: '🍫',
        description: 'A cocoa-enriched short crust — deep chocolate flavor with a crumbly cookie-like texture.',
        pairsWell: ['mousse', 'cream', 'acid-set'],
        ingredients: [
          { name: 'All-Purpose Flour', amount: 175 },
          { name: 'Dutch Cocoa Powder', amount: 30 },
          { name: 'Unsalted Butter', amount: 130 },
          { name: 'Powdered Sugar', amount: 80 },
          { name: 'Whole Egg (large)', amount: 50 },
          { name: 'Salt', amount: 2 },
          { name: 'Vanilla Extract', amount: 3 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // 5. STORE-BOUGHT / PREMADE CRUSTS
  // ══════════════════════════════════════════════════════════
  {
    id: 'premade',
    name: 'Store-Bought / Premade',
    emoji: '🛒',
    description: 'Ready-to-use crusts from the freezer or refrigerator aisle — no mixing required. Great for weeknight pies.',
    baseFormula: [],
    recipes: [
      {
        group: 'Frozen Shells',
        name: 'Pillsbury Frozen Pie Crust',
        emoji: '❄️',
        description: 'Classic frozen deep-dish shell. Thaw 15 min, prick, blind-bake at 425°F for 10–12 min before filling.',
        pairsWell: ['custard', 'cream', 'sugar', 'mousse', 'fruit'],
        // ~170g shell: 130g flour, 28g shortening, 12g butter per label
        ingredients: [
          { name: 'All-Purpose Flour', amount: 130 },
          { name: 'Shortening', amount: 28 },
          { name: 'Unsalted Butter', amount: 12 },
          { name: 'Salt', amount: 4 },
          { name: 'Ice Water', amount: 30 },
        ],
      },
      {
        group: 'Frozen Shells',
        name: "Marie Callender's Frozen Deep Dish Shell",
        emoji: '❄️',
        description: 'Extra-deep frozen shell — ideal for generous custard or fruit fillings. Bake from frozen at 375°F.',
        pairsWell: ['custard', 'fruit', 'sugar'],
        // ~220g deep dish shell — more flour and fat than standard
        ingredients: [
          { name: 'All-Purpose Flour', amount: 165 },
          { name: 'Shortening', amount: 38 },
          { name: 'Unsalted Butter', amount: 15 },
          { name: 'Salt', amount: 5 },
          { name: 'Ice Water', amount: 40 },
        ],
      },
      {
        group: 'Frozen Shells',
        name: 'Pet-Ritz Frozen Pie Shell',
        emoji: '❄️',
        description: 'Budget-friendly standard-depth frozen shell. Available in 2-packs. Thaw before filling.',
        pairsWell: ['custard', 'cream', 'sugar'],
        // ~160g standard shell
        ingredients: [
          { name: 'All-Purpose Flour', amount: 120 },
          { name: 'Shortening', amount: 32 },
          { name: 'Salt', amount: 4 },
          { name: 'Ice Water', amount: 28 },
        ],
      },
      {
        group: 'Refrigerated Roll-Out',
        name: 'Pillsbury Refrigerated Pie Crust (Roll-Out)',
        emoji: '🥶',
        description: 'Rolled dough in a box — unroll, press into your pan, and bake. Makes single or double crust. No thawing needed.',
        pairsWell: ['fruit', 'custard', 'sugar', 'savory'],
        // ~200g per single roll (box has 2)
        ingredients: [
          { name: 'All-Purpose Flour', amount: 148 },
          { name: 'Shortening', amount: 32 },
          { name: 'Unsalted Butter', amount: 10 },
          { name: 'Salt', amount: 4 },
          { name: 'Granulated Sugar', amount: 5 },
          { name: 'Ice Water', amount: 35 },
        ],
      },
      {
        group: 'Refrigerated Roll-Out',
        name: "Trader Joe's Pie Crust Rounds",
        emoji: '🥶',
        description: 'All-butter refrigerated rounds — better flavor than most store options. Roll out slightly before use.',
        pairsWell: ['fruit', 'custard', 'sugar', 'savory'],
        // ~210g all-butter round
        ingredients: [
          { name: 'All-Purpose Flour', amount: 150 },
          { name: 'Unsalted Butter', amount: 55 },
          { name: 'Salt', amount: 4 },
          { name: 'Granulated Sugar', amount: 5 },
          { name: 'Ice Water', amount: 38 },
        ],
      },
      {
        group: 'Graham Cracker Premade',
        name: 'Keebler Ready Crust Graham (6 oz)',
        emoji: '🟫',
        description: 'Pre-pressed 9-inch graham crust in a foil pan. No baking needed — fill and chill or bake as directed.',
        pairsWell: ['cream', 'mousse', 'custard'],
        // 170g: ~120g graham crumbs, 40g butter, 10g sugar per label
        ingredients: [
          { name: 'Graham Cracker Crumbs', amount: 120 },
          { name: 'Unsalted Butter', amount: 40 },
          { name: 'Granulated Sugar', amount: 10 },
        ],
      },
      {
        group: 'Graham Cracker Premade',
        name: 'Keebler Ready Crust Graham (9 oz Deep Dish)',
        emoji: '🟫',
        description: 'Larger deep-dish graham crust — holds more filling for mousse, cream cheese, or key lime pies.',
        pairsWell: ['cream', 'mousse', 'custard'],
        // 255g deep dish
        ingredients: [
          { name: 'Graham Cracker Crumbs', amount: 180 },
          { name: 'Unsalted Butter', amount: 58 },
          { name: 'Granulated Sugar', amount: 17 },
        ],
      },
      {
        group: 'Graham Cracker Premade',
        name: 'Oreo Cookie Crust (Premade)',
        emoji: '⚫',
        description: 'Pre-pressed Oreo crumb crust — pairs perfectly with chocolate mousse, peanut butter cream, or French silk.',
        pairsWell: ['mousse', 'cream'],
        // 170g: ~115g chocolate crumbs, 40g butter, 15g sugar
        ingredients: [
          { name: 'Graham Cracker Crumbs', amount: 115 },
          { name: 'Dutch Cocoa Powder', amount: 15 },
          { name: 'Unsalted Butter', amount: 40 },
          { name: 'Granulated Sugar', amount: 15 },
        ],
      },
      {
        group: 'Specialty',
        name: 'Wholly Wholesome Organic Pie Shell',
        emoji: '🌿',
        description: 'Organic, non-GMO frozen pie shell. Slightly smaller than standard — check depth for your recipe.',
        pairsWell: ['custard', 'fruit', 'sugar', 'cream'],
        // ~160g organic shell — unbleached flour, palm oil shortening
        ingredients: [
          { name: 'All-Purpose Flour', amount: 118 },
          { name: 'Shortening', amount: 32 },
          { name: 'Salt', amount: 3 },
          { name: 'Granulated Sugar', amount: 4 },
          { name: 'Ice Water', amount: 28 },
        ],
      },
      {
        group: 'Specialty',
        name: 'Wholly Wholesome Gluten-Free Shell',
        emoji: '🌾',
        description: 'Frozen gluten-free pie shell made with rice flour blend. Blind-bake as directed on package.',
        pairsWell: ['custard', 'fruit', 'sugar', 'cream', 'mousse'],
        // ~165g GF shell: rice flour base
        ingredients: [
          { name: 'Rice Flour', amount: 100 },
          { name: 'Tapioca Starch', amount: 25 },
          { name: 'Shortening', amount: 30 },
          { name: 'Salt', amount: 3 },
          { name: 'Granulated Sugar', amount: 5 },
          { name: 'Ice Water', amount: 28 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // 6. MASHED POTATO TOPPING
  // ══════════════════════════════════════════════════════════
  {
    id: 'mash-topping',
    name: 'Mashed Potato Topping',
    emoji: '🥔',
    description: 'The "crust" for savory casserole pies — creamy mashed potato piped or spread over a filling and baked to a golden crust.',
    baseFormula: [
      { name: 'Unsalted Butter', amount: 85 },
      { name: 'Whole Milk', amount: 120 },
      { name: 'Salt', amount: 8 },
      { name: 'Black Pepper', amount: 3 },
    ],
    recipes: [
      {
        group: 'Classic Mash',
        name: 'Classic Mashed Potato Topping',
        emoji: '🥔',
        description: 'Butter-rich, smooth mashed potatoes — spread or piped over a savory filling and baked golden.',
        pairsWell: ['savory-casserole'],
        ingredients: [
          { name: 'Unsalted Butter', amount: 85 },
          { name: 'Whole Milk', amount: 120 },
          { name: 'Heavy Cream', amount: 60 },
          { name: 'Salt', amount: 8 },
          { name: 'Black Pepper', amount: 3 },
        ],
      },
      {
        group: 'Enriched Mash',
        name: 'Parmesan & Herb Mash Topping',
        emoji: '🧀',
        description: 'Parmesan and fresh thyme in the mash create a savory, extra-golden crust.',
        pairsWell: ['savory-casserole'],
        ingredients: [
          { name: 'Unsalted Butter', amount: 85 },
          { name: 'Whole Milk', amount: 120 },
          { name: 'Heavy Cream', amount: 60 },
          { name: 'Salt', amount: 8 },
          { name: 'Black Pepper', amount: 3 },
          { name: 'Thyme', amount: 3 },
        ],
      },
    ],
  },
];
