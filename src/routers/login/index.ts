import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { TRPCError } from '@trpc/server'
import { router, procedure } from '../../utils/trpc'

export const loginRouter = router({
	user: procedure
		.input(
			z.object({
				email: z.string().email(),
				password: z.string().min(6)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findUnique({
				where: {
					email: input.email
				}
			})

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Usuário não encontrado'
				})
			}

			const isPasswordCorrect = await bcrypt.compare(input.password, user.password)

			if (!isPasswordCorrect) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Login inválido'
				})
			}

			const jwtSecret = process.env.JWT_SECRET as string
			const token = jwt.sign({ user }, jwtSecret, {
				expiresIn: '7d'
			})

			return {
				id: user.id,
				name: user.name,
				email: user.email,
				token: token
			}
		})
})
