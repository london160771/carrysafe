# Sample medicine images

## Real photos (taken by Adesope, Nov 15, 2026)
Cropped to the label; metadata stripped. Use them for Gate 0 steps 1–2 (PRD §16) and on-device tests.

| File | What the label says (ground truth) | Good test for |
|---|---|---|
| `real/broncholyte-front.jpg` | Broncholyte · Bromhexine Hydrochloride · 4 mg/5 ml · elixir (bottle size partly visible) | Extraction (English); **Framing Coach**: text is cut off on the right edge ("contains", "Hydrochloride") |
| `real/broncholyte-back-fr.jpg` | Same product, French side: "Chlorhydrate de Bromhexine 4mg" per 5 ml; NAFDAC Reg. No., batch, dates | Non-English label; synonym matching (`chlorhydrate de bromhexine` → bromhexine) |
| `real/orphesic-blister.jpg` | Orphesic · Orphenadrine Citrate 35 mg + Paracetamol 450 mg per tablet (foil, faint print, used blister) | Hard case: shiny foil, two ingredients, low contrast |

Ingredients covered: bromhexine, orphenadrine, paracetamol.

## Sample labels for the seed trip (to be made in Phase 0/1)
The seed "Amaka-Tokyo" (PRD §19) also needs **pseudoephedrine** and **methylphenidate**. We don't use product photos from the web (copyright). Instead we generate our own plain sample labels in `samples/generated/` with code:
- generic names only, no real brand names or logos;
- a visible "SAMPLE LABEL · made by Carry Safe for demo" line;
- labelled "Sample photo" in the UI (PRD §17).

If Adesope later sends real photos of these, add them to `real/` and update this table.
