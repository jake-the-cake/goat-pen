import React from 'react'
import './App.css'
import { HorizontalSlider } from './components/HorizontalSlider'
import { Navbar } from './components/Navbar'
import { SideCardWithHeader } from './components/SideCardWithHeader'

function App() {
  console.log(window.location)
  return (
    <div className="page">
      <Navbar />
      <main>
        <div className="page-alert">
          <span className="page-alert-title">Special Message</span>
          <span className="page-alert-blob">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam nam laborum omnis, fuga consectetur adipisci facilis at doloremque unde vel, quam quis mollitia officia inventore fugiat. Vitae odio obcaecati tenetur?</span>
        </div>
        <div className="two-col-stack">
          <article className='flex-a'>
            <h2 className="content-header">Main Header</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas molestias natus quos voluptatem fugiat, eius cum, qui reiciendis, beatae quo accusamus excepturi quaerat nam a! Pariatur quis aliquid autem totam?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas molestias natus quos voluptatem fugiat, eius cum, qui reiciendis, beatae quo accusamus excepturi quaerat nam a! Pariatur quis aliquid autem totam?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas molestias natus quos voluptatem fugiat, eius cum, qui reiciendis, beatae quo accusamus excepturi quaerat nam a! Pariatur quis aliquid autem totam?</p>
          </article>
          <section className='vertical-stack'>
            <SideCardWithHeader
              title='Updates'
              body='Recently added a bunch of like... stuff.'
              badge={(
                <>
                  See All
                </>
              )}
            />
            <SideCardWithHeader
              title='Request Features'
              body='Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas molestias natus quos voluptatem fugiat, eius cum, qui reiciendis, beatae quo accusamus excepturi quaerat nam a! Pariatur quis aliquid autem totam?'
            />
          </section>
        </div>
        <HorizontalSlider
          contents={[
            'a',
            'b',
            'c',
            'd',
            'e'
          ]}
        />
      </main>
      <footer>
        c. 2023
      </footer>
    </div>
  )
}

export default App