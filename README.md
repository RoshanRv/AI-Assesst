## Prerequisites

- Docker
- .env file

## Setup Qdrant

```bash
docker pull qdrant/qdrant
```

## Getting Started

First, Start Qdrant

```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant
```

Qdrant will be running on port 6333 (Rest API) and 6334 (Web UI).

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
