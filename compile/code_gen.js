import { equals } from '../utils.js' 
import { AstType } from './ast_type.js'

const isUpper = char =>'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(char)

const codeGen = (ast) => {
    if (equals(ast.type, AstType.Element)) {
        let codeTagName = `"${ast.tagName}"`

        // 如果是大写，证明是组件
        if (isUpper(ast.tagName[0])) {
            codeTagName = ast.tagName
        }

        // 处理参数
        let attributes =[]
        for (const e of ast.attributes) {
            const code = codeGen(e)
             attributes.push(code)
        }

        let codeAttributes = ''
        if ( attributes.length === 0) {
            codeAttributes = '{}'
        } else {
             attributes =  attributes.map(e => e += ',')
            let s = ''
            for (let i = 0; i <  attributes.length; i++) {
                const e =  attributes[i]
                if (i > 0) {
                    s += ' '
                }
                s += `${e}`
            }
            codeAttributes =`{ ${s} }`
        }
        // 处理children
        let codeChild = ''
        for (const e of ast.children) {
            const code = codeGen(e)
            codeChild += ` ${code},`
        }
        const code = `React.createElement( ${codeTagName}, ${codeAttributes},${codeChild} )`
        return code
    }

    if (equals(ast.type, AstType.Attribute)) {
        return `${ast.name}: ${codeGen(ast.value)}`
    }

    if (equals(ast.type, AstType.StringLiteral)) {
        return `${ast.raw}`
    }

    if (equals(ast.type, AstType.Text)) {
        return `"${ast.value}"`
    }

    if (equals(ast.type, AstType.ExpressionContainer)) {
        return codeGen(ast.expression)
    }

    if (equals(ast.type, AstType.ExpressionMember)) {
        const obj = codeGen(ast.object)
        const property = codeGen(ast.property)
        return `${obj}.${property}`
    }

    if (equals(ast.type, AstType.Identifier)) {
        return ast.name
    }

    return ''
}

export {
    codeGen,
}
