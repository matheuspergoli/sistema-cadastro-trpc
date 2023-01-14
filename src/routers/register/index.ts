import { z } from 'zod'
import bcrypt from 'bcrypt'
import { TRPCError } from '@trpc/server'
import { procedure, router } from '../../utils/trpc'

export const registerRouter = router({
	create: procedure
		.input(
			z.object({
				name: z.string().min(3).max(20),
				email: z.string().email(),
				password: z.string().min(6)
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userExists = await ctx.prisma.user.findFirst({
				where: {
					email: input.email
				}
			})

			if (userExists) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Usuário já cadastrado'
				})
			}

			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(input.password, salt)

			const newUser = ctx.prisma.user.create({
				data: {
					name: input.name,
					email: input.email,
					password: hashedPassword
				}
			})

			return newUser
		})
})
