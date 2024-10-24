# Gutenberg AI

**Gutenberg AI** connects the Gutenberg Project to language models (LLMs) for advanced text analysis using Next.js and Prisma. The app supports SQLite and PostgreSQL databases, enabling flexible, data-driven exploration of text.

## Setup

### Environment Variables

Set up the following variables in your `.env` file:

```plaintext
# LLM configuration
LLM_BASE_URL=                               # any OpenAI-compatible API eg : https://api.sambanova.ai/v1 
LLM_API_KEY=                                # Your LLM API key
LLM_MODEL=                                  # preferred LLM model eg Meta-Llama-3.1-8B-Instruct

# Database URLs
SQLITE_DATABASE_URL=                        # eg :file:./database/books.sqlite
POSTGRES_PRISMA_URL=                        # Prisma URL for PostgreSQL
POSTGRES_URL_NON_POOLING=                   # Non-pooling URL for PostgreSQL

# Next.js server
NEXT_URL=                                   # eg: http://localhost:3000
```

### Scripts

- **`dev`**: Starts dev server with Turbopack (requires prepared SQLite db).
- **`build`**: Builds the app for production.
- **`start`**: Runs the app in production.
- **`db_prepare:sqlite`**: Prepares SQLite database for local dev.
- **`db_prepare:postgres`**: Prepares PostgreSQL database for production.
- **`deploy`**: Prepares PostgreSQL, builds, and starts the app.

### Workflow

1. **Development**: 
   - Prepare SQLite: `npm run db_prepare:sqlite`
   - Run dev server: `npm run dev`

2. **Production**:
   - Prepare PostgreSQL: `npm run db_prepare:postgres`
   - Deploy: `npm run deploy`


There are also ready to deploy Containerfile and compose.yml to use with contianer sofware such as Docker or Podman.
