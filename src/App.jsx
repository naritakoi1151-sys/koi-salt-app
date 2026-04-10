import { useState } from "react";

// 数値変換
function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// kg / g 表示
function formatSalt(kg) {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(2)} kg`;
}

// UI
const card = {
  background: "#0f172a",
  color: "white",
  padding: 20,
  borderRadius: 20,
  marginBottom: 16,
};

const input = {
  width: "100%",
  padding: 14,
  fontSize: 18,
  borderRadius: 12,
  border: "1px solid #ccc",
};

const btn = (on) => ({
  padding: "10px 16px",
  borderRadius: 999,
  border: "none",
  marginRight: 8,
  background: on ? "#0f172a" : "#e5e7eb",
  color: on ? "white" : "#333",
  fontWeight: 700,
});

export default function App() {
  // 入力
  const [unit, setUnit] = useState("t");
  const [salt, setSalt] = useState("300");
  const [current, setCurrent] = useState("0.4");
  const [target, setTarget] = useState("0.5");

  // 数値化
  const saltKg = num(salt);
  const currentP = num(current);
  const targetP = num(target);

  // 池水量（t）
  const tons =
    currentP > 0 ? saltKg / (currentP * 10) : 0;

  // L
  const liters = tons * 1000;

  // 差分
  const diff = Math.max(targetP - currentP, 0);

  // 必要な塩
  const needKg = tons * diff * 10;

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>ラクラク塩分濃度計算</h1>

      {/* 単位切替 */}
      <div style={{ marginBottom: 12 }}>
        <button style={btn(unit === "t")} onClick={() => setUnit("t")}>
          t
        </button>
        <button style={btn(unit === "L")} onClick={() => setUnit("L")}>
          L
        </button>
      </div>

      {/* 入れた塩 */}
      <div style={{ marginBottom: 12 }}>
        <div>入れた塩（kg）</div>
        <input style={input} value={salt} onChange={(e) => setSalt(e.target.value)} />
      </div>

      {/* 現在濃度 */}
      <div style={{ marginBottom: 12 }}>
        <div>現在の濃度（%）</div>
        <input style={input} value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>

      {/* 目標濃度 */}
      <div style={{ marginBottom: 20 }}>
        <div>目標濃度（%）</div>
        <input style={input} value={target} onChange={(e) => setTarget(e.target.value)} />
      </div>

      {/* 池水量 */}
      <div style={card}>
        <div>推定池水量</div>
        <div style={{ fontSize: 32, fontWeight: 900 }}>
          {unit === "t"
            ? `${tons.toFixed(2)} t`
            : `${liters.toFixed(0)} L`}
        </div>
      </div>

      {/* 必要量 */}
      <div style={card}>
        <div>あと必要な塩</div>
        <div style={{ fontSize: 32, fontWeight: 900 }}>
          {formatSalt(needKg)}
        </div>
      </div>

      {/* 計算式 */}
      <div style={{ background: "#e0f2fe", padding: 12, borderRadius: 12 }}>
        {saltKg}kg ÷ ({currentP}% × 10) = {tons.toFixed(2)}t
      </div>
    </div>
  );
}