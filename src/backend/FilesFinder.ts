import { getSrcDir } from '~/backend/tools/helpers'
import * as path from 'path'
import CodeParser from '~/backend/CodeParser'
import LeadingCommentParser from '~/backend/LeadingCommentParser'
const fs = require('fs-extra')

export default class FilesFinder {
  private codeParser = new CodeParser()
  private leadingCommentParser = new LeadingCommentParser()

  public constructor () {

  }

  public async find () {
    return this.findCorrectEntity()
  }

  private async findPaths (): Promise<string[]> {
    const glob = require('glob')

    return new Promise((resolve, reject) => {
      glob(path.join(getSrcDir(), '../Entity') + '/**/*.php', {}, (err, files) => {
        if (err) reject(err)

        resolve(files)
      })
    })
  }

  /**
   * Возвращает энтити у которых есть коммент класса (leadingComment).
   */
  private async findCorrectEntity () {
    const paths = await this.findPaths()

    const promises = paths.map(async path => {
      const code = await fs.readFile(path, 'utf8')
      const ast = this.codeParser.parse(code)
      const astNamespaceNode = this.getEntityAstNamespaceNode(ast)
      const astClassNode = this.getEntityAstClassNode(astNamespaceNode)

      if (!astClassNode) return

      const namespace = astNamespaceNode.name
      const className = astClassNode.name.name
      const fullNamespace = namespace + '\\' + className

      /* Potentially non-existent parameters */
      const leadingCommentResult = this.getEntityLeadingComment(astClassNode)
      if (!leadingCommentResult) return
      const { leadingComment } = leadingCommentResult

      if (!leadingComment) return

      const leadingCommentParserResult = this.leadingCommentParser.getClassCommentData(leadingComment)
      if (!leadingCommentParserResult) return
      const { entityAnnotationArguments, tableAnnotationArguments } = leadingCommentParserResult

      if (!entityAnnotationArguments) return

      const relationsProperties = this.getRelations(astClassNode)
      const relations: any[] = []
      for (const rel of ['manyToOne', 'oneToMany', 'manyToMany', 'oneToOne']) {
        relations.push(...this.normalizeByRelation(rel, relationsProperties))
      }

      console.log(relations)

      return {
        path,
        ast,
        code,
        namespace,
        className,
        fullNamespace,
        leadingComment,
        entityAnnotationArguments,
        tableAnnotationArguments,
        relations
      }
    })

    return (await Promise.all(promises)).filter(Boolean)
  }

  private getRelations (astClassNode) {
    return astClassNode.body
      .filter(i => i.kind === 'property')
      .map(i => {
        if (!i.leadingComments || !i.leadingComments[0]) return

        const data = this.leadingCommentParser.getPropertyCommentData(i.leadingComments[0].value)

        if (!data.hasSomeRelation) return

        return {
          ...data,
          name: i.name
        }
      })
      .filter(Boolean)
  }

  private getEntityAstNamespaceNode (ast): any {
    return ast.children.find(i => i.kind === 'namespace')
  }

  private getEntityAstClassNode (astNamespaceNode): any {
    return astNamespaceNode.children.find(i => i.kind === 'class')
  }

  private getEntityLeadingComment (classNode): any {
    if (!classNode.leadingComments) return null

    const commentBlock = classNode.leadingComments.find(i => i.kind === 'commentblock')
    if (!commentBlock) return null

    return {
      leadingComment: commentBlock.value
    }
  }

  private normalizeByRelation (relation, relationsProperties) {
    return relationsProperties.filter(i => i[relation]).map(i => {
      return {
        entity: i[relation].find(argument => argument.name === 'targetEntity').value,
        property: i.name,
        type: relation
      }
    })
  }
}
