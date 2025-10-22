"""
FastAPI backend for TeachCertPro integration.
Serves data from Python pipelines to Next.js frontend.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import sqlite3
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="TeachCertPro API",
    description="API for Teacher Certification Objectives Database",
    version="1.0.0"
)

# CORS middleware for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Objective(BaseModel):
    index: int
    text: str
    evidence_url: Optional[str] = None
    is_inferred: bool
    confidence: float
    rationale: str
    validation_status: str

class TestInfo(BaseModel):
    test_name: str
    test_code: Optional[str] = None
    test_system: str
    subject_area: str
    grade_band: str
    provider: str
    official_source_url: Optional[str] = None
    source_last_updated: Optional[str] = None
    scraped_at: str

class StateTestData(BaseModel):
    state: str
    test: TestInfo
    objectives: List[Objective]

class StateSummary(BaseModel):
    state: str
    abbreviation: str
    total_tests: int
    total_objectives: int
    average_confidence: float
    last_updated: str

# API Routes
@app.get("/")
async def root():
    return {"message": "TeachCertPro API is running"}

@app.get("/states", response_model=List[str])
async def get_states():
    """Get list of all available states."""
    try:
        data_dir = Path(__file__).parent.parent / "teacher_cert_objectives_db" / "data"
        if not data_dir.exists():
            logger.warning(f"Data directory not found: {data_dir}")
            return []

        state_files = list(data_dir.glob("*.jsonl"))
        states = [f.stem for f in state_files]
        return sorted(states)
    except Exception as e:
        logger.error(f"Error reading states: {e}")
        return []

@app.get("/states/{state_name}", response_model=List[StateTestData])
async def get_state_data(state_name: str):
    """Get all test data for a specific state."""
    try:
        data_file = Path(__file__).parent.parent / "teacher_cert_objectives_db" / "data" / f"{state_name}.jsonl"

        if not data_file.exists():
            raise HTTPException(status_code=404, detail=f"State {state_name} not found")

        test_data = []
        with open(data_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    data = json.loads(line)
                    test_data.append(StateTestData(**data))

        return test_data
    except Exception as e:
        logger.error(f"Error reading state data for {state_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/states/{state_name}/summary", response_model=StateSummary)
async def get_state_summary(state_name: str):
    """Get summary statistics for a state."""
    try:
        test_data = await get_state_data(state_name)

        total_tests = len(test_data)
        total_objectives = sum(len(test.objectives) for test in test_data)

        if total_objectives > 0:
            avg_confidence = sum(
                sum(obj.confidence for obj in test.objectives)
                for test in test_data
            ) / total_objectives
        else:
            avg_confidence = 0.0

        last_updated = max(
            test.test.scraped_at
            for test in test_data
            if test.test.scraped_at
        ) if test_data else ""

        return StateSummary(
            state=state_name,
            abbreviation=state_name[:2].upper(),
            total_tests=total_tests,
            total_objectives=total_objectives,
            average_confidence=round(avg_confidence, 2),
            last_updated=last_updated
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating summary for {state_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search_objectives(
    q: str,
    state: Optional[str] = None,
    subject: Optional[str] = None,
    min_confidence: Optional[float] = None
):
    """Search objectives across states with filters."""
    try:
        results = []
        states_to_search = [state] if state else await get_states()

        for state_name in states_to_search:
            try:
                state_data = await get_state_data(state_name)

                for test in state_data:
                    # Filter by subject if specified
                    if subject and subject.lower() not in test.test.subject_area.lower():
                        continue

                    # Filter objectives by search term and confidence
                    matching_objectives = []
                    for obj in test.objectives:
                        # Check confidence filter
                        if min_confidence and obj.confidence < min_confidence:
                            continue

                        # Check search term match
                        if q.lower() in obj.text.lower():
                            matching_objectives.append(obj)

                    if matching_objectives:
                        results.append({
                            "state": state_name,
                            "test": test.test.dict(),
                            "matching_objectives": [obj.dict() for obj in matching_objectives],
                            "match_count": len(matching_objectives)
                        })

            except HTTPException:
                # Skip states that don't exist
                continue

        # Sort by match count descending
        results.sort(key=lambda x: x["match_count"], reverse=True)

        return {
            "query": q,
            "filters": {"state": state, "subject": subject, "min_confidence": min_confidence},
            "total_results": len(results),
            "results": results
        }

    except Exception as e:
        logger.error(f"Error searching objectives: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/overview")
async def get_overview_stats():
    """Get overview statistics across all states."""
    try:
        states = await get_states()
        total_states = len(states)
        total_tests = 0
        total_objectives = 0
        all_confidences = []

        for state_name in states:
            try:
                test_data = await get_state_data(state_name)
                total_tests += len(test_data)

                for test in test_data:
                    total_objectives += len(test.objectives)
                    all_confidences.extend([obj.confidence for obj in test.objectives])

            except HTTPException:
                continue

        avg_confidence = sum(all_confidences) / len(all_confidences) if all_confidences else 0.0

        return {
            "total_states": total_states,
            "total_tests": total_tests,
            "total_objectives": total_objectives,
            "average_confidence": round(avg_confidence, 2),
            "data_quality_distribution": {
                "high_confidence (>0.8)": len([c for c in all_confidences if c > 0.8]),
                "medium_confidence (0.5-0.8)": len([c for c in all_confidences if 0.5 <= c <= 0.8]),
                "low_confidence (<0.5)": len([c for c in all_confidences if c < 0.5])
            }
        }

    except Exception as e:
        logger.error(f"Error generating overview stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)