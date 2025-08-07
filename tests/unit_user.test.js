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
describe("Create User", () => {
    test("Success", async () => {
        fastify.db = {
            user: {
                createInDB: vi.fn().mockResolvedValue({
                    error: null,
                    dbResp: {
                        uid: 1,
                        name: "John Doe",
                        email: "John.doe@gmail.com",
                        password: "JohnLikesCats123"
                    }
                })
            }
        }
        const response = await fastify.inject({
            method: 'POST',
            url: "/user",
            payload: {
                name: "John Doe",
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing name", async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: "/user",
            payload: {
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing name"})
    });

    test("Unsuccessful due to missing email", async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: "/user",
            payload: {
                name: "John Doe",
                password: "JohnLikesCats123"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing email"})
    });

    test("Unsuccessful due to missing password", async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: "/user",
            payload: {
                name: "John Doe",
                email: "John.doe@gmail.com",
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing password"})
    });
})



// GET
describe("Get User", () => {
    test("Successful by UID", async () => {
        fastify.db = {
            user: {
                readInDB: vi.fn().mockResolvedValue({error: null, dbResp:[{
                    uid: 1,
                    name: "John Doe",
                    email: "John.doe@gmail.com",
                    password: "JohnLikesCats123"
                }]})
            }
        }
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?uid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Successful by email", async () => {
        fastify.db = {
            user: {
                readInDB: vi.fn().mockResolvedValue(({error: null, dbResp: [{
                uid: 1,
                name: "John Doe",
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            }]
        }))}};
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?email=John.doe@gmail.com",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Unsuccessful (insufficient keys)", async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: "/user",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({error: "insufficient keys, provide either UID or email"})
        expect(response.statusCode).toBe(400)
    })

    test("Successful (matching redundant keys)", async () => {
        fastify.db = {
            user: {
                readInDB: vi.fn().mockResolvedValue({error: null, dbResp: [{
                    uid: 1,
                    name: "John Doe",
                    email: "John.doe@gmail.com",
                    password: "JohnLikesCats123"
                }]})
            }
        };
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?uid=1&email=John.doe@gmail.com&password=JohnLikesCats123",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Unsuccessful (conflicting redundant keys)", async () => {
        fastify.db = {
            user: {
                readInDB: vi.fn().mockResolvedValueOnce({error: null, dbResp: {
                    uid: 1,
                    name: "John Doe",
                    email: "John.doe@gmail.com",
                    password: "JohnLikesCats123"
                }}).mockResolvedValueOnce({
                    uid: 5,
                    name: "Jane Doe",
                    email: "Jane.doe@gmail.com",
                    password: "JaneLikesDogs123"
                })
            }
        }
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?uid=1&email=Jane.doe@gmail.com",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({error: "conflicting redundant keys"})
        expect(response.statusCode).toBe(400)
    })
})

// UPDATE
describe("Update User", () => {
    test("Success", async () => {
        fastify.db = {
            user: {
                updateInDB: vi.fn().mockResolvedValue({error: null, dbResp: {
                    uid: 1,
                    name: "John Doe",
                    email: "John.doe@gmail.com",
                    password: "JohnLikesCats123"
        }})}};
        const response = await fastify.inject({
            method: 'PUT',
            url: "/user",
            payload: {
                uid: 1,
                name: "John Doe",
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing UID", async () => {
        const response = await fastify.inject({
            method: 'PUT',
            url: "/user",
            payload: {
                name: "John Doe",
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing uid"})
    });
})

// DELETE
describe("Delete User", () => {
    test("Success", async () => {
        fastify.db = {
            user: {
                deleteInDB: vi.fn().mockResolvedValue({error: null, dbResp: {
                    uid: 1,
                    name: "John Doe",
                    email: "John.doe@gmail.com",
                    password: "JohnLikesCats123"
                }})
            }
        }
        const response = await fastify.inject({
            method: 'DELETE',
            url: "/user",
            payload: {
                uid: 1,
                name: "John Doe",
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual({
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing UID", async () => {
        const response = await fastify.inject({
            method: 'DELETE',
            url: "/user",
            payload: {
                name: "John Doe",
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(response.statusCode).toBe(400)
        expect(JSON.parse(response.body)).toStrictEqual({error: "Missing uid"})
    });
})