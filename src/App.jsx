import React, { useMemo, useState } from "react";

function formatKg(value) {
  if (!isFinite(value)) return "-";
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value);
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

function infoBoxStyle(bg = "#f8fafc") {
  return {
    background: bg,
    borderRadius: 18,
    padding: 16,
  };
}

export default function App() {
  const [tab, setTab] = useState("target");
  const [pondName, setPondName] = useState("本池");
  const [pondTons, setPondTons] = useState("88");
  const [currentPercent, setCurrentPercent] = useState("0.48");
  const [targetPercent, setTargetPercent] = useState("0.55");
  const [increasePercent, setIncreasePercent] = useState("0.07");
  const [changedWaterTons, setChangedWaterTons] = useState("2");

  const tons = parseNumber(pondTons);
  const current = parseNumber(currentPercent);
  const target = parseNumber(targetPercent);
  const increase = parseNumber(increasePercent);
  const changed = parseNumber(changedWaterTons);

  const targetDiff = Math.max(target - current, 0);
  const targetKg = tons * targetDiff * 10;
  const increaseKg = tons * increase * 10;
  const refillKg = changed * current * 10;
  const finalPercent = current + increase;

  const quickRows = [0.1, 0.2, 0.3, 0.5, 0.6].map((percent) => ({
    percent,
    kg: tons * percent * 10,
  }));

  const splitSuggestion = useMemo(() => {
    const amount = tab === "target" ? targetKg : increaseKg;
    if (amount <= 0) return null;
    if (amount < 30) return `少量なので一度でも可。ただし分散投入推奨。`;
    if (amount < 100) return `2回分割目安：${formatKg(amount / 2)}kg × 2回`;
    return `3回分割目安：${formatKg(amount / 3)}kg × 3回`;
  }, [tab, targetKg, increaseKg]);

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
            錦鯉 塩分濃度計算 Webアプリ
          </div>
          <h1 style={{ margin: 0, fontSize: 32 }}>塩投入量をすぐ計算</h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Web公開して、iPhoneのホーム画面に追加して使う前提のシンプル版です。
          </p>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>共通入力</div>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>池名</div>
              <input style={inputStyle()} value={pondName} onChange={(e) => setPondName(e.target.value)} />
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>池の水量（t）</div>
              <input style={inputStyle()} value={pondTons} onChange={(e) => setPondTons(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>現在の塩分濃度（%）</div>
              <input style={inputStyle()} value={currentPercent} onChange={(e) => setCurrentPercent(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>目標濃度（%）</div>
              <input style={inputStyle()} value={targetPercent} onChange={(e) => setTargetPercent(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={buttonStyle(tab === "target")} onClick={() => setTab("target")}>現在→目標</button>
            <button style={buttonStyle(tab === "increase")} onClick={() => setTab("increase")}>指定%だけ上げる</button>
            <button style={buttonStyle(tab === "waterchange")} onClick={() => setTab("waterchange")}>水換え補充</button>
          </div>
        </div>

        {tab === "target" && (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>現在濃度から目標濃度まで上げる</div>
              <div style={{ display: "grid", gap: 14 }}>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>池名</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{pondName || "-"}</div>
                </div>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>現在濃度 → 目標濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {formatPercent(current)} → {formatPercent(target)}
                  </div>
                </div>
                <div style={cardStyle(true)}>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>必要な塩</div>
                  <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{formatKg(targetKg)} kg</div>
                </div>
                <div style={infoBoxStyle("#ecfeff")}>
                  差分 {formatPercent(targetDiff)} × {tons}t × 10 = {formatKg(targetKg)}kg
                </div>
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>現場メモ</div>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={infoBoxStyle("#fff7ed")}>
                  {target >= 0.6 ? "0.6%付近。短期処置向きで分割投入推奨。" : target >= 0.5 ? "0.5%台。長期維持は注意。" : "比較的マイルドな濃度帯。"}
                </div>
                <div style={infoBoxStyle()}>{splitSuggestion}</div>
                <div style={infoBoxStyle()}>大きい池は一気投入より、複数回に分ける方が安全です。</div>
              </div>
            </div>
          </div>
        )}

        {tab === "increase" && (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>指定した%だけ上げる</div>
              <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 700 }}>上げたい濃度（%）</div>
              <input style={inputStyle()} value={increasePercent} onChange={(e) => setIncreasePercent(e.target.value)} inputMode="decimal" />
              <div style={{ height: 16 }} />
              <div style={{ display: "grid", gap: 14 }}>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>現在濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{formatPercent(current)}</div>
                </div>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>投入後の推定濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{formatPercent(finalPercent)}</div>
                </div>
                <div style={cardStyle(true)}>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>必要な塩</div>
                  <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{formatKg(increaseKg)} kg</div>
                </div>
                <div style={infoBoxStyle("#ecfeff")}>
                  {tons}t × {increase}% × 10 = {formatKg(increaseKg)}kg
                </div>
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>早見表</div>
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
                    <span>{formatKg(row.kg)} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "waterchange" && (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div style={cardStyle()}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>水換え後の補充計算</div>
              <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 700 }}>水換え量（t）</div>
              <input style={inputStyle()} value={changedWaterTons} onChange={(e) => setChangedWaterTons(e.target.value)} inputMode="decimal" />
              <div style={{ height: 16 }} />
              <div style={{ display: "grid", gap: 14 }}>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>現在濃度</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{formatPercent(current)}</div>
                </div>
                <div style={infoBoxStyle()}>
                  <div style={{ fontSize: 13, color: "#475569" }}>水換え量</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{changed}t</div>
                </div>
                <div style={cardStyle(true)}>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>補充する塩</div>
                  <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{formatKg(refillKg)} kg</div>
                </div>
                <div style={infoBoxStyle("#ecfeff")}>
                  {changed}t × {current}% × 10 = {formatKg(refillKg)}kg
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

        <div style={cardStyle()}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>ホーム画面追加までの流れ</div>
          <div style={{ display: "grid", gap: 12, color: "#334155", lineHeight: 1.7 }}>
            <div style={infoBoxStyle()}>1. このコードを Vite の React プロジェクトに入れる</div>
            <div style={infoBoxStyle()}>2. Vercel にデプロイする</div>
            <div style={infoBoxStyle()}>3. iPhoneのSafariで開いて「ホーム画面に追加」する</div>
          </div>
        </div>
      </div>
    </div>
  );
}