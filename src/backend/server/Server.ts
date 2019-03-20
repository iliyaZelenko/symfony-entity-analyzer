import { getSrcDir } from 'backend/tools/helpers'
import { join } from 'path'
import * as express from 'express'
import HomeController from '~/backend/server/controllers/HomeController'

const srcDir = getSrcDir()

export default class Server {
  private readonly viewsPath = join(srcDir, 'frontend/views')
  private readonly app = express()

  public start (port) {
    this.app.listen(port, () => {
      console.log('Example app listening on port 3000!')
    })
    this.app.use(
      express.static(join(srcDir, 'frontend/public'))
    )
    this.app.set('view engine', 'pug')
    this.app.set('views', this.viewsPath)

    this.app.get('/', (req, res) => {
      new HomeController(req, res).index()
    })
  }
}
