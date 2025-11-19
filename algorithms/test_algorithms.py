# Unit tests for all LPS algorithms
import sys
sys.path.append('.')
from brute_force import longest_palindrome as brute
from dynamic_programming import longest_palindrome as dp
from expand_center import longest_palindrome as expand
from manacher import longest_palindrome as manacher

test_cases = [
    ("babad", {"bab", "aba"}),
    ("cbbd", {"bb"}),
    ("", {""}),
    ("a", {"a"}),
    ("aa", {"aa"}),
    ("racecar", {"racecar"}),
    ("abba", {"abba"}),
    ("abacabad", {"abacaba"}),
    ("abcdef", {"a", "b", "c", "d", "e", "f"}),
    ("aaaaaaa", {"aaaaaaa"}),
    ("xyzabcdedcbapqr", {"abcdedcba"}),
    ("racecarXYZ", {"racecar"}),
    ("XYZabba", {"abba"}),
    ("abccbae", {"abccba"}),
    ("cabbaab", {"abba", "baab"}),
    ("a man, a plan", {" a p a ", "ana", " a a ", " a "}),
    ("Aa", {"A", "a"}),
    ("日本語本日", {"日本語本日", "本語本"}),
    ("mañana", {"aña", "ana"}),
    ("😊abccba😊", {"😊abccba😊"}),
    ("e\u0301e", {"e\u0301e"}),
    ("a!@#@!a", {"a!@#@!a"})
    # ("a" * 5000 + "b" + "a" * 5000, {"a" * 5000}),
    # ("abc" * 1000, {"a", "b", "c"})
]

algorithms = [
    ("brute", brute),
    ("dp", dp),
    ("expand", expand),
    ("manacher", manacher)
]

def verify_palindrome(s, result):
    return result == result[::-1] and result in s

def run_tests():
    for name, algo in algorithms:
        print(f"Testing {name} algorithm...")
        for idx, (input_str, expected_set) in enumerate(test_cases):
            ret = algo(input_str)
            if isinstance(ret, tuple):
                result, meta = ret
            else:
                result = ret
                meta = {}
            assert verify_palindrome(input_str, result), f"Not palindrome: {result} in {input_str} ({name})"
            assert result in expected_set, f"Test {idx} failed for {name}: got '{result}', expected {expected_set}"
        print(f"{name} passed all tests!\n")

if __name__ == "__main__":
    run_tests()
