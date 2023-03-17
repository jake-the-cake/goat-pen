import React, { FormEvent } from 'react'

type Props = {}

export function RequestFormSmall(props: Props): JSX.Element {

  function handleFormSubmit(e: FormEvent): void {
    e.preventDefault()
    console.log(e.target)
    return
  }

  return (
    <form className='mini-form' onSubmit={handleFormSubmit}>
      <label htmlFor='email-field'>Email</label>
      <input type="text" id='email-field' />
      <label htmlFor='message-field'>Request</label>
      <textarea id='message-field' />
      <button>Send</button>
    </form>
  )
}