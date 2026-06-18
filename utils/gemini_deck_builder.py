import hashlib
import json
import os

import genanki
from dotenv import load_dotenv

from utils.anki_helpers import (
    build_gender_info,
    format_german_word,
    get_part_of_speech_and_color,
)


load_dotenv()

ANKI_MODEL = genanki.Model(
    1607392319,
    "Bidirectional German Vocabulary",
    fields=[
        {"name": "GermanWord"},
        {"name": "SpanishWord"},
        {"name": "PartOfSpeech"},
        {"name": "GermanExample"},
        {"name": "SpanishExample"},
        {"name": "Color"},
        {"name": "GenderInfo"},
    ],
    templates=[
        {
            "name": "German → Spanish",
            "qfmt": '''<div style="font-size: 32px; text-align: center; color: {{Color}}; font-weight: bold; margin-bottom: 10px;">
                {{GermanWord}}
            </div>
            <div style="font-size: 14px; text-align: center; color: #666; margin-top: 15px;">
                <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px;">{{PartOfSpeech}}</span>
                {{GenderInfo}}
            </div>
            <div style="font-size: 16px; text-align: center; color: #fff; margin-top: 20px; font-style: italic;">
                {{GermanExample}}
            </div>''',
            "afmt": '''{{FrontSide}}
                <hr id="answer">
                <div style="font-size: 24px; text-align: center; margin: 15px 0;">
                    <b>{{SpanishWord}}</b>
                </div>
                <div style="font-size: 16px; text-align: center; color: #fff; font-style: italic;">
                    {{SpanishExample}}
                </div>''',
        },
        {
            "name": "Spanish → German",
            "qfmt": '''<div style="font-size: 32px; text-align: center; font-weight: bold; margin-bottom: 10px;">
                {{SpanishWord}}
            </div>
            <div style="font-size: 14px; text-align: center; color: #666; margin-top: 15px;">
                <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px;">{{PartOfSpeech}}</span>
            </div>
            <div style="font-size: 16px; text-align: center; color: #444; margin-top: 20px; font-style: italic;">
                {{SpanishExample}}
            </div>''',
            "afmt": '''{{FrontSide}}
                <hr id="answer">
                <div style="font-size: 24px; text-align: center; color: {{Color}}; margin: 15px 0;">
                    <b>{{GermanWord}}</b>
                </div>
                <div style="font-size: 14px; text-align: center; color: #666;">
                    {{GenderInfo}}
                </div>
                <div style="font-size: 16px; text-align: center; color: #555; font-style: italic;">
                    {{GermanExample}}
                </div>''',
        },
    ],
)


RESPONSE_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "german_word": {"type": "string"},
            "spanish_word": {"type": "string"},
            "part_of_speech": {"type": "string"},
            "gender": {"type": "string"},
            "article": {"type": "string"},
            "plural": {"type": "string"},
            "german_example": {"type": "string"},
            "spanish_example": {"type": "string"},
        },
        "required": [
            "german_word",
            "spanish_word",
            "part_of_speech",
            "gender",
            "article",
            "plural",
            "german_example",
            "spanish_example",
        ],
    },
}


def _get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        api_key = os.getenv("DEEPL_API_KEY")
        if api_key:
            print(
                "⚠️ DEEPL_API_KEY is deprecated for this project. "
                "Rename it to GEMINI_API_KEY in your .env file."
            )

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. Add it to your .env file."
        )

    try:
        from google import genai
    except ImportError as error:
        raise RuntimeError(
            "The google-genai package is missing. "
            "Install the dependencies from requirements.txt."
        ) from error

    return genai.Client(api_key=api_key)


def build_batch_prompt(word_batch):
    words_json = json.dumps(word_batch, ensure_ascii=False)
    return f"""
    You are an expert German-Spanish linguist creating flashcard data.
    Analyze every German word in this JSON array: {words_json}

    Words may be conjugated, declined, pluralized, or inflected. Normalize each
    one to its most basic form or infinitive. The example sentence may use an
    inflected or conjugated form.

    Return one valid JSON array containing exactly one object for every input
    word, in the same order. Each object must use this exact structure:
    {{
      "german_word": "Normalized German word; capitalize nouns",
      "spanish_word": "Primary Spanish translation",
      "part_of_speech": "POS tag such as NOUN, VERB, ADJ, or ADV",
      "gender": "Neut, Fem, Masc, or N/A",
      "article": "German article such as das, or N/A",
      "plural": "German plural form, or N/A",
      "german_example": "Example sentence in German",
      "spanish_example": "Spanish translation of the example sentence"
    }}

    Return only the JSON array.
    """


def create_batches(items, batch_size):
    """Split a list into batches."""
    for start in range(0, len(items), batch_size):
        yield items[start : start + batch_size]


def create_deck_id(deck_name):
    """Create a stable Anki-compatible ID from the deck name."""
    digest = hashlib.sha256(deck_name.encode("utf-8")).digest()
    return (1 << 30) + (int.from_bytes(digest[:4], "big") % (1 << 30))


def build_deck(words, deck_name="German Vocabulary", batch_size=10):
    """Build an Anki deck from a list of German words."""
    deck_id = create_deck_id(deck_name)
    deck = genanki.Deck(deck_id, deck_name)
    batches = list(create_batches(words, batch_size))
    batch_count = len(batches)
    gemini_client = _get_gemini_client()
    model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

    print(
        f"Splitting {len(words)} words into "
        f"{batch_count} batches of up to {batch_size}..."
    )

    for batch_index, word_batch in enumerate(batches, start=1):
        print(f"\n--- Processing batch {batch_index}/{batch_count} ---")

        try:
            prompt = build_batch_prompt(word_batch)
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": RESPONSE_SCHEMA,
                },
            )
            entries = json.loads(response.text)

            if not isinstance(entries, list):
                raise ValueError("Gemini returned JSON that is not an array")

            if len(entries) != len(word_batch):
                print(
                    f"  ⚠️ Expected {len(word_batch)} entries, "
                    f"but Gemini returned {len(entries)}."
                )

            for entry in entries:
                german_word = format_german_word(entry)
                spanish_word = entry.get("spanish_word", "Error")
                part_of_speech, color = get_part_of_speech_and_color(entry)
                german_example = entry.get("german_example", "Error")
                spanish_example = entry.get("spanish_example", "Error")
                gender_info = build_gender_info(entry)

                note = genanki.Note(
                    model=ANKI_MODEL,
                    fields=[
                        german_word,
                        spanish_word,
                        part_of_speech,
                        german_example,
                        spanish_example,
                        color,
                        gender_info,
                    ],
                )
                deck.add_note(note)

            print(f"  ✅ Processed {len(entries)} entries")

        except Exception as error:
            print(f"❌ Error while processing batch {batch_index}: {error}")
            print("   This batch will be skipped.")

    return deck
