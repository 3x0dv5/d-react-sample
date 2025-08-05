# Development Guide

This document provides an overview of the development workflow and architecture for the project. It covers environment setup, code organization, and the internal mechanics that connect UI components with the action engine.

## Environment Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```
4. **Run tests**: (currently none specified)
   ```bash
   npm test
   ```

## Project Structure

```
📦 d-react-sample
├── src
│   ├── components
│   │   ├── ButtonComponent.tsx
│   │   ├── CalendarComponent.tsx
│   │   └── ChartComponent.tsx
│   ├── config
│   │   └── interactionConfig.ts
│   ├── engine
│   │   └── actionEngine.ts
│   ├── atoms.ts
│   ├── App.tsx
│   └── main.tsx
└── docs
    └── development.md
```

## Architecture Overview

The application renders dynamic dashboard widgets. Users can add calendars, buttons, and charts at runtime. Components communicate through a lightweight action engine driven by configuration.

```mermaid
graph TD
    subgraph UI
        A[Calendar]\nComponent
        B[Button]\nComponent
        C[Chart]\nComponent
    end
    A -- updates value --> S[(Jotai Store)]
    B -- onClick --> AE(Action Engine)
    AE -- reads --> CFG[interactionConfig]
    AE -- invokes --> C
    C -- writes --> S
```

## Action Engine Flow

The action engine reacts to triggers defined in `interactionConfig` and calls registered handlers on target components.

```mermaid
sequenceDiagram
    participant T as Trigger
    participant E as ActionEngine
    participant H as Handler
    T->>E: executeTrigger(id, rules)
    E->>E: filter matching rules
    E->>E: evaluateArgs
    E->>H: call handler(args)
    H-->>E: update state
```

## Adding a New Component

1. **Create the component** inside `src/components` and expose an `id` prop.
2. **Register action handlers** if the component should react to triggers:
   ```ts
   useEffect(() => {
     registerActionHandler(id, 'actionName', handlerFn);
   }, [id]);
   ```
3. **Update configuration**: Add corresponding rules to `interactionConfig.ts`.

## Styling and Dependencies

- Styling is handled via simple inline styles; feel free to integrate a CSS framework.
- State management uses [Jotai](https://jotai.org/).
- Charts are rendered with [ECharts](https://echarts.apache.org/).

## Contributing

1. Fork the repository and create a feature branch.
2. Commit with meaningful messages.
3. Ensure the development server and tests run without errors.
4. Submit a pull request for review.

