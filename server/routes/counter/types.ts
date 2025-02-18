// @deno-types="npm:@types/express@5"
import { Request } from 'express'
import { type TCounterType } from '~/server/template/counter.ts'

export type TCounterRequest = Request<
  { name: string },
  unknown,
  unknown,
  { type?: TCounterType; title?: string; color?: string }
>
