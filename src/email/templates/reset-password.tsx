import process from 'process'
import * as React from 'react'

interface Props {
	userName: string
	url: string
}
export default function ResetPasswordEmail({ userName, url }: Props) {
	return (
		<div>
			<h1
				style={{
					color: '#285430'
				}}
			>
				Dear {userName},
			</h1>
			<p>
				We have received a request to reset password for your{' '}
				<span style={{ fontWeight: 'bold' }}>{process.env.APP_NAME}</span> account. To ensure the
				security of your account, we are sending you a verification email to reset your password.
			</p>
			<ul style={{ listStyleType: 'number' }}>
				To reset your password, please follow the instructions below:
				<li>
					Click on the link below to go to the password reset page:{' '}
					<a
						href={url}
						target='_blank'
					>
						{url}
					</a>
				</li>
				<li>Enter your new password in the required field.</li>
				<li>Click on the "Submit" button to confirm the new password.</li>
			</ul>
			<ul style={{ listStyleType: 'disc' }}>
				Please note that your new password must meet the following requirements:
				<li>At least 8 characters long</li>
				<li>Contains at least one uppercase letter</li>
				<li>Contains at least one lowercase letter</li>
				<li>Contains at least one digit</li>
				{/* <li>Contains at least one special character</li> */}
			</ul>
			<p>
				If you have any questions or need assistance with resetting your password, please contact
				our support team.
				{/* If you have any questions or need assistance with resetting your password, please contact
				our support team at [адрес электронной почты]. */}
			</p>
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
