# MCP Server TypeScript Starter

This is a starter template for creating a Model Context Protocol (MCP) server using TypeScript. It provides a basic setup with a sample tool implementation to help you get started with building your own MCP server.

## Features

- TypeScript configuration
- Basic MCP server setup
- Sample tool implementation
- Type-safe development environment

## Getting Started

Follow these steps to create your own MCP server:

```bash
# Create a new directory for your project
mkdir <project_name>
cd <project_name>

# Initialize a new npm project
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk zod
npm install -D @types/node typescript

# Create source directory and main file
mkdir src
touch src/index.ts
```

## Project Structure

```
.
├── src/
│   └── index.ts    # Main server implementation
├── package.json    # Project dependencies and scripts
└── tsconfig.json   # TypeScript configuration
```

## Development

1. Implement your tools in `src/index.ts`
2. Build the project:
   ```bash
   npm run build
   ```

## Adding New Tools

To add a new tool, use the `server.tool()` method. Example:

```typescript
server.tool(
  "tool-name",
  "tool-description",
  { 
    // Define your tool's parameters using Zod schema
    param: z.string().describe("parameter description") 
  },
  async ({ param }) => {
    // Implement your tool logic here
    return {
      content: [
        {
          type: "text",
          text: `Tool executed with parameter: ${param}`,
        },
      ],
    };
  },
);
```

## MCP Server Configuration

You can configure multiple MCP servers in your project. Here's an example configuration:

```json
{
    "mcpServers": {
        "<server_name>": {
            "command": "<command>",
            "args": [
                "--directory",
                "/ABSOLUTE/PATH/TO/PARENT/FOLDER/<project_name>",
                "run",
                "<script_name>"
            ]
        }
    }
}
```

This configuration specifies:
- `<server_name>`: A unique identifier for your MCP server
- `command`: The command to run your script (e.g., `python`, `node`, `uv`)
- `args`: An array of command-line arguments
  - `--directory`: Sets the working directory for the script
  - Other arguments specific to your command and script needs

You can configure multiple servers by adding more entries to the `mcpServers` object.

## License

ISC