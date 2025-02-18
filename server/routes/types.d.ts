import { TUsersTableSchema } from '~/server/db/types.ts'

declare global {
  namespace Express {
    interface Request {
      user?: TUsersTableSchema
      spam?: boolean
    }
  }
}
