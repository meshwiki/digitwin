#!/usr/bin/env node

/**
 * Estimate fractal dimension of a network from edge JSON.
 *
 * Input format:
 * [
 *   {
 *     "node_a": "...",
 *     "node_b": "...",
 *     "confidence": 30,
 *     ...
 *   },
 *   ...
 * ]
 *
 * Usage:
 *   npx ts-node fractal-dimension.ts
 *   npx ts-node fractal-dimension.ts --file proven-links.json --confidence 30
 *   npx ts-node fractal-dimension.ts --file proven-links.json --confidence 40 --component giant
 *   npx ts-node fractal-dimension.ts --file proven-links.json --confidence 30 --min-box 1 --max-box 12
 *
 * Notes:
 * - Graph is treated as undirected and unweighted for box counting on hop distance.
 * - Uses a greedy radius-ball covering heuristic:
 *     for box size lB, radius r = floor((lB - 1) / 2)
 *   so every box is guaranteed valid for pairwise shortest-path distance <= lB - 1.
 * - This is an approximation, not an exact minimum box cover.
 */

import {
    AdjacencyMap,
    AllPairsDistances,
    AnalysisResult,
    BoxCountingRow,
    BuildGraphResult,
    CliArgs,
    LinkRecord,
} from "./types";
import { connectedComponents } from "./graph/connectedComponents";
import { inducedSubgraph } from "./graph/inducedSubgraph";
import { parseArgs } from "./cli/parseArgs";
import { allPairsShortestPaths } from "./graph/allPairsShortestPaths";
import { printReport } from "./cli/printReport";
import { readJson } from "./cli/readJson";
import { linearRegression } from "./stats/linearRegression";

/**
 * Constructs an adjacency map (graph) from a list of link records, filtering edges
 * based on a minimum confidence threshold. Ensures that nodes and edges are added
 * only if they meet the specified criteria.
 *
 * @param records - An array of `LinkRecord` objects, each representing a potential
 * connection between two nodes with an associated confidence value.
 * @param minConfidence - The minimum confidence value required for an edge to be
 * included in the graph. Edges with confidence values below this threshold are ignored.
 *
 * @returns An object containing:
 * - `adj`: An adjacency map where each node is a key, and its value is a set of
 *   directly connected nodes.
 * - `keptEdges`: The total number of edges that were added to the graph.
 *
 * @remarks
 * - Nodes are automatically added to the graph when they appear in a valid edge.
 * - Self-loops (edges where `node_a` equals `node_b`) are ignored.
 * - Edges are undirected, meaning that if `node_a` is connected to `node_b`, then
 *   `node_b` is also connected to `node_a`.
 *
 * @complexity
 * Time complexity: O(n * m), where `n` is the number of records and `m` is the average
 * number of edges per node. This accounts for iterating through the records and
 * updating the adjacency map.
 * Space complexity: O(V + E), where `V` is the number of unique nodes and `E` is the
 * number of edges in the graph.
 */
function buildGraph(
    records: LinkRecord[],
    minConfidence: number
): BuildGraphResult {
    const adj: AdjacencyMap = new Map();
    let keptEdges = 0;

    function ensureNode(n: string): void {
        if (!adj.has(n)) adj.set(n, new Set());
    }

    for (const rec of records) {
        const a = rec.node_a;
        const b = rec.node_b;
        const c = Number(rec.confidence);

        if (!a || !b) continue;
        if (!Number.isFinite(c) || c < minConfidence) continue;
        if (a === b) continue;

        ensureNode(a);
        ensureNode(b);

        const before = adj.get(a)!.has(b);
        adj.get(a)!.add(b);
        adj.get(b)!.add(a);

        if (!before) keptEdges++;
    }

    return { adj, keptEdges };
}

/**
 * Greedy covering by radius balls.
 *
 * For box size lB, use radius r = floor((lB - 1) / 2).
 * Any two nodes in the same radius-r ball are at pairwise distance <= 2r <= lB - 1,
 * so the box is valid under the network box-counting definition using shortest-path size.
 */
function greedyBallCover(
    apsp: AllPairsDistances,
    nodes: string[],
    lB: number
): { boxes: number; radius: number } {
    const uncovered = new Set<string>(nodes);
    const r = Math.floor((lB - 1) / 2);
    let boxes = 0;

    while (uncovered.size > 0) {
        let bestCenter: string | null = null;
        let bestCovered: string[] = [];
        let bestCount = -1;

        for (const center of nodes) {
            const dist = apsp.get(center);
            if (!dist) continue;

            const covered: string[] = [];
            for (const u of uncovered) {
                const du = dist.get(u);
                if (du !== undefined && du <= r) covered.push(u);
            }

            if (covered.length > bestCount) {
                bestCount = covered.length;
                bestCovered = covered;
                bestCenter = center;
            }
        }

        if (!bestCenter || bestCovered.length === 0) {
            const first = uncovered.values().next().value as string;
            bestCovered = [first];
        }

        for (const u of bestCovered) {
            uncovered.delete(u);
        }

        boxes++;
    }

    return { boxes, radius: r };
}

function analyzeGraph(
    adj: AdjacencyMap,
    opts: Pick<CliArgs, "component" | "minBox" | "maxBox">
): AnalysisResult {
    const nodeCount = adj.size;

    let edgeCount = 0;
    for (const nbrs of adj.values()) edgeCount += nbrs.size;
    edgeCount /= 2;

    if (nodeCount === 0) {
        throw new Error("Graph is empty after filtering");
    }

    const components = connectedComponents(adj);
    let workingAdj = adj;

    if (opts.component === "giant") {
        workingAdj = inducedSubgraph(adj, components[0]);
    }

    const workingNodes = [...workingAdj.keys()];
    const { apsp, diameter } = allPairsShortestPaths(workingAdj);

    const minBox = opts.minBox;
    const maxBox = opts.maxBox ?? diameter;
    const rows: BoxCountingRow[] = [];

    for (let lB = minBox; lB <= maxBox; lB++) {
        const { boxes, radius } = greedyBallCover(apsp, workingNodes, lB);
        rows.push({
            lB,
            radius,
            NB: boxes,
            log_lB: Math.log(lB),
            log_NB: Math.log(boxes),
        });
    }

    const fitRows = rows.filter((r) => r.NB > 1 && r.lB > 0);

    if (fitRows.length < 2) {
        return {
            nodeCount,
            edgeCount,
            components,
            workingNodeCount: workingAdj.size,
            diameter,
            rows,
            regression: null,
            fractalDimension: null,
        };
    }

    const regression = linearRegression(
        fitRows.map((r) => r.log_lB),
        fitRows.map((r) => r.log_NB)
    );

    const fractalDimension = regression ? -regression.slope : null;

    return {
        nodeCount,
        edgeCount,
        components,
        workingNodeCount: workingAdj.size,
        diameter,
        rows,
        regression,
        fractalDimension,
    };
}

function main(): void {
    try {
        const args = parseArgs(process.argv);
        console.log("> reading data from", args.file);
        const data = readJson(args.file);
        console.log("> building graph with confidence >=", args.confidence);
        const { adj } = buildGraph(data, args.confidence);
        console.log("> analyzing graph with component mode", args.component);
        const result = analyzeGraph(adj, args);
        printReport(result, args);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Error:", message);
        process.exit(1);
    }
}

main();
