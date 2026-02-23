import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { IGqlContext } from 'src/app.interface'
import { AuthService } from './auth.service'
import { LoginInput, RegisterInput } from './inputs/auth.input'
import { AuthResponse } from './models/auth-response.model'

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	//* -------------------------------- Register -------------------------------- */
	//[TODO] captcha
	@Mutation(() => AuthResponse)
	async register(@Args('data') input: RegisterInput) {
		return await this.authService.register(input)
	}

	//* ---------------------------------- Login --------------------------------- */
	//[TODO] captcha
	@Mutation(() => AuthResponse)
	async login(@Args('data') input: LoginInput, @Context() { res }: IGqlContext) {
		const { refreshToken, accessToken, ...response } = await this.authService.login(input)
		this.authService.toggleAccessTokenCookie(res, accessToken)
		this.authService.toggleRefreshTokenCookie(res, refreshToken)

		return response
	}

	//* --------------------------------- Logout --------------------------------- */
	@Mutation(() => Boolean)
	logout(@Context() { res, req }: IGqlContext) {
		const refreshToken = req.cookies?.[this.authService.REFRESH_TOKEN_COOKIE_NAME]

		if (!refreshToken) {
			this.authService.toggleAccessTokenCookie(res, null)
			throw new BadRequestException('Refresh token is missing')
		}

		this.authService.toggleAccessTokenCookie(res, null)
		this.authService.toggleRefreshTokenCookie(res, null)

		return true
	}

	//* ------------------------------- New Tokens ------------------------------- */
	@Query(() => AuthResponse)
	async newTokens(@Context() { req, res }: IGqlContext) {
		const refreshToken = req.cookies?.[this.authService.REFRESH_TOKEN_COOKIE_NAME]

		if (!refreshToken) {
			this.authService.toggleAccessTokenCookie(res, null)
			this.authService.toggleRefreshTokenCookie(res, null)

			throw new BadRequestException('Refresh token is missing')
		}

		const {
			refreshToken: newRefreshToken,
			accessToken,
			...response
		} = await this.authService.getNewTokens(refreshToken)

		this.authService.toggleAccessTokenCookie(res, accessToken)
		this.authService.toggleRefreshTokenCookie(res, newRefreshToken)

		return response
	}

	//* ------------------------------ Verify Email ------------------------------ */
	@Mutation(() => AuthResponse)
	async verifyEmail(@Args('token') token: string, @Context() { res }: IGqlContext) {
		if (!token) {
			throw new UnauthorizedException('Token not passed')
		}

		const { refreshToken, accessToken, ...response } = await this.authService.verifyEmail(token)

		this.authService.toggleAccessTokenCookie(res, accessToken)
		this.authService.toggleRefreshTokenCookie(res, refreshToken)

		return response
	}

	//* ---------------------------- Resend Verification ------------------------- */
	@Mutation(() => Boolean)
	resendVerification(@Args('email') email: string) {
		return this.authService.resendVerification(email)
	}
}
