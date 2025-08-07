import Fastify from 'fastify';
import postgres from '@fastify/postgres'
import { app } from '../src/app.js';
import { buildDbInterface } from '../src/db.js';
const PORT = 3000
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

function buildFastifyInst(options) {
    const fastify = Fastify({
        logger: {
            level: 'info',
            transport: {
                target: 'pino-pretty'
            }
        }
    });
    let DB_NAME = "prod"
    try {
        DB_NAME = options.DB_NAME
    } catch{}
    fastify.register(postgres, {
        connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${Number(process.env.DB_PORT)}/${DB_NAME}`,
    })
    fastify.decorate('db', buildDbInterface(fastify))
    fastify.register(app)
    return fastify
}

const fastify = buildFastifyInst()
if (process.env.NODE_ENV !== 'test') {
    fastify.listen({port: PORT}, (e, _) => {
        if (e) { 
            fastify.log.error(`Encountered error: ${e}`)
            process.exit(1)
        }
    })
}

export {buildFastifyInst}