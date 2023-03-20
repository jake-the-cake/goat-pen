import React, { FormEvent } from 'react'

type Props = {}

export function RequestFormSmall(props: Props): JSX.Element {

  function handleFormSubmit(e: FormEvent): void {
    e.preventDefault()
    console.log(e.target)
    const form = new FormData(e.target as HTMLFormElement)
    fetch('/api/requests/new-feature', {
      method: 'POST',
      body: JSON.stringify({somethin:'this'})
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch( function(err){
        console.log(err.message)
      })
    return
  }

  return (
    <form className='mini-form' onSubmit={handleFormSubmit}>
      <label htmlFor='email-field'>Email</label>
      <input type="text" id='email-field' name='email' />
      <label htmlFor='message-field'>Request</label>
      <textarea id='message-field' name='message' />
      <button>Send</button>
    </form>
  )
}