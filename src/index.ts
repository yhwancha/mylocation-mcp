import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Types
interface LocationResponse {
  status: string;
  source?: string;
  error?: string;
  data?: Record<string, any>;
}

interface IPInfoResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
}

// Configuration
const config = {
  ipInfoToken: process.env.IPINFO_TOKEN,
  ipInfoUrl: 'https://ipinfo.io',
};

// Helper functions
function validateCoordinates(lat: string, lon: string): boolean {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  return !isNaN(latitude) && !isNaN(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180;
}

async function getLocationFromIP(ipAddress: string): Promise<LocationResponse> {
  const url = `${config.ipInfoUrl}/${ipAddress}/json`;
  const headers: Record<string, string> = {};
  
  if (config.ipInfoToken) {
    headers.Authorization = `Bearer ${config.ipInfoToken}`;
  }

  const response = await axios.get<IPInfoResponse>(url, { headers });
  const ipInfo = response.data;

  const locationData: Record<string, any> = {
    ip: ipInfo.ip,
    city: ipInfo.city,
    region: ipInfo.region,
    country: ipInfo.country,
    org: ipInfo.org,
  };

  if (ipInfo.loc) {
    const [lat, lon] = ipInfo.loc.split(',');
    locationData.latitude = parseFloat(lat);
    locationData.longitude = parseFloat(lon);
  }

  return {
    status: 'success',
    source: 'ip_based',
    data: locationData,
  };
}

// Create server instance
const server = new McpServer({
  name: "mylocation-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register tools
server.tool(
  "get-location-by-coordinates",
  "Get location information from provided coordinates",
  {
    latitude: z.string().describe("Latitude coordinate"),
    longitude: z.string().describe("Longitude coordinate"),
  },
  async ({ latitude, longitude }) => {
    if (!validateCoordinates(latitude, longitude)) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: 'error',
              error: 'Invalid coordinates provided',
            }),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            status: 'success',
            source: 'user_provided',
            data: {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            },
          }),
        },
      ],
    };
  },
);

server.tool(
  "get-location-by-ip",
  "Get location information from IP address",
  {
    ipAddress: z.string().describe("IP address to lookup"),
  },
  async ({ ipAddress }) => {
    try {
      const location = await getLocationFromIP(ipAddress);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(location),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: 'error',
              error: 'Failed to determine location',
            }),
          },
        ],
      };
    }
  },
);

server.tool(
  "health",
  "Check the health status of the service",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            status: 'healthy',
            service: 'mylocation-mcp',
          }),
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Location MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
