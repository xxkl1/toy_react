class TokenType {
    static string = new TokenType('string')

    static number = new TokenType('number')

    // '-'
    static line = new TokenType('line')

    // 分号
    static semicolon = new TokenType('semicolon')

    // 冒号
    static colon = new TokenType('colon')

    // .
    static dot = new TokenType('dot')
    // #
    static hashTag = new TokenType('hashTag')

    // { and }
    static curlyLeft = new TokenType('curlyLeft')
    static curlyRight = new TokenType('curlyRight')

    // 单个空格 ' '
    static singleSpace = new TokenType('singleSpace')

    // $
    static dollar = new TokenType('dollar')
    //<
    static angleBracketLeft = new TokenType('angleBracketLeft')
    //>
    static angleBracketRight = new TokenType('angleBracketRight')
    // /
    static divide = new TokenType('divide')
    // assign
    static assign = new TokenType('assign')
    // "
    static quotes = new TokenType('quotes')
    // "
    static singleQuotes = new TokenType('singleQuotes')
    constructor(name) {
        this.enumName = name
    }

    toString() {
        return `${this.constructor.name}.${this.enumName}`
    }
}

export {
    TokenType,
}