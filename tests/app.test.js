import { buildFastifyInst } from '../src/server'
import { buildDbInterface } from '../src/db.js';
import { expect, test } from 'vitest'

test("Help", async () => {
    const fastify = buildFastifyInst(buildDbInterface("Test"));
    const response = await fastify.inject({
        method: 'GET',
        url: "/help"
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("visit /docs for API usage information")
});