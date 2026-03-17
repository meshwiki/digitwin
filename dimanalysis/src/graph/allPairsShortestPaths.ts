import { AdjacencyMap, AllPairsDistances } from "../types";
import { bfsDistances } from "./bfsDistances";

/**
 * Computes the all-pairs shortest paths (APSP) and the diameter of a graph.
 *
 * This function takes an adjacency map representation of a graph and calculates
 * the shortest path distances between all pairs of nodes using a breadth-first search (BFS).
 * It also determines the diameter of the graph, which is the longest shortest path
 * between any two nodes.
 *
 * @param adj - The adjacency map of the graph, where the keys are nodes and the values
 *              are maps representing the neighbors and their respective edge weights.
 *
 * @returns An object containing:
 * - `apsp`: A map where each key is a node, and the value is another map representing
 *           the shortest distances from the key node to all other nodes.
 * - `diameter`: The diameter of the graph, which is the maximum shortest path distance
 *               between any two nodes.
 *
 * @remarks
 * - The graph is assumed to be unweighted, and the BFS algorithm is used to compute distances.
 * - If the graph is disconnected, the diameter will be the longest shortest path within
 *   the largest connected component.
 *
 * @complexity
 * - Time complexity: O(V * (V + E)), where V is the number of vertices and E is the number
 *   of edges in the graph. This is due to performing a BFS (O(V + E)) for each vertex.
 * - Space complexity: O(V^2) for storing the APSP distances.
 */
export function allPairsShortestPaths(adj: AdjacencyMap): {
    apsp: AllPairsDistances;
    diameter: number;
} {
    const apsp: AllPairsDistances = new Map();
    let diameter = 0;

    for (const u of adj.keys()) {
        const d = bfsDistances(adj, u);
        apsp.set(u, d);

        for (const val of d.values()) {
            if (val > diameter) diameter = val;
        }
    }

    return { apsp, diameter };
}
