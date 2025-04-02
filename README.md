# MyLocation MCP

A Model Context Protocol (MCP) server that provides location services. It can determine location either through provided coordinates or IP address lookup using the IPInfo.io service.

## Features

- Get location from coordinates
- Get location from IP address (using IPInfo.io)
- Health check endpoint
- Easy integration with Claude and other AI models

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yhwancha/mylocation-mcp.git
   cd mylocation-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your IPInfo API token:
   ```
   IPINFO_TOKEN=your_ipinfo_token_here
   ```
   - You can get a free API token from [IPInfo.io](https://ipinfo.io)

4. Build the project:
   ```bash
   npm run build
   ```

## Running the Server

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## MCP Configuration

### Claude Configuration

To use this MCP server with Claude, add the following configuration to your Claude prompt or settings:

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

### Connection Settings

The MCP server runs on stdio by default. Make sure your client is configured to communicate through stdio.

## Available Tools

### 1. get-location-by-coordinates

Get location information from provided coordinates.

**Parameters:**
- `latitude`: Latitude coordinate (-90 to 90)
- `longitude`: Longitude coordinate (-180 to 180)

**Example Request:**
```json
{
  "latitude": "37.5665",
  "longitude": "126.9780"
}
```

**Example Response:**
```json
{
  "status": "success",
  "source": "user_provided",
  "data": {
    "latitude": 37.5665,
    "longitude": 126.9780
  }
}
```

### 2. get-location-by-ip

Get location information from an IP address.

**Parameters:**
- `ipAddress`: IP address (e.g., "8.8.8.8")

**Example Request:**
```json
{
  "ipAddress": "8.8.8.8"
}
```

**Example Response:**
```json
{
  "status": "success",
  "source": "ip_based",
  "data": {
    "ip": "8.8.8.8",
    "city": "Mountain View",
    "region": "California",
    "country": "US",
    "org": "Google LLC",
    "latitude": 37.386,
    "longitude": -122.0838
  }
}
```

### 3. health

Check the service health status.

**Parameters:** None

**Example Response:**
```json
{
  "status": "healthy",
  "service": "mylocation-mcp"
}
```

## Error Handling

All responses follow this format:

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

Common error scenarios:
- Invalid coordinates (outside valid ranges)
- Invalid IP address format
- IPInfo API token not configured
- Network errors when calling IPInfo API

## Integration Examples

### Using with Claude

```python
# Example of using the location service with Claude
location = await claude.invoke_tool("get-location-by-ip", {
    "ipAddress": "8.8.8.8"
})
print(location.data)  # Access the location data
```

### Using with Other MCP Clients

```typescript
// Example using TypeScript MCP client
const client = new McpClient();
const response = await client.invoke("get-location-by-coordinates", {
    latitude: "37.5665",
    longitude: "126.9780"
});
```

## Technical Stack

- TypeScript
- Model Context Protocol (MCP)
- IPInfo.io API
- Node.js
- Zod (Schema validation)
- Axios (HTTP client)

## Development

### Project Structure
```
mylocation-mcp/
├── src/
│   └── index.ts    # Main server implementation
├── package.json    # Project dependencies and scripts
├── tsconfig.json   # TypeScript configuration
├── .env.example    # Environment variables template
└── README.md      # Documentation
```

### Adding New Features

To add new location-related features:
1. Define the tool in the server configuration
2. Implement the tool logic in `src/index.ts`
3. Update the README with the new tool documentation
4. Update the Claude configuration if needed

## License

This project is licensed under the MIT License.