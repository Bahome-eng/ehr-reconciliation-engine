import React, { useState, useEffect } from "react";
import "./App.css";


function App() {

  const [age, setAge] = useState("");
const [conditionInput, setConditionInput] = useState("");
const [conditions, setConditions] = useState([]);
//const [inputMode, setInputMode] = useState("quick");
const [inputMode, setInputMode] = useState(null);
const [eGFR, setEgfr] = useState("");
const [resultMode, setResultMode] = useState(null);
const [reliability, setReliability] = useState("");
const [typedAnalysis, setTypedAnalysis] = useState("");
const [lastUpdated, setLastUpdated] = useState("");
const [selectedTest, setSelectedTest] = useState(null);


const [medInput, setMedInput] = useState("");
const [systemInput, setSystemInput] = useState("");
const [sources, setSources] = useState([]);


  const [result, setResult] = useState(null);
  const [quality, setQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [typedText, setTypedText] = useState("");
  //const [activeView, setActiveView] = useState(null); // 🔥 FIX
  const [activeView, setActiveView] = useState("dashboard");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  

  const specDataQualityInput = {
    demographics: {
      name: "Test Case",
      dob: "1955-03-15",
      gender: "M"
    },
    medications: ["Metformin 500mg", "Lisinopril 10mg"],
    allergies: [],
    conditions: ["Type 2 Diabetes"],
    vital_signs: {
      blood_pressure: "340/180",
      heart_rate: 72
    },
    last_updated: "2024-06-15"
  };
  
  const goodDataQualityInput = {
    demographics: { name: "Healthy Patient", dob: "1995-01-01", gender: "F" },
    medications: ["Vitamin D"],
    allergies: ["Penicillin"],
    conditions: ["None"],
    vital_signs: { blood_pressure: "120/80", heart_rate: 70 },
    last_updated: "2026-03-01"
  };
  
  const selectedDataQuality =
    selectedTest === "good"
      ? goodDataQualityInput
      : specDataQualityInput;
  

  useEffect(() => {
    if (!result?.reasoning) return;

    let i = 0;
    setTypedText("");

    

    const interval = setInterval(() => {
      setTypedText((prev) => prev + result.reasoning.charAt(i));
      i++;

      if (i >= result.reasoning.length) {
        clearInterval(interval);
      }
    }, 15);

    
  

    return () => clearInterval(interval);
  }, [result]);

  useEffect(() => {
    if (!quality?.ai_analysis) return;
  
    let i = 0;
    setTypedAnalysis("");
  
    const interval = setInterval(() => {
      setTypedAnalysis((prev) => prev + quality.ai_analysis.charAt(i));
      i++;
  
      if (i >= quality.ai_analysis.length) {
        clearInterval(interval);
      }
    }, 15);
  
    return () => clearInterval(interval);
  }, [quality]);
  
  
  const patients = [
    {
      id: 1,
      name: "Spec Patient",
      age: 67,
      conditions: ["Type 2 Diabetes", "Hypertension"],
      eGFR: 45
    },
    {
      id: 2,
      name: "John Doe",
      age: 65,
      conditions: ["diabetes"]
    },
    
  ];

  //const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const buildPayload = () => {
    if (inputMode === "quick" && selectedPatient) {
      return {
        patient_context: {
          age: selectedPatient.age,
          conditions: selectedPatient.conditions,
          recent_labs: {
            eGFR: selectedPatient?.eGFR || 60
          }
        },
        sources,
      };
    }
  
    return {
      patient_context: {
        age: Number(age),
        conditions,
        recent_labs: {
          eGFR: Number(eGFR) || null
        }
      },
      sources,
    };
  };
  
  

  const callApi = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Request failed");
    }

    return await res.json();
  };

  const handleReconcile = async () => {
    if (!inputMode) {
      alert("Please select input method");
      return;
    }
    
    if (
      (inputMode === "manual" && !age) ||
      (inputMode === "quick" && !selectedPatient) ||
      sources.length === 0
    ) {
      alert("Please complete patient info and add at least one medication");
      return;
    }
    setLoading(true);
    setDecision(null);
    setActiveView("reconcile");

    try {
      const data = await callApi(
        "http://127.0.0.1:8000/api/reconcile/medication",
        buildPayload()
      );
      setResult(data);
      setResultMode(inputMode);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  // 🔥 BUILD DATA QUALITY INPUT FROM RECONCILIATION
  
  const buildDataQualityInput = () => {
    return selectedDataQuality;
  };
      

    
const handleValidate = async () => {
  const dqInput = buildDataQualityInput();

  if (!dqInput) return;

  setLoading(true);
  setActiveView("quality");

  try {
    const data = await callApi(
      "http://127.0.0.1:8000/api/validate/data-quality",
      dqInput
    );
    setQuality(data);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleDecision = (type) => {
    if (!result) return;
  
    setDecision(type);
  
    const entry = {
      patient: selectedPatient
  ? selectedPatient.name
  : `Age ${age}`,
      medication: result.reconciled_medication,
      decision: type,
      time: new Date().toLocaleString(),
    };
  
    setHistory([entry, ...history]);
  
    // 🔥 SHOW FEEDBACK MESSAGE
    setMessage(
      type === "approved"
        ? "✅ Medication Approved"
        : "❌ Medication Rejected"
    );
  
    // 🔥 AUTO CLEAR AFTER 2s
    setTimeout(() => setMessage(""), 2000);
  };

  const getColor = (value) => {
    if (value >= 80) return "#16a34a";
    if (value >= 50) return "#d97706";
    return "#dc2626";
  };

  
  
  const getScoreColor = (value) => {
    if (value >= 80) return "#22c55e";   // green
    if (value >= 60) return "#f59e0b";   // yellow
    return "#ef4444";                    // red
  };
  return (
    <div style={appBackground}>

      {/* HEADER */}
      

  {/* HEADER */}
  {message && (
  <div style={toast}>
    {message}
  </div>
)}

<div style={header}>
<h1 style={title}>
🚀 MedSync: EHR System
</h1>
</div>

  {/* ✅ ADD NAV BAR HERE */}
  <div style={navBar}>
  <span
  style={navItem(activeView === "dashboard", hoveredTab === "dashboard")}
  onMouseEnter={() => setHoveredTab("dashboard")}
  onMouseLeave={() => setHoveredTab(null)}
  onClick={() => setActiveView("dashboard")}
>
  Dashboard
</span>

<span
  style={navItem(activeView === "reconcile", hoveredTab === "reconcile")}
  onMouseEnter={() => setHoveredTab("reconcile")}
  onMouseLeave={() => setHoveredTab(null)}
  onClick={() => setActiveView("reconcile")}
>
  Reconcile
</span>

<span
  style={navItem(activeView === "quality", hoveredTab === "quality")}
  onMouseEnter={() => setHoveredTab("quality")}
  onMouseLeave={() => setHoveredTab(null)}
  onClick={() => setActiveView("quality")}
>
  Data Quality
</span>

<span
  style={navItem(activeView === "history", hoveredTab === "history")}
  onMouseEnter={() => setHoveredTab("history")}
  onMouseLeave={() => setHoveredTab(null)}
  onClick={() => setActiveView("history")}
>
  History
</span>

  </div>

  {/* MAIN CONTENT */}
  <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
        
        {/* BUTTONS */}
       

        {/* 🔥 RECONCILE ONLY */}
 {/* 🔥 RECONCILE ONLY */}
{activeView === "reconcile" && (
  <>
    {/* 🔹 INPUT METHOD */}
    <div style={{
  ...card,
  textAlign: "center",
  padding: "15px 20px",     // 🔥 reduce padding
}}>
      <h2 style={{
  ...sectionTitle,
  marginBottom: "10px",   // 🔥 tighter
}}>
  Choose Input Method
</h2>

      {!inputMode && (
        <div style={{
          marginTop: "10px",
          color: "#fbbf24",
          fontSize: "14px",
          fontWeight: "500"
          
        }}>
          ⚠️ No method selected — please choose one
        </div>
      )}

      <div style={toggleContainer}>
      <button
  style={toggleBtn(inputMode === "quick")}
  onClick={() => {
    setInputMode("quick");
    setResult(null);
    setTypedText("");
    setSelectedPatient(null);
    setSources([]);
  }}
>
  Quick Select
</button>

<button
  style={toggleBtn(inputMode === "manual")}   // 🔥 ADD THIS LINE
  onClick={() => {
    setInputMode("manual");
    setSelectedPatient(null);
    setResult(null);
    setTypedText("");
    setAge("");
    setEgfr("");
    setConditions([]);
    setSources([]);
  }}
>
  Enter Info
</button>
      </div>
    </div>

    {/* 🔵 QUICK SELECT */}
    {inputMode === "quick" && (
      <div style={card}>
        <h3>Quick Select Patient</h3>

        <select
  onChange={(e) => {
    const p = patients.find(
      (p) => p.id === parseInt(e.target.value)
    );

    setSelectedPatient(p);

    if (!p) return;

    if (p.name === "Spec Patient") {
      setSources([
        {
          system: "Hospital EHR",
          medication: "Metformin 1000mg twice daily",
          last_updated: "2024-10-15",
          source_reliability: "high"
        },
        {
          system: "Primary Care",
          medication: "Metformin 500mg twice daily",
          last_updated: "2025-01-20",
          source_reliability: "high"
        },
        {
          system: "Pharmacy",
          medication: "Metformin 1000mg daily",
          last_updated: "2025-01-25",
          source_reliability: "medium"
        }
      ]);
    } else if (p.name === "John Doe") {
      setSources([
        {
          system: "Hospital EHR",
          medication: "Metformin 500mg",
          last_updated: new Date().toISOString(),
          source_reliability: "high"
        }
      ]);
    } else if (p.name === "Alice Smith") {
      setSources([
        {
          system: "Clinic",
          medication: "Lisinopril 10mg",
          last_updated: new Date().toISOString(),
          source_reliability: "high"
        }
      ]);
    }
  }}
  style={inputStyle}
>
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {selectedPatient && (
  <div style={{ marginTop: "15px" }}>
    <div style={infoLine}>

      {/* COLUMN 1 */}
      {/* COLUMN 1 */}
<div>
  <p><strong>Conditions:</strong> {selectedPatient.conditions.join(", ")}</p>
  <p><strong>Allergies:</strong> None</p>
  <p><strong>eGFR:</strong> {selectedPatient?.eGFR || 60}</p>
</div>

      {/* COLUMN 2 */}
      <div>
        <p><strong>Medications:</strong></p>
        {sources.map((s, i) => (
          <p key={i}>{s.medication}</p>
        ))}
      </div>

      {/* COLUMN 3 */}
      <div>
        <p><strong>Sources:</strong></p>
        {sources.map((s, i) => (
          <p key={i}>
            {s.system} → {s.medication}
          </p>
        ))}
      </div>

    </div>
  </div>
)}

      </div>
    )}

    {/* 🟢 MANUAL INPUT */}
    {inputMode === "manual" && (
        <>
          {/* 🔵 PATIENT INFO */}
          <div style={card}>
            <h3>Patient Info</h3>
      
            <input
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={inputStyle}
            />
      
            <input
              placeholder="eGFR"
              value={eGFR}
              onChange={(e) => setEgfr(e.target.value)}
              style={inputStyle}
            />
      
            <input
              placeholder="Condition"
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              style={inputStyle}
            />
      
            <button
              onClick={() => {
                if (conditionInput.trim()) {
                  setConditions([...conditions, conditionInput]);
                  setConditionInput("");
                }
              }}
              style={btnBlue}
            >
              Add Condition
            </button>
      
            <div>
              {conditions.map((c, i) => (
                <span key={i} style={tagStyle}>{c}</span>
              ))}
            </div>
          </div>
      
          {/* 🔴 ADD THIS NEW SECTION (THIS IS WHAT YOU WERE MISSING) */}
          <div style={card}>
            <h3>Medications</h3>
      
            <input
              placeholder="Source (Hospital, Pharmacy, etc.)"
              value={systemInput}
              onChange={(e) => setSystemInput(e.target.value)}
              style={inputStyle}
            />
      
            <input
              placeholder="Medication (e.g. Metformin 500mg)"
              value={medInput}
              onChange={(e) => setMedInput(e.target.value)}
              style={inputStyle}
            />
          
          <p style={{
  color: "#94a3b8",
  fontSize: "12px",
  marginTop: "10px",
  marginBottom: "4px",
  letterSpacing: "1px",
  textTransform: "uppercase"
}}>
  Last Updated
</p>
          <input
  type="date"
  value={lastUpdated}
  onChange={(e) => setLastUpdated(e.target.value)}
  style={{
    ...inputStyle,
    color: "#e2e8f0",
WebkitTextFillColor: "#e2e8f0",
opacity: 1// 🔥 placeholder-like color
  }}
/>
<select
  value={reliability}
  onChange={(e) => setReliability(e.target.value)}
  style={{
    ...inputStyle,
    color: "#e2e8f0",
opacity: 1,
appearance: "none",
WebkitAppearance: "none",
MozAppearance: "none"// 🔥 placeholder effect
  }}
>
  <option value="">Select Reliability</option>
  <option value="high">High</option>
  <option value="medium">Medium</option>
  <option value="low">Low</option>
</select>
           
            <button
              onClick={() => {
                if (!medInput || !reliability) {
                  alert("Please enter medication and select reliability");
                  return;
                }
              
                setSources([
                  ...sources,
                  {
                    system: systemInput || "Unknown",
                    medication: medInput,
                    last_updated: lastUpdated || new Date().toISOString(), // ✅ FIXED
                    source_reliability: reliability
                  }
                ]);
              
                setMedInput("");
                setSystemInput("");
                setLastUpdated(""); // ✅ RESET DATE
                setReliability(""); // ✅ RESET DROPDOWN
              }}


              style={btnBlue}
            >
              Add Medication
            </button>
      
            {sources.map((s, i) => (
              <div key={i} style={tagStyle}>
                {s.system} → {s.medication}
              </div>
            ))}
          </div>
        </>
      )}


    {/* 🔥 GLOBAL BUTTON */}
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button onClick={handleReconcile} style={btnBlue}>
        Run Reconciliation
      </button>
    </div>

    {/* 🔥 RESULT */}
   

    {/* 🔥 RESULT */}
{result && resultMode === inputMode && (
  <>
    {/* 1️⃣ SOURCES */}
    

    {/* 🔥 2️⃣ AI REASONING (MOVE HERE) */}
   {/* 🔥 2️⃣ AI REASONING */}
   <p style={{
  color: "#94a3b8",
  fontSize: "13px",
  marginTop: "10px",
  marginBottom: "5px",
  letterSpacing: "1px",
  textTransform: "uppercase"
}}>
  AI Reasoning
</p>

<div style={terminalBox}>
  {typedText}
</div>

    {/* 3️⃣ METRICS */}
    <div style={infoRow}>
      <div style={infoCard}>
        <p style={{ color: "#94a3b8" }}>Medication</p>
        <h3 style={{
  color:
    result.clinical_safety_check === "PASSED"
      ? "#22c55e"   // 🟢 safe
      : result.clinical_safety_check === "REJECTED"
      ? "#ef4444"   // 🔴 unsafe
      : "#f59e0b"   // 🟡 review
}}>
  {result.reconciled_medication}
</h3>
      </div>

      <div style={infoCard}>
        <p style={{ color: "#94a3b8" }}>Confidence</p>
        <h3 style={{
  fontSize: "17px",
  fontWeight: "500",
  marginTop: "5px",
  color:
    result.confidence_score * 100 > 80
      ? "#22c55e"   // 🟢 green
      : result.confidence_score * 100 > 60
      ? "#f59e0b"   // 🟡 yellow
      : "#ef4444"   // 🔴 red
}}>
  {(result.confidence_score * 100).toFixed(0)}%
</h3>
      </div>

      <div style={infoCard}>
        <p style={{ color: "#94a3b8" }}>Safety</p>
        <h3
  style={{
    color:
      result.clinical_safety_check === "PASSED"
        ? "#22c55e"
        : result.clinical_safety_check === "REJECTED"
        ? "#ef4444"
        : "#f59e0b"
  }}
>
  {
    result.clinical_safety_check === "PASSED"
      ? "APPROVED"
      : result.clinical_safety_check === "REVIEW"
      ? "⚠️ Manual Review Required"
      : result.clinical_safety_check
  }
</h3>
      </div>
    </div>

        <button onClick={() => handleDecision("approved")} style={approveBtn}>
          Approve
        </button>

        <button onClick={() => handleDecision("rejected")} style={rejectBtn}>
          Reject
        </button>

        {result.recommended_actions && (
 <div style={{ ...card, padding: "12px" }}>
    <h3 style={{
  fontSize: "16px",
  fontWeight: "500",
  color: "#e2e8f0",
  marginBottom: "8px"
}}>
  Recommended Actions
</h3>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
  {result.recommended_actions.map((action, i) => (
    <span key={i} style={tagStyle}>
      {action}
    </span>
  ))}
</div>
  </div>
)}
      </>
    )}
  </>
)}
{activeView === "dashboard" && (
  <div style={card}>
   <h2 style={{
  fontSize: "24px",
  fontWeight: "600",
  color: "#e2e8f0",
  marginBottom: "20px",
  letterSpacing: "0.5px"
}}>
  Overview
</h2>

    <div style={metricsRow}>
      <div style={metricCard}>

      <p style={{
  fontSize: "12px",
  color: "#94a3b8",
  marginBottom: "6px",
  letterSpacing: "1px",
  textTransform: "uppercase",
}}>
  Confidence
</p>

<h2 style={metricValue("#38bdf8")}>
  {result
    ? (result.confidence_score * 100).toFixed(0) + "%"
    : "--"}
</h2>

      </div>

      <div style={metricCard}>
      <p style={{
  fontSize: "12px",
  color: "#94a3b8",
  marginBottom: "6px",
  letterSpacing: "1px",
  textTransform: "uppercase",
}}>
  Data Score
</p>
<h2 style={metricValue("#22c55e")}>
  {quality ? quality.overall_score + "%" : "--"}
</h2>
      </div>

      <div style={metricCard}>
      <p style={{
  fontSize: "12px",
  color: "#94a3b8",
  marginBottom: "6px",
  letterSpacing: "1px",
  textTransform: "uppercase",
}}>
  Last Decision
</p>
        <h2 style={metricValue(
  decision === "approved"
    ? "#22c55e"
    : decision === "rejected"
    ? "#ef4444"
    : "#94a3b8"
)}>
  {decision || "--"}
</h2>
      </div>
    </div>

    <p style={{ marginTop: "20px", color: "#94a3b8" }}>
      Use the tabs above to run reconciliation or validate data
    </p>
  </div>
)}

   {/* 🔥 QUALITY ONLY */}
{activeView === "quality" && (
  <div style={card}>

    {/* 🔵 SELECT TEST CASE */}
    <div style={card}>
      <h3>Select Test Case</h3>

      <select
  onChange={(e) => setSelectedTest(e.target.value)}
  style={inputStyle}
>
  <option value="">Select test case</option>
  <option value="spec">Spec Test Case</option>
  <option value="good">Good Patient</option>
</select>

      {/* ✅ SHOW ONLY AFTER SELECT */}
      {selectedTest && (
        <>
          {/* 🔥 DATA DISPLAY */}
          <div style={{ marginTop: "15px" }}>
            <div style={infoLine}>

              {/* COLUMN 1 */}
              <span>
                Name: {selectedDataQuality.demographics.name}<br />
                DOB: {selectedDataQuality.demographics.dob}<br />
                Gender: {selectedDataQuality.demographics.gender}
              </span>

              {/* COLUMN 2 */}
              <span>
                Condition: {selectedDataQuality.conditions.join(", ")}<br />
                Medications: {selectedDataQuality.medications.join(", ")}<br />
                Allergies: {selectedDataQuality.allergies.length === 0 ? "None" : "Present"}
              </span>

              {/* COLUMN 3 */}
              <span>
  BP: {selectedDataQuality.vital_signs.blood_pressure}<br />
  Heart Rate: {selectedDataQuality.vital_signs.heart_rate}<br />
  Last Updated: {selectedDataQuality.last_updated}
</span>

            </div>
          </div>

          {/* 🔥 VALIDATE BUTTON */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleValidate}
              style={btnGreen}
              disabled={loading}
            >
              {loading ? "Processing..." : "Validate Data"}
            </button>
          </div>

          {/* 🔥 RESULTS */}
          {quality && (
            <>
              <div style={infoRow}>
                <div style={infoCard}>
                  <p style={{ color: "#94a3b8", fontSize: "13px" }}>Overall</p>
                  <h3 style={{ color: "#22c55e" }}>
                    {quality.overall_score}%
                  </h3>
                </div>

                <div style={infoCard}>
                  <p style={{ color: "#94a3b8", fontSize: "13px" }}>Completeness</p>
                  <h3 style={{ color: getScoreColor(quality.breakdown.completeness) }}>
  {quality.breakdown.completeness}
</h3>
                </div>

                <div style={infoCard}>
                  <p style={{ color: "#94a3b8", fontSize: "13px" }}>Accuracy</p>
                  <h3 style={{
  fontSize: "17px",
  fontWeight: "500",
  color: getScoreColor(quality.breakdown.accuracy)
}}>
  {quality.breakdown.accuracy}
</h3>
                </div>

                <div style={infoCard}>
                  <p style={{ color: "#94a3b8", fontSize: "13px" }}>Timeliness</p>
                  <h3 style={{
  fontSize: "17px",
  fontWeight: "500",
  color: getScoreColor(quality.breakdown.timeliness)
}}>
  {quality.breakdown.timeliness}
</h3>
                </div>

                <div style={infoCard}>
                  <p style={{ color: "#94a3b8", fontSize: "13px" }}>Plausibility</p>
                  <h3 style={{
  fontSize: "17px",
  fontWeight: "500",
  color: getScoreColor(quality.breakdown.clinical_plausibility)
}}>
  {quality.breakdown.clinical_plausibility}
</h3>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
              <h4 style={{
  marginBottom: "10px",
  fontSize: "16px",
  color: "#e2e8f0",
  letterSpacing: "1px",
  textTransform: "uppercase"
}}>
  Issues Detected
</h4>

{quality.issues_detected.length === 0 ? (

<div style={{
  background: "rgba(34,197,94,0.15)",
  border: "1px solid #22c55e",
  borderRadius: "10px",
  padding: "12px",
  color: "#22c55e",
  fontSize: "15px",
  fontWeight: "500"
}}>
  ✅ All checks passed — no issues detected
</div>

) : (

quality.issues_detected.map((issue, i) => {
  const severity = issue.severity.toLowerCase();

  const bg =
    severity === "high"
      ? "rgba(239,68,68,0.15)"
      : severity === "medium"
      ? "rgba(245,158,11,0.15)"
      : "rgba(148,163,184,0.15)";

  const color =
    severity === "high"
      ? "#ef4444"
      : severity === "medium"
      ? "#f59e0b"
      : "#94a3b8";

  return (
    <div
      key={i}
      style={{
        background: bg,
        border: `1px solid ${color}`,
        borderRadius: "10px",
        padding: "10px 12px",
        marginBottom: "10px",
      }}
    >
      <strong style={{ color }}>
        {severity === "high"
          ? "🚨 HIGH"
          : severity === "medium"
          ? "⚠️ MEDIUM"
          : "ℹ️ LOW"}
      </strong>

      <div style={{
        marginTop: "6px",
        color: "#e2e8f0",
        fontSize: "14px",
        lineHeight: "1.5"
      }}>
        <strong style={{ textTransform: "capitalize" }}>
          {issue.field.replaceAll("_", " ").replaceAll(".", " → ")}
        </strong>
        : {issue.issue}
      </div>
    </div>
  );
})

)}
              </div>
            </>
          )}
        </>
      )}

    </div>

  </div>
)}

 {/* 🔥 HISTORY TOGGLE */}
       
        {activeView === "history" && (
 <div
 style={{
   ...card,
   boxShadow:
     hoveredCard === "history"
       ? "0 0 30px rgba(56,189,248,0.4)"
       : card.boxShadow,
   transform: hoveredCard === "history" ? "translateY(-5px)" : "none",
 }}
 onMouseEnter={() => setHoveredCard("history")}
 onMouseLeave={() => setHoveredCard(null)}
>
<h2 style={{
  fontSize: "18px",
  fontWeight: "600",
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "#e2e8f0",
  marginBottom: "15px"
}}>
  Recent Activity
</h2>

<div style={historyBox}>
  {history.length === 0 ? (
    <p style={{ color: "#94a3b8" }}>No history yet</p>
  ) : (
    history.map((h, i) => (
      <div
        key={i}
        style={{
          background: "rgba(15,23,42,0.9)",
          border: "1px solid rgba(56,189,248,0.2)",
          borderRadius: "10px",
          padding: "12px 15px",
          marginBottom: "10px",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          boxShadow: "0 0 10px rgba(56,189,248,0.1)",
        }}
      >
       {/* LEFT */}
<div>
  <div style={{
    fontSize: "17px",
    fontWeight: "600",
    color: "#e2e8f0"
  }}>
    {h.patient}
  </div>

  <div style={{
    fontSize: "15px",         // 🔥 bigger
    color: "#cbd5f5",         // 🔥 brighter
    marginTop: "4px"
  }}>
    {h.medication}
  </div>
</div>

{/* RIGHT */}
<div style={{ textAlign: "right" }}>
  <div style={{
    fontSize: "16px",         // 🔥 bigger
    fontWeight: "700",
    letterSpacing: "1px",
    color:
      h.decision === "approved"
        ? "#22c55e"
        : h.decision === "rejected"
        ? "#ef4444"
        : "#f59e0b"
  }}>
    {h.decision.toUpperCase()}
  </div>

  <div style={{
    fontSize: "13px",         // 🔥 bigger
    color: "#94a3b8",
    marginTop: "4px"
  }}>
    {h.time}
  </div>
</div>
      </div>
    ))
  )}
</div>


  </div>
)}

      </div>
    </div>
  );
}

/* STYLES */
const header = {
  background: "#0f172a",
  color: "white",
  padding: "20px",
};

const card = {
  background: "rgba(15, 23, 42, 0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(56,189,248,0.2)",
  padding: "20px",
  borderRadius: "14px",
  marginBottom: "20px",
  color: "white",
  transition: "all 0.3s ease",
  boxShadow: "0 0 20px rgba(56,189,248,0.08)",
};

const darkCard = {
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  color: "white",
  boxShadow: "0 0 25px rgba(56,189,248,0.15)",
};

const btnBlue = {
  marginRight: "10px",
  background: "#2563eb",
  color: "white",
  padding: "10px",
};

const btnGreen = {
  background: "#16a34a",
  color: "white",
  padding: "10px",
};

const approveBtn = {
  marginRight: "10px",
  background: "#16a34a",
  color: "white",
  padding: "8px",
};

const rejectBtn = {
  background: "#dc2626",
  color: "white",
  padding: "8px",
};

const box = {
  background: "#f1f5f9",
  padding: "10px",
  marginTop: "10px",
};
const logItem = {
  padding: "10px 0",
};
const navBar = {
  display: "flex",
  justifyContent: "center",
  gap: "40px",
  background: "#0f172a",
  padding: "12px",
  color: "white",
  marginBottom: "20px",
};

const navItem = (active, hovered) => ({
  cursor: "pointer",
  padding: "10px 20px",
  fontSize: "18px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  fontWeight: "600",
  borderBottom: active ? "3px solid #38bdf8" : "none",
  color: active ? "#38bdf8" : hovered ? "#60a5fa" : "#94a3b8",
  transition: "all 0.3s ease",

  textShadow:
    active || hovered
      ? "0 0 12px rgba(56,189,248,0.9)"
      : "none",
});

const metricsRow = {
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
};

const metricCard = {
  flex: 1,
  background: "rgba(15, 23, 42, 0.9)",
  border: "1px solid rgba(56,189,248,0.3)",
  padding: "25px",
  borderRadius: "14px",
  textAlign: "center",
  color: "white",

  // 🔥 NEW
  boxShadow: "0 0 20px rgba(56,189,248,0.15)",
};

const toast = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#0f172a",
  color: "white",
  padding: "12px 20px",
  borderRadius: "8px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  zIndex: 1000,
};
const historyBox = {
  maxHeight: "300px",      // 🔥 fixed size like NASA
  overflowY: "auto",       // 🔥 scroll inside
  paddingRight: "10px",
};

const historyItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "10px",
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(56,189,248,0.15)",
  transition: "all 0.3s ease",
};

const appBackground = {
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 20% 20%, rgba(56,189,248,0.15), transparent),
    radial-gradient(circle at 80% 0%, rgba(99,102,241,0.15), transparent),
    #020617
  `,
  color: "white",
};

const selectDark = {
  marginLeft: "10px",
  padding: "8px",
  background: "#020617",
  color: "white",
  border: "1px solid #38bdf8",
  borderRadius: "6px",
};

const title = {
  fontSize: "32px",
  fontWeight: "700",
  background: "linear-gradient(90deg, #38bdf8, #60a5fa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 0 20px rgba(56,189,248,0.5)",
};

const terminalBox = {
  background: "rgba(15,23,42,0.9)",
  color: "#38bdf8",
  padding: "15px",
  borderRadius: "8px",
  marginTop: "10px",
  fontFamily: "monospace",
  fontSize: "14px",
  lineHeight: "1.6",
  boxShadow: "0 0 20px rgba(56,189,248,0.2)",
  border: "1px solid rgba(56,189,248,0.2)",
  minHeight: "80px",
};

const cursor = {
  display: "inline-block",
  marginLeft: "3px",
  animation: "blink 1s infinite",
};

const infoRow = {
  display: "flex",
  gap: "15px",
  marginTop: "15px",
  flexWrap: "wrap",
};

const infoCard = {
  flex: "1",
  minWidth: "150px",
  background: "rgba(15,23,42,0.9)",
  border: "1px solid rgba(56,189,248,0.2)",
  borderRadius: "10px",
  padding: "12px",
  textAlign: "center",
  boxShadow: "0 0 10px rgba(56,189,248,0.1)",
};

const inputStyle = {
  display: "block",
  margin: "8px 0",
  padding: "10px",
  width: "100%",
  background: "#020617",
  color: "#e2e8f0",        // softer white (matches placeholders)
  border: "1px solid #38bdf8",
  borderRadius: "6px",

  fontSize: "14px",        // 🔥 THIS is what you were asking
  fontWeight: "400",       // 🔥 makes everything consistent
};

const tagStyle = {
  display: "inline-block",
  margin: "3px",
  padding: "6px 10px",   // 🔥 bigger
  background: "#1e293b",
  borderRadius: "8px",
  fontSize: "13px",     // 🔥 bigger text
  color: "#e2e8f0",
  lineHeight: "1.4",
  fontWeight: "500"
};

const sectionTitle = {
  fontSize: "22px",
  fontWeight: "600",
  marginBottom: "15px",
  color: "#e2e8f0",
  letterSpacing: "0.5px",
};

const toggleContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  background: "rgba(15,23,42,0.6)",
  padding: "6px",
  borderRadius: "10px",
  width: "fit-content",
  margin: "0 auto",
  border: "1px solid rgba(56,189,248,0.2)",
};

const toggleBtn = (active) => ({
  padding: "12px 22px",
  borderRadius: "10px",
  border: active
    ? "1px solid rgba(56,189,248,0.9)"
    : "1px solid rgba(148,163,184,0.4)",

  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  transition: "all 0.25s ease",

  background: active
    ? "linear-gradient(90deg, #38bdf8, #60a5fa)"
    : "rgba(15,23,42,0.6)",   // 🔥 was transparent → now visible

  color: active ? "#020617" : "#e2e8f0", // 🔥 brighter text

  boxShadow: active
    ? "0 0 15px rgba(56,189,248,0.7)"
    : "0 0 8px rgba(56,189,248,0.15)",  // 🔥 subtle glow always

  opacity: 1,   // 🔥 remove fading
});
const metricValue = (color) => ({
  fontSize: "22px",
  fontWeight: "600",
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: color,
});

const infoLine = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)", // 🔥 3 columns
  gap: "10px 30px",
  marginTop: "10px",
  color: "#94a3b8",
  fontSize: "14px",
};



const threeColGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "40px",
  marginTop: "10px",
  fontSize: "14px",
  lineHeight: "1.6",
};

const columnWithDivider = {
  borderRight: "1px solid rgba(56,189,248,0.25)",
  paddingRight: "25px",
};

const columnTitle = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
  color: "#38bdf8",
  letterSpacing: "0.5px",
};

const infoText = {
  fontSize: "14px",
  color: "#94a3b8",
  marginBottom: "6px",
};

const label = {
  color: "#e2e8f0",
  fontWeight: "500",
  marginRight: "5px",
};
export default App;