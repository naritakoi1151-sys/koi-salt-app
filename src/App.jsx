import React, { useMemo, useState } from "react";

function formatSalt(kg) {
  if (!isFinite(kg)) return "-";
  if (kg < 1) {
    return `${Math.round(kg * 1000)} g`;
  }
  return `${kg.toFixed(2)} kg`;
}

function formatPercent(value) {
  if (!isFinite(value)) return "-";
  return `${Number(value).toFixed(2)}%`;
}

function parseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function cardStyle(highlight = false) {
  return {
    background: highlight ? "#0f172a" : "#ffffff",
    color: highlight ? "#ffffff" : "#0f172a",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
  };
}

function inputStyle() {
  return {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  };
}

function buttonStyle(active = false) {
  return {
    flex: 1,
    padding: "14px 16px",
    borderRadius: 14,
    border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
    background: active ? "#0f172a" : "#ffffff",
    color: active ? "#ffffff" : "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function quickButtonStyle(active = false) {
  return {
    padding: "12px 16px",
    borderRadius: 14,
    border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
    background: active ? "#0f172a" : "#ffffff",
    color: active ? "#ffffff" : "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
    minWidth: 96,
  };
}

function infoBoxStyle(bg = "#f8fafc") {
  return {
    background: bg,
    borderRadius: 18,
    padding: 16,
  };
}

export default function App() {
  const [tab, setTab] = useState("target");
  const [pondName, setPondName] = useState("千秋池");
  const [pondVolume, setPondVolume] = useState("88");
  const [unit, setUnit] = useState("t");
  const [currentPercent, setCurrentPercent] = useState("0.48");
  const [targetPercent, setTargetPercent] = useState("0.55");
  const [increasePercent, setIncreasePercent] = useState("0.07");
  const [changedWaterVolume, setChangedWaterVolume] = useState("2");

  const tons =
    unit === "t"
      ? parseNumber(pondVolume)
      : parseNumber(pondVolume) / 1000;

  const changedTons =
    unit === "t"
      ? parseNumber(changedWaterVolume)
      : parseNumber(changedWaterVolume) / 1000;

  const current = parseNumber(currentPercent);
  const target = parseNumber(targetPercent);
  const increase = parseNumber(increasePercent);

  const targetDiff = Math.max(target - current, 0);
  const targetKg = tons * targetDiff * 10;
  const increaseKg = tons * increase * 10;
  const refillKg = changedTons * current * 10;
  const finalPercent = current + increase;

  const quickRows = [0.1, 0.2, 0.3, 0.5, 0.6].map((percent) => ({
    percent,
    kg: tons * percent * 10,
  }));

  const splitSuggestion = useMemo(() => {
    const amount = tab === "target" ? targetKg : increaseKg;
    if (amount <= 0) return "必要量を入力すると分割目安が出ます。";
    if (amount < 30) return "少量なので一度でも可。ただし分散投入推奨。";
    if (amount < 100) return `2回分割目安：${formatSalt(amount / 2)} × 2回`;
    return `3回分割目安：${formatSalt(amount / 3)} × 3回`;
  }, [tab, targetKg, increaseKg]);

  const targetMemo =
    target >= 0.6
      ? "0.6%付近。短期処置向きで分割投入推奨。"
      : target >= 0.5
      ? "0.5%台。長期維持は注意。"
      : "比較的マイルドな濃度帯。";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: 20,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <div
            style={{
              display: "inline-block",
              background: "#ffffff",
              borderRadius: 999,
              padding: "8px 14px",
              boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
              width: "fit-content",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Narita 塩分濃度計算 Webアプリ
          </div>
          <h1 style={{ margin: 0, fontSize: 32 }}>ラクラク塩分濃度計算</h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            すぐ使えてシンプル。
          </p>
        </div>

        <div style={cardStyle()}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <button
              style={quickButtonStyle(targetPercent === "0.30")}
              onClick={() => {
                setTab("target");
                setTargetPercent("0.30");
              }}
            >
              0.3%
            </button>
            <button
              style={quickButtonStyle(targetPercent === "0.50")}
              onClick={() => {
                setTab("target");
                setTargetPercent("0.50");
              }}
            >
              0.5%
            </button>
            <button
              style={quickButtonStyle(targetPercent === "0.60")}
              onClick={() => {
                setTab("target");
                setTargetPercent("0.60");
              }}
            >
              0.6%
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>池名</div>
              <input
                style={inputStyle()}
                value={pondName}
                onChange={(e) => setPondName(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <button
                  style={buttonStyle(unit === "t")}
                  onClick={() => setUnit("t")}
                >
                  t
                </button>

                <button
                  style={buttonStyle(unit === "L")}
                  onClick={() => setUnit("L")}
                >
                  L
                </button>
              </div>

              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                池の水量（{unit}）
              </div>

              <input
                style={inputStyle()}
                value={pondVolume}
                onChange={(e) => setPondVolume(e.target.value)}
                inputMode="decimal"
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                現在の塩分濃度（%）
              </div>
              <input
                style={inputStyle()}
                value={currentPercent}
                onChange={(e) => setCurrentPercent(e.target.value)}
                inputMode="decimal"
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                目標濃度（%）
              </div>
              <input
                style={inputStyle()}
                value={targetPercent}
                onChange={(e) => setTargetPercent(e.target.value)}
                inputMode="decimal"
              />
            </div>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={buttonStyle(tab === "target")}
              onClick={() => setTab("target")}
            >
              現在→目標
            </button>
            <button
              style={buttonStyle(tab === "increase")}
              onClick={() => setTab("increase")}
            >
              指定%だけ上げる
            </button>
            <button
              style={buttonStyle(tab === "waterchange")}
              onClick={() => setTab("waterchange")}
            >
              水換え補充
            </button>
          </div>
        </div>

        {tab === "target" && (
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
                現在濃度から目標濃度まで上げる
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>池名</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {pondName || "-"}
                  </div>
                </div>

                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>現在濃度 → 目標濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {formatPercent(current)} → {formatPercent(target)}
                  </div>
                </div>

                <div style={cardStyle(true)}>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>必要な塩</div>
                  <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>
                    {formatSalt(targetKg)}
                  </div>
                </div>

                <div style={infoBoxStyle("#ecfeff")}>
                  差分 {formatPercent(targetDiff)} × {tons}t × 10 = {formatSalt(targetKg)}
                </div>
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
                現場メモ
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <div style={infoBoxStyle("#fff7ed")}>{targetMemo}</div>
                <div style={infoBoxStyle()}>{splitSuggestion}</div>
                <div style={infoBoxStyle()}>
                  大きい池は一気投入より、複数回に分ける方が安全です。
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "increase" && (
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
                指定した%だけ上げる
              </div>

              <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 700 }}>
                上げたい濃度（%）
              </div>

              <input
                style={inputStyle()}
                value={increasePercent}
                onChange={(e) => setIncreasePercent(e.target.value)}
                inputMode="decimal"
              />

              <div style={{ height: 16 }} />

              <div style={{ display: "grid", gap: 14 }}>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>現在濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {formatPercent(current)}
                  </div>
                </div>

                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>投入後の推定濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {formatPercent(finalPercent)}
                  </div>
                </div>

                <div style={cardStyle(true)}>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>必要な塩</div>
                  <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>
                    {formatSalt(increaseKg)}
                  </div>
                </div>

                <div style={infoBoxStyle("#ecfeff")}>
                  {tons}t × {increase}% × 10 = {formatSalt(increaseKg)}
                </div>
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
                早見表
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {quickRows.map((row) => (
                  <div
                    key={row.percent}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 14,
                      borderRadius: 16,
                      background: "#f8fafc",
                    }}
                  >
                    <strong>{row.percent}% 上げる</strong>
                    <span>{formatSalt(row.kg)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "waterchange" && (
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
                水換え後の補充計算
              </div>

              <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 700 }}>
                水換え量（{unit}）
              </div>

              <input
                style={inputStyle()}
                value={changedWaterVolume}
                onChange={(e) => setChangedWaterVolume(e.target.value)}
                inputMode="decimal"
              />

              <div style={{ height: 16 }} />

              <div style={{ display: "grid", gap: 14 }}>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>現在濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {formatPercent(current)}
                  </div>
                </div>

                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>水換え量</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {changedWaterVolume}
                    {unit}
                  </div>
                </div>

                <div style={cardStyle(true)}>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>補充する塩</div>
                  <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>
                    {formatSalt(refillKg)}
                  </div>
                </div>

                <div style={infoBoxStyle("#ecfeff")}>
                  {changedTons}t × {current}% × 10 = {formatSalt(refillKg)}
                </div>
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>基準</div>

              <div style={{ display: "grid", gap: 10 }}>
                <div style={infoBoxStyle()}>0.1% = 1tあたり 1kg</div>
                <div style={infoBoxStyle()}>0.3% = 1tあたり 3kg</div>
                <div style={infoBoxStyle()}>0.5% = 1tあたり 5kg</div>
                <div style={infoBoxStyle()}>0.6% = 1tあたり 6kg</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}