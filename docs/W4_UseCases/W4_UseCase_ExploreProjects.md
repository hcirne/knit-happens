**KNIT HAPPENS**

# Use Case Specification: Explore projects

Version 1.0

## Revision History

| **Date** | **Version** | **Description** | **Author** |
| --- | --- | --- | --- |
| 26.10.2026 | 1.0 | Init | KNIT HAPPENS |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

## Table of Contents

- 1. Use-Case Name
  - 1.1 Brief Description
- 2. Flow of Events
  - 2.1 Basic Flow
  - 2.2 Alternative Flows
- 3. Special Requirements
- 4. Preconditions
- 5. Postconditions
- 6. Extension Points

# Use-Case Specification: Explore projects

# 1. Use-Case Name

Explore projects

## 1.1 Brief Description

A user browses shared projects to find inspiration.

# 2. Flow of Events

## 2.1 Basic Flow

1. The user opens the project feed.
2. The system shows projects with photo, title and creator.
3. The user scrolls and selects a project.
4. The system shows the project details.

### 2.1.1 Activity Diagram
```plantuml
@startuml
|User|
start
:Open project feed;
|System|
if (Projects exist?) then (yes)
  :Show project cards;
  |User|
  :Select a project;
  |System|
  :Show project details;
else (no)
  :Show empty-state message;
endif
stop
@enduml
```

![Activity Diagram](W4_UseCase_ExploreProjects_ActivityDiagram.png)

### 2.1.2 Gherkin Narrative

[Gherkin Narrative](../../src/test/UseCase_ExploreProjects.feature)

### 2.1.3 Mock-Up Wireframe

![Activity Diagram](W4_UseCase_ExploreProjects_Wireframe.png)

## 2.2 Alternative Flows

(n/a)

# 3. Special Requirements

(n/a)

# 4. Preconditions

(n/a)

# 5. Postconditions

(n/a)

# 6. Extension Points

(n/a)

