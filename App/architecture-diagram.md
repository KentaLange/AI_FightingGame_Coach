# Architecture Diagram

```mermaid
graph TB
      subgraph "Frontend (Next.js 15 + React 19)"
          A[layout.tsx<br/>Root Layout] --> B[page.tsx<br/>Server Component]
          B --> C[PageClient.tsx<br/>Client Wrapper]
          C --> D[ChatClient.tsx<br/>Main Chat Interface]

          subgraph "Styling"
              E[Tailwind CSS 4]
              F[Custom CSS Variables]
              G[Geist Fonts]
          end
      end

      subgraph "External AI Services"
          H[Langflow API<br/>127.0.0.1:7860]
          I[@datastax/langflow-client<br/>NPM Package]
      end

      subgraph "Backend Data Layer (Python)"
          J[AstraDB Connector<br/>Primary Database]
          K[PostgreSQL Connector]
          L[MySQL Connector]
          M[MongoDB Connector]
          N[Database Migrator<br/>Cross-DB Operations]
      end

      subgraph "Configuration & Environment"
          O[Environment Variables<br/>API Keys & URLs]
          P[TypeScript Config]
          Q[Next.js Config]
      end

      subgraph "Static Assets"
          R[Public Directory<br/>SVG Icons & Assets]
      end

      %% Data Flow Connections
      D -->|HTTP POST Request<br/>Bearer Auth| H
      H -->|AI Response<br/>JSON Format| D
      D -->|State Management<br/>React useState| D

      %% Backend Connections (Currently Unused)
      J -.->|Potential Integration| D
      K -.->|Alternative DB| N
      L -.->|Alternative DB| N
      M -.->|Alternative DB| N
      N -.->|Data Migration| J

      %% Configuration Connections
      O --> D
      O --> H
      P --> A
      Q --> A

      %% Styling Connections
      E --> D
      F --> D
      G --> A

      %% Static Assets
      R --> A

      classDef frontend fill:#e1f5fe
      classDef backend fill:#f3e5f5
      classDef external fill:#fff3e0
      classDef config fill:#e8f5e8
      classDef unused fill:#ffebee,stroke-dasharray:5 5

      class A,B,C,D,E,F,G frontend
      class J,K,L,M,N backend
      class H,I external
      class O,P,Q,R config
      class K,L,M unused
```

## Architecture Summary

### Core Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **AI Integration**: Langflow API + DataStax Langflow Client
- **Backend**: Python database connectors (multiple options)
- **Primary Database**: AstraDB (Cassandra-based)

### Key Components

1. **ChatClient.tsx**: Main interface handling user interactions and AI communication
2. **Langflow Integration**: External AI service for Street Fighter 6 coaching
3. **Multi-Database Architecture**: Supports AstraDB, PostgreSQL, MySQL, MongoDB
4. **Database Migrator**: Enables cross-database operations

### Data Flow

1. User → ChatClient → Langflow API → AI Response → UI Update
2. Python connectors exist but aren't currently integrated with frontend
3. State managed locally in React components

### Upgrade Opportunities

- Connect Python database layer to frontend
- Implement user authentication
- Add error boundaries and better error handling
- Utilize the unused Server.tsx component
- Integrate database connectors with the chat system for persistent storage