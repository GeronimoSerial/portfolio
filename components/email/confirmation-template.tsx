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
  Tailwind,
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
      preview: "Mensaje recibido: Revisando tu solicitud",
      greeting: `Hola ${firstName}`,
      title: "Gracias por contactarme",
      message1: "Recibí tu mensaje y lo voy a revisar cuidadosamente.",
      message2:
        "Te respondo a la brevedad posible, generalmente dentro de las próximas 24 horas.",
      message3:
        "Si tu consulta es urgente y requiere atención inmediata, por favor, enviame un correo directamente acá:",
      cta: "contacto@geroserial.com",

      regards: "Saludos",
      signature: "Geronimo Serial",
      role: "Especialista en IT · Infraestructura, Automatización y Gestión de Sistemas",
      location: "Corrientes, Argentina",
    },
    en: {
      preview: "Contact Confirmation",
      greeting: `Hi ${firstName}`,
      title: "Thanks for reaching out",
      message1: "I've received your message and I'm reviewing it carefully.",
      message2:
        "I'll get back to you as soon as possible, usually within the next 24 hours.",
      message3: "If you need to contact me urgently, email me directly at:",
      cta: "contacto@geroserial.com",
      regards: "Best regards",
      signature: "Geronimo Serial",
      role: "IT Specialist · Infrastructure, Automation & Systems Management",
      location: "Corrientes, Argentina",
    },
  };

  const t = content[locale as keyof typeof content] || content.es;

  const locationDotStyle = {
    color: "#6b7280",
    fontSize: "8px",
    marginRight: "8px",
    paddingTop: "1px",
    lineHeight: "0",
  };

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>{t.preview}</Preview>
        <Body
          className="bg-zinc-100 dark:bg-zinc-800 text-gray-400 p-3 font-sans antialiased"
          style={{
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {/* Corrección 2: Eliminamos overflow-hidden del Tailwind en Container */}
          <Container className="max-w-xl mx-auto bg-[#111111] rounded-xl border border-[#1a1a1a]">
            {/* Header minimalista */}
            <Section className="px-8 pt-6 pb-0">
              <Text className="m-0 text-gray-200 text-sm font-medium tracking-wider text-center">
                geroserial.com
              </Text>
            </Section>

            {/* Contenido principal */}
            <Section className="p-8 pt-4">
              <Heading className="text-gray-50 text-3xl font-bold m-0 mb-2 leading-tight tracking-tighter">
                {t.title}
              </Heading>
              <Text className="text-gray-300 text-lg font-normal m-0 mb-7 leading-snug">
                {t.greeting}
              </Text>

              <Text className="text-gray-400 text-base leading-relaxed m-0 mb-4">
                {t.message1}
              </Text>
              <Text className="text-gray-400 text-base leading-relaxed m-0 mb-4">
                {t.message2}
              </Text>

              {/* Separator sutil */}
              <Hr className="border-t border-[#1f1f1f] my-6" />

              <Text className="text-gray-400 text-base leading-relaxed m-0 mb-4">
                {t.message3}
              </Text>

              {/* CTA con estilo "glass" */}
              <Section className="text-left my-5">
                <Link
                  href="mailto:contacto@geroserial.com"
                  className="bg-gray-700 text-white px-4 py-2 rounded-md inline-block"
                >
                  {t.cta}
                </Link>
              </Section>
              {/* Separator */}
              <Hr className="border-t border-[#1f1f1f] my-6" />

              {/* Firma elegante */}
              <Section className="mt-6">
                <Text className="text-gray-400 text-sm m-0 mb-3 font-normal">
                  {t.regards},
                </Text>
                <Text className="text-gray-50 text-lg font-semibold m-0 mb-1 tracking-tighter">
                  {t.signature}
                </Text>
                <Text className="text-gray-500 text-sm m-0 mb-2 leading-snug">
                  {t.role}
                </Text>

                {/* Corrección 1: Reemplazamos display:flex/align-items por Row/Column */}
                <Row className="mt-3">
                  <Column className="w-auto">
                    <Text style={locationDotStyle}>●</Text>
                  </Column>
                  <Column>
                    <Text className="text-gray-500 text-sm m-0 leading-none">
                      {t.location}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export default ConfirmationTemplate;
