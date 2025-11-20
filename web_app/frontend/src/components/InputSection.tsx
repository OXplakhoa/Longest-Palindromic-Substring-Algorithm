import React from 'react';
import type { Algorithm } from '../types';

interface InputSectionProps {
    text: string;
    setText: (text: string) => void;
    algorithm: Algorithm;
    setAlgorithm: (algo: Algorithm) => void;
    onVisualize: () => void;
    onBenchmark: () => void;
    loading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
    text, setText, algorithm, setAlgorithm, onVisualize, onBenchmark, loading
}) => {
    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Configuration</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Input String</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter a string (e.g., babad)"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Algorithm</label>
                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="brute_force">Brute Force (O(N³), O(1))</option>
                        <option value="dynamic_programming">Dynamic Programming (O(N²), O(N²))</option>
                        <option value="expand_center">Expand Around Center (O(N²), O(1))</option>
                        <option value="manacher">Manacher's Algorithm (O(N), O(N))</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={onVisualize}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Visualize'}
                    </button>
                    <button
                        onClick={onBenchmark}
                        disabled={loading}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Benchmark All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputSection;
