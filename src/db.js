function buildDbInterface(db) {
    return {
        user: {
            createInDB: async (payload) => {
                const dbResp = await db.insert(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            readInDB: async (payload) => {
                const dbResp = await db.get(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            updateInDB: async (payload) => {
                const dbResp = await db.put(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            deleteInDB: async (payload) => {
                const dbResp = await db.delete(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            }
        },
        transaction: {
            createInDB: async (payload) => {
                const dbResp = await db.insert(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            readInDB: async (payload) => {
                const dbResp = await db.get(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            updateInDB: async (payload) => {
                const dbResp = await db.put(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            },
            deleteInDB: async (payload) => {
                const dbResp = await db.delete(payload)
                if (dbResp == "error") {
                    return {error: dbResp, dbResp: null}
                }
                return {error: null, dbResp: dbResp}
            }
        }
    }
}

export {buildDbInterface}