import React, { useState } from 'react';
import { testCases } from '../testCases';
import type { TestCase } from '../testCases';
import { Beaker, ChevronDown, ChevronRight } from 'lucide-react';

interface TestCaseSelectorProps {
    onSelectTestCase: (text: string) => void;
}

const TestCaseSelector: React.FC<TestCaseSelectorProps> = ({ onSelectTestCase }) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(['Basic', 'Classic'])
    );

    const categories = Array.from(new Set(testCases.map(tc => tc.category)));

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const handleSelectTestCase = (testCase: TestCase) => {
        onSelectTestCase(testCase.input);
    };

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg p-5 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg">
                    <Beaker size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-purple-400">Bộ kiểm thử</h2>
            </div>

            <div className="space-y-3">
                {categories.map(category => {
                    const categoryTests = testCases.filter(tc => tc.category === category);
                    const isExpanded = expandedCategories.has(category);

                    return (
                        <div key={category} className="border border-slate-700 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-700 transition-colors"
                            >
                                <span className="text-sm font-semibold text-slate-300">
                                    {category}
                                    <span className="ml-2 text-xs text-slate-500">({categoryTests.length})</span>
                                </span>
                                {isExpanded ? (
                                    <ChevronDown size={16} className="text-slate-400" />
                                ) : (
                                    <ChevronRight size={16} className="text-slate-400" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="p-2 space-y-2">
                                    {categoryTests.map(testCase => (
                                        <button
                                            key={testCase.id}
                                            onClick={() => handleSelectTestCase(testCase)}
                                            className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700/70 rounded border border-slate-600/50 hover:border-purple-500/50 transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <span className="text-xs font-semibold text-purple-300 group-hover:text-purple-200">
                                                    {testCase.name}
                                                </span>
                                                <span className="text-xs text-slate-500">#{testCase.id}</span>
                                            </div>
                                            <div className="text-xs font-mono text-slate-400 mb-1 truncate">
                                                "{testCase.input.length > 20 ? testCase.input.substring(0, 20) + '...' : testCase.input}"
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Expected: {testCase.expected.length === 1 
                                                    ? `"${testCase.expected[0].length > 15 ? testCase.expected[0].substring(0, 15) + '...' : testCase.expected[0]}"`
                                                    : `${testCase.expected.length} lựa chọn`}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TestCaseSelector;
