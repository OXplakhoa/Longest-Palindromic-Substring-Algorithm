import React, { useEffect, useRef } from 'react';
import type { VisualizationStep } from '../types';

interface StepLogProps {
    steps: VisualizationStep[];
    currentIndex: number;
}

const StepLog: React.FC<StepLogProps> = ({ steps, currentIndex }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeItemRef.current && scrollRef.current) {
            activeItemRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center'
            });
        }
    }, [currentIndex]);

    return (
        <div className="bg-slate-900 p-4 rounded-lg h-full overflow-y-auto border border-slate-700 flex flex-col" ref={scrollRef}>
            <h3 className="text-gray-300 mb-3 font-bold uppercase text-sm tracking-wider sticky top-0 bg-slate-900 py-2 z-10 border-b border-slate-700">Nhật ký thực thi</h3>
            <div className="flex flex-col gap-1.5">
                {steps.map((step, idx) => (
                    <div 
                        key={idx}
                        ref={idx === currentIndex ? activeItemRef : null}
                        className={`text-sm px-3 py-2 rounded-md border-l-4 transition-all duration-200 ${
                            idx === currentIndex 
                                ? 'bg-blue-900/50 text-blue-100 border-blue-400 font-semibold shadow-lg' 
                                : idx < currentIndex
                                    ? 'text-gray-500 border-slate-700 bg-slate-800/30'
                                    : 'text-gray-600 border-slate-800 bg-slate-800/10'
                        }`}
                    >
                        <span className="font-mono text-xs mr-3 opacity-60">#{(idx + 1).toString().padStart(3, '0')}</span>
                        <span>{step.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepLog;
