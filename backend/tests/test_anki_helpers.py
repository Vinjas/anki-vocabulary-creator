import unittest

from utils.anki_helpers import (
    build_gender_info,
    format_german_word,
    get_part_of_speech_and_color,
)


class AnkiHelpersTests(unittest.TestCase):
    def test_formats_noun_with_article(self):
        data = {
            "german_word": "Haus",
            "part_of_speech": "NOUN",
            "article": "das",
        }
        self.assertEqual(format_german_word(data), "das Haus")

    def test_leaves_non_noun_without_article(self):
        data = {
            "german_word": "lernen",
            "part_of_speech": "VERB",
            "article": "N/A",
        }
        self.assertEqual(format_german_word(data), "lernen")

    def test_returns_noun_name_and_gender_color(self):
        data = {"part_of_speech": "NOUN", "gender": "Fem"}
        self.assertEqual(
            get_part_of_speech_and_color(data),
            ("Noun", "#FF69B4"),
        )

    def test_builds_gender_label(self):
        data = {"part_of_speech": "NOUN", "gender": "Neut"}
        self.assertIn("Neuter", build_gender_info(data))


if __name__ == "__main__":
    unittest.main()
