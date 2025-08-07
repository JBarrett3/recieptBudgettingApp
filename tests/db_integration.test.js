import { buildFastifyInst } from '../src/server'
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { recreateDatabase } from '../utils/refreshDB'
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
const DEV_DB = "dev"

let fastify

beforeEach(async () => {
    await recreateDatabase(DEV_DB);
    fastify = await buildFastifyInst({ DB_NAME: DEV_DB });
    await fastify.db.user.createInDB({name: "John Doe", email: "John.doe.persists@gmail.com", password: "JohnLikesCats123"}) // uid=1
    await fastify.db.transaction.createInDB({uid: 1, amount: 20.00, description: "desc"}) // tid=1
    await fastify.db.transaction.createInDB({uid: 1, amount: 20.00, description: "desc"}) // tid=2
    await fastify.ready();
}); // before each test, there will be one user with two transactions, and we can infer their uid/tids
afterEach(async () => {
    await fastify?.close();
});

//Create User
describe("Create User", () => {
    test("Success", async () => {
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
        expect(JSON.parse(response.body)).toStrictEqual([])
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
        const fastify = buildFastifyInst({DB_NAME: DEV_DB});
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
        const fastify = buildFastifyInst({DB_NAME: DEV_DB});
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

// get user
describe("Get User", () => {
    test("Successful by UID", async () => {
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
            email: "John.doe.persists@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Successful by email", async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?email=John.doe.persists@gmail.com",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe.persists@gmail.com",
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
        const response = await fastify.inject({
            method: 'GET',
            url: "/user?uid=1&email=John.doe.persists@gmail.com&password=JohnLikesCats123",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
            uid: 1,
            name: "John Doe",
            email: "John.doe.persists@gmail.com",
            password: "JohnLikesCats123"
        }])
        expect(response.statusCode).toBe(200)
    })

    test("Unsuccessful (conflicting redundant keys)", async () => {
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



// update user
// describe("Update User", () => {
//     test("Success", async () => {
//         const response = await fastify.inject({
//             method: 'PUT',
//             url: "/user",
//             payload: {
//                 uid: 1,
//                 name: "John Doe",
//                 email: "John.doe@gmail.com",
//                 password: "NewPass"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(JSON.parse(response.body)).toStrictEqual({
//             uid: 1,
//             name: "John Doe",
//             email: "John.doe@gmail.com",
//             password: "NewPass"
//         })
//         expect(response.statusCode).toBe(200)
//     });

//     test("Unsuccessful due to missing UID", async () => {
//         const response = await fastify.inject({
//             method: 'PUT',
//             url: "/user",
//             payload: {
//                 name: "John Doe",
//                 email: "John.doe@gmail.com",
//                 password: "JohnLikesCats123"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(response.statusCode).toBe(400)
//         expect(JSON.parse(response.body)).toStrictEqual({error: "Missing uid"})
//     });
// })

// // delete user
// describe("Delete User", () => {
//     test("Success", async () => {
//         const response = await fastify.inject({
//             method: 'DELETE',
//             url: "/user",
//             payload: {
//                 uid: 1,
//                 name: "John Doe",
//                 email: "John.doe@gmail.com",
//                 password: "JohnLikesCats123"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(JSON.parse(response.body)).toStrictEqual({
//             uid: 1,
//             name: "John Doe",
//             email: "John.doe@gmail.com",
//             password: "JohnLikesCats123"
//         })
//         expect(response.statusCode).toBe(200)
//     });

//     test("Unsuccessful due to missing UID", async () => {
//         const response = await fastify.inject({
//             method: 'DELETE',
//             url: "/user",
//             payload: {
//                 name: "John Doe",
//                 email: "John.doe@gmail.com",
//                 password: "JohnLikesCats123"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(response.statusCode).toBe(400)
//         expect(JSON.parse(response.body)).toStrictEqual({error: "Missing uid"})
//     });
// })



// create transaction
describe("Create Transaction", () => {
    test("Success", async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: "/transaction",
            payload: {
                uid: 1,
                amount: 20.00,
                description: "desc"
            },
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([])
        expect(response.statusCode).toBe(200)
    });

    test("Unsuccessful due to missing UID", async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: "/transaction",
            payload: {
                amount: 20.00,
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
    afterEach(async () => {
        await fastify?.close();
    });
    test("Success by TID", async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: "/transaction?tid=1",
            headers: {
            'Content-Type': 'application/json'
            }
        })
        expect(JSON.parse(response.body)).toStrictEqual([{
                uid: 1,
                tid: 1,
                amount: "20.00",
                description: "desc"
        }])
        expect(response.statusCode).toBe(200)
    });

    test("Success by UID", async () => {
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
                amount: "20.00",
                description: "desc",
            },{
                tid: 2,
                uid: 1,
                amount: "20.00",
                description: "desc",
            }])
        expect(response.statusCode).toBe(200)
    });

    test("Success by UID and TID", async () => {
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
                amount: "20.00",
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



// // UPDATE
// describe("Update Transaction", () => {
//     test("Success", async () => {
//         const response = await fastify.inject({
//             method: 'PUT',
//             url: "/transaction",
//             payload: {
//                 tid: 1,
//                 amount: 20,
//                 description: "desc"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(JSON.parse(response.body)).toStrictEqual({
//             tid: 1,
//             uid: 1,
//             amount: 20,
//             description: "desc"
//         })
//         expect(response.statusCode).toBe(200)
//     });

//     test("Unsuccessful due to missing TID", async () => {
//         const response = await fastify.inject({
//             method: 'PUT',
//             url: "/transaction",
//             payload: {
//                 amount: 20,
//                 description: "desc"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(response.statusCode).toBe(400)
//         expect(JSON.parse(response.body)).toStrictEqual({error: "Missing tid"})
//     });
// })

// // DELETE
// describe("Delete Transaction", () => {
//     test("Success", async () => {
//         const response = await fastify.inject({
//             method: 'DELETE',
//             url: "/transaction",
//             payload: {
//                 tid: 1,
//                 amount: 20,
//                 description: "desc"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(JSON.parse(response.body)).toStrictEqual({
//             tid: 1,
//             uid: 1,
//             amount: 20,
//             description: "desc"
//         })
//         expect(response.statusCode).toBe(200)
//     });

//     test("Unsuccessful due to missing TID", async () => {
//         const response = await fastify.inject({
//             method: 'DELETE',
//             url: "/transaction",
//             payload: {
//                 uid: 1,
//                 amount: 20,
//                 description: "desc"
//             },
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         })
//         expect(response.statusCode).toBe(400)
//         expect(JSON.parse(response.body)).toStrictEqual({error: "Missing tid"})
//     });
// })