import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { IGqlContext } from 'src/app.interface'
import { AuthAccountService } from './auth-account.service'
import { AuthService } from './auth.service'
import { LoginInput, RegisterInput } from './inputs/auth.input'
import { RequestEmailActionsInput } from './inputs/request-email-actions.input'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { AuthResponse } from './models/auth-response.model'

@Resolver()
export class AuthResolver {
	constructor(
		private authService: AuthService,
		private authAccountService: AuthAccountService
	) {}

	//* -------------------------------- Register -------------------------------- */
	@Mutation(() => AuthResponse)
	// @VerifyCaptcha()
	async register(@Args('data') input: RegisterInput) {
		return await this.authService.register(input)
	}

	//* ---------------------------------- Login --------------------------------- */

	@Mutation(() => AuthResponse)
	// @VerifyCaptcha()
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
			// throw new BadRequestException('Refresh token is missing')
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
	// @VerifyCaptcha()
	async verifyEmail(
		@Args('token', { type: () => String }) token: string,
		@Context() { res }: IGqlContext
	) {
		if (!token) {
			throw new UnauthorizedException('Token not passed')
		}

		const { refreshToken, accessToken, ...response } =
			await this.authAccountService.verifyEmail(token)

		this.authService.toggleAccessTokenCookie(res, accessToken)
		this.authService.toggleRefreshTokenCookie(res, refreshToken)

		return response
	}

	//* ---------------------------- Resend Verification ------------------------- */
	@Mutation(() => Boolean)
	// @VerifyCaptcha()
	requestVerificationEmail(@Args('data') input: RequestEmailActionsInput) {
		return this.authAccountService.resendVerification(input.email)
	}

	//* ---------------------------- Request Password Reset ------------------------- */
	@Mutation(() => Boolean)
	// @VerifyCaptcha()
	requestPasswordReset(@Args('data') input: RequestEmailActionsInput) {
		return this.authAccountService.requestPasswordReset(input.email)
	}

	//* ---------------------------- Validate Reset Token ------------------------- */
	@Query(() => Boolean)
	// @VerifyCaptcha()
	validateResetToken(@Args('token', { type: () => String }) token: string) {
		return this.authAccountService.validateResetToken(token)
	}

	//* ---------------------------- Reset Password ------------------------- */
	@Mutation(() => Boolean)
	// @VerifyCaptcha()
	resetPassword(@Args('data') input: ResetPasswordInput) {
		return this.authAccountService.resetPassword(input.token, input.newPassword)
	}
}
