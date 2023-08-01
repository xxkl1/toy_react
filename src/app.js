import React from './react.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.onIncrement = this.onIncrement.bind(this)
        this.onDecrement = this.onDecrement.bind(this)
        this.state = {
            count: 0,
        }
    }
    onIncrement() {
        console.log('this.state.onIncrement', this.state)
        this.setState({
            count: this.state.count + 1,
        })
    }
    onDecrement() {
        console.log('this.state', this.state)
        this.setState({
            count: this.state.count - 1,
        })
    }
    render(props, state) {
        return (
            <div>
                <button onClick={this.onIncrement}>+</button>
                <button onClick={this.onDecrement}>-</button>
                <p>
                    count: { this.state.count }
                </p>
            </div>
        )
    }
}

export default App
