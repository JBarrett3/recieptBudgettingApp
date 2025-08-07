import { user } from '../src/user.js';
import { transaction } from '../src/transaction.js';

async function app(fastify) {
    fastify.get('/help', async function (request, reply) {
        reply.code(200).send('visit /docs for API usage information')
    })
    fastify.register(user, {prefix: '/user'})
    fastify.register(transaction, {prefix: '/transaction'})
}

export {app}