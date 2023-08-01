const isAttributes = (key) => !key.startsWith('on') && key !== 'children'

const render = (vdom, element) => {
    // 确保 element 没有子元素, 只剩下自身
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild)
    }
    reactDOMRender(vdom, element)
}

class Component {
    constructor(props) {
        this.props = props
    }
    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState)
        // Object.assign(this.state, partialState)
        render(window.vdom, window.element)
    }
}

const isClass = (o) => o.prototype instanceof Component

const reactDOMRender = (vdom, container) => {
    // 相当于 vdom 和 element 是全局变量
    // 他们的值一直是最初的值
    if (window.vdom === undefined) {
        window.vdom = vdom
    }
    if (window.element === undefined) {
        window.element = container
    }
    let { type, props } = vdom
    let element = null
    if (type === 'TEXT') {
        element = document.createTextNode('')
    } else if (isClass(type)) {
        let cls = type
        if (cls.instance === undefined) {
            cls.instance = new cls(props)
        }
        let state = cls.instance.state || {}
        let r = cls.instance.render(props, state)
        element = reactDOMRender(r, container)
    } else {
        element = document.createElement(type)
    }

    let eventKeys = Object.keys(props).filter(e => e.startsWith('on'))

    eventKeys.forEach(k => {
        let eventType = k.toLowerCase().slice(2)
        element.addEventListener(eventType, props[k])
    })

    let otherKeys = Object.keys(props).filter(e => isAttributes(e))
    otherKeys.forEach(k => {
        element[k] = props[k]
    })

    let children = props.children || []
    // 递归处理 children
    children.forEach(c => reactDOMRender(c, element))

    // 把元素插入到页面中
    container.appendChild(element)

    return element
}

const common = {
    Component,
    reactDOMRender,
}

export default common
