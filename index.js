import 'dotenv/config'
import path from 'node:path'
import Fastify from 'fastify'
import fastifyAutoload from '@fastify/autoload'
import registerSwaggerPlugin from './plugins/swagger.js'

const PORT = process.env.PORT

const fastify = Fastify({
    logger: true
})

await registerSwaggerPlugin(fastify)

await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, 'handlers')
})

await fastify.ready()

fastify.swagger()

fastify.listen({ port: PORT }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})