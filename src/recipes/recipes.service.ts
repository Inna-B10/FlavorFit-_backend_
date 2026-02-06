import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class RecipesService {
	constructor(private readonly prisma: PrismaService) {}
	async getAllRecipes() {
		return this.prisma.recipe.findMany({})
	}

	async getRecipeBySlug(slug: string) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				slug
			},
			include: {
				recipeSteps: true,
				ingredients: {
					include: {
						product: true
					}
				}
			}
		})
		if (!recipe) {
			throw new NotFoundException(`Recipe with SLUG ${slug} not found`)
		}
		return recipe
	}
}
