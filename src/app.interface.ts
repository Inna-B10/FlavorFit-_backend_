import { Request, Response } from 'express'

interface IRequestWithCookies extends Request {
	cookies: Record<string, string | undefined>
}
export interface IGqlContext {
	req: IRequestWithCookies
	res: Response
}
