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

    const manyToOneArguments = this.getAnnotationArguments('orm', 'ManyToOne', parsed)
    const oneToManyArguments = this.getAnnotationArguments('orm', 'OneToMany', parsed)
    const manyToManyArguments = this.getAnnotationArguments('orm', 'ManyToMany', parsed)
    const oneToOneArguments = this.getAnnotationArguments('orm', 'OneToOne', parsed)

    // console.log({
    //   manyToOne: manyToOneArguments,
    //   oneToMany: oneToManyArguments,
    //   manyToMany: manyToManyArguments
    // })

    return {
      hasSomeRelation: [manyToOneArguments, oneToManyArguments, manyToManyArguments, oneToOneArguments].some(Boolean),
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
