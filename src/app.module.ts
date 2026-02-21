import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CartsModule } from './carts/carts.module'
import { getGraphQLConfig } from './config/graphql.config'
import { EmailModule } from './email/email.module'
import { DecimalScalar } from './graphql/scalars/decimal.scalar'
import { OrdersModule } from './orders/orders.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProductsModule } from './products/products.module'
import { RecipesModule } from './recipes/recipes.module'
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),
		AuthModule,
		EmailModule,
		UsersModule,
		ProductsModule,
		RecipesModule,
		ShoppingListsModule,
		CartsModule,
		OrdersModule,
		PrismaModule
	],
	controllers: [AppController],
	providers: [AppService, DecimalScalar]
})
export class AppModule {}
