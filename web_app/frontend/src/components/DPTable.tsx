import React from 'react';
import type { VisualizationStep } from '../types';

interface DPTableProps {
    n: number;
    steps: VisualizationStep[];
    currentIndex: number;
}

const DPTable: React.FC<DPTableProps> = ({ n, steps, currentIndex }) => {
    // Limit table size for performance  
    const maxTableSize = 20;
    const showTable = n <= maxTableSize;

    if (!showTable) {
        return (
            <div className="bg-slate-900 p-4 rounded-lg h-full border border-slate-700 flex flex-col justify-center items-center text-gray-500">
                <p className="text-center mb-2">Bảng DP quá lớn để hiển thị</p>
                <p className="text-xs text-gray-600">Độ dài chuỗi: {n} (tối đa: {maxTableSize})</p>
            </div>
        );
    }

    // Reconstruct DP table state up to currentIndex
    const dp = Array(n).fill(null).map(() => Array(n).fill(null));

    for (let i = 0; i <= currentIndex; i++) {
        const step = steps[i];
        if (step.type === 'dp_update' && step.row !== undefined && step.col !== undefined) {
            dp[step.row][step.col] = step.value;
        }
    }

    // Determine active cell from current step
    const currentStep = steps[currentIndex];
    const activeRow = currentStep?.row;
    const activeCol = currentStep?.col;

    return (
        <div className="bg-slate-900 p-4 rounded-lg h-full overflow-auto border border-slate-700 flex flex-col">
            <h3 className="text-gray-400 mb-3 font-bold uppercase text-xs tracking-wider">Bảng DP</h3>
            <div className="flex-1 overflow-auto">
                <div className="inline-block min-w-full">
                    {dp.map((row, rIdx) => (
                        <div key={rIdx} className="flex gap-1 mb-1">
                            {row.map((cell: boolean | null, cIdx: number) => {
                                const isActive = activeRow === rIdx && activeCol === cIdx;
                                let bgColor = 'bg-slate-800';
                                let textColor = 'text-transparent';
                                
                                if (cell === true) {
                                    bgColor = 'bg-green-900/50';
                                    textColor = 'text-green-400';
                                } else if (cell === false) {
                                    bgColor = 'bg-red-900/20';
                                    textColor = 'text-red-900';
                                }

                                if (isActive) {
                                    bgColor = 'bg-blue-600';
                                    textColor = 'text-white';
                                }

                                // Only show upper triangle
                                if (cIdx < rIdx) return <div key={`${rIdx}-${cIdx}`} className="w-8 h-8" />;

                                return (
                                    <div 
                                        key={`${rIdx}-${cIdx}`}
                                        className={`w-8 h-8 flex items-center justify-center text-xs rounded ${bgColor} ${textColor} transition-colors duration-300 flex-shrink-0`}
                                        title={`dp[${rIdx}][${cIdx}]`}
                                    >
                                        {cell === true ? '1' : cell === false ? '0' : ''}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DPTable;
