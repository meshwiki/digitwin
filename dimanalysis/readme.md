# Fractal dimension analysis

## Introduction and problem statement.

We present an investigation into the fractal dimension of the Dutch Meshcore network [1](https://en.wikipedia.org/wiki/Fractal_dimension_on_networks). While a high dimensional network can be beneficial for peer to peer messages, it is detrimental for flood networks, as the network tries to propagate a message faster than it is physically capable of [citation needed].

The physical network is two dimensional as the earth is locally flat in the Netherlands [citation needed]. Nodes with a high number of direct neigbors give rise to local pockets of high dimensionality, which can cause congestion issues.

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

# References

1: <https://en.wikipedia.org/wiki/Fractal_dimension_on_networks>
2: <https://mc-radar.woodwar.com/>
