import sys
from pathlib import Path

from utils.input_processor import find_input_files, process_input_file


def get_input_files(arguments):
    if arguments:
        return [Path(argument).expanduser() for argument in arguments]
    return find_input_files()


def main():
    """Run the Anki deck generator."""
    print("=" * 70)
    print("🎴 AUTOMATIC GERMAN ANKI DECK GENERATOR")
    print("=" * 70)
    print()

    print("🔍 Looking for .txt and .csv files...")
    input_files = get_input_files(sys.argv[1:])

    if not input_files:
        print("❌ No .txt or .csv files were found")
        print()
        print("💡 Instructions:")
        print("   1. Create a .txt or .csv file containing your words")
        print("   2. Save it next to this script and run: python main.py")
        print("      or pass it directly: python main.py /path/to/words.csv")
        print()
        print("📝 Example (one German word per row):")
        print("   Haus")
        print("   lernen")
        print("   schön")
        sys.exit(0)

    print(f"✅ Found {len(input_files)} input file(s):")
    for input_file in input_files:
        print(f"   • {input_file.name}")
    print()

    successful_files = 0
    failed_files = 0

    for input_file in input_files:
        if process_input_file(input_file):
            successful_files += 1
        else:
            failed_files += 1

    print("\n" + "=" * 70)
    print("📊 FINAL SUMMARY")
    print("=" * 70)
    print(f"✅ Successfully processed files: {successful_files}")
    if failed_files > 0:
        print(f"❌ Files with errors: {failed_files}")
    print()

    if successful_files > 0:
        print("📱 Next steps:")
        print("   1. Open Anki")
        print("   2. Go to 'File' → 'Import'")
        print("   3. Select the generated .apkg files")
        print("   4. Start studying!")

    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
