import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildRecipesWhere, getOrderBy } from './helpers/recipe/build-recipes-query.helper'
import { RecipesQueryInput } from './inputs/recipe/get-recipes-query.input'

@Injectable()
export class RecipesService {
	constructor(private readonly prisma: PrismaService) {}

	//pagination, filter(category, searchTerm:name, description, ingredient), sorting (default by date, recommended by likes, popularity by views, by cookingTime)
	//* ------------------------------- All Recipes ------------------------------ */
	async getAllRecipes(input: RecipesQueryInput) {
		const page = Math.max(1, input.page ?? 1)
		const limit = Math.min(50, Math.max(1, input.limit ?? 10)) // safety cap
		const skip = (page - 1) * limit

		return this.prisma.recipe.findMany({
			skip,
			take: limit,
			where: buildRecipesWhere(input),
			orderBy: getOrderBy(input.sort),
			include: {
				_count: { select: { likes: true } },
				tags: { select: { tagId: true, tagName: true } }
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
				recipeSteps: { orderBy: { stepNumber: 'asc' } },
				tags: { select: { tagName: true } },
				nutritionFacts: true,
				author: {
					select: {
						firstName: true,
						avatarUrl: true
					}
				},
				_count: { select: { likes: true } }
			}
		})
		if (!recipe) {
			throw new NotFoundException(`Recipe with SLUG ${slug} not found`)
		}
		return recipe
	}
}
