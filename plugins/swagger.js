

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

/**
 * @type {import('fastify').FastifyPluginAsync<{}>}
 */
export default async function registerSwaggerPlugin(f) {
    // https://github.com/fastify/fastify-swagger
    await f.register(fastifySwagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'shakhzodapitest',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0'
            },
            servers: [
                {
                    url: 'http://localhost:' + process.env.PORT,
                    description: 'Development server'
                }
            ],
        }
    })

    const routePrefix = process.env.DOCUMENTATION_PATH ?? "/documentation"

    console.log("Swagger documentation path:", routePrefix)

    // https://github.com/fastify/fastify-swagger-ui
    await f.register(fastifySwaggerUi, {
        routePrefix,
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
    })
}