import { buildFastifyInst } from '../src/server'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
const DEV_DB = "None" // not even used here

let fastify;
beforeEach(async () => {
    fastify = buildFastifyInst({ DB_NAME: DEV_DB });
    await fastify.ready();
});
afterEach(async () => {
    await fastify?.close();
});

// CREATE
describe("Create Transaction", () => {
    test("Success", async () => {
        fastify.db = {
            transaction: {
                createInDB: vi.fn().mockResolvedValue({
                    error: null,
                    dbResp: {
                        tid: 1,
                        uid: 1,
                        amount: 20,
                        description: "desc",
                    }
                })
            }
        }
        const response = await fastify.inject({
            method: 'POST',
            url: "/transaction",
            payload: {
                uid: 1,
                amount: 20,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing UID", async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: "/transaction",
            payload: {
                amount: 20,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing UID"})
    });

    test("Unsuccessful due to missing amount", async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: "/transaction",
            payload: {
                uid: 1,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing amount"})
    });
})



// GET
describe("Read Transaction", () => {
    test("Success by TID", async () => {
        fastify.db = {
            transaction: {
                readInDB: vi.fn().mockResolvedValue({
                    error: null,
                    dbResp: [{
                        tid: 1,
                        uid: 1,
                        amount: 20,
                        description: "desc",
                    }]
                })
            }
        }
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction?tid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc"
        }])
        expect(response.statusCode).toBe(200)
    });

    test("Success by UID", async () => {
        fastify.db = {
            transaction: {
                readInDB: vi.fn().mockResolvedValue({
                    error: null,
                    dbResp: [{
                        tid: 1,
                        uid: 1,
                        amount: 20,
                        description: "desc",
                    },{
                        tid: 2,
                        uid: 1,
                        amount: 20,
                        description: "desc",
                    },{
                        tid: 3,
                        uid: 1,
                        amount: 20,
                        description: "desc",
                    }]
                })
            }
        }
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction?uid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc",
            },{
                tid: 2,
                uid: 1,
                amount: 20,
                description: "desc",
            },{
                tid: 3,
                uid: 1,
                amount: 20,
                description: "desc",
            }])
        expect(response.statusCode).toBe(200)
    });

    test("Success by UID and TID", async () => {
        fastify.db = {
            transaction: {
                readInDB: vi.fn().mockResolvedValue({
                    error: null,
                    dbResp: [{
                        tid: 1,
                        uid: 1,
                        amount: 20,
                        description: "desc",
                    }]
                })
            }
        };
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction?tid=1&uid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc",
            }])
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to insufficient keys", async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({error: "insufficient keys, provide either UID or TID"})
        expect(response.statusCode).toBe(400)
    });
})



// UPDATE
describe("Update Transaction", () => {
    test("Success", async () => {
        fastify.db = {
            transaction: {
                updateInDB: vi.fn().mockResolvedValue({error: null, dbResp: {
                    tid: 1,
                    uid: 1,
                    amount: 20,
                    description: "desc"
                }
            })
        }}
        const response = await fastify.inject({
            method: 'PUT',
            url: "/transaction",
            payload: {
                tid: 1,
                amount: 20,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({
            tid: 1,
            uid: 1,
            amount: 20,
            description: "desc"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing TID", async () => {
        const response = await fastify.inject({
            method: 'PUT',
            url: "/transaction",
            payload: {
                amount: 20,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing tid"})
    });
})

// DELETE
describe("Delete Transaction", () => {
    test("Success", async () => {
        fastify.db = {
            transaction: {
                deleteInDB: vi.fn().mockResolvedValue({error: null, dbResp: {
                    tid: 1,
                    uid: 1,
                    amount: 20,
                    description: "desc"
                }
            })
        }}
        const response = await fastify.inject({
            method: 'DELETE',
            url: "/transaction",
            payload: {
                tid: 1,
                amount: 20,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({
            tid: 1,
            uid: 1,
            amount: 20,
            description: "desc"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing TID", async () => {
        const response = await fastify.inject({
            method: 'DELETE',
            url: "/transaction",
            payload: {
                uid: 1,
                amount: 20,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing tid"})
    });
})