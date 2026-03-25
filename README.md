# 🏥 MedSync: Clinical Data Reconciliation Engine

A full-stack clinical decision support system that **resolves conflicting medication records** and **validates patient data quality** using rule-based logic and AI-assisted reasoning.

---

## 🚀 Project Overview

Modern healthcare systems often contain **inconsistent, outdated, or conflicting patient data** across multiple sources (EHR, pharmacy, primary care systems).

**MedSync** addresses this challenge by:

* ⚖️ Reconciling conflicting medication records
* 🧹 Validating data quality before decision-making
* 🤖 Providing AI-generated reasoning for transparency
* 📊 Delivering a clean, clinician-friendly dashboard

The system prioritizes **safety, explainability, and real-world clinical workflows**.

---

## ✨ Core Features

### 🧠 Medication Reconciliation

* Accepts multiple conflicting medication sources
* Uses:

  * Source reliability
  * Recency of records
  * Clinical context (e.g., conditions, labs)
* Outputs:

  * Reconciled medication
  * Confidence score
  * Clinical safety classification (`PASSED`, `REVIEW`, `REJECTED`)
  * AI-generated reasoning
  * Recommended actions

---

### 📊 Data Quality Validation

* Evaluates patient records across:

  * Completeness
  * Accuracy
  * Timeliness
  * Clinical plausibility
* Detects issues such as:

  * Missing allergies
  * Implausible vitals (e.g., BP 340/180)
  * Outdated records
* Returns:

  * Overall score (0–100)
  * Detailed breakdown
  * Issues with severity levels

---

### 🤖 AI-Powered Reasoning

* Generates explanations for decisions
* Considers:

  * Patient conditions
  * Medication appropriateness
  * Source credibility
* Enhances **trust and interpretability** in clinical decision-making

---

### 🖥 Interactive Dashboard

* Clean, modern UI optimized for clinician workflows
* Highlights:

  * Confidence levels
  * Safety status
  * Recommended actions
* Supports:

  * Quick-select scenarios
  * Manual input
  * Decision approval/rejection

---

## 🛠 Tech Stack

### Backend

* **FastAPI** (Python)
* **Pydantic** (data validation)
* **Uvicorn**

### Frontend

* **React**
* Custom styling (clarity-focused UI)

### AI Integration

* **OpenAI API** (clinical reasoning layer)

---

## 📂 Project Structure

```
ehr-reconciliation-engine/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│
└── README.md
```

---

## 🔐 Environment Setup

Create a `.env` file inside the `backend/` directory:

```
OPENAI_API_KEY=your_api_key_here
```

⚠️ **Important:**

* Never commit your `.env` file
* Always keep API keys secure

---

## ▶️ Running Locally

### Backend

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend

```
cd frontend
npm install
npm start
```

---

## 🔌 API Endpoints

### 1️⃣ Reconcile Medication

`POST /api/reconcile/medication`

Returns:

* `reconciled_medication`
* `confidence_score`
* `reasoning`
* `recommended_actions`
* `clinical_safety_check`

---

### 2️⃣ Validate Data Quality

`POST /api/validate/data-quality`

Returns:

* `overall_score`
* `breakdown`
* `issues_detected`

---

## 🧪 Example Scenarios

### 🔴 Conflicting Case

* Multiple sources with different dosages
* Output:

  * Safety → `REVIEW`
  * Recommended actions → manual verification

---

### 🟢 Clean Case

* All sources agree
* Output:

  * Safety → `PASSED`
  * High confidence

---

## 🧠 Key Design Decisions

* Combined **recency + reliability scoring**
* Prioritized **explainability over black-box AI**
* Separated:

  * Data validation
  * Decision logic
* Designed UI for **minimal cognitive load**
* Implemented **safety-first decision handling**

---

## 🚀 Future Improvements

* Authentication system
* Database integration (PostgreSQL)
* Deployment pipeline (Docker + cloud hosting)
* Enhanced AI prompt optimization
* FHIR/HL7 integration

---

## 👤 Author

**Bahome Seraphin**
Computer Science @ Elmhurst University
GitHub: https://github.com/Bahome-eng

---

## 📄 License

This project is for educational and demonstration purposes.
# 🏥 MedSync: Clinical Data Reconciliation Engine

A full-stack clinical decision support system that **resolves conflicting medication records** and **validates patient data quality** using rule-based logic and AI-assisted reasoning.

---

## 🚀 Project Overview

Modern healthcare systems often contain **inconsistent, outdated, or conflicting patient data** across multiple sources (EHR, pharmacy, primary care systems).

**MedSync** addresses this challenge by:

* ⚖️ Reconciling conflicting medication records
* 🧹 Validating data quality before decision-making
* 🤖 Providing AI-generated reasoning for transparency
* 📊 Delivering a clean, clinician-friendly dashboard

The system prioritizes **safety, explainability, and real-world clinical workflows**.

---

## ✨ Core Features

### 🧠 Medication Reconciliation

* Accepts multiple conflicting medication sources
* Uses:

  * Source reliability
  * Recency of records
  * Clinical context (e.g., conditions, labs)
* Outputs:

  * Reconciled medication
  * Confidence score
  * Clinical safety classification (`PASSED`, `REVIEW`, `REJECTED`)
  * AI-generated reasoning
  * Recommended actions

---

### 📊 Data Quality Validation

* Evaluates patient records across:

  * Completeness
  * Accuracy
  * Timeliness
  * Clinical plausibility
* Detects issues such as:

  * Missing allergies
  * Implausible vitals (e.g., BP 340/180)
  * Outdated records
* Returns:

  * Overall score (0–100)
  * Detailed breakdown
  * Issues with severity levels

---

### 🤖 AI-Powered Reasoning

* Generates explanations for decisions
* Considers:

  * Patient conditions
  * Medication appropriateness
  * Source credibility
* Enhances **trust and interpretability** in clinical decision-making

---

### 🖥 Interactive Dashboard

* Clean, modern UI optimized for clinician workflows
* Highlights:

  * Confidence levels
  * Safety status
  * Recommended actions
* Supports:

  * Quick-select scenarios
  * Manual input
  * Decision approval/rejection

---

## 🛠 Tech Stack

### Backend

* **FastAPI** (Python)
* **Pydantic** (data validation)
* **Uvicorn**

### Frontend

* **React**
* Custom styling (clarity-focused UI)

### AI Integration

* **OpenAI API** (clinical reasoning layer)

---

## 📂 Project Structure

```
ehr-reconciliation-engine/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│
└── README.md
```

---

## 🔐 Environment Setup

Create a `.env` file inside the `backend/` directory:

```
OPENAI_API_KEY=your_api_key_here
```

⚠️ **Important:**

* Never commit your `.env` file
* Always keep API keys secure

---

## ▶️ Running Locally

### Backend

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend

```
cd frontend
npm install
npm start
```

---

## 🔌 API Endpoints

### 1️⃣ Reconcile Medication

`POST /api/reconcile/medication`

Returns:

* `reconciled_medication`
* `confidence_score`
* `reasoning`
* `recommended_actions`
* `clinical_safety_check`

---

### 2️⃣ Validate Data Quality

`POST /api/validate/data-quality`

Returns:

* `overall_score`
* `breakdown`
* `issues_detected`

---

## 🧪 Example Scenarios

### 🔴 Conflicting Case

* Multiple sources with different dosages
* Output:

  * Safety → `REVIEW`
  * Recommended actions → manual verification

---

### 🟢 Clean Case

* All sources agree
* Output:

  * Safety → `PASSED`
  * High confidence

---

## 🧠 Key Design Decisions

* Combined **recency + reliability scoring**
* Prioritized **explainability over black-box AI**
* Separated:

  * Data validation
  * Decision logic
* Designed UI for **minimal cognitive load**
* Implemented **safety-first decision handling**

---

## 🚀 Future Improvements

* Authentication system
* Database integration (PostgreSQL)
* Deployment pipeline (Docker + cloud hosting)
* Enhanced AI prompt optimization
* FHIR/HL7 integration

---

## 👤 Author

**Bahome Seraphin**

