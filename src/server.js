import Fastify from 'fastify';
import { app } from '../src/app.js';
const db = "Test"
import { buildDbInterface } from '../src/db.js';
const PORT = 3000

function buildFastifyInst(dbInterface) {
    const fastify = Fastify({
        logger: {
            level: 'info',
            transport: {
                target: 'pino-pretty'
            }
        }
    });
    fastify.register(app, {
        dbInterface: dbInterface
    })
    return fastify
}

const fastify = buildFastifyInst(buildDbInterface(db))
if (process.env.NODE_ENV !== 'test') {
    fastify.listen({port: PORT}, (e, _) => {
        if (e) { 
            fastify.log.error(`Encountered error: ${e}`)
            process.exit(1)
        }
    })
}

export {buildFastifyInst}