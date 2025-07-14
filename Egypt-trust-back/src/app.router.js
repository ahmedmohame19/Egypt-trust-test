import authRouter from './modules/Auth/Auth.router.js'
import warehouseRouter from './modules/Warehouse/Warehouse.router.js'
import branchesRouter from './modules/Branches/Branches.router.js'



export const appRouter = (app, express) => {

  // middlware for display image in uploads
  app.use('/uploads', express.static('uploads'))

  // parsing data
  app.use(express.json())

  // Routes
  app.use('/api/auth', authRouter)
  app.use('/api/warehouses', warehouseRouter)
  app.use('/api/branches', branchesRouter)
 


  // if route not found
  app.all('*', (req, res, next) => {
    return next(new Error('page not found', { cause: 404 }))
  })

  // global error handler
  app.use((error, req, res, next) => {
    return res
      .status(error.cause || 500)
      .json({ success: false, message: error.message, stack: error.stack })
  })
}
