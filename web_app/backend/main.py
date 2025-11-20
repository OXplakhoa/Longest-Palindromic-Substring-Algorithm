from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import os

# Add parent directory to path to import original algorithms
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../algorithms')))

try:
    import brute_force
    import expand_center
    import dynamic_programming
    import manacher
except ImportError:
    print("Error importing algorithms")

from algorithms_trace import trace_brute_force, trace_expand_center, trace_dynamic_programming, trace_manacher

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
MAX_VISUALIZATION_LEN_SLOW = 100
MAX_VISUALIZATION_LEN_FAST = 1000

class VisualizeRequest(BaseModel):
    text: str
    algorithm: str

class BenchmarkRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Palindrome Visualizer API is running"}

@app.post("/visualize")
def visualize(request: VisualizeRequest):
    text = request.text
    algo = request.algorithm
    n = len(text)

    # Validation
    if algo in ["brute_force", "dynamic_programming"]:
        if n > MAX_VISUALIZATION_LEN_SLOW:
            raise HTTPException(status_code=400, detail=f"Text too long for {algo}. Max length is {MAX_VISUALIZATION_LEN_SLOW}.")
    elif n > MAX_VISUALIZATION_LEN_FAST:
        raise HTTPException(status_code=400, detail=f"Text too long. Max length is {MAX_VISUALIZATION_LEN_FAST}.")

    steps = []
    
    if algo == "brute_force":
        steps = list(trace_brute_force(text))
    elif algo == "expand_center":
        steps = list(trace_expand_center(text))
    elif algo == "dynamic_programming":
        steps = list(trace_dynamic_programming(text))
    elif algo == "manacher":
        steps = list(trace_manacher(text))
    else:
        raise HTTPException(status_code=400, detail="Unknown algorithm")
    
    return steps

@app.post("/benchmark")
def benchmark(request: BenchmarkRequest):
    text = request.text
    results = {}
    
    # Brute Force
    if len(text) <= MAX_VISUALIZATION_LEN_SLOW:
        start = time.time()
        brute_force.longest_palindrome(text)
        results["brute_force"] = (time.time() - start) * 1000 # ms
    else:
        results["brute_force"] = None # Too slow

    # DP
    if len(text) <= MAX_VISUALIZATION_LEN_SLOW * 2: 
        start = time.time()
        dynamic_programming.longest_palindrome(text)
        results["dynamic_programming"] = (time.time() - start) * 1000
    else:
        results["dynamic_programming"] = None

    # Expand Center
    start = time.time()
    expand_center.longest_palindrome(text)
    results["expand_center"] = (time.time() - start) * 1000

    # Manacher
    start = time.time()
    manacher.longest_palindrome(text)
    results["manacher"] = (time.time() - start) * 1000
    
    return results
