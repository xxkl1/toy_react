class AstType {
    // 元素节点, 例如<div></div>, <App />
    static Element = new AstType('Element')

    // 文本节点, <div>test</div>中的test
    static Text = new AstType('Text')

    // 属性 <App class="1" />中的class="1"
    static Attribute = new AstType('Attribute')

    // 标识符
    static Identifier = new AstType('Identifier')

    // 字符串
    static StringLiteral = new AstType('StringLiteral')

    // <App onClick={} /> 中的 {}
    static ExpressionContainer = new AstType('ExpressionContainer')

    // this.state表达式
    static ExpressionMember = new AstType('ExpressionMember')

    constructor(name) {
        this.enumName = name
    }

    toString() {
        return `${this.constructor.name}.${this.enumName}`
    }
}

export {
    AstType,
}