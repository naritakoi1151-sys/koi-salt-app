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

function formatConcentration(value) {
  if (!isFinite(value)) return "-";
  return `${Number(value).toFixed(4)}%`;
}

function formatVolume(value, unit) {
  if (!isFinite(value)) return "-";
  if (unit === "t") {
    return `${value.toFixed(2)} t`;
  }
  return `${Math.round(value)} L`;
}

function formatLiters(value) {
  if (!isFinite(value)) return "-";
  if (value >= 1000) {
    return `${value.toFixed(0)} L`;
  }
  return `${value.toFixed(1)} L`;
}

function formatDays(value) {
  if (!isFinite(value)) return "-";
  return `${value.toFixed(1)}日`;
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

function sectionTitleStyle() {
  return {
    fontWeight: 800,
    fontSize: 20,
    marginBottom: 16,
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

  const [reverseSalt, setReverseSalt] = useState("10");
  const [reversePercent, setReversePercent] = useState("0.5");
  const [targetPercent2, setTargetPercent2] = useState("0.5");

  // 差し水計算
  const [sashiFlowValue, setSashiFlowValue] = useState("500");
  const [sashiFlowUnit, setSashiFlowUnit] = useState("cc");
  const [sashiCurrentSalt, setSashiCurrentSalt] = useState("0.50");
  const [sashiTargetSalt, setSashiTargetSalt] = useState("0.30");

  const tons =
    unit === "t"
      ? parseNumber(pondVolume)
      : parseNumber(pondVolume) / 1000;

  const pondLiters = tons * 1000;

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

  const reverseKg = parseNumber(reverseSalt);
  const reverseP = parseNumber(reversePercent);
  const estimatedTons = reverseP > 0 ? reverseKg / (reverseP * 10) : 0;
  const estimatedVolume = unit === "t" ? estimatedTons : estimatedTons * 1000;

  const target2 = parseNumber(targetPercent2);
  const diff2 = Math.max(target2 - reverseP, 0);
  const needKg = estimatedTons * diff2 * 10;

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

  // 差し水ロジック
  const sashiFlowLitersPerMin =
    sashiFlowUnit === "L"
      ? parseNumber(sashiFlowValue)
      : parseNumber(sashiFlowValue) / 1000;

  const sashiCurrentSaltValue = parseNumber(sashiCurrentSalt);
  const sashiTargetSaltValue = parseNumber(sashiTargetSalt);

  const minuteReplacementRate =
    pondLiters > 0 ? sashiFlowLitersPerMin / pondLiters : 0;

  function getDilutedSalt(minutes) {
    if (
      pondLiters <= 0 ||
      sashiFlowLitersPerMin < 0 ||
      !isFinite(minuteReplacementRate) ||
      minuteReplacementRate <= 0
    ) {
      return sashiCurrentSaltValue;
    }

    if (minuteReplacementRate >= 1) {
      return 0;
    }

    return sashiCurrentSaltValue * Math.pow(1 - minuteReplacementRate, minutes);
  }

  function getChangeBlock(minutes) {
    const liters = sashiFlowLitersPerMin * minutes;
    const percent = pondLiters > 0 ? (liters / pondLiters) * 100 : 0;
    const dilutedSalt = getDilutedSalt(minutes);

    return {
      liters,
      percent,
      dilutedSalt,
    };
  }

  const hourBlock = getChangeBlock(60);
  const dayBlock = getChangeBlock(1440);
  const weekBlock = getChangeBlock(10080);

  const reverseDays = useMemo(() => {
    if (pondLiters <= 0) return null;
    if (sashiFlowLitersPerMin <= 0) return null;
    if (sashiCurrentSaltValue <= 0 || sashiTargetSaltValue <= 0) return null;
    if (sashiTargetSaltValue >= sashiCurrentSaltValue) return null;
    if (minuteReplacementRate <= 0 || minuteReplacementRate >= 1) return null;

    const minutes =
      Math.log(sashiTargetSaltValue / sashiCurrentSaltValue) /
      Math.log(1 - minuteReplacementRate);

    if (!isFinite(minutes) || minutes < 0) return null;

    return minutes / 1440;
  }, [
    pondLiters,
    sashiFlowLitersPerMin,
    sashiCurrentSaltValue,
    sashiTargetSaltValue,
    minuteReplacementRate,
  ]);

  const reverseDaysRounded =
    reverseDays != null ? Math.ceil(reverseDays) : null;

  const sashiComment = useMemo(() => {
    if (dayBlock.percent < 1) return "かなり緩やかな差し水です。日々の変化は小さめです。";
    if (dayBlock.percent < 5) return "穏やかな差し水です。日単位で少しずつ水が入れ替わります。";
    if (dayBlock.percent < 10) return "ちょうど見やすい差し水量です。塩分低下も意識してください。";
    return "差し水量はやや強めです。塩分や水質変動に注意してください。";
  }, [dayBlock.percent]);

  const reverseComment = useMemo(() => {
    if (reverseDays == null) {
      return "現在塩分より低い目標塩分を入れると、到達日数を表示できます。";
    }
    if (reverseDays < 3) return "比較的早く薄まります。短期間での変化に注意。";
    if (reverseDays < 7) return "数日単位で塩が落ちていきます。管理しやすい範囲です。";
    if (reverseDays < 14) return "ゆっくり薄まります。日々の確認に向いています。";
    return "かなりゆっくり薄まります。長期管理向きです。";
  }, [reverseDays]);

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
            水管理くん
          </div>
          <h1 style={{ margin: 0, fontSize: 32 }}>鯉のための水管理ツール</h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            すぐ使えてシンプル。塩分計算と差し水計算をひとつに。
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
                <button style={buttonStyle(unit === "t")} onClick={() => setUnit("t")}>
                  t
                </button>
                <button style={buttonStyle(unit === "L")} onClick={() => setUnit("L")}>
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
            <button style={buttonStyle(tab === "target")} onClick={() => setTab("target")}>
              現在→目標
            </button>
            <button style={buttonStyle(tab === "increase")} onClick={() => setTab("increase")}>
              指定%だけ上げる
            </button>
            <button
              style={buttonStyle(tab === "waterchange")}
              onClick={() => setTab("waterchange")}
            >
              水換え補充
            </button>
            <button style={buttonStyle(tab === "reverse")} onClick={() => setTab("reverse")}>
              逆算
            </button>
            <button style={buttonStyle(tab === "sashimizu")} onClick={() => setTab("sashimizu")}>
              差し水計算
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
              <div style={sectionTitleStyle()}>現在濃度から目標濃度まで上げる</div>

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
              <div style={sectionTitleStyle()}>現場メモ</div>

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
              <div style={sectionTitleStyle()}>指定した%だけ上げる</div>

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
              <div style={sectionTitleStyle()}>早見表</div>

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
              <div style={sectionTitleStyle()}>水換え後の補充計算</div>

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
              <div style={sectionTitleStyle()}>基準</div>

              <div style={{ display: "grid", gap: 10 }}>
                <div style={infoBoxStyle()}>0.1% = 1tあたり 1kg</div>
                <div style={infoBoxStyle()}>0.3% = 1tあたり 3kg</div>
                <div style={infoBoxStyle()}>0.5% = 1tあたり 5kg</div>
                <div style={infoBoxStyle()}>0.6% = 1tあたり 6kg</div>
              </div>
            </div>
          </div>
        )}

        {tab === "reverse" && (
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <div style={cardStyle()}>
              <div style={sectionTitleStyle()}>投入量から池水量を逆算</div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                  入れた塩（kg）
                </div>
                <input
                  style={inputStyle()}
                  value={reverseSalt}
                  onChange={(e) => setReverseSalt(e.target.value)}
                  inputMode="decimal"
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                  上げた濃度（%）
                </div>
                <input
                  style={inputStyle()}
                  value={reversePercent}
                  onChange={(e) => setReversePercent(e.target.value)}
                  inputMode="decimal"
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                  目標濃度（%）
                </div>
                <input
                  style={inputStyle()}
                  value={targetPercent2}
                  onChange={(e) => setTargetPercent2(e.target.value)}
                  inputMode="decimal"
                />
              </div>

              <div style={cardStyle(true)}>
                <div style={{ fontSize: 13, opacity: 0.8 }}>推定池水量</div>
                <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>
                  {formatVolume(estimatedVolume, unit)}
                </div>
              </div>

              <div style={{ height: 12 }} />

              <div style={cardStyle(true)}>
                <div style={{ fontSize: 13, opacity: 0.8 }}>あと必要な塩</div>
                <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>
                  {formatSalt(needKg)}
                </div>
              </div>

              <div style={{ height: 12 }} />

              <div style={infoBoxStyle("#ecfeff")}>
                {reverseKg}kg ÷ ({reverseP}% × 10) = {estimatedTons.toFixed(2)}t
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={sectionTitleStyle()}>使い方</div>

              <div style={{ display: "grid", gap: 12 }}>
                <div style={infoBoxStyle()}>
                  例：10kg 入れて 0.5% 上がった → 2.00t
                </div>
                <div style={infoBoxStyle()}>
                  L表示にしたい時は上の unit を L に切り替えてください。
                </div>
                <div style={infoBoxStyle()}>
                  実測と照らし合わせれば、池水量の見直しにも使えます。
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "sashimizu" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gap: 20,
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              <div style={cardStyle()}>
                <div style={sectionTitleStyle()}>差し水計算</div>

                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      差し水量（1分あたり）
                    </div>
                    <input
                      style={inputStyle()}
                      value={sashiFlowValue}
                      onChange={(e) => setSashiFlowValue(e.target.value)}
                      inputMode="decimal"
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        style={buttonStyle(sashiFlowUnit === "cc")}
                        onClick={() => setSashiFlowUnit("cc")}
                      >
                        cc
                      </button>
                      <button
                        style={buttonStyle(sashiFlowUnit === "L")}
                        onClick={() => setSashiFlowUnit("L")}
                      >
                        L
                      </button>
                    </div>
                  </div>

                  <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      現在の塩分濃度（%）
                    </div>
                    <input
                      style={inputStyle()}
                      value={sashiCurrentSalt}
                      onChange={(e) => setSashiCurrentSalt(e.target.value)}
                      inputMode="decimal"
                    />
                  </div>

                  <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                      目標の塩分濃度（%）
                    </div>
                    <input
                      style={inputStyle()}
                      value={sashiTargetSalt}
                      onChange={(e) => setSashiTargetSalt(e.target.value)}
                      inputMode="decimal"
                    />
                  </div>

                  <div style={infoBoxStyle("#ecfeff")}>
                    池名：<strong>{pondName || "-"}</strong>
                    <br />
                    池水量：<strong>{formatVolume(unit === "t" ? tons : pondLiters, unit)}</strong>
                    <br />
                    1分あたり差し水量：
                    <strong>
                      {" "}
                      {sashiFlowUnit === "cc"
                        ? `${parseNumber(sashiFlowValue).toFixed(0)} cc`
                        : `${parseNumber(sashiFlowValue).toFixed(2)} L`}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={cardStyle()}>
                <div style={sectionTitleStyle()}>塩分低下シミュレーション</div>

                <div style={{ display: "grid", gap: 12 }}>
                  <div style={infoBoxStyle("#fff7ed")}>{sashiComment}</div>
                  <div style={infoBoxStyle()}>
                    差し水は真水、池内は均一に混ざる前提の参考値です。
                  </div>
                  <div style={infoBoxStyle()}>
                    目標塩分までの到達日数は、今の差し水量が継続すると仮定して計算しています。
                  </div>
                  <div style={cardStyle(true)}>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>目標塩分までの日数</div>
                    <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>
                      {reverseDays != null ? formatDays(reverseDays) : "-"}
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>
                      {reverseDaysRounded != null
                        ? `切り上げ目安：約 ${reverseDaysRounded}日`
                        : "※ 目標塩分は現在塩分より低くしてください"}
                    </div>
                  </div>
                  <div style={infoBoxStyle()}>{reverseComment}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 20,
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              }}
            >
              <div style={cardStyle()}>
                <div style={sectionTitleStyle()}>1時間</div>
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={infoBoxStyle()}>
                    <div style={{ fontSize: 13, color: "#475569" }}>入れ替わり量</div>
                    <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>
                      {formatLiters(hourBlock.liters)}
                    </div>
                  </div>

                  <div style={infoBoxStyle()}>
                    <div style={{ fontSize: 13, color: "#475569" }}>入れ替わり率</div>
                    <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>
                      {formatPercent(hourBlock.percent)}
                    </div>
                  </div>

                  <div style={cardStyle(true)}>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>推定塩分濃度</div>
                    <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>
                      {formatConcentration(hourBlock.dilutedSalt)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={cardStyle()}>
                <div style={sectionTitleStyle()}>1日</div>
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={infoBoxStyle()}>
                    <div style={{ fontSize: 13, color: "#475569" }}>入れ替わり量</div>
                    <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>
                      {formatLiters(dayBlock.liters)}
                    </div>
                  </div>

                  <div style={infoBoxStyle()}>
                    <div style={{ fontSize: 13, color: "#475569" }}>入れ替わり率</div>
                    <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>
                      {formatPercent(dayBlock.percent)}
                    </div>
                  </div>

                  <div style={cardStyle(true)}>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>推定塩分濃度</div>
                    <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>
                      {formatConcentration(dayBlock.dilutedSalt)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={cardStyle()}>
                <div style={sectionTitleStyle()}>1週間</div>
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={infoBoxStyle()}>
                    <div style={{ fontSize: 13, color: "#475569" }}>入れ替わり量</div>
                    <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>
                      {formatLiters(weekBlock.liters)}
                    </div>
                  </div>

                  <div style={infoBoxStyle()}>
                    <div style={{ fontSize: 13, color: "#475569" }}>入れ替わり率</div>
                    <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>
                      {formatPercent(weekBlock.percent)}
                    </div>
                  </div>

                  <div style={cardStyle(true)}>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>推定塩分濃度</div>
                    <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>
                      {formatConcentration(weekBlock.dilutedSalt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}