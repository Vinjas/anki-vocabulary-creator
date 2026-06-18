#!/usr/bin/env python3

from pathlib import Path

from utils.anki_helpers import write_anki_package
from utils.gemini_deck_builder import build_deck
from utils.word_reader import SUPPORTED_EXTENSIONS, read_words


def read_words_from_file(file_path):
    """Read words from a TXT or CSV file."""
    try:
        return read_words(file_path)
    except FileNotFoundError:
        print(f"❌ Error: File not found: '{file_path}'")
        return None
    except ValueError as error:
        print(f"❌ Error: {error}")
        return None
    except Exception as error:
        print(f"❌ Error while reading the file: {error}")
        return None


def find_input_files():
    """Find TXT and CSV input files in the current directory."""
    excluded_files = {
        "instructions.txt",
        "leeme.txt",
        "readme.txt",
        "requirements.txt",
    }
    files = [
        file
        for file in Path(".").iterdir()
        if (
            file.is_file()
            and file.suffix.lower() in SUPPORTED_EXTENSIONS
            and file.name.lower() not in excluded_files
        )
    ]
    return sorted(files, key=lambda file: file.name.lower())


def _safe_output_name(deck_name):
    return deck_name.replace(" ", "_").replace("/", "_").replace("\\", "_")


def process_input_file(input_file):
    """Process a TXT or CSV file and generate its Anki deck."""
    input_file = Path(input_file)
    file_name = input_file.name
    base_name = input_file.stem

    print("\n" + "=" * 70)
    print(f"📄 PROCESSING: {file_name}")
    print("=" * 70)

    print("📖 Reading words from the file...")
    words = read_words_from_file(input_file)

    if words is None:
        return False

    if not words:
        print(f"⚠️  The file '{file_name}' contains no valid words")
        print("   The file will not be deleted")
        return False

    print(f"✅ Found {len(words)} words")
    print()

    print("\n📚 What would you like to call this deck?")
    deck_name_input = input(
        "   Deck name (press Enter to use the file name): "
    ).strip()

    if deck_name_input:
        deck_name = deck_name_input
        output_file = f"{_safe_output_name(deck_name)}.apkg"
    else:
        deck_name = base_name.replace("_", " ").title()
        output_file = f"{base_name}.apkg"

    print(f"📚 Deck name:  {deck_name}")
    print(f"📦 Output file: {output_file}")
    print()

    print("🔄 Processing words...")
    print("-" * 70)

    try:
        deck = build_deck(words, deck_name)
    except Exception as error:
        print(f"\n❌ Error while processing the words: {error}")
        return False

    processed_word_count = len(deck.notes)
    if processed_word_count == 0:
        print("❌ No cards were created. The output file will not be written.")
        return False

    print("-" * 70)
    print()

    print("💾 Creating .apkg file...")
    try:
        write_anki_package(deck, output_file)
    except Exception as error:
        print(f"❌ Error while creating the package: {error}")
        return False

    print()
    print("✅ COMPLETED!")
    print(f"   • Words processed: {processed_word_count}/{len(words)}")
    print(f"   • Cards generated: {processed_word_count * 2} (bidirectional)")
    print(f"   • File created:    {output_file}")

    return True
