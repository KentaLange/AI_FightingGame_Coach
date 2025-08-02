# AI Fighting Game Coach - Data Flow Diagram

## Data Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[User Interface<br/>PageClient.tsx]
        B[Chat Interface<br/>ChatClient.tsx]
        C[Message State<br/>React useState]
        D[Input Handler<br/>Form Submission]
    end

    subgraph "API Layer"
        E[Next.js API Route<br/>/api/langflow/route.ts]
        F[Request Processing<br/>JSON Input/Output]
        G[Environment Config<br/>API Keys & URLs]
    end

    subgraph "External AI Services"
        H[Langflow API<br/>External AI Service]
        I[AI Response Processing<br/>Message Extraction]
        J[Street Fighter 6<br/>Knowledge Base]
    end

    subgraph "Database Layer (Available)"
        K[AstraDB Connector<br/>Primary Database]
        L[PostgreSQL Connector<br/>Alternative DB]
        M[MySQL Connector<br/>Alternative DB]
        N[MongoDB Connector<br/>Alternative DB]
        O[Database Migrator<br/>Cross-DB Operations]
    end

    subgraph "Configuration & Assets"
        P[Environment Variables<br/>LANGFLOW_URL, API_KEY]
        Q[TypeScript Config<br/>Type Definitions]
        R[Static Assets<br/>Public Directory]
        S[Styling<br/>Tailwind CSS]
    end

    %% Primary Data Flow
    A --> B
    B --> C
    B --> D
    D -->|POST Request| E
    E --> F
    F -->|HTTP Request| H
    H -->|AI Response| I
    I -->|Processed Response| F
    F -->|JSON Response| B
    B --> C
    C --> A

    %% Configuration Flow
    G --> E
    P --> G
    Q --> A
    R --> A
    S --> A

    %% Database Layer (Currently Unused)
    K -.->|Future Integration| E
    L -.->|Alternative Option| O
    M -.->|Alternative Option| O
    N -.->|Alternative Option| O
    O -.->|Data Migration| K

    %% AI Service Details
    H --> J
    J --> H

    %% Styling
    classDef client fill:#e3f2fd,stroke:#1976d2
    classDef api fill:#f3e5f5,stroke:#7b1fa2
    classDef external fill:#fff3e0,stroke:#f57c00
    classDef database fill:#e8f5e8,stroke:#388e3c
    classDef config fill:#fce4ec,stroke:#c2185b
    classDef unused fill:#ffebee,stroke-dasharray:5 5

    class A,B,C,D client
    class E,F,G api
    class H,I,J external
    class K,L,M,N,O database
    class P,Q,R,S config
    class L,M,N,O unused
```

## Data Flow Patterns

### 1. User Interaction Flow
```
User Input → ChatClient → State Update → Form Submission → API Route → Langflow → AI Response → UI Update
```

### 2. Message Processing
```
Raw Input → JSON Payload → HTTP Request → AI Processing → Response Extraction → State Management → UI Render
```

### 3. Error Handling
```
API Error → Error State → User Notification → Input Reset
```

## Data Structures

### User Message
```typescript
interface Message {
  text: string;
  isUser: boolean;
}
```

### API Request
```typescript
interface APIRequest {
  input: string;
}
```

### API Response
```typescript
interface APIResponse {
  data?: any;
  error?: string;
}
```

### Langflow Payload
```typescript
interface LangflowPayload {
  input_value: string;
  output_type: "chat";
  input_type: "chat";
}
```

## Component Relationships

### Frontend Components
- **PageClient.tsx**: Main page wrapper with layout
- **ChatClient.tsx**: Core chat functionality and state management
- **layout.tsx**: Root layout and global styles
- **page.tsx**: Server component entry point

### Backend Components
- **route.ts**: API endpoint for Langflow communication
- **astradb_connector.py**: Database connectivity (unused)

### Configuration
- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **next.config.ts**: Next.js configuration

## Data Security

### Environment Variables
- `LANGFLOW_URL`: External AI service endpoint
- `LANGFLOW_API_KEY`: Authentication token

### Authentication
- Bearer token authentication for Langflow API
- No user authentication currently implemented

## Future Enhancements

### Database Integration
- Connect Python database connectors to frontend
- Implement user session persistence
- Add conversation history storage

### Enhanced Data Flow
- Real-time message streaming
- User authentication and profiles
- Analytics and usage tracking
- Error logging and monitoring

## Technical Stack

### Frontend
- Next.js 15 with React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Client-side state management

### Backend
- Next.js API routes
- Python database connectors
- Multiple database support
- Environment-based configuration

### External Services
- Langflow for AI processing
- DataStax Langflow client
- Street Fighter 6 knowledge base