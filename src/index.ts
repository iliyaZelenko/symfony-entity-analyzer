import Server from '~/backend/server/Server'
import CLI from '~/backend/CLI'
import { join } from 'path'
import chalk from 'chalk'

;(async () => {
  const { path, port, host, open } = CLI.options
  const pathToSearch = join(process.cwd(), path)

  // const entity = await new FilesFinder().find()
  // console.log(entity)

  console.log(chalk.blue(
    `The tool searches for the entity along the path: ${chalk.bold(pathToSearch)}.` +
    '\nCheck whether the path is correct. You can override it with the --path option.'
  ))

  new Server().start(port, host, open)
})()
