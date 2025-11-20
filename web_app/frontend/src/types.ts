export interface VisualizationStep {
    type: 'init' | 'select' | 'compare' | 'match' | 'mismatch' | 'update_max' | 'found' | 'center' | 'transform' | 'mirror' | 'update_center' | 'dp_update' | 'dp_check' | 'loop_i' | 'check' | 'expand' | 'loop_len' | 'calc_mirror' | 'init_vars' | 'select_center';
    description: string;
    indices?: number[];
    index?: number;
    start?: number;
    end?: number;
    length?: number;
    value?: boolean | number;
    mirror_index?: number;
    center?: number;
    right?: number;
    string?: string;
    row?: number;
    col?: number;
    line?: number;
}

export interface BenchmarkResult {
    brute_force: number | null;
    dynamic_programming: number | null;
    expand_center: number;
    manacher: number;
}

export type Algorithm = 'brute_force' | 'dynamic_programming' | 'expand_center' | 'manacher';
