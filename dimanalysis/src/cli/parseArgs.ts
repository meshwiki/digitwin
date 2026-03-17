import { CliArgs } from "../types";

function printHelpAndExit(code: number) {
    console.log(`
Estimate fractal dimension of a graph from proven-links.json.

Options:
  --file <path>         Input JSON file (default: proven-links.json)
  --confidence <n>      Minimum confidence threshold (default: 70)
  --min-box <n>         Minimum box size lB in hops (default: 2)
  --max-box <n>         Maximum box size lB in hops (default: 8)
  --component <mode>    all | giant (default: giant)
  --verbose             Print extra details
  -h, --help            Show this help

Examples:
  npx ts-node fractal-dimension.ts --file proven-links.json --confidence 30
  npx ts-node fractal-dimension.ts --file proven-links.json --confidence 50 --component giant
`);
    process.exit(code);
}

export function parseArgs(argv: string[]): CliArgs {
    const args: CliArgs = {
        file: "proven-links.json",
        confidence: 70,
        minBox: 2,
        maxBox: null,
        component: "giant",
        verbose: false,
    };

    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];

        if (a === "--file" && argv[i + 1]) {
            args.file = argv[++i];
        } else if (a === "--confidence" && argv[i + 1]) {
            args.confidence = Number(argv[++i]);
        } else if (a === "--min-box" && argv[i + 1]) {
            args.minBox = Number(argv[++i]);
        } else if (a === "--max-box" && argv[i + 1]) {
            args.maxBox = Number(argv[++i]);
        } else if (a === "--component" && argv[i + 1]) {
            const value = argv[++i];
            if (value === "all" || value === "giant") {
                args.component = value;
            } else {
                console.error(`Invalid --component value: ${value}`);
                printHelpAndExit(1);
            }
        } else if (a === "--verbose") {
            args.verbose = true;
        } else if (a === "--help" || a === "-h") {
            printHelpAndExit(0);
        } else {
            console.error(`Unknown argument: ${a}`);
            printHelpAndExit(1);
        }
    }

    if (!Number.isFinite(args.confidence)) {
        console.error("--confidence must be a number");
        process.exit(1);
    }

    if (!Number.isInteger(args.minBox) || args.minBox < 1) {
        console.error("--min-box must be an integer >= 1");
        process.exit(1);
    }

    if (
        args.maxBox !== null &&
        (!Number.isInteger(args.maxBox) || args.maxBox < args.minBox)
    ) {
        console.error("--max-box must be an integer >= min-box");
        process.exit(1);
    }

    return args;
}
