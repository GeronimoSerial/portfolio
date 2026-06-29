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
}

export function ConfirmationTemplate({ firstName }: ConfirmationTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Contact confirmation</Preview>
				<Body
					className="bg-zinc-100 dark:bg-zinc-800 text-gray-400 p-3 font-sans antialiased"
					style={{
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
					}}
				>
					<Container className="max-w-xl mx-auto bg-[#111111] rounded-xl border border-[#1a1a1a]">
						<Section className="px-8 pt-6 pb-0">
							<Text className="m-0 text-gray-200 text-sm font-medium tracking-wider text-center">
								geroserial.com
							</Text>
						</Section>

						<Section className="p-8 pt-4">
							<Heading className="text-gray-50 text-3xl font-bold m-0 mb-2 leading-tight tracking-tighter">
								Thanks for reaching out
							</Heading>
							<Text className="text-gray-300 text-lg font-normal m-0 mb-7 leading-snug">
								Hi {firstName}
							</Text>

							<Text className="text-gray-400 text-base leading-relaxed m-0 mb-4">
								I&apos;ve received your message and I&apos;m reviewing it
								carefully.
							</Text>
							<Text className="text-gray-400 text-base leading-relaxed m-0 mb-4">
								I&apos;ll get back to you as soon as possible, usually within the
								next 24 hours.
							</Text>

							<Hr className="border-t border-[#1f1f1f] my-6" />

							<Text className="text-gray-400 text-base leading-relaxed m-0 mb-4">
								If you need to contact me urgently, email me directly at:
							</Text>

							<Section className="text-left my-5">
								<Link
									href="mailto:contact@geroserial.com"
									className="bg-gray-700 text-white px-4 py-2 rounded-md inline-block"
								>
									contact@geroserial.com
								</Link>
							</Section>

							<Hr className="border-t border-[#1f1f1f] my-6" />

							<Section className="mt-6">
								<Text className="text-gray-400 text-sm m-0 mb-3 font-normal">
									Best regards,
								</Text>
								<Text className="text-gray-50 text-lg font-semibold m-0 mb-1 tracking-tighter">
									Geronimo Serial
								</Text>
								<Text className="text-gray-500 text-sm m-0 mb-2 leading-snug">
									IT Specialist · Infrastructure, Automation & Systems Management
								</Text>

								<Row className="mt-3">
									<Column className="w-auto">
										<Text
											style={{
												color: "#6b7280",
												fontSize: "8px",
												marginRight: "8px",
												paddingTop: "1px",
												lineHeight: "0",
											}}
										>
											●
										</Text>
									</Column>
									<Column>
										<Text className="text-gray-500 text-sm m-0 leading-none">
											Corrientes, Argentina
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
