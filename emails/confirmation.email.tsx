import * as React from 'react'

interface Props {
	userName: string
	url: string
}
export default function VerificationEmail({ userName, url }: Props) {
	return (
		<div>
			<h1>Dear {userName},</h1>

			<p>
				Thank you for registering with us. To complete your registration, please verify your email
				address by clicking the link below:
			</p>

			<a href={url}>Verification Link</a>

			<p>or copy the link below and paste it into your browser</p>

			<a
				href={url}
				target='_blank'
				style={{
					color: '#285430'
				}}
			>
				{url}
			</a>
		</div>
	)
}
