import React, { FormEvent } from 'react'

type Props = {}

export type StringIndexedStringObject = {
  [key: string]: string
}

export function CreateObjectFromForm(form: HTMLFormElement): StringIndexedStringObject {
  const data: StringIndexedStringObject = {}
  Array.from(new FormData(form).entries()).forEach(function(entry){
    data[entry[0].toString()] = entry[1].toString()
  })
  return data
}

export function RequestFormSmall(props: Props): JSX.Element {

  function handleFormSubmit(e: FormEvent): void {
    e.preventDefault()
    const formData: StringIndexedStringObject = CreateObjectFromForm(e.target as HTMLFormElement)

    fetch('/api/requests/new-feature', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(formData)
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