/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })

  //rota qpara user se autenticar
  Route.post('/login', async ({ auth, request, response }) => {
    //autenticação api token
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      const id = await auth.user?.id
      const username = await auth.user?.username
      return {
        token,
        id,
        username
      }
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  })

  Route.group(()=> {
    Route.resource('/posts', 'PostsController').apiOnly()
    Route.get('/users',  'UsersController.index')
    Route.get('/users/:id',  'UsersController.show')
  }).middleware('auth')

  Route.post('/users',  'UsersController.store')

}).prefix('/api')
