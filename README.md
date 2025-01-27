# Visit counter

<div align="center">

  [![deno](https://img.shields.io/badge/deno-2.1-blue?logo=deno)](#)
  [![express](https://img.shields.io/badge/express-4-blue?logo=express)](#)
  [![postgres](https://img.shields.io/badge/Postgres-14-blue?logo=postgresql)](#)
  [![react](https://img.shields.io/badge/React-18-blue?logo=react)](#)

  [![counter](https://counter.daytec.ru/counter-example)](#)

</div>

### Description:
Visitor counter project for self usage.
Includes:
- 3 counter types
- Admin panel

Featured:
- Analytics
- Auto installer of database and app using Docker

### Project usage:
1. Postgres must be configured.
2. cp .env.example .env
3. `deno task start`: to start express server on 3082 port.
4. Counter: `localhost:3082/<conter-name>/?type=badge&title=Counter&color=red`.
5. Admin panel: `localhost:3082/admin`.

### Counter optional query parameters:
- type: 'badge' | 'number' | 'classic'
- title: string
- color: string

### Features:
- Sign in by credentials, auto auth by token.
- SSR, Bundle on fly.