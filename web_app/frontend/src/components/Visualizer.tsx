import React, { useState, useEffect, useRef } from 'react';
import type { VisualizationStep } from '../types';   
import { Play, Pause, SkipBack, SkipForward, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

interface VisualizerProps {
    text: string;
    steps: VisualizationStep[];
    algorithm: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ text, steps, algorithm }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(820);
    const [displayString, setDisplayString] = useState(text);
    
    // Refs for auto-scrolling or other imperative actions if needed
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentStepIndex(0);
        setIsPlaying(false);
        setDisplayString(text);
    }, [steps, text]);

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
            }, speed);
        } else if (currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const currentStep = steps[currentStepIndex];

    // Handle Manacher transformation
    useEffect(() => {
        if (algorithm === 'manacher' && steps.length > 0) {
            // Find the transform step
            const transformStep = steps.find(s => s.type === 'transform');
            if (transformStep && transformStep.string) {
                setDisplayString(transformStep.string);
            }
        } else {
            setDisplayString(text);
        }
    }, [algorithm, steps, text]);

    // Helper to determine character style
    const getCharStyle = (index: number) => {
        if (!currentStep) return '';

        const styles: string[] = ['transition-all duration-300'];
        
        // Default style
        styles.push('bg-slate-700 text-white border-slate-600');

        if (currentStep.indices && currentStep.indices.includes(index)) {
            if (currentStep.type === 'select') styles.push('bg-yellow-600 border-yellow-400 scale-110');
            if (currentStep.type === 'compare') styles.push('bg-blue-600 border-blue-400 scale-110');
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
        // This requires tracking state across steps or looking at current step properties
        // For simplicity, we'll just highlight if the current step explicitly says update_max
        if (currentStep.type === 'update_max' && currentStep.start !== undefined && currentStep.end !== undefined) {
             if (index >= currentStep.start && index <= currentStep.end) {
                 styles.push('bg-pink-600 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]');
             }
        }

        return clsx(
            'w-10 h-10 flex items-center justify-center border-2 rounded font-mono text-lg font-bold',
            styles
        );
    };

    // DP Table Visualization (simplified)
    const renderDPTable = () => {
        if (algorithm !== 'dynamic_programming') return null;
        // This would be complex to render fully. 
        // Maybe just show a grid if n is small.
        return null; 
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Visualization</h2>
            
            {/* Controls */}
            <div className="flex items-center justify-between mb-6 bg-slate-900 p-4 rounded">
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentStepIndex(0)} className="p-2 hover:bg-slate-700 rounded text-gray-300"><SkipBack size={20} /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-slate-700 rounded text-white bg-blue-600">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} className="p-2 hover:bg-slate-700 rounded text-gray-300"><SkipForward size={20} /></button>
                    <button onClick={() => {setCurrentStepIndex(0); setIsPlaying(false);}} className="p-2 hover:bg-slate-700 rounded text-gray-300"><RefreshCw size={20} /></button>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Step {currentStepIndex + 1} / {steps.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Speed</span>
                        <input 
                            type="range" 
                            min="50" 
                            max="1000" 
                            step="50"
                            value={1050 - speed} // Invert so right is faster
                            onChange={(e) => setSpeed(1050 - Number(e.target.value))}
                            className="w-24 accent-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* String Display */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 min-h-[60px]">
                {displayString.split('').map((char, idx) => (
                    <div key={idx} className={getCharStyle(idx)}>
                        {char}
                    </div>
                ))}
            </div>

            {/* Step Description */}
            <div className="bg-slate-900 p-4 rounded border-l-4 border-blue-500">
                <p className="text-lg text-gray-200">
                    {currentStep ? currentStep.description : 'Ready to visualize'}
                </p>
            </div>

            {/* DP Table Placeholder */}
            {renderDPTable()}
        </div>
    );
};

export default Visualizer;
