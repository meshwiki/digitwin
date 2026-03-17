export type ComponentMode = "all" | "giant";

export interface LinkRecord {
    node_a?: string;
    node_b?: string;
    confidence?: number;
    distance_km?: number;
    last_verified?: string;
    node_a_name?: string;
    node_b_name?: string;
    node_a_location?: {
        latitude?: number;
        longitude?: number;
    };
    node_b_location?: {
        latitude?: number;
        longitude?: number;
    };
}

export interface CliArgs {
    file: string;
    confidence: number;
    minBox: number;
    maxBox: number | null;
    component: ComponentMode;
    verbose: boolean;
}

export type AdjacencyMap = Map<string, Set<string>>;
export type DistanceMap = Map<string, number>;
/**
 * Represents a mapping of all pairs of distances.
 *
 * The `AllPairsDistances` type is a `Map` where:
 * - The key is a `string` representing an identifier for a pair or group.
 * - The value is a `DistanceMap`, which contains the distances associated with the key.
 */
export type AllPairsDistances = Map<string, DistanceMap>;

export interface BuildGraphResult {
    adj: AdjacencyMap;
    keptEdges: number;
}

export interface BoxCountingRow {
    lB: number;
    radius: number;
    NB: number;
    log_lB: number;
    log_NB: number;
}

export interface RegressionResult {
    slope: number;
    intercept: number;
    r2: number;
}

export interface AnalysisResult {
    nodeCount: number;
    edgeCount: number;
    components: string[][];
    workingNodeCount: number;
    diameter: number;
    rows: BoxCountingRow[];
    regression: RegressionResult | null;
    fractalDimension: number | null;
}
