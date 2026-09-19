from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SnapCircuit Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    scenario_id: str

class Diagnosis(BaseModel):
    possible_fault: str
    why: str
    next_step: str

class AnalyzeResponse(BaseModel):
    status: str
    diagnosis: Diagnosis

scenarios = {
    "correct_led": Diagnosis(
        possible_fault="No fault found.",
        why="Polarity, series resistor and closed path all pass.",
        next_step="None required."
    ),
    "reversed_led": Diagnosis(
        possible_fault="LED polarity appears inconsistent.",
        why="Observed LED orientation conflicts with the expected circuit configuration.",
        next_step="Reverse the LED orientation and test again."
    ),
    "missing_resistor": Diagnosis(
        possible_fault="LED current is not limited; possible overcurrent.",
        why="LED and source found, but no series resistor in the loop.",
        next_step="Add a series resistor sized for the supply and LED."
    ),
    "open_connection": Diagnosis(
        possible_fault="No complete current path; LED stays off.",
        why="A break was located between two nodes. Closed-path rule fails.",
        next_step="Reconnect the open link and check the joint."
    )
}

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_circuit(request: AnalyzeRequest):
    diagnosis = scenarios.get(request.scenario_id, scenarios["correct_led"])
    return AnalyzeResponse(
        status="success",
        diagnosis=diagnosis
    )

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
