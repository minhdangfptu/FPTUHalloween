import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Monitor, RefreshCw, Volume2, VolumeX } from "lucide-react";
import ddayVoteAPI from "../../apis/ddayVoteAPI";
import { translateError } from "../../utils/translateResponse";
import "./PublishCode.scss";

const formatDate = (value) => value ? new Date(value).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" }) : "—";

const playAmbientTone = (audioContext, destination, frequency, duration, volume, type = "sine") => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const startTime = audioContext.currentTime;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.1);
};

const PublishCode = () => {
  const [config, setConfig] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const audioContextRef = useRef(null);
  const musicMasterRef = useRef(null);
  const musicTimerRef = useRef(null);
  const musicStepRef = useRef(0);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const adminConfig = await ddayVoteAPI.getAdminConfig();
      if (!adminConfig || adminConfig.status !== "closed") {
        throw new Error("Vote results are not available until the vote is closed");
      }
      setConfig(adminConfig);
    } catch (requestError) {
      setError(translateError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const stopMusic = useCallback(() => {
    if (musicTimerRef.current) {
      window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }
    const masterGain = musicMasterRef.current;
    const audioContext = audioContextRef.current;
    if (masterGain && audioContext) {
      masterGain.gain.cancelScheduledValues(audioContext.currentTime);
      masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.15);
    }
    musicMasterRef.current = null;
    setMusicOn(false);
  }, []);

  const startMusic = useCallback(async () => {
    if (musicTimerRef.current) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      const audioContext = audioContextRef.current || new AudioContext();
      if (audioContext.state === "suspended") await audioContext.resume();
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 0.12;
      masterGain.connect(audioContext.destination);
      audioContextRef.current = audioContext;
      musicMasterRef.current = masterGain;
      musicStepRef.current = 0;

      const playNextPhrase = () => {
        const notes = [110, 130.81, 146.83, 123.47, 98, 130.81, 116.54, 87.31];
        const note = notes[musicStepRef.current % notes.length];
        musicStepRef.current += 1;
        playAmbientTone(audioContext, masterGain, note, 1.9, 0.16, "sine");
        if (musicStepRef.current % 4 === 1) {
          playAmbientTone(audioContext, masterGain, note / 2, 2.5, 0.1, "triangle");
        }
      };

      playNextPhrase();
      musicTimerRef.current = window.setInterval(playNextPhrase, 1800);
      setMusicOn(true);
    } catch {
      stopMusic();
    }
  }, [stopMusic]);

  useEffect(() => () => stopMusic(), [stopMusic]);

  const publishResults = async () => {
    setPublishing(true);
    setError("");
    try {
      setResults(await ddayVoteAPI.getResults());
      setPublished(true);
    } catch (requestError) {
      setError(translateError(requestError));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <main className="publish-code-screen publish-code-screen--state" aria-busy="true"><LoaderCircle className="publish-code-spin" size={42} /><p>Đang chuẩn bị màn hình công bố…</p></main>;
  }

  if (error) {
    return <main className="publish-code-screen publish-code-screen--state"><div className="publish-code-error"><h1>Chưa thể công bố kết quả</h1><p>{error}</p><button type="button" className="publish-code-button publish-code-button--secondary" onClick={loadConfig}><RefreshCw size={18} /> Thử lại</button></div></main>;
  }

  if (!published) {
    return <main className="publish-code-screen publish-code-screen--waiting">
      <span className="publish-code-ghost" aria-hidden="true">👻</span>
      <div className="publish-code-stage">
        <div className="publish-code-sparkles" aria-hidden="true">
          <span>✦</span><span>✧</span><span>✷</span><span>★</span><span>✦</span><span>✧</span><span>★</span><span>✷</span>
        </div>
        <button type="button" className="publish-code-button" onClick={publishResults} disabled={publishing}><Monitor size={28} /> {publishing ? "Đang tải kết quả…" : "Công bố kết quả"}</button>
      </div>
      <button type="button" className="publish-code-music-toggle" onClick={musicOn ? stopMusic : startMusic} aria-pressed={musicOn} aria-label={musicOn ? "Tắt nhạc Halloween" : "Bật nhạc Halloween"}>
        {musicOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
        <span>{musicOn ? "Tắt nhạc" : "Bật nhạc"}</span>
      </button>
    </main>;
  }

  return (
    <main className="publish-code-screen publish-code-screen--results">
      <section className="publish-code-results" aria-live="polite">
        <div className="publish-code-results__heading">
          <span className="publish-code-eyebrow">FPTU HALLOWEEN · D-DAY</span>
          <h1>{results?.title || config?.title || "Kết quả bình chọn"}</h1>
          <p>{results?.totalVotes || 0} lượt bình chọn · Đóng lúc {formatDate(results?.closedAt || config?.closedAt)}</p>
        </div>
        <div className="publish-code-results__grid">
          {(results?.categories || []).map((category) => {
            const highestCount = Math.max(...category.options.map((option) => option.count), 0);
            return <article className="publish-code-category" key={category.categoryId}>
              <h2>{category.label}</h2>
              <div className="publish-code-options">
                {category.options.map((option) => <div className={`publish-code-option ${highestCount > 0 && option.count === highestCount ? "publish-code-option--winner" : ""}`} key={option.optionId}><span>{option.label}</span><strong>{option.count}</strong></div>)}
              </div>
            </article>;
          })}
        </div>
      </section>
      <button type="button" className="publish-code-music-toggle" onClick={musicOn ? stopMusic : startMusic} aria-pressed={musicOn} aria-label={musicOn ? "Tắt nhạc Halloween" : "Bật nhạc Halloween"}>
        {musicOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
        <span>{musicOn ? "Tắt nhạc" : "Bật nhạc"}</span>
      </button>
    </main>
  );
};

export default PublishCode;
