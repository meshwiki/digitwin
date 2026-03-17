import { AdjacencyMap } from "../types";

/**
 * Generates an induced subgraph from a given adjacency map and a set of nodes.
 * The induced subgraph contains only the specified nodes and the edges between them.
 *
 * This function has a time complexity of O(V + E), where V is the number of nodes
 * in the input `nodes` array, and E is the total number of edges in the adjacency
 * map that are connected to the nodes in `nodes`.
 *
 * @param adj - The adjacency map representing the original graph. It maps each node
 *              to a set of its neighboring nodes.
 * @param nodes - An array of node identifiers to include in the induced subgraph.
 *
 * @returns A new adjacency map representing the induced subgraph, where the keys
 *          are the specified nodes and the values are sets of their neighbors
 *          within the induced subgraph.
 */
export function inducedSubgraph(
    adj: AdjacencyMap,
    nodes: string[]
): AdjacencyMap {
    const set = new Set(nodes);
    const sub: AdjacencyMap = new Map();

    for (const u of nodes) {
        const nbrs = new Set<string>();
        for (const v of adj.get(u) ?? []) {
            if (set.has(v)) nbrs.add(v);
        }
        sub.set(u, nbrs);
    }

    return sub;
}
