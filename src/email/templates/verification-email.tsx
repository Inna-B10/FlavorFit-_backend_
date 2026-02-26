import process from 'process'
import * as React from 'react'

interface Props {
	userName: string
	url: string
}
export default function VerificationEmail({ userName, url }: Props) {
	return (
		<div>
			<h1
				style={{
					color: '#285430'
				}}
			>
				Dear {userName},
			</h1>

			<p>thank you for joining us!</p>
			<p>To complete registration, please verify your email address by clicking the link below:</p>

			<a
				href={url}
				target='_blank'
			>
				Verification Link
			</a>

			<p>or copy the link below and paste it into your browser</p>

			<a
				href={url}
				target='_blank'
			>
				{url}
			</a>
			<p
				style={{
					color: '#285430',
					fontWeight: 'bold'
				}}
			>
				Best regards,
				<br />
				{process.env.APP_NAME} team
			</p>
		</div>
	)
}
