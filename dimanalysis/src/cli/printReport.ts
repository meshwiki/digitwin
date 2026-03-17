import { AnalysisResult, CliArgs } from "../types";

export function printReport(result: AnalysisResult, args: CliArgs): void {
    console.log("=== Graph summary ===");
    console.log(`Confidence threshold: >= ${args.confidence}`);
    console.log(`Graph mode: ${args.component}`);
    console.log(`Minimum box size: ${args.minBox}`);
    console.log(`Maximum box size: ${args.maxBox}`);
    console.log(`Nodes (full filtered graph): ${result.nodeCount}`);
    console.log(`Edges (full filtered graph): ${result.edgeCount}`);
    console.log(`Connected components: ${result.components.length}`);
    console.log(`Largest component size: ${result.components[0]?.length ?? 0}`);
    console.log(`Working node count: ${result.workingNodeCount}`);
    console.log(`Working graph diameter: ${result.diameter}`);
    console.log("");

    console.log("=== Box counting data ===");
    console.log("lB\tradius\tN_B\tlog(lB)\tlog(N_B)");
    for (const row of result.rows) {
        console.log(
            `${row.lB}\t${row.radius}\t${row.NB}\t${row.log_lB.toFixed(
                6
            )}\t${row.log_NB.toFixed(6)}`
        );
    }
    console.log("");

    console.log("=== Fit ===");
    if (!result.regression || result.fractalDimension === null) {
        console.log("Not enough usable points to estimate fractal dimension.");
        return;
    }

    console.log(`log(N_B) = a + b * log(lB)`);
    console.log(`b = ${result.regression.slope.toFixed(6)}`);
    console.log(`a = ${result.regression.intercept.toFixed(6)}`);
    console.log(`R^2 = ${result.regression.r2.toFixed(6)}`);
    console.log("");
    console.log(
        `Estimated fractal dimension d_B = ${result.fractalDimension.toFixed(
            6
        )}`
    );
}
