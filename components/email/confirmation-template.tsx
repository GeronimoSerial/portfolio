import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Heading,
} from "@react-email/components";

interface ConfirmationTemplateProps {
  firstName: string;
  locale?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export function ConfirmationTemplate({
  firstName,
  locale = "es",
}: ConfirmationTemplateProps) {
  const content = {
    es: {
      preview: "Confirmación de Contacto",
      greeting: `Hola ${firstName}`,
      title: "Gracias por contactarme",
      message1: "Recibí tu mensaje y lo voy a revisar cuidadosamente.",
      message2:
        "Te respondo a la brevedad posible, generalmente dentro de las próximas 24 horas.",
      message3:
        "Si necesitas contactarme con urgencia, escríbeme directamente a:",
      cta: "contact@geroserial.com",
      footer:
        "Este es un email automático. Por favor no respondas a este mensaje.",
      regards: "Saludos",
      signature: "Geronimo Serial",
      role: "Especialista en IT · Infraestructura, Automatización y Gestión de Sistemas",
      location: "Corrientes, Argentina",
      links: {
        github: "GitHub",
        linkedin: "LinkedIn",
      },
    },
    en: {
      preview: "Contact Confirmation",
      greeting: `Hi ${firstName}`,
      title: "Thanks for reaching out",
      message1: "I've received your message and I'm reviewing it carefully.",
      message2:
        "I'll get back to you as soon as possible, usually within the next 24 hours.",
      message3: "If you need to contact me urgently, email me directly at:",
      cta: "contact@geroserial.com",
      footer:
        "This is an automated email. Please do not reply to this message.",
      regards: "Best regards",
      signature: "Geronimo Serial",
      role: "IT Specialist · Infrastructure, Automation & Systems Management",
      location: "Corrientes, Argentina",
      links: {
        github: "GitHub",
        linkedin: "LinkedIn",
      },
    },
  };

  const t = content[locale as keyof typeof content] || content.es;

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Accent line superior */}
          <Section style={accentLine}></Section>

          {/* Header minimalista */}
          <Section style={header}>
            <Text style={headerText}>geroserial.com</Text>
          </Section>

          {/* Contenido principal */}
          <Section style={contentSection}>
            <Heading style={title}>{t.title}</Heading>
            <Text style={greeting}>{t.greeting}</Text>

            <Text style={paragraph}>{t.message1}</Text>
            <Text style={paragraph}>{t.message2}</Text>

            {/* Separator sutil */}
            <Hr style={hr} />

            <Text style={paragraph}>{t.message3}</Text>

            {/* CTA con estilo glass */}
            <Section style={ctaSection}>
              <Link href="mailto:contact@geroserial.com" style={button}>
                {t.cta}
              </Link>
            </Section>

            {/* Separator */}
            <Hr style={hr} />

            {/* Firma elegante */}
            <Section style={signatureSection}>
              <Text style={regards}>{t.regards},</Text>
              <Text style={signatureName}>{t.signature}</Text>
              <Text style={signatureRole}>{t.role}</Text>
              <Section style={locationSection}>
                <Text style={locationText}>
                  <span style={locationDot}>●</span> {t.location}
                </Text>
              </Section>
            </Section>
          </Section>

          {/* Footer premium */}
          <Section style={footer}>
            <Text style={footerText}>{t.footer}</Text>

            {/* Enlaces sociales con separador */}
            <Row style={linksRow}>
              <Column align="center">
                <Link
                  href="https://github.com/GeronimoSerial"
                  style={footerLink}
                >
                  {t.links.github}
                </Link>
                <Text style={linkSeparator}>•</Text>
                <Link
                  href="https://linkedin.com/in/geroserial"
                  style={footerLink}
                >
                  {t.links.linkedin}
                </Link>
              </Column>
            </Row>

            <Text style={footerCopyright}>
              geroserial.com — Methodical Approach. Real-World Solutions.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ConfirmationTemplate;

// Estilos modernos dark-oriented
const main = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  padding: "20px 0",
  WebkitFontSmoothing: "antialiased" as const,
  MozOsxFontSmoothing: "grayscale" as const,
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#111111",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #1a1a1a",
};

const accentLine = {
  height: "2px",
  background: "linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)",
};

const header = {
  padding: "32px 40px 0 40px",
};

const headerText = {
  margin: "0",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "500" as const,
  letterSpacing: "0.5px",
};

const contentSection = {
  padding: "24px 40px 40px 40px",
};

const title = {
  color: "#f9fafb",
  fontSize: "32px",
  fontWeight: "700" as const,
  margin: "0 0 8px 0",
  lineHeight: "1.2",
  letterSpacing: "-0.5px",
};

const greeting = {
  fontSize: "18px",
  color: "#d1d5db",
  fontWeight: "400" as const,
  margin: "0 0 28px 0",
  lineHeight: "1.4",
};

const paragraph = {
  color: "#9ca3af",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 18px 0",
};

const hr = {
  borderColor: "#1f1f1f",
  borderWidth: "1px",
  margin: "32px 0",
};

const ctaSection = {
  textAlign: "left" as const,
  margin: "28px 0",
};

const button = {
  color: "#ffffff",
  fontSize: "15px",
  textDecoration: "none",
  fontWeight: "500" as const,
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "rgba(107, 114, 128, 0.1)",
  border: "1px solid rgba(107, 114, 128, 0.2)",
  borderRadius: "6px",
  transition: "all 0.2s ease",
};

const signatureSection = {
  marginTop: "32px",
};

const regards = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: "0 0 12px 0",
  fontWeight: "400" as const,
};

const signatureName = {
  color: "#f9fafb",
  fontSize: "17px",
  fontWeight: "600" as const,
  margin: "0 0 6px 0",
  letterSpacing: "-0.2px",
};

const signatureRole = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 8px 0",
  lineHeight: "1.5",
};

const locationSection = {
  marginTop: "12px",
};

const locationText = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0",
  display: "flex",
  alignItems: "center",
};

const locationDot = {
  color: "#6b7280",
  fontSize: "8px",
  marginRight: "8px",
  display: "inline-block",
};

const footer = {
  backgroundColor: "#0a0a0a",
  padding: "32px 40px",
  borderTop: "1px solid #1f1f1f",
};

const footerText = {
  color: "#4b5563",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
};

const linksRow = {
  margin: "0 0 16px 0",
};

const footerLink = {
  color: "#6b7280",
  textDecoration: "none",
  fontSize: "12px",
  padding: "0 8px",
  fontWeight: "500" as const,
  transition: "color 0.2s ease",
};

const linkSeparator = {
  color: "#374151",
  fontSize: "12px",
  margin: "0 4px",
  display: "inline",
};

const footerCopyright = {
  color: "#4b5563",
  fontSize: "11px",
  margin: "0",
  textAlign: "center" as const,
  letterSpacing: "0.3px",
};
