import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthInput } from './auth.input'
import { AuthResponse } from './auth.interface'
import { AuthService } from './auth.service'

@Resolver()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	//[TODO] captcha
	@Mutation(() => AuthResponse)
	async register(@Args('data') input: AuthInput) {
		//[TODO] add cookies
		return this.authService.register(input)
	}
}
