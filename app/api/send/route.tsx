import { EmailTemplate } from "@/components/email/email-template";
import { Resend } from "resend";
import { ConfirmationTemplate } from "@/components/email/confirmation-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { firstName, email, company, message } = body;

		if (!firstName || !email || !message) {
			return Response.json(
				{ error: "Name, email, and message are required" },
				{ status: 400 },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return Response.json(
				{ error: "Invalid email format" },
				{ status: 400 },
			);
		}

		if (message.length < 10) {
			return Response.json(
				{ error: "Message must be at least 10 characters" },
				{ status: 400 },
			);
		}

		if (message.length > 5000) {
			return Response.json(
				{ error: "Message is too long (maximum 5000 characters)" },
				{ status: 400 },
			);
		}

		const { data: mainEmailData, error: mainEmailError } =
			await resend.emails.send({
				from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
				to: [process.env.RESEND_TO_EMAIL || "delivered@resend.dev"],
				subject: `New message from ${firstName}${company ? ` - ${company}` : ""}`,
				react: EmailTemplate({ firstName, email, company, message }),
				replyTo: email,
			});

		if (mainEmailError) {
			console.error("Resend error:", mainEmailError);
			return Response.json(
				{ error: "Failed to send email. Please try again." },
				{ status: 500 },
			);
		}

		console.log("Email sent successfully:", mainEmailData);

		const { data: confirmationData, error: confirmationError } =
			await resend.emails.send({
				from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
				to: [email],
				subject: "Thank you for your message",
				react: ConfirmationTemplate({ firstName }),
				replyTo: email,
			});

		if (confirmationError) {
			console.error("Resend confirmation error:", confirmationError);
		} else {
			console.log("Confirmation email sent successfully:", confirmationData);
		}

		return Response.json(
			{
				success: true,
				data: {
					mainEmail: mainEmailData,
					confirmationEmail: confirmationData,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Server error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
