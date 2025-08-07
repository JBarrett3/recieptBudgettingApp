async function user(fastify) {
    fastify.post('/', async function (request, reply) {
        const { name, email, password } = request.body;
        if (!name) return reply.code(400).send({ error: 'Missing name' });
        if (!email) return reply.code(400).send({ error: 'Missing email' });
        if (!password) return reply.code(400).send({error:"Missing password"});
        const {error, dbResp} = await fastify.db.user.createInDB({name, email, password})
        if (error) return reply.code(400).send({error: error})
        return reply.code(200).send(dbResp)
    })
    fastify.get('/', async function (request, reply) {
        const { uid, email } = request.query;
        if (!uid && !email) { 
            return reply.code(400).send({error: "insufficient keys, provide either UID or email"})
        } else if (uid && !email) {
            const {error, dbResp} = await fastify.db.user.readInDB({uid: uid})
            if (error) return reply.code(400).send({error: error})
            return reply.code(200).send(dbResp)
        } else if (!uid && email) {
            const {error, dbResp} = await fastify.db.user.readInDB({email: email})
            if (error) return reply.code(400).send({error: error})
            return reply.code(200).send(dbResp)
        } else { // both uid and tid
            const uidDbResp = await fastify.db.user.readInDB({uid: uid})
            if (uidDbResp.error) return reply.code(400).send({error: uidDbResp.error})
            const emailDbResp = await fastify.db.user.readInDB({email: email})
            if (emailDbResp.error) return reply.code(400).send({error: emailDbResp.error})
            if (JSON.stringify(uidDbResp.dbResp) !== JSON.stringify(emailDbResp.dbResp)) {
                return reply.code(400).send({error: "conflicting redundant keys"})
            }
            return reply.code(200).send(uidDbResp.dbResp)
        }
    })
    fastify.put('/', async function (request, reply) {
        const { uid, name, email, password } = request.body;
        if (!uid) return reply.code(400).send({ error: 'Missing uid' });
        const {error, dbResp} = await fastify.db.user.updateInDB({uid: uid, name: name, email: email, password: password}) 
        if (error) return reply.code(400).send({error: error})
        return reply.code(200).send(dbResp)
    })
    fastify.delete('/', async function (request, reply) {
        const { uid } = request.body;
        if (!uid) return reply.code(400).send({ error: 'Missing uid' });
        const {error, dbResp} = await fastify.db.user.deleteInDB({uid: uid}) 
        if (error) return reply.code(400).send({error: error})
        return reply.code(200).send(dbResp)
    })
}

export {user}