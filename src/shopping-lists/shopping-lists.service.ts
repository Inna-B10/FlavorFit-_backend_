import { Injectable } from '@nestjs/common'
import type { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ShoppingListsService {
	constructor(private readonly prisma: PrismaService) {}

	// 	 //* ---------------------------- All ShoppingLists --------------------------- */
	// 	async getAllShoppingLists() {
	// 		return this.prisma.shoppingList.findMany()
	// 	}
	//
	//   //* --------------------------------- By User Id --------------------------------- */
	//   async getShoppingListByUserId(userId: string) {
	//     return this.prisma.shoppingList.findUnique({ where: { userId }, include: { items: true } })
	//   }
}
