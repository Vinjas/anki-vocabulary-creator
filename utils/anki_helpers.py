import genanki


def get_part_of_speech_and_color(gemini_data):
    """Return a readable part of speech and its card color."""
    part_of_speech = gemini_data.get("part_of_speech", "UNK")
    gender = gemini_data.get("gender", "N/A")

    part_of_speech_names = {
        "NOUN": "Noun",
        "VERB": "Verb",
        "ADJ": "Adjective",
        "ADV": "Adverb",
        "PRON": "Pronoun",
        "ADP": "Preposition",
        "CONJ": "Conjunction",
        "DET": "Determiner",
    }
    colors = {
        "NOUN": None,
        "VERB": "#FF8C00",
        "ADJ": "#9370DB",
        "ADV": "#20B2AA",
        "PRON": "#DAA520",
        "ADP": "#CD5C5C",
        "CONJ": "#708090",
        "DET": "#8B4513",
    }

    readable_name = part_of_speech_names.get(part_of_speech, part_of_speech)
    color = colors.get(part_of_speech, "#808080")

    if part_of_speech == "NOUN":
        noun_colors = {
            "Masc": "#3F7DDA",
            "Fem": "#FF69B4",
            "Neut": "#32CD32",
        }
        color = noun_colors.get(gender, "#808080")

    return readable_name, color


def format_german_word(gemini_data):
    """Add the article to German nouns."""
    if (
        gemini_data.get("part_of_speech") == "NOUN"
        and gemini_data.get("article") != "N/A"
    ):
        return f"{gemini_data['article']} {gemini_data['german_word']}"

    return gemini_data.get("german_word", "Error")


def build_gender_info(gemini_data):
    """Build the HTML gender label shown on noun cards."""
    if (
        gemini_data.get("part_of_speech") == "NOUN"
        and gemini_data.get("gender") != "N/A"
    ):
        gender_labels = {
            "Masc": ("Masculine", "♂️"),
            "Fem": ("Feminine", "♀️"),
            "Neut": ("Neuter", "⚪"),
        }
        gender = gemini_data["gender"]

        if gender in gender_labels:
            label, emoji = gender_labels[gender]
            return f'<span style="margin-left: 10px;">{emoji} {label}</span>'

    return ""


def write_anki_package(deck, file_name="german_vocabulary.apkg"):
    """Write an Anki deck to an .apkg file."""
    package = genanki.Package(deck)
    package.write_to_file(file_name)
    print(f"\n✅ Deck created successfully: {file_name}")
