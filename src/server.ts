import dotenv from 'dotenv'
import express from 'express'
import { createContext } from './context'
import { appRouter } from './routers/_app'
import * as trpcExpress from '@trpc/server/adapters/express'

dotenv.config()
const app = express()
const apiEndpoint = '/trpc'

app.use(express.json())

app.use(
	apiEndpoint,
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext: createContext
	})
)

app.listen(3000, () => {
	console.log('Server is running')
})
