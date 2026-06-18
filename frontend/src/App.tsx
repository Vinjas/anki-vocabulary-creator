import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

type Status = "idle" | "working" | "ready" | "error";

type JobProgress = {
  progress: number;
  stage: string;
  processedWords: number;
  totalWords: number;
  completedBatches: number;
  totalBatches: number;
  remainingSeconds: number;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const TARGET_LANGUAGES = [
  { code: "es", flag: "🇪🇸" },
  { code: "en", flag: "🇬🇧" },
  { code: "fr", flag: "🇫🇷" },
  { code: "it", flag: "🇮🇹" },
  { code: "pt", flag: "🇵🇹" },
  { code: "nl", flag: "🇳🇱" },
  { code: "pl", flag: "🇵🇱" },
  { code: "ru", flag: "🇷🇺" },
  { code: "uk", flag: "🇺🇦" },
  { code: "tr", flag: "🇹🇷" },
  { code: "ar", flag: "🇸🇦" },
  { code: "zh", flag: "🇨🇳" },
  { code: "ja", flag: "🇯🇵" },
  { code: "ko", flag: "🇰🇷" },
  { code: "hi", flag: "🇮🇳" },
] as const;

const INTERFACE_LANGUAGES = [
  { code: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "en", flag: "🇬🇧", nativeName: "English" },
  { code: "de", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "fr", flag: "🇫🇷", nativeName: "Français" },
  { code: "it", flag: "🇮🇹", nativeName: "Italiano" },
  { code: "pt", flag: "🇵🇹", nativeName: "Português" },
  { code: "nl", flag: "🇳🇱", nativeName: "Nederlands" },
  { code: "pl", flag: "🇵🇱", nativeName: "Polski" },
  { code: "ru", flag: "🇷🇺", nativeName: "Русский" },
  { code: "uk", flag: "🇺🇦", nativeName: "Українська" },
  { code: "tr", flag: "🇹🇷", nativeName: "Türkçe" },
  { code: "ar", flag: "🇸🇦", nativeName: "العربية" },
  { code: "zh", flag: "🇨🇳", nativeName: "中文" },
  { code: "ja", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", flag: "🇰🇷", nativeName: "한국어" },
  { code: "hi", flag: "🇮🇳", nativeName: "हिन्दी" },
] as const;
const INITIAL_PROGRESS: JobProgress = {
  progress: 0,
  stage: "",
  processedWords: 0,
  totalWords: 0,
  completedBatches: 0,
  totalBatches: 0,
  remainingSeconds: 0,
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function responseError(
  response: Response,
  payload: { detail?: string } | null,
  unavailableMessage: string,
  failedMessage: string,
) {
  if (payload?.detail) return payload.detail;
  if (response.status >= 500) return unavailableMessage;
  return failedMessage;
}

function downloadName(response: Response) {
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const encodedName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plainName = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  return encodedName
    ? decodeURIComponent(encodedName)
    : plainName || "baraja.apkg";
}

function progressStage(
  progress: JobProgress,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (progress.progress >= 95) return t("progress.packaging");
  if (
    progress.totalBatches > 0 &&
    progress.completedBatches >= progress.totalBatches
  ) {
    return t("progress.finishing");
  }
  if (progress.totalBatches > 0) {
    return t("progress.analyzing", {
      current: Math.min(progress.completedBatches + 1, progress.totalBatches),
      total: progress.totalBatches,
    });
  }
  return progress.progress >= 5
    ? t("progress.batches")
    : t("progress.preparing");
}

function formatRemaining(
  seconds: number,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (seconds <= 5) return t("progress.little");
  if (seconds < 60) return t("progress.seconds", { count: seconds });
  const minutes = Math.max(1, Math.round(seconds / 60));
  return t("progress.minutes", { count: minutes });
}

function Icon({
  name,
  size = 24,
}: {
  name:
    | "arrow"
    | "check"
    | "download"
    | "file"
    | "globe"
    | "help"
    | "layers"
    | "sparkle"
    | "upload"
    | "x";
  size?: number;
}) {
  const paths = {
    arrow: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    download: (
      <>
        <path d="M12 3v12m0 0 5-5m-5 5-5-5" />
        <path d="M5 21h14" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.4 2.4 0 1 1 3.6 2.1c-.9.5-1.4 1-1.4 2M12 17h.01" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z" />
        <path d="m5 14-.7 2.3L2 17l2.3.7L5 20l.7-2.3L8 17l-2.3-.7L5 14Z" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m0 0L7 9m5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function deckNameFromFile(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function App() {
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [deckName, setDeckName] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; name: string; words: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<JobProgress>(INITIAL_PROGRESS);
  const [helpOpen, setHelpOpen] = useState(false);
  const displayNames = new Intl.DisplayNames(
    [i18n.resolvedLanguage ?? "es"],
    { type: "language" },
  );
  const targetLanguageName =
    displayNames.of(targetLanguage) ?? targetLanguage.toUpperCase();

  useEffect(() => {
    if (!helpOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHelpOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [helpOpen]);

  const chooseFile = (nextFile?: File) => {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLowerCase();
    if (!["txt", "csv"].includes(extension ?? "")) {
      setError(t("validation.format"));
      setStatus("error");
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError(t("validation.size"));
      setStatus("error");
      return;
    }
    setFile(nextFile);
    setDeckName(deckNameFromFile(nextFile.name));
    setError("");
    setResult(null);
    setStatus("idle");
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0]);
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setFile(null);
    setDeckName("");
    setResult(null);
    setProgress(INITIAL_PROGRESS);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  const createDeck = async (event: FormEvent) => {
    event.preventDefault();
    if (!file || !deckName.trim()) return;

    setStatus("working");
    setError("");
    setResult(null);
    setProgress({ ...INITIAL_PROGRESS, progress: 2 });

    const body = new FormData();
    body.append("file", file);
    body.append("deck_name", deckName.trim());
    body.append("target_language", targetLanguage);

    try {
      const response = await fetch("/api/decks/jobs", { method: "POST", body });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          responseError(
            response,
            payload,
            t("validation.unavailable"),
            t("validation.failed"),
          ),
        );
      }

      let job = await response.json();
      while (job.status !== "ready") {
        if (job.status === "error") {
          throw new Error(job.error || t("validation.failed"));
        }
        setProgress({
          progress: job.progress,
          stage: "",
          processedWords: job.processed_words,
          totalWords: job.total_words,
          completedBatches: job.completed_batches,
          totalBatches: job.total_batches,
          remainingSeconds: job.remaining_seconds,
        });
        await wait(800);
        const statusResponse = await fetch(`/api/decks/jobs/${job.id}`);
        if (!statusResponse.ok) {
          const payload = await statusResponse.json().catch(() => null);
          throw new Error(
            responseError(
              statusResponse,
              payload,
              t("validation.unavailable"),
              t("validation.failed"),
            ),
          );
        }
        job = await statusResponse.json();
      }

      setProgress({
        progress: 100,
        stage: "",
        processedWords: job.processed_words,
        totalWords: job.total_words,
        completedBatches: job.completed_batches,
        totalBatches: job.total_batches,
        remainingSeconds: 0,
      });

      const downloadResponse = await fetch(job.download_url);
      if (!downloadResponse.ok) {
        const payload = await downloadResponse.json().catch(() => null);
        throw new Error(
          responseError(
            downloadResponse,
            payload,
            t("validation.unavailable"),
            t("validation.failed"),
          ),
        );
      }
      const blob = await downloadResponse.blob();
      const name = downloadName(downloadResponse);
      const words = Number(
        downloadResponse.headers.get("X-Words-Processed") ||
          job.processed_words ||
          0,
      );
      setResult({ blob, name, words });
      setStatus("ready");
    } catch (caughtError) {
      const message =
        caughtError instanceof TypeError
          ? t("validation.unavailable")
          : caughtError instanceof Error
            ? caughtError.message
            : t("validation.unexpected");
      setError(message);
      setStatus("error");
    }
  };

  const saveDeck = async () => {
    if (!result) return;
    const shareFile = new File([result.blob], result.name, {
      type: "application/octet-stream",
    });

    if (navigator.share && navigator.canShare?.({ files: [shareFile] })) {
      try {
        await navigator.share({
          files: [shareFile],
          title: deckName,
          text: t("success.shareText"),
        });
        return;
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      }
    }

    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = result.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startAgain = () => {
    removeFile();
    setError("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label={t("header.home")}>
          <span className="brand-mark"><Icon name="layers" size={20} /></span>
          <span>wort<span>deck</span></span>
        </a>
        <div className="topbar-actions">
          <span className="topbar-note">{t("header.note")}</span>
          <button
            className="header-button"
            type="button"
            onClick={() => setHelpOpen(true)}
            aria-label={t("header.help")}
          >
            <Icon name="help" size={18} />
            <span>{t("header.help")}</span>
          </button>
          <label className="language-picker">
            <Icon name="globe" size={17} />
            <span className="visually-hidden">{t("header.language")}</span>
            <select
              value={i18n.resolvedLanguage ?? "es"}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              aria-label={t("header.language")}
            >
              {INTERFACE_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.flag} {language.nativeName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow">
            <Icon name="sparkle" size={15} /> {t("hero.eyebrow")}
          </div>
          <h1>
            {t("hero.titleStart")}<br />
            {t("hero.titleMiddle")} <em>{t("hero.titleEmphasis")}</em>
          </h1>
          <p>
            {t("hero.description", {
              language: targetLanguageName,
            })}
          </p>
        </section>

        <section className="creator-card" aria-live="polite">
          {status === "ready" && result ? (
            <div className="success-view">
              <div className="success-icon"><Icon name="check" size={34} /></div>
              <span className="success-kicker">{t("success.kicker")}</span>
              <h2>{deckName}</h2>
              <p>{t("success.description", { count: result.words })}</p>
              <button className="primary-button" type="button" onClick={saveDeck}>
                <Icon name="download" size={21} />
                {t("success.save")}
              </button>
              <p className="save-hint">{t("success.saveHint")}</p>
              <button className="text-button" type="button" onClick={startAgain}>
                {t("success.another")} <Icon name="arrow" size={17} />
              </button>
            </div>
          ) : (
            <form onSubmit={createDeck}>
              <div className="step-heading">
                <span className="step-number">1</span>
                <div>
                  <h2>{t("form.chooseTitle")}</h2>
                  <p>{t("form.chooseSubtitle")}</p>
                </div>
              </div>

              <input
                ref={inputRef}
                className="visually-hidden"
                type="file"
                accept=".txt,.csv,text/plain,text/csv"
                onChange={onFileChange}
              />

              {!file ? (
                <button
                  className={`drop-zone ${dragging ? "is-dragging" : ""}`}
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragEnter={() => setDragging(true)}
                  onDragLeave={() => setDragging(false)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onDrop}
                >
                  <span className="upload-icon"><Icon name="upload" size={28} /></span>
                  <strong>{t("form.selectFile")}</strong>
                  <span>{t("form.dragFile")}</span>
                  <small>{t("form.fileRules")}</small>
                </button>
              ) : (
                <div className="selected-file">
                  <span className="file-icon"><Icon name="file" size={24} /></span>
                  <span className="file-details">
                    <strong>{file.name}</strong>
                    <small>{formatBytes(file.size)} · {t("form.ready")}</small>
                  </span>
                  <button type="button" onClick={removeFile} aria-label={t("form.removeFile")}>
                    <Icon name="x" size={19} />
                  </button>
                </div>
              )}

              <div className="divider" />

              <div className="step-heading">
                <span className="step-number">2</span>
                <div>
                  <h2>{t("form.nameTitle")}</h2>
                  <p>{t("form.nameSubtitle")}</p>
                </div>
              </div>

              <div className="deck-options">
                <label className="field">
                  <span>{t("form.deckName")}</span>
                  <input
                    type="text"
                    value={deckName}
                    onChange={(event) => setDeckName(event.target.value)}
                    placeholder={t("form.deckPlaceholder")}
                    maxLength={100}
                    disabled={!file || status === "working"}
                  />
                </label>
                <label className="field language-field">
                  <span>{t("form.translationLanguage")}</span>
                  <select
                    value={targetLanguage}
                    onChange={(event) => setTargetLanguage(event.target.value)}
                    disabled={status === "working"}
                    aria-describedby="translation-language-hint"
                  >
                    {TARGET_LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.flag}{" "}
                        {displayNames.of(language.code) ?? language.code}
                      </option>
                    ))}
                  </select>
                  <small id="translation-language-hint">
                    {t("form.translationHint")}
                  </small>
                </label>
              </div>

              {status === "error" && (
                <div className="error-message" role="alert">
                  <span>!</span>{error}
                </div>
              )}

              {status === "working" && (
                <div className="progress-panel">
                  <div className="progress-heading">
                    <span>{progressStage(progress, t)}</span>
                    <strong>{progress.progress}%</strong>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress.progress}
                    aria-label={t("progress.aria")}
                  >
                    <span style={{ width: `${progress.progress}%` }} />
                  </div>
                  <div className="progress-meta">
                    <span>
                      {progress.completedBatches > 0
                        ? t("progress.completed", {
                            completed: progress.completedBatches,
                            total: progress.totalBatches,
                          })
                        : t("progress.words", { count: progress.totalWords })}
                    </span>
                    <span>{formatRemaining(progress.remainingSeconds, t)}</span>
                  </div>
                </div>
              )}

              <button
                className="primary-button"
                type="submit"
                disabled={!file || !deckName.trim() || status === "working"}
              >
                {status === "working" ? (
                  <><span className="spinner" /> {t("form.creating")}</>
                ) : (
                  <>{t("form.create")} <Icon name="arrow" size={20} /></>
                )}
              </button>
              {status === "working" && (
                <p className="working-note">{t("form.keepOpen")}</p>
              )}
            </form>
          )}
        </section>

        <section className="steps-strip" aria-label={t("steps.aria")}>
          <div><span>01</span><strong>{t("steps.upload")}</strong><small>{t("steps.uploadHint")}</small></div>
          <div className="step-line" />
          <div><span>02</span><strong>{t("steps.create")}</strong><small>{t("steps.createHint")}</small></div>
          <div className="step-line" />
          <div><span>03</span><strong>{t("steps.study")}</strong><small>{t("steps.studyHint")}</small></div>
        </section>
      </main>

      <footer>
        <span>{t("footer.motto")}</span>
        <span className="privacy"><span /> {t("footer.privacy")}</span>
      </footer>

      {helpOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setHelpOpen(false);
          }}
        >
          <section
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setHelpOpen(false)}
              aria-label={t("help.close")}
            >
              <Icon name="x" size={20} />
            </button>

            <div className="modal-intro">
              <span className="modal-mark"><Icon name="file" size={25} /></span>
              <div>
                <span className="modal-kicker">{t("help.kicker")}</span>
                <h2 id="help-title">{t("help.title")}</h2>
              </div>
            </div>
            <p className="modal-lead">{t("help.intro")}</p>

            <div className="format-grid">
              <article className="format-card">
                <span className="format-badge">.TXT</span>
                <h3>{t("help.txtTitle")}</h3>
                <p>{t("help.txtText")}</p>
                <div className="code-example">
                  <span>{t("help.example")}</span>
                  <code>Haus{"\n"}lernen{"\n"}schön</code>
                </div>
              </article>
              <article className="format-card">
                <span className="format-badge">.CSV</span>
                <h3>{t("help.csvTitle")}</h3>
                <p>{t("help.csvText")}</p>
                <div className="code-example">
                  <span>{t("help.example")}</span>
                  <code>german{"\n"}Haus{"\n"}lernen</code>
                </div>
              </article>
            </div>

            <div className="guide-grid">
              <section>
                <h3>{t("help.processTitle")}</h3>
                <ol className="guide-list">
                  <li><span>1</span>{t("help.process1")}</li>
                  <li><span>2</span>{t("help.process2")}</li>
                  <li><span>3</span>{t("help.process3")}</li>
                </ol>
              </section>
              <section>
                <h3>{t("help.ankiTitle")}</h3>
                <ol className="guide-list">
                  <li><span>1</span>{t("help.anki1")}</li>
                  <li><span>2</span>{t("help.anki2")}</li>
                  <li><span>3</span>{t("help.anki3")}</li>
                </ol>
              </section>
            </div>

            <div className="mobile-tip">
              <Icon name="sparkle" size={19} />
              <p>{t("help.mobile")}</p>
            </div>
            <button
              className="primary-button modal-button"
              type="button"
              onClick={() => setHelpOpen(false)}
            >
              {t("help.understood")} <Icon name="arrow" size={19} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
