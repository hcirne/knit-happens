# (W3) Our Use Case Diagram and Requirements

![Use Case Diagram](https://raw.githubusercontent.com/hcirne/knit-happens/refs/heads/main/docs/W3_UseCaseDiagram.png)

As *KNIT HAPPENS* takes shape, we wanted a clear overview of who can do what on our platform.

Our use case diagram shows the actors and their interactions with the system. It groups use cases into functional areas and uses colors to distinguish Semester 1 (green), Semester 2 (yellow), and currently unassigned features (white).

- A Platform User is someone who interacts with our platform. (An abstraction to reduce redundancy)
- A Visitor is a Platform User who is unregistered.
- A Registered User is a Platform User who is registered.

## Process and Result

We started with [PlantUML](https://plantuml.com/use-case-diagram), [PlantText](https://www.planttext.com/), the [PlantUML CLI](https://plantuml.com/download), and ChatGPT. With an AI-assisted optimization loop, we iteratively tried to improve the diagram's layout.

Along the way, we learned a few things:

- **Associations:** PlantUML supports ordinary associations without arrowheads. Use `---` instead of `-->`, despite the arrow examples in its documentation.
- **Notation correctness:** PlantUML can generate diagrams that do not conform to UML notation. Correctness needs deliberate attention.
- **Automatic layout:** PlantUML automatically positions elements and routes connections, but getting a visually clear layout proved surprisingly difficult.

In the end, we were only partly satisfied with the tooling and results. So we decided to develop our own solution.

## Our Own Solution

With the help of an AI coding agent, we developed a Python library specifically for generating UML use case diagrams. The diagram above was generated using this library.

- **Biggest challenge:** Untangling the association lines. Getting their routing right required by far the most iterations.
- **Remaining limitations:** We're still not entirely satisfied with the result, particularly the association routing. There's room for improvement!
- **Interesting detail:** UML actually permits association lines consisting of multiple segments. Straight lines are common, but not mandatory.

## Notation Correctness

One important thing we learned along the way: **UML is a standardized formal modeling language.** Much like a programming language, it has defined syntax and semantics, but represents things visually rather than through text.

UML diagrams aren't just arbitrary illustrations whose symbols can be changed freely for aesthetic reasons. There's room for creativity in how we arrange things, but the meaning of the notation must be preserved.

If you're interested in the official rules, you can find them here:

- [UML Specification (OMG)](https://www.omg.org/spec/UML/)
- [UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/PDF), especially Section 18 (Use Cases) and Section 11.5.4 (Associations)

## Practical Quality

Creating good use case diagrams is difficult. Even following the UML notation correctly doesn't automatically make a diagram useful or easy to understand.

Here are some important principles:

- **Model actor goals, not system functions.** A use case should represent something meaningful an actor wants to achieve.
- **Choose the right abstraction level.** Avoid individual steps, UI actions, and implementation details.
- **Treat actors as roles.** They represent roles interacting with the system, not specific people.
- **Do not model workflows.** Show who can achieve which goals, not the sequence of actions.
- **Keep it simple.** Use `include`, `extend`, and other relationships only when they add meaningful information.

For more explanations and examples, we recommend checking out [CSE 308 – UML Use Case Diagrams](https://ayan-1829.github.io/CSE-308-Design-Project-I/topics/06-uml-use-case-diagrams.html).

## Requirements

Want to learn more about what we're planning for *KNIT HAPPENS*? Have a look at our [Software Requirements Specification](https://github.com/hcirne/knit-happens/blob/main/docs/SoftwareRequirementsSpecification.md).

