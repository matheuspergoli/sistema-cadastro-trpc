import { loginRouter } from './login'
import { router } from '../utils/trpc'
import { registerRouter } from './register'

export const appRouter = router({
	register: registerRouter,
	login: loginRouter
})

export type AppRouter = typeof appRouter
