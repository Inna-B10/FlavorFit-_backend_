import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'
import { RecipeDraftStatus } from 'src/graphql/graphql.enums'

export async function getRejectedRecipeDraftForAuthor(
	tx: Prisma.TransactionClient,
	recipeDraftId: string,
	userId: string
) {
	const draft = await tx.recipeDraft.findUnique({
		where: { recipeDraftId }
	})

	if (!draft) {
		throw new NotFoundException('Recipe draft not found')
	}

	if (draft.userId !== userId) {
		throw new ForbiddenException('You cannot edit this recipe draft')
	}

	if (draft.status !== RecipeDraftStatus.REJECTED) {
		throw new ForbiddenException('Only rejected recipe drafts can be edited')
	}

	return draft
}
