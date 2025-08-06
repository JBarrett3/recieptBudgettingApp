import { user } from '../src/user.js';
import { transaction } from '../src/transaction.js';

async function app(fastify, {dbInterface}) {
    fastify.get('/help', async function (request, reply) {
        reply.code(200).send('visit /docs for API usage information')
    })
    fastify.register(user, {dbInterface: dbInterface, prefix: '/user'})
    fastify.register(transaction, {dbInterface: dbInterface, prefix: '/transaction'})
}

export {app}