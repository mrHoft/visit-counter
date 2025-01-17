import React from 'react'
import Input from '~/client/src/ui/input.tsx'
import { ButtonSubmit } from '~/client/src/ui/button.tsx'

export default function App() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const el = event.currentTarget
    const formData = new FormData(el)
    const data = { name: formData.get('name'), password: formData.get('password') }
    console.log(data)
  }

  return (
    <div className="page">
      <div className="flex_wrap">
        <h1>Counter</h1>
        <div>admin panel</div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div>Please login:</div>
        <Input type="text" name="name" placeholder="name" pattern="^[a-zA-Z0-9]+$" required />
        <Input type="password" name="password" placeholder="password" pattern="^[0-9A-Za-z\\-_#$@&!]+$" required />
        <ButtonSubmit>Submit</ButtonSubmit>
      </form>
      <div className="copyright">
        <span>&copy; 2025 </span>
        <a href="https://github.com/mrHoft/visit-counter" target="_blank">
          mrHoft
        </a>
      </div>
    </div>
  )
}
