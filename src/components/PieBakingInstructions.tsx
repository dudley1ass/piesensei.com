import { Flame, Clock, Layers, Info, BookOpen } from 'lucide-react';

interface PieBakingInstructionsProps {
  pieTypeId: string;
  crustTypeId?: string | null;
  totalWeight: number;
  servings: number;
  measurementMode: 'metric' | 'imperial' | 'volumetric';
  recipeName?: string | null;
}

interface BakingData {
  tempF: number;
  tempC: number;
  timeMin: number;
  timeMax: number;
  pan: string;
  steps: string[];
  doneness: string;
  coolingNote: string;
  tips: string[];
}

const PIE_BAKING_DATA: Record<string, BakingData> = {
  'fruit-double': {
    tempF: 425, tempC: 220, timeMin: 45, timeMax: 55,
    pan: '9-inch deep-dish pie plate (glass or ceramic)',
    steps: [
      'Make the crust first: combine flour and salt, cut in cold butter until the mixture resembles coarse sand with some pea-sized pieces — those butter chunks create flakiness. Add ice water one tablespoon at a time, tossing with a fork, until dough just holds together. Divide in half, flatten into discs, wrap and refrigerate at least 1 hour (or overnight).',
      'While the dough chills, prepare the filling: toss sliced fruit with sugar, starch, spices, and acid. Let it macerate 20–30 minutes — the released juices will saturate the starch, helping the filling thicken evenly.',
      'Roll the bottom crust on a lightly floured surface to about 12 inches in diameter. Transfer to the pie plate, letting the excess drape over the edge. Refrigerate while you roll the top crust.',
      'Add the filling to the chilled bottom crust, mounding it slightly in the center. Dot with butter if desired.',
      'Top with the second crust (whole, lattice, or cut-out vented). Fold and crimp the edges firmly — a good seal prevents the filling from bubbling out the sides.',
      'Brush the top crust with egg wash (1 egg + 1 tbsp water) for a golden sheen. Sprinkle with coarse sugar for texture.',
      'Cut vents in the top crust if using a solid top — this allows steam to escape and prevents a soggy top layer.',
      'Start baking at 425°F/220°C for the first 15–20 minutes (high heat sets the crust). Then reduce to 375°F/190°C for the remaining time.',
      'Place the pie on a rimmed baking sheet — filling always bubbles over. Line the baking sheet with foil for easy cleanup.',
      'Protect the edges with a pie shield or foil ring after the first 20 minutes if they brown too quickly.',
    ],
    doneness: 'Crust is deep golden brown; filling is actively bubbling through the vents (not just at the edges). Internal temperature 200°F/93°C.',
    coolingNote: 'Cool on a wire rack for at least 3–4 hours before slicing. The filling continues to thicken as it cools — slicing while warm produces a runny, soupy result.',
    tips: [
      'Cold fat = flaky crust. Keep butter in the freezer until you need it, and use truly ice-cold water.',
      'Don\'t overwork the dough — gluten development makes it tough and difficult to roll. Mix just until it holds together.',
      'A glass pie plate lets you see the bottom crust browning — pull the pie when the bottom is golden.',
      'Parbaking the bottom crust (blind baking 10 min) before adding the filling prevents a soggy bottom, especially for juicy stone fruit.',
    ],
  },

  'custard': {
    tempF: 350, tempC: 175, timeMin: 45, timeMax: 55,
    pan: '9-inch pie plate with fully blind-baked crust',
    steps: [
      'Blind bake the crust fully: line the unbaked crust with parchment, fill with pie weights or dried beans, and bake at 375°F/190°C for 20 minutes. Remove weights and liner, then bake another 10–12 minutes until the bottom is golden and dry. Let cool.',
      'While the crust bakes, prepare the custard: whisk together pumpkin (or squash) puree, eggs, sugars, spices, and evaporated milk until completely smooth.',
      'For a silkier texture, strain the custard through a fine-mesh sieve to remove any lumps or stringy egg bits.',
      'Reduce oven to 350°F/175°C. Pour the custard into the fully baked, cooled shell.',
      'Slide into the oven carefully — the custard is liquid and will spill easily. Use the oven rack pulled out halfway.',
      'Bake until the edges are set and the center has a gentle 2–3 inch wobble when the pan is nudged. The center will continue to set from carryover heat.',
      'The top should have a slight sheen and may show faint cracks at the very edge — that\'s normal.',
      'Cool on a wire rack for 1 hour, then refrigerate for at least 2 hours before serving.',
    ],
    doneness: 'Edges are fully set; center wobbles gently like jello when the pan is nudged. Internal temperature 175°F/79°C.',
    coolingNote: 'Refrigerate for a minimum of 2 hours — the custard firms up significantly as it cools. Serve cold or at cool room temperature.',
    tips: [
      'Do not skip the blind bake — a wet custard poured into a raw crust will produce a soggy, underbaked bottom.',
      'Overmixing the custard incorporates air that causes bubbles on the surface — whisk gently.',
      'Place a pie shield or foil ring on the crust edges before adding the custard filling to prevent over-browning.',
      'Roast your own pumpkin or sweet potato instead of using canned for deeper, more complex flavor.',
    ],
  },

  'meringue': {
    tempF: 350, tempC: 175, timeMin: 10, timeMax: 15,
    pan: '9-inch pie plate with fully blind-baked crust',
    steps: [
      'Blind bake and cool the crust completely before making the curd.',
      'Cook the lemon curd: whisk together sugar, cornstarch, and water in a saucepan. Add lemon juice and zest, then cook over medium heat, stirring constantly, until the mixture boils and thickens (about 2 minutes at a full boil to fully activate the starch).',
      'Temper in the egg yolks: remove from heat and slowly whisk a small amount of the hot curd into the beaten egg yolks, then return the egg mixture to the pot. Cook 2 more minutes over low heat.',
      'Remove from heat, whisk in butter until melted and glossy.',
      'Pour hot curd immediately into the baked shell.',
      'Make the meringue while the curd is still hot: beat egg whites with cream of tartar to soft peaks. Gradually add sugar, beating to stiff, glossy peaks that hold their shape.',
      'Spread or pipe the meringue over the HOT curd — the hot filling cooks the underside of the meringue from below, preventing the dreaded "weeping" separation.',
      'Make sure the meringue touches the crust edges all the way around to seal in the curd.',
      'Bake at 350°F/175°C for 10–15 minutes until the meringue peaks are golden.',
    ],
    doneness: 'Meringue peaks are golden brown; interior temperature of meringue reaches 160°F/71°C for food safety.',
    coolingNote: 'Cool at room temperature for 1 hour, then refrigerate. The meringue weeps slightly if refrigerated before it cools — let it set at room temp first.',
    tips: [
      'The most important rule: spread meringue over a hot filling, not a cool one. This prevents the rubbery, weeping layer at the bottom.',
      'Any trace of fat (yolk, grease) prevents meringue from whipping — use spotlessly clean bowls and beaters.',
      'Cornstarch (1 tsp) stabilizes the meringue and prevents weeping in humid conditions.',
      'Cover leftovers loosely — plastic wrap touching the meringue causes condensation and collapse.',
    ],
  },

  'acid-set': {
    tempF: 325, tempC: 165, timeMin: 15, timeMax: 20,
    pan: '9-inch pie plate with pressed crumb crust',
    steps: [
      'Make the crumb crust: mix graham cracker crumbs, sugar, salt, and melted butter until the texture resembles wet sand. Press firmly into the bottom and up the sides of the pie plate using the bottom of a measuring cup.',
      'Bake the crust at 350°F/175°C for 8–10 minutes until it smells toasted and feels dry to the touch. Cool completely.',
      'Make the filling: whisk together sweetened condensed milk, citrus juice, and egg yolks until smooth. The acid reacts with the milk proteins immediately — the mixture will thicken slightly as you stir.',
      'Pour filling into the cooled crust.',
      'Bake at 325°F/165°C for 15–20 minutes — the filling should be mostly set but have a slight jiggle in the center.',
      'Cool at room temperature for 30 minutes, then refrigerate for at least 3 hours (overnight is best) before serving.',
      'Serve cold with freshly whipped cream.',
    ],
    doneness: 'Filling is set around the edges with a slight jiggle in the center; surface should be opaque. Internal temperature 155°F/68°C.',
    coolingNote: 'Refrigerate for a minimum of 3 hours — the acid-set mechanism continues to firm the filling as it cools. Best served the next day.',
    tips: [
      'Real citrus juice (not bottled) gives the best flavor and highest acidity — important for proper acid-setting.',
      'Don\'t overbake — the filling will become rubbery. Remove it while the center still jiggles.',
      'A frozen version (Key Lime Ice Cream Pie) is made by doubling the recipe, freezing in a graham crust, and serving semifrozen.',
      'The egg yolks are optional but add richness and help with baking stability.',
    ],
  },

  'cream': {
    tempF: 350, tempC: 175, timeMin: 20, timeMax: 25,
    pan: '9-inch pie plate with fully blind-baked or crumb crust',
    steps: [
      'Blind bake or prepare your crumb crust and cool completely before filling.',
      'Make the pastry cream: whisk together sugar, cornstarch, and egg yolks in a bowl until pale and smooth.',
      'Heat milk (and cream, if using) in a saucepan over medium heat until steaming and just beginning to simmer.',
      'Temper the hot milk into the egg mixture: slowly pour a thin stream of hot milk into the eggs while whisking constantly. This raises the temperature of the eggs without scrambling them.',
      'Return the entire mixture to the saucepan and cook over medium heat, whisking constantly, until the mixture thickens and comes to a FULL boil. Hold the boil for 2 full minutes — this is essential to fully activate the starch and eliminate starchy flavor.',
      'Remove from heat. For chocolate cream, whisk in cocoa or chopped chocolate now. For vanilla, add vanilla extract.',
      'Whisk in butter until glossy and smooth.',
      'Pour through a fine-mesh strainer into a clean bowl. Press plastic wrap directly onto the surface (touching the cream) to prevent a skin from forming.',
      'Cool to room temperature, then refrigerate for at least 2 hours until fully set.',
      'Pour chilled pastry cream into the prepared crust. Top with freshly whipped cream.',
    ],
    doneness: 'Pastry cream must reach a full boil (bubbles break through the surface) and be held at a boil for 2 minutes.',
    coolingNote: 'Cool the pastry cream to room temperature before adding to the crust. Add whipped cream topping only just before serving — it will deflate if added too early.',
    tips: [
      'Cooking to a full boil is the most important step — undercooked pastry cream has a raw, starchy flavor and won\'t set firmly.',
      'Pressing plastic wrap directly onto the cream surface prevents a tough skin from forming.',
      'Stabilize whipped cream with 1 tsp of cornstarch or a splash of heavy cream stabilizer to prevent it from weeping if the pie will sit for more than an hour.',
      'For banana cream, add banana slices just before serving — they brown quickly even with lemon juice.',
    ],
  },

  'sugar-syrup': {
    tempF: 350, tempC: 175, timeMin: 50, timeMax: 60,
    pan: '9-inch pie plate with unbaked single crust',
    steps: [
      'Prepare the crust but do NOT blind bake — pecan filling is poured into an unbaked shell and bakes together.',
      'Make the filling: melt butter and whisk together with corn syrup, brown sugar, and salt until combined and smooth.',
      'Whisk in eggs one at a time until fully incorporated. Add vanilla and any other flavorings.',
      'Arrange pecan halves in an even layer in the unbaked crust. You can mix half into the filling and place the other half decoratively on top.',
      'Pour the filling slowly over the pecans — it will settle around them.',
      'Place the pie on a baking sheet to catch any drips. Bake at 350°F/175°C for 50–60 minutes.',
      'Check at 50 minutes: the filling should be almost set with only a small (1-inch) jiggle in the very center. The top should be deeply golden and the pecans toasted.',
      'If the edges of the crust brown too quickly, cover with foil or a pie shield.',
    ],
    doneness: 'The filling is puffed and set at the edges with only a small jiggle in the center. The top is deep golden brown. Internal temperature 200°F/93°C.',
    coolingNote: 'Cool completely on a wire rack — at least 3–4 hours. The filling continues to set and firm as it cools. Serve at room temperature.',
    tips: [
      'The key doneness cue: the filling should be almost still in the center but not liquid. Pull it earlier than you think — it sets up firm as it cools.',
      'Toast the pecans in the oven (350°F, 8 min) before adding to the pie for deeper, nuttier flavor.',
      'Room-temperature eggs blend more smoothly into the filling than cold ones — fewer curdled bits.',
      'For a silky filling without air bubbles, stir gently (don\'t whisk vigorously) once the eggs are added.',
    ],
  },

  'chess': {
    tempF: 325, tempC: 165, timeMin: 45, timeMax: 55,
    pan: '9-inch pie plate with unbaked single crust',
    steps: [
      'Do NOT blind bake the crust — chess filling bakes in an unbaked shell.',
      'Melt butter and whisk with sugar until dissolved and combined.',
      'Whisk in eggs one at a time. Add cornmeal, vanilla, and vinegar (if using). Mix until completely smooth.',
      'Pour filling into the unbaked shell.',
      'Bake at 325°F/165°C — the lower temperature gives the delicate sugar custard more time to set evenly without curdling.',
      'The pie is done when the top forms a papery, slightly crackled surface and the edges are fully set with only a 2-inch jiggle in the center.',
      'Cool completely before slicing — at least 3 hours at room temperature.',
    ],
    doneness: 'Top surface has a papery, slightly crackled golden crust. Edges are set; center has a gentle 2-inch wobble. Internal temperature 185°F/85°C.',
    coolingNote: 'Cool fully before slicing — this pie is extremely soft when warm and will not hold a slice. Best at room temperature or cold.',
    tips: [
      'The cornmeal is the secret ingredient — it absorbs moisture and gives the filling its characteristic slightly grainy, fudgy texture.',
      'Don\'t worry if the top cracks slightly during cooling — that\'s the expected result for chess pie.',
      'The vinegar version (original Virginia chess pie) adds tartness that balances the extreme sweetness beautifully.',
      'Lemon chess pie: swap the vinegar for fresh lemon juice and add lemon zest for a bright citrus variation.',
    ],
  },

  'crumb': {
    tempF: 375, tempC: 190, timeMin: 40, timeMax: 50,
    pan: '9-inch deep-dish pie plate with single unbaked crust',
    steps: [
      'Make the crumb topping first: rub flour, brown sugar, butter, and spices together with your fingers until the mixture forms clumps ranging from sandy to pea-sized. Refrigerate while making the base.',
      'Make the molasses base: dissolve baking soda in hot water, then stir in molasses until combined. The mixture will foam slightly — that\'s normal.',
      'Pour the molasses base into the unbaked crust.',
      'Scatter the crumb topping evenly over the molasses. For wet-bottom style, add half the crumbs, pour half the molasses, then repeat for distinct layers.',
      'Bake at 375°F/190°C for 40–50 minutes until the crumb topping is golden brown and the edges of the filling are set.',
      'The center may still appear slightly jiggly — it firms as it cools.',
    ],
    doneness: 'Crumb topping is deep golden brown and set; edges of molasses layer are firm. A toothpick inserted in the center should come out mostly clean.',
    coolingNote: 'Cool completely before cutting. The molasses layer firms considerably as it cools — warm pie will be extremely sticky and gooey.',
    tips: [
      'Wet-bottom vs dry-bottom: use more molasses and fewer crumbs for a gooey sticky base; more crumbs for a cake-like filling.',
      'Real blackstrap molasses gives the most intense, bittersweet flavor; light molasses is milder.',
      'Shoofly pie is traditionally served for breakfast in Pennsylvania Dutch country — pairs perfectly with coffee.',
      'The baking soda + molasses combination provides both leavening and characteristic dark flavor.',
    ],
  },

  'mousse': {
    tempF: 0, tempC: 0, timeMin: 240, timeMax: 300,
    pan: '9-inch pie plate with fully baked crust — chill time 4–5 hours, no baking filling',
    steps: [
      'Blind bake and cool the crust completely. (Or prepare a crumb crust and chill it.)',
      'Melt chocolate: chop dark chocolate finely. Melt in a double boiler or microwave in 30-second bursts, stirring between each, until smooth. Cool to exactly room temperature — warm chocolate will melt the butter.',
      'Beat softened butter with an electric mixer until very light and fluffy, about 3–4 minutes.',
      'Gradually add sugar, beating continuously. Scrape down the bowl frequently.',
      'Add eggs one at a time (or in batches), beating for 3–5 full minutes after each addition. This extended beating is what creates the silky, mousse-like texture — do not rush it.',
      'Fold in the cooled melted chocolate until fully incorporated and smooth.',
      'In a separate bowl, whip heavy cream to medium-soft peaks.',
      'Fold half the whipped cream into the chocolate mixture to lighten it, then fold in the rest gently.',
      'Pour into the cooled crust and smooth the surface.',
      'Refrigerate for at least 4–5 hours (overnight is ideal) until completely set.',
    ],
    doneness: 'Filling is firm when touched and holds a clean edge when sliced. Internal temperature should be below 40°F/4°C after chilling.',
    coolingNote: 'Keep refrigerated until serving. Remove from fridge 15 minutes before serving for optimal texture — too cold and it\'s rubbery; room temperature and it softens.',
    tips: [
      'ALL ingredients must be at exactly room temperature — cold butter or chocolate creates a grainy, broken filling.',
      'The extended beating after each egg is non-negotiable for the silky texture — each addition needs full incorporation.',
      'Use the highest-quality dark chocolate you can find — the flavor is the entire point of this pie.',
      'Note: Traditional French Silk uses raw eggs. For food safety, use pasteurized eggs or a heat-treated version.',
    ],
  },

  'layered-cream': {
    tempF: 0, tempC: 0, timeMin: 120, timeMax: 180,
    pan: '9-inch pie plate with blind-baked or crumb crust — chill time 2–3 hours',
    steps: [
      'Prepare and cool the crust completely.',
      'Make vanilla pastry cream (see Chocolate Cream Pie instructions). Pour through a strainer, press plastic wrap directly onto the surface, and refrigerate until cold and set, at least 2 hours.',
      'Prepare the fresh fruit: slice bananas thinly and toss with a squeeze of lemon juice to slow browning. Pat dry.',
      'To assemble: spread a thin layer of pastry cream on the bottom of the crust.',
      'Arrange a layer of banana slices evenly over the cream.',
      'Spread another layer of pastry cream over the bananas.',
      'Repeat — another banana layer, then a final pastry cream layer on top.',
      'Whip heavy cream with a little sugar and vanilla to medium peaks. Spread or pipe over the top layer of pastry cream.',
      'Garnish and refrigerate for at least 1 hour to let the layers meld.',
      'Serve the same day — banana cream pie deteriorates quickly after assembly.',
    ],
    doneness: 'Assembled pie is cold and firm throughout; pastry cream layer holds its shape when sliced.',
    coolingNote: 'Serve within 6–8 hours of assembly for best texture and appearance. The bananas discolor and the pastry cream weeps after that.',
    tips: [
      'Assemble the pie as close to serving as possible — banana cream is not a make-ahead dessert.',
      'For extra stability, fold 1 tsp of unflavored gelatin (dissolved in 1 tbsp water) into the pastry cream before layering.',
      'A thin chocolate layer between the pastry cream and crust adds texture and prevents the crust from softening.',
      'Stabilize the whipped cream topping with 1 tsp instant vanilla pudding mix to keep it holding for longer.',
    ],
  },

  'savory-pastry': {
    tempF: 400, tempC: 205, timeMin: 35, timeMax: 45,
    pan: '9-inch deep-dish pie plate or 2-quart baking dish',
    steps: [
      'Make the pastry and refrigerate the bottom disc. Roll out the bottom crust and fit it into the pie plate. Refrigerate while making the filling.',
      'Cook the filling: melt butter in a large skillet. Cook aromatics (onion, celery, carrot) until softened, 5–7 minutes.',
      'Add flour and stir to coat the vegetables. Cook the roux for 1–2 minutes to eliminate the raw flour taste.',
      'Add broth gradually, whisking after each addition to prevent lumps. Add milk or cream. Simmer until the sauce thickens to a nappe consistency (coats the back of a spoon).',
      'Add pre-cooked chicken (or other proteins) and any par-cooked vegetables. Season generously with salt, pepper, and herbs.',
      'Let the filling cool to room temperature before adding to the crust — hot filling melts the butter in the pastry and ruins the flakiness.',
      'Pour cooled filling into the crust-lined dish.',
      'Top with the second crust, trim, fold, and crimp the edges.',
      'Brush with egg wash and cut 5–6 steam vents.',
      'Bake at 400°F/205°C for 35–45 minutes until the crust is deep golden and the filling is bubbling.',
    ],
    doneness: 'Crust is deep golden brown; filling is actively bubbling through the vents. Internal temperature 165°F/74°C (meat filling).',
    coolingNote: 'Rest for 10–15 minutes before serving — the filling is extremely hot and will burn your mouth. The sauce thickens slightly as it cools.',
    tips: [
      'The filling must be at room temperature before going into the crust — hot filling softens the pastry fat and prevents flakiness.',
      'The sauce should be slightly thicker than you want in the finished pie — it thins slightly during baking.',
      'Pre-cook all proteins and vegetables until they are just done — they will finish cooking inside the pie.',
      'A dot of butter on top of the filling before adding the top crust enriches the sauce.',
    ],
  },

  'savory-casserole': {
    tempF: 375, tempC: 190, timeMin: 25, timeMax: 35,
    pan: '2–3 quart baking dish or cast iron pan',
    steps: [
      'Cook the meat filling: brown minced meat (lamb for shepherd\'s, beef for cottage pie) in batches over high heat. Crowding the pan steams rather than sears — brown in small batches for maximum flavor.',
      'Add aromatics, tomato paste, Worcestershire, and herbs. Cook until softened.',
      'Add stock and simmer 15–20 minutes until the filling thickens and the flavors concentrate. Season generously.',
      'Make the mashed potato topping: boil peeled potato chunks until fork-tender, drain completely, and rice or mash until smooth. Beat in hot butter and warm milk. Season heavily with salt and pepper.',
      'Taste the mash — it should be well-seasoned on its own since it acts as the "crust."',
      'Transfer the meat filling to the baking dish. Spread the mashed potato evenly over the top, or pipe with a star tip for a decorative finish.',
      'Use a fork to create ridges in the potato surface — these ridges brown and crisp more dramatically.',
      'Bake at 375°F/190°C for 25–35 minutes until the potato topping is golden brown and the filling is bubbling around the edges.',
    ],
    doneness: 'Potato topping is golden brown and slightly crisp on the peaks; filling is bubbling around the edges. Internal temperature 165°F/74°C.',
    coolingNote: 'Rest 5–10 minutes before serving. The filling will be very hot — let it settle for a clean scoop.',
    tips: [
      'Drain the cooked potatoes thoroughly — excess moisture makes the mash watery and prevents browning.',
      'Warm the butter and milk before adding to the mash — cold dairy makes the potatoes gluey.',
      'A brush of melted butter or egg yolk on the mash top accelerates browning and adds shine.',
      'Make-ahead tip: assemble the shepherd\'s pie unbaked, refrigerate up to 2 days, and bake from cold — add 15–20 minutes to the baking time.',
    ],
  },
};

// Map current category IDs → baking data keys
const ID_MAP: Record<string, string> = {
  'fruit':   'fruit-double',
  'custard': 'custard',
  'sugar':   'sugar-syrup',
  'cream':   'cream',
  'mousse':  'mousse',
  'savory':  'savory-pastry',
};

export function PieBakingInstructions({ pieTypeId, crustTypeId, totalWeight, servings, measurementMode, recipeName }: PieBakingInstructionsProps) {
  const resolvedId = ID_MAP[pieTypeId] ?? pieTypeId;
  const data = PIE_BAKING_DATA[resolvedId];

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="text-center py-8 text-gray-400">
          <span className="text-4xl mb-3 block">🥧</span>
          <p>Select a pie type to see baking instructions.</p>
        </div>
      </div>
    );
  }

  const isNoHeat = data.tempF === 0;
  const isMetric = measurementMode === 'metric';
  const temp = isMetric ? `${data.tempC}°C` : `${data.tempF}°F`;
  const timeRange = `${data.timeMin}–${data.timeMax} ${isNoHeat ? 'min chill time' : 'minutes'}`;

  return (
    <div className="space-y-4">
      {/* Quick stats bar */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-amber-50 rounded-xl p-3">
            <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{isNoHeat ? 'No Bake' : temp}</div>
            <div className="text-xs text-gray-500">Oven Temp</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{timeRange}</div>
            <div className="text-xs text-gray-500">{isNoHeat ? 'Chill Time' : 'Bake Time'}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <Layers className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{servings}</div>
            <div className="text-xs text-gray-500">Slices</div>
          </div>
        </div>
      </div>

      {/* Pan / setup */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span>🍽️</span> Pan & Setup
        </h3>
        <p className="text-sm text-gray-700">{data.pan}</p>
        {totalWeight > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Total yield: {isMetric ? `${Math.round(totalWeight)}g` : `${(totalWeight / 453.592).toFixed(2)} lb`} · Approx. {Math.round(totalWeight / servings)}g per slice
          </p>
        )}
      </div>

      {/* Step by step */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📋</span> Step-by-Step Method
        </h3>
        <ol className="space-y-4">
          {data.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Doneness */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
        <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
          <span>✅</span> How to Know It's Done
        </h3>
        <p className="text-sm text-amber-900">{data.doneness}</p>
      </div>

      {/* Cooling */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          <span>❄️</span> Cooling & Serving
        </h3>
        <p className="text-sm text-blue-900">{data.coolingNote}</p>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600" />
          <span>Pro Tips</span>
        </h3>
        <ul className="space-y-3">
          {data.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-amber-500 flex-shrink-0 mt-0.5">💡</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pie Science Articles */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Learn the Science</span>
        </h3>
        <p className="text-xs text-gray-500 mb-3">Understand why pie works the way it does</p>
        <div className="space-y-2">
          <a
            href="https://senseifood.com/pie-science/why-pie-crust-is-flaky"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-amber-300 hover:bg-amber-50 transition-all group"
          >
            <span className="text-xl">🥧</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 group-hover:text-amber-700">Why Pie Crust Is Flaky</div>
              <div className="text-xs text-gray-400">The science of fat, gluten & lamination</div>
            </div>
            <span className="text-gray-300 group-hover:text-amber-400 text-xs">↗</span>
          </a>
          <a
            href="https://senseifood.com/pie-science/why-pie-crust-shrinks"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-amber-300 hover:bg-amber-50 transition-all group"
          >
            <span className="text-xl">📐</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 group-hover:text-amber-700">Why Pie Crust Shrinks</div>
              <div className="text-xs text-gray-400">Gluten tension, resting & blind baking</div>
            </div>
            <span className="text-gray-300 group-hover:text-amber-400 text-xs">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
