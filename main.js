console.log("V0.6 Beta");

// Wrapped so it is safe to load once, in <head> (with defer) or at the end of <body>.
(function(){
if(window.__sampleSelectorLoaded) return; window.__sampleSelectorLoaded=true;
function init(){
/* ---------- Product data ----------
   Source: Sample_shop_categories_Ostomy_Continence.xlsx, sheet "2026 Pricing".
   SNAPSHOT holds the sheet's rows in column order (SHEET_COLS). Products are built from those rows:
   - one product per web-shop group: column N has a catalogue link on the first row of each group and is blank on the rest
   - categories come from the sheet (Category, Sub-category, Baseplate type, Pouch type, Coupling ring, Hole size, Colour, Size);
     where the sheet is blank (continence categories, 1-piece pouch types) they are worked out from the description
     (see CONT_RULES and pouchTypeOf below).
   LIVE OPTION: publish each sheet (tab) as CSV and paste the URL(s) into LIVE_CSV_URL, e.g. ['https://…ostomy.csv','https://…continence.csv'].
   The page loads the latest rows every time it opens (it falls back to SNAPSHOT if a request fails). The SAS Code and
   max-quantity columns are deliberately not used. */
const LIVE_CSV_URL='';   // a URL string or an array of URLs
const SHEET_COLS=['area','category','ring','hole','colour','sub','baseType','pouchType','size','spec','mmm','vol','code','desc','packQty','uom','web'];
const SHEET_HEADERS=[['business area'],['category'],['coupling ring'],['hole size'],['colour'],['sub-category'],['baseplate type'],['pouch type'],['size'],['specifications'],['mini / midi / maxi'],['volume'],['material'],['description'],['pack size','pack qty'],['purchase suom'],['images & summary for web-shop']];
const SNAPSHOT=[
["Ostomy", "2 Piece Mechanical", "45mm", "CTF 15-30", "", "Baseplate", "Flat", "", "", "", "", "", "936415P", "FLEXIMA 3S BASE PLATE 45/15-30", 5, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007541/flexima-3s-flat-wafers-two-piece-ostomy-bag-system"],
["Ostomy", "2 Piece Mechanical", "45mm", "PC 20", "", "Baseplate", "Flat", "", "", "", "", "", "936420P", "FLEXIMA 3S BASE PLATE 45/20", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "PC 25", "", "Baseplate", "Flat", "", "", "", "", "", "936425P", "FLEXIMA 3S BASE PLATE 45/25", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "PC 30", "", "Baseplate", "Flat", "", "", "", "", "", "936430P", "FLEXIMA 3S BASE PLATE 45/30", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "CTF 15-40", "", "Baseplate", "Flat", "", "", "", "", "", "936515P", "FLEXIMA 3S BASE PLATE 55/15-40", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "PC 35", "", "Baseplate", "Flat", "", "", "", "", "", "936535P", "FLEXIMA 3S BASE PLATE 55/35", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "PC 40", "", "Baseplate", "Flat", "", "", "", "", "", "936540P", "FLEXIMA 3S BASE PLATE 55/40", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "CTF 15-50", "", "Baseplate", "Flat", "", "", "", "", "", "936615P", "FLEXIMA 3S BASE PLATE 65/15-50", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "PC 45", "", "Baseplate", "Flat", "", "", "", "", "", "936645P", "FLEXIMA 3S BASE PLATE 65/45", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "80mm", "CTF 15-65", "", "Baseplate", "Flat", "", "", "", "", "", "936815P", "FLEXIMA 3S BASE PLATE 80/15-65", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Beige", "Pouch", "", "Closed", "", "", "MAXI", "665ml", "931445P", "FLEXIMA 3S CLOSED MAXI BEIGE 45", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007527/flexima-3s-colostomy-bags-two-piece-system"],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Beige", "Pouch", "", "Closed", "", "", "MAXI", "655ml", "931455P", "FLEXIMA 3S CLOSED MAXI BEIGE 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Beige", "Pouch", "", "Closed", "", "", "MAXI", "630ml", "931465P", "FLEXIMA 3S CLOSED MAXI BEIGE 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "80mm", "", "Beige", "Pouch", "", "Closed", "", "", "MAXI", "510ml", "931480P", "FLEXIMA 3S CLOSED MAXI BEIGE 80", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Transparent", "Pouch", "", "Closed", "", "", "MAXI", "665ml", "931545P", "FLEXIMA 3S CLOSED MAXI TRSP 45", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Transparent", "Pouch", "", "Closed", "", "", "MAXI", "655ml", "931555P", "FLEXIMA 3S CLOSED MAXI TRSP 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Transparent", "Pouch", "", "Closed", "", "", "MAXI", "630ml", "931565P", "FLEXIMA 3S CLOSED MAXI TRSP 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "80mm", "", "Transparent", "Pouch", "", "Closed", "", "", "MAXI", "510ml", "931580P", "FLEXIMA 3S CLOSED MAXI TRSP 80", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Beige", "Pouch", "", "Closed", "", "", "MIDI", "520ml", "931045P", "FLEXIMA 3S CLOSED MIDI BEIGE 45", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Beige", "Pouch", "", "Closed", "", "", "MIDI", "500ml", "931055P", "FLEXIMA 3S CLOSED MIDI BEIGE 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Beige", "Pouch", "", "Closed", "", "", "MIDI", "465ml", "931065P", "FLEXIMA 3S CLOSED MIDI BEIGE 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "CTF 15-26", "", "Baseplate", "Convex", "", "", "", "", "", "937415P", "FLEXIMA 3S CVX BASE PLATE 45/15-26", 5, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007536/flexima-3s-convex-wafers-two-piece-ostomy-bag-system"],
["Ostomy", "2 Piece Mechanical", "45mm", "PC 25", "", "Baseplate", "Convex", "", "", "", "", "", "937425P", "FLEXIMA 3S CVX BASE PLATE 45/25", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "CTF 15-36", "", "Baseplate", "Convex", "", "", "", "", "", "937515P", "FLEXIMA 3S CVX BASE PLATE 55/15-36", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "PC 30", "", "Baseplate", "Convex", "", "", "", "", "", "937530P", "FLEXIMA 3S CVX BASE PLATE 55/30", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "CTF 15-46", "", "Baseplate", "Convex", "", "", "", "", "", "937615P", "FLEXIMA 3S CVX BASE PLATE 65/15-46", 5, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Beige", "Pouch", "", "High flow", "", "", "MAXI", "970ml", "933055P", "FLEXIMA 3S HIGH FLOW MAXI BEIGE 55", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007531/flexima-3s-high-flow-bags-two-piece-system"],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Beige", "Pouch", "", "High flow", "", "", "MAXI", "940ml", "933065P", "FLEXIMA 3S HIGH FLOW MAXI BEIGE 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "80mm", "", "Beige", "Pouch", "", "High flow", "", "", "MAXI", "900ml", "933080P", "FLEXIMA 3S HIGH FLOW MAXI BEIGE 80", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Transparent", "Pouch", "", "High flow", "", "", "MAXI", "970ml", "933155P", "FLEXIMA 3S HIGH FLOW MAXI TRSP 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Transparent", "Pouch", "", "High flow", "", "", "MAXI", "940ml", "933165P", "FLEXIMA 3S HIGH FLOW MAXI TRSP 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "80mm", "", "Transparent", "Pouch", "", "High flow", "", "", "MAXI", "900ml", "933180P", "FLEXIMA 3S HIGH FLOW MAXI TRSP 80", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MAXI", "805ml", "932445P", "FLEXIMA 3S ROLL'UP MAXI BEIGE 45", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007529/flexima-3s-drainable-bags-two-piece-system"],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MAXI", "785ml", "932455P", "FLEXIMA 3S ROLL'UP MAXI BEIGE 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MAXI", "755ml", "932465P", "FLEXIMA 3S ROLL'UP MAXI BEIGE 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "80mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MAXI", "715ml", "932480P", "FLEXIMA 3S ROLL'UP MAXI BEIGE 80", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MAXI", "805ml", "932545P", "FLEXIMA 3S ROLL'UP MAXI TRSP 45", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MAXI", "785ml", "932555P", "FLEXIMA 3S ROLL'UP MAXI TRSP 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MAXI", "755ml", "932565P", "FLEXIMA 3S ROLL'UP MAXI TRSP 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "80mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MAXI", "715ml", "932580P", "FLEXIMA 3S ROLL'UP MAXI TRSP 80", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MIDI", "650ml", "932045P", "FLEXIMA 3S ROLL'UP MIDI BEIGE 45", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MIDI", "635ml", "932055P", "FLEXIMA 3S ROLL'UP MIDI BEIGE 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MIDI", "615ml", "932065P", "FLEXIMA 3S ROLL'UP MIDI BEIGE 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MIDI", "650ml", "932145P", "FLEXIMA 3S ROLL'UP MIDI TRSP 45", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MIDI", "635ml", "932155P", "FLEXIMA 3S ROLL'UP MIDI TRSP 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MIDI", "615ml", "932165P", "FLEXIMA 3S ROLL'UP MIDI TRSP 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Split cover beige", "Pouch", "", "Uro", "", "", "MIDI", "675ml", "934045P", "FLEXIMA 3S URO MIDI SPLIT COVER 45", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007532/flexima-softima-3s-urostomy-bags-two-piece-system"],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Split cover beige", "Pouch", "", "Uro", "", "", "MIDI", "635ml", "934055P", "FLEXIMA 3S URO MIDI SPLIT COVER 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Split cover beige", "Pouch", "", "Uro", "", "", "MIDI", "620ml", "934065P", "FLEXIMA 3S URO MIDI SPLIT COVER 65", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "45mm", "", "Transparent", "Pouch", "", "Uro", "", "", "MIDI", "675ml", "934145P", "FLEXIMA 3S URO MIDI TRSP 45", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "55mm", "", "Transparent", "Pouch", "", "Uro", "", "", "MIDI", "635ml", "934155P", "FLEXIMA 3S URO MIDI TRSP 55", 30, "", ""],
["Ostomy", "2 Piece Mechanical", "65mm", "", "Transparent", "Pouch", "", "Uro", "", "", "MIDI", "620ml", "934165P", "FLEXIMA 3S URO MIDI TRSP 65", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-65", "Split cover beige", "", "Soft flat", "Closed", "", "", "MAXI", "600ml", "4612380P", "FLEXIMA ACTIVE CLOSED MAXI SC 15-65", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006597/flexima-active-colostomy-bags-one-piece-system"],
["Ostomy", "1 Piece", "", "CTF 15-65", "Transparent", "", "Soft flat", "Closed", "", "", "MAXI", "600ml", "4611380P", "FLEXIMA ACTIVE CLOSED MAXI TRSP 15-65", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-50", "Split cover beige", "", "Soft flat", "Closed", "", "", "MIDI", "480ml", "4612115P", "FLEXIMA ACTIVE CLOSED MIDI SC 15-50", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 25", "Split cover beige", "", "Soft flat", "Closed", "", "", "MIDI", "480ml", "4610125P", "FLEXIMA ACTIVE CLOSED MIDI SC 25", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Split cover beige", "", "Soft flat", "Closed", "", "", "MIDI", "480ml", "4610130P", "FLEXIMA ACTIVE CLOSED MIDI SC 30", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 35", "Split cover beige", "", "Soft flat", "Closed", "", "", "MIDI", "480ml", "4610135P", "FLEXIMA ACTIVE CLOSED MIDI SC 35", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 40", "Split cover beige", "", "Soft flat", "Closed", "", "", "MIDI", "480ml", "4610140P", "FLEXIMA ACTIVE CLOSED MIDI SC 40", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-50", "Transparent", "", "Soft flat", "Closed", "", "", "MIDI", "480ml", "4611115P", "FLEXIMA ACTIVE CLOSED MIDI TRSP 15-50", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Split cover beige", "", "Soft flat", "Closed", "", "", "MINI", "220ml", "4612215P", "FLEXIMA ACTIVE CLOSED MINI SC 15-45", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Split cover beige", "", "Soft convex", "Closed", "", "", "MIDI", "450ml", "4612716P", "FLEXIMA ACTIVE O'CVX CL MIDI SC 15-45", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00015576/flexima-active-o-convex-colostomy-bags"],
["Ostomy", "1 Piece", "", "CTF 15-45", "Split cover beige", "", "Soft convex", "High flow", "", "", "MAXI", "920 ml", "4632716P", "FLEXIMA ACTIVE O'CVX HF MAXI SC 15-45", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00015574/flexima-active-o-convex-high-flow-bags"],
["Ostomy", "1 Piece", "", "CTF 15-35", "Split cover beige", "", "Soft convex", "Drainable", "", "", "MAXI", "700ml", "4622715P", "FLEXIMA ACTIVE O'CVX RUP MAXI SC 15-35", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00010144/flexima-active-o-convex-drainable-bags-one-piece-soft-convex-ostomy-bag"],
["Ostomy", "1 Piece", "", "CTF 15-45", "Split cover beige", "", "Soft convex", "Drainable", "", "", "MAXI", "690ml", "4622717P", "FLEXIMA ACTIVE O'CVX RUP MAXI SC 15-45", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Transparent", "", "Soft convex", "Drainable", "", "", "MAXI", "700ml", "4621716P", "FLEXIMA ACTIVE O'CVX RUP MAXI TRSP 15-45", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Split cover beige", "", "Soft convex", "Drainable", "", "", "MIDI", "580ml", "4622716P", "FLEXIMA ACTIVE O'CVX RUP MIDI SC 15-45", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-35", "Split cover beige", "", "Soft convex", "Uro", "", "", "MIDI", "670ml", "4642715P", "FLEXIMA ACTIVE O'CVX URO MIDI SC 15-35", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00010145/flexima-active-o-convex-urostomy-bags-one-piece-soft-convexity"],
["Ostomy", "1 Piece", "", "PC 25", "Split cover beige", "", "Soft convex", "Uro", "", "", "MIDI", "670ml", "4642725P", "FLEXIMA ACTIVE O'CVX URO MIDI SC 25", 10, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Split cover beige", "", "Soft convex", "Uro", "", "", "MIDI", "670ml", "4642730P", "FLEXIMA ACTIVE O'CVX URO MIDI SC 30", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-35", "Transparent", "", "Soft convex", "Uro", "", "", "MIDI", "670ml", "4641715P", "FLEXIMA ACTIVE O'CVX URO MIDI TRSP 15-35", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-65", "Beige", "", "Soft flat", "Drainable", "", "", "MAXI", "710ml", "4620380P", "FLEXIMA ACTIVE ROLL'UP MAXI BEIGE 15-65", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006612/flexima-active-drainable-bags-one-piece-ostomy-bag"],
["Ostomy", "1 Piece", "", "CTF 15-65", "Split cover beige", "", "Soft flat", "Drainable", "", "", "MAXI", "710ml", "4622380P", "FLEXIMA ACTIVE ROLL'UP MAXI SC 15-65", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-65", "Transparent", "", "Soft flat", "Drainable", "", "", "MAXI", "710ml", "4621380P", "FLEXIMA ACTIVE ROLL'UP MAXI TRSP 15-65", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-50", "Beige", "", "Soft flat", "Drainable", "", "", "MIDI", "580ml", "4620115P", "FLEXIMA ACTIVE ROLL'UP MIDI BEIGE 15-50", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 25", "Beige", "", "Soft flat", "Drainable", "", "", "MIDI", "580ml", "4620125P", "FLEXIMA ACTIVE ROLL'UP MIDI BEIGE 25", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Beige", "", "Soft flat", "Drainable", "", "", "MIDI", "580ml", "4620130P", "FLEXIMA ACTIVE ROLL'UP MIDI BEIGE 30", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 35", "Beige", "", "Soft flat", "Drainable", "", "", "MIDI", "580ml", "4620135P", "FLEXIMA ACTIVE ROLL'UP MIDI BEIGE 35", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 40", "Beige", "", "Soft flat", "Drainable", "", "", "MIDI", "580ml", "4620140P", "FLEXIMA ACTIVE ROLL'UP MIDI BEIGE 40", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-50", "Split cover beige", "", "Soft flat", "Drainable", "", "", "MIDI", "580ml", "4622115P", "FLEXIMA ACTIVE ROLL'UP MIDI SC 15-50", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-50", "Transparent", "", "Soft flat", "Drainable", "", "", "MIDI", "580ml", "4621115P", "FLEXIMA ACTIVE ROLL'UP MIDI TRSP 15-50", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Beige", "", "Soft flat", "Drainable", "", "", "MINI", "260ml", "4620215P", "FLEXIMA ACTIVE ROLL'UP MINI BEIGE 15-45", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Split cover beige", "", "Soft flat", "Drainable", "", "", "MINI", "260ml", "4622215P", "FLEXIMA ACTIVE ROLL'UP MINI SC 15-45", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Beige", "", "Convex", "Closed", "", "", "MIDI", "430ml", "44018P", "FLEXIMA CLOSED CVX MIDI BEIGE 15-45", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004603/flexima-convex-colostomy-bags-one-piece-system"],
["Ostomy", "1 Piece", "", "PC 30", "Beige", "", "Convex", "Closed", "", "", "MIDI", "430ml", "44031P", "FLEXIMA CLOSED CVX MIDI BEIGE 30", 10, "", ""],
["Ostomy", "1 Piece", "", "PC 35", "Beige", "", "Convex", "Closed", "", "", "MIDI", "430ml", "44037P", "FLEXIMA CLOSED CVX MIDI BEIGE 35", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Transparent", "", "Convex", "Closed", "", "", "MIDI", "430ml", "44118P", "FLEXIMA CLOSED CVX MIDI TRSP 15-45", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-75", "Split cover beige", "", "Flat", "Closed", "", "", "MAXI", "590ml", "044070P", "FLEXIMA CLOSED MAXI SPLIT COVER 15-75", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00000889/flexima-flat-colostomy-bags-one-piece-system"],
["Ostomy", "1 Piece", "", "CTF 15-75", "Transparent", "", "Flat", "Closed", "", "", "MAXI", "590ml", "044170P", "FLEXIMA CLOSED MAXI TRSP 15-75", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-60", "Beige", "", "Flat", "Closed", "", "", "MIDI", "465ml", "044015P", "FLEXIMA CLOSED MIDI BEIGE 15-60", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 25", "Beige", "", "Flat", "Closed", "", "", "MIDI", "465ml", "044025P", "FLEXIMA CLOSED MIDI BEIGE 25", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Beige", "", "Flat", "Closed", "", "", "MIDI", "465ml", "044030P", "FLEXIMA CLOSED MIDI BEIGE 30", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 35", "Beige", "", "Flat", "Closed", "", "", "MIDI", "465ml", "044035P", "FLEXIMA CLOSED MIDI BEIGE 35", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 40", "Beige", "", "Flat", "Closed", "", "", "MIDI", "465ml", "044040P", "FLEXIMA CLOSED MIDI BEIGE 40", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 45", "Beige", "", "Flat", "Closed", "", "", "MIDI", "465ml", "044045P", "FLEXIMA CLOSED MIDI BEIGE 45", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-60", "Transparent", "", "Flat", "Closed", "", "", "MIDI", "465ml", "044115P", "FLEXIMA CLOSED MIDI TRSP 15-60", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Beige", "", "Flat", "Closed", "", "", "MINI", "200ml", "44212P", "FLEXIMA CLOSED MINI BEIGE 15-45", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-75", "Beige", "", "Flat", "High flow", "", "", "MAXI", "690ml", "42970P", "FLEXIMA HIGH FLOW MAXI BEIGE 15-76", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006551/flexima-high-flow-bags-one-piece-ostomy-bag"],
["Ostomy", "1 Piece", "", "CTF 15-76", "Transparent", "", "Flat", "High flow", "", "", "MAXI", "690ml", "42971P", "FLEXIMA HIGH FLOW MAXI TRSP 15-76", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "40mm", "CTF 15-35", "", "Baseplate", "Flat", "", "", "", "", "40mm", "62040P", "FLEXIMA KEY BASE PLATE 40/15-35", 5, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00002985/flexima-key-3s-flat-wafers-two-piece-ostomy-bag-system"],
["Ostomy", "2 Piece Adhesive", "50mm", "CTF 15-45", "", "Baseplate", "Flat", "", "", "", "", "50mm", "62050P", "FLEXIMA KEY BASE PLATE 50/15-45", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "CTF 15-55", "", "Baseplate", "Flat", "", "", "", "", "60mm", "62060P", "FLEXIMA KEY BASE PLATE 60/15-55", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "80mm", "CTF 15-75", "", "Baseplate", "Flat", "", "", "", "", "80mm", "62080P", "FLEXIMA KEY BASE PLATE 80/15-75", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "", "Beige", "Pouch", "", "Closed", "", "", "MIDI", "550ml", "62160P", "FLEXIMA KEY CLOSED MAXI BEIGE 60", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00002986/flexima-key-colostomy-bags-two-piece-system"],
["Ostomy", "2 Piece Adhesive", "80mm", "", "Beige", "Pouch", "", "Closed", "", "", "MIDI", "520ml", "62180P", "FLEXIMA KEY CLOSED MAXI BEIGE 80", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "", "Transparent", "Pouch", "", "Closed", "", "", "MIDI", "550ml", "62260P", "FLEXIMA KEY CLOSED MAXI TRSP 60", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "80mm", "", "Transparent", "Pouch", "", "Closed", "", "", "MIDI", "520ml", "62280P", "FLEXIMA KEY CLOSED MAXI TRSP 80", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "40mm", "", "Beige", "Pouch", "", "Closed", "", "", "MIDI", "440ml", "62140P", "FLEXIMA KEY CLOSED MIDI BEIGE 40", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "50mm", "", "Beige", "Pouch", "", "Closed", "", "", "MIDI", "420ml", "62150P", "FLEXIMA KEY CLOSED MIDI BEIGE 50", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "40mm", "", "Transparent", "Pouch", "", "Closed", "", "", "MIDI", "440ml", "62240P", "FLEXIMA KEY CLOSED MIDI TRSP 40", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "50mm", "CTF 15-25", "", "Baseplate", "Convex", "", "", "", "", "50mm", "62052P", "FLEXIMA KEY CVX BASE PLATE 50/15-25", 5, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004772/flexima-key-3s-convex-wafers-two-piece-ostomy-bag-system"],
["Ostomy", "2 Piece Adhesive", "60mm", "CTF 15-35", "", "Baseplate", "Convex", "", "", "", "", "60mm", "62062P", "FLEXIMA KEY CVX BASE PLATE 60/15-35", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "CTF 15-45", "", "Baseplate", "Convex", "", "", "", "", "60mm", "62063P", "FLEXIMA KEY CVX BASE PLATE 60/15-45", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 25", "", "Baseplate", "Convex", "", "", "", "", "60mm", "62064P", "FLEXIMA KEY CVX BASE PLATE 60/25", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 30", "", "Baseplate", "Convex", "", "", "", "", "60mm", "62066P", "FLEXIMA KEY CVX BASE PLATE 60/30", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 35", "", "Baseplate", "Convex", "", "", "", "", "60mm", "62067P", "FLEXIMA KEY CVX BASE PLATE 60/35", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 40", "", "Baseplate", "Convex", "", "", "", "", "60mm", "62069P", "FLEXIMA KEY CVX BASE PLATE 60/40", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "CTF 15-35", "", "Baseplate", "Soft convex", "", "", "", "", "60mm", "62362P", "FLEXIMA KEY SOFT BASE PLATE CVX 60/15-35", 5, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00017275/flexima-key-soft-convex?bomUsage=B"],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 25", "", "Baseplate", "Soft convex", "", "", "", "", "60mm", "62363P", "FLEXIMA KEY SOFT BASE PLATE CVX 60/25", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 30", "", "Baseplate", "Soft convex", "", "", "", "", "60mm", "62364P", "FLEXIMA KEY SOFT BASE PLATE CVX 60/30", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "CTF 15-45", "", "Baseplate", "Soft convex", "", "", "", "", "", "62365P", "FLEXIMA KEY SOFT BASE PLATE CVX 60/15-45", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 35", "", "Baseplate", "Soft convex", "", "", "", "", "", "62366P", "FLEXIMA KEY SOFT BASE PLATE CVX 60/35", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "PC 40", "", "Baseplate", "Soft convex", "", "", "", "", "", "62367P", "FLEXIMA KEY SOFT BASE PLATE CVX 60/40", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "50mm", "CTF 15-25", "", "Baseplate", "Soft convex", "", "", "", "", "", "62352P", "FLEXIMA KEY SOFT BASE PLATE CVX 50/15-25", 5, "", ""],
["Ostomy", "2 Piece Adhesive", "50mm", "", "Beige", "Pouch", "", "High flow", "", "", "MAXI", "780ml", "62550P", "FLEXIMA KEY HIGH FLOW MAXI BEIGE 50", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004758/flexima-key-maxi-drainable-bags-two-piece-ostomy-bag-system"],
["Ostomy", "2 Piece Adhesive", "60mm", "", "Beige", "Pouch", "", "High flow", "", "", "MAXI", "730ml", "62560P", "FLEXIMA KEY HIGH FLOW MAXI BEIGE 60", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "80mm", "", "Transparent", "Pouch", "", "High flow", "", "", "MAXI", "655ml", "62680P", "FLEXIMA KEY HIGH FLOW MAXI TRSP 80", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "80mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MAXI", "610ml", "621280P", "FLEXIMA KEY ROLL'UP MAXI TRSP 80", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004757/flexima-key-drainable-bags-two-piece-ostomy-bag-system"],
["Ostomy", "2 Piece Adhesive", "80mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MAXI", "610ml", "621281P", "FLEXIMA KEY ROLL'UP MAXI BEIGE 80", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MAXI", "670ml", "621261P", "FLEXIMA KEY ROLL'UP MAXI BEIGE 60", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "60mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MAXI", "670ml", "621260P", "FLEXIMA KEY ROLL'UP MAXI TRSP 60", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "40mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MIDI", "550ml", "621241P", "FLEXIMA KEY ROLL'UP MIDI BEIGE 40", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "50mm", "", "Beige", "Pouch", "", "Drainable", "", "", "MIDI", "525ml", "621251P", "FLEXIMA KEY ROLL'UP MIDI BEIGE 50", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "40mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MIDI", "550ml", "621240P", "FLEXIMA KEY ROLL'UP MIDI TRSP 40", 30, "", ""],
["Ostomy", "2 Piece Adhesive", "50mm", "", "Transparent", "Pouch", "", "Drainable", "", "", "MIDI", "525ml", "621250P", "FLEXIMA KEY ROLL'UP MIDI TRSP 50", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-35", "Beige", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42717P", "FLEXIMA ROLL'UP CVX MIDI BEIGE 15-35", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004605/flexima-convex-drainable-bags-one-piece-ostomy-bag"],
["Ostomy", "1 Piece", "", "CTF 15-45", "Beige", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42718P", "FLEXIMA ROLL'UP CVX MIDI BEIGE 15-45", 10, "", ""],
["Ostomy", "1 Piece", "", "PC 25", "Beige", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42726P", "FLEXIMA ROLL'UP CVX MIDI BEIGE 25", 10, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Beige", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42731P", "FLEXIMA ROLL'UP CVX MIDI BEIGE 30", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-35", "Split cover beige", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42719P", "FLEXIMA ROLL'UP CVX MIDI SC 15-35", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Split cover beige", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42720P", "FLEXIMA ROLL'UP CVX MIDI SC 15-45", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-35", "Transparent", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42817P", "FLEXIMA ROLL'UP CVX MIDI TRSP 15-35", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-45", "Transparent", "", "Convex", "Drainable", "", "", "MIDI", "590ml", "42818P", "FLEXIMA ROLL'UP CVX MIDI TRSP 15-45", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-76", "Split cover beige", "", "Flat", "Drainable", "", "", "MAXI", "710ml", "42776P", "FLEXIMA ROLL'UP MAXI SPLIT COVER 15-75", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004752/flexima-flat-drainable-bags-one-piece-ostomy-bag"],
["Ostomy", "1 Piece", "", "CTF 15-60", "Beige", "", "Flat", "Drainable", "", "", "MIDI", "580ml", "42715P", "FLEXIMA ROLL'UP MIDI BEIGE 15-60", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 25", "Beige", "", "Flat", "Drainable", "", "", "MIDI", "580ml", "42725P", "FLEXIMA ROLL'UP MIDI BEIGE 25", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Beige", "", "Flat", "Drainable", "", "", "MIDI", "670ml", "42730P", "FLEXIMA ROLL'UP MIDI BEIGE 30", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 35", "Beige", "", "Flat", "Drainable", "", "", "MIDI", "580ml", "42735P", "FLEXIMA ROLL'UP MIDI BEIGE 35", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 40", "Beige", "", "Flat", "Drainable", "", "", "MIDI", "580ml", "42740P", "FLEXIMA ROLL'UP MIDI BEIGE 40", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-60", "Split cover beige", "", "Flat", "Drainable", "", "", "MIDI", "580ml", "42716P", "FLEXIMA ROLL'UP MIDI SPLIT COVER 15-60", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-60", "Transparent", "", "Flat", "Drainable", "", "", "MIDI", "580ml", "42815P", "FLEXIMA ROLL'UP MIDI TRSP 15-60", 30, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-35", "Beige", "", "Convex", "Uro", "", "", "MIDI", "615ml", "44919P", "FLEXIMA URO SILK CVX MIDI BEIGE 15-35", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004606/flexima-uro-silk-convex-urostomy-bags-one-piece-system"],
["Ostomy", "1 Piece", "", "CTF 15-25", "Transparent", "", "Convex", "Uro", "", "", "MIDI", "615ml", "44915P", "FLEXIMA URO SILK CVX MIDI TRSP 15-25", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-35", "Transparent", "", "Convex", "Uro", "", "", "MIDI", "615ml", "44917P", "FLEXIMA URO SILK CVX MIDI TRSP 15-35", 10, "", ""],
["Ostomy", "1 Piece", "", "PC 25", "Transparent", "", "Convex", "Uro", "", "", "MIDI", "615ml", "44920P", "FLEXIMA URO SILK CVX MIDI TRSP 25", 10, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Transparent", "", "Convex", "Uro", "", "", "MIDI", "615ml", "44922P", "FLEXIMA URO SILK CVX MIDI TRSP 30", 10, "", ""],
["Ostomy", "1 Piece", "", "CTF 15-55", "Beige", "", "Flat", "Uro", "", "", "MIDI", "630ml", "044914P", "FLEXIMA URO SILK MIDI BEIGE 12-55", 30, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00003274/flexima-uro-silk-flat-urostomy-bags-one-piece-system"],
["Ostomy", "1 Piece", "", "CTF 15-55", "Transparent", "", "Flat", "Uro", "", "", "MIDI", "630ml", "044913P", "FLEXIMA URO SILK MIDI TRSP 12-55", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 20", "Transparent", "", "Flat", "Uro", "", "", "MIDI", "630ml", "44820P", "FLEXIMA URO SILK MIDI TRSP 20", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 25", "Transparent", "", "Flat", "Uro", "", "", "MIDI", "630ml", "44825P", "FLEXIMA URO SILK MIDI TRSP 25", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 30", "Transparent", "", "Flat", "Uro", "", "", "MIDI", "630ml", "44830P", "FLEXIMA URO SILK MIDI TRSP 30", 30, "", ""],
["Ostomy", "1 Piece", "", "PC 35", "Transparent", "", "Flat", "Uro", "", "", "MIDI", "630ml", "44836P", "FLEXIMA URO SILK MIDI TRSP 35", 30, "", ""],
["Ostomy", "Ostomy accessories", "", "", "", "Flow collector", "", "", "", "2000ml", "", "2000ml", "039901P", "FLOW COLLECTOR", 5, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00003117/flow-collector-collecting-bag-for-high-stoma-output"],
["Ostomy", "Ostomy accessories", "", "", "White", "Belt", "", "", "", "60 - 120 cm / 3 mm", "", "", "5028P", "ALLY BELT", 1, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006944/ally-belt-ostomy-belt"],
["Ostomy", "Ostomy accessories", "", "", "Beige", "Belt", "", "", "", "Medium (118 - 200 cm / 3 cm)", "", "", "5031P", "ALLY BELT BEIGE MEDIUM", 1, "", ""],
["Ostomy", "Ostomy accessories", "", "", "Beige", "Belt", "", "", "", "Large (138 - 220 cm / 3 cm)", "", "", "5032P", "ALLY BELT BEIGE LARGE", 1, "", ""],
["Ostomy", "Ostomy accessories", "", "", "", "Barrier spray", "", "", "", "28ml", "", "", 5036, "ALLY BARRIER FILM 28ML SPRAY BOTTLE", 12, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006471/ally-barrier-film-spray"],
["Ostomy", "Ostomy accessories", "", "", "", "Adhesive remover", "", "", "", "50ml", "", "", "2005-1", "ALLY ADHESIVE REMOVER BV", 24, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006775/ally-adhesive-remover-for-ostomy-bag-system"],
["Ostomy", "Ostomy accessories", "", "", "", "Rings / Seals", "", "", "", "48 mm / 2.2 mm", "", "", 2022482, "Ally Ring 48mm / 2.2mm", 10, "", ""],
["Ostomy", "Ostomy accessories", "", "", "", "Rings / Seals", "", "", "", "48 mm / 3 mm", "", "", 2022483, "Ally Ring 48mm / 3mm", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00014655/ally-rings-ostomy-ring"],
["Ostomy", "Ostomy accessories", "", "", "", "Rings / Seals", "", "", "", "48 mm / 4.5 mm", "", "", 2022484, "Ally Ring 48mm / 4.5mm", 10, "", ""],
["Ostomy", "Ostomy accessories", "", "", "", "Rings / Seals", "", "", "", "98 mm / 3 mm", "", "", 2022983, "Ally Ring 98mm / 3mm", 10, "", ""],
["Ostomy", "Ostomy accessories", "", "", "", "Paste", "", "", "", "80g", "", "", 2022200, "Ally Paste (80gms)", 1, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00014659/ally-paste-ostomy-paste-without-alcohol"],
["Ostomy", "Ostomy accessories", "", "", "", "Powder", "", "", "", "28 g", "", "", 2022100, "Ally Powder (28gms)", 1, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00014661/ally-powder-ostomy-powder"],
["Ostomy", "Ostomy accessories", "", "", "", "Wafer extenders / Elastic tape", "", "", "", "80mm diameter", "", "", 2022300, "Ally wafer extenders", 20, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00014657/ally-wafer-extenders-ostomy-elastic-barrier-strips"],
["Ostomy", "Ostomy accessories", "", "", "", "Urine night bag", "", "", "", "2000ml", "", "2000ml", "28300A", "URIMED BAG 2L", 10, "", "https://catalogs.bbraun.com.au/en-AU/p/PRID00003164/urimed-bag-2-l-night-and-day-urine-collection-bag"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "226306AU", "ACTREEN GLYS SET NELATON CH06 20CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00001000/actreen-glys-set-nelaton-20-cm-female-and-paediatric-intermittent-catheter"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "226308AU", "ACTREEN GLYS SET NELATON CH08 20CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "226208AU", "ACTREEN GLYS SET NELATON CH08 45CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00001007/actreen-glys-set-nelaton-45-cm"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "226108AU", "ACTREEN GLYS SET TIEMANN CH08 45CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00001008/actreen-glys-set-tiemann-45-cm-long-male-intermittent-catheter"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238306AU", "ACTREEN HI-LITE CATH NELATON CH06 20CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007435/actreen-hi-lite-cath-nelaton-20cm"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238308AU", "ACTREEN HI-LITE CATH NELATON CH08 20CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238310AU", "ACTREEN HI-LITE CATH NELATON CH10 20CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238312AU", "ACTREEN HI-LITE CATH NELATON CH12 20CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238314AU", "ACTREEN HI-LITE CATH NELATON CH14 20CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238316AU", "ACTREEN HI-LITE CATH NELATON CH16 20CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238208AU", "ACTREEN HI-LITE CATH NELATON CH08 41CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007434/actreen-hi-lite-cath-nelaton-41cm"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238210AU", "ACTREEN HI-LITE CATH NELATON CH10 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238212AU", "ACTREEN HI-LITE CATH NELATON CH12 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238214AU", "ACTREEN HI-LITE CATH NELATON CH14 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238216AU", "ACTREEN HI-LITE CATH NELATON CH16 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238218AU", "ACTREEN HI-LITE CATH NELATON CH18 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238108AU", "ACTREEN HI-LITE CATH TIEMANN CH08 41CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007433/actreen-hi-lite-cath-tiemann-41cm"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238110AU", "ACTREEN HI-LITE CATH TIEMANN CH10 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238112AU", "ACTREEN HI-LITE CATH TIEMANN CH12 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238114AU", "ACTREEN HI-LITE CATH TIEMANN CH14 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238116AU", "ACTREEN HI-LITE CATH TIEMANN CH16 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "238118AU", "ACTREEN HI-LITE CATH TIEMANN CH18 41CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242210AU", "ACTREEN HI-LITE SET NELATON CH10 37CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00008986/actreen-hi-lite-set-nelaton-37-cm-long-male-intermittent-catheter"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242212AU", "ACTREEN HI-LITE SET NELATON CH12 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242214AU", "ACTREEN HI-LITE SET NELATON CH14 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242216AU", "ACTREEN HI-LITE SET NELATON CH16 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242218AU", "ACTREEN HI-LITE SET NELATON CH18 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242110AU", "ACTREEN HI-LITE SET TIEMANN CH10 37CM", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00008987/actreen-hi-lite-set-tiemann-37-cm-long-male-intermittent-catheter"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242112AU", "ACTREEN HI-LITE SET TIEMANN CH12 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242114AU", "ACTREEN HI-LITE SET TIEMANN CH14 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242116AU", "ACTREEN HI-LITE SET TIEMANN CH16 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "242118AU", "ACTREEN HI-LITE SET TIEMANN CH18 37CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228212AU", "ACTREEN LITE CATH NELATON CH12 45CM", 30, "Pack", "Not promoted. Old product."],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228214AU", "ACTREEN LITE CATH NELATON CH14 45CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228112AU", "ACTREEN LITE CATH TIEMANN CH12 45CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228114AU", "ACTREEN LITE CATH TIEMANN CH14 45CM", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228008AU", "ACTREEN MINI CATH CH08", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006179/actreen-mini-cath"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228010AU", "ACTREEN MINI CATH CH10", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228012AU", "ACTREEN MINI CATH CH12", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228014AU", "ACTREEN MINI CATH CH14", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "228016AU", "ACTREEN MINI CATH CH16", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "239010AU", "ACTREEN MINI SET CH10", 30, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007892/actreen-mini-set-nbsp"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "239012AU", "ACTREEN MINI SET CH12", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "239014AU", "ACTREEN MINI SET CH14", 30, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 28114, "MEDICARE BAG 2 L", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00000968/medicare-2-l-urine-collection-bag"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 28201, "URIMED TRIBAG PLUS STERIL 500 ML 2 CM", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00003392/urimed-tribag-plus"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 28203, "URIMED TRIBAG PLUS STERILE 500 ML 20 CM", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 28305, "URIMED TRIBAG PLUS STERILE 800 ML 60 CM", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 28306, "URIMED TRIBAG PLUS NON STERILE 800 ML 60", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 28610, "URIMED SP   URINE BAGS 10 UNITS", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004721/urimed-sp"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 28650, "URIMED SP   URINE BAGS 50 UNITS", 50, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "28150A", "URIMED BAG PLUS 1.5L", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004766/urimed-bag-plus-500-ml-urine-collection-leg-bag"],
["Continence", "Continence accessories", "", "", "", "", "", "", "", "", "", "", "28300A", "URIMED BAG 2L", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00003164/urimed-bag-2-l-night-and-day-urine-collection-bag"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "28431S", "UREOFIX 112 PLUS", 25, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00003393/ureofix-112-plus-closed-urine-drainage-system"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "28501A", "URIMED BAG PLUS 0.5L", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4801020, "URINE BAG 4L", 20, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006784/urine-bag-4-l-for-urine-drainage"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4801030, "URINE BAG 4L with Pump TURP", 20, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "68550R", "URIMED STRAP (Pair)", "120 Pairs", "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00004711/urimed-straps-fixation-for-urine-leg-bags"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 29260, "URIMED KLETT SMALL, BOX 10 PCS", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00000957/urimed-klett"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 29261, "URIMED KLETT LARGE 10", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 292600, "URIMED KLETT SMALL 50", 50, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 292610, "URIMED KLETT, LARGE, BOX 50 PCS", 50, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563312, "URIMED CATH FOLEY NELATON CH12", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00008625/urimed-cath-foley-nelaton-urinary-indwelling-catheter"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563314, "URIMED CATH FOLEY NELATON CH14", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563316, "URIMED CATH FOLEY NELATON CH16", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563318, "URIMED CATH FOLEY NELATON CH18", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563320, "URIMED CATH FOLEY NELATON CH20", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563322, "URIMED CATH FOLEY NELATON CH22", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563324, "URIMED CATH FOLEY NELATON CH24", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563412, "URIMED CATH FOLEY TIEMANN CH12", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00008626/urimed-cath-foley-tiemann"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563414, "URIMED CATH FOLEY TIEMANN CH14", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563416, "URIMED CATH FOLEY TIEMANN CH16", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563418, "URIMED CATH FOLEY TIEMANN CH18", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4563420, "URIMED CATH FOLEY TIEMANN CH20", 10, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "FB99841", "URO TAINER SOLUTION R CE 100ML", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00005442/uro-tainer-solutio-r"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "FB99853", "URO-TAINER M NACL 0,9%     INT  100ML CE", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00005443/uro-tainer-m-nacl-bladder-irrigation-solution-for-urinary-catheter-maintenance"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "FB99833", "URO-TAINER NACL 0,9%  INT    10X100ML CE", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00000096/uro-tainer-nacl-0-9-bladder-irrigation-solution-for-urinary-catheter-maintenance"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "FB99965", "URO-TAINER POLIHEXANIDE 0,02% 100ML CE", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00008677/uro-tainer-polihexanide-bladder-irrigation-solution-for-urinary-catheter-maintenance"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 9746625, "URO-TAINER SOLUTIO R   INT  TWIN 60ML CE", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00006141/uro-tainer-twin-solutio-r"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", "FB99839", "URO-TAINER SUBY G          INT  100ML CE", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00005441/uro-tainer-suby-g"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 9746609, "URO-TAINER SUBY G  INT      TWIN 60ML CE", 10, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00007415/uro-tainer-twin-suby-g"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450512, "CYSTOFIX DILATION INT BAL CH12", 5, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00000464/cystofix-exchange-sets"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450514, "CYSTOFIX DILATION INT BAL CH14", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450516, "CYSTOFIX DILATION INT BAL CH16", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450010, "CYSTOFIX EXCH/5 INT BAL W GUIDE CH10", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450012, "CYSTOFIX EXCH/5 INT BAL W GUIDE CH12", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450014, "CYSTOFIX EXCH/5 INT BAL W GUIDE CH14", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450016, "CYSTOFIX EXCH/5 INT BAL W GUIDE CH16", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450712, "CYSTOFIX EXCH/5 INT BAL WO GUIDE CH12", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450714, "CYSTOFIX EXCH/5 INT BAL WO GUIDE CH14", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450716, "CYSTOFIX EXCH/5 INT BAL WO GUIDE CH16", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450718, "CYSTOFIX EXCH/5 INT BAL WO GUIDE CH18", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450720, "CYSTOFIX EXCH/5 INT BAL WO GUIDE CH20", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450410, "CYSTOFIX SG SET INT BAL CH10", 5, "Pack", "https://catalogs.bbraun.com.au/en-AU/p/PRID00009852/cystofix-sg-set"],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450412, "CYSTOFIX SG SET INT BAL CH12", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450414, "CYSTOFIX SG SET INT BAL CH14", 5, "Pack", ""],
["Continence", "", "", "", "", "", "", "", "", "", "", "", 4450416, "CYSTOFIX SG SET INT BAL CH16", 5, "Pack", ""]
];

/* ---- category order and wording ---- */
const SYS_ORDER=['1 Piece','2 Piece Mechanical','2 Piece Adhesive','Accessories'];
const TYPE_ORDER=['Closed','Drainable','High flow','Uro'];
const TYPE_LABEL={'Closed':'Closed','Drainable':'Drainable','High flow':'High flow','Uro':'Uro (urostomy)'};
/* Continence rows have no category in the sheet, so they are sorted by description.
   Add or reorder rules here. Anything that matches no rule lands in "Other continence". */
const CONT_ORDER=['Intermittent catheters','Intermittent catheter sets','Foley catheters','Suprapubic catheters (Cystofix)','Urine drainage bags','Bladder irrigation','Accessories'];
const CONT_RULES=[
  ['Intermittent catheter sets',/^ACTREEN\b.*\bSET\b/],
  ['Intermittent catheters',/^ACTREEN\b/],
  ['Foley catheters',/\bCATH FOLEY\b/],
  ['Suprapubic catheters (Cystofix)',/^CYSTOFIX\b/],
  ['Bladder irrigation',/^URO[ -]?TAINER\b/],
  ['Accessories',/\b(STRAP|KLETT)\b/],
  ['Urine drainage bags',/\b(BAGS?|TRIBAG|UREOFIX)\b/]
];
const CONT_INFO={
  'Intermittent catheters':'Intermittent catheter.',
  'Intermittent catheter sets':'Intermittent catheter set.',
  'Foley catheters':'Indwelling Foley catheter.',
  'Suprapubic catheters (Cystofix)':'Cystofix suprapubic catheter system.',
  'Urine drainage bags':'Urine drainage bag.',
  'Bladder irrigation':'Bladder irrigation solution.',
  'Accessories':'Continence accessory.'
};
const COL_HEX={Beige:'#e6cdae','Split cover beige':'#e6cdae',Transparent:'#dcebf0',Standard:'#dbe6e8',White:'#f4f4f4',Black:'#2b2f31'};
const COL_ORDER=['Beige','Split cover beige','Transparent','White'];
const LEN_ORDER=['Mini','Midi','Maxi'];

/* ---- text helpers ---- */
const clean=v=>String(v==null?'':v).replace(/\s+/g,' ').trim();
const WORDS={TRSP:'Transparent',TRP:'Transparent',TRANSP:'Transparent',SC:'Split cover',CVX:'Convex',HF:'High Flow',RUP:"Roll'up",CL:'Closed',BGE:'Beige',NACL:'NaCl',ML:'mL',CM:'cm',PCS:'pcs',TURP:'TURP',SP:'SP',CE:'CE',INT:'INT',BAL:'BAL',SG:'SG',CTF:'CTF',BV:'BV'};
const UNITS={ML:'mL',L:'L',CM:'cm',MM:'mm',GMS:'gms'};
function prettyWord(w){
  if(w==="ROLL'UP") return "Roll'up";
  let m;
  if((m=w.match(/^CH0*(\d+)$/))) return 'Ch '+m[1];
  if((m=w.match(/^(\()?(\d+(?:[.,]\d+)?)(ML|L|CM|MM|GMS)(\))?$/))) return (m[1]||'')+m[2]+' '+UNITS[m[3]]+(m[4]||'');
  if((m=w.match(/^(\d+)X(\d+)ML$/))) return m[1]+' × '+m[2]+' mL';
  if(/^\d/.test(w)) return w;
  return w.split(/(['\-\/])/).map(p=>/^['\-\/]$/.test(p)?p:(WORDS[p]||p.replace(/[A-Za-z]+/g,s=>s[0]+s.slice(1).toLowerCase()))).join('');
}
function pretty(s){
  const t=clean(s).toUpperCase().split(' '), out=[];
  for(let i=0;i<t.length;i++){
    if((t[i]==='W'||t[i]==='WO')&&t[i+1]==='GUIDE'){ out.push(t[i]==='W'?'With':'Without'); continue; }
    out.push(prettyWord(t[i]));
  }
  return out.join(' ');
}
const sizeFmt=s=>clean(s).replace(/(\d)\s*(mm|cm)\b/gi,'$1 $2').replace(/(\d)-(\d)/g,'$1–$2');
const holeFmt=h=>{ const m=clean(h).match(/^(CTF|PC)\s*(\d+)(?:-(\d+))?$/i); if(!m) return clean(h);
  return (m[1].toUpperCase()==='CTF'?'Cut-to-fit ':'Pre-cut ')+m[2]+(m[3]?'–'+m[3]:'')+' mm'; };
const lenOf=d=>{ const m=d.toUpperCase().match(/\b(MINI|MIDI|MAXI)\b/); return m?m[1][0]+m[1].slice(1).toLowerCase():''; };
const listJoin=a=>a.length<3?a.join(' and '):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
function pouchTypeOf(d){
  d=d.toUpperCase();
  if(/\bHIGH FLOW\b|\bHF\b/.test(d)) return 'High flow';
  if(/\bURO\b/.test(d)) return 'Uro';
  if(/ROLL'?UP|\bRUP\b/.test(d)) return 'Drainable';
  if(/\bCLOSED\b|\bCL\b/.test(d)) return 'Closed';
  return '';
}
function contourOf(d){
  d=d.toUpperCase();
  if(/O.?CVX/.test(d)) return 'Soft convex';
  if(/\bCVX\b/.test(d)) return 'Convex';
  if(/\bACTIVE\b/.test(d)) return 'Soft flat';
  return 'Flat';
}

/* ---- CSV (for the live option) ---- */
function parseCSV(text){
  const rows=[]; let row=[], f='', q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){ f+='"'; i++; } else q=false; } else f+=c; }
    else if(c==='"') q=true;
    else if(c===','){ row.push(f); f=''; }
    else if(c==='\n'||c==='\r'){ if(c==='\r'&&text[i+1]==='\n') i++; row.push(f); f=''; rows.push(row); row=[]; }
    else f+=c;
  }
  if(f!==''||row.length){ row.push(f); rows.push(row); }
  return rows;
}
function rowsFromCSV(text){
  const t=parseCSV(text.replace(/^﻿/,'')); if(!t.length) return [];
  const head=t[0].map(h=>clean(h).toLowerCase());
  const idx=SHEET_HEADERS.map(names=>{ for(const n of names){ const j=head.indexOf(n); if(j>=0) return j; } return -1; });
  return t.slice(1).filter(r=>r.some(c=>clean(c))).map(r=>idx.map(j=>j>=0?r[j]:''));
}

/* ---- build products from rows ---- */
const toRow=a=>{ const r={}; SHEET_COLS.forEach((k,i)=>r[k]=clean(a[i])); r.desc=r.desc.replace(/,\s+/g,' '); r.ringN=parseInt(r.ring,10)||0; return r; };
const SIZEISH=/^(?:\d+(?:[\/.,-]\d+)*|BEIGE|BGE|TRSP|TRP|TRANSP|TRANSPARENT|SC|SPLIT|COVER|MINI|MIDI|MAXI|CTF|CUTTOFIT|PC|B\d+|\d+MM)$/;
const COLOUR_WORD=/^(BEIGE|BGE|WHITE|TRSP|TRP|TRANSP|TRANSPARENT|BLACK|BV)$/;

function groupRows(rows){
  const words=s=>s.toUpperCase().split(' ');
  const lead=(a,b)=>{ let n=0; while(n<a.length&&n<b.length&&a[n]===b[n]) n++; return n; };
  const groups=[], blanks=[];
  rows.forEach((r,i)=>{ r.idx=i;
    if(r.web) groups.push({area:r.area.toLowerCase(),web:r.web,first:words(r.desc),at:i,rows:[r]}); else blanks.push(r); });
  blanks.forEach(r=>{
    const w=words(r.desc), area=r.area.toLowerCase();
    let prev=null; groups.forEach(g=>{ if(g.at<r.idx&&g.area===area) prev=g; });
    const l0=prev?lead(prev.first,w):0;
    let best=null, bl=0; groups.forEach(g=>{ if(g.area===area){ const l=lead(g.first,w); if(l>0&&l>=bl){ bl=l; best=g; } } });
    if(prev&&l0>=2) prev.rows.push(r);                 /* normal case: continues the group above */
    else if(best&&bl>=2&&bl>l0) best.rows.push(r);     /* row missed when merging: joins the group it matches best */
    else if(prev&&l0>0) prev.rows.push(r);
    else groups.push({area,web:'',first:w,at:r.idx,rows:[r]});
  });
  groups.forEach(g=>g.rows.sort((a,b)=>a.idx-b.idx));
  return groups.sort((a,b)=>a.rows[0].idx-b.rows[0].idx);
}

function buildCatalog(rawRows){
  const rows=rawRows.map(toRow).filter(r=>r.code&&r.desc);
  const out=[];
  groupRows(rows).forEach(g=>{
    /* the sheet's web-shop column says "Not promoted. Old product." for items that should stay out of the shop */
    if(g.web&&!/^https?:/i.test(g.web)&&/not promoted|old product/i.test(g.web)) return;
    const cont=/continence/.test(g.area), r0=g.rows[0];
    const f={id:'p'+out.length,cat:cont?'continence':'ostomy',url:/^https?:/i.test(g.web)?g.web:'',variants:[]};

    /* name = words shared by every row in the group, minus sizes, colours and lengths */
    const ws=g.rows.map(r=>r.desc.toUpperCase().split(' '));
    let n=0; while(ws.every(w=>n<w.length&&w[n]===ws[0][n])) n++;
    let pre=ws[0].slice(0,n), suf=[];
    if(cont){
      const last=ws[0][ws[0].length-1];
      if(ws.length>1&&n<ws[0].length&&/^\d+CM$/.test(last)&&ws.every(w=>w[w.length-1]===last)) suf=[last];
      pre=pre.filter(t=>!/^CH\d+$/.test(t)&&t!=='BV');
    }else{
      while(pre.length>1&&SIZEISH.test(pre[pre.length-1])) pre.pop();
      pre=pre.filter(t=>t!=='BV');
    }
    const nameToks=pre.concat(suf);
    f.name=pretty(nameToks.join(' '))||pretty(r0.desc);

    if(cont){
      const catRaw=(g.rows.find(r=>r.category)||{}).category||'';
      const d0=r0.desc.toUpperCase();
      f.group=/accessor/i.test(catRaw)?'Accessories':((CONT_RULES.find(x=>x[1].test(d0))||[])[0]||'Other continence');
      f.kind=/catheter|Cystofix/.test(f.group)?'catheter':f.group==='Urine drainage bags'?'bag':'accessory';
      f.crumbs=[f.group];
    }else{
      const catRaw=(g.rows.find(r=>r.category)||{}).category||'';
      const sub=(g.rows.find(r=>r.sub)||{}).sub||'';
      f.sys=/accessor/i.test(catRaw)?'Accessories':(catRaw||'Other');
      if(f.sys==='Accessories'){ f.kind='accessory'; f.group='Accessories'; f.sub=sub; f.crumbs=['Accessories'].concat(sub?[sub]:[]); }
      else{
        f.part=(/^2 Piece/.test(f.sys)&&sub==='Baseplate')?'Baseplate':'Pouch';
        f.kind=f.part==='Baseplate'?'baseplate':'pouch';
        if(f.part==='Baseplate'){ f.contour=r0.baseType||'Flat'; f.type=''; f.crumbs=[f.sys,f.contour+' baseplate']; }
        else{ f.type=r0.pouchType||pouchTypeOf(r0.desc)||'Closed'; f.contour=f.sys==='1 Piece'?contourOf(r0.desc):''; f.crumbs=[f.sys,f.type+' pouch']; f.name+=' Pouch'; }
      }
    }

    g.rows.forEach(r=>{
      const colour=r.colour||'Standard', len=lenOf(r.desc);
      let size;
      if(!cont&&f.sys!=='Accessories'){
        const hole=holeFmt(r.hole), ring=r.ringN?r.ringN+' mm coupling':'';
        size=(f.part==='Baseplate'?[ring,hole]:f.sys==='1 Piece'?[len,hole]:[len,ring]).filter(Boolean).join(' · ');
      }else{
        const pool=nameToks.slice();
        const rest=r.desc.toUpperCase().split(' ').filter(t=>{ const i=pool.indexOf(t); if(i>=0){ pool.splice(i,1); return false; } return !COLOUR_WORD.test(t); });
        size=[sizeFmt(r.size),pretty(rest.join(' '))].filter(Boolean).join(' · ');
      }
      const vol=/\d\s*ml$/i.test(r.vol)?r.vol.replace(/\s+/g,'').replace(/ml$/i,' mL'):'';   // some sheet rows hold a ring size in the Volume column; ignore those
      const specTxt=r.spec&&r.spec.replace(/\s+/g,'').toLowerCase()!==r.vol.replace(/\s+/g,'').toLowerCase()?r.spec.replace(/\bml\b/i,'mL').replace(/(\d)(mm|cm|g|mL)\b/g,'$1 $2'):'';
      const cls=r.mmm?r.mmm.charAt(0)+r.mmm.slice(1).toLowerCase():specTxt;
      f.variants.push({code:r.code,colour,size:size||'Standard',ring:r.ringN,len,full:pretty(r.desc),pack:r.packQty,uom:r.uom,cls,vol,idx:r.idx});
    });

    if(!cont){ /* colour, then length, then sheet order */
      const rank=(a,v)=>{ const i=a.indexOf(v); return i<0?a.length:i; };
      f.variants.sort((a,b)=>rank(COL_ORDER,a.colour)-rank(COL_ORDER,b.colour)||rank(LEN_ORDER,a.len)-rank(LEN_ORDER,b.len)||a.idx-b.idx);
    }
    const seen={}; f.variants.forEach(v=>{ const k=v.colour+'|'+v.size; seen[k]=(seen[k]||0)+1; });
    f.variants.forEach(v=>{ if(seen[v.colour+'|'+v.size]>1) v.size+=' ('+v.code+')'; });
    f.desc=describe(f);
    out.push(f);
  });
  return out;
}

function describe(f){
  const vs=f.variants, cols=[...new Set(vs.map(v=>v.colour))].filter(c=>c!=='Standard');
  const lens=LEN_ORDER.filter(l=>vs.some(v=>v.len===l));
  const rings=[...new Set(vs.map(v=>v.ring).filter(Boolean))].sort((a,b)=>a-b);
  const opening=[vs.some(v=>/Cut-to-fit/.test(v.size))&&'cut-to-fit',vs.some(v=>/Pre-cut/.test(v.size))&&'pre-cut'].filter(Boolean);
  const bits=[];
  if(f.cat==='continence'){ bits.push(CONT_INFO[f.group]||'Continence product.'); if(vs.length>1) bits.push(vs.length+' options available.'); return bits.join(' '); }
  if(f.sys==='Accessories') return 'Ostomy accessory'+(f.sub?' – '+f.sub.toLowerCase():'')+'.';
  const coupling=/Mechanical/.test(f.sys)?'mechanical':'adhesive';
  if(f.part==='Baseplate') bits.push('Two-piece '+coupling+' coupling '+f.contour.toLowerCase()+' baseplate.');
  else if(f.sys==='1 Piece') bits.push('One-piece '+f.type.toLowerCase()+' pouch with a '+f.contour.toLowerCase()+' baseplate.');
  else bits.push('Two-piece '+coupling+' coupling '+f.type.toLowerCase()+' pouch.');
  if(lens.length) bits.push('Available in '+listJoin(lens.map(l=>l.toLowerCase()))+' length'+(lens.length>1?'s':'')+'.');
  if(cols.length>1) bits.push('Colours: '+listJoin(cols.map(c=>c.toLowerCase()))+'.');
  if(rings.length) bits.push('Coupling rings: '+listJoin(rings.map(r=>r+' mm'))+'.');
  if(opening.length) bits.push('Opening: '+listJoin(opening)+'.');
  return bits.join(' ');
}

let CATALOG=buildCatalog(SNAPSHOT);

/* ---------- Product photos (optional) ----------
   Put one JPEG per product in the images/ folder, named after the product's catalogue ID: the PRID number in its
   catalogue link, e.g. images/PRID00007541.jpg  (image-names.csv lists every name).
   Optional colour photos are shown on the product page when that colour is picked: images/PRID00007541_transparent.jpg.
   Any product without a photo keeps the drawn placeholder below. */
const IMG_DIR='images/', IMG_EXT='jpg';
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const photoId=f=>{ const m=(f.url||'').match(/PRID\d+/i); return m?m[0].toUpperCase():slug(f.name); };
function art(f,colour,byColour){
  const svg=drawArt(f,colour), base=IMG_DIR+photoId(f), srcs=[];
  if(byColour&&colour&&colour!=='Standard') srcs.push(base+'_'+slug(colour)+'.'+IMG_EXT);
  srcs.push(base+'.'+IMG_EXT);
  return `<img class="photo" src="${esc(srcs[0])}" alt="" loading="lazy" data-next="${esc(srcs.slice(1).join('|'))}" data-fb="${esc(svg)}">`;
}
/* if a photo is missing, try the next name, then fall back to the drawing */
document.addEventListener('error',e=>{
  const t=e.target; if(!t||t.tagName!=='IMG'||!t.classList.contains('photo')) return;
  const next=(t.dataset.next||'').split('|').filter(Boolean);
  if(next.length){ t.dataset.next=next.slice(1).join('|'); t.src=next[0]; }
  else t.outerHTML=t.dataset.fb;
},true);

/* ---------- Product illustrations (generic, drawn in SVG) ---------- */
let uid=0;
function drawArt(f,colour){
  const id='g'+(uid++), c=colour||'Standard';
  const fill=c==='Transparent'?'#e4f1f5':/split/i.test(c)?`url(#${id})`:(COL_HEX[c]||'#e6cdae');
  const stroke=c==='Transparent'?'#6a9aa9':'#7a5a3c';
  const dash=c==='Transparent'?' stroke-dasharray="5 4"':'';
  const defs=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset=".5" stop-color="#e6cdae"/><stop offset=".5" stop-color="#f6efe2"/></linearGradient></defs>`;
  let body='';
  const kind=f.kind||(f.sys==='Accessories'?'accessory':(f.part==='Baseplate'?'baseplate':'pouch'));
  const convex=/convex/i.test(f.contour||'');
  if(kind==='pouch'){
    const drain=f.type&&f.type!=='Closed';
    body=`<path d="M62 30Q100 12 138 30Q158 100 140 150Q100 168 60 150Q42 100 62 30Z" fill="${fill}" stroke="${stroke}" stroke-width="3"${dash}/>
      <circle cx="100" cy="54" r="15" fill="#fff" stroke="${stroke}" stroke-width="3"/>
      ${convex?`<circle cx="100" cy="54" r="24" fill="none" stroke="${stroke}" stroke-width="2" opacity=".6"/>`:''}
      ${drain?`<path d="M72 160h56v16q-28 8-56 0Z" fill="${fill}" stroke="${stroke}" stroke-width="3"${dash}/><path d="M78 170h44" stroke="${stroke}" stroke-width="3"/>`:''}`;
  }else if(kind==='baseplate'){
    body=`<circle cx="100" cy="100" r="70" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
      <circle cx="100" cy="100" r="22" fill="#fff" stroke="${stroke}" stroke-width="3"/>
      <circle cx="100" cy="100" r="38" fill="none" stroke="${stroke}" stroke-width="3" stroke-dasharray="3 6"/>
      ${convex?`<circle cx="100" cy="100" r="52" fill="none" stroke="${stroke}" stroke-width="2" opacity=".6"/>`:''}`;
  }else if(kind==='catheter'){
    body=`<path d="M40 160L150 50" stroke="#6fb6c9" stroke-width="14" stroke-linecap="round"/><path d="M146 38l30 30-18 18-30-30Z" fill="#cfe7ee" stroke="#4a8fa3" stroke-width="3"/><circle cx="46" cy="154" r="4" fill="#fff"/>`;
  }else if(kind==='bag'){
    body=`<path d="M100 12v34" stroke="#6fb6c9" stroke-width="7" stroke-linecap="round"/><path d="M58 52h84v90Q100 176 58 142Z" fill="#e9f4f7" stroke="#4a8fa3" stroke-width="3"/><path d="M70 84h60M70 104h60M70 124h60" stroke="#4a8fa3" stroke-width="2" opacity=".5"/>`;
  }else{
    body=`<rect x="64" y="46" width="72" height="120" rx="14" fill="${c==='Black'?'#2b2f31':'#e8eef0'}" stroke="#587073" stroke-width="3"/><rect x="76" y="26" width="48" height="26" rx="6" fill="#0b7a6b"/><rect x="78" y="82" width="44" height="40" rx="6" fill="#fff" opacity=".85"/>`;
  }
  return `<svg viewBox="0 0 200 200" aria-hidden="true">${defs}${body}</svg>`;
}

/* ---------- State & helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const S={persona:null,cat:null,a:'',b:'',c:'',basket:[],cur:null,sel:{}};
function reveal(id){
  const el=$(id); const was=el.hidden; el.hidden=false;
  requestAnimationFrame(()=>setTimeout(()=>el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}),60));
  return was;
}
function toast(msg){
  const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);
}

/* ---------- Step 1: persona ---------- */
function applyPersona(who){
  S.persona=who;
  $('#persona').hidden=!who;
  $('#personaTxt').textContent=who==='nurse'?'Nurse (hospital)':'Individual';
  $('#catSub').textContent=who==='nurse'
    ?'Choose the product area you are requesting samples for on behalf of your hospital or patients.'
    :'Choose the product area you are shopping for yourself.';
}
function leaveCheckout(){ document.body.classList.remove('checkout'); $('#pCheckout').hidden=true; }
document.querySelectorAll('[data-persona]').forEach(b=>b.addEventListener('click',()=>{
  applyPersona(b.dataset.persona);
  reveal('#pCat');
}));
$('#persona').onclick=()=>{ leaveCheckout(); $('#hero').scrollIntoView({behavior:reduce?'auto':'smooth'}); };

/* ---------- Step 2: category ---------- */
document.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{
  S.cat=b.dataset.cat; S.a=S.b=S.c='';
  document.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  $('#pGrid').hidden=true; $('#hFilter').textContent=S.cat==='ostomy'?'What kind of ostomy product?':'What kind of continence product?';
  renderDropdowns(); reveal('#pFilter');
}));

/* ---------- Step 3: dropdowns ---------- */
function ordered(list,order){ const u=[...new Set(list)]; return u.sort((a,b)=>{ const x=order.indexOf(a), y=order.indexOf(b); return (x<0?99:x)-(y<0?99:y); }); }
const is2=a=>/^2 Piece/.test(a||'');
function sysOptions(){ return ordered(CATALOG.filter(f=>f.cat==='ostomy').map(f=>f.sys),SYS_ORDER).map(v=>[v,v]); }
function typeOptions(){ return ordered(CATALOG.filter(f=>f.cat==='ostomy'&&f.sys===S.a&&f.part==='Pouch').map(f=>f.type),TYPE_ORDER).map(v=>[v,TYPE_LABEL[v]||v]); }
function ringOptions(){ const set=new Set(); CATALOG.forEach(f=>{ if(f.cat==='ostomy'&&f.sys===S.a&&f.part==='Pouch'&&f.type===S.b) f.variants.forEach(v=>v.ring&&set.add(v.ring)); }); return [...set].sort((a,b)=>a-b).map(n=>[String(n),n+' mm']); }
function contOptions(){ return ordered(CATALOG.filter(f=>f.cat==='continence').map(f=>f.group),CONT_ORDER).map(v=>[v,v]); }
function select(id,label,ph,opts,val,hint){
  return `<div class="dd"><label for="${id}">${label}</label><select id="${id}" class="${val?'set':''}"><option value="" ${val?'':'selected'} disabled>${ph}</option>${opts.map(o=>`<option value="${esc(o[0])}" ${o[0]===val?'selected':''}>${esc(o[1])}</option>`).join('')}</select>${hint?`<div class="h">${hint}</div>`:''}</div>`;
}
function renderDropdowns(){
  let h='';
  if(S.cat==='ostomy'){
    h+=select('dA','System','Choose a system',sysOptions(),S.a);
    if(S.a&&S.a!=='Accessories') h+=select('dB','Pouch type','Choose a pouch type',typeOptions(),S.b);
    if(is2(S.a)&&S.b) h+=select('dC','Coupling ring size','Choose a size',ringOptions(),S.c,'Matching pouches and baseplates are shown together.');
  }else{
    h+=select('dA','Product type','What are you looking for?',contOptions(),S.a);
  }
  $('#dds').innerHTML=h;
}
$('#dds').addEventListener('change',e=>{
  const id=e.target.id, v=e.target.value;
  if(id==='dA'){S.a=v;S.b='';S.c='';}
  if(id==='dB'){S.b=v;S.c='';}
  if(id==='dC'){S.c=v;}
  renderDropdowns();
  const f=$('#'+id); if(f) f.focus({preventScroll:true});
  const ready=S.cat==='ostomy'
    ? (S.a==='Accessories'||(S.a==='1 Piece'&&S.b)||(is2(S.a)&&S.b&&S.c))
    : !!S.a;
  if(ready) showGrid(); else $('#pGrid').hidden=true;
});

/* ---------- Step 4: grid ---------- */
function matches(){
  const out=[];
  CATALOG.forEach(f=>{
    if(f.cat!==S.cat) return;
    if(S.cat==='continence'){ if(f.group===S.a) out.push({f,variants:f.variants}); return; }
    if(f.sys!==S.a) return;
    if(S.a==='Accessories'||S.a==='1 Piece'){ if(S.a==='Accessories'||f.type===S.b) out.push({f,variants:f.variants}); return; }
    if(f.part==='Pouch'&&f.type!==S.b) return;
    const vs=f.variants.filter(v=>String(v.ring)===S.c);
    if(vs.length) out.push({f,variants:vs});
  });
  return out;
}
/* Simplified names shown on the product grid tiles only (product pages keep the full name) */
const TILE_TYPE={'Closed':'Closed','Drainable':'Drainable','High flow':'High Flow','Uro':'Uro'};
function tileName(f){
  if(f.cat!=='ostomy'||f.sys==='Accessories') return f.name;
  const title=x=>String(x||'').replace(/\b\w/g,c=>c.toUpperCase());
  const ctr=title(f.contour);
  if(is2(f.sys)){
    const ring=S.c?', '+S.c+'mm':'';
    if(f.part==='Baseplate') return (ctr||'Flat')+' Baseplate'+ring;
    return (TILE_TYPE[f.type]||f.type)+' Pouch'+ring;
  }
  const t=TILE_TYPE[f.type]||f.type;
  return t&&ctr?t+', '+ctr:f.name;
}
function tile(m){
  const f=m.f, v0=m.variants[0], cols=[...new Set(m.variants.map(v=>v.colour))];
  const mt=[m.variants.length+(m.variants.length===1?' option':' options'),cols.length>1?cols.length+' colours':''].filter(Boolean).join(' · ');
  return `<button class="tile" type="button" data-fid="${f.id}" title="${esc(f.name)}"><div class="img">${art(f,v0.colour)}</div><div class="in"><div class="nm">${esc(tileName(f))}</div><div class="mt">${esc(mt)}</div></div></button>`;
}
function showGrid(){
  const ms=matches(), firstTime=$('#pGrid').hidden;
  $('#gridView').hidden=false; $('#detailView').hidden=true;
  const crumbs=[S.persona?(S.persona==='nurse'?'Nurse':'Individual'):'',S.cat==='ostomy'?'Ostomy':'Continence',S.a,S.b,S.c&&S.c+' mm coupling'].filter(Boolean);
  $('#crumbs').innerHTML=crumbs.map(c=>`<span class="pill">${esc(c)}</span>`).join('');
  $('#gSub').textContent=ms.length?`${ms.length} ${ms.length===1?'product':'products'} match. Tap one to choose colour and size.`:'';
  $('#notice').innerHTML='';
  let html='';
  if(S.cat==='ostomy'&&is2(S.a)){
    const pouches=ms.filter(m=>m.f.part==='Pouch'), plates=ms.filter(m=>m.f.part==='Baseplate');
    html+=`<h3 class="grp">${S.b} pouches</h3>`+(pouches.length?`<div class="tiles">${pouches.map(tile).join('')}</div>`:'<div class="empty">No pouches at this size.</div>');
    html+=`<h3 class="grp">Matching baseplates</h3>`+(plates.length?`<div class="tiles">${plates.map(tile).join('')}</div>`:'<div class="empty">No baseplates at this size.</div>');
  }else html=ms.length?`<div class="tiles">${ms.map(tile).join('')}</div>`:'<div class="empty">No products match these choices.</div>';
  $('#tiles').innerHTML=html;
  $('#tiles').dataset.ms=''; S.ms=ms;
  if(firstTime) reveal('#pGrid'); else $('#pGrid').hidden=false;
}
$('#tiles').addEventListener('click',e=>{
  const t=e.target.closest('[data-fid]'); if(!t) return;
  const m=S.ms.find(x=>x.f.id===t.dataset.fid); openDetail(m);
});

/* ---------- Product detail ---------- */
function openDetail(m){
  S.cur=m; S.sel={colour:[...new Set(m.variants.map(v=>v.colour))][0],code:''};
  $('#gridView').hidden=true; $('#detailView').hidden=false; renderDetail();
  $('#pGrid').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
}
function swStyle(c){
  return /split/i.test(c)?'linear-gradient(90deg,#e6cdae 50%,#f6efe2 50%)':c==='Transparent'?'linear-gradient(135deg,#fff 45%,#cfe3e8 46%)':(COL_HEX[c]||'#ddd');
}
function renderDetail(){
  const y=window.scrollY;
  const {f,variants}=S.cur, cols=[...new Set(variants.map(v=>v.colour))];
  const has=k=>variants.some(v=>v[k]!==''&&v[k]!=null);
  const showCls=has('cls'), showVol=has('vol'), showPack=has('pack'), showColour=variants.some(v=>v.colour!=='Standard');
  const cell=(cls,label,v)=>`<td class="${cls}" data-label="${label}">${v===''||v==null?'<span class="na">–</span>':v}</td>`;
  const rows=variants.map(v=>{
    const added=S.basket.some(b=>b.code===v.code);
    const label=v.full||(f.name+' – '+v.size);
    return `<tr class="${v.code===S.sel.code?'sel':''}">
      <td class="c" data-label="Code">${esc(v.code)}</td>
      <td class="p" data-label="Product"><span class="pn">${esc(label)}</span></td>
      ${showCls?cell('d','Description',esc(v.cls)):''}
      ${showVol?cell('d','Volume',esc(v.vol)):''}
      ${cell('s','Size',esc(v.size))}
      ${showColour?cell('d col','Colour',v.colour==='Standard'?'':`<span class="pc"><i style="background:${swStyle(v.colour)}"></i>${esc(v.colour)}</span>`):''}
      ${showPack?cell('d','Pack Size',esc(v.pack)):''}
      <td class="o"><button type="button" class="ord" data-order="${esc(v.code)}" aria-pressed="${added}" aria-label="Order free sample: ${esc(label)}">${added?'✓ Added':'Order'}</button></td></tr>`;
  }).join('');
  const head=['<th scope="col">Code</th>','<th scope="col">Product</th>',showCls&&'<th scope="col">Description</th>',showVol&&'<th scope="col">Volume</th>','<th scope="col">Size</th>',showColour&&'<th scope="col">Colour</th>',showPack&&'<th scope="col">Pack Size</th>','<th scope="col">FREE Sample</th>'].filter(Boolean).join('');
  $('#detailView').innerHTML=`
    <div class="detailHead">
      <button class="back" id="backBtn" type="button">← Back to products</button>
      <div class="crumbs" style="margin-bottom:10px">${[f.cat==='ostomy'?'Ostomy':'Continence'].concat(f.crumbs||[]).filter(Boolean).map(c=>`<span class="pill">${esc(c)}</span>`).join('')}</div>
      <span class="free">FREE sample</span>
      <h2>${esc(f.name)}</h2>
      <p class="pdesc">${esc(f.desc)}</p>
      ${f.url?`<p><a href="${esc(f.url)}" target="_blank" rel="noopener" style="color:var(--teal);font-weight:700">View full product details ↗</a></p>`:''}
      <p><button type="button" class="imgLink" id="toImages">View product images ↓</button></p>
    </div>
    <section class="vt" id="variantTable" aria-labelledby="vtH">
      <h3 id="vtH" class="sr">Sizes and codes</h3>
      <table class="vt-t">
        <thead><tr>${head}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
    <section class="gallery" aria-label="Product photos">
      ${cols.map(c=>`<figure class="pic">${art(f,c,true)}${cols.length>1?`<figcaption>${esc(c)}</figcaption>`:''}</figure>`).join('')}
    </section>`;
  window.scrollTo(0,y);
}
function addToRequest(v){
  if(S.basket.some(b=>b.code===v.code)){ toast('Already in your cart'); return; }
  S.basket.push({code:v.code,name:S.cur.f.name,colour:v.colour,size:v.size,f:S.cur.f}); updBasket(); toast('Added to your cart');
}
$('#detailView').addEventListener('click',e=>{
  if(e.target.closest('#backBtn')){ $('#detailView').hidden=true; $('#gridView').hidden=false; $('#pGrid').scrollIntoView({behavior:reduce?'auto':'smooth'}); return; }
  if(e.target.closest('#toImages')){ $('#detailView .gallery').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}); return; }
  const od=e.target.closest('[data-order]');
  if(od){
    const v=S.cur.variants.find(x=>x.code===od.dataset.order);
    S.sel={colour:v.colour,code:v.code}; addToRequest(v); renderDetail();
    const again=$('[data-order="'+v.code+'"]'); if(again) again.focus({preventScroll:true});
  }
});
/* ---------- Basket drawer ---------- */
function updBasket(){ $('#bcount').textContent=S.basket.length; if(document.body.classList.contains('checkout')) renderSummary(); }
$('#basketBtn').onclick=openDrawer;
function openDrawer(){
  const who=S.persona==='nurse'?'for your hospital or patients':S.persona?'for yourself':'';
  $('#drawerHost').innerHTML=`<div class="scrim" id="scrim"></div>
  <aside class="drawer" role="dialog" aria-modal="true" aria-label="Your cart">
    <div style="display:flex;justify-content:space-between;align-items:start"><div><h3>Your cart</h3><div class="hint" style="color:var(--muted);font-size:.9rem">Samples ${who}</div></div><button class="x" id="closeD" type="button" aria-label="Close">✕</button></div>
    ${S.basket.length?`<ul>${S.basket.map(b=>`<li>${art(b.f,b.colour)}<div><b>${esc(b.name)}</b><br><small>${b.colour!=='Standard'?esc(b.colour)+' · ':''}${esc(b.size)} · ${esc(b.code)}</small></div><button class="x" data-rm="${esc(b.code)}" type="button" aria-label="Remove ${esc(b.name)}">✕</button></li>`).join('')}</ul>`:'<p style="color:var(--muted);flex:1">Nothing added yet.</p>'}
    <button class="cta" id="contD" type="button" ${S.basket.length?'':'disabled'}>Checkout</button>
  </aside>`;
  $('#closeD').focus();
}
$('#drawerHost').addEventListener('click',e=>{
  if(e.target.id==='scrim'||e.target.id==='closeD'){ $('#drawerHost').innerHTML=''; return; }
  const r=e.target.closest('[data-rm]');
  if(r){ S.basket=S.basket.filter(b=>b.code!==r.dataset.rm); updBasket(); openDrawer(); if(!$('#detailView').hidden) renderDetail(); return; }
  if(e.target.id==='contD'){ $('#drawerHost').innerHTML=''; openCheckout(); }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') $('#drawerHost').innerHTML=''; });

/* ---------- Search (nav bar) ---------- */
const norm=s=>String(s==null?'':s).toLowerCase().replace(/['’]/g,'').replace(/[-–\/]/g,' ').replace(/(\d)\s+(mm|ml|cm|l)\b/g,'$1$2').replace(/\s+/g,' ').trim();
function searchProducts(q){
  const toks=norm(q).split(' ').filter(Boolean); if(!toks.length) return [];
  const out=[];
  CATALOG.forEach(f=>{
    const name=norm(f.name), pt=norm([f.name,f.sys,f.type,f.group,f.part,f.contour,f.cat].join(' '));
    const nameHit=toks.every(t=>pt.includes(t));
    let hit=null, score=0;
    for(const v of f.variants){
      const code=norm(v.code);
      if(toks.some(t=>t===code)){ hit=v; score=150; break; }
    }
    if(!hit){
      for(const v of f.variants){
        const code=norm(v.code);
        if(toks.some(t=>t.length>=3&&code.startsWith(t))&&toks.every(t=>code.startsWith(t)||pt.includes(t)||norm([v.full,v.size,v.colour].join(' ')).includes(t))){ hit=v; score=90; break; }
      }
    }
    if(!hit&&!nameHit){
      for(const v of f.variants){
        const vt=pt+' '+norm([v.code,v.full,v.size,v.colour,v.cls,v.vol,v.ring&&v.ring+'mm'].join(' '));
        if(toks.every(t=>vt.includes(t))){ hit=v; score=40; break; }
      }
    }
    if(nameHit) score=Math.max(score,60)+toks.filter(t=>name.includes(t)).length*15+(name.startsWith(toks[0])?10:0);
    if(!nameHit&&!hit) return;
    out.push({f,hit,score});
  });
  return out.sort((a,b)=>b.score-a.score||a.f.name.localeCompare(b.f.name));
}
function hl(text,toks){
  const t=toks.filter(x=>x.length>0).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  if(!t.length) return esc(text);
  return String(text).split(new RegExp('('+t.join('|')+')','i')).map((p,i)=>i%2?`<mark>${esc(p)}</mark>`:esc(p)).join('');
}
const qIn=$('#q'), qList=$('#results'); let qItems=[], qActive=-1;
function qClose(){ qList.hidden=true; qIn.setAttribute('aria-expanded','false'); qIn.removeAttribute('aria-activedescendant'); qActive=-1; }
function qSetActive(i){
  const lis=[...qList.querySelectorAll('li[data-i]')]; if(!lis.length) return;
  qActive=(i+lis.length)%lis.length;
  lis.forEach((li,k)=>li.setAttribute('aria-selected',k===qActive));
  qIn.setAttribute('aria-activedescendant',lis[qActive].id); lis[qActive].scrollIntoView({block:'nearest'});
}
function qRender(){
  const q=qIn.value.trim();
  if(!q){ qClose(); $('#qlive').textContent=''; return; }
  const all=searchProducts(q), toks=q.toLowerCase().split(/\s+/);
  qItems=all.slice(0,8); qActive=-1;
  let h=qItems.map((r,i)=>{
    const f=r.f, v=r.hit||f.variants[0];
    const sub=[f.cat==='ostomy'?'Ostomy':'Continence',f.cat==='ostomy'?f.sys:f.group].filter(Boolean).join(' · ');
    const extra=r.hit?` · ${hl(r.hit.code,toks)}${r.hit.size?' · '+hl(r.hit.size,toks):''}`:'';
    return `<li role="option" id="rs${i}" data-i="${i}" aria-selected="false"><span class="rimg">${art(f,v.colour)}</span><span class="rtx"><div class="rn">${hl(f.name,toks)}</div><div class="rs">${esc(sub)}${extra}</div></span></li>`;
  }).join('');
  if(!qItems.length) h=`<li class="none" role="option" aria-disabled="true">No products found for “${esc(q)}”. Try a product name or code.</li>`;
  else if(all.length>qItems.length) h+=`<li class="more" role="option" aria-disabled="true">+${all.length-qItems.length} more. Keep typing to narrow the results.</li>`;
  qList.innerHTML=h; qList.hidden=false; qIn.setAttribute('aria-expanded','true');
  $('#qlive').textContent=qItems.length?`${all.length} result${all.length===1?'':'s'} available`:'No results';
}
qIn.addEventListener('input',qRender);
qIn.addEventListener('focus',()=>{ if(qIn.value.trim()&&qList.hidden) qRender(); });
qIn.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){ e.preventDefault(); if(qList.hidden) qRender(); qSetActive(qActive+1); }
  else if(e.key==='ArrowUp'){ e.preventDefault(); if(!qList.hidden) qSetActive(qActive<0?-1:qActive-1); }
  else if(e.key==='Enter'){ e.preventDefault(); if(qList.hidden) qRender(); const r=qItems[qActive>=0?qActive:0]; if(r) pickResult(r); }
  else if(e.key==='Escape'){ if(!qList.hidden){ qClose(); e.stopPropagation(); } }
});
qList.addEventListener('mousedown',e=>e.preventDefault());
qList.addEventListener('click',e=>{ const li=e.target.closest('li[data-i]'); if(li) pickResult(qItems[+li.dataset.i]); });
document.addEventListener('click',e=>{ if(!e.target.closest('#searchBox')) qClose(); });
function pickResult(r){ qClose(); qIn.blur(); goToProduct(r.f,r.hit); }

function goToProduct(f,hit){
  leaveCheckout(); $('#drawerHost').innerHTML='';
  S.cat=f.cat; S.a=S.b=S.c='';
  const rings=[...new Set(f.variants.map(v=>v.ring).filter(Boolean))];
  const ring=hit&&hit.ring?hit.ring:rings[0];
  if(f.cat==='continence') S.a=f.group;
  else{
    S.a=f.sys;
    if(S.a!=='Accessories'){
      if(!is2(S.a)||f.part==='Pouch') S.b=f.type;
      else{ const t=typeOptions().map(o=>o[0]); for(const k of t){ S.b=k; if(ringOptions().some(o=>o[0]===String(ring))) break; } }
      if(is2(S.a)&&ring) S.c=String(ring);
    }
  }
  document.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.cat===S.cat));
  $('#hFilter').textContent=S.cat==='ostomy'?'What kind of ostomy product?':'What kind of continence product?';
  if(!$('#catSub').textContent) $('#catSub').textContent='Choose the product area you are requesting samples for.';
  $('#pCat').hidden=false; $('#pFilter').hidden=false;
  renderDropdowns(); showGrid();
  const m=(S.ms||[]).find(x=>x.f.id===f.id)||{f,variants:f.variants};
  openDetail(m);
  if(hit&&m.variants.some(v=>v.code===hit.code)){ S.sel={colour:hit.colour,code:hit.code}; renderDetail(); }
  else if(hit){ /* variant filtered out by ring; show all */ }
  const row=hit&&$('#detailView tr.sel'); if(row) setTimeout(()=>row.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}),80);
  else window.scrollTo({top:$('#pGrid').offsetTop-70,behavior:reduce?'auto':'smooth'});
}

/* ---------- Contact overlay ---------- */
const cOv=$('#contactOv'); let cOpener=null;
function openContact(){
  cOpener=document.activeElement; qClose(); cOv.hidden=false; document.body.classList.add('noscroll'); $('#contactClose').focus();
}
function closeContact(){
  if(cOv.hidden) return; cOv.hidden=true; document.body.classList.remove('noscroll'); if(cOpener&&cOpener.focus) cOpener.focus(); cOpener=null;
}
$('#contactBtn').addEventListener('click',openContact);
$('#contactClose').addEventListener('click',closeContact);
cOv.addEventListener('click',e=>{ if(!e.target.closest('#contactCard,#contactClose')) closeContact(); });
document.addEventListener('keydown',e=>{
  if(cOv.hidden) return;
  if(e.key==='Escape'){ closeContact(); e.stopPropagation(); }
  else if(e.key==='Tab'){
    const f=[...cOv.querySelectorAll('button,a[href]')], first=f[0], last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
    else if(!cOv.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
  }
},true);

/* ---------- Checkout ---------- */
S.form={}; S.reqFor=''; S.consent={mkt:true,priv:false};
const STATES=['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','ACT','NT'];
const POSTR=[[800,999,'NT'],[200,299,'ACT'],[2600,2618,'ACT'],[2900,2920,'ACT'],[2000,2599,'New South Wales'],[2619,2899,'New South Wales'],[2921,2999,'New South Wales'],[3000,3999,'Victoria'],[8000,8999,'Victoria'],[4000,4999,'Queensland'],[9000,9999,'Queensland'],[5000,5799,'South Australia'],[6000,6797,'Western Australia'],[7000,7999,'Tasmania']];
function stateFromPostcode(pc){ const n=+pc; for(const [a,b,s] of POSTR) if(n>=a&&n<=b) return s; return ''; }
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---- EmailJS: fill these three values in (see the setup notes) ---- */
const EMAILJS_CONFIG={serviceId:'YOUR_SERVICE_ID',templateId:'YOUR_TEMPLATE_ID',publicKey:'YOUR_PUBLIC_KEY'};
const emailReady=()=>typeof emailjs!=='undefined'&&Object.values(EMAILJS_CONFIG).every(v=>v&&!/^YOUR_/.test(v));
const REQ_WARD='Hospital ward stock', REQ_DIS='Patient discharge pack', REQ_PAT='Send to my patient';
const PHONE=/^[0-9+()\s-]{8,}$/;

function inp(id,label,o={}){
  const v=S.form[id]||'';
  const common=`id="${id}" name="${id}" placeholder="${esc(o.ph||'')}" autocomplete="${o.ac||'off'}"${o.req?' aria-required="true"':''} aria-describedby="er_${id}"`;
  const ctl=o.area
    ?`<textarea ${common} rows="3"${o.max?` maxlength="${o.max}"`:''}>${esc(v)}</textarea>`
    :`<input ${common} type="${o.type||'text'}" value="${esc(v)}"${o.mode?` inputmode="${o.mode}"`:''}${o.max?` maxlength="${o.max}"`:''}>`;
  return `<div class="fg${o.wide?' wide':''}"><label for="${id}">${label}${o.req?' <span class="rq" aria-hidden="true">*</span>':''}</label>${ctl}<div class="er" id="er_${id}" role="alert"></div></div>`;
}
function stateField(id='state'){
  return `<div class="fg"><label for="${id}">State <span class="rq" aria-hidden="true">*</span></label>
    <select id="${id}" aria-required="true" aria-describedby="er_${id}"><option value="" ${S.form[id]?'':'selected'} disabled>Select a state</option>${STATES.map(s=>`<option ${S.form[id]===s?'selected':''}>${s}</option>`).join('')}</select><div class="er" id="er_${id}" role="alert"></div></div>`;
}
function countryField(){
  return `<div class="fg"><label for="country">Country</label><select id="country" disabled><option>Australia</option></select></div>`;
}
function salutField(){
  return `<fieldset class="fs"><legend>Salutation</legend><div class="rads">${['Mr.','Mrs.','Neutral'].map(s=>`<label class="rad"><input type="radio" name="salut" value="${s}" ${S.form.salut===s?'checked':''}><span>${s}</span></label>`).join('')}</div></fieldset>`;
}
const addrFields=p=>{
  const id=p+'addr', ok=S.form[p+'addrOk'];
  return `<div class="fg wide"><label for="${id}">Delivery address <span class="rq" aria-hidden="true">*</span></label>
    <div class="acBox"><input id="${id}" name="${id}" type="text" class="${ok?'ok':''}" value="${esc(S.form[id]||'')}" placeholder="Start typing your street address…" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="ac_${id}" aria-required="true" aria-describedby="er_${id} hint_${id}" data-ac="${p}"><ul class="acList" id="ac_${id}" role="listbox" aria-label="Address suggestions" hidden></ul></div>
    <div class="hintTxt acHint" id="hint_${id}">Pick your address from the suggestions so we can be sure it exists. Australian addresses only.</div>
    <div class="er" id="er_${id}" role="alert"></div></div>`;
};
function renderCheckout(){
  const nurse=S.persona==='nurse', host=$('#pCheckout');
  if(!S.basket.length){
    host.innerHTML=`<div class="coWrap"><div class="empty"><p>Your cart is empty.</p><button class="cta" type="button" id="coBack">Choose products</button></div></div>`; return;
  }
  let body='';
  if(nurse){
    const radios=`<fieldset class="fs" aria-describedby="er_reqFor"><legend>This request is for <span class="rq" aria-hidden="true">*</span></legend>
      <div class="rads col">${[REQ_WARD,REQ_DIS,REQ_PAT].map((s,i)=>`<label class="rad"><input type="radio" name="reqFor" id="rf${i}" value="${s}" ${S.reqFor===s?'checked':''}><span>${s}</span></label>`).join('')}</div>
      <div class="er" id="er_reqFor" role="alert"></div></fieldset>`;
    let rest='';
    if(S.reqFor===REQ_WARD||S.reqFor===REQ_DIS){
      rest=`<h3 class="coH">Clinician details</h3><div class="fgrid">
        ${inp('first',"Clinician’s First Name",{req:1,ph:'Jane',ac:'given-name'})}
        ${inp('last',"Clinician’s Last Name",{req:1,ph:'Smith',ac:'family-name'})}
        ${inp('func','Clinician title',{req:1,ph:'e.g. Clinical Nurse Consultant',ac:'organization-title'})}
        ${inp('org','Hospital / Clinic name',{req:1,ph:'Hospital or clinic name',ac:'organization'})}
        ${inp('mobile','Mobile number',{req:1,type:'tel',ph:'Mobile number',ac:'tel'})}
        ${inp('email','Email',{req:1,type:'email',ph:'name@hospital.com.au',ac:'email'})}
      </div>
      <h3 class="coH">Delivery details</h3><div class="fgrid">
        ${addrFields('')}
        ${inp('notes','Special instructions (ward number, floor, etc.)',{area:1,wide:1,ph:'e.g. Ward 5B, Level 3, deliver to reception',max:300})}
      </div>`;
    }else if(S.reqFor===REQ_PAT){
      rest=`<h3 class="coH">Clinician details</h3><div class="fgrid">
        ${inp('first',"Clinician’s First Name",{req:1,ph:'Jane',ac:'given-name'})}
        ${inp('last',"Clinician’s Last Name",{req:1,ph:'Smith',ac:'family-name'})}
        ${inp('org','Hospital / Clinic name',{req:1,wide:1,ph:'Hospital or clinic name',ac:'organization'})}
      </div>
      <h3 class="coH">Patient details</h3><div class="fgrid">
        ${inp('pname','Patient name',{req:1,wide:1,ph:'Patient’s full name'})}
        ${inp('pmobile','Patient mobile number',{req:1,type:'tel',ph:'Mobile number'})}
        ${inp('pemail','Patient email',{req:1,type:'email',ph:'patient@example.com'})}
      </div>
      <h3 class="coH">Patient delivery address</h3><div class="fgrid">
        ${addrFields('p')}
      </div>`;
    }else rest=`<p class="hintTxt pick">Choose an option above to continue.</p>`;
    body=salutField()+radios+rest;
  }else{
    body=salutField()+`<h3 class="coH">Your details</h3><div class="fgrid">
      ${inp('first','First name',{req:1,ph:'Jane',ac:'given-name'})}
      ${inp('last','Last name',{req:1,ph:'Smith',ac:'family-name'})}
      ${inp('mobile','Mobile number',{req:1,type:'tel',ph:'Mobile number',ac:'tel'})}
      ${inp('email','Email',{req:1,type:'email',ph:'you@example.com',ac:'email'})}
    </div>
    <h3 class="coH">Delivery address</h3><div class="fgrid">${addrFields('')}</div>`;
  }
  host.innerHTML=`<div class="coWrap">
    <form id="coForm" novalidate>
      <button class="back" id="coBack" type="button">← Back to products</button>
      <h2>Checkout</h2>
      <p class="coSub">${nurse?'Request free samples for your hospital, ward or patient.':'Request your free samples for personal use.'} Fields marked with an asterisk are required.</p>
      <div id="errSum" class="errsum" role="alert" tabindex="-1" hidden></div>
      ${body}
      <div class="fgrid" style="margin-top:22px">${inp('comments','Your Request',{area:1,wide:1,max:1000})}</div>
      <fieldset class="fs perm"><legend>Marketing Permission</legend>
        <label class="chk"><input type="checkbox" id="mkt" ${S.consent.mkt?'checked':''}><span>Yes, I would like to receive additional information about relevant therapies, products, solutions or events from B. Braun and its contracted distribution partners in future.</span></label>
      </fieldset>
      <h3 class="resp">B. Braun Australia is the responsible organisation</h3>
      <p class="privTxt">The protection of the personal data of our customers is very important to us and we take it very seriously. Your personal data is subject to data protection and the collection and storage is subject to Australia Privacy Laws and our <a href="https://www.bbraun.com.au/en/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>. Under no circumstances will we pass on your personal data to third parties outside of the B. Braun Group or use or store them for any other purposes. Our staff has been trained to handle personal data and is obliged to comply with the data protection regulations.</p>
      <fieldset class="fs perm"><legend>Data Protection <span class="rq" aria-hidden="true">*</span></legend>
        <label class="chk"><input type="checkbox" id="priv" ${S.consent.priv?'checked':''} aria-describedby="er_priv"><span>I have read the data protection policy and agree with processing of my personal data according to the data protection policy. I can cancel this approval at any time.</span></label>
        <div class="er" id="er_priv" role="alert"></div>
      </fieldset>
      <div class="coActs"><button class="cta alt" type="button" id="coBack2">Back</button><button class="cta" type="submit" id="coSubmit">Submit request</button></div>
    </form>
    <aside class="sum" id="coSum" aria-label="Your cart"></aside>
  </div>`;
  renderSummary();
}
function renderSummary(){
  const el=$('#coSum'); if(!el) return;
  const items=S.basket;
  el.innerHTML=`<h3>Your cart <span class="cnt">${items.length}</span></h3><p class="freeLine">All samples are free of charge.</p>
    ${items.length?`<ul>${items.map(b=>`<li>${art(b.f,b.colour)}<div><b>${esc(b.name)}</b><br><small>${b.colour!=='Standard'?esc(b.colour)+' · ':''}${esc(b.size)}<br>${esc(b.code)}</small></div><button type="button" class="x" data-sumrm="${esc(b.code)}" aria-label="Remove ${esc(b.name)}">✕</button></li>`).join('')}</ul>`:'<p class="hintTxt">Nothing selected.</p>'}
    <button class="link" type="button" id="coMore">+ Add more products</button>`;
}
function openCheckout(){
  if(!S.persona){ openWho(openCheckout); return; }
  document.body.classList.add('checkout'); $('#pCheckout').hidden=false; renderCheckout(); window.scrollTo(0,0);
}
function exitCheckout(){
  leaveCheckout();
  const g=$('#pGrid'); if(g&&!g.hidden) g.scrollIntoView({behavior:reduce?'auto':'smooth'}); else window.scrollTo(0,0);
}

/* ---- "Who are you ordering for?" popup (shown at checkout if not chosen yet) ---- */
const wOv=$('#whoOv'); let wOpener=null, wNext=null;
function openWho(next){
  wNext=next; wOpener=document.activeElement; qClose(); wOv.hidden=false; document.body.classList.add('noscroll'); wOv.querySelector('[data-who]').focus();
}
function closeWho(){
  if(wOv.hidden) return; wOv.hidden=true; document.body.classList.remove('noscroll'); wNext=null; if(wOpener&&wOpener.focus) wOpener.focus(); wOpener=null;
}
$('#whoClose').addEventListener('click',closeWho);
wOv.addEventListener('click',e=>{
  const b=e.target.closest('[data-who]'); if(!b) return;
  const next=wNext; wOv.hidden=true; document.body.classList.remove('noscroll'); wNext=null; wOpener=null;
  applyPersona(b.dataset.who); if(next) next();
});
document.addEventListener('keydown',e=>{
  if(wOv.hidden) return;
  if(e.key==='Escape'){ closeWho(); e.stopPropagation(); }
  else if(e.key==='Tab'){
    const f=[...wOv.querySelectorAll('button')], first=f[0], last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
    else if(!wOv.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
  }
},true);

function validate(){
  const nurse=S.persona==='nurse', F=S.form, E=[], v=id=>(F[id]||'').trim();
  const bad=(id,m)=>{ if(!E.some(e=>e.id===id)) E.push({id,msg:m}); };
  const need=(id,m)=>{ if(!v(id)) bad(id,m); };
  const addr=p=>{ if(!F[p+'addrOk']) bad(p+'addr',v(p+'addr')?'Choose your address from the suggestions.':'Start typing your address, then choose it from the list.'); };
  if(!S.basket.length) bad('basket','Add at least one product.');
  if(nurse){
    if(!S.reqFor) bad('reqFor','Choose what this request is for.');
    else{
      need('first','Enter the clinician’s first name.'); need('last','Enter the clinician’s last name.'); need('org','Enter the hospital or clinic name.');
      if(S.reqFor===REQ_PAT){
        need('pname','Enter the patient’s name.'); need('pmobile','Enter the patient’s mobile number.'); need('pemail','Enter the patient’s email address.'); addr('p');
      }else{
        need('func','Enter the clinician’s title.'); need('mobile','Enter a mobile number.'); need('email','Enter your email address.'); addr('');
      }
    }
  }else{
    need('first','Enter your first name.'); need('last','Enter your last name.'); need('mobile','Enter a mobile number.'); need('email','Enter your email address.'); addr('');
  }
  ['email','pemail'].forEach(id=>{ if(v(id)&&!EMAIL.test(v(id))) bad(id,'Enter a valid email address.'); });
  ['mobile','pmobile'].forEach(id=>{ if(v(id)&&!PHONE.test(v(id))) bad(id,'Enter a valid phone number.'); });
  if(!S.consent.priv) bad('priv','Please agree to the data protection policy to submit.');
  return E;
}
function showErrors(E){
  document.querySelectorAll('#coForm .er').forEach(x=>x.textContent='');
  document.querySelectorAll('#coForm [aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));
  E.forEach(e=>{ const m=$('#er_'+e.id); if(m) m.textContent=e.msg; const i=$('#'+e.id); if(i) i.setAttribute('aria-invalid','true'); });
  const sum=$('#errSum');
  if(E.length){ sum.hidden=false; sum.textContent='Please check '+E.length+(E.length===1?' field':' fields')+' below.'; const first=E[0]; const t=first.id==='reqFor'?$('#rf0'):first.id==='basket'?sum:$('#'+first.id); (t||sum).focus(); }
  else sum.hidden=true;
}

/* ---- Build the email content ---- */
function collect(){
  const nurse=S.persona==='nurse', F=S.form, g=id=>(F[id]||'').trim();
  const name=(a,b)=>[g(a),g(b)].filter(Boolean).join(' ');
  const addr=p=>`${g(p+'street')}, ${g(p+'city')} ${g(p+'state')} ${g(p+'postcode')}, Australia`;
  const sections=[]; let type, contactEmail;
  const sal=g('salut'); const nm=name('first','last');
  if(nurse){
    type=S.reqFor;
    if(S.reqFor===REQ_PAT){
      sections.push(['Clinician',[['Name',(sal?sal+' ':'')+nm],['Hospital / Clinic',g('org')]]]);
      sections.push(['Patient',[['Name',g('pname')],['Mobile',g('pmobile')],['Email',g('pemail')],['Delivery address',addr('p')]]]);
      contactEmail=g('pemail');
    }else{
      sections.push(['Clinician',[['Name',(sal?sal+' ':'')+nm],['Title',g('func')],['Hospital / Clinic',g('org')],['Mobile',g('mobile')],['Email',g('email')]]]);
      sections.push(['Delivery',[['Address',addr('')],['Special instructions',g('notes')||'None']]]);
      contactEmail=g('email');
    }
  }else{
    type='Personal use';
    sections.push(['Customer',[['Name',(sal?sal+' ':'')+nm],['Mobile',g('mobile')],['Email',g('email')]]]);
    sections.push(['Delivery',[['Address',addr('')]]]);
    contactEmail=g('email');
  }
  const items=S.basket.map((b,i)=>`${i+1}. ${b.name}${b.colour!=='Standard'?' – '+b.colour:''} – ${b.size} (code ${b.code})`);
  return {nurse,type,sections,items,contactEmail,extra:g('comments')};
}
function buildParams(ref){
  const c=collect(), when=new Date().toLocaleString('en-AU',{timeZone:'Australia/Sydney',dateStyle:'medium',timeStyle:'short'});
  const text=[`New free sample request ${ref}`,`Request type: ${c.type}`,`Ordering as: ${c.nurse?'Clinician':'Individual'}`,'',
    ...c.sections.flatMap(([t,rows])=>[t.toUpperCase(),...rows.map(([k,v])=>`${k}: ${v}`),'']),
    ...(c.extra?['ADDITIONAL REQUEST',c.extra,'']:[]),`SAMPLES (${c.items.length})`,...c.items,'',`Marketing opt-in: ${S.consent.mkt?'Yes':'No'}`,`Submitted: ${when}`].join('\n');
  const html=`<h2>New free sample request ${esc(ref)}</h2><p><b>Request type:</b> ${esc(c.type)}<br><b>Ordering as:</b> ${c.nurse?'Clinician':'Individual'}</p>`
    +c.sections.map(([t,rows])=>`<h3>${esc(t)}</h3><p>${rows.map(([k,v])=>`<b>${esc(k)}:</b> ${esc(v)}`).join('<br>')}</p>`).join('')
    +(c.extra?`<h3>Additional request</h3><p>${esc(c.extra).replace(/\n/g,'<br>')}</p>`:'')+`<h3>Samples (${c.items.length})</h3><p>${c.items.map(esc).join('<br>')}</p><p><b>Marketing opt-in:</b> ${S.consent.mkt?'Yes':'No'}<br><b>Submitted:</b> ${esc(when)}</p>`;
  return {reference:ref,request_type:c.type,ordering_as:c.nurse?'Clinician':'Individual',reply_to:c.contactEmail,
    samples:c.items.join('\n'),additional_request:c.extra||'None',marketing_opt_in:S.consent.mkt?'Yes':'No',submitted_at:when,message:text,message_html:html};
}

let sending=false;
async function submitCheckout(){
  if(sending) return;
  const E=validate(); showErrors(E); if(E.length) return;
  const nurse=S.persona==='nurse', ref='SR-'+Math.random().toString(36).slice(2,8).toUpperCase();
  const params=buildParams(ref), btn=$('#coSubmit'), sum=$('#errSum');
  const demo=!emailReady();
  if(!demo){
    sending=true; btn.disabled=true; btn.textContent='Sending…'; btn.setAttribute('aria-busy','true');
    try{
      await emailjs.send(EMAILJS_CONFIG.serviceId,EMAILJS_CONFIG.templateId,params,{publicKey:EMAILJS_CONFIG.publicKey});
    }catch(err){
      sending=false; btn.disabled=false; btn.textContent='Submit request'; btn.removeAttribute('aria-busy');
      sum.hidden=false; sum.textContent='Sorry, we couldn’t send your request'+(err&&err.text?' ('+err.text+')':'')+'. Please check your connection and try again, or use Contact us.'; sum.focus();
      console.error('EmailJS error',err); return;
    }
    sending=false;
  }else console.warn('EmailJS is not configured (see EMAILJS_CONFIG in main.js). Nothing was sent. Email content:\n'+params.message);
  const c=collect(), deliver=c.sections.find(s=>/Delivery|Patient/.test(s[0]));
  const addrRow=(c.sections.flatMap(s=>s[1]).filter(r=>/address/i.test(r[0]))[0]||['',''])[1];
  $('#pCheckout').innerHTML=`<div class="coWrap done"><div class="tick" aria-hidden="true">✓</div>
    <h2>${demo?'Request ready (demo)':'Request submitted'}</h2>
    <p class="coSub">Reference <b>${esc(ref)}</b>.${demo?' Email sending isn’t set up yet, so nothing was emailed. Add your EmailJS details in main.js to switch it on.':' Your request has been sent to B. Braun Australia.'}</p>
    <dl class="dlist"><dt>Samples</dt><dd>${S.basket.length} ${S.basket.length===1?'item':'items'}${nurse&&S.reqFor?' · '+esc(S.reqFor):''}</dd>
      <dt>Deliver to</dt><dd>${esc(addrRow)}</dd></dl>
    <button class="cta" type="button" id="coNew">Start a new request</button></div>`;
  window.scrollTo(0,0);
}
function resetAll(){
  S.basket=[]; S.form={}; S.reqFor=''; S.consent={mkt:true,priv:false}; S.cat=null; S.a=S.b=S.c=''; updBasket();
  leaveCheckout(); ['#pCat','#pFilter','#pGrid'].forEach(s=>$(s).hidden=true); S.persona=null; $('#persona').hidden=true; $('#q').value=''; $('#results').hidden=true;
  document.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed','false'));
  window.scrollTo(0,0);
}

/* ---------- Address autocomplete ----------
   Add a Google Maps Platform key (Places API (New) enabled, restricted to your website) to use Google.
   Without a key the free OpenStreetMap service is used, which is fine for testing but less complete
   (it often lacks unit numbers). */
const ADDRESS_CONFIG={googleKey:'YOUR_GOOGLE_MAPS_KEY'};
const useGoogle=()=>ADDRESS_CONFIG.googleKey&&!/^YOUR_/.test(ADDRESS_CONFIG.googleKey);
const ST_ABBR={'New South Wales':'NSW','Victoria':'VIC','Queensland':'QLD','Western Australia':'WA','South Australia':'SA','Tasmania':'TAS','Australian Capital Territory':'ACT','Northern Territory':'NT'};
const ST_FORM={NSW:'New South Wales',VIC:'Victoria',QLD:'Queensland',WA:'Western Australia',SA:'South Australia',TAS:'Tasmania',ACT:'ACT',NT:'NT'};
const mkAddr=(street,city,abbr,pc)=>({street,city,state:ST_FORM[abbr]||'',postcode:pc||'',label:`${street}, ${city} ${abbr} ${pc}`.replace(/\s+/g,' ').trim()});
let acTok=null;
async function acGoogle(q,sig){
  acTok=acTok||(crypto.randomUUID?crypto.randomUUID():String(Date.now()));
  const r=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',signal:sig,
    headers:{'Content-Type':'application/json','X-Goog-Api-Key':ADDRESS_CONFIG.googleKey},
    body:JSON.stringify({input:q,includedRegionCodes:['au'],sessionToken:acTok,includedPrimaryTypes:['street_address','subpremise','premise']})});
  if(!r.ok) throw new Error(r.status);
  const j=await r.json();
  return (j.suggestions||[]).filter(s=>s.placePrediction).map(s=>({label:s.placePrediction.text.text.replace(/,\s*Australia$/,''),
    resolve:async()=>{
      const d=await fetch('https://places.googleapis.com/v1/places/'+s.placePrediction.placeId+'?sessionToken='+acTok,{headers:{'X-Goog-Api-Key':ADDRESS_CONFIG.googleKey,'X-Goog-FieldMask':'addressComponents'}});
      acTok=null; if(!d.ok) throw new Error(d.status);
      const c={}; ((await d.json()).addressComponents||[]).forEach(x=>(x.types||[]).forEach(t=>{ c[t]=x; }));
      const g=k=>c[k]?c[k].longText:'';
      const num=[g('subpremise')&&g('subpremise')+'/',g('street_number')].join('');
      const street=[num,g('route')].filter(Boolean).join(' ');
      return mkAddr(street,g('locality')||g('sublocality')||g('postal_town'),c.administrative_area_level_1?c.administrative_area_level_1.shortText:'',g('postal_code'));
    }}));
}
async function acOSM(q,sig){
  const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=au&limit=6&q='+encodeURIComponent(q),{signal:sig,headers:{'Accept-Language':'en-AU'}});
  if(!r.ok) throw new Error(r.status);
  return (await r.json()).filter(x=>x.address&&x.address.road&&x.address.postcode).map(x=>{
    const a=x.address, street=[a.house_number,a.road].filter(Boolean).join(' ');
    const ad=mkAddr(street,a.suburb||a.city||a.town||a.village||a.municipality||'',ST_ABBR[a.state]||'',a.postcode);
    return {label:ad.label,resolve:async()=>ad};
  }).filter((x,i,arr)=>arr.findIndex(y=>y.label===x.label)===i);
}
const ac={items:[],active:-1,timer:0,ctl:null,input:null,seq:0};
function acList(inp){ return $('#ac_'+inp.id); }
function acClose(){ if(!ac.input) return; const l=acList(ac.input); if(l) l.hidden=true; ac.input.setAttribute('aria-expanded','false'); ac.input.removeAttribute('aria-activedescendant'); ac.active=-1; }
function acPaint(msg){
  const inp=ac.input, l=acList(inp); if(!l) return;
  l.innerHTML=msg?`<li class="acMsg" role="presentation">${esc(msg)}</li>`:ac.items.map((x,i)=>`<li role="option" id="${inp.id}_o${i}" data-i="${i}" aria-selected="${i===ac.active}">${esc(x.label)}</li>`).join('');
  l.hidden=false; inp.setAttribute('aria-expanded','true');
  if(ac.active>=0) inp.setAttribute('aria-activedescendant',`${inp.id}_o${ac.active}`); else inp.removeAttribute('aria-activedescendant');
}
function acClear(p){ ['street','city','state','postcode'].forEach(k=>delete S.form[p+k]); S.form[p+'addrOk']=false; }
async function acPick(i){
  const inp=ac.input, p=inp.dataset.ac, it=ac.items[i]; if(!it) return;
  try{
    const a=await it.resolve();
    if(!a.street||!a.city||!a.state||!/^\d{4}$/.test(a.postcode)){ acPaint('That result has no full street address. Try adding the street number.'); return; }
    Object.assign(S.form,{[p+'street']:a.street,[p+'city']:a.city,[p+'state']:a.state,[p+'postcode']:a.postcode,[p+'addr']:a.label,[p+'addrOk']:true});
    inp.value=a.label; inp.classList.add('ok'); inp.removeAttribute('aria-invalid');
    const m=$('#er_'+inp.id); if(m) m.textContent='';
    acClose();
  }catch(e){ acPaint('Could not load that address. Please try another.'); }
}
function acSearch(inp){
  ac.input=inp; clearTimeout(ac.timer); if(ac.ctl) ac.ctl.abort();
  const q=inp.value.trim(); if(q.length<4){ ac.items=[]; acClose(); return; }
  const my=++ac.seq;
  ac.timer=setTimeout(async()=>{
    ac.ctl=new AbortController();
    try{
      const items=await (useGoogle()?acGoogle:acOSM)(q,ac.ctl.signal);
      if(my!==ac.seq) return;
      ac.items=items; ac.active=-1; acPaint(items.length?'':'No matching address found. Check the spelling or add the street number.');
    }catch(e){ if(e.name!=='AbortError'&&my===ac.seq){ ac.items=[]; acPaint('Address lookup is unavailable right now. Please try again shortly.'); } }
  },useGoogle()?250:450);
}
const co=$('#pCheckout');
co.addEventListener('input',e=>{
  const t=e.target; if(!t.id||t.type==='radio'||t.type==='checkbox') return;
  S.form[t.id]=t.value;
  if(t.dataset.ac!==undefined){ acClear(t.dataset.ac); t.classList.remove('ok'); acSearch(t); }
  const m=$('#er_'+t.id); if(m) m.textContent=''; t.removeAttribute('aria-invalid');
  if((t.id==='postcode'||t.id==='ppostcode')&&/^\d{4}$/.test(t.value)){ const sid=t.id==='postcode'?'state':'pstate'; if(!S.form[sid+'Manual']){ const st=stateFromPostcode(t.value); if(st){ S.form[sid]=st; const sel=$('#'+sid); if(sel) sel.value=st; } } }
});
co.addEventListener('change',e=>{
  const t=e.target;
  if(t.name==='salut') S.form.salut=t.value;
  else if(t.name==='reqFor'){ S.reqFor=t.value; renderCheckout(); const r=$('#coForm input[name=reqFor]:checked'); if(r) r.focus(); }
  else if(t.id==='mkt') S.consent.mkt=t.checked;
  else if(t.id==='priv'){ S.consent.priv=t.checked; if(t.checked) $('#er_priv').textContent=''; }
  else if(t.id==='state'||t.id==='pstate'){ S.form[t.id]=t.value; S.form[t.id+'Manual']=true; const m=$('#er_'+t.id); if(m) m.textContent=''; }
});
co.addEventListener('keydown',e=>{
  const t=e.target; if(t.dataset&&t.dataset.ac===undefined) return;
  const l=acList(t); if(!l||l.hidden){ if(e.key==='ArrowDown'&&t.value.trim().length>=4){ e.preventDefault(); acSearch(t); } return; }
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); const n=ac.items.length; if(!n) return; ac.active=(ac.active+(e.key==='ArrowDown'?1:-1)+n)%n; acPaint(); const o=$('#'+t.id+'_o'+ac.active); if(o) o.scrollIntoView({block:'nearest'}); }
  else if(e.key==='Enter'){ if(ac.active>=0){ e.preventDefault(); acPick(ac.active); } else if(ac.items.length===1){ e.preventDefault(); acPick(0); } else e.preventDefault(); }
  else if(e.key==='Escape'){ e.stopPropagation(); acClose(); }
});
co.addEventListener('focusout',e=>{ if(e.target.dataset&&e.target.dataset.ac!==undefined) setTimeout(acClose,150); });
co.addEventListener('mousedown',e=>{ if(e.target.closest('.acList')) e.preventDefault(); });
co.addEventListener('submit',e=>{ e.preventDefault(); submitCheckout(); });
co.addEventListener('click',e=>{
  const ao=e.target.closest('.acList [data-i]'); if(ao){ acPick(+ao.dataset.i); return; }
  if(e.target.closest('#coBack,#coBack2,#coMore')){ exitCheckout(); return; }
  const rm=e.target.closest('[data-sumrm]'); if(rm){ S.basket=S.basket.filter(b=>b.code!==rm.dataset.sumrm); updBasket(); if(!S.basket.length) renderCheckout(); return; }
  if(e.target.closest('#coNew')) resetAll();
});



/* ---------- Back button (steps back one page) ---------- */
const STEPS=['hero','pCat','pFilter','pGrid'];
const backRow=$('#backRow'), backBtn=$('#backBtn');
function stepNow(){
  if(!$('#pCheckout').hidden) return 'pCheckout';
  let cur='hero';
  STEPS.forEach(id=>{ const el=document.getElementById(id); if(el&&!el.hidden&&el.getBoundingClientRect().top<=window.innerHeight*0.45) cur=id; });
  return cur;
}
function syncBack(){
  const bar=$('#bar'); document.documentElement.style.setProperty('--barH',bar.offsetHeight+'px');
  backRow.hidden=stepNow()==='hero';
  const s=stepNow(), d=s==='pGrid'&&!$('#detailView').hidden;
  backBtn.querySelector('span').textContent=s==='pCheckout'?'Back to products':d?'Back to results':'Back';
}
backBtn.addEventListener('click',()=>{
  const s=stepNow(), go=el=>el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
  if(s==='pCheckout'){ exitCheckout(); return; }
  if(s==='pGrid'&&!$('#detailView').hidden){ $('#detailView').hidden=true; $('#gridView').hidden=false; go($('#pGrid')); syncBack(); return; }
  const i=STEPS.indexOf(s); if(i>0){ let j=i-1; while(j>0&&document.getElementById(STEPS[j]).hidden) j--; go(document.getElementById(STEPS[j])); }
});
let backRaf=0; const queueBack=()=>{ cancelAnimationFrame(backRaf); backRaf=requestAnimationFrame(syncBack); };
addEventListener('scroll',queueBack,{passive:true}); addEventListener('resize',queueBack);
new MutationObserver(queueBack).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','class']});
syncBack();

/* ---------- Optional live data (see LIVE_CSV_URL at the top) ---------- */
if(LIVE_CSV_URL){
  const urls=[].concat(LIVE_CSV_URL);
  Promise.all(urls.map(u=>fetch(u,{cache:'no-store'}).then(r=>{ if(!r.ok) throw new Error(r.status); return r.text(); }))).then(parts=>{
    const cat=buildCatalog([].concat(...parts.map(rowsFromCSV))); if(!cat.length) return;
    CATALOG=cat;
    if(S.cat){ renderDropdowns(); if(!$('#pGrid').hidden&&$('#detailView').hidden) showGrid(); }
  }).catch(()=>{ /* keep the snapshot */ });
}

window.__t={tileName,get CATALOG(){return CATALOG;},S,matches,buildCatalog,rowsFromCSV,parseCSV,SNAPSHOT,groupRows,toRow,pretty,typeOptions,ringOptions,sysOptions,contOptions,validate,renderCheckout,renderDetail,openDetail};
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
