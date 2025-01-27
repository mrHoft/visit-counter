import { TCountersTableSchema, TUserRole, TUsersTableSchema } from '../../../server/db/types.ts'
export type TUser = Omit<TUsersTableSchema, 'token'> & { token?: string }
export { type TUserRole }
export type TCounter = TCountersTableSchema
