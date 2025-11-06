import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4" }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#ffffff",
          }}
        >
          <Heading style={{ color: "#333333" }}>
            Nuevo mensaje de contacto
          </Heading>
          <Text style={{ color: "#666666", fontSize: "16px" }}>
            Has recibido un nuevo mensaje de: <strong>{firstName}</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
