import { FormEvent } from "react"

export function UseApiCall(config: any): Promise<any> {
  return fetch( 'http://localhost:6047' + config.path, {
    method: config.method || 'GET',
    body: JSON.stringify(config.body),
    mode: config.mode || 'cors',
    headers: {
      "Content-Type": "application/json",
      ...config.headers
    }
  })
}

export function Footer () {
  function JoinNewsletterForm () {
    function joinNewsletter(e: FormEvent): void {
      e.preventDefault()
      const email: string = ((e.target as HTMLFormElement).elements[0] as HTMLInputElement).value || ''
      UseApiCall({
        path: '/api/newsletter/join',
        method: 'POST',
        body: { email }
      }).then( res => res.json() ).then( data => {
        console.log(data)
      }).catch( err => {
        console.log( err.message )
      })
    }

    return (
      <form id='newsletter-form' className='small-form__container' onSubmit={ joinNewsletter }>
        <label htmlFor="newsletter-email">
          Enter your email to signup for updates.
        </label>
        <input type="text" className="small-form__input" />
        <button type="submit" className="small-form__button btn__bold">Join</button>
      </form>
    )
  }

  return (
    <footer className="footer__container">
      <div className="footer__section">
        <JoinNewsletterForm />
      </div>
      <div className="footer__section">c. 2023 </div>
      <div className="footer__section">Quiet Goat Labs is a web development company based in New Jersey, USA.
      <hr className="footer__hr" />
      c. 2023 - All Rights Reserved</div>
    </footer>
  )
}