import time
import tracemalloc
import random
import string
import sys
import os

# Add current directory to path so we can import algorithms
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from brute_force import longest_palindrome as brute
from dynamic_programming import longest_palindrome as dp
from expand_center import longest_palindrome as expand
from manacher import longest_palindrome as manacher

def generate_random_string(length):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def benchmark_algorithm(algo, name, input_str):
    # Measure memory
    tracemalloc.start()
    start_time = time.perf_counter()
    
    # Run algorithm
    try:
        ret = algo(input_str)
        # Handle return type difference
        if isinstance(ret, tuple):
            _ = ret[0]
        else:
            _ = ret
    except Exception as e:
        print(f"Error in {name}: {e}")
        return None, None

    end_time = time.perf_counter()
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    
    time_taken = (end_time - start_time) * 1000 # ms
    peak_memory = peak / 1024 # KB
    
    return time_taken, peak_memory

def run_benchmarks():
    lengths = [100, 500, 1000, 2000]
    algorithms = [
        ("Brute Force", brute),
        ("DP", dp),
        ("Expand Center", expand),
        ("Manacher", manacher)
    ]
    
    print(f"{'Algorithm':<15} | {'Length':<8} | {'Time (ms)':<10} | {'Memory (KB)':<10}")
    print("-" * 55)
    
    for length in lengths:
        input_str = generate_random_string(length)
        
        for name, algo in algorithms:
            # Skip Brute Force for large inputs as it's too slow (O(n^3))
            if name == "Brute Force" and length > 1000:
                print(f"{name:<15} | {length:<8} | {'SKIPPED':<10} | {'-':<10}")
                continue
                
            time_taken, peak_memory = benchmark_algorithm(algo, name, input_str)
            
            if time_taken is not None:
                print(f"{name:<15} | {length:<8} | {time_taken:<10.4f} | {peak_memory:<10.2f}")
            else:
                print(f"{name:<15} | {length:<8} | {'ERROR':<10} | {'ERROR':<10}")
        print("-" * 55)

if __name__ == "__main__":
    run_benchmarks()

# Algorithm       | Length   | Time (ms)  | Memory (KB)
# -------------------------------------------------------
# Brute Force     | 100      | 0.5659     | 0.07      
# DP              | 100      | 1.1756     | 85.00     
# Expand Center   | 100      | 0.0589     | 0.04      
# Manacher        | 100      | 0.0906     | 2.03      
# -------------------------------------------------------
# Brute Force     | 500      | 14.1833    | 0.04      
# DP              | 500      | 23.9610    | 1980.83   
# Expand Center   | 500      | 0.3078     | 0.04      
# Manacher        | 500      | 0.5112     | 9.06      
# -------------------------------------------------------
# Brute Force     | 1000     | 37.9312    | 0.04      
# DP              | 1000     | 93.6372    | 7872.08   
# Expand Center   | 1000     | 0.3515     | 0.04      
# Manacher        | 1000     | 0.7213     | 17.85     
# -------------------------------------------------------
# Brute Force     | 2000     | SKIPPED    | -         
# DP              | 2000     | 346.4019   | 31371.43  
# Expand Center   | 2000     | 0.6699     | 0.04      
# Manacher        | 2000     | 1.5313     | 35.43     
# -------------------------------------------------------
