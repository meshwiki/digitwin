import path from "path";
import fs from "fs";

import { LinkRecord } from "../types";

export function readJson(filePath: string): LinkRecord[] {
    const abs = path.resolve(filePath);
    const raw = fs.readFileSync(abs, "utf8");
    const data: unknown = JSON.parse(raw);

    if (!Array.isArray(data)) {
        throw new Error("Input JSON must be an array");
    }

    return data as LinkRecord[];
}
