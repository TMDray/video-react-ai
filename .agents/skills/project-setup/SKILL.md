---
name: project-setup
description: Setup and configure the Remotion video project — MCP servers, dependencies, environment
metadata:
  tags: setup, mcp, install, config, onboarding
---

## When to use

Use this skill when:
- Opening the project for the first time
- MCP servers are not working or not connecting
- The user asks to set up, configure, or troubleshoot the project
- After cloning the repository

## Quick setup

Run the setup script:

```bash
./scripts/setup-mcp.sh
```

This script:
1. Creates Python virtual environments for MCP servers that need them
2. Installs Python dependencies (mcp, pycurl, httpx, etc.)
3. Writes `.claude/settings.json` with correct absolute paths
4. Checks for `.env` file

## Environment variables

After running setup, create a `.env` file from the example:

```bash
cp .env.example .env
```

Fill in the required API keys. See [./rules/api-keys.md](./rules/api-keys.md) for details on each key.

## MCP Servers

See [./rules/mcp-servers.md](./rules/mcp-servers.md) for the full list of available MCP servers, what they do, and how to troubleshoot them.

## Remotion-specific setup

See [./rules/remotion-imports.md](./rules/remotion-imports.md) for critical rules about imports and module resolution.

## How to use

Read individual rule files for detailed guidance:

- [rules/mcp-servers.md](rules/mcp-servers.md) - Available MCP servers, configuration, troubleshooting
- [rules/api-keys.md](rules/api-keys.md) - Required API keys and how to get them
- [rules/remotion-imports.md](rules/remotion-imports.md) - Import rules specific to Remotion's webpack bundler
