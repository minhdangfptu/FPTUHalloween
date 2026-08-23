import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, House, Info, LoaderCircle, Mail, RefreshCw, UsersRound, Vote } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ddayVoteAPI from "../../apis/ddayVoteAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import "./DdayVotePage.scss";
import "./dday-vote-redesign.scss";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const createSubmissionId = () => {
  const stored = sessionStorage.getItem("ddayVoteSubmissionId");
  if (stored) return stored;
  const id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  sessionStorage.setItem("ddayVoteSubmissionId", id);
  return id;
};

const DdayVotePage = () => {
  const { t, i18n } = useTranslation();
  const voteText = (key, options) => t(`vote.${key}`, options);
  const formatDate = (value) => value
    ? new Date(value).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN", { dateStyle: "medium", timeStyle: "short" })
    : "—";
  const statusLabels = {
    open: voteText("statusOpen"),
    closed: voteText("statusClosed"),
    draft: voteText("statusDraft"),
  };
  const [config, setConfig] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [voteToken, setVoteToken] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [googleClient, setGoogleClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckingVoteStatus, setIsCheckingVoteStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const nextConfig = await ddayVoteAPI.getConfig();
      setConfig(nextConfig);
      if (nextConfig?.status === "closed") {
        try {
          setResults(await ddayVoteAPI.getResults());
        } catch {
          setResults(null);
        }
      }
    } catch (requestError) {
      setError(translateError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google?.accounts?.oauth2 || !GOOGLE_CLIENT_ID) return;
      setGoogleClient(
        window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: () => {},
        }),
      );
    };

    if (window.google?.accounts?.oauth2) initializeGoogle();
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
      return () => script.remove();
    }
    return undefined;
  }, []);

  const isOpen = config?.status === "open";
  const isComplete = useMemo(
    () => Boolean(config?.categories?.length) && config.categories.every((category) => selectedChoices[category.categoryId]),
    [config, selectedChoices],
  );

  const signInWithGoogle = () => {
    if (!googleClient) {
      toast.error(voteText("googleNotReady"));
      return;
    }

    setIsSigningIn(true);
    setIsCheckingVoteStatus(true);
    googleClient.callback = async ({ access_token: accessToken, error: googleError }) => {
      if (googleError || !accessToken) {
        setIsSigningIn(false);
        setIsCheckingVoteStatus(false);
        toast.error(voteText("googleAuthError"));
        return;
      }
      try {
        const session = await ddayVoteAPI.createSession(accessToken);
        const status = await ddayVoteAPI.getStatus(session.voteToken);
        setVoteToken(session.voteToken);
        setHasVoted(status.hasVoted);
        if (status.hasVoted) setReceipt(status);
        toast.success(voteText("googleAuthSuccess"));
      } catch (requestError) {
        toast.error(translateError(requestError));
      } finally {
        setIsSigningIn(false);
        setIsCheckingVoteStatus(false);
      }
    };
    googleClient.requestAccessToken({ prompt: "select_account" });
  };

  const setChoice = (categoryId, optionId) => {
    setSelectedChoices((current) => ({ ...current, [categoryId]: optionId }));
  };

  const submitBallot = async () => {
    if (!isComplete || !isOpen) return;
    if (!voteToken) {
      toast.error(voteText("verifyBeforeSubmit"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ddayVoteAPI.submitBallot(voteToken, {
        submissionId: createSubmissionId(),
        choices: config.categories.map((category) => ({
          categoryId: category.categoryId,
          optionId: selectedChoices[category.categoryId],
        })),
      });
      setReceipt(response);
      setHasVoted(true);
      toast.success(translateSuccess("Vote recorded successfully"));
    } catch (requestError) {
      toast.error(translateError(requestError));
      if (requestError.response?.status === 401) setVoteToken("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <main className="dday-vote-page"><div className="dday-vote-state"><LoaderCircle className="dday-spin" size={30} /><p>{voteText("loading")}</p></div></main>;
  }

  if (error) {
    return <main className="dday-vote-page"><div className="dday-vote-state"><h1>{voteText("loadError")}</h1><p>{error}</p><button type="button" className="dday-button dday-button--secondary" onClick={loadConfig}><RefreshCw size={16} /> {voteText("retry")}</button></div></main>;
  }

  return (
    <main className="dday-vote-page">
      <section className="dday-vote-hero">
        <div className="dday-vote-kicker"><Vote size={16} /> {voteText("kicker")}</div>
        <h1>{config?.title || voteText("title")}</h1>
        <p>{config?.description || voteText("description")}</p>
        <div className="dday-vote-meta">
          <span className={`dday-status dday-status--${config?.status || "draft"}`}>{statusLabels[config?.status] || voteText("statusDraft")}</span>
          {config?.closeAt && <span>{voteText("closingTime", { time: formatDate(config.closeAt) })}</span>}
        </div>
      </section>

      {isOpen && !hasVoted && isCheckingVoteStatus && (
        <section className="dday-vote-card dday-vote-status-card" aria-busy="true" aria-live="polite">
          <LoaderCircle className="dday-spin" size={30} />
          <h2>{voteText("checkingStatus")}</h2>
          <p>{voteText("checkingStatusText")}</p>
        </section>
      )}

      {isOpen && !hasVoted && !isCheckingVoteStatus && !voteToken && (
        <section className="dday-vote-card dday-auth-card">
          <div className="dday-vote-card__intro">
            <div><span className="dday-vote-eyebrow">{voteText("stepOne")}</span><h2>{voteText("googleTitle")}</h2><p className="dday-card-description">{voteText("googleDescription")}</p></div>
            <button type="button" className="dday-button dday-button--google" onClick={signInWithGoogle} disabled={isSigningIn}>
              <span aria-hidden className="google-swatch"><GoogleIcon /></span>
              <span>{voteText(isSigningIn ? "verifying" : "signInGoogle")}</span>
            </button>
          </div>
          <p className="dday-vote-note">{voteText("googlePrivacy")}</p>
        </section>
      )}

      {isOpen && !hasVoted && !isCheckingVoteStatus && voteToken && (
        <section className="dday-vote-card">
          <div className="dday-vote-card__intro">
            <div><span className="dday-vote-eyebrow">{voteText("stepTwo")}</span><h2>{voteText("chooseTitle")}</h2><p className="dday-card-description">{voteText("chooseDescription")}</p></div>
            <span className="dday-authenticated"><CheckCircle2 size={17} /> {voteText("googleVerified")}</span>
          </div>
          <div className="dday-categories">
            {(config?.categories || []).map((category, index) => (
              <fieldset className="dday-category" key={category.categoryId}>
                <legend><span>0{index + 1}</span>{category.label}</legend>
                <div className="dday-options">
                  {category.options.map((option) => (
                    <label className={`dday-option ${selectedChoices[category.categoryId] === option.optionId ? "dday-option--selected" : ""}`} key={option.optionId}>
                      <input type="radio" name={category.categoryId} value={option.optionId} checked={selectedChoices[category.categoryId] === option.optionId} onChange={() => setChoice(category.categoryId, option.optionId)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <button type="button" className="dday-button dday-button--submit" disabled={!isComplete || !voteToken || isSubmitting} onClick={submitBallot}>{isSubmitting ? <><LoaderCircle className="dday-spin" size={17} /> {voteText("submitting")}</> : voteText("submit")}</button>
          <p className="dday-vote-note">{voteText("submitNote")}</p>
        </section>
      )}

      {hasVoted && (
        <section className="dday-vote-card dday-vote-card--success">
          <CheckCircle2 size={44} />
          <span className="dday-vote-eyebrow">{voteText("successLabel")}</span>
          <h2>{voteText("successTitle")}</h2>
          <p>{voteText("successText")}</p>
          {receipt?.submittedAt && <small>{voteText("submittedAt", { time: formatDate(receipt.submittedAt) })}</small>}
          <p className="dday-success-links__label">{voteText("relatedPages")}</p>
          <nav className="dday-success-links" aria-label={voteText("relatedPagesAria")}>
            <Link className="dday-button dday-button--secondary" to="/btc-fuhlw"><UsersRound size={17} /> {voteText("organizers")} <ArrowUpRight size={15} /></Link>
            <Link className="dday-button dday-button--secondary" to="/introduce-hlw26"><Info size={17} /> {voteText("eventIntroduction")} <ArrowUpRight size={15} /></Link>
            <Link className="dday-button dday-button--secondary" to="/"><House size={17} /> {voteText("home")} <ArrowUpRight size={15} /></Link>
            <Link className="dday-button dday-button--secondary" to="/contact-us"><Mail size={17} /> {voteText("contact")} <ArrowUpRight size={15} /></Link>
          </nav>
        </section>
      )}

      {!isOpen && !hasVoted && <section className="dday-vote-card dday-vote-card--closed"><span className="dday-vote-eyebrow">{voteText(config?.status === "closed" ? "closedLabel" : "notOpenLabel")}</span><h2>{voteText(config?.status === "closed" ? "closedTitle" : "notOpenTitle")}</h2><p>{voteText(config?.status === "closed" ? "closedText" : "notOpenText")}</p></section>}

      {results && (
        <section className="dday-results-card"><div className="dday-results-heading"><div><span className="dday-vote-eyebrow">{voteText("resultsLabel")}</span><h2>{voteText("totalVotes", { count: results.totalVotes })}</h2></div><span>{voteText("closedAt", { time: formatDate(results.closedAt) })}</span></div>{results.categories.map((category) => <div className="dday-result-category" key={category.categoryId}><h3>{category.label}</h3>{category.options.map((option) => <div className="dday-result-row" key={option.optionId}><span>{option.label}</span><strong>{option.count}</strong></div>)}</div>)}</section>
      )}
    </main>
  );
};

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.25Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.89H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.46 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.52c.77-2.31 2.92-4.03 5.46-4.03Z"
      />
    </svg>
  );
}

export default DdayVotePage;
