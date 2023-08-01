import {
    TokenType,
} from './token_type.js'

const stringElement = (s) => {
    let r = ''
    const end = ' ,:=.()/[]\n<>"\'}'
    for (let i = 0; i < s.length; i++) {
        const cur = s[i]
        if (end.includes(cur)) {
            return [r, i]
        } else {
            r += cur
        }
    }
    return [r, s.length]
}

// 保留字 map
// todo: 补充各个类型
const KeyWordMap = {
    '<': TokenType.angleBracketLeft,
    '>': TokenType.angleBracketRight,
    '/': TokenType.divide,
    "'": TokenType.singleQuotes,
    '"': TokenType.quotes,
    ' ': TokenType.singleSpace,
    '=': TokenType.assign,
    '{': TokenType.curlyLeft,
    '}': TokenType.curlyRight,
    '.': TokenType.dot,
    ':': TokenType.colon,
}

const tokenizer = (code) => {
    let end = ''
    const codes = code
    let output = []

    let i = -1
    while (i < codes.length - 1) {
        i += 1
        let cur = codes[i]
        let next = codes[i + 1]

        if (cur === '\n' || cur === '>') {
            if (cur === '>') {
                const o = {
                    type: KeyWordMap[cur],
                    value: cur,
                }
                output.push(o)
            }
            if (cur === '>') {
                end += '>'
                if (end === '/>') {
                    while (1) {
                        // 得到/>前一个元素的i
                        // 删除/>前面的空格
                        const i = output.length - 3
                        if (output[i] && output[i].value === ' ') {
                            output.splice(i,1)
                        } else {
                            break
                        }
                    }
                }
            }

            // 清除/> 后面的换行和空格
            while (1) {
                i++

                // pre = codes[i - 1]
                cur = codes[i]
                next = codes[i + 1]
                if (cur !== ' ' && cur !== '\n') {
                    break
                }
            }
        }

        // 保留字，直接push
        if (KeyWordMap.hasOwnProperty(cur)) {
            const o = {
                type: KeyWordMap[cur],
                value: cur,
            }
            output.push(o)
            if (cur === '/') {
                end = '/'
            }
        } else if(cur) {
            // 非保留字，证明是字符串
            const [str, offset] = stringElement(codes.slice(i))
            const o = {
                type: TokenType.string,
                value: str,
            }

            output.push(o)
            i += offset - 1
        }
    }
    return output
}

export {
    tokenizer,
}
