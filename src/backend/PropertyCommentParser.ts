const DocParser = require('doc-parser')

export default class PropertyCommentParser {
  private docParser = new DocParser()

  public constructor () {

  }

  // TODO читать аттрибуты и возвращать значения
  public getData (comment: string): any {
    this.docParser.parse(comment)
  }
}
