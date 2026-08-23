import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, Monitor, RefreshCw, Star } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ddayVoteAPI from "../../apis/ddayVoteAPI";
import { translateError } from "../../utils/translateResponse";
import { useTranslation } from "react-i18next";
import "./PublishCode.scss";

const getChartData = (category) => {
  const options = category.options || [];
  const highestCount = Math.max(
    ...options.map((option) => Number(option.count) || 0),
    0,
  );
  return options.map((option) => {
    const count = Number(option.count) || 0;
    return {
      label: option.label,
      count,
      isWinner: highestCount > 0 && count === highestCount,
    };
  });
};

const ChartTooltip = ({ active, payload }) => {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="publish-code-tooltip">
      <strong>{point.label}</strong>
      <span>{t("management.publish.votes", { count: point.count })}</span>
    </div>
  );
};

const PublishCode = () => {
  const { t } = useTranslation();
  const publishText = (key, options) => t(`management.publish.${key}`, options);
  const [config, setConfig] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const adminConfig = await ddayVoteAPI.getAdminConfig();
      if (!adminConfig || adminConfig.status !== "closed") {
        throw new Error(
          "Vote results are not available until the vote is closed",
        );
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
    return (
      <main
        className="publish-code-screen publish-code-screen--state"
        aria-busy="true"
      >
        <LoaderCircle className="publish-code-spin" size={42} />
        <p>{publishText("preparing")}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="publish-code-screen publish-code-screen--state">
        <div className="publish-code-error">
          <h1>{publishText("errorTitle")}</h1>
          <p>{error}</p>
          <button
            type="button"
            className="publish-code-button publish-code-button--secondary"
            onClick={loadConfig}
          >
            <RefreshCw size={18} /> {t("management.common.retry")}
          </button>
        </div>
      </main>
    );
  }

  if (!published) {
    return (
      <main className="publish-code-screen publish-code-screen--waiting">
        <span className="publish-code-ghost" aria-hidden="true">
          👻
        </span>
        <div className="publish-code-stage">
          <div className="publish-code-sparkles" aria-hidden="true">
            <span>✦</span>
            <span>✧</span>
            <span>✷</span>
            <span>★</span>
            <span>✦</span>
            <span>✧</span>
            <span>★</span>
            <span>✷</span>
          </div>
          <button
            type="button"
            className="publish-code-button"
            onClick={publishResults}
            disabled={publishing}
          >
            <Star size={28} />{" "}
            {publishText(publishing ? "loadingResults" : "publishResults")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="publish-code-screen publish-code-screen--results">
      <section className="publish-code-results" aria-live="polite">
        <div className="publish-code-results__heading">
          <div className="publish-code-results__heading-copy">
            <span className="publish-code-eyebrow">
              {publishText("liveResults")}
            </span>
            <h1>{results?.title || config?.title || publishText("resultsTitle")}</h1>
            {/* <p>
              Đóng lúc {formatDate(results?.closedAt || config?.closedAt)}
            </p> */}
          </div>
          <div
            className="publish-code-results__summary"
            aria-label={publishText("totalVotes")}
          >
            <strong>{results?.totalVotes || 0}</strong>
            <span>{publishText("voteCountLabel")}</span>
          </div>
        </div>
        <div className="publish-code-results__grid">
          {(results?.categories || []).map((category, categoryIndex) => {
            const chartData = getChartData(category);
            const categoryTotal = chartData.reduce(
              (total, option) => total + option.count,
              0,
            );
            return (
              <article
                className="publish-code-category"
                key={category.categoryId}
              >
                <div className="publish-code-category__heading">
                  <div>
                    <span className="publish-code-category__eyebrow">
                      {publishText("category", { number: String(categoryIndex + 1).padStart(2, "0") })}
                    </span>
                    <h2>{category.label}</h2>
                  </div>
                  <span className="publish-code-category__count">
                    {publishText("votes", { count: categoryTotal })}
                  </span>
                </div>
                <div
                  className="publish-code-chart"
                  role="img"
                  aria-label={publishText("chartAria", { category: category.label })}
                >
                  <div className="publish-code-chart__canvas">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 24, right: 8, left: -18, bottom: 4 }}
                        barCategoryGap="18%"
                      >
                        <CartesianGrid
                          stroke="var(--publish-grid)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          axisLine={{ stroke: "var(--publish-line)" }}
                          tickLine={false}
                          tick={{
                            fill: "var(--publish-text)",
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                          tickMargin={12}
                        />
                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "var(--publish-muted)", fontSize: 12 }}
                          width={34}
                        />
                        <Tooltip
                          content={<ChartTooltip />}
                          cursor={{ fill: "var(--publish-hover)" }}
                        />
                        <Bar
                          dataKey="count"
                          name={publishText("voteNumber")}
                          radius={[10, 10, 0, 0]}
                          animationBegin={categoryIndex * 180}
                          animationDuration={1400}
                          animationEasing="ease-out"
                        >
                          {chartData.map((option) => (
                            <Cell
                              fill={
                                option.isWinner
                                  ? "var(--publish-red-bright)"
                                  : "var(--publish-red)"
                              }
                              key={option.label}
                            />
                          ))}
                          <LabelList
                            dataKey="count"
                            position="top"
                            fill="var(--publish-white)"
                            fontSize={18}
                            fontWeight={800}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default PublishCode;
