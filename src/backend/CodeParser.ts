const engine = require('php-parser')

export default class CodeParser {
  private parser

  public constructor () {
    this.parser = new engine({
      parser: {
        extractDoc: true,
        php7: true
      },
      ast: {
        withPositions: true
      }
    })
  }

  public parse (code): any {
    return this.parser.parseCode(code)
  }
}
