// Test cases for the palindrome visualizer
// Based on test_algorithms.py

export interface TestCase {
    id: number;
    name: string;
    input: string;
    expected: string[];
    category: string;
}

export const testCases: TestCase[] = [
    // Basic Cases
    { id: 1, name: "Basic 1", input: "babad", expected: ["bab", "aba"], category: "Basic" },
    { id: 2, name: "Basic 2", input: "cbbd", expected: ["bb"], category: "Basic" },
    { id: 3, name: "Single Char", input: "a", expected: ["a"], category: "Basic" },
    { id: 4, name: "Double Char", input: "aa", expected: ["aa"], category: "Basic" },
    
    // Classic Palindromes
    { id: 5, name: "Racecar", input: "racecar", expected: ["racecar"], category: "Classic" },
    { id: 6, name: "ABBA", input: "abba", expected: ["abba"], category: "Classic" },
    { id: 7, name: "Abacaba", input: "abacabad", expected: ["abacaba"], category: "Classic" },
    
    // Edge Cases
    { id: 8, name: "Empty String", input: "", expected: [""], category: "Edge Cases" },
    { id: 9, name: "No Palindrome", input: "abcdef", expected: ["a", "b", "c", "d", "e", "f"], category: "Edge Cases" },
    { id: 10, name: "All Same", input: "aaaaaaa", expected: ["aaaaaaa"], category: "Edge Cases" },
    
    // Complex
    { id: 11, name: "Long Palindrome", input: "xyzabcdedcbapqr", expected: ["abcdedcba"], category: "Complex" },
    { id: 12, name: "Prefix Palindrome", input: "racecarXYZ", expected: ["racecar"], category: "Complex" },
    { id: 13, name: "Suffix Palindrome", input: "XYZabba", expected: ["abba"], category: "Complex" },
    { id: 14, name: "Long Middle", input: "abccbae", expected: ["abccba"], category: "Complex" },
    { id: 15, name: "Multiple Same Length", input: "cabbaab", expected: ["abba", "baab"], category: "Complex" },
    
    // Special Characters
    { id: 16, name: "With Spaces", input: "a man, a plan", expected: [" a p a ", "ana", " a a ", " a "], category: "Special Chars" },
    { id: 17, name: "Case Sensitive", input: "Aa", expected: ["A", "a"], category: "Special Chars" },
    { id: 18, name: "With Symbols", input: "a!@#@!a", expected: ["a!@#@!a"], category: "Special Chars" },
    
    // Unicode
    { id: 19, name: "Japanese", input: "日本語本日", expected: ["日本語本日", "本語本"], category: "Unicode" },
    { id: 20, name: "Spanish", input: "mañana", expected: ["aña", "ana"], category: "Unicode" },
    { id: 21, name: "Emoji", input: "😊abccba😊", expected: ["😊abccba😊"], category: "Unicode" },
];
