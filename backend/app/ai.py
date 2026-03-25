from openai import OpenAI
import os

# Initialize client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# =========================
# 🔥 RECONCILIATION AI (EXPLAIN ONLY)
# =========================
def generate_reasoning(data, final_decision):
    # ✅ SAFE: no key → no cost
    if not os.getenv("OPENAI_API_KEY"):
        return "AI disabled. Using fallback reasoning."

    try:
        prompt = f"""
You are a clinical decision support AI.

The system has already made a decision.

FINAL DECISION:
- Selected Medication: {final_decision['medication']}
- Confidence: {final_decision['confidence']}
- Safety: {final_decision['safety']}

Patient Context:
- Age: {data['patient_context']['age']}
- Conditions: {data['patient_context']['conditions']}

Medication Sources:
{data['sources']}

IMPORTANT:
- DO NOT change the decision
- DO NOT infer a different medication
- ONLY explain WHY this decision was made

Focus on:
- Recency of sources
- Source reliability
- Clinical context (e.g., kidney function if relevant)

Format EXACTLY:

- Reason 1
- Reason 2
- Reason 3

Keep it concise.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Fallback reasoning (AI error: {str(e)})"


# =========================
# 🔥 DATA QUALITY AI
# =========================
def analyze_data_quality(data):
    # ✅ SAFE: no key → no cost
    if not os.getenv("OPENAI_API_KEY"):
        return "AI disabled. Using rule-based validation only."

    try:
        prompt = f"""
You are a clinical data quality AI.

Analyze this patient data and identify problems.

Data:
{data}

Tasks:
1. Detect inconsistencies
2. Identify missing or suspicious values
3. Flag clinically unsafe combinations
4. Explain clearly in bullet points

Format EXACTLY:

- Issue 1
- Issue 2
- Issue 3

Keep it concise.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=120,
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"AI error: {str(e)}"