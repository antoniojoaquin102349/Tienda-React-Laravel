import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <img src="imagenes/logo.png" class="logo"/>
    <h1>Puta jodienda</h1>
    <div class="card">
      <button id="counter" type="button">joder</button>
    </div>
    <p class="read-the-docs">
      A tomar por culo
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
