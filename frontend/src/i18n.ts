import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { additionalResources } from "./additionalLocales";

const resources = {
  es: {
    translation: {
      languageName: "Español",
      header: {
        home: "Wortdeck, inicio",
        note: "Alemán → Anki",
        help: "Cómo funciona",
        language: "Idioma",
      },
      hero: {
        eyebrow: "Tu vocabulario, listo para estudiar",
        titleStart: "De una lista de palabras",
        titleMiddle: "a una baraja",
        titleEmphasis: "de verdad.",
        description:
          "Sube tu archivo y crearemos tarjetas en alemán y {{language}}, con género, ejemplos y todo lo que necesitas para aprender.",
      },
      form: {
        chooseTitle: "Elige tu lista",
        chooseSubtitle: "Una palabra alemana por línea",
        selectFile: "Selecciona un archivo",
        dragFile: "o arrástralo hasta aquí",
        fileRules: "TXT o CSV · máximo 2 MB",
        ready: "Listo para convertir",
        removeFile: "Quitar archivo",
        nameTitle: "Ponle un nombre",
        nameSubtitle: "Así aparecerá dentro de Anki",
        deckName: "Nombre de la baraja",
        deckPlaceholder: "Ej. Alemán — Viaje a Berlín",
        translationLanguage: "Traducir al",
        translationHint: "Idioma del reverso y los ejemplos",
        create: "Crear mi baraja",
        creating: "Creando tus tarjetas…",
        keepOpen: "Puedes dejar esta pestaña abierta mientras terminamos.",
      },
      targetLanguages: {
        es: "Español",
        en: "Inglés",
        fr: "Francés",
        it: "Italiano",
        pt: "Portugués",
        nl: "Neerlandés",
        pl: "Polaco",
        ru: "Ruso",
        uk: "Ucraniano",
        tr: "Turco",
        ar: "Árabe",
        zh: "Chino simplificado",
        ja: "Japonés",
        ko: "Coreano",
        hi: "Hindi",
      },
      validation: {
        format: "Elige un archivo TXT o CSV.",
        size: "El archivo es demasiado grande. El máximo es 2 MB.",
        unavailable:
          "No se puede contactar con el generador. Comprueba que el backend esté arrancado.",
        failed: "No se pudo crear la baraja.",
        unexpected: "Ha ocurrido un error inesperado.",
      },
      progress: {
        preparing: "Preparando tu archivo…",
        batches: "Preparando los lotes de palabras…",
        analyzing: "Analizando lote {{current}} de {{total}} con Gemini…",
        finishing: "Terminando las tarjetas…",
        packaging: "Empaquetando la baraja de Anki…",
        completed: "{{completed}} de {{total}} lotes completados",
        words: "{{count}} palabras encontradas",
        little: "Queda muy poco",
        seconds: "Aprox. {{count}} s restantes",
        minutes_one: "Aprox. {{count}} min restante",
        minutes_other: "Aprox. {{count}} min restantes",
        aria: "Progreso de creación de la baraja",
      },
      success: {
        kicker: "¡Baraja terminada!",
        description:
          "{{count}} palabras se han convertido en tarjetas bidireccionales listas para importar en Anki.",
        save: "Guardar baraja",
        saveHint:
          "En móvil se abrirá el menú para compartir o guardar. En ordenador aparecerá en tu carpeta de Descargas.",
        another: "Crear otra baraja",
        shareText: "Mi nueva baraja de vocabulario para Anki",
      },
      steps: {
        aria: "Cómo funciona",
        upload: "Sube",
        uploadHint: "Tu lista TXT o CSV",
        create: "Creamos",
        createHint: "Traducciones y ejemplos",
        study: "Estudia",
        studyHint: "Importa en Anki",
      },
      footer: {
        motto: "Hecho para aprender, no para configurar.",
        privacy: "Tus archivos se eliminan después de procesarlos",
      },
      help: {
        close: "Cerrar ayuda",
        kicker: "Guía rápida",
        title: "De tu lista a Anki, sin líos.",
        intro:
          "Solo necesitas un archivo sencillo con palabras en alemán. Wortdeck se ocupa de las traducciones, ejemplos y tarjetas bidireccionales.",
        txtTitle: "Opción 1 · Archivo TXT",
        txtText: "Escribe una palabra alemana por línea. También puedes dejar líneas vacías o comentarios empezando por #.",
        csvTitle: "Opción 2 · Archivo CSV",
        csvText:
          "Usa una palabra por fila. Si tiene cabecera, la columna puede llamarse german, deutsch, word, term, alemán o palabra.",
        example: "Ejemplo",
        processTitle: "Qué ocurre después",
        process1: "Sube el archivo y ponle nombre a la baraja.",
        process2: "Gemini normaliza, traduce y crea ejemplos para cada palabra.",
        process3: "Descarga el archivo .apkg cuando la barra llegue al 100%.",
        ankiTitle: "Importarlo en Anki",
        anki1: "Abre Anki en el ordenador.",
        anki2: "Ve a Archivo → Importar.",
        anki3: "Selecciona el archivo .apkg descargado y confirma.",
        mobile:
          "En móvil puedes guardar o compartir el .apkg. Para importarlo directamente necesitas AnkiMobile en iPhone o AnkiDroid en Android.",
        understood: "Entendido, vamos allá",
      },
    },
  },
  en: {
    translation: {
      languageName: "English",
      header: {
        home: "Wortdeck, home",
        note: "German → Anki",
        help: "How it works",
        language: "Language",
      },
      hero: {
        eyebrow: "Your vocabulary, ready to study",
        titleStart: "From a list of words",
        titleMiddle: "to a deck",
        titleEmphasis: "you can use.",
        description:
          "Upload your file and we will create German–{{language}} cards with gender, examples, and everything you need to learn.",
      },
      form: {
        chooseTitle: "Choose your list",
        chooseSubtitle: "One German word per line",
        selectFile: "Select a file",
        dragFile: "or drag it here",
        fileRules: "TXT or CSV · 2 MB maximum",
        ready: "Ready to convert",
        removeFile: "Remove file",
        nameTitle: "Give it a name",
        nameSubtitle: "This is how it will appear in Anki",
        deckName: "Deck name",
        deckPlaceholder: "E.g. German — Trip to Berlin",
        translationLanguage: "Translate into",
        translationHint: "Language used on the back and in examples",
        create: "Create my deck",
        creating: "Creating your cards…",
        keepOpen: "You can leave this tab open while we finish.",
      },
      targetLanguages: {
        es: "Spanish",
        en: "English",
        fr: "French",
        it: "Italian",
        pt: "Portuguese",
        nl: "Dutch",
        pl: "Polish",
        ru: "Russian",
        uk: "Ukrainian",
        tr: "Turkish",
        ar: "Arabic",
        zh: "Simplified Chinese",
        ja: "Japanese",
        ko: "Korean",
        hi: "Hindi",
      },
      validation: {
        format: "Choose a TXT or CSV file.",
        size: "The file is too large. The maximum is 2 MB.",
        unavailable:
          "The generator cannot be reached. Check that the backend is running.",
        failed: "The deck could not be created.",
        unexpected: "An unexpected error occurred.",
      },
      progress: {
        preparing: "Preparing your file…",
        batches: "Preparing word batches…",
        analyzing: "Analyzing batch {{current}} of {{total}} with Gemini…",
        finishing: "Finishing the cards…",
        packaging: "Packaging the Anki deck…",
        completed: "{{completed}} of {{total}} batches completed",
        words: "{{count}} words found",
        little: "Almost there",
        seconds: "About {{count}} s remaining",
        minutes_one: "About {{count}} min remaining",
        minutes_other: "About {{count}} min remaining",
        aria: "Deck creation progress",
      },
      success: {
        kicker: "Deck complete!",
        description:
          "{{count}} words have become bidirectional cards ready to import into Anki.",
        save: "Save deck",
        saveHint:
          "On mobile, the share or save menu will open. On desktop, the file will appear in Downloads.",
        another: "Create another deck",
        shareText: "My new Anki vocabulary deck",
      },
      steps: {
        aria: "How it works",
        upload: "Upload",
        uploadHint: "Your TXT or CSV list",
        create: "We create",
        createHint: "Translations and examples",
        study: "Study",
        studyHint: "Import into Anki",
      },
      footer: {
        motto: "Made for learning, not configuring.",
        privacy: "Your files are deleted after processing",
      },
      help: {
        close: "Close help",
        kicker: "Quick guide",
        title: "From your list to Anki, without the fuss.",
        intro:
          "All you need is a simple file containing German words. Wortdeck handles translations, examples, and bidirectional cards.",
        txtTitle: "Option 1 · TXT file",
        txtText: "Write one German word per line. Blank lines and comments beginning with # are also allowed.",
        csvTitle: "Option 2 · CSV file",
        csvText:
          "Use one word per row. If it has a header, the column can be named german, deutsch, word, term, alemán, or palabra.",
        example: "Example",
        processTitle: "What happens next",
        process1: "Upload the file and name your deck.",
        process2: "Gemini normalizes, translates, and creates examples for every word.",
        process3: "Download the .apkg file when the progress bar reaches 100%.",
        ankiTitle: "Importing into Anki",
        anki1: "Open Anki on your computer.",
        anki2: "Go to File → Import.",
        anki3: "Select the downloaded .apkg file and confirm.",
        mobile:
          "On mobile you can save or share the .apkg. Direct import requires AnkiMobile on iPhone or AnkiDroid on Android.",
        understood: "Got it, let's go",
      },
    },
  },
  de: {
    translation: {
      languageName: "Deutsch",
      header: {
        home: "Wortdeck, Startseite",
        note: "Deutsch → Anki",
        help: "So funktioniert es",
        language: "Sprache",
      },
      hero: {
        eyebrow: "Dein Wortschatz, bereit zum Lernen",
        titleStart: "Von einer Wortliste",
        titleMiddle: "zu einem echten",
        titleEmphasis: "Anki-Stapel.",
        description:
          "Lade deine Datei hoch und wir erstellen Deutsch–{{language}}-Karten mit Genus, Beispielen und allem, was du zum Lernen brauchst.",
      },
      form: {
        chooseTitle: "Wähle deine Liste",
        chooseSubtitle: "Ein deutsches Wort pro Zeile",
        selectFile: "Datei auswählen",
        dragFile: "oder hierher ziehen",
        fileRules: "TXT oder CSV · maximal 2 MB",
        ready: "Bereit zur Umwandlung",
        removeFile: "Datei entfernen",
        nameTitle: "Gib dem Stapel einen Namen",
        nameSubtitle: "So erscheint er später in Anki",
        deckName: "Stapelname",
        deckPlaceholder: "Z. B. Deutsch — Reise nach Berlin",
        translationLanguage: "Übersetzen nach",
        translationHint: "Sprache für Rückseite und Beispiele",
        create: "Meinen Stapel erstellen",
        creating: "Karten werden erstellt…",
        keepOpen: "Du kannst diesen Tab geöffnet lassen, während wir fertig werden.",
      },
      targetLanguages: {
        es: "Spanisch",
        en: "Englisch",
        fr: "Französisch",
        it: "Italienisch",
        pt: "Portugiesisch",
        nl: "Niederländisch",
        pl: "Polnisch",
        ru: "Russisch",
        uk: "Ukrainisch",
        tr: "Türkisch",
        ar: "Arabisch",
        zh: "Vereinfachtes Chinesisch",
        ja: "Japanisch",
        ko: "Koreanisch",
        hi: "Hindi",
      },
      validation: {
        format: "Wähle eine TXT- oder CSV-Datei.",
        size: "Die Datei ist zu groß. Maximal sind 2 MB erlaubt.",
        unavailable:
          "Der Generator ist nicht erreichbar. Prüfe, ob das Backend läuft.",
        failed: "Der Stapel konnte nicht erstellt werden.",
        unexpected: "Ein unerwarteter Fehler ist aufgetreten.",
      },
      progress: {
        preparing: "Datei wird vorbereitet…",
        batches: "Wortgruppen werden vorbereitet…",
        analyzing: "Gruppe {{current}} von {{total}} wird mit Gemini analysiert…",
        finishing: "Karten werden fertiggestellt…",
        packaging: "Anki-Stapel wird verpackt…",
        completed: "{{completed}} von {{total}} Gruppen abgeschlossen",
        words: "{{count}} Wörter gefunden",
        little: "Fast geschafft",
        seconds: "Noch etwa {{count}} Sek.",
        minutes_one: "Noch etwa {{count}} Min.",
        minutes_other: "Noch etwa {{count}} Min.",
        aria: "Fortschritt bei der Stapelerstellung",
      },
      success: {
        kicker: "Stapel fertig!",
        description:
          "{{count}} Wörter wurden in bidirektionale Karten umgewandelt und können in Anki importiert werden.",
        save: "Stapel speichern",
        saveHint:
          "Auf dem Handy öffnet sich das Teilen- oder Speichern-Menü. Am Computer liegt die Datei im Download-Ordner.",
        another: "Weiteren Stapel erstellen",
        shareText: "Mein neuer Anki-Wortschatzstapel",
      },
      steps: {
        aria: "So funktioniert es",
        upload: "Hochladen",
        uploadHint: "Deine TXT- oder CSV-Liste",
        create: "Erstellen",
        createHint: "Übersetzungen und Beispiele",
        study: "Lernen",
        studyHint: "In Anki importieren",
      },
      footer: {
        motto: "Zum Lernen gemacht, nicht zum Konfigurieren.",
        privacy: "Deine Dateien werden nach der Verarbeitung gelöscht",
      },
      help: {
        close: "Hilfe schließen",
        kicker: "Kurzanleitung",
        title: "Von deiner Liste zu Anki – ganz einfach.",
        intro:
          "Du brauchst nur eine einfache Datei mit deutschen Wörtern. Wortdeck erstellt Übersetzungen, Beispiele und bidirektionale Karten.",
        txtTitle: "Option 1 · TXT-Datei",
        txtText: "Schreibe ein deutsches Wort pro Zeile. Leere Zeilen und Kommentare mit # sind erlaubt.",
        csvTitle: "Option 2 · CSV-Datei",
        csvText:
          "Verwende ein Wort pro Zeile. Mit Kopfzeile darf die Spalte german, deutsch, word, term, alemán oder palabra heißen.",
        example: "Beispiel",
        processTitle: "Was danach passiert",
        process1: "Lade die Datei hoch und benenne den Stapel.",
        process2: "Gemini normalisiert, übersetzt und erstellt Beispiele für jedes Wort.",
        process3: "Lade die .apkg-Datei herunter, sobald der Balken 100 % erreicht.",
        ankiTitle: "Import in Anki",
        anki1: "Öffne Anki auf deinem Computer.",
        anki2: "Gehe zu Datei → Importieren.",
        anki3: "Wähle die heruntergeladene .apkg-Datei aus und bestätige.",
        mobile:
          "Auf dem Handy kannst du die .apkg-Datei speichern oder teilen. Für den direkten Import brauchst du AnkiMobile auf dem iPhone oder AnkiDroid auf Android.",
        understood: "Verstanden, los geht’s",
      },
    },
  },
  ...additionalResources,
} as const;

const storedLanguage = localStorage.getItem("wortdeck-language");
const supportedLanguages = Object.keys(resources);
const initialLanguage = supportedLanguages.includes(storedLanguage ?? "")
  ? storedLanguage!
  : "es";

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem("wortdeck-language", language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
});

document.documentElement.lang = initialLanguage;
document.documentElement.dir = initialLanguage === "ar" ? "rtl" : "ltr";

export default i18n;
