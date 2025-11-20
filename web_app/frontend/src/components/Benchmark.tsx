import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { BenchmarkResult } from '../types';

interface BenchmarkProps {
    results: BenchmarkResult | null;
    loading: boolean;
}

const Benchmark: React.FC<BenchmarkProps> = ({ results, loading }) => {
    if (loading) {
        return (
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 flex items-center justify-center h-64">
                <div className="text-blue-400 text-xl animate-pulse">Running Benchmark...</div>
            </div>
        );
    }

    if (!results) return null;

    const data = [
        { name: 'Brute Force', time: results.brute_force, color: '#ef4444' },
        { name: 'DP', time: results.dynamic_programming, color: '#eab308' },
        { name: 'Expand Center', time: results.expand_center, color: '#3b82f6' },
        { name: 'Manacher', time: results.manacher, color: '#a855f7' },
    ].filter(item => item.time !== null);

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Benchmark Results (ms)</h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" width={120} stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                        />
                        <Legend />
                        <Bar dataKey="time" name="Execution Time (ms)" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-400">
                * Lower is better. Brute Force and DP may be skipped for long strings.
            </div>
        </div>
    );
};

export default Benchmark;
