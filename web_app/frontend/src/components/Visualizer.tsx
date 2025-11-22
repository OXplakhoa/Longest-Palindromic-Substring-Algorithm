import React, { useState, useEffect } from 'react';
import type { VisualizationStep, Algorithm } from '../types';
import { Play, Pause, SkipBack, SkipForward, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import PseudoCode from './PseudoCode';
import StepLog from './StepLog';
import DPTable from './DPTable';

interface VisualizerProps {
    text: string;
    steps: VisualizationStep[];
    algorithm: Algorithm;
}

const Visualizer: React.FC<VisualizerProps> = ({ text, steps, algorithm }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(820);
    const [displayString, setDisplayString] = useState(text);
    
    // Track max palindrome found so far
    const [maxPalindrome, setMaxPalindrome] = useState<{start: number, end: number, length: number} | null>(null);

    useEffect(() => {
        setCurrentStepIndex(0);
        setIsPlaying(false);
        setDisplayString(text);
        setMaxPalindrome(null);
    }, [steps, text, algorithm]);

    useEffect(() => {
        let interval: number;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStepIndex(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1050 - speed);
        } else if (currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const currentStep = steps[currentStepIndex];

    // Update state based on current step
    useEffect(() => {
        if (!currentStep) return;

        // Manacher shows transformed string for visualization
        if (algorithm === 'manacher') {
            const transformStep = steps.find(s => s.type === 'transform');
            if (transformStep && transformStep.string) {
                setDisplayString(transformStep.string);
            }
        } else {
            setDisplayString(text);
        }

        // Update max palindrome (indices are always for ORIGINAL string)
        if (currentStep.type === 'update_max' && currentStep.start !== undefined && currentStep.end !== undefined && currentStep.length !== undefined) {
            setMaxPalindrome({
                start: currentStep.start,
                end: currentStep.end,
                length: currentStep.length
            });
        } else if (currentStepIndex === 0) {
            setMaxPalindrome(null);
        }
    }, [currentStep, algorithm, steps, text, currentStepIndex]);


    // Helper to determine character style
    const getCharStyle = (index: number) => {
        if (!currentStep) return '';

        const styles: string[] = ['transition-all duration-300'];
        
        // Default style
        styles.push('bg-slate-700 text-white border-slate-600');

        if (currentStep.indices && currentStep.indices.includes(index)) {
            if (currentStep.type === 'select') styles.push('bg-yellow-600 border-yellow-400 scale-110');
            if (currentStep.type === 'compare') styles.push('bg-yellow-600 border-yellow-400 scale-110'); // Yellow like select for consistency
            if (currentStep.type === 'match') styles.push('bg-green-600 border-green-400 scale-110');
            if (currentStep.type === 'mismatch') styles.push('bg-red-600 border-red-400');
        }
        
        // Manacher specific
        if (algorithm === 'manacher') {
            if (currentStep.type === 'select_center' && currentStep.index === index) {
                styles.push('bg-purple-600 border-purple-400 ring-2 ring-purple-400');
            }
            if (currentStep.mirror_index === index) {
                styles.push('bg-indigo-600 border-indigo-400 opacity-70');
            }
        }

        // Highlight max palindrome found so far
        if (maxPalindrome && index >= maxPalindrome.start && index <= maxPalindrome.end) {
             // Use a subtle border or glow if not currently active
             if (!currentStep.indices?.includes(index)) {
                 styles.push('border-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.3)]');
             }
             // If it IS the update_max step, make it pop
             if (currentStep.type === 'update_max') {
                 styles.push('bg-pink-600 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.8)] scale-110 z-10');
             }
        }

        return clsx(
            'w-14 h-14 flex items-center justify-center border-2 rounded-lg font-mono text-2xl font-bold relative',
            styles
        );
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-400">Minh họa</h2>
            </div>
            
            {/* Controls */}
            <div className="sticky top-0 z-20 backdrop-blur-sm flex items-center justify-between mb-8 bg-slate-900 p-5 rounded-lg border-2 border-slate-700">
                <div className="flex items-center gap-3">
                    <button onClick={() => setCurrentStepIndex(0)} className="p-3 hover:bg-slate-700 rounded-lg text-gray-300 transition-colors"><SkipBack size={24} /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 hover:bg-blue-700 rounded-lg text-white bg-blue-600 transition-colors shadow-xl shadow-blue-900/30">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} className="p-3 hover:bg-slate-700 rounded-lg text-gray-300 transition-colors"><SkipForward size={24} /></button>
                    <button onClick={() => {setCurrentStepIndex(0); setIsPlaying(false);}} className="p-3 hover:bg-slate-700 rounded-lg text-gray-300 transition-colors"><RefreshCw size={24} /></button>
                </div>
                
                <div className="flex items-center gap-8">
                    <div className="text-lg text-gray-300 font-mono font-semibold">
                        Bước <span className="text-blue-400 text-xl">{currentStepIndex + 1}</span> / {steps.length}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Tốc độ</span>
                        <input 
                            type="range" 
                            min="50" 
                            max="1000" 
                            step="50"
                            value={1050 - speed} 
                            onChange={(e) => setSpeed(1050 - Number(e.target.value))}
                            className="w-40 accent-blue-500 cursor-pointer h-2"
                        />
                    </div>
                </div>
            </div>

            {/* Main Layout: Left (String) | Right (Pseudo-code + Execution Log) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT SIDE: String Visualization */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-gray-300 uppercase tracking-wider">Trực quan hóa chuỗi</h3>
                    <div className="flex flex-col items-center justify-center gap-3 min-h-[600px] p-8 bg-slate-900/50 rounded-lg border-2 border-slate-700/50">
                        {displayString.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="text-6xl text-slate-600">∅</div>
                                <div className="text-xl text-slate-400 font-semibold">Chuỗi rỗng</div>
                                <div className="text-sm text-slate-500">Chuỗi đối xứng dài nhất của chuỗi rỗng là chuỗi rỗng</div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-12 max-w-full mb-8">
                                {displayString.split('').map((char, idx) => (
                                    <div key={idx} className={getCharStyle(idx)}>
                                        {char}
                                        {/* Index label - always visible */}
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-300 font-bold border-none bg-slate-900/80 px-1 rounded">{idx}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Current Max Palindrome Display */}
                        {maxPalindrome && (
                            <div className="mt-6 bg-gradient-to-r from-pink-900/50 to-purple-900/50 border-2 border-pink-500/70 rounded-xl p-6 shadow-2xl">
                                <div className="text-center">
                                    <p className="text-pink-300 text-sm uppercase tracking-wider mb-2 font-semibold">Chuỗi đối xứng tối đa hiện tại</p>
                                    <p className="text-white text-4xl font-bold mb-3 font-mono tracking-wider">
                                        "{text.substring(maxPalindrome.start, maxPalindrome.end + 1)}"
                                    </p>
                                    <div className="flex justify-center gap-6 text-sm">
                                        <div className="text-pink-200">
                                            <span className="text-gray-400">Bắt đầu:</span> <span className="font-mono font-bold text-white">{maxPalindrome.start}</span>
                                        </div>
                                        <div className="text-pink-200">
                                            <span className="text-gray-400">Kết thúc:</span> <span className="font-mono font-bold text-white">{maxPalindrome.end}</span>
                                        </div>
                                        <div className="text-pink-200">
                                            <span className="text-gray-400">Độ dài:</span> <span className="font-mono font-bold text-white">{maxPalindrome.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Current Step Description */}
                        <div className="mt-4 w-full max-w-2xl">
                            <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-blue-500 shadow-lg">
                                <p className="text-lg text-gray-200 leading-relaxed">
                                    {currentStep ? currentStep.description : 'Sẵn sàng trực quan hóa'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Pseudo-code + Execution Log */}
                <div className="flex flex-col gap-6">
                    {/* Pseudo-Code */}
                    <div className="h-[350px]">
                        <PseudoCode algorithm={algorithm} currentLine={currentStep?.line} />
                    </div>

                    {/* Execution Log */}
                    <div className="h-[350px]">
                        <StepLog steps={steps} currentIndex={currentStepIndex} />
                    </div>
                </div>
            </div>

            {/* DP Table - Below if Dynamic Programming is selected */}
            {algorithm === 'dynamic_programming' && (
                <div className="mt-6 h-[400px]">
                    <DPTable n={text.length} steps={steps} currentIndex={currentStepIndex} />
                </div>
            )}
        </div>
    );
};

export default Visualizer;
