from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World, backend here"}

@app.get("/check")
def check_algorithm(string: str):
    return {"input": string, "longest_palindrome": "To be implemented"}
