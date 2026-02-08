import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class RecipesService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------- All Recipes ------------------------------ */
	async getAllRecipes() {
		return this.prisma.recipe.findMany({
			include: {
				likes: true
			}
		})
	}

	//* --------------------------------- By Slug -------------------------------- */
	async getRecipeBySlug(slug: string) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				slug
			},
			include: {
				ingredients: {
					include: {
						product: {
							select: {
								name: true,
								iconUrl: true
							}
						}
					}
				},
				recipeSteps: {
					orderBy: { stepNumber: 'asc' }
				},
				tags: {
					select: { tagName: true }
				},
				nutritionFacts: true,
				author: {
					select: {
						firstName: true,
						avatarUrl: true
					}
				},
				_count: {
					select: { likes: true }
				}
			}
		})
		if (!recipe) {
			throw new NotFoundException(`Recipe with SLUG ${slug} not found`)
		}
		return recipe
	}
}
