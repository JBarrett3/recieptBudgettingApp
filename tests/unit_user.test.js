import { buildFastifyInst } from '../src/server'
import { describe, test, expect, vi, beforeEach } from 'vitest';

// CREATE
describe("Create User", () => {
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            user: {
                createInDB: vi.fn()
            }
        };
    });
    
    test("Success", async () => {
        // prep mocked DB
        mockedDbInterface.user.createInDB.mockResolvedValue({
            error: null,
            dbResp: {
                uid: 1,
                name: "John Doe",
                email: "John.doe@gmail.com",
                password: "JohnLikesCats123"
            }
        });
        const fastify = await buildFastifyInst(mockedDbInterface);
        // send simulated user input
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
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing name", async () => {
        const fastify = buildFastifyInst(mockedDbInterface);
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
        const fastify = buildFastifyInst(mockedDbInterface);
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
        const fastify = buildFastifyInst(mockedDbInterface);
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
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            user: {
                readInDB: vi.fn()
            }
        };
    });
    test("Successful by UID", async () => {
        // prep mocked DB
        mockedDbInterface.user.readInDB.mockResolvedValue({error: null, dbResp:[{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }]});
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?uid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Successful by email", async () => {
        // prep mocked DB
        mockedDbInterface.user.readInDB.mockResolvedValue({error: null, dbResp: [{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }]});
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?email=John.doe@gmail.com",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Unsuccessful (insufficient keys)", async () => {
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/user",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({error: "insufficient keys, provide either UID or email"})
        expect(response.statusCode).toBe(400)
    })

    test("Successful (matching redundant keys)", async () => {
        // prep mocked DB
        mockedDbInterface.user.readInDB.mockResolvedValue({error: null, dbResp: [{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }]});
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?uid=1&email=John.doe@gmail.com&password=JohnLikesCats123",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Unsuccessful (conflicting redundant keys)", async () => {
        // prep mocked DB
        mockedDbInterface.user.readInDB.mockResolvedValue({error: null, dbResp: {
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }}).mockResolvedValueOnce({
            uid: 5,
            name: "Jane Doe",
            email: "Jane.doe@gmail.com",
            password: "JaneLikesDogs123"
        });
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?uid=1&email=Jane.doe@gmail.com",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({error: "conflicting redundant keys"})
        expect(response.statusCode).toBe(400)
    })
})

// UPDATE
describe("Update User", () => {
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            user: {
                updateInDB: vi.fn()
            }
        };
    });
    test("Success", async () => {
        // prep mocked DB
        mockedDbInterface.user.updateInDB.mockResolvedValue({error: null, dbResp: {
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }});
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
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
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing UID", async () => {
        const fastify = buildFastifyInst(mockedDbInterface);
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
    let mockedDbInterface;
    beforeEach(() => {
        mockedDbInterface = {
            user: {
                deleteInDB: vi.fn()
            }
        };
    });
    test("Success", async () => {
        // prep mocked DB
        mockedDbInterface.user.deleteInDB.mockResolvedValue({error: null, dbResp: {
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        }});
        const fastify = buildFastifyInst(mockedDbInterface);
        // send simulated user input
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
        // confirm expected application output
        expect(JSON.parse(response.body)).toStrictEqual({
            uid: 1,
            name: "John Doe",
            email: "John.doe@gmail.com",
            password: "JohnLikesCats123"
        })
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing UID", async () => {
        const fastify = buildFastifyInst(mockedDbInterface);
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