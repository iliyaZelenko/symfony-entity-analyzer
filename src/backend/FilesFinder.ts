import { join } from 'path'
import LeadingCommentParser from '~/backend/EntityParser/LeadingCommentParser'
import EntityParser from '~/backend/EntityParser/EntityParser'
import CLI from '~/backend/CLI'
const fs = require('fs-extra')

export default class FilesFinder {
  private entityParser = new EntityParser()
  private leadingCommentParser = new LeadingCommentParser()

  public async find () {
    return this.findCorrectEntity()
  }

  private async findPaths (): Promise<string[]> {
    const glob = require('glob')

    return new Promise((resolve, reject) => {
      const path = join(process.cwd(), CLI.options.path)

      glob(path + '/**/*.php', {}, (err, files) => {
        if (err) reject(err)

        resolve(files)
      })
    })
  }

  /**
   * Алгоритм поиска энтити:
   * - должен иметь namespace
   * - должен быть классом (не интерфейсом, не трейтом и т.д.)
   * - должен содержан коммент класса (leadingComment)
   * - в leadingComment должно быть указано что это энтити (@ORM\Entity аннотация)
   */
  private async findCorrectEntity () {
    const paths = await this.findPaths()

    const promises = paths.map(async path => {
      const code = await fs.readFile(path, 'utf8')
      const { ast, astNamespaceNode, astClassNode, leadingComment } = this.getParsedEntityData(code)

      if (!astNamespaceNode || !astClassNode || !leadingComment) return

      const {
        entityAnnotationArguments,
        tableAnnotationArguments
      } = this.leadingCommentParser.getClassCommentData(leadingComment)

      if (!entityAnnotationArguments) return

      const relationsProperties = this.getRelations(astClassNode)
      const relations: any[] = []
      for (const rel of ['manyToOne', 'oneToMany', 'manyToMany', 'oneToOne']) {
        relations.push(...this.normalizeByRelation(rel, relationsProperties))
      }

      const namespace = astNamespaceNode.name
      const className = astClassNode.name.name
      const fullNamespace = namespace + '\\' + className

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

  private getParsedEntityData (code): any {
    const ast = this.entityParser.parse(code)
    const astNamespaceNode = this.entityParser.getNamespace(ast)
    const astClassNode = this.entityParser.getClass(astNamespaceNode)
    let leadingComment

    if (astClassNode) {
      const leadingCommentResult = this.entityParser.getLeadingComment(astClassNode)

      if (leadingCommentResult) {
        leadingComment = leadingCommentResult.leadingComment
      }
    }

    return { ast, astNamespaceNode, astClassNode, leadingComment }
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
