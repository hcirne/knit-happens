# Software Requirements Specification (SRS)

## Writing conventions (course rules)
1. Items that are not relevant stay in the document and contain the comment: **not applicable (n/a)**.
2. Items not known yet are marked: **to be determined (tbd)**.
3. No empty sections. Every section has content, `n/a` or `tbd`.

## Identification
- Title: Software Requirements Specification
- Project name: Knit Happens
- Date of release: 16/10/2026
- Approved by / signature: KNIT HAPPENS

### Revision notice
The revision notices will be tracked using Git.

## Front matter 

- [Writing conventions (course rules)](#writing-conventions-course-rules)
- [Identification](#identification)
  - [Revision notice](#revision-notice)
- [Front matter](#front-matter)
- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Product overview](#13-product-overview)
    - [1.3.1 Product perspective](#131-product-perspective)
    - [1.3.2 Product functions](#132-product-functions)
      - [Overall Use Case Diagram (UCD)](#overall-use-case-diagram-ucd)
    - [1.3.3 User characteristics](#133-user-characteristics)
    - [1.3.4 Limitations](#134-limitations)
  - [1.4 Definitions](#14-definitions)
- [2. References](#2-references)
- [3. Requirements](#3-requirements)
  - [3.1 Functions](#31-functions)
  - [3.2 Performance requirements](#32-performance-requirements)
  - [3.3 Usability requirements](#33-usability-requirements)
  - [3.4 Interface requirements](#34-interface-requirements)
  - [3.5 Logical database requirements](#35-logical-database-requirements)
  - [3.6 Design constraints](#36-design-constraints)
    - [3.6.1 Standards compliance](#361-standards-compliance)
  - [3.7 Software system attributes](#37-software-system-attributes)
    - [3.7.1 Reliability](#371-reliability)
    - [3.7.2 Availability](#372-availability)
    - [3.7.3 Security](#373-security)
    - [3.7.4 Maintainability](#374-maintainability)
    - [3.7.5 Portability](#375-portability)
  - [3.8 Supporting information](#38-supporting-information-9620)
- [4. Verification](#4-verification)
- [5. Appendices](#5-appendices)
  - [5.1 Assumptions and dependencies](#51-assumptions-and-dependencies)
  - [5.2 Acronyms and abbreviations](#52-acronyms-and-abbreviations)

## 1. Introduction

### 1.1 Purpose

This Software Requirement Specification (SRS) describes the requirements for KNIT HAPPENS, a web application for knitting enthusiasts. Knitters currently move between different platforms to find patterns, get inspiration and buy yarn. KNIT HAPPENS brings these into a single place where users can share projects, list and buy patterns, and list the materials and stores used for each project. This document is intended for the project team behind KNIT HAPPENS, the lecturer, and anyone who builds or tests the software.

### 1.2 Scope

- **a)** Software product(s) to be produced: a web application called KNIT HAPPENS \
- **b)** What the product(s) will do: Let users post projects, like and comment on them, in a project feed. Let users list patterns and buyers purchase them. Link the materials and stores used in each project.
- **c)** Benefits, objectives, goals: Give knitters one place for inspiration, patterns and yarn sources. Goal for the December delivery: the ability for users to create an account and login; they should also be able to experiment the social area by exploring it, sharing projects, and commenting on them.
- **d)** Higher-level specifications: n/a (no SyRS exists for this project).

### 1.3 Product overview

#### 1.3.1 Product perspective
KNIT HAPPENS is a new, standalone product. It is not part of a larger system. Users reach it through a web browser. The data is stored on a server. A block diagram goes here (tbd).

- System interfaces: n/a (standalone product)
- User interfaces: tbd (Figma mockups)
- Hardware interfaces: n/a (no special hardware beyond a computer or smartphone with a browser)
- Software interfaces: tbd
- Communications interfaces: tbd
- Memory constraints: tbd
- Operations: tbd
- Site adaptation requirements: n/a
- Interfaces with services: tbd

#### 1.3.2 Product functions

- Manage a user account.
- Share projects in a feed, with likes and comments.
- Link materials and stores to a project.
- List patterns for sale.
- Buy patterns.
- Find yarn stores on a map (stretch goal).

##### Overall Use Case Diagram (UCD)

![Use Case Diagram](https://raw.githubusercontent.com/hcirne/knit-happens/refs/heads/main/docs/W3_UseCaseDiagram.png)

<!-- Embed from a cloud-hosted diagram (see "UCD embedding" below) so edits to the original propagate here automatically. Do NOT paste a static screenshot. -->

Legend: 
- Actor: stick figure 
- Use case: ellipse
- System boundary: rectangle labelled with the system name
- Association: solid line between actor and use case
- Dependency: dashed arrow with `<<include>>` or `<<extend>>`
- Scope (December delivery): the 5 use cases in scope are filled in color. All others stay uncolored (or grey).

#### 1.3.3 User characteristics

- Knitters: browse, post and comment; assumed comfortable with applications and willing to create an account.
- Designers: list and sell their own patterns; may be the same people as knitters.
- Buyers: buy patterns; may be the same people as knitters.

#### 1.3.4 Limitations

- Payment system is out of scope.
- Knitting only.
- Time limit: six months of work spread across two semesters.
- No copyright checks or moderation.
- Required technologies: tbd.

### 1.4 Definitions
tbd

| Term | Definition |
| --- | --- |
| Knit Happens | The software product specified in this document. |
| User | Any person who uses Knit Happens.
| Knitter | A user who browses, posts and comments on projects. |
| Designer | A user who lists patterns for sale. |
| Buyer	| A user who purchases a pattern. |
| Pattern | A knitting instructions document, listed for sale by a designer.|
| Project | A finished or ongoing knitting work that a user posts, with photos and details. |
| Project feed | The list of projects posted by users, where they can be liked and commented on.|
| Material | A yarn or other item that a user links to a project. |
| Store | A shop that sells yarn or materials and can be linked to a project. |
| Marketplace | The part of Knit Happens where patterns are listed and bought.|
| Listing | A pattern offered for sale in the marketplace, with its price.|

## 2. References

| Ref | Title | Number | Date | Publisher | Source |
|-----|-------|--------|------|-----------|--------|
| [1] | Systems and software engineering: Life cycle processes: Requirements engineering | ISO/IEC/IEEE 29148 | 2018-11 | ISO, IEC, IEEE | ISO store, IEEE Xplore |
| [2] | UML Use Case Diagrams (Topic 6, CSE 308 Design Project I) | n/a | n/a (accessed 2026-10-18) | Design Project I Notes | https://ayan-1829.github.io/CSE-308-Design-Project-I/topics/06-uml-use-case-diagrams.html |


## 3. Requirements
Each requirement must: conform to the 29148 5.2 characteristics, be uniquely identifiable, be cross-referenced to related documents, and describe every input (stimulus), every output (response), and all functions performed in response to an input or in support of an output.

Organization of this section (by feature, user class, mode, etc.): <TBD>

Apportioning: requirements spanning several software elements, and requirements deferred to future increments: <TBD>

### 3.1 Functions
Validity checks on inputs, exact sequence of operations, responses to abnormal situations (overflow, communication, hardware faults, error handling and recovery), effect of parameters, relationship of outputs to inputs.

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| | | | | |

### 3.2 Performance requirements
Static (capacity: users, terminals, data volume) and dynamic (transactions per time, normal and peak load). Must be measurable.

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| | | | | |

### 3.3 Usability requirements
Effectiveness, efficiency, satisfaction, avoidance of harm in specific contexts of use.

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| | | | | |

### 3.4 Interface requirements
All inputs and outputs. Complements 1.3.1, does not repeat it. Per interface: name, purpose, source/destination, valid range/accuracy/tolerance, units, timing, relationships to other I/O, data formats, command formats, data items.

| ID | Name | Purpose | Source / Destination | Range / Units | Timing | Format | Data items |
|----|------|---------|----------------------|---------------|--------|--------|------------|
| | | | | | | | |

### 3.5 Logical database requirements
Types of information, frequency of use, access capabilities, data entities and relationships, integrity constraints, security, data retention.

Entities and relationships: a User has many Projects; a Project has many Comments; a User has many Comments. Frequency of use: tbd (the feed is read far more often than it is written). Access: visitors read projects and comments; registered users also create projects and comments.

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| DR-001 | The system shall store for each user a username, an email address and a password hash. | High | UCD (UC-01) | Inspection |
| DR-002 | The system shall keep each email address unique across all accounts. | High | UCD (UC-01) | Test |
| DR-003 | The system shall store for each project a title, at least one photo, a description (tbd: required or optional), its author and its publication date. | High | UCD (UC-03) | Inspection |
| DR-004 | The system shall store for each comment its text, its author, its time and the project it belongs to. | High | UCD (UC-05) | Inspection |
| DR-005 | The system shall keep data for tbd (retention period), and shall handle the content of a deleted account as tbd. | Low | tbd | tbd |

### 3.6 Design constraints
Constraints from external standards, regulations, project limitations.

- Technologies: The team currently assumes React, Java with Spring Boot and Maven, PostgreSQL, and Docker on a Linux server (see the Tech stack document). These become design constraints only if the course or the client mandates them.
- Time: the first delivery (December) covers the five use cases marked in the UCD (UC-01 to UC-05).
- Regulations: tbd (e.g. data protection rules for user accounts and photos).

#### 3.6.1 Standards compliance
Report format, data naming, accounting procedures, audit tracing.

- Report format: n/a (the software produces no reports)
- Data naming: tbd
- Accounting procedures: n/a (no real payments)
- Audit tracing: tbd

### 3.7 Software system attributes
#### 3.7.1 Reliability
tbd
#### 3.7.2 Availability
tbd
#### 3.7.3 Security

| ID | Requirement | Priority | Source | Verification |
|----|-------------|----------|--------|--------------|
| SEC-001 | The system shall store passwords only in hashed form, never as plain text. | High | UCD (UC-01, UC-02) | Inspection |
| SEC-002 | The system shall protect data exchanged between the user's device and the system against reading by third parties (tbd: method). | High | UCD | Test |
| SEC-003 | The system shall allow only logged-in users to share projects and comment on projects (see FR-009). | High | UCD (UC-02) | Test |

#### 3.7.4 Maintainability
tbd
#### 3.7.5 Portability
tbd (supported browsers and devices; depends on the web or mobile decision in 1.1)

### 3.8 Supporting information
Sample I/O formats, cost analyses, user surveys, background information, problems to be solved, packaging instructions.

- About document (project goals and assumptions): background information
- Tech stack document: background information
- Overall Use Case Diagram: source file kept in the cloud (tbd: link)

State explicitly whether this information is part of the requirements: NO. It is background only.

---

## 4. Verification
Parallel to the subsections of Section 3 (3.1 to 3.7). Approaches and methods planned to qualify the software.

| Section | Requirement ID | Method (inspection / analysis / demonstration / test) | Criteria |
|---------|----------------|-------------------------------------------------------|----------|
| 3.1 | FR-001 | Test | A visitor who enters a valid username, email and password gets an account. |
| 3.1 | FR-002 | Test | Empty fields and invalid emails are rejected, and the wrong field is named. |
| 3.1 | FR-003 | Test | A second registration with the same email is rejected with an error message. |
| 3.1 | FR-004 | Test | A password shorter than the minimum (tbd) is rejected. |
| 3.1 | FR-005 | Test | After registration, a confirmation is shown and the tbd behavior occurs. |
| 3.1 | FR-006 | Test | A registered user with the correct email and password is logged in. |
| 3.1 | FR-007 | Test | An unknown email and a wrong password both give the same single error message. |
| 3.1 | FR-008 | Test | After tbd minutes of inactivity, the session ends and a login is required. |
| 3.1 | FR-009 | Test | A visitor who tries to share or comment is prompted to log in or create an account. |
| 3.1 | FR-010 | Test | A logged-in user who enters the required fields can share a project. |
| 3.1 | FR-011 | Test | A project without a title or without a photo is rejected with an error message. |
| 3.1 | FR-012 | Test | Photos within the format and size limits (tbd) are accepted, other files are rejected. |
| 3.1 | FR-013 | Test | A project with more than the maximum number of photos (tbd) is rejected. |
| 3.1 | FR-014 | Test | A shared project appears in the feed with its author and date. |
| 3.1 | FR-015 | Test | A visitor sees the feed, with the newest project first. |
| 3.1 | FR-016 | Test | Each feed item shows title, first photo, author, date and comment count. |
| 3.1 | FR-017 | Test | The feed shows tbd projects per page and loads further projects on request. |
| 3.1 | FR-018 | Test | Opening a project shows all photos, the description and the comments. |
| 3.1 | FR-019 | Test | With no projects, the feed shows a message saying so. |
| 3.1 | FR-020 | Test | A logged-in user can add a text comment to a project. |
| 3.1 | FR-021 | Test | An empty comment, or one longer than tbd characters, is rejected. |
| 3.1 | FR-022 | Test | Comments show author and time, in chronological order. |
| 3.2 | tbd | tbd | tbd |
| 3.3 | tbd | tbd | tbd |
| 3.4 | tbd | tbd | tbd |
| 3.5 | DR-001 to DR-005 | Inspection, Test | The stored data matches each DR row (DR-002: duplicate email is refused). |
| 3.6 | n/a | n/a | Design constraints are checked by review, not tested. |
| 3.7 | SEC-001 to SEC-003 | Inspection, Test | Passwords are not readable in storage, traffic is protected, and restricted actions need a login. |

---

## 5. Appendices

### 5.1 Assumptions and dependencies
Factors that affect the requirements. Not design constraints. If they change, the requirements may change.

- Knitters are comfortable using an app and willing to create an account.
- Knitters enjoy showing off finished projects and are willing to upload photos.
- Independent designers want a simple place to sell patterns, and buyers are willing to pay for them (tbd: applies to later releases only, see the UCD scope note).
- Yarn and store data is available from public sources or can be entered by users, and stays reasonably accurate (applies to store features only, not to the December delivery).
- Focusing on knitting only (no crochet, sewing or other crafts) is enough to build something useful in one semester.
- Users upload only their own patterns and photos. Copyright handling and moderation are beyond this project.
- Dependencies: tbd (hosting, supported browsers).

### 5.2 Acronyms and abbreviations

| Term | Meaning |
|------|---------|
| SRS | Software Requirements Specification |
| UCD | Use Case Diagram |
| UC | Use Case |
| UML | Unified Modeling Language |
| FR | Functional Requirement |
| DR | Database Requirement |
| SEC | Security Requirement |
| MB | Megabyte |