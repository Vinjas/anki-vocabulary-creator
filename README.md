# Anki Vocabulary Creator

Create bidirectional German-Spanish Anki decks from TXT or CSV word lists.

## Requirements

- Python 3.10 or newer
- A Gemini API key

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add your Gemini API key to `.env`:

```dotenv
GEMINI_API_KEY=your_api_key
```

The `.env` file is ignored by Git and must never be committed.

## Usage

Process every `.txt` and `.csv` file in the project root:

```bash
python main.py
```

Process a specific file without copying it into the repository:

```bash
python main.py /path/to/words.csv
```

TXT files should contain one German word per line. CSV files may contain one
word per row or a named word column such as `german`, `deutsch`, `word`, or
`term`.

## Privacy

Input `.txt` and `.csv` files, `.env` files, virtual environments, logs, and
generated Anki packages are ignored by Git. The script also avoids printing
individual vocabulary entries while processing Gemini batches.

## Tests

```bash
python -m unittest discover -s tests -v
```
