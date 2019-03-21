import CodeParser from '~/backend/CodeParser'

export default class EntityParser {
  private codeParser = new CodeParser()

  /**
   * Returns AST
   * @param code
   */
  public parse (code): any {
    return this.codeParser.parse(code)
  }

  public getNamespace (ast) {
    return ast.children.find(i => i.kind === 'namespace')
  }

  public getClass (astNamespaceNode) {
    return astNamespaceNode.children.find(i => i.kind === 'class')
  }

  public getLeadingComment (classNode) {
    if (!classNode.leadingComments) return null

    const commentBlock = classNode.leadingComments.find(i => i.kind === 'commentblock')
    if (!commentBlock) return null

    return {
      leadingComment: commentBlock.value
    }
  }
}
