# Parameter simulation

The first step is to infer likely repeater configuration parameters for nodes observed in the network.

Observers provide message propagation traces but not the internal configuration of each repeater. Therefore, we need a method to estimate these parameters.

The goal is to determine **a plausible set of repeater characteristics** that could produce the observed message propagation patterns.

This can be done through:

-   statistical inference
-   optimization against observed data
-   parameter search
-   probabilistic modeling

The process is iterative:

1. Start with an initial guess of repeater parameters.
2. Simulate message propagation using these parameters.
3. Compare simulated propagation with observed propagation.
4. Adjust parameters to reduce the difference.

To validate this step, a small number of real repeaters may be queried for their configuration, allowing comparison between **estimated parameters and ground truth**.

This calibration stage produces a **parameterized digital representation of the real network**.
