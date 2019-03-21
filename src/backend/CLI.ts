import * as commander from 'commander'
import * as packageJson from '~/../package.json'

const { version: appVersion } = packageJson

class CLI {
  public options
  private readonly defaultConfig = {
    defaultHost: 'localhost',
    defaultPort: 3000,
    defaultEntityFolderPath: 'src/Entity',
    defaultNoOpen: false
  }

  public constructor () {
    const { defaultHost, defaultPort, defaultEntityFolderPath, defaultNoOpen } = this.defaultConfig

    commander
      .version(appVersion, '-v, --version')
      .usage('[options]')
      .option('--host [host]', 'server host', defaultHost)
      .option('-p, --port [port]', 'server port', defaultPort)
      .option(
        '-b, --path [path]',
        'path to folder with entity.',
        defaultEntityFolderPath
      )
      .option('--no-open', 'it won\'t open your browser.', defaultNoOpen)
      .parse(process.argv)

    this.options = commander
  }
}

export default new CLI()
