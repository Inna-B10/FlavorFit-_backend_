import { Request, Response } from 'express'

export interface IGqlContext {
	req: Request
	res: Response
}
