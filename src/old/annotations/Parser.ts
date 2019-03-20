export default class Parser {
  public constructor () {
  }

  public parse (str: string) {
    return this.normalizeClasses(
      this.removeNotNecessary(str)
    )
  }

  /**
   * Removes "/**", " * " and "*\/"
   */
  private removeNotNecessary (str: string): string {
    return str
      .replace(/\/\*\*/g, '')
      .replace(/ .*\* /g, '')
      .replace(/\*\//g, '')
      .split('\n')
      // .filter(i => i[0] !== ' ')
      // .filter(i => i.trim())
      // .map(i => i.trim())
      .join('\n')
      .trim()
  }

  /**
   * Parse Classes
   * @param str
   */
  private normalizeClasses (str: string): object[] {
    console.log(str)
    // const regex = new RegExp('@.*\\(')
    // const regex = new RegExp('.+@.+\\\\.[a-z]+')
    // TODO не брать пробелы
    const regex = new RegExp('@.*\\(') // ? не ставить в конец

    return str.split('\n')
      .filter(i => i.startsWith('@') && i.match(regex))
      .map(i => {
        const className = i.match(regex)![0].slice(
          i.indexOf('@') + 1,
          i.indexOf('(')
        )
        const argumentsStr = i.slice(
          i.indexOf('(') + 1,
          i.lastIndexOf(')')
        )

        return {
          className,
          arguments: this.getArguments(argumentsStr)
        }
      })
  }

  private getArguments (str: string) {
    const result = {}

    if (!str.length) return {}

    const arr = str.split(',')

    if (arr.length) {
      arr.forEach(parseArgument)
    } else {
      parseArgument(str)
    }

    function parseArgument (i: string): void {
      // type="string", length=255
      // TODO trim
      const [key, value] = i.split('=')

      console.log([key, value])

      result[key] = value
    }

    return result
  }
}
