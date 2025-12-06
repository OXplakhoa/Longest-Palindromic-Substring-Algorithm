import { useState } from 'react';
import axios from 'axios';
import InputSection from './components/InputSection';
import Visualizer from './components/Visualizer';
import Benchmark from './components/Benchmark';
import AlgorithmInfo from './components/AlgorithmInfo';
import TestCaseSelector from './components/TestCaseSelector';
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

    const handleSelectTestCase = (testText: string) => {
        setText(testText);
        // Clear previous results when selecting a new test case
        setSteps([]);
        setBenchmarkResults(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg shadow-lg shadow-blue-500/20">
                            <Activity size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Chuỗi con đối xứng dài nhất
                            </h1>
                            <p className="text-sm text-slate-400">Trực quan hóa & Đo hiệu năng Thuật toán</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2-Column Layout - Optimized for MacBook */}
            <div className="max-w-[95%] mx-auto px-6 py-6">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
                    {/* Main Content - Takes most of the space */}
                    <main className="min-w-0 space-y-6">
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
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
                            loading={loading && !steps.length}
                        />
                    </main>

                    {/* Right Sidebar - Combined Info + Test Cases */}
                    <aside className="hidden xl:flex flex-col gap-4">
                        <AlgorithmInfo algorithm={algorithm} />
                        <TestCaseSelector onSelectTestCase={handleSelectTestCase} />
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default App;

