import Server from '~/backend/server/Server'
import FilesFinder from '~/backend/FilesFinder'

;(async () => {
  const entity = await new FilesFinder().find()

  console.log(entity)

  new Server().start(3000)
})()

