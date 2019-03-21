import BaseController from '~/backend/server/controllers/BaseController.ts'
import FilesFinder from '~/backend/FilesFinder'

export default class HomeController extends BaseController {
  public async index () {
    const entity = await new FilesFinder().find()

    // console.log(entity)

    this.res.render('index', {
      entity,
      title: 'Hey'
    })
  }
}
