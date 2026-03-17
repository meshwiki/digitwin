import { AdjacencyMap } from "../types";

/**
 * Computes the connected components of a graph represented as an adjacency map.
 *
 * @param adj - An adjacency map where the keys are node identifiers (strings) and the values
 *              are arrays of neighboring node identifiers.
 * @returns An array of connected components, where each component is represented as an array
 *          of node identifiers. The components are sorted in descending order by size.
 *
 * @complexity The time complexity of this function is O(V + E), where V is the number of nodes
 *             (vertices) and E is the number of edges in the graph. This is because each node
 *             and edge is visited at most once during the breadth-first search (BFS).
 *
 * @example
 * ```typescript
 * const adj: Map<string, string[]> = new Map([
 *   ['A', ['B']],
 *   ['B', ['A', 'C']],
 *   ['C', ['B']],
 *   ['D', []],
 * ]);
 * const components = connectedComponents(adj);
 * console.log(components); // [['A', 'B', 'C'], ['D']]
 * ```
 *
 *
 */
export function connectedComponents(adj: AdjacencyMap): string[][] {
    const visited = new Set<string>();
    const comps: string[][] = [];

    for (const start of adj.keys()) {
        if (visited.has(start)) continue;

        const queue: string[] = [start];
        visited.add(start);
        const nodes: string[] = [];

        while (queue.length > 0) {
            const u = queue.shift()!;
            nodes.push(u);

            for (const v of adj.get(u) ?? []) {
                if (!visited.has(v)) {
                    visited.add(v);
                    queue.push(v);
                }
            }
        }

        comps.push(nodes);
    }

    comps.sort((a, b) => b.length - a.length);
    return comps;
}
