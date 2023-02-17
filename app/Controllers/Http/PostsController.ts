import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Post from 'App/Models/Post'
// import Application from '@ioc:Adonis/Core/Application'
// import { v4 as uuidv4 } from 'uuid'


export default class PostsController {

    public async store({ request, response, auth }: HttpContextContract) {

        const body = request.body()
        const id = auth.user?.id

        const post = await Post.create({
            title: body.title,
            content: body.content,
            image: body.image,
            userId: id

        })

        response.status(201)

        return {
            message: "Post criado com sucesso",
            data: post,
        }
    }

    public async index() {
        const posts = await Post.query().preload('user')
        return {
            posts
        }
    }

    public async show({ params }: HttpContextContract) {
        const post = await Post.findOrFail(params.id)

        return {
            data: post,
        }
    }

    public async destroy({ params, auth, response }: HttpContextContract) {
        const post = await Post.findOrFail(params.id)
        

        if(post.userId != auth.user?.id) {
            return response.status(401)
        }
        await post.delete()

        return {
            message: 'Post deletado com sucesso',
            data: post  

        }
    }

    public async update({params, request, response,auth}: HttpContextContract) {
        const body = request.body()
        const post = await Post.findOrFail(params.id)

        if(post.userId != auth.user?.id) {
            return response.status(401)
        }

        post.title = body.title
        post.content = body.content
        post.image = body.image

        await post.save()

        return {
            message: 'Post atualizado com sucesso',
            data: post,
            body
        }

    }
}

