import { tokenizer } from './tokenizer.js'
import { parser } from './parser.js'
import { codeGen } from './code_gen.js'

const checkSign = function (s, start, signs, direction = 'left') {
    let i = start
    while (1) {
        const cur = s[i]
        if (signs.includes(cur)) {
            return true
        } else if (cur === ' ' || cur === '\r' || cur === '\n') {
            if (direction === 'left') {
                i--
            } else {
                i++
            }
        } else {
            break
        }
    }
    return false
}

const compileJsx = function (code) {
    const tks = tokenizer(code)
    let [ast] = parser(tks)
    // 目前只处理外层包裹一层的情况
    ast = ast[0]
    const s = codeGen(ast)
    return s
}

const compile = function (content) {
    let start
    let end
    for (let i = 0; i < content.length; i++) {
        const cur = content[i]
        // 检查是否是(<
        if (cur === '<' && checkSign(content, i - 1, '(') && start === undefined) {
            start = i
        }

        // 检查是否是>)或者>,
        if (cur === '>' && checkSign(content, i + 1, ',)', 'right')) {
            end = i
        }
    }
    const jsx = content.slice(start, end + 1)

    if (jsx) {
        const jsxHandled = compileJsx(jsx)
        const head = content.slice(0, start)
        const footer = content.slice(end + 1)
        const r = head + jsxHandled + footer
        return r
    } else {
        return content
    }
}

export {
    compile,
}