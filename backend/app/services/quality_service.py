from datetime import datetime


def evaluate_data_quality(data):
    issues = []

    # -------- Completeness --------
    completeness_score = 100

    if not data.allergies:
        issues.append({
            "field": "allergies",
            "issue": "Missing allergy information",
            "severity": "medium"
        })
        completeness_score -= 20

    # -------- Clinical Plausibility --------
    plausibility_score = 100

    bp = data.vital_signs.get("blood_pressure")
    if bp:
        try:
            systolic, diastolic = map(int, bp.split("/"))
            if systolic > 250 or diastolic > 150:
                issues.append({
                    "field": "blood_pressure",
                    "issue": "Implausible blood pressure value",
                    "severity": "high"
                })
                plausibility_score -= 50
        except:
            pass

    # -------- Timeliness --------
    timeliness_score = 100

    try:
        last_updated = datetime.strptime(data.last_updated, "%Y-%m-%d")
        days_old = (datetime.now() - last_updated).days

        if days_old > 180:
            issues.append({
                "field": "last_updated",
                "issue": "Data is outdated",
                "severity": "medium"
            })
            timeliness_score -= 30
    except:
        pass

    # -------- Accuracy --------
    accuracy_score = 90

    # -------- Final Score --------
    overall_score = int(
        (completeness_score +
         plausibility_score +
         timeliness_score +
         accuracy_score) / 4
    )

    return {
        "overall_score": overall_score,
        "breakdown": {
            "completeness": completeness_score,
            "accuracy": accuracy_score,
            "timeliness": timeliness_score,
            "clinical_plausibility": plausibility_score
        },
        "issues_detected": issues
    }