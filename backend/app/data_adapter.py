# data_adapter.py

import requests

API_URL = "http://127.0.0.1:8000/api/reconcile/medication"


def convert_pyhealth_to_api(events):
    """
    Convert PyHealth-style events to API format
    """

    sources = []

    for e in events:
        if e.get("table") == "PRESCRIPTIONS":  # only meds

            medication = e.get("code", "Unknown")
            dosage = e.get("dosage", "")

            full_med = f"{medication} {dosage}".strip()

            sources.append({
                "source": "ehr",
                "system": "PyHealth",
                "medication": full_med,
                "last_updated": "2024-01-01",
                "source_reliability": 0.9
            })

    return {
        "patient_context": {
            "age": 65,
            "conditions": ["diabetes"],
            "recent_labs": []
        },
        "sources": sources
    }


def send_to_api(payload):
    response = requests.post(API_URL, json=payload)
    return response.json()


if __name__ == "__main__":

    # 🔥 Simulated PyHealth-style data
    events = [
        {
            "code": "Metformin",
            "table": "PRESCRIPTIONS",
            "dosage": "500mg"
        },
        {
            "code": "Insulin",
            "table": "PRESCRIPTIONS",
            "dosage": "10 units"
        }
    ]

    payload = convert_pyhealth_to_api(events)

    print("=== Converted Payload ===")
    print(payload)

    result = send_to_api(payload)

    print("\n=== API Response ===")
    print(result)