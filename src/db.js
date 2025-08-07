function buildDbInterface(fastify) {
    return {
        user: {
            createInDB: async (payload) => {
                const {name, email, password} = payload
                const dbResp = await fastify.pg.query(`INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${password}')`)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp.rows}
            },
            readInDB: async (payload) => {
                const {uid, email} = payload
                let dbResp;
                if (uid) {
                    dbResp = await fastify.pg.query(`SELECT * FROM Users WHERE uid='${uid}'`)
                } else { //email
                    dbResp = await fastify.pg.query(`SELECT * FROM Users WHERE email='${email}'`)
                }
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp.rows}
            },
            updateInDB: async (payload) => {
                // TODO
                const dbResp = await fastify.pg.update(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            deleteInDB: async (payload) => {
                // TODO
                const dbResp = await fastify.pg.delete(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            }
        },
        transaction: {
            createInDB: async (payload) => {
                const {uid, amount, description} = payload
                let dbResp
                if (description) {
                    dbResp = await fastify.pg.query(`INSERT INTO Transactions (uid, amount, description) VALUES ('${uid}', '${amount}', '${description}')`)
                } else {
                    dbResp = await fastify.pg.query(`INSERT INTO Transactions (uid, amount) VALUES ('${uid}', '${amount}')`)
                }
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp.rows}
            },
            readInDB: async (payload) => {
                const {uid, tid} = payload
                let dbResp;
                if (uid) {
                    dbResp = await fastify.pg.query(`SELECT * FROM Transactions WHERE uid='${uid}'`)
                } else { //tid
                    dbResp = await fastify.pg.query(`SELECT * FROM Transactions WHERE tid='${tid}'`)
                }
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp.rows}
            },
            updateInDB: async (payload) => {
                // TODO
                const dbResp = await fastify.pg.put(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            deleteInDB: async (payload) => {
                // TODO
                const dbResp = await fastify.pg.delete(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            }
        }
    }
}

export {buildDbInterface}