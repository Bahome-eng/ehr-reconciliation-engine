from collections import Counter
import re

def reconcile_medication(data):
    sources = data.get("sources", [])
    patient = data.get("patient_context", {})

    meds = [s.get("medication", "") for s in sources]

    # 🔥 Extract dosage (simple AI logic)
    def extract_dose(med):
        match = re.search(r'(\d+)', med)
        return int(match.group()) if match else 0

    doses = [extract_dose(m) for m in meds]

    # 🔥 Extract medication names
    med_names = [m.split()[0] if m else "" for m in meds]

    most_common = Counter(med_names).most_common(1)[0][0] if med_names else "Unknown"
    final_dose = max(doses) if doses else 0

    reconciled_med = f"{most_common} {final_dose}mg"

    # 🔥 Confidence logic
    unique_meds = len(set(meds))
    if unique_meds == 1:
        confidence = 0.95
    elif unique_meds == 2:
        confidence = 0.75
    else:
        confidence = 0.5

    # 🔥 Safety + actions
    safety = "PASSED"
    actions = []

    age = patient.get("age", 0)
    conditions = [c.lower() for c in patient.get("conditions", [])]

    if final_dose > 1000:
        safety = "REVIEW"
        actions.append("High dosage detected — verify with provider")

    if age > 70 and final_dose > 500:
        safety = "REVIEW"
        actions.append("Elderly patient — consider dose reduction")

    if "diabetes" in conditions:
        actions.append("Monitor blood glucose levels")

    if unique_meds >= 3:
        safety = "FAILED"
        actions.append("Multiple conflicting sources — manual review required")

    return {
        "reconciled_medication": reconciled_med,
        "confidence_score": round(confidence, 2),
        "clinical_safety_check": safety,
        "reasoning": f"Analyzed {len(sources)} sources. Selected most frequent medication and highest dose.",
        "recommended_actions": actions,
    }