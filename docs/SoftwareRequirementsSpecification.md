## KNIT HAPPENS - Software Requirements Specification

# Software Requirements Specification (SRS)

Structure: ISO/IEC/IEEE 29148:2018, example outline (8.5.2, Figure 8). Content rules: 9.2 (general) and 9.6 (SRS).
The `[9.6.x]` tags show which clause governs each section. Delete them in the final version.

---

## Identification [9.2.1]
- Title:
- Project name:
- Document version:
- Date of release:
- Approved by / signature:

### Revision notice
| Version | Date | Sub-clauses changed | Author |
|---------|------|---------------------|--------|
| 0.1 | 2026-10-15 | Initial draft | |

## Front matter [9.2.2]
- Table of contents
- List of figures
- List of tables

---

## 1. Introduction

### 1.1 Purpose [9.6.2]
<!-- The purpose of the software to be specified. -->

### 1.2 Scope [9.6.3]
- a) Software product(s) to be produced, by name:
- b) What the product(s) will do:
- c) Application of the software: benefits, objectives, goals:
- d) Consistency with higher-level specifications (e.g. SyRS), if any:

### 1.3 Product overview

#### 1.3.1 Product perspective [9.6.4]
Relationship to other related products. If part of a larger system: relate its requirements to the product, and identify the interfaces. A block diagram is recommended.

- 1.3.1.1 System interfaces [9.6.4.1]
- 1.3.1.2 User interfaces [9.6.4.2]
- 1.3.1.3 Hardware interfaces [9.6.4.3]
- 1.3.1.4 Software interfaces [9.6.4.4] (per product: name, mnemonic, spec number, version, source; purpose; message content and format)
- 1.3.1.5 Communications interfaces [9.6.4.5]
- 1.3.1.6 Memory constraints [9.6.4.6]
- 1.3.1.7 Operations [9.6.4.7] (modes, interactive/unattended periods, data processing support, backup and recovery)
- 1.3.1.8 Site adaptation requirements [9.6.4.8]
- 1.3.1.9 Interfaces with services [9.6.4.9] (SaaS, cloud)

#### 1.3.2 Product functions [9.6.5]
<!-- Summary of major functions only, no detail. Use cases / user stories / scenarios allowed. -->

**USE CASE DIAGRAM GOES HERE**

#### 1.3.3 User characteristics [9.6.6]
<!-- General characteristics of user groups: education, experience, disabilities, technical expertise. Describe, do not state requirements. -->

#### 1.3.4 Limitations [9.6.7]
<!-- Items limiting the supplier's options: regulatory, hardware, interfaces, quality, criticality, safety/security, etc. -->

### 1.4 Definitions [9.2.3]
<!-- Words/phrases with special meaning beyond dictionary definitions. -->

---

## 2. References [9.2.4]
For each document: title, report number (if any), date, publishing organization, source.

### 2.1 Compliance (cited documents that contain requirements included here)

### 2.2 Guidance (cited documents with information only)

---

## 3. Requirements [9.6.10]
Each requirement must: conform to the 29148 5.2 characteristics, be uniquely identifiable, be cross-referenced to related documents, and describe every input (stimulus), every output (response), and all functions performed in response to an input or in support of an output.

Organization of this section (by feature, user class, mode, etc.): <TBD>

Apportioning [9.6.9]: requirements spanning several software elements, and requirements deferred to future increments: <TBD>

### 3.1 Functions [9.6.12]
Validity checks on inputs, exact sequence of operations, responses to abnormal situations (overflow, communication, hardware faults, error handling and recovery), effect of parameters, relationship of outputs to inputs.

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| | | | | |

### 3.2 Performance requirements [9.6.14]
Static (capacity: users, terminals, data volume) and dynamic (transactions per time, normal and peak load). Must be measurable.

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| | | | | |

### 3.3 Usability requirements [9.6.13]
Effectiveness, efficiency, satisfaction, avoidance of harm in specific contexts of use.

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| | | | | |

### 3.4 Interface requirements [9.6.11]
All inputs and outputs. Complements 1.3.1, does not repeat it. Per interface: name, purpose, source/destination, valid range/accuracy/tolerance, units, timing, relationships to other I/O, data formats, command formats, data items.

| ID | Name | Purpose | Source / Destination | Range / Units | Timing | Format | Data items |
|----|------|---------|----------------------|---------------|--------|--------|------------|
| | | | | | | | |

### 3.5 Logical database requirements [9.6.15]
Types of information, frequency of use, access capabilities, data entities and relationships, integrity constraints, security, data retention.

### 3.6 Design constraints [9.6.16]
Constraints from external standards, regulations, project limitations.

#### 3.6.1 Standards compliance [9.6.17]
Report format, data naming, accounting procedures, audit tracing.

### 3.7 Software system attributes [9.6.18]
#### 3.7.1 Reliability
#### 3.7.2 Availability
#### 3.7.3 Security
#### 3.7.4 Maintainability
#### 3.7.5 Portability

### 3.8 Supporting information [9.6.20]
Sample I/O formats, cost analyses, user surveys, background information, problems to be solved, packaging instructions.
State explicitly whether this information is part of the requirements: <YES / NO>

---

## 4. Verification [9.6.19]
Parallel to the subsections of Section 3 (3.1 to 3.7). Approaches and methods planned to qualify the software.

| Section | Requirement ID | Method (inspection / analysis / demonstration / test) | Criteria |
|---------|----------------|-------------------------------------------------------|----------|
| | | | |

---

## 5. Appendices

### 5.1 Assumptions and dependencies [9.6.8]
Factors that affect the requirements. Not design constraints. If they change, the requirements may change.

### 5.2 Acronyms and abbreviations [9.2.5]
