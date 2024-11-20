/**
 * @type {import('fastify').FastifyPluginAsync<{}>}
 */
export default function (f) {
    f.get('/health', {
        schema: {
            response: {
                default: {
                    description: 'Check if server is running',
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean', value: true },
                    },
                },
            },
        },
    }, function (_, reply) {
        reply.send({ ok: true })
    })
}