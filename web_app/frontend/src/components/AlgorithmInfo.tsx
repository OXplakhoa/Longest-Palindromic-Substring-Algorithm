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
        name: "Vét cạn",
        timeComplexity: "O(N³)",
        spaceComplexity: "O(1)",
        description: "Kiểm tra mọi chuỗi con có thể để xác định xem nó có phải là chuỗi đối xứng hay không.",
        characteristics: [
            "Đơn giản và dễ hiểu",
            "Không cần bộ nhớ phụ",
            "Rất chậm với đầu vào lớn"
        ],
        bestFor: [
            "Hiểu rõ bài toán",
            "Chuỗi rất nhỏ (< 20 ký tự)",
            "Mục đích giáo dục"
        ]
    },
    dynamic_programming: {
        name: "Quy hoạch động",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(N²)",
        description: "Xây dựng bảng để lưu trữ thông tin chuỗi đối xứng của các chuỗi con, tránh kiểm tra trùng lặp.",
        characteristics: [
            "Sử dụng ghi nhớ",
            "Phương pháp từ dưới lên",
            "Sử dụng nhiều bộ nhớ"
        ],
        bestFor: [
            "Chuỗi trung bình (< 1000 ký tự)",
            "Khi bộ nhớ không bị hạn chế",
            "Tìm tất cả chuỗi đối xứng"
        ]
    },
    expand_center: {
        name: "Mở rộng quanh tâm",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        description: "Mở rộng xung quanh mỗi điểm tâm có thể để tìm chuỗi đối xứng.",
        characteristics: [
            "Tiết kiệm bộ nhớ",
            "Cách tiếp cận trực quan",
            "Xử lý độ dài lẻ/chẵn riêng biệt"
        ],
        bestFor: [
            "Chuỗi trung bình (< 1000 ký tự)",
            "Môi trường hạn chế bộ nhớ",
            "Ứng dụng thực tế"
        ]
    },
    manacher: {
        name: "Thuật toán Manacher",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        description: "Sử dụng tính chất đối xứng và biến đổi thông minh để đạt độ phức tạp thời gian tuyến tính.",
        characteristics: [
            "Thuật toán hiệu quả nhất",
            "Triển khai phức tạp",
            "Sử dụng tiền xử lý"
        ],
        bestFor: [
            "Chuỗi lớn (> 1000 ký tự)",
            "Ứng dụng quan trọng về hiệu năng",
            "Lập trình thi đấu"
        ]
    }
};

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
    const info = algorithmData[algorithm];

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg">
                    <Info size={16} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-blue-400">Thông tin Thuật toán</h2>
            </div>

            <div className="space-y-3">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">{info.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{info.description}</p>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-start gap-2 bg-slate-700/50 p-2 rounded">
                        <Clock size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-xs text-slate-400">Thời gian</div>
                            <div className="font-mono font-bold text-blue-300 text-sm">{info.timeComplexity}</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 bg-slate-700/50 p-2 rounded">
                        <Database size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-xs text-slate-400">Bộ nhớ</div>
                            <div className="font-mono font-bold text-purple-300 text-sm">{info.spaceComplexity}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1">
                        <Zap size={14} className="text-yellow-400" />
                        Đặc điểm Chính
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
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Phù hợp với</h4>
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
