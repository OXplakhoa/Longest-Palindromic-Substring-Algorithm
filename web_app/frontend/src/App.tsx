import { useState } from 'react';
import axios from 'axios';
import InputSection from './components/InputSection';
import Visualizer from './components/Visualizer';
import Benchmark from './components/Benchmark';
import type { Algorithm, VisualizationStep, BenchmarkResult } from './types';
import { Activity } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function App() {
    const [text, setText] = useState('babad');
    const [algorithm, setAlgorithm] = useState<Algorithm>('expand_center');
    const [steps, setSteps] = useState<VisualizationStep[]>([]);
    const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVisualize = async () => {
        setLoading(true);
        setError(null);
        setSteps([]);
        setBenchmarkResults(null); // Clear benchmark when visualizing
        try {
            const response = await axios.post<VisualizationStep[]>(`${API_URL}/visualize`, {
                text,
                algorithm
            });
            setSteps(response.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleBenchmark = async () => {
        setLoading(true);
        setError(null);
        setBenchmarkResults(null);
        try {
            const response = await axios.post<BenchmarkResult>(`${API_URL}/benchmark`, {
                text
            });
            setBenchmarkResults(response.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <header className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg shadow-lg shadow-blue-500/20">
                        <Activity size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Palindrome Visualizer
                        </h1>
                        <p className="text-slate-400">Interactive Algorithm Visualization & Benchmark</p>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <InputSection
                    text={text}
                    setText={setText}
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                    onVisualize={handleVisualize}
                    onBenchmark={handleBenchmark}
                    loading={loading}
                />

                {steps.length > 0 && (
                    <Visualizer
                        text={text}
                        steps={steps}
                        algorithm={algorithm}
                    />
                )}

                <Benchmark
                    results={benchmarkResults}
                    loading={loading && !steps.length} // Show loading in benchmark area if not visualizing
                />
            </div>
        </div>
    );
}

export default App;
