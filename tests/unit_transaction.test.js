import { buildFastifyInst } from '../src/server'
import { describe, test, expect, vi, beforeEach } from 'vitest';

// CREATE
describe("Create Transaction", () => {
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            transaction: {
                createInDB: vi.fn()
            }
        };
    });
    
    test("Success", async () => {
        // prep mocked DB
        mockedDbInterface.transaction.createInDB.mockResolvedValue({
            error: null,
            dbResp: {
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc",
            }
        });
        const fastify = await buildFastifyInst(mockedDbInterface);
        // send simulated user input
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
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing UID", async () => {
        const fastify = buildFastifyInst(mockedDbInterface);
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
        const fastify = buildFastifyInst(mockedDbInterface);
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
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            transaction: {
                readInDB: vi.fn()
            }
        };
    });
    
    test("Success by TID", async () => {
        // prep mocked DB
        mockedDbInterface.transaction.readInDB.mockResolvedValue({
            error: null,
            dbResp: [{
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc",
            }]
        });
        const fastify = await buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction?tid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual([{
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc"
        }])
        expect(response.statusCode).toBe(200)
    });

    test("Success by UID", async () => {
        // prep mocked DB
        mockedDbInterface.transaction.readInDB.mockResolvedValue({
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
        });
        const fastify = await buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction?uid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
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
        // prep mocked DB
        mockedDbInterface.transaction.readInDB.mockResolvedValue({
            error: null,
            dbResp: [{
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc",
            }]
        });
        const fastify = await buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction?tid=1&uid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual([{
                tid: 1,
                uid: 1,
                amount: 20,
                description: "desc",
            }])
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to insufficient keys", async () => {
        // prep mocked DB
        const fastify = await buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({error: "insufficient keys, provide either UID or TID"})
        expect(response.statusCode).toBe(400)
    });
})



// UPDATE
describe("Update Transaction", () => {
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            transaction: {
                updateInDB: vi.fn()
            }
        };
    });
    test("Success", async () => {
        // prep mocked DB
        mockedDbInterface.transaction.updateInDB.mockResolvedValue({error: null, dbResp: {
            tid: 1,
            uid: 1,
            amount: 20,
            description: "desc"
        }});
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
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
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({
            tid: 1,
            uid: 1,
            amount: 20,
            description: "desc"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing TID", async () => {
        const fastify = buildFastifyInst(mockedDbInterface);
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
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            transaction: {
                deleteInDB: vi.fn()
            }
        };
    });
    test("Success", async () => {
        // prep mocked DB
        mockedDbInterface.transaction.deleteInDB.mockResolvedValue({error: null, dbResp: {
            tid: 1,
            uid: 1,
            amount: 20,
            description: "desc"
        }});
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
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
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({
            tid: 1,
            uid: 1,
            amount: 20,
            description: "desc"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing TID", async () => {
        const fastify = buildFastifyInst(mockedDbInterface);
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