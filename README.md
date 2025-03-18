# Visit counter

<div align="center">

  [![deno](https://badge-service.deno.dev/plain/?title=Deno&icon=deno&value=2.1)](#)
  [![express](https://badge-service.deno.dev/plain/?title=Express&icon=express&value=4)](#)
  [![postgres](https://badge-service.deno.dev/plain/?title=Postgres&icon=postgres&value=17)](#)
  [![react](https://badge-service.deno.dev/plain/?title=React&icon=react&value=18)](#)

  [![counter](https://counter.daytec.ru/counter-example)](#)
  [![server](https://github.com/mrHoft/visit-counter/actions/workflows/deploy.yml/badge.svg)](https://counter.daytec.ru/)

</div>

### Description:
Visitor counter project for self usage.
Includes:
- 3 counter types
- Admin panel
- Analytics

<div align="center">

  ![image](https://github.com/user-attachments/assets/bd1d13c2-1c43-4406-87dd-7d34861fb9e6)

</div>

Featured:
- Auto installer of database and app using Docker

### Project usage:
1. Postgres must be configured.
2. cp .env.example .env
3. `deno task start`: to start server on 3082 port.
4. Counter: `localhost:3082/<conter-name>/?type=badge&title=Counter&color=red`.
5. Admin panel: `localhost:3082`.
6. Analytics: `localhost:3082/api/analytics/<conter-name>` (need to be authorized).

### Counters:
- (image/svg) badge [title, color]
- (image/svg) classic
- (text/plain) number

### Features:
- Repeatable requests are not counting.
- Client with ability to manage users and counters. Sign in by credentials, auto auth by token.
- Analytics: geoip, system, platform, agent, graph.
- SSR, Bundle on fly.
- PWA.
