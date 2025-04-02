# MCP Server TypeScript Starter

This is a Model Context Protocol (MCP) server implementation that provides location services. It demonstrates how to build an MCP server using TypeScript with real-world functionality for location lookups via coordinates or IP addresses.

## Features

- TypeScript configuration
- Complete MCP server setup
- Location service implementation
  - Coordinate-based location lookup
  - IP-based location lookup (using IPInfo.io)
  - Health check endpoint
- Type-safe development environment
- Integration with external APIs

## Getting Started

Follow these steps to set up the location MCP server:

```bash
# Clone the repository
git clone https://github.com/yhwancha/mylocation-mcp.git
cd mylocation-mcp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your IPInfo.io API token

# Build the project
npm run build
```

## Project Structure

```
.
├── src/
│   └── index.ts    # Main server implementation with location tools
├── package.json    # Project dependencies and scripts
├── tsconfig.json   # TypeScript configuration
├── .env.example    # Environment variables template
└── README.md      # Documentation
```

## Development

1. The main implementation is in `src/index.ts`
2. Build the project:
   ```bash
   npm run build
   ```
3. Run the server:
   ```bash
   npm start
   ```
4. For development with auto-reload:
   ```bash
   npm run dev
   ```

## Implemented Tools

### 1. get-location-by-coordinates

```typescript
server.tool(
  "get-location-by-coordinates",
  "Get location information from provided coordinates",
  {
    latitude: z.string().describe("Latitude coordinate (-90 to 90)"),
    longitude: z.string().describe("Longitude coordinate (-180 to 180)")
  },
  async ({ latitude, longitude }) => {
    // Implementation details...
  }
);
```

### 2. get-location-by-ip

```typescript
server.tool(
  "get-location-by-ip",
  "Get location information from IP address",
  {
    ipAddress: z.string().describe("IP address to lookup")
  },
  async ({ ipAddress }) => {
    // Implementation details...
  }
);
```

### 3. health

```typescript
server.tool(
  "health",
  "Check the health status of the service",
  {},
  async () => {
    // Implementation details...
  }
);
```

## MCP Server Configuration

To use this MCP server in your project, add the following configuration:

```json
{
    "mcpServers": {
        "location-service": {
            "command": "node",
            "args": [
                "--directory",
                "/path/to/mylocation-mcp",
                "run",
                "start"
            ]
        }
    }
}
```

### Claude Configuration

For use with Claude, include these tool definitions:

```json
{
  "tools": [
    {
      "name": "get-location-by-coordinates",
      "description": "Get location information from provided coordinates",
      "parameters": {
        "type": "object",
        "properties": {
          "latitude": {
            "type": "string",
            "description": "Latitude coordinate (-90 to 90)"
          },
          "longitude": {
            "type": "string",
            "description": "Longitude coordinate (-180 to 180)"
          }
        },
        "required": ["latitude", "longitude"]
      }
    },
    {
      "name": "get-location-by-ip",
      "description": "Get location information from IP address",
      "parameters": {
        "type": "object",
        "properties": {
          "ipAddress": {
            "type": "string",
            "description": "IP address to lookup"
          }
        },
        "required": ["ipAddress"]
      }
    },
    {
      "name": "health",
      "description": "Check the health status of the service",
      "parameters": {
        "type": "object",
        "properties": {}
      }
    }
  ]
}
```

## Response Format

All tools return responses in this format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON string containing the response data"
    }
  ]
}
```

The response data follows this structure:
```json
{
  "status": "success|error",
  "source": "user_provided|ip_based",
  "data": {
    // Location data when successful
  },
  "error": "Error message when failed"
}
```

## Dependencies

- `@modelcontextprotocol/sdk`: MCP server implementation
- `zod`: Schema validation
- `axios`: HTTP client for IPInfo API
- `dotenv`: Environment variable management
- TypeScript development tools

## License

MIT