import chalk from 'chalk'
import * as opn from 'opn'
import { getSrcDir } from '~/backend/tools/helpers'
import { join } from 'path'
import * as express from 'express'
import HomeController from '~/backend/server/controllers/HomeController'

const srcDir = getSrcDir()

export default class Server {
  private readonly viewsPath = join(srcDir, 'frontend/views')
  private readonly app = express()

  public start (port: number | string, host: string, open: boolean = false) {
    this.app.listen(+port, host, () => {
      console.log(
        chalk.green(`Site is running on port ${
          chalk.bold(`http://${host}:` + port)
        }.`)
      )

      // открывает в дефолтном браузере
      if (open) opn(`http://${host}:` + port)
    })
    this.app.use(
      express.static(join(srcDir, 'frontend/public'))
    )
    this.app.set('view engine', 'pug')
    this.app.set('views', this.viewsPath)

    this.app.get('/', async (req, res) => {
      await new HomeController(req, res).index()
    })
  }
}
