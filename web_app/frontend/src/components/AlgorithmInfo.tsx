import React from 'react';
import type { Algorithm } from '../types';
import { Info, Clock, Database, Zap } from 'lucide-react';

interface AlgorithmInfoProps {
    algorithm: Algorithm;
}

interface AlgorithmMetadata {
    name: string;
    timeComplexity: string;
    spaceComplexity: string;
    description: string;
    characteristics: string[];
    bestFor: string[];
}

const algorithmData: Record<Algorithm, AlgorithmMetadata> = {
    brute_force: {
        name: "Brute Force",
        timeComplexity: "O(N³)",
        spaceComplexity: "O(1)",
        description: "Checks every possible substring to determine if it's a palindrome.",
        characteristics: [
            "Simple and straightforward",
            "No extra space needed",
            "Very slow for large inputs"
        ],
        bestFor: [
            "Understanding the problem",
            "Very small strings (< 20 chars)",
            "Educational purposes"
        ]
    },
    dynamic_programming: {
        name: "Dynamic Programming",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(N²)",
        description: "Builds a table to store palindrome information for substrings, avoiding redundant checks.",
        characteristics: [
            "Uses memorization",
            "Bottom-up approach",
            "High memory usage"
        ],
        bestFor: [
            "Medium strings (< 1000 chars)",
            "When memory is not a constraint",
            "Finding all palindromes"
        ]
    },
    expand_center: {
        name: "Expand Around Center",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        description: "Expands around each possible center point to find palindromes.",
        characteristics: [
            "Space efficient",
            "Intuitive approach",
            "Handles odd/even separately"
        ],
        bestFor: [
            "Medium strings (< 1000 chars)",
            "Memory-constrained environments",
            "Practical applications"
        ]
    },
    manacher: {
        name: "Manacher's Algorithm",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        description: "Uses symmetry properties and a clever transformation to achieve linear time complexity.",
        characteristics: [
            "Most efficient algorithm",
            "Complex implementation",
            "Uses preprocessing"
        ],
        bestFor: [
            "Large strings (> 1000 chars)",
            "Performance-critical apps",
            "Competitive programming"
        ]
    }
};

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
    const info = algorithmData[algorithm];

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg p-5 sticky top-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                    <Info size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-blue-400">Algorithm Info</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">{info.name}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{info.description}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-start gap-2 bg-slate-700/50 p-3 rounded">
                        <Clock size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-xs text-slate-400">Time Complexity</div>
                            <div className="font-mono font-bold text-blue-300">{info.timeComplexity}</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 bg-slate-700/50 p-3 rounded">
                        <Database size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-xs text-slate-400">Space Complexity</div>
                            <div className="font-mono font-bold text-purple-300">{info.spaceComplexity}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1">
                        <Zap size={14} className="text-yellow-400" />
                        Key Characteristics
                    </h4>
                    <ul className="space-y-1">
                        {info.characteristics.map((char, idx) => (
                            <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>{char}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Best For</h4>
                    <ul className="space-y-1">
                        {info.bestFor.map((use, idx) => (
                            <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>{use}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AlgorithmInfo;
