import dotenv from 'dotenv'
import express from 'express'
import { createContext } from './context'
import { appRouter } from './routers/_app'
import * as trpcExpress from '@trpc/server/adapters/express'

dotenv.config()
const app = express()
const apiEndpoint = '/trpc'

app.use(express.json())

// Add access control headers
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

app.use(
	apiEndpoint,
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext: createContext
	})
)

app.listen(process.env.PORT, () => {
	console.log('Server is running')
})
