async function transaction(fastify) {
    fastify.post('/', async function (request, reply) {
        const {uid, amount, description} = request.body
        if (!uid) return reply.code(400).send({error: "Missing UID"})
        if (!amount) return reply.code(400).send({error: "Missing amount"})
        const {error, dbResp} = await fastify.db.transaction.createInDB({uid: uid, amount: amount, description: description})
        if (error) return reply.code(400).send({error: error})
        return reply.code(200).send(dbResp)
    })
    fastify.get('/', async function (request, reply) {
        const { uid, tid } = request.query;
        if (!uid && !tid) { // neither
            return reply.code(400).send({error: "insufficient keys, provide either UID or TID"})
        } else if (tid) { // tid (and possibly uid as well, in which case we defer to tid)
            const {error, dbResp} = await fastify.db.transaction.readInDB({tid: tid})
            if (error) return reply.code(400).send({error: error})
            return reply.code(200).send(dbResp)
        } else { // uid only
            const {error, dbResp} = await fastify.db.transaction.readInDB({uid: uid})
            if (error) return reply.code(400).send({error: error})
            return reply.code(200).send(dbResp)
        }
    })
    fastify.put('/', async function (request, reply) {
        const { tid, uid, amount } = request.body;
        if (!tid) return reply.code(400).send({ error: 'Missing tid' });
        const {error, dbResp} = await fastify.db.transaction.updateInDB({tid: tid, uid: uid, amount: amount}) 
        if (error) return reply.code(400).send({error: error})
        return reply.code(200).send(dbResp)
    })
    fastify.delete('/', async function (request, reply) {
        const { tid } = request.body;
        if (!tid) return reply.code(400).send({ error: 'Missing tid' });
        const {error, dbResp} = await fastify.db.transaction.deleteInDB({tid: tid}) 
        if (error) return reply.code(400).send({error: error})
        return reply.code(200).send(dbResp)
    })
}

export {transaction}