import { EmailTemplate } from "@/components/email/email-template";
import { Resend } from "resend";
import { ConfirmationTemplate } from "@/components/email/confirmation-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, email, company, message, locale } = body;

    if (!firstName || !email || !message) {
      return Response.json(
        { error: "Nombre, email y mensaje son requeridos" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Formato de email inválido" },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return Response.json(
        { error: "El mensaje debe tener al menos 10 caracteres" },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return Response.json(
        { error: "El mensaje es demasiado largo (máximo 5000 caracteres)" },
        { status: 400 },
      );
    }

    // 4. Rate limiting básico (opcional - requiere Redis)
    // const ip = request.headers.get("x-forwarded-for") || "unknown";
    // Implementar lógica de rate limiting 

    // 5. Enviar email principal (a mí) con Resend
    const { data: mainEmailData, error: mainEmailError } =
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: [process.env.RESEND_TO_EMAIL || "delivered@resend.dev"],
        subject: `Nuevo mensaje de ${firstName}${company ? ` - ${company}` : ""}`,
        react: EmailTemplate({ firstName, email, company, message }),
        replyTo: email,
      });

    if (mainEmailError) {
      console.error("Resend error:", mainEmailError);
      return Response.json(
        { error: "Error al enviar el email. Por favor intenta de nuevo." },
        { status: 500 },
      );
    }

    console.log("Email enviado exitosamente:", mainEmailData);

    // 2 enviar email de confirmación al usuario
    const { data: confirmationData, error: confirmationError } =
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: [email],
        subject:
          locale === "en"
            ? "Thank you for your message"
            : "Gracias por tu mensaje",
        react: ConfirmationTemplate({
          firstName,
          locale: locale || "es",
        }),
        replyTo: email,
      });

    if (confirmationError) {
      console.error("Resend confirmation error:", confirmationError);
    } else {
      console.log(
        "Email de confirmación enviado exitosamente:",
        confirmationData,
      );
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
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
