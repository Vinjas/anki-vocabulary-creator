import tempfile
import unittest
from pathlib import Path

from utils.word_reader import read_words


class WordReaderTests(unittest.TestCase):
    def create_file(self, name, content):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        path = Path(directory.name) / name
        path.write_text(content, encoding="utf-8")
        return path

    def test_reads_txt_while_ignoring_blanks_and_comments(self):
        path = self.create_file("words.txt", "Haus\n\n# comment\nlernen\n")
        self.assertEqual(read_words(path), ["Haus", "lernen"])

    def test_reads_single_column_csv_without_header(self):
        path = self.create_file("collections.csv", "allerdings\nAlltag\nÄrger\n")
        self.assertEqual(read_words(path), ["allerdings", "Alltag", "Ärger"])

    def test_reads_named_word_column_from_semicolon_csv(self):
        path = self.create_file(
            "words.csv",
            "translation;german;note\nhouse;Haus;noun\nlearn;lernen;verb\n",
        )
        self.assertEqual(read_words(path), ["Haus", "lernen"])

    def test_rejects_unsupported_extension(self):
        path = self.create_file("words.json", "[]")
        with self.assertRaises(ValueError):
            read_words(path)


if __name__ == "__main__":
    unittest.main()
