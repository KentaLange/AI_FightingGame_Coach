# Architecture Diagram: Server-Client Separation

## Before (Current Architecture)
```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 ChatClient.tsx                      │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │        Direct API Call to Langflow         │    │    │
│  │  │     ❌ Exposes API Keys in Browser         │    │    │
│  │  │     ❌ No Server-side Validation           │    │    │
│  │  │     ❌ CORS Issues                          │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Direct HTTPS Request
                              │ Bearer Token: API_KEY
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Langflow API                             │
│                (External Service)                           │
└─────────────────────────────────────────────────────────────┘
```

## After (New Architecture)
```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 ChatClient.tsx                      │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │        API Call to Internal Backend         │    │    │
│  │  │     ✅ No API Keys Exposed                  │    │    │
│  │  │     ✅ Clean Interface                      │    │    │
│  │  │     ✅ Better Error Handling                │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ POST /api/chat
                              │ { input_value: string }
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Next.js Server (Backend)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              /api/chat/route.ts                     │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │        Server-side API Route Handler        │    │    │
│  │  │     ✅ Secure API Key Storage               │    │    │
│  │  │     ✅ Input Validation                     │    │    │
│  │  │     ✅ Error Handling & Logging             │    │    │
│  │  │     ✅ Response Processing                  │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS Request
                              │ Bearer Token: API_KEY (secure)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Langflow API                             │
│                (External Service)                           │
└─────────────────────────────────────────────────────────────┘
```

## Key Changes

### 1. **Security Improvements**
- **API Keys**: Moved from client-side (`NEXT_PUBLIC_*`) to server-side environment variables
- **Token Protection**: API keys are no longer exposed in browser JavaScript
- **Request Validation**: Server-side validation of input parameters

### 2. **Architecture Benefits**
- **Separation of Concerns**: Client handles UI, server handles API integration
- **Better Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Server-side logging for debugging and monitoring
- **Rate Limiting**: Future capability to add rate limiting on server-side

### 3. **Technical Implementation**
- **Client-Side**: `ChatClient.tsx` now calls `/api/chat` instead of Langflow directly
- **Server-Side**: New API route `/api/chat/route.ts` handles Langflow integration
- **Environment Variables**: Secure server-side variables (`LANGFLOW_URL`, `LANGFLOW_API_KEY`)

### 4. **Data Flow**
1. User types message in `ChatClient.tsx`
2. Client sends `POST /api/chat` with `{ input_value: string }`
3. Server validates input and calls Langflow API
4. Server processes response and returns `{ message: string, success: boolean }`
5. Client displays the AI response

### 5. **Error Handling**
- **Client Errors**: Network issues, invalid responses
- **Server Errors**: Configuration errors, Langflow API failures
- **User-Friendly**: Error messages are sanitized before showing to user

This architecture provides better security, maintainability, and scalability while maintaining the same user experience.