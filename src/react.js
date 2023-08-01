import common from './common.js'
import { isObject } from './utils.js'

const createTextElement = (text) => {
    let type = 'TEXT'
    let props = {
        nodeValue: text,
    }
    let c = createElement(type, props)
    return c
}

const createElement = (type, props, ...children) => {
    let newProps = Object.assign({}, props)

    // 为了方便运算, 把 children 也放到 props 里面
    if (children.length === 0) {
        newProps.children = []
    } else {
        let l = children.map(c => {
            if (isObject(c)) {
                // 说明是一个元素节点
                return c
            } else {
                // 说明是一个文本节点
                let r = createTextElement(c)
                return r
            }
        })
        newProps.children = l
    }

    let o = {
        type: type,
        props: newProps,
    }
    return o
}

const React = {
    createElement: createElement,
    Component: common.Component,
}

export default React
