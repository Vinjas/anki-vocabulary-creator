import json
import os
import unittest
from unittest.mock import patch

from utils.gemini_deck_builder import (
    DeckBuildError,
    _get_gemini_client,
    _friendly_gemini_error,
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

    def test_prompt_uses_selected_translation_language(self):
        prompt = build_batch_prompt(["Haus"], target_language="fr")
        self.assertIn("German-French", prompt)
        self.assertIn("Primary French translation", prompt)

    def test_prompt_rejects_unknown_translation_language(self):
        with self.assertRaises(ValueError):
            build_batch_prompt(["Haus"], target_language="xx")

    def test_deck_id_is_stable_and_anki_compatible(self):
        first_id = create_deck_id("My German Deck")
        second_id = create_deck_id("My German Deck")
        self.assertEqual(first_id, second_id)
        self.assertGreaterEqual(first_id, 1 << 30)
        self.assertLess(first_id, 1 << 31)

    def test_translates_invalid_api_key_error(self):
        error = _friendly_gemini_error(
            RuntimeError("API_KEY_INVALID: API key not valid")
        )
        self.assertIsInstance(error, DeckBuildError)
        self.assertIn("clave de Gemini no es válida", str(error))

    def test_rejects_example_api_key_before_connecting(self):
        with patch.dict(
            os.environ,
            {"GEMINI_API_KEY": "replace_with_your_gemini_api_key"},
            clear=False,
        ):
            with self.assertRaisesRegex(
                RuntimeError,
                "clave de Gemini no está configurada",
            ):
                _get_gemini_client()

    def test_translates_high_demand_error(self):
        error = _friendly_gemini_error(
            RuntimeError("503 UNAVAILABLE: model is experiencing high demand")
        )
        self.assertIsInstance(error, DeckBuildError)
        self.assertIn("demasiadas solicitudes", str(error))


if __name__ == "__main__":
    unittest.main()
