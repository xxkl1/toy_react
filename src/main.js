import React from './react.js'
import ReactDOM from './react-dom.js'

import App from './app.js'

const main = () => {
    let root = document.querySelector('#root')
    ReactDOM.render(<App />, root)
}

main()
