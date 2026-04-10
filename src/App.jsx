import React, { useMemo, useState } from "react";

function formatSalt(kg) {
  if (!isFinite(kg)) return "-";
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(2)} kg`;
}

function formatPercent(value) {
  if (!isFinite(value)) return "-";
  return `${Number(value).toFixed(2)}%`;
}

function formatVolume(value, unit) {
  if (!isFinite(value)) return "-";
  return unit === "t"
    ? `${value.toFixed(2)} t`
    : `${Math.round(value)} L`;
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

export default function App() {
  const [tab, setTab] = useState("reverse");
  const [unit, setUnit] = useState("t");

  // 🔥 逆算入力
  const [reverseSalt, setReverseSalt] = useState("300");
  const [reversePercent, setReversePercent] = useState("0.4");
  const [targetPercent2, setTargetPercent2] = useState("0.5");

  // ---------- 計算 ----------
  const reverseKg = parseNumber(reverseSalt);
  const reverseP = parseNumber(reversePercent);
  const targetP = parseNumber(targetPercent2);

  const estimatedTons =
    reverseP > 0 ? reverseKg / (reverseP * 10) : 0;

  const estimatedVolume =
    unit === "t" ? estimatedTons : estimatedTons * 1000;

  const diff = Math.max(targetP - reverseP, 0);
  const needKg = estimatedTons * diff * 10;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>ラクラク塩分濃度計算</h1>

      {/* 単位 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button style={buttonStyle(unit === "t")} onClick={() => setUnit("t")}>t</button>
        <button style={buttonStyle(unit === "L")} onClick={() => setUnit("L")}>L</button>
      </div>

      <div style={cardStyle()}>
        <div style={{ marginBottom: 12 }}>
          <div>入れた塩（kg）</div>
          <input
            style={inputStyle()}
            value={reverseSalt}
            onChange={(e) => setReverseSalt(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div>現在の濃度（%）</div>
          <input
            style={inputStyle()}
            value={reversePercent}
            onChange={(e) => setReversePercent(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div>目標濃度（%）</div>
          <input
            style={inputStyle()}
            value={targetPercent2}
            onChange={(e) => setTargetPercent2(e.target.value)}
          />
        </div>
      </div>

      {/* 池水量 */}
      <div style={cardStyle(true)}>
        <div>推定池水量</div>
        <div style={{ fontSize: 32, fontWeight: 900 }}>
          {formatVolume(estimatedVolume, unit)}
        </div>
      </div>

      {/* あと必要 */}
      <div style={cardStyle(true)}>
        <div>あと必要な塩</div>
        <div style={{ fontSize: 32, fontWeight: 900 }}>
          {formatSalt(needKg)}
        </div>
      </div>

      {/* 計算式 */}
      <div style={{ background: "#e0f2fe", padding: 12, borderRadius: 12 }}>
        {reverseKg}kg ÷ ({reverseP}% × 10) = {estimatedTons.toFixed(2)}t
      </div>
    </div>
  );
}