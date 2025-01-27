import { getLifespan, setCookie } from '../../utils/cookie.ts'
import type { TUser } from '../api/types.ts'
import EventEmitter from '../../utils/eventEmitter.ts'

class StoreUser extends EventEmitter {
  private _user: TUser | undefined = undefined

  public get user() {
    return this._user
  }

  public set user(value: TUser | undefined) {
    this._user = value
    if (this._user) {
      if (this._user.token) {
        setCookie({
          vc_token: this._user.token,
          expires: getLifespan(30),
          samesite: 'lax',
          path: '/',
        })
      }
    } else {
      setCookie({
        vc_token: '',
        expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
        samesite: 'lax',
        path: '/',
      })
    }
    this.emit('update')
  }

  public clearUser = () => {
    this._user = undefined
    this.emit('update')
  }
}

const storeUser = new StoreUser()
export default storeUser
