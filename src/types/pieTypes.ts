// ============================================================
// PIE CATEGORIES — 6 Main Pie Families
// Each category contains all its pie recipes in one dropdown
// ============================================================

export interface PieCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  scienceNote: string;
  color: string;
  gradient: string;
  crustType: string;
  techniques: string[];
  pies: PieRecipe[];
}

export interface PieRecipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  source?: string;
  techniqueTip?: string;
  ingredients: { name: string; amount: number }[];
}

export const pieCategories: PieCategory[] = [

  {
    id: 'fruit',
    name: 'Fruit Pies',
    emoji: '\u{1F34E}',
    description: 'Double-crust pastry encasing thickened, sweetened fruit fillings. Master apple and every other fruit pie follows.',
    scienceNote: 'Starch gelatinization (cornstarch or tapioca) thickens hot fruit juices. High initial heat sets the crust; lower heat finishes the filling.',
    color: 'from-red-400 to-orange-500',
    gradient: 'linear-gradient(135deg, #c0392b, #e74c3c, #e67e22)',
    crustType: 'Double flaky butter crust',
    techniques: ['Double-crust pastry', 'Starch thickening', 'Venting & lattice', 'Fruit maceration'],
    pies: [
      { id: 'apple-classic', name: 'Classic Apple Pie', emoji: '\u{1F34E}', description: 'The timeless American apple pie — tart apples, warm spice, and a flaky double crust.', source: 'Boston Cooking-School Cook Book, Fannie Farmer 1910', techniqueTip: 'Toss sliced apples with sugar and let sit 30 min — released juice concentrates flavor and prevents soggy bottom.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:170},{name:'Ice Water',amount:80},{name:'Salt',amount:5},{name:'Granulated Sugar',amount:150},{name:'Brown Sugar (Light)',amount:50},{name:'Cornstarch',amount:28},{name:'Cinnamon',amount:5},{name:'Nutmeg',amount:1},{name:'Lemon Juice',amount:15}]},
      { id: 'apple-caramel', name: 'Salted Caramel Apple Pie', emoji: '\u{1F36E}', description: 'Tart Granny Smith apples in a rich salted caramel sauce under a butter-crunch lattice top.', techniqueTip: 'Pre-cook the caramel sauce and cool before adding to apples — prevents a watery filling.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:185},{name:'Ice Water',amount:80},{name:'Salt',amount:8},{name:'Brown Sugar (Dark)',amount:180},{name:'Heavy Cream',amount:60},{name:'Cornstarch',amount:25},{name:'Cinnamon',amount:4}]},
      { id: 'blueberry', name: 'Classic Blueberry Pie', emoji: '\u{1FAD0}', description: 'Summer blueberries in a bright jammy filling with a double crust or lattice top.', techniqueTip: 'Tapioca starch gives a clearer, shinier berry gel than cornstarch.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:170},{name:'Ice Water',amount:80},{name:'Salt',amount:4},{name:'Granulated Sugar',amount:180},{name:'Tapioca Starch',amount:35},{name:'Lemon Juice',amount:15},{name:'Fresh Blueberries',amount:750}]},
      { id: 'cherry', name: 'Tart Cherry Pie', emoji: '\u{1F352}', description: 'Tart Montmorency cherries in a deep burgundy filling under a traditional lattice top.', techniqueTip: 'Almond extract (just \u00bc tsp) amplifies cherry flavor without tasting artificial.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:170},{name:'Ice Water',amount:80},{name:'Salt',amount:4},{name:'Granulated Sugar',amount:200},{name:'Cornstarch',amount:35},{name:'Almond Extract',amount:3},{name:'Lemon Juice',amount:10},{name:'Fresh Cherries',amount:900}]},
      { id: 'peach', name: 'Southern Peach Pie', emoji: '\u{1F351}', description: 'Sun-ripened peaches with brown sugar and ginger — pure summer in a flaky crust.', techniqueTip: 'Blanch and peel fresh peaches for the cleanest filling. Pat bone-dry before adding starch.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:170},{name:'Ice Water',amount:80},{name:'Salt',amount:4},{name:'Brown Sugar (Light)',amount:150},{name:'Granulated Sugar',amount:50},{name:'Cornstarch',amount:28},{name:'Cinnamon',amount:3},{name:'Ginger (Ground)',amount:2},{name:'Peach (diced)',amount:900}]},
      { id: 'strawberry-rhubarb', name: 'Strawberry Rhubarb Pie', emoji: '\u{1F353}', description: 'The sweet-tart classic — strawberries and rhubarb balance each other perfectly under a golden lattice.', techniqueTip: 'Macerate with sugar 30 min then drain off the liquid — reduces filling shrinkage.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:170},{name:'Ice Water',amount:80},{name:'Salt',amount:4},{name:'Granulated Sugar',amount:220},{name:'Cornstarch',amount:40},{name:'Fresh Strawberries',amount:450},{name:'Lemon Juice',amount:15},{name:'Vanilla Extract',amount:5}]},
    ],
  },

  {
    id: 'custard',
    name: 'Custard Pies',
    emoji: '\u{1F383}',
    description: 'Silky egg custard fillings baked in a blind-baked shell. The technique of tempering eggs and setting a smooth, crack-free custard.',
    scienceNote: 'Egg proteins coagulate 160-180\u00b0F, setting the custard. Low oven temperature prevents curdling. The center should still wobble when removed.',
    color: 'from-orange-400 to-amber-500',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)',
    crustType: 'Single blind-baked flaky crust',
    techniques: ['Egg custard baking', 'Blind-baked crust', 'Tempering eggs', 'Jiggle test doneness'],
    pies: [
      { id: 'pumpkin-classic', name: 'Classic Pumpkin Pie', emoji: '\u{1F383}', description: 'The definitive Thanksgiving pumpkin pie — silky smooth, warmly spiced, and perfectly set.', source: 'Boston Cooking-School Cook Book, Fannie Farmer 1910', techniqueTip: 'Blind bake the crust fully before adding the custard — a raw crust base cannot compete with the wet filling.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:5},{name:'Pumpkin Puree',amount:425},{name:'Brown Sugar (Light)',amount:130},{name:'Granulated Sugar',amount:50},{name:'Whole Egg (large)',amount:150},{name:'Evaporated Milk',amount:355},{name:'Cinnamon',amount:5},{name:'Ginger (Ground)',amount:3},{name:'Nutmeg',amount:2},{name:'Allspice',amount:1},{name:'Vanilla Extract',amount:5}]},
      { id: 'sweet-potato', name: 'Southern Sweet Potato Pie', emoji: '\u{1F360}', description: 'Sweeter and more complex than pumpkin — roasted sweet potato with brown butter and vanilla.', techniqueTip: 'Roast (not boil) the sweet potatoes to concentrate sugar and drive off moisture for a firmer set.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:4},{name:'Sweet Potato',amount:500},{name:'Brown Sugar (Dark)',amount:160},{name:'Whole Egg (large)',amount:150},{name:'Evaporated Milk',amount:300},{name:'Unsalted Butter',amount:55},{name:'Cinnamon',amount:4},{name:'Nutmeg',amount:2},{name:'Vanilla Extract',amount:8}]},
      { id: 'maple-custard', name: 'Maple Custard Pie', emoji: '\u{1F341}', description: 'Pure maple syrup custard with cream — simple, elegant, deeply flavored.', techniqueTip: 'Use Grade A Dark maple syrup for the most intense maple flavor.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:3},{name:'Maple Syrup',amount:240},{name:'Whole Egg (large)',amount:200},{name:'Heavy Cream',amount:240},{name:'Vanilla Extract',amount:5},{name:'Nutmeg',amount:1}]},
      { id: 'lemon-meringue', name: 'Lemon Meringue Pie', emoji: '\u{1F34B}', description: 'Bright starch-set lemon curd under a billowing toasted meringue — the ultimate showpiece pie.', source: 'Boston Cooking-School Cook Book, Fannie Farmer 1910', techniqueTip: 'Spread meringue over HOT filling immediately — the hot curd cooks the meringue base and prevents weeping.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:3},{name:'Granulated Sugar',amount:300},{name:'Cornstarch',amount:42},{name:'Lemon Juice',amount:160},{name:'Lemon Zest',amount:8},{name:'Whole Egg (large)',amount:200},{name:'Unsalted Butter',amount:55},{name:'Cream of Tartar',amount:2}]},
      { id: 'key-lime', name: 'Key Lime Pie', emoji: '\u{1F7E2}', description: 'Acid-set condensed milk filling in a graham crust — chemistry, not just baking, sets this iconic pie.', techniqueTip: 'Real key lime juice is essential — its floral bitterness is irreplaceable.',
        ingredients: [{name:'Graham Cracker Crumbs',amount:200},{name:'Unsalted Butter',amount:85},{name:'Granulated Sugar',amount:35},{name:'Sweetened Condensed Milk',amount:400},{name:'Lime Juice',amount:120},{name:'Whole Egg (large)',amount:100},{name:'Lime Zest',amount:5}]},
      { id: 'buttermilk', name: 'Buttermilk Pie', emoji: '\u{1F95B}', description: 'A Southern classic — tangy buttermilk baked into a silky custardy filling with a papery crackled top.', techniqueTip: 'The top should form a delicate papery crust when done. A 2-inch center wobble is the correct doneness cue.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:3},{name:'Granulated Sugar',amount:300},{name:'Whole Egg (large)',amount:200},{name:'Unsalted Butter',amount:85},{name:'Buttermilk',amount:240},{name:'All-Purpose Flour',amount:30},{name:'Vanilla Extract',amount:5}]},
    ],
  },

  {
    id: 'sugar',
    name: 'Sugar Pies',
    emoji: '\u{1F95C}',
    description: 'Egg-and-syrup fillings that set into rich, caramelized, fudgy textures. From pecan to chess to shoofly — all pantry staples made extraordinary.',
    scienceNote: 'Egg proteins coagulate around a high-sugar syrup base, creating a dense, fudgy, candy-like filling. Pull while the center still jiggles — it firms as it cools.',
    color: 'from-amber-600 to-yellow-700',
    gradient: 'linear-gradient(135deg, #92400e, #b45309, #d97706)',
    crustType: 'Single unbaked flaky crust',
    techniques: ['Syrup-egg filling', 'Nut suspension', 'Chess custard', 'Molasses crumb layering'],
    pies: [
      { id: 'pecan-classic', name: 'Southern Pecan Pie', emoji: '\u{1FAD9}', description: 'The gold standard — dark corn syrup, brown sugar, and whole pecans in a buttery flaky crust.', source: 'Classic American recipe, circa 1940s', techniqueTip: 'Pull from the oven when edges are set but center has a 2-inch jiggle — carryover heat finishes perfectly.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:5},{name:'Corn Syrup',amount:240},{name:'Brown Sugar (Dark)',amount:160},{name:'Whole Egg (large)',amount:150},{name:'Unsalted Butter',amount:55},{name:'Vanilla Extract',amount:8},{name:'Pecans',amount:225}]},
      { id: 'pecan-bourbon', name: 'Bourbon Pecan Pie', emoji: '\u{1F943}', description: 'A splash of bourbon deepens caramel notes and cuts the sweetness — the grown-up pecan pie.', techniqueTip: 'Add bourbon off-heat after the filling is mixed — cooking drives off flavor.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:5},{name:'Corn Syrup',amount:200},{name:'Brown Sugar (Dark)',amount:180},{name:'Whole Egg (large)',amount:150},{name:'Unsalted Butter',amount:55},{name:'Vanilla Extract',amount:5},{name:'Pecans',amount:225}]},
      { id: 'maple-walnut', name: 'Maple Walnut Pie', emoji: '\u{1F341}', description: 'Walnuts and pure maple syrup — a New England autumn classic with no corn syrup.', techniqueTip: 'Toast the walnuts at 350\u00b0F for 8 minutes before adding — amplifies flavor enormously.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:4},{name:'Maple Syrup',amount:240},{name:'Brown Sugar (Light)',amount:120},{name:'Whole Egg (large)',amount:150},{name:'Unsalted Butter',amount:55},{name:'Vanilla Extract',amount:5},{name:'Walnuts (chopped)',amount:200}]},
      { id: 'chess-classic', name: 'Classic Chess Pie', emoji: '\u265F\uFE0F', description: 'The original Southern chess pie — sugar, eggs, butter, cornmeal. Rich, sweet, unmistakably old-fashioned.', techniqueTip: 'The papery crackled top crust is the sign it is done. A 2-inch center wobble is correct.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:3},{name:'Granulated Sugar',amount:400},{name:'Whole Egg (large)',amount:200},{name:'Unsalted Butter',amount:115},{name:'Cornmeal',amount:20},{name:'Vanilla Extract',amount:5},{name:'White Vinegar',amount:10}]},
      { id: 'chess-lemon', name: 'Lemon Chess Pie', emoji: '\u{1F34B}', description: 'Lemon zest and juice brighten the classic chess formula — tangy, sunny, beautifully balanced.', techniqueTip: 'Use both zest and juice — zest oils carry more intense flavor than juice alone.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:3},{name:'Granulated Sugar',amount:380},{name:'Whole Egg (large)',amount:200},{name:'Unsalted Butter',amount:115},{name:'Cornmeal',amount:20},{name:'Lemon Juice',amount:60},{name:'Lemon Zest',amount:8}]},
      { id: 'shoofly', name: 'Wet-Bottom Shoofly Pie', emoji: '\u{1FAD9}', description: 'Pennsylvania Dutch classic — sticky molasses base under a spiced crumb topping.', techniqueTip: 'Layer crumbs and molasses alternately — creates the signature wet-bottom / dry-top separation.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:3},{name:'Molasses',amount:240},{name:'Baking Soda',amount:5},{name:'Hot Water',amount:200},{name:'All-Purpose Flour',amount:200},{name:'Brown Sugar (Dark)',amount:150},{name:'Unsalted Butter',amount:70},{name:'Cinnamon',amount:3},{name:'Nutmeg',amount:1}]},
    ],
  },

  {
    id: 'cream',
    name: 'Cream Pies',
    emoji: '\u{1F36B}',
    description: 'Cooked pastry cream poured into a baked shell and chilled. The foundation technique unlocks chocolate, banana, coconut — any cream pie you can imagine.',
    scienceNote: 'Pastry cream must reach a full boil to fully activate cornstarch — under-cooking leaves a starchy, gluey texture that never sets firm.',
    color: 'from-stone-500 to-amber-700',
    gradient: 'linear-gradient(135deg, #44403c, #78716c, #a8a29e)',
    crustType: 'Pre-baked flaky or crumb crust, chilled filling',
    techniques: ['Cooked pastry cream', 'Tempering eggs', 'Full boil activation', 'Stabilized whipped topping'],
    pies: [
      { id: 'chocolate-cream', name: 'Chocolate Cream Pie', emoji: '\u{1F36B}', description: 'Rich chocolate pastry cream in a flaky baked crust, finished with freshly whipped cream.', techniqueTip: 'Cook the pastry cream to a full boil — raw starch flavor disappears only at the boil.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:5},{name:'Whole Milk',amount:480},{name:'Heavy Cream',amount:120},{name:'Granulated Sugar',amount:150},{name:'Cornstarch',amount:40},{name:'Whole Egg (large)',amount:150},{name:'Dutch Cocoa Powder',amount:55},{name:'Unsalted Butter',amount:28},{name:'Vanilla Extract',amount:5}]},
      { id: 'banana-cream', name: 'Banana Cream Pie', emoji: '\u{1F34C}', description: 'Vanilla pastry cream layered with fresh banana slices in a flaky crust — the classic diner dessert.', techniqueTip: 'Toss banana slices in lemon juice to slow browning. Assemble no more than 6 hours before serving.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:5},{name:'Whole Milk',amount:480},{name:'Heavy Cream',amount:120},{name:'Granulated Sugar',amount:130},{name:'Cornstarch',amount:35},{name:'Whole Egg (large)',amount:150},{name:'Unsalted Butter',amount:28},{name:'Vanilla Extract',amount:8},{name:'Banana',amount:350}]},
      { id: 'coconut-cream', name: 'Coconut Cream Pie', emoji: '\u{1F965}', description: 'Coconut milk pastry cream loaded with toasted coconut — tropical and indulgent.', techniqueTip: 'Toast the coconut at 325\u00b0F until golden — raw coconut is grassy; toasted is nutty and sweet.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:4},{name:'Coconut Milk (canned)',amount:400},{name:'Whole Milk',amount:240},{name:'Granulated Sugar',amount:130},{name:'Cornstarch',amount:40},{name:'Whole Egg (large)',amount:150},{name:'Unsalted Butter',amount:28},{name:'Vanilla Extract',amount:5},{name:'Shredded Coconut',amount:80}]},
      { id: 'peanut-butter-cream', name: 'Peanut Butter Cream Pie', emoji: '\u{1F95C}', description: 'No-bake peanut butter cream in a chocolate crumb crust — smooth, salty-sweet, addictive.', techniqueTip: 'Beat cream cheese and peanut butter together before adding sugar — ensures a perfectly smooth filling.',
        ingredients: [{name:'Graham Cracker Crumbs',amount:200},{name:'Unsalted Butter',amount:85},{name:'Granulated Sugar',amount:30},{name:'Cream Cheese',amount:225},{name:'Peanut Butter',amount:250},{name:'Powdered Sugar',amount:200},{name:'Heavy Cream',amount:240},{name:'Vanilla Extract',amount:5},{name:'Salt',amount:3}]},
      { id: 'strawberry-cream', name: 'Strawberry Cream Pie', emoji: '\u{1F353}', description: 'Fresh strawberries on a bed of vanilla cream cheese filling in a buttery graham crust.', techniqueTip: 'Glaze the strawberries with warmed strawberry jam for a professional shiny finish.',
        ingredients: [{name:'Graham Cracker Crumbs',amount:200},{name:'Unsalted Butter',amount:85},{name:'Granulated Sugar',amount:30},{name:'Cream Cheese',amount:225},{name:'Powdered Sugar',amount:120},{name:'Heavy Cream',amount:240},{name:'Vanilla Extract',amount:5},{name:'Strawberry Jam',amount:100},{name:'Fresh Strawberries',amount:450}]},
    ],
  },

  {
    id: 'mousse',
    name: 'Mousse Pies',
    emoji: '\u{1F3A9}',
    description: 'No-bake fillings set entirely by cold and aerated whipped cream — ultra-silky and intensely flavored. No starch, no custard, pure airy texture.',
    scienceNote: 'Structure comes from fat crystallization in chocolate/butter and air trapped in whipped cream. ALL ingredients must be at room temperature — cold anything = grainy filling.',
    color: 'from-gray-700 to-gray-900',
    gradient: 'linear-gradient(135deg, #1f2937, #374151, #4b5563)',
    crustType: 'Pre-baked or crumb crust, no baking of filling',
    techniques: ['Mousse aeration', 'Stabilized whipped cream', 'Fat crystallization', 'Temperature control'],
    pies: [
      { id: 'french-silk', name: 'French Silk Pie', emoji: '\u{1F3A9}', description: 'Ultra-smooth dark chocolate mousse in a flaky butter crust — the silkiest pie in existence.', techniqueTip: 'ALL ingredients at exactly room temperature — cold butter or chocolate creates a grainy broken filling that cannot be fixed.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:5},{name:'Dark Chocolate',amount:170},{name:'Unsalted Butter',amount:170},{name:'Granulated Sugar',amount:200},{name:'Whole Egg (large)',amount:200},{name:'Vanilla Extract',amount:5},{name:'Heavy Cream',amount:240}]},
      { id: 'french-silk-espresso', name: 'Espresso French Silk', emoji: '\u2615\uFE0F', description: 'A shot of espresso deepens chocolate intensity and adds a sophisticated bitter note.', techniqueTip: 'Dissolve espresso powder in \u00bd tsp warm water before adding — avoids gritty specks in the mousse.',
        ingredients: [{name:'All-Purpose Flour',amount:150},{name:'Unsalted Butter',amount:85},{name:'Ice Water',amount:40},{name:'Salt',amount:5},{name:'Dark Chocolate',amount:170},{name:'Unsalted Butter',amount:170},{name:'Granulated Sugar',amount:200},{name:'Whole Egg (large)',amount:200},{name:'Espresso Powder',amount:8},{name:'Vanilla Extract',amount:5},{name:'Heavy Cream',amount:240}]},
      { id: 'chocolate-mousse-pie', name: 'Chocolate Mousse Pie', emoji: '\u{1F36B}', description: 'Whipped cream folded into melted chocolate and cream cheese — lighter, cloud-like texture.', techniqueTip: 'Add \u2153 whipped cream first to lighten the base, then fold in the rest gently to preserve volume.',
        ingredients: [{name:'Graham Cracker Crumbs',amount:200},{name:'Unsalted Butter',amount:85},{name:'Dark Chocolate',amount:230},{name:'Cream Cheese',amount:115},{name:'Powdered Sugar',amount:80},{name:'Heavy Cream',amount:360},{name:'Vanilla Extract',amount:5},{name:'Salt',amount:2}]},
      { id: 'lemon-mousse', name: 'Lemon Mousse Pie', emoji: '\u{1F34B}', description: 'Bright lemon curd folded with stabilized whipped cream — lighter than a tart, more intense than a cream pie.', techniqueTip: 'Make lemon curd at least 4 hours ahead and chill completely before folding in whipped cream.',
        ingredients: [{name:'Graham Cracker Crumbs',amount:200},{name:'Unsalted Butter',amount:85},{name:'Granulated Sugar',amount:30},{name:'Lemon Juice',amount:120},{name:'Lemon Zest',amount:10},{name:'Granulated Sugar',amount:180},{name:'Whole Egg (large)',amount:200},{name:'Unsalted Butter',amount:85},{name:'Heavy Cream',amount:300}]},
      { id: 'pumpkin-mousse', name: 'No-Bake Pumpkin Mousse Pie', emoji: '\u{1F383}', description: 'Spiced pumpkin folded with cream cheese and whipped cream — all the Thanksgiving flavor, none of the baking.', techniqueTip: 'Beat cream cheese until very smooth before adding pumpkin — lumps will be visible in the finished pie.',
        ingredients: [{name:'Graham Cracker Crumbs',amount:200},{name:'Unsalted Butter',amount:85},{name:'Granulated Sugar',amount:30},{name:'Cream Cheese',amount:225},{name:'Pumpkin Puree',amount:425},{name:'Brown Sugar (Dark)',amount:160},{name:'Cinnamon',amount:5},{name:'Ginger (Ground)',amount:3},{name:'Nutmeg',amount:2},{name:'Heavy Cream',amount:300},{name:'Vanilla Extract',amount:5}]},
    ],
  },

  {
    id: 'savory',
    name: 'Savory Pies',
    emoji: '\u{1F357}',
    description: 'From classic pot pies with double-crust pastry to shepherd\'s pie with golden mashed potato — the savory pie is a complete one-dish meal.',
    scienceNote: 'Savory pie fillings must be nappe-consistency (coats a spoon) before going in. Too thin = soggy crust. Too thick = gluey filling. Cool the filling before adding the crust.',
    color: 'from-amber-500 to-yellow-600',
    gradient: 'linear-gradient(135deg, #78350f, #92400e, #b45309)',
    crustType: 'Double flaky crust (pot pies) or mashed potato topping',
    techniques: ['Savory roux gravy', 'Double crust sealing', 'Steam venting', 'Mashed potato topping'],
    pies: [
      { id: 'chicken-pot-pie', name: 'Classic Chicken Pot Pie', emoji: '\u{1F357}', description: 'Tender chicken, carrots, peas, and celery in a rich cream gravy — sealed under a golden flaky crust.', techniqueTip: 'Cool the filling to room temperature before adding to the crust — hot filling softens the butter fat and prevents flakiness.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:170},{name:'Ice Water',amount:80},{name:'Salt',amount:8},{name:'Unsalted Butter',amount:85},{name:'All-Purpose Flour',amount:45},{name:'Chicken Broth',amount:480},{name:'Whole Milk',amount:240},{name:'Salt',amount:5},{name:'Black Pepper',amount:3},{name:'Thyme',amount:2}]},
      { id: 'turkey-mushroom', name: 'Turkey & Mushroom Pot Pie', emoji: '\u{1F983}', description: 'Leftover turkey and savory mushrooms in a golden double-crust pie — the best use of holiday turkey.', techniqueTip: 'Brown mushrooms in batches in a hot dry pan until deeply golden — releasing liquid concentrates flavor.',
        ingredients: [{name:'All-Purpose Flour',amount:300},{name:'Unsalted Butter',amount:170},{name:'Ice Water',amount:80},{name:'Salt',amount:7},{name:'Unsalted Butter',amount:85},{name:'All-Purpose Flour',amount:50},{name:'Chicken Broth',amount:480},{name:'Heavy Cream',amount:120},{name:'Thyme',amount:3},{name:'Black Pepper',amount:3}]},
      { id: 'shepherds-pie', name: "Shepherd's Pie (Lamb)", emoji: '\u{1F411}', description: 'Traditional British shepherd\'s pie — minced lamb with rosemary under a golden mashed potato crust.', techniqueTip: 'Pipe mashed potato with a star tip for crisp ridges that brown dramatically.',
        ingredients: [{name:'Unsalted Butter',amount:55},{name:'All-Purpose Flour',amount:30},{name:'Chicken Broth',amount:300},{name:'Whole Milk',amount:120},{name:'Unsalted Butter',amount:85},{name:'Salt',amount:8},{name:'Black Pepper',amount:4},{name:'Thyme',amount:2},{name:'Rosemary',amount:2}]},
      { id: 'cottage-pie', name: 'Cottage Pie (Beef)', emoji: '\u{1F404}', description: 'Minced beef with Worcestershire, carrot, and onion under a thick mashed potato crust.', techniqueTip: 'Add an egg yolk to the mashed potato topping — it accelerates Maillard browning for a deeper golden crust.',
        ingredients: [{name:'Unsalted Butter',amount:55},{name:'All-Purpose Flour',amount:35},{name:'Chicken Broth',amount:360},{name:'Whole Milk',amount:120},{name:'Unsalted Butter',amount:60},{name:'Salt',amount:8},{name:'Black Pepper',amount:4},{name:'Thyme',amount:2}]},
    ],
  },

];
