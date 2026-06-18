import csv
from pathlib import Path


SUPPORTED_EXTENSIONS = {".txt", ".csv"}
WORD_COLUMN_NAMES = {
    "aleman",
    "alemán",
    "deutsch",
    "german",
    "palabra",
    "term",
    "word",
}


def _clean_words(words):
    return [
        word.strip()
        for word in words
        if word and word.strip() and not word.strip().startswith("#")
    ]


def read_txt(file_path):
    with open(file_path, "r", encoding="utf-8-sig") as input_file:
        return _clean_words(input_file)


def _detect_csv_dialect(content):
    sample = content[:4096]
    try:
        return csv.Sniffer().sniff(sample, delimiters=",;\t|")
    except csv.Error:
        return csv.excel


def read_csv(file_path):
    with open(file_path, "r", encoding="utf-8-sig", newline="") as input_file:
        content = input_file.read()

    if not content.strip():
        return []

    rows = list(
        csv.reader(content.splitlines(), dialect=_detect_csv_dialect(content))
    )
    rows = [row for row in rows if any(cell.strip() for cell in row)]
    if not rows:
        return []

    header = [cell.strip().lower() for cell in rows[0]]
    word_column_index = next(
        (
            index
            for index, column_name in enumerate(header)
            if column_name in WORD_COLUMN_NAMES
        ),
        0,
    )
    has_header = header[word_column_index] in WORD_COLUMN_NAMES
    data_rows = rows[1:] if has_header else rows

    words = [
        row[word_column_index]
        for row in data_rows
        if len(row) > word_column_index
    ]
    return _clean_words(words)


def read_words(file_path):
    path = Path(file_path)
    extension = path.suffix.lower()

    if extension == ".txt":
        return read_txt(path)
    if extension == ".csv":
        return read_csv(path)

    supported_extensions = ", ".join(sorted(SUPPORTED_EXTENSIONS))
    raise ValueError(
        f"Unsupported format: '{extension or 'no extension'}'. "
        f"Use one of these formats: {supported_extensions}"
    )
