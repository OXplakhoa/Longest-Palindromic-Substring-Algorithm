from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Palindrome Visualizer API is running"}

def test_visualize_brute_force():
    response = client.post("/visualize", json={"text": "aba", "algorithm": "brute_force"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["type"] == "init"

def test_visualize_too_long():
    long_text = "a" * 1001
    response = client.post("/visualize", json={"text": long_text, "algorithm": "brute_force"})
    assert response.status_code == 400

def test_benchmark():
    response = client.post("/benchmark", json={"text": "aba"})
    assert response.status_code == 200
    data = response.json()
    assert "brute_force" in data
    assert "expand_center" in data
