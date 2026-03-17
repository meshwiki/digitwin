# Fractal dimension analysis

## Introduction and problem statement.

We present an investigation into the fractal dimension of the Dutch Meshcore network [1](https://en.wikipedia.org/wiki/Fractal_dimension_on_networks). While a high dimensional network can be beneficial for peer to peer messages, it is detrimental for flood networks, as the network tries to propagate a message faster than it is physically capable of [citation needed].

The physical network is two dimensional as the earth is locally flat in the Netherlands [citation needed]. Nodes with a high number of direct neigbors give rise to local pockets of high dimensionality, which can cause congestion issues.

For an idealized physical deployment in the Netherlands, the network is expected to behave approximately as a **two-dimensional system**, since nodes are distributed over a geographically flat area. However, the logical structure of the mesh network can deviate significantly from this:

-   Nodes with many neighbors create **locally dense clusters**
-   These clusters introduce **higher effective dimensionality**
-   Increased dimensionality leads to **faster message branching**

This has direct implications for flood-based message propagation:

-   Higher dimensionality increases **redundancy and propagation speed**
-   However, it also increases **network load and congestion risk**
-   In extreme cases, message propagation can outpace the network’s capacity to handle transmissions efficiently

## Further reading:

-   [The Broadcast Storm Problem in a Mobile Ad Hoc Network - SY Ni, YC Tseng, YS Chen, JP Sheu 2002](https://www.csie.ntpu.edu.tw/~yschen/mypapers/winet2002.pdf)
-   [BROADCAST STORM MITIGATION TECHNIQUES IN VEHICULAR AD HOC NETWORKS - N WISITPONGPHAN, OK TONGUZ 2007](https://ashikur.buet.ac.bd/CSE6811/BroadcastStormVANET.pdf)

## Source data

We use link data retrieved from mc-radar [2](https://mc-radar.woodwar.com/). A sample is provided in [this sample file](./sample-links.json). This file contains records for links with the following data:

```json
    {
        "node_a": "[pubkeyA]",
        "node_b": "[pubkeyB]",
        "confidence": 30,
        "distance_km": 0.188,
        "last_verified": "2026-03-16T08:59:25.130Z",
        "node_a_name": "[nameA]",
        "node_a_location": { "latitude": 52.16091, "longitude": 4.47077 },
        "node_b_name": "[nameB]",
        "node_b_location": { "latitude": 52.162439, "longitude": 4.469613 }
    },
```

We then filter the data by a threshold for the confidence score. Various thresholds were tested to gain some insight in the variability.

## preliminary results

Looking at confidence threshold 70

| Confidence threshold | Min box | Max box | Fit b     | Fit a    | Fit R^2  | Dimension |
| -------------------- | ------- | ------- | --------- | -------- | -------- | --------- |
| 70                   | 2       | -       | -3.067132 | 9.030946 | 0.976930 | 3.067132  |
| 70                   | 2       | 8       | -3.350582 | 9.436303 | 0.948451 | 3.350582  |
| 80                   | 2       | -       | -3.058155 | 9.005304 | 0.976918 | 3.058155  |
| 80                   | 2       | 8       | -3.357122 | 9.430567 | 0.949646 | 3.357122  |
| 90                   | 2       | -       | -2.472314 | 7.531301 | 0.949646 | 2.472314  |
| 90                   | 2       | 8       | -2.906182 | 8.148710 | 0.939007 | 2.906182  |

## discussion

The Dutch network seems to have a high global dimension of about 3. Locally even higher. This can become a problem for flood networks.

## Script parameters

### `--file <path>`

Input JSON file with link data.

-   Default: `proven-links.json`
-   Larger files increase runtime significantly

---

### `--confidence <n>`

Minimum confidence required for a link to be included.

-   Default: `70`
-   Higher:

    -   fewer edges
    -   faster
    -   more reliable topology

-   Lower:

    -   more edges
    -   slower
    -   more noise

---

### `--component <all | giant>`

Which part of the graph to analyze.

-   Default: `giant`
-   `giant`: only largest connected component (recommended, faster, more meaningful)
-   `all`: includes all components (slower, can skew results)

---

### `--min-box <n>`

Minimum box size (`lB`) to evaluate.

-   Default: `2`
-   Recommended: `2`
-   Very small values are usually not informative

---

### `--max-box <n>`

Maximum box size (`lB`) to evaluate.

-   Default: null (graph diameter)
-   Lower values:

    -   faster
    -   focus on useful scaling region

-   Higher values:
    -   slower
    -   eventually collapse to trivial result (`N_B ≈ 1`)

---

### `--verbose`

Enable extra logging.

-   Default: off
-   No effect on results

---

## Quick recommendation

For most cases:

```bash
--confidence 70 --component giant --min-box 2 --max-box 8
```

# References

-   1: <https://en.wikipedia.org/wiki/Fractal_dimension_on_networks>
-   2: <https://mc-radar.woodwar.com/>
