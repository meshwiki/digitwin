import { RegressionResult } from "../types";

export function linearRegression(
    xs: number[],
    ys: number[]
): RegressionResult | null {
    const n = xs.length;
    if (n < 2) return null;

    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;

    let sxx = 0;
    let sxy = 0;
    let syy = 0;

    for (let i = 0; i < n; i++) {
        const dx = xs[i] - meanX;
        const dy = ys[i] - meanY;
        sxx += dx * dx;
        sxy += dx * dy;
        syy += dy * dy;
    }

    if (sxx === 0) return null;

    const slope = sxy / sxx;
    const intercept = meanY - slope * meanX;

    let sse = 0;
    for (let i = 0; i < n; i++) {
        const yhat = intercept + slope * xs[i];
        const err = ys[i] - yhat;
        sse += err * err;
    }

    const r2 = syy === 0 ? 1 : 1 - sse / syy;

    return { slope, intercept, r2 };
}
