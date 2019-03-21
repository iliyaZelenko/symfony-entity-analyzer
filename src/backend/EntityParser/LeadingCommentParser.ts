const DocParser = require('doc-parser')

export default class LeadingCommentParser {
  private docParser = new DocParser()

  public getClassCommentData (comment: string): any {
    const parsed = this.docParser.parse(comment)

    const entityAnnotationArguments = this.getAnnotationArguments('orm', 'Entity', parsed)
    const tableAnnotationArguments = this.getAnnotationArguments('orm', 'Table', parsed)

    return {
      entityAnnotationArguments,
      tableAnnotationArguments
    }
  }

  public getPropertyCommentData (comment: string): any {
    const parsed = this.docParser.parse(comment)
    const annotationsOptionsNames = ['ManyToOne', 'OneToMany', 'ManyToMany', 'OneToOne']
    const relationsArguments = annotationsOptionsNames.map(i =>
      this.getAnnotationArguments('orm', i, parsed)
    )
    const [
      manyToOneArguments,
      oneToManyArguments,
      manyToManyArguments,
      oneToOneArguments
    ] = relationsArguments
    const hasSomeRelation = relationsArguments.some(Boolean)

    return {
      hasSomeRelation,
      manyToOne: manyToOneArguments,
      oneToMany: oneToManyArguments,
      manyToMany: manyToManyArguments,
      oneToOne: oneToOneArguments
    }
  }

  private getAnnotationArguments (name, optionName, parsed): null | any[] {
    const entityAnnotation = parsed.body.find(i =>
      i.name === name && i.options.some(i => i.name === optionName)
    )

    if (!entityAnnotation) return null

    return entityAnnotation.options.find(i => i.name === optionName).arguments
  }
}
