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

interface EmailTemplateProps {
  firstName: string;
  email: string;
  company?: string;
  message: string;
}

export function EmailTemplate({
  firstName,
  email,
  company,
  message,
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fafafa" }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
        >
          <Heading
            style={{ color: "#18181b", fontSize: "24px", marginBottom: "20px" }}
          >
            📬 Nuevo mensaje de contacto
          </Heading>

          <Hr style={{ borderColor: "#e4e4e7", margin: "20px 0" }} />

          <Section style={{ marginBottom: "20px" }}>
            <Text
              style={{ color: "#52525b", fontSize: "14px", margin: "8px 0" }}
            >
              <strong>Nombre:</strong> {firstName}
            </Text>
            <Text
              style={{ color: "#52525b", fontSize: "14px", margin: "8px 0" }}
            >
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${email}`}>{email}</Link>
            </Text>
            {company && (
              <Text
                style={{ color: "#52525b", fontSize: "14px", margin: "8px 0" }}
              >
                <strong>Empresa:</strong> {company}
              </Text>
            )}
          </Section>

          <Hr style={{ borderColor: "#e4e4e7", margin: "20px 0" }} />

          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
            }}
          >
            <Text
              style={{
                color: "#18181b",
                fontSize: "16px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>

          <Text
            style={{
              color: "#a1a1aa",
              fontSize: "12px",
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            Este email fue enviado desde el formulario de contacto de
            geroserial.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
