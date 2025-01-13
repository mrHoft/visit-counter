# Visit counter

<div align="center">

  [![deno](https://img.shields.io/badge/deno-2.1-blue?logo=deno)](#)
  [![express](https://img.shields.io/badge/express-4-blue?logo=express)](#)
  [![postgres](https://img.shields.io/badge/Postgres-14-blue?logo=postgresql)](#)

</div>

Visitor counter project for self usage.
1. Databese must be configured and initialized table ([init](./server/db/init.sql)).
2. cp .env.example .env
3. `deno task start`: to start express server on 3082 port.
4. `http://localhost:3082/<conter-name>/?type=badge&title=Counter&color=red`

Optional query parameters:
- type: 'badge' | 'number' | 'classic'
- title: string
- color: string
