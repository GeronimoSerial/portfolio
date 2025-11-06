import { EmailTemplate } from "@/components/email/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, email, message } = body;

    // Validar datos requeridos
    if (!firstName || !email) {
      return Response.json(
        { error: "firstName y email son requeridos" },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["delivered@resend.dev"], // Array correcto, no string
      subject: `Nuevo mensaje de ${firstName}`,
      react: EmailTemplate({ firstName }),
      replyTo: email,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
