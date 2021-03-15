import Application from './Application'

const app = new Application()

if (app.isMaster()) {
  app.createCluster()
} else {
  app
    .bootstrap()
    .then(() => {
      return app.serve()
    })
    .catch(console.error)
}
