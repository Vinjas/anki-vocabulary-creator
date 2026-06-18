import json
import unittest

from utils.gemini_deck_builder import (
    build_batch_prompt,
    create_batches,
    create_deck_id,
)


class GeminiDeckBuilderTests(unittest.TestCase):
    def test_creates_batches(self):
        self.assertEqual(
            list(create_batches(["a", "b", "c"], 2)),
            [["a", "b"], ["c"]],
        )

    def test_prompt_contains_json_encoded_words(self):
        words = ["schön", 'word with "quotes"']
        prompt = build_batch_prompt(words)
        self.assertIn(json.dumps(words, ensure_ascii=False), prompt)
        self.assertIn('"german_word"', prompt)

    def test_deck_id_is_stable_and_anki_compatible(self):
        first_id = create_deck_id("My German Deck")
        second_id = create_deck_id("My German Deck")
        self.assertEqual(first_id, second_id)
        self.assertGreaterEqual(first_id, 1 << 30)
        self.assertLess(first_id, 1 << 31)


if __name__ == "__main__":
    unittest.main()
