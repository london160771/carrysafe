from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")
OUT_DIR = Path(__file__).resolve().parent.parent / "samples" / "generated"
SIZE = (1100, 560)

LABELS = {
    "pseudoephedrine-sample.png": [
        ("Pseudoephedrine Hydrochloride", 46, True),
        ("60 mg tablets", 40, False),
        ("Nasal decongestant", 30, False),
        ("Each tablet contains pseudoephedrine hydrochloride 60 mg", 24, False),
        ("24 tablets", 36, True),
    ],
    "methylphenidate-sample.png": [
        ("Methylphenidate Hydrochloride", 46, True),
        ("10 mg tablets", 40, False),
        ("Prescription only medicine", 30, False),
        ("Each tablet contains methylphenidate hydrochloride 10 mg", 24, False),
        ("30 tablets", 36, True),
    ],
}

FOOTER = "SAMPLE LABEL · made by Carry Safe for demo · not a real product"


def font(size, bold):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    return ImageFont.truetype(str(FONT_DIR / name), size)


def draw_label(lines):
    image = Image.new("RGB", SIZE, "white")
    draw = ImageDraw.Draw(image)
    draw.rectangle([12, 12, SIZE[0] - 12, SIZE[1] - 12], outline="#1b4f72", width=6)
    y = 50
    for text, size, bold in lines:
        draw.text((48, y), text, fill="#111111", font=font(size, bold))
        y += size + 34
    draw.rectangle([12, SIZE[1] - 70, SIZE[0] - 12, SIZE[1] - 12], fill="#c0392b")
    draw.text((48, SIZE[1] - 58), FOOTER, fill="white", font=font(22, True))
    return image


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, lines in LABELS.items():
        draw_label(lines).save(OUT_DIR / filename, optimize=True)


if __name__ == "__main__":
    main()
