# MeshCore Digital Twin, Project Primer

## Purpose

The MeshCore network is a decentralized mesh communication system where repeaters relay messages across a dynamic, partially observable topology. Understanding how messages propagate through this network — and how configuration changes affect performance — is difficult to evaluate in the real world alone.

The **MeshCore Digital Twin** project aims to create a **simulation model of the real MeshCore network in the Netherlands**, allowing experimentation with repeater configurations and network behavior without affecting the live network.

This digital twin will allow us to:

- Reconstruct and approximate the **current state of the MeshCore network**
- Analyze **message propagation patterns**
- Test **configuration changes and protocol strategies**
- Evaluate **network resilience and coverage**
- Inform improvements to repeater configuration and deployment strategies

The model will use **observed message propagation data from the Let's Mesh observer network** to approximate the real network topology and behavior.

---

# Concept Overview

Observers in the Let's Mesh network log messages that pass through them, including:

- message identifiers
- timestamps
- propagation paths
- nodes that relayed the message

While this data does not contain full configuration details of each repeater, it provides valuable insights into:

- neighborhood relationships between nodes
- propagation timing
- message reach
- relay patterns

By combining these observations with a simulation model, we can construct a **probabilistic representation of the network**.

The digital twin will therefore not be an exact replica of the network, but a **calibrated model whose behavior matches observed propagation patterns**.

---

# Two-Step Modeling Strategy

The project follows a two-stage approach.

## Step 1 — Repeater Parameter Estimation

The first step is to infer likely repeater configuration parameters for nodes observed in the network.

Observers provide message propagation traces but not the internal configuration of each repeater. Therefore, we need a method to estimate these parameters.

The goal is to determine **a plausible set of repeater characteristics** that could produce the observed message propagation patterns.

This can be done through:

- statistical inference
- optimization against observed data
- parameter search
- probabilistic modeling

The process is iterative:

1. Start with an initial guess of repeater parameters.
2. Simulate message propagation using these parameters.
3. Compare simulated propagation with observed propagation.
4. Adjust parameters to reduce the difference.

To validate this step, a small number of real repeaters may be queried for their configuration, allowing comparison between **estimated parameters and ground truth**.

This calibration stage produces a **parameterized digital representation of the real network**.

---

## Step 2 — Network Simulation and Experimentation

Once reasonable parameter estimates exist, the digital twin can be used to simulate network behavior under different scenarios.

Possible experiments include:

- adjusting repeater parameters
- testing alternative relay strategies
- evaluating message latency and reach
- testing repeater density and placement strategies
- studying network resilience under node failures

This stage allows the MeshCore community to **experiment safely and systematically**, generating insights that would be difficult or disruptive to test on the live network.

---

# Modeling Scope and Fidelity

The digital twin will model the network at a **behavioral level**, focusing on:

- node connectivity
- message propagation
- relay decisions
- transmission timing

The goal is not to simulate physical radio signals at the RF level, but to capture the **logical behavior of the mesh network**.

This level of fidelity allows the model to remain computationally tractable while still producing useful insights.

---

# Adjustable Repeater Parameters

To simulate the network realistically, the model must represent configurable repeater characteristics.

Below is an initial proposed set of parameters that the digital twin should support.

These parameters represent the behavior of repeaters rather than the exact firmware configuration.

---

## 1. Transmission Characteristics

These parameters influence how messages physically propagate.

- **Transmission range**
  Effective communication distance between nodes.

- **Transmit power level**
  Influences probability of successful delivery at distance.

- **Packet success probability**
  Probability that a transmission succeeds given distance and conditions.

- **Channel congestion sensitivity**
  Likelihood that a node defers or drops transmission due to channel activity.

---

## 2. Relay Behavior

These parameters govern how repeaters decide to forward messages.

- **Relay probability**
  Probability a node will relay a received message.

- **Maximum relay count / hop limit**

- **Relay delay distribution**
  Delay before forwarding a message.

---

## 3. Node Topology Characteristics

These parameters affect how nodes connect and interact.

- **Neighbor detection radius**

- **Link stability factor**
  Probability that a link remains active over time.

---

## 4. Environmental Factors

These parameters represent external influences on the network.

- **Interference level**

- **Terrain / urban density factor**

- **Time-of-day traffic patterns**

---

# Expected Outcomes

Once operational, the MeshCore digital twin will enable:

- evaluation of configuration strategies before deployment
- network coverage analysis
- optimization of repeater placement
- understanding of propagation bottlenecks
- improved reliability of message delivery

It will also provide a foundation for future work such as:

- automated parameter tuning
- network planning tools
- visualization of real-time network health

---

# Next Steps

Immediate next steps for the project include:

1. Define the simulation framework and architecture.
2. Import and analyze observer propagation data.
3. Build a baseline network topology model.
4. Implement the repeater parameter estimation process.
5. Validate model behavior against real-world propagation traces.
