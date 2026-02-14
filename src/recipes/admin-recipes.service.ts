import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'

@Injectable()
export class AdminRecipesService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------- All Recipes ------------------------------ */
	async getAllRecipes() {
		return this.prisma.recipe.findMany()
	}
	//* ------------------------------ Recipe By Id ------------------------------ */
	async getRecipeById(recipeId: string) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				recipeId
			},
			include: {
				ingredients: {
					include: {
						product: {
							include: {
								productVariants: true
							}
						}
					}
				},
				recipeSteps: true,
				tags: true,
				nutritionFacts: true,
				author: true,
				_count: { select: { likes: true } },
				comments: true
			}
		})
		if (!recipe) {
			throw new NotFoundException(`Recipe with ID ${recipeId} not found`)
		}
		return recipe
	}

	//* ------------------------------ Delete Recipe ----------------------------- */
	async deleteRecipe(recipeId: string) {
		try {
			return await this.prisma.recipe.delete({
				where: {
					recipeId
				}
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'recipe', id: recipeId } })
		}
	}
}
