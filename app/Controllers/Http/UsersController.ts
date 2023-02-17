import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ }: HttpContextContract) {
    const users = await User.all()
    return users
  }

  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.body()
    const users = await User.findBy('email', userPayload.email)

    if(users){
      response.status(409)
      return {
        message: 'Email já cadastrado faça login',
      } 
    }

    
    const user = await User.create(userPayload)

    response.status(201)

    return {
      message: 'Usuário criado com sucesso',
      data: user
    }

  }


  public async show({ request }: HttpContextContract) {
    const id = request.param('id')
    const users = await User.find(id)

    return users
  }

  public async update({ request }: HttpContextContract) {
    const id = request.param('id')
    const body = request.only(['username', 'email', 'password'])
    const user = await User.findOrFail(id)
    await user.merge(body).save()
    return {
      message: "Usuário alterado com sucesso"
    }
  }

  public async destroy({request }: HttpContextContract) {
    const id = request.param('id')
    const user = await User.findOrFail(id)
    await user.delete()
    return {
      message: "Usuário excluído com sucesso"
    }
   }
}
