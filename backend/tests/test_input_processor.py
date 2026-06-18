import os
import tempfile
import unittest
from pathlib import Path

from utils.input_processor import find_input_files


class InputProcessorTests(unittest.TestCase):
    def test_ignores_requirements_file_when_finding_word_lists(self):
        with tempfile.TemporaryDirectory() as directory:
            directory_path = Path(directory)
            (directory_path / "requirements.txt").write_text(
                "genanki\ngoogle-genai\npython-dotenv\n",
                encoding="utf-8",
            )
            (directory_path / "words.txt").write_text(
                "Haus\nlernen\n",
                encoding="utf-8",
            )

            previous_directory = Path.cwd()
            try:
                os.chdir(directory_path)
                files = find_input_files()
            finally:
                os.chdir(previous_directory)

        self.assertEqual([file.name for file in files], ["words.txt"])


if __name__ == "__main__":
    unittest.main()
