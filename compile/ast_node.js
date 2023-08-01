import { AstType } from './ast_type.js'

/**
 * 节点类型
 * eg: <div id='id-div'>test</div>,
 * 调用：
 * Element(
 *'div', '"div",
 * [Attribute('id', 'id-div')],
 * [Text('test')],
 * false,
 * )
 *
 * eg: <APP/>,
 * 调用：
 * Element(
 *"APP",
 * [],
 * [],
 * true,
 * )
 *
 * type astType 节点类型
 * tagName string 当前的标签名称
 * attributes Array 属性
 * children Array 当前节点的子节点
 * selfClosing boolean  是否为闭合标签
 */
 const Element = (tagName, attributes, children, selfClosing) => {
    return {
        type: AstType.Element,
        tagName:tagName,
        attributes: attributes,
        children: children,
        selfClosing:selfClosing,
    }
}

/**
 * 文本节点
 * eg: <span>test</span>, 调用Text('test')
 * value string 文本值
 */
const Text = (value) => {
    return {
        type: AstType.Text,
        value: value,
    }
}

/**
 * 属性
 * eg: <span className="test"></span>, 调用Attribute('className', StringLiteral('test', '"test"'))
 * name string 属性名
 * value ast对象 属性值
 */
const Attribute = (name, value) => {
    return {
        type: AstType.Attribute,
        name: name,
        value: value,
    }
}

/**
 * 标识符
 * eg: 参考下面的ExpressionMember的调用
 * name string 标示符名
 */
const Identifier = (name) => {
    return {
        type: AstType.Identifier,
        name: name,
    }
}

/**
 * 字符串
 * eg: <span className="test"></span>中的"test"， 调用StringLiteral('test', '"test"')
 * value string 字符串值
 * raw string  带双引号的原生字符串值
 */
const StringLiteral = (value, raw) => {
    return {
        type: AstType.StringLiteral ,
        value: value,
        raw: raw,
    }
}

/**
 * jsx表达式容器
 * eg: <span className={"test"}></span> 中的{'test'}， 调用ExpressionContainer(StringLiteral('test', '"test"'))
 * expression ast对象 表达式
 */
const ExpressionContainer = (expression) => {
    return {
        type: AstType.ExpressionContainer,
        expression: expression,
    }
}

/**
 * 字符串
 * eg: <span className={this.className}></span>中的this.className, 调用ExpressionMember(Identifier('this'), Identifier('className'))
 * object ast对象 对象
 * property ast对象 property 对象属性
 * computed boolean computed this.className -> false, this['className'] -> true
 */
const ExpressionMember = (object, property, computed = false) => {
    return {
        type: AstType.ExpressionMember,
        object: object,
        property: property,
        computed: computed,
    }
}

export {
    Element,
    Text,
    Attribute,
    Identifier,
    StringLiteral,
    ExpressionContainer,
    ExpressionMember,
}