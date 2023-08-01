import {
    equals,
    isObject,
} from '../utils.js'
import {
    Element,
    Text,
    Attribute,
    Identifier,
    StringLiteral,
    ExpressionContainer,
    ExpressionMember,
} from './ast_node.js'
import {
    AstType,
} from './ast_type.js'
import {
    TokenType,
} from './token_type.js'

const parserExpression = (tks, start = 0) => {
    const indexToLen = i => i + 1
    let i = -1
    tks = tks.slice(start)

    let pre = tks[i - 1]
    let cur = tks[i]
    let next = tks[i + 1]

    const updateTksValue = function (i) {
        pre = tks[i - 1]
        cur = tks[i]
        next = tks[i + 1]
    }

    while (i < tks.length - 1) {
        i++
        updateTksValue(i)

        // 处理元素
        if (equals(cur.type, TokenType.angleBracketLeft) && equals(next.type, TokenType.string)) {
            const elName = next.value
            // 不处理 elName
            i++

            const attributes = []

            updateTksValue(i)
            let isClose = false
            // 处理参数
            if (equals(next.type, TokenType.singleSpace)) {
                // 有参数
                while (1) {
                    // 不处理空格
                    i++
                    const [attribute, offset] = parserExpression(tks.slice(i + 1))
                    attributes.push(attribute)
                    i += offset
                    updateTksValue(i)
                    if (equals(next.type, TokenType.divide)) {
                        isClose = true
                        // 不处理 >
                        i++
                        break
                    }

                    if (equals(next.type, TokenType.angleBracketRight)) {
                        break
                    }
                }
            }
            else if (equals(next.type, TokenType.divide)) {
                // 无参数 且自闭
                isClose = true
                // 不处理 />
                i += 2
            }
            else if (equals(next.type, TokenType.angleBracketRight)) {
                // 无参数 不自闭
                // 不处理 >
                i += 1
            }

            const childrens = []

            const task = [elName]
            updateTksValue(i)


            if (
                !isClose
                && !(equals(next.type, TokenType.angleBracketLeft) && equals(tks[i + 2].type, TokenType.divide))
            ) {
                while (1) {
                    const [children, offset] = parserExpression(tks.slice(i + 1))
                    // wlog('children:', children)
                    i += offset
                    if (children) {
                        childrens.push(children)
                        if (equals(children.type, AstType.Element) && !children.selfClosing) {
                            task.push(children.tagName)
                        }
                    }
                    updateTksValue(i)
                    if (!next) {
                        break
                    }
                    // 遍历到tag的结束
                    if (next && equals(next.type, TokenType.angleBracketLeft)) {
                        task.pop()
                        if (task.length === 0) {
                            break
                        }
                    }
                }
            }

            const output = Element(elName, attributes, childrens, isClose)

            return [output, indexToLen(i)]
        }

        // 处理元素属性，this.情况，equals(pre.type, TokenType.divide)是为了去除</div>里面/div这种字符串
        if (equals(cur.type, TokenType.string) && (!pre || !equals(pre.type, TokenType.divide))) {
            // 处理属性
            if (next && equals(next.type, TokenType.assign)) {
                const name = cur.value
                // = 不检测
                i++
                const [value, offset] = parserExpression(tks.slice(i + 1))
                i += offset
                const o = Attribute(name, value)
                return [o, indexToLen(i)]
            } else if (next && equals(next.type, TokenType.dot)) {
                let i2 = i
                while (1) {
                    const curI2 = tks[i2]
                    const nextI2 = tks[i2 + 1]
                    if (nextI2 && (equals(nextI2.type, TokenType.string) || equals(nextI2.type, TokenType.dot))) {
                        i2++
                    } else {
                        break
                    }
                }

                const last = tks[i2]
                const protery = Identifier(last.value)

                // 剪切的时候，不处理最后一个和前面的.
                let i3 = i2 - 2

                let [object, offset] = parserExpression(tks.slice(i, i3 + 1))

                if (equals(object.type, AstType.Text)) {
                    object = Identifier(object.value)
                }

                i = i2

                const o = ExpressionMember(object, protery)

                return [o, indexToLen(i)]
            } else {
                // 处理普通字符
                // Text
                // !equals(pre.type, TokenType.divide) -> 防止 <div检测到div
                // !pre 是可能会出现undefined，出现就当成没问题
                let s = ''
                while (1) {
                    updateTksValue(i)
                    if (equals(cur.type, TokenType.string) || equals(cur.type, TokenType.singleSpace) || equals(cur.type, TokenType.colon)) {
                        s += cur.value
                    }

                    // 如果下一个是string或者空格，i++，并进行循环
                    if (next && (equals(next.type, TokenType.string) || equals(next.type, TokenType.singleSpace) || equals(next.type, TokenType.colon))) {
                        i++
                    } else {
                        break
                    }
                }
                const o = Text(s)
                return [o, indexToLen(i)]
            }
        }

        // 处理字符串块''hover""
        if (equals(cur.type, TokenType.singleQuotes) || equals(cur.type, TokenType.quotes)) {
            const [v, offset] = parserExpression(tks.slice(i + 1))
            i += offset

            // 结束的单引号不检测
            i++
            let o
            if (equals(cur.type, TokenType.singleQuotes)) {
                o = StringLiteral(v.value, `'${v.value}'`)
            } else {
                o = StringLiteral(v.value, `"${v.value}"`)
            }

            return [o, indexToLen(i)]
        }

        // 处理表达式块{}
        if (equals(cur.type, TokenType.curlyLeft)) {
            const [expression, offset] = parserExpression(tks.slice(i + 1))

            i += offset

            const o = ExpressionContainer(expression)

            // }不检测
            i++
            return [o, indexToLen(i)]
        }

    }
    return [undefined, tks.length]
}

const parserExpressionList = function(tks) {
    const r = []
    let i = -1
    while (i < tks.length - 1) {
        const [o, offset] = parserExpression(tks.slice(i + 1))
        i += offset
        if (o && isObject(o)) {
            r.push(o)
        }
    }
    return [r, tks.length]
}

export {
    parserExpressionList as parser,
}
