export default class BaseController {
  public req: any
  public res: any

  public constructor (req, res) {
    this.req = req
    this.res = res
  }
}
