import { AdjacencyMap, DistanceMap } from "../types";

/**
 * Computes the shortest distances from a source node to all other nodes
 * in an unweighted graph using Breadth-First Search (BFS).
 *
 * Time Complexity: O(V + E), where V is the number of vertices (nodes) and E is the number of edges.
 * Space Complexity: O(V), as we store the distance map and the queue, both of which scale with the number of nodes.
 *
 * @param adj - An adjacency map representing the graph, where the keys are node identifiers
 *              and the values are arrays of adjacent node identifiers.
 * @param source - The identifier of the source node from which distances are calculated.
 * @returns A map where the keys are node identifiers and the values are the shortest
 *          distances from the source node.
 */
export function bfsDistances(adj: AdjacencyMap, source: string): DistanceMap {
    const dist: DistanceMap = new Map();
    const queue: string[] = [source];
    dist.set(source, 0);

    for (let qi = 0; qi < queue.length; qi++) {
        const u = queue[qi];
        const du = dist.get(u)!;

        for (const v of adj.get(u) ?? []) {
            if (!dist.has(v)) {
                dist.set(v, du + 1);
                queue.push(v);
            }
        }
    }

    return dist;
}
