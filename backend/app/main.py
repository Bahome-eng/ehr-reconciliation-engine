from dotenv import load_dotenv
import os

load_dotenv()

#api_key = os.getenv("OPENAI_API_KEY")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.reconcile import router as reconcile_router
from app.routes.data_quality import router as data_quality_router


app = FastAPI()

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(reconcile_router)
app.include_router(data_quality_router)


@app.get("/")
def root():
    return {"message": "EHR Reconciliation API running"}