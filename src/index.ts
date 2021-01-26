import Application from './Application'

const app = new Application()

app
  .bootstrap()
  .then(() => {
    return app.serve()
  })
  .catch(console.error)
