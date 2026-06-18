type LocaleInput = {
  languageName: string;
  header: [string, string, string, string];
  hero: [string, string, string, string, string];
  form: [
    string, string, string, string, string, string, string, string,
    string, string, string, string, string, string, string, string,
  ];
  validation: [string, string, string, string, string];
  progress: [
    string, string, string, string, string, string, string, string,
    string, string,
  ];
  success: [string, string, string, string, string, string];
  steps: [string, string, string, string, string, string, string];
  footer: [string, string];
};

function locale(input: LocaleInput) {
  const [home, note, help, language] = input.header;
  const [eyebrow, titleStart, titleMiddle, titleEmphasis, description] =
    input.hero;
  const [
    chooseTitle, chooseSubtitle, selectFile, dragFile, fileRules, ready,
    removeFile, nameTitle, nameSubtitle, deckName, deckPlaceholder,
    translationLanguage, translationHint, create, creating, keepOpen,
  ] = input.form;
  const [format, size, unavailable, failed, unexpected] = input.validation;
  const [
    preparing, batches, analyzing, finishing, packaging, completed, words,
    little, seconds, minutes,
  ] = input.progress;
  const [kicker, successDescription, save, saveHint, another, shareText] =
    input.success;
  const [
    stepsAria, upload, uploadHint, createStep, createHint, study, studyHint,
  ] = input.steps;
  const [motto, privacy] = input.footer;

  return {
    translation: {
      languageName: input.languageName,
      header: { home, note, help, language },
      hero: { eyebrow, titleStart, titleMiddle, titleEmphasis, description },
      form: {
        chooseTitle, chooseSubtitle, selectFile, dragFile, fileRules, ready,
        removeFile, nameTitle, nameSubtitle, deckName, deckPlaceholder,
        translationLanguage, translationHint, create, creating, keepOpen,
      },
      validation: { format, size, unavailable, failed, unexpected },
      progress: {
        preparing, batches, analyzing, finishing, packaging, completed, words,
        little, seconds, minutes_one: minutes, minutes_other: minutes,
        aria: packaging,
      },
      success: {
        kicker, description: successDescription, save, saveHint, another,
        shareText,
      },
      steps: {
        aria: stepsAria, upload, uploadHint, create: createStep, createHint,
        study, studyHint,
      },
      footer: { motto, privacy },
      help: {
        close: removeFile,
        kicker: help,
        title: `${titleStart} ${titleMiddle} ${titleEmphasis}`,
        intro: description,
        txtTitle: `TXT · ${chooseTitle}`,
        txtText: chooseSubtitle,
        csvTitle: `CSV · ${chooseTitle}`,
        csvText: fileRules,
        example: "TXT / CSV",
        processTitle: help,
        process1: `${selectFile}. ${nameTitle}.`,
        process2: createHint,
        process3: save,
        ankiTitle: studyHint,
        anki1: "Anki Desktop",
        anki2: "Anki · File → Import",
        anki3: ".apkg",
        mobile: saveHint,
        understood: create,
      },
    },
  };
}

export const additionalResources = {
  fr: locale({
    languageName: "Français",
    header: ["Wortdeck, accueil", "Allemand → Anki", "Comment ça marche", "Langue"],
    hero: [
      "Votre vocabulaire, prêt à étudier",
      "D’une liste de mots",
      "à un paquet",
      "vraiment utile.",
      "Importez votre fichier et nous créerons des cartes allemand–{{language}} avec genre, exemples et tout le nécessaire pour apprendre.",
    ],
    form: [
      "Choisissez votre liste", "Un mot allemand par ligne",
      "Sélectionner un fichier", "ou glissez-le ici", "TXT ou CSV · 2 Mo maximum",
      "Prêt à convertir", "Retirer le fichier", "Donnez-lui un nom",
      "Il apparaîtra ainsi dans Anki", "Nom du paquet",
      "Ex. Allemand — Voyage à Berlin", "Traduire en",
      "Langue du verso et des exemples", "Créer mon paquet",
      "Création des cartes…", "Vous pouvez laisser cet onglet ouvert.",
    ],
    validation: [
      "Choisissez un fichier TXT ou CSV.", "Le fichier dépasse 2 Mo.",
      "Impossible de joindre le générateur. Vérifiez que le serveur fonctionne.",
      "Impossible de créer le paquet.", "Une erreur inattendue est survenue.",
    ],
    progress: [
      "Préparation du fichier…", "Préparation des groupes de mots…",
      "Analyse du groupe {{current}} sur {{total}} avec Gemini…",
      "Finalisation des cartes…", "Création du paquet Anki…",
      "{{completed}} groupes sur {{total}} terminés", "{{count}} mots trouvés",
      "Presque terminé", "Environ {{count}} s restantes",
      "Environ {{count}} min restantes",
    ],
    success: [
      "Paquet terminé !",
      "{{count}} mots sont devenus des cartes bidirectionnelles prêtes pour Anki.",
      "Enregistrer le paquet",
      "Sur mobile, le menu de partage s’ouvrira. Sur ordinateur, le fichier sera dans Téléchargements.",
      "Créer un autre paquet", "Mon nouveau paquet de vocabulaire Anki",
    ],
    steps: [
      "Comment ça marche", "Importez", "Votre liste TXT ou CSV",
      "Nous créons", "Traductions et exemples", "Étudiez", "Importez dans Anki",
    ],
    footer: ["Conçu pour apprendre, pas pour configurer.", "Vos fichiers sont supprimés après traitement"],
  }),
  it: locale({
    languageName: "Italiano",
    header: ["Wortdeck, home", "Tedesco → Anki", "Come funziona", "Lingua"],
    hero: [
      "Il tuo vocabolario, pronto da studiare", "Da una lista di parole",
      "a un mazzo", "davvero utile.",
      "Carica il file e creeremo schede tedesco–{{language}} con genere, esempi e tutto ciò che serve per imparare.",
    ],
    form: [
      "Scegli la lista", "Una parola tedesca per riga", "Seleziona un file",
      "o trascinalo qui", "TXT o CSV · massimo 2 MB", "Pronto da convertire",
      "Rimuovi file", "Dagli un nome", "Così apparirà in Anki",
      "Nome del mazzo", "Es. Tedesco — Viaggio a Berlino", "Traduci in",
      "Lingua del retro e degli esempi", "Crea il mio mazzo",
      "Creazione delle schede…", "Puoi lasciare aperta questa scheda.",
    ],
    validation: [
      "Scegli un file TXT o CSV.", "Il file supera i 2 MB.",
      "Impossibile contattare il generatore. Controlla il server.",
      "Impossibile creare il mazzo.", "Si è verificato un errore imprevisto.",
    ],
    progress: [
      "Preparazione del file…", "Preparazione dei gruppi di parole…",
      "Analisi del gruppo {{current}} di {{total}} con Gemini…",
      "Completamento delle schede…", "Creazione del pacchetto Anki…",
      "{{completed}} gruppi di {{total}} completati", "{{count}} parole trovate",
      "Ci siamo quasi", "Circa {{count}} s rimanenti",
      "Circa {{count}} min rimanenti",
    ],
    success: [
      "Mazzo completato!",
      "{{count}} parole sono diventate schede bidirezionali pronte per Anki.",
      "Salva mazzo", "Su mobile si aprirà il menu di condivisione; su computer sarà nei Download.",
      "Crea un altro mazzo", "Il mio nuovo mazzo di vocabolario Anki",
    ],
    steps: ["Come funziona", "Carica", "La tua lista TXT o CSV", "Creiamo", "Traduzioni ed esempi", "Studia", "Importa in Anki"],
    footer: ["Fatto per imparare, non per configurare.", "I file vengono eliminati dopo l’elaborazione"],
  }),
  pt: locale({
    languageName: "Português",
    header: ["Wortdeck, início", "Alemão → Anki", "Como funciona", "Idioma"],
    hero: [
      "O seu vocabulário, pronto para estudar", "De uma lista de palavras",
      "para um baralho", "a sério.",
      "Carregue o ficheiro e criaremos cartões alemão–{{language}} com género, exemplos e tudo o que precisa para aprender.",
    ],
    form: [
      "Escolha a sua lista", "Uma palavra alemã por linha", "Selecionar ficheiro",
      "ou arraste-o para aqui", "TXT ou CSV · máximo 2 MB", "Pronto para converter",
      "Remover ficheiro", "Dê-lhe um nome", "Assim aparecerá no Anki",
      "Nome do baralho", "Ex. Alemão — Viagem a Berlim", "Traduzir para",
      "Idioma do verso e dos exemplos", "Criar o meu baralho",
      "A criar os cartões…", "Pode deixar este separador aberto.",
    ],
    validation: [
      "Escolha um ficheiro TXT ou CSV.", "O ficheiro excede 2 MB.",
      "Não foi possível contactar o gerador. Verifique o servidor.",
      "Não foi possível criar o baralho.", "Ocorreu um erro inesperado.",
    ],
    progress: [
      "A preparar o ficheiro…", "A preparar grupos de palavras…",
      "A analisar o grupo {{current}} de {{total}} com Gemini…",
      "A terminar os cartões…", "A empacotar o baralho Anki…",
      "{{completed}} de {{total}} grupos concluídos", "{{count}} palavras encontradas",
      "Quase pronto", "Cerca de {{count}} s restantes",
      "Cerca de {{count}} min restantes",
    ],
    success: [
      "Baralho concluído!",
      "{{count}} palavras tornaram-se cartões bidirecionais prontos para o Anki.",
      "Guardar baralho", "No telemóvel abrirá o menu de partilha; no computador ficará em Transferências.",
      "Criar outro baralho", "O meu novo baralho de vocabulário Anki",
    ],
    steps: ["Como funciona", "Carregue", "A sua lista TXT ou CSV", "Criamos", "Traduções e exemplos", "Estude", "Importe no Anki"],
    footer: ["Feito para aprender, não para configurar.", "Os ficheiros são eliminados após o processamento"],
  }),
  nl: locale({
    languageName: "Nederlands",
    header: ["Wortdeck, start", "Duits → Anki", "Hoe het werkt", "Taal"],
    hero: [
      "Je woordenschat, klaar om te leren", "Van een woordenlijst",
      "naar een echt", "Anki-deck.",
      "Upload je bestand en we maken Duits–{{language}} kaarten met geslacht, voorbeelden en alles wat je nodig hebt.",
    ],
    form: [
      "Kies je lijst", "Eén Duits woord per regel", "Bestand kiezen",
      "of sleep het hierheen", "TXT of CSV · maximaal 2 MB", "Klaar om om te zetten",
      "Bestand verwijderen", "Geef het een naam", "Zo verschijnt het in Anki",
      "Naam van deck", "Bijv. Duits — Reis naar Berlijn", "Vertalen naar",
      "Taal van achterkant en voorbeelden", "Mijn deck maken",
      "Kaarten worden gemaakt…", "Je kunt dit tabblad open laten.",
    ],
    validation: [
      "Kies een TXT- of CSV-bestand.", "Het bestand is groter dan 2 MB.",
      "De generator is niet bereikbaar. Controleer de server.",
      "Het deck kon niet worden gemaakt.", "Er is een onverwachte fout opgetreden.",
    ],
    progress: [
      "Bestand voorbereiden…", "Woordgroepen voorbereiden…",
      "Groep {{current}} van {{total}} analyseren met Gemini…",
      "Kaarten afronden…", "Anki-deck verpakken…",
      "{{completed}} van {{total}} groepen voltooid", "{{count}} woorden gevonden",
      "Bijna klaar", "Ongeveer {{count}} s resterend",
      "Ongeveer {{count}} min resterend",
    ],
    success: [
      "Deck voltooid!", "{{count}} woorden zijn bidirectionele Anki-kaarten geworden.",
      "Deck opslaan", "Op mobiel opent het deelmenu; op desktop staat het bestand in Downloads.",
      "Nog een deck maken", "Mijn nieuwe Anki-woordenschatdeck",
    ],
    steps: ["Hoe het werkt", "Upload", "Je TXT- of CSV-lijst", "Wij maken", "Vertalingen en voorbeelden", "Leer", "Importeer in Anki"],
    footer: ["Gemaakt om te leren, niet om in te stellen.", "Je bestanden worden na verwerking verwijderd"],
  }),
  pl: locale({
    languageName: "Polski",
    header: ["Wortdeck, strona główna", "Niemiecki → Anki", "Jak to działa", "Język"],
    hero: [
      "Twoje słownictwo, gotowe do nauki", "Z listy słów",
      "do prawdziwej", "talii Anki.",
      "Prześlij plik, a utworzymy karty niemiecki–{{language}} z rodzajem, przykładami i wszystkim, czego potrzebujesz.",
    ],
    form: [
      "Wybierz listę", "Jedno niemieckie słowo w wierszu", "Wybierz plik",
      "lub przeciągnij go tutaj", "TXT lub CSV · maks. 2 MB", "Gotowe do konwersji",
      "Usuń plik", "Nadaj nazwę", "Tak pojawi się w Anki", "Nazwa talii",
      "Np. Niemiecki — Podróż do Berlina", "Tłumacz na",
      "Język odwrotu i przykładów", "Utwórz moją talię",
      "Tworzenie kart…", "Możesz pozostawić tę kartę otwartą.",
    ],
    validation: [
      "Wybierz plik TXT lub CSV.", "Plik przekracza 2 MB.",
      "Nie można połączyć się z generatorem. Sprawdź serwer.",
      "Nie udało się utworzyć talii.", "Wystąpił nieoczekiwany błąd.",
    ],
    progress: [
      "Przygotowywanie pliku…", "Przygotowywanie grup słów…",
      "Analiza grupy {{current}} z {{total}} przez Gemini…",
      "Kończenie kart…", "Pakowanie talii Anki…",
      "Ukończono {{completed}} z {{total}} grup", "Znaleziono {{count}} słów",
      "Prawie gotowe", "Pozostało ok. {{count}} s", "Pozostało ok. {{count}} min",
    ],
    success: [
      "Talia gotowa!", "{{count}} słów zamieniono w dwukierunkowe karty Anki.",
      "Zapisz talię", "Na telefonie otworzy się menu udostępniania; na komputerze plik będzie w Pobranych.",
      "Utwórz kolejną talię", "Moja nowa talia słownictwa Anki",
    ],
    steps: ["Jak to działa", "Prześlij", "Lista TXT lub CSV", "Tworzymy", "Tłumaczenia i przykłady", "Ucz się", "Importuj do Anki"],
    footer: ["Do nauki, nie do konfiguracji.", "Pliki są usuwane po przetworzeniu"],
  }),
  ru: locale({
    languageName: "Русский",
    header: ["Wortdeck, главная", "Немецкий → Anki", "Как это работает", "Язык"],
    hero: [
      "Ваш словарь готов к изучению", "Из списка слов",
      "в настоящую", "колоду Anki.",
      "Загрузите файл, и мы создадим карточки немецкий–{{language}} с родом, примерами и всем необходимым.",
    ],
    form: [
      "Выберите список", "Одно немецкое слово в строке", "Выбрать файл",
      "или перетащите его сюда", "TXT или CSV · до 2 МБ", "Готово к обработке",
      "Удалить файл", "Дайте название", "Так колода появится в Anki",
      "Название колоды", "Напр. Немецкий — Поездка в Берлин", "Перевести на",
      "Язык обратной стороны и примеров", "Создать колоду",
      "Создание карточек…", "Оставьте эту вкладку открытой.",
    ],
    validation: [
      "Выберите файл TXT или CSV.", "Файл больше 2 МБ.",
      "Генератор недоступен. Проверьте сервер.", "Не удалось создать колоду.",
      "Произошла непредвиденная ошибка.",
    ],
    progress: [
      "Подготовка файла…", "Подготовка групп слов…",
      "Анализ группы {{current}} из {{total}} с Gemini…",
      "Завершение карточек…", "Упаковка колоды Anki…",
      "Готово групп: {{completed}} из {{total}}", "Найдено слов: {{count}}",
      "Почти готово", "Осталось около {{count}} с", "Осталось около {{count}} мин",
    ],
    success: [
      "Колода готова!", "{{count}} слов превращены в двусторонние карточки Anki.",
      "Сохранить колоду", "На телефоне откроется меню отправки; на компьютере файл будет в Загрузках.",
      "Создать ещё одну", "Моя новая колода слов Anki",
    ],
    steps: ["Как это работает", "Загрузите", "Список TXT или CSV", "Мы создаём", "Переводы и примеры", "Учитесь", "Импортируйте в Anki"],
    footer: ["Создано для учёбы, а не настройки.", "Файлы удаляются после обработки"],
  }),
  uk: locale({
    languageName: "Українська",
    header: ["Wortdeck, головна", "Німецька → Anki", "Як це працює", "Мова"],
    hero: [
      "Ваш словник готовий до навчання", "Зі списку слів",
      "у справжню", "колоду Anki.",
      "Завантажте файл, і ми створимо картки німецька–{{language}} з родом, прикладами та всім необхідним.",
    ],
    form: [
      "Оберіть список", "Одне німецьке слово в рядку", "Вибрати файл",
      "або перетягніть сюди", "TXT або CSV · до 2 МБ", "Готово до обробки",
      "Видалити файл", "Дайте назву", "Так колода з’явиться в Anki",
      "Назва колоди", "Напр. Німецька — Подорож до Берліна", "Перекласти на",
      "Мова звороту та прикладів", "Створити колоду",
      "Створення карток…", "Залиште цю вкладку відкритою.",
    ],
    validation: [
      "Оберіть файл TXT або CSV.", "Файл більший за 2 МБ.",
      "Генератор недоступний. Перевірте сервер.", "Не вдалося створити колоду.",
      "Сталася непередбачена помилка.",
    ],
    progress: [
      "Підготовка файлу…", "Підготовка груп слів…",
      "Аналіз групи {{current}} з {{total}} за допомогою Gemini…",
      "Завершення карток…", "Пакування колоди Anki…",
      "Завершено {{completed}} з {{total}} груп", "Знайдено {{count}} слів",
      "Майже готово", "Залишилося близько {{count}} с", "Залишилося близько {{count}} хв",
    ],
    success: [
      "Колода готова!", "{{count}} слів перетворено на двосторонні картки Anki.",
      "Зберегти колоду", "На телефоні відкриється меню поширення; на комп’ютері файл буде в Завантаженнях.",
      "Створити ще одну", "Моя нова колода слів Anki",
    ],
    steps: ["Як це працює", "Завантажте", "Список TXT або CSV", "Ми створюємо", "Переклади та приклади", "Навчайтеся", "Імпортуйте в Anki"],
    footer: ["Створено для навчання, а не налаштування.", "Файли видаляються після обробки"],
  }),
  tr: locale({
    languageName: "Türkçe",
    header: ["Wortdeck, ana sayfa", "Almanca → Anki", "Nasıl çalışır", "Dil"],
    hero: [
      "Kelime listeniz çalışmaya hazır", "Bir kelime listesinden",
      "gerçek bir", "Anki destesine.",
      "Dosyanızı yükleyin; cinsiyet, örnekler ve ihtiyacınız olan her şeyle Almanca–{{language}} kartları oluşturalım.",
    ],
    form: [
      "Listenizi seçin", "Her satırda bir Almanca kelime", "Dosya seç",
      "veya buraya sürükleyin", "TXT veya CSV · en fazla 2 MB", "Dönüştürmeye hazır",
      "Dosyayı kaldır", "Bir ad verin", "Anki’de böyle görünecek",
      "Deste adı", "Örn. Almanca — Berlin Gezisi", "Şu dile çevir",
      "Kart arkası ve örneklerin dili", "Destemi oluştur",
      "Kartlar oluşturuluyor…", "Bu sekmeyi açık bırakabilirsiniz.",
    ],
    validation: [
      "TXT veya CSV dosyası seçin.", "Dosya 2 MB sınırını aşıyor.",
      "Oluşturucuya ulaşılamıyor. Sunucuyu kontrol edin.",
      "Deste oluşturulamadı.", "Beklenmeyen bir hata oluştu.",
    ],
    progress: [
      "Dosya hazırlanıyor…", "Kelime grupları hazırlanıyor…",
      "Gemini ile {{current}}/{{total}} grup analiz ediliyor…",
      "Kartlar tamamlanıyor…", "Anki destesi paketleniyor…",
      "{{completed}}/{{total}} grup tamamlandı", "{{count}} kelime bulundu",
      "Neredeyse hazır", "Yaklaşık {{count}} sn kaldı", "Yaklaşık {{count}} dk kaldı",
    ],
    success: [
      "Deste hazır!", "{{count}} kelime çift yönlü Anki kartına dönüştürüldü.",
      "Desteyi kaydet", "Mobilde paylaşım menüsü açılır; bilgisayarda dosya İndirilenler’dedir.",
      "Başka deste oluştur", "Yeni Anki kelime destem",
    ],
    steps: ["Nasıl çalışır", "Yükle", "TXT veya CSV listeniz", "Oluştururuz", "Çeviriler ve örnekler", "Çalış", "Anki’ye aktar"],
    footer: ["Ayarlamak için değil, öğrenmek için.", "Dosyalar işlemden sonra silinir"],
  }),
  ar: locale({
    languageName: "العربية",
    header: ["Wortdeck، الرئيسية", "الألمانية ← Anki", "كيف يعمل", "اللغة"],
    hero: [
      "مفرداتك جاهزة للدراسة", "من قائمة كلمات",
      "إلى مجموعة", "Anki حقيقية.",
      "ارفع ملفك وسننشئ بطاقات ألمانية–{{language}} مع الجنس والأمثلة وكل ما تحتاجه للتعلم.",
    ],
    form: [
      "اختر قائمتك", "كلمة ألمانية واحدة في كل سطر", "اختر ملفًا",
      "أو اسحبه إلى هنا", "TXT أو CSV · بحد أقصى 2 م.ب", "جاهز للتحويل",
      "إزالة الملف", "امنحها اسمًا", "هكذا ستظهر في Anki",
      "اسم المجموعة", "مثال: الألمانية — رحلة إلى برلين", "ترجمة إلى",
      "لغة ظهر البطاقة والأمثلة", "إنشاء مجموعتي",
      "جارٍ إنشاء البطاقات…", "يمكنك ترك علامة التبويب مفتوحة.",
    ],
    validation: [
      "اختر ملف TXT أو CSV.", "حجم الملف أكبر من 2 م.ب.",
      "تعذر الوصول إلى المنشئ. تحقق من تشغيل الخادم.",
      "تعذر إنشاء المجموعة.", "حدث خطأ غير متوقع.",
    ],
    progress: [
      "جارٍ تجهيز الملف…", "جارٍ تجهيز مجموعات الكلمات…",
      "تحليل المجموعة {{current}} من {{total}} باستخدام Gemini…",
      "جارٍ إنهاء البطاقات…", "جارٍ حزم مجموعة Anki…",
      "اكتملت {{completed}} من {{total}} مجموعات", "تم العثور على {{count}} كلمة",
      "أوشكنا على الانتهاء", "متبقٍ نحو {{count}} ث", "متبقٍ نحو {{count}} د",
    ],
    success: [
      "اكتملت المجموعة!", "تحولت {{count}} كلمة إلى بطاقات Anki ثنائية الاتجاه.",
      "حفظ المجموعة", "على الهاتف ستظهر قائمة المشاركة، وعلى الكمبيوتر ستجد الملف في التنزيلات.",
      "إنشاء مجموعة أخرى", "مجموعة مفردات Anki الجديدة",
    ],
    steps: ["كيف يعمل", "ارفع", "قائمة TXT أو CSV", "ننشئ", "ترجمات وأمثلة", "ادرس", "استورد إلى Anki"],
    footer: ["مصمم للتعلم، لا للإعداد.", "تُحذف ملفاتك بعد المعالجة"],
  }),
  zh: locale({
    languageName: "中文",
    header: ["Wortdeck，首页", "德语 → Anki", "使用说明", "语言"],
    hero: [
      "你的词汇，随时可以学习", "从单词列表",
      "到真正的", "Anki 牌组。",
      "上传文件，我们将创建德语–{{language}}双向卡片，包含词性、例句和学习所需内容。",
    ],
    form: [
      "选择单词列表", "每行一个德语单词", "选择文件", "或拖到这里",
      "TXT 或 CSV · 最大 2 MB", "可以转换", "移除文件", "给牌组命名",
      "它将在 Anki 中这样显示", "牌组名称", "例如：德语 — 柏林之旅",
      "翻译为", "卡片背面和例句的语言", "创建牌组", "正在创建卡片…",
      "完成前请保持此页面打开。",
    ],
    validation: [
      "请选择 TXT 或 CSV 文件。", "文件超过 2 MB。",
      "无法连接生成器，请检查服务器。", "无法创建牌组。", "发生意外错误。",
    ],
    progress: [
      "正在准备文件…", "正在准备单词分组…",
      "Gemini 正在分析第 {{current}}/{{total}} 组…",
      "正在完成卡片…", "正在打包 Anki 牌组…",
      "已完成 {{completed}}/{{total}} 组", "找到 {{count}} 个单词",
      "即将完成", "约剩 {{count}} 秒", "约剩 {{count}} 分钟",
    ],
    success: [
      "牌组已完成！", "{{count}} 个单词已转换为双向 Anki 卡片。",
      "保存牌组", "手机会打开分享菜单；电脑会保存到下载文件夹。",
      "创建另一个牌组", "我的新 Anki 词汇牌组",
    ],
    steps: ["使用说明", "上传", "TXT 或 CSV 列表", "生成", "翻译和例句", "学习", "导入 Anki"],
    footer: ["专注学习，无需配置。", "文件处理后会自动删除"],
  }),
  ja: locale({
    languageName: "日本語",
    header: ["Wortdeck、ホーム", "ドイツ語 → Anki", "使い方", "言語"],
    hero: [
      "語彙をすぐに学習", "単語リストから",
      "本格的な", "Ankiデッキへ。",
      "ファイルをアップロードすると、性・例文などを含むドイツ語–{{language}}カードを作成します。",
    ],
    form: [
      "リストを選択", "1行にドイツ語を1語", "ファイルを選択",
      "またはここにドロップ", "TXT / CSV · 最大2 MB", "変換できます",
      "ファイルを削除", "名前を付ける", "Ankiではこの名前で表示されます",
      "デッキ名", "例：ドイツ語 — ベルリン旅行", "翻訳先",
      "カード裏面と例文の言語", "デッキを作成", "カードを作成中…",
      "完了までこのタブを開いたままにしてください。",
    ],
    validation: [
      "TXTまたはCSVファイルを選択してください。", "ファイルは2 MBを超えています。",
      "生成サーバーに接続できません。", "デッキを作成できませんでした。",
      "予期しないエラーが発生しました。",
    ],
    progress: [
      "ファイルを準備中…", "単語グループを準備中…",
      "Geminiで{{current}}/{{total}}グループを分析中…",
      "カードを仕上げています…", "Ankiデッキをパッケージ中…",
      "{{completed}}/{{total}}グループ完了", "{{count}}語を検出",
      "まもなく完了", "残り約{{count}}秒", "残り約{{count}}分",
    ],
    success: [
      "デッキ完成！", "{{count}}語を双方向Ankiカードに変換しました。",
      "デッキを保存", "スマホでは共有メニュー、PCではダウンロードに保存されます。",
      "別のデッキを作成", "新しいAnki語彙デッキ",
    ],
    steps: ["使い方", "アップロード", "TXT / CSVリスト", "作成", "翻訳と例文", "学習", "Ankiへインポート"],
    footer: ["設定ではなく学習のために。", "ファイルは処理後に削除されます"],
  }),
  ko: locale({
    languageName: "한국어",
    header: ["Wortdeck, 홈", "독일어 → Anki", "사용 방법", "언어"],
    hero: [
      "바로 공부할 수 있는 어휘", "단어 목록에서",
      "진짜", "Anki 덱으로.",
      "파일을 올리면 성별, 예문 등을 포함한 독일어–{{language}} 카드를 만듭니다.",
    ],
    form: [
      "목록 선택", "한 줄에 독일어 단어 하나", "파일 선택", "또는 여기로 끌어오기",
      "TXT 또는 CSV · 최대 2 MB", "변환 준비 완료", "파일 제거", "이름 지정",
      "Anki에 표시될 이름입니다", "덱 이름", "예: 독일어 — 베를린 여행",
      "번역 언어", "카드 뒷면과 예문의 언어", "덱 만들기", "카드 생성 중…",
      "완료될 때까지 이 탭을 열어 두세요.",
    ],
    validation: [
      "TXT 또는 CSV 파일을 선택하세요.", "파일이 2 MB를 초과합니다.",
      "생성기에 연결할 수 없습니다. 서버를 확인하세요.", "덱을 만들 수 없습니다.",
      "예기치 않은 오류가 발생했습니다.",
    ],
    progress: [
      "파일 준비 중…", "단어 그룹 준비 중…",
      "Gemini로 {{current}}/{{total}} 그룹 분석 중…",
      "카드 마무리 중…", "Anki 덱 패키징 중…",
      "{{completed}}/{{total}} 그룹 완료", "{{count}}개 단어 발견",
      "거의 완료", "약 {{count}}초 남음", "약 {{count}}분 남음",
    ],
    success: [
      "덱 완성!", "{{count}}개 단어가 양방향 Anki 카드로 변환되었습니다.",
      "덱 저장", "모바일에서는 공유 메뉴가 열리고 PC에서는 다운로드에 저장됩니다.",
      "다른 덱 만들기", "새 Anki 어휘 덱",
    ],
    steps: ["사용 방법", "업로드", "TXT 또는 CSV 목록", "생성", "번역과 예문", "학습", "Anki로 가져오기"],
    footer: ["설정이 아닌 학습을 위해.", "파일은 처리 후 삭제됩니다"],
  }),
  hi: locale({
    languageName: "हिन्दी",
    header: ["Wortdeck, होम", "जर्मन → Anki", "यह कैसे काम करता है", "भाषा"],
    hero: [
      "आपकी शब्दावली, पढ़ने के लिए तैयार", "शब्दों की सूची से",
      "एक असली", "Anki डेक तक।",
      "फ़ाइल अपलोड करें और हम लिंग, उदाहरणों और ज़रूरी जानकारी के साथ जर्मन–{{language}} कार्ड बनाएँगे।",
    ],
    form: [
      "अपनी सूची चुनें", "हर पंक्ति में एक जर्मन शब्द", "फ़ाइल चुनें",
      "या यहाँ खींचें", "TXT या CSV · अधिकतम 2 MB", "बदलने के लिए तैयार",
      "फ़ाइल हटाएँ", "नाम दें", "Anki में यही नाम दिखेगा", "डेक का नाम",
      "जैसे जर्मन — बर्लिन यात्रा", "इसमें अनुवाद करें",
      "कार्ड के पीछे और उदाहरणों की भाषा", "मेरा डेक बनाएँ",
      "कार्ड बनाए जा रहे हैं…", "पूरा होने तक यह टैब खुला रखें।",
    ],
    validation: [
      "TXT या CSV फ़ाइल चुनें।", "फ़ाइल 2 MB से बड़ी है।",
      "जनरेटर से संपर्क नहीं हो सका। सर्वर जाँचें।", "डेक नहीं बन सका।",
      "अप्रत्याशित त्रुटि हुई।",
    ],
    progress: [
      "फ़ाइल तैयार हो रही है…", "शब्द समूह तैयार हो रहे हैं…",
      "Gemini से समूह {{current}}/{{total}} का विश्लेषण…",
      "कार्ड पूरे किए जा रहे हैं…", "Anki डेक पैक हो रहा है…",
      "{{completed}}/{{total}} समूह पूरे", "{{count}} शब्द मिले",
      "लगभग पूरा", "लगभग {{count}} सेकंड बाकी", "लगभग {{count}} मिनट बाकी",
    ],
    success: [
      "डेक तैयार!", "{{count}} शब्द दो-तरफ़ा Anki कार्ड में बदल गए।",
      "डेक सहेजें", "मोबाइल पर शेयर मेनू खुलेगा; कंप्यूटर पर फ़ाइल Downloads में होगी।",
      "एक और डेक बनाएँ", "मेरा नया Anki शब्दावली डेक",
    ],
    steps: ["यह कैसे काम करता है", "अपलोड", "TXT या CSV सूची", "हम बनाते हैं", "अनुवाद और उदाहरण", "पढ़ें", "Anki में आयात करें"],
    footer: ["सीखने के लिए बनाया गया, सेटिंग के लिए नहीं।", "प्रोसेस के बाद फ़ाइलें हटा दी जाती हैं"],
  }),
} as const;
