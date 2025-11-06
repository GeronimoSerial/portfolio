import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Link,
} from "@react-email/components";

interface ConfirmationTemplateProps {
  firstName: string;
  locale?: string; // 'es' o 'en'
}

export function ConfirmationTemplate({
  firstName,
  locale = "es",
}: ConfirmationTemplateProps) {
  const content = {
    es: {
      greeting: `¡Hola ${firstName}!`,
      title: "Gracias por contactarme",
      message1: "He recibido tu mensaje y lo estoy revisando.",
      message2:
        "Te responderé lo antes posible, generalmente en menos de 24 horas.",
      message3:
        "Mientras tanto, si necesitas contactarme urgentemente, puedes escribirme directamente a:",
      footer:
        "Este es un email automático. Por favor no respondas a este mensaje.",
      regards: "Saludos,",
      signature: "Geronimo Serial",
      role: "Full-stack Developer & Technical Consultant",
    },
    en: {
      greeting: `Hi ${firstName}!`,
      title: "Thanks for reaching out",
      message1: "I've received your message and I'm reviewing it.",
      message2:
        "I'll get back to you as soon as possible, usually within 24 hours.",
      message3:
        "In the meantime, if you need to contact me urgently, you can email me directly at:",
      footer:
        "This is an automated email. Please do not reply to this message.",
      regards: "Best regards,",
      signature: "Geronimo Serial",
      role: "Full-stack Developer & Technical Consultant",
    },
  };

  const t = content[locale as keyof typeof content] || content.es;

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fafafa",
          padding: "20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Header con marca */}
          <Section
            style={{
              backgroundColor: "#18181b",
              padding: "30px 40px",
              textAlign: "center",
            }}
          >
            <Heading
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "300",
                margin: "0",
                letterSpacing: "-0.5px",
              }}
            >
              geroserial.com
            </Heading>
          </Section>

          {/* Contenido principal */}
          <Section style={{ padding: "40px" }}>
            <Text
              style={{
                fontSize: "20px",
                color: "#18181b",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              {t.greeting}
            </Text>

            <Heading
              style={{
                color: "#18181b",
                fontSize: "24px",
                fontWeight: "400",
                marginTop: "0",
                marginBottom: "24px",
              }}
            >
              {t.title}
            </Heading>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "16px 0",
              }}
            >
              {t.message1}
            </Text>

            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "16px 0",
              }}
            >
              {t.message2}
            </Text>

            <Hr
              style={{
                borderColor: "#e4e4e7",
                margin: "30px 0",
              }}
            />

            <Text
              style={{
                color: "#71717a",
                fontSize: "14px",
                lineHeight: "1.6",
                margin: "16px 0",
              }}
            >
              {t.message3}
            </Text>

            <Link
              href="mailto:contact@geroserial.com"
              style={{
                color: "#18181b",
                fontSize: "16px",
                fontWeight: "500",
                textDecoration: "none",
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#f4f4f5",
                borderRadius: "6px",
                margin: "10px 0",
              }}
            >
              contact@geroserial.com
            </Link>

            <Hr
              style={{
                borderColor: "#e4e4e7",
                margin: "30px 0",
              }}
            />

            {/* Firma */}
            <Text
              style={{
                color: "#52525b",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "8px",
              }}
            >
              {t.regards}
            </Text>

            <Text
              style={{
                color: "#18181b",
                fontSize: "16px",
                fontWeight: "600",
                margin: "0",
              }}
            >
              {t.signature}
            </Text>

            <Text
              style={{
                color: "#71717a",
                fontSize: "14px",
                margin: "4px 0 0 0",
              }}
            >
              {t.role}
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#fafafa",
              padding: "20px 40px",
              borderTop: "1px solid #e4e4e7",
            }}
          >
            <Text
              style={{
                color: "#a1a1aa",
                fontSize: "12px",
                lineHeight: "1.5",
                margin: "0",
                textAlign: "center",
              }}
            >
              {t.footer}
            </Text>

            <Text
              style={{
                color: "#d4d4d8",
                fontSize: "11px",
                margin: "12px 0 0 0",
                textAlign: "center",
              }}
            >
              © 2024 geroserial.com • Corrientes, Argentina
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
