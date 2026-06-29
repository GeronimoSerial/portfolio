import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "CV ATS | Geronimo Serial",
	description:
		"ATS-friendly Curriculum Vitae for Geronimo Serial. Software Engineer profile with experience in full stack development, systems analysis, and solutions architecture.",
	alternates: {
		canonical: "/cv",
	},
};

export default function CvPage() {
	return (
		<main className="min-h-screen bg-white px-4 py-8 text-zinc-900 print:bg-white print:px-0 print:py-0 print:text-zinc-900">
			<article className="cv-ats mx-auto w-full max-w-4xl border border-zinc-200 bg-white px-6 py-8 shadow-sm print:max-w-none print:border-none print:bg-white print:px-8 print:py-6 print:shadow-none">
				<header className="border-b border-zinc-200 pb-5 print:border-zinc-300">
					<h1 className="text-3xl font-semibold tracking-tight text-zinc-900 print:text-zinc-900">
						Geronimo Serial
					</h1>
					<p className="mt-2 text-base font-medium text-zinc-700 print:text-zinc-700">
						Software Engineer | Systems Analyst | Solutions Architect
					</p>
					<address className="mt-4 not-italic text-sm leading-6 text-zinc-700 print:text-zinc-800">
						<p>Corrientes, Argentina</p>
						<p>
							Email:{" "}
							<a href="mailto:contact@geroserial.com">
								contact@geroserial.com
							</a>
						</p>
						<p>
							Portfolio: <a href="https://geroserial.com">https://geroserial.com</a>
						</p>
						<p>
							GitHub:{" "}
							<a href="https://github.com/geronimoserial">
								https://github.com/geronimoserial
							</a>
						</p>
					</address>
				</header>

				<section className="mt-6">
					<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
						Professional profile
					</h2>
					<p className="mt-3 text-sm leading-7 text-zinc-800 print:text-zinc-900">
						Software Engineer and Systems Analyst with over 4 years of experience
						in full stack development, systems analysis, process automation,
						solutions architecture, and data analysis. Experience designing and
						implementing web platforms, digitizing administrative processes,
						defining business rules, and producing technical reports to support
						decision-making. Primary stack: React, Next.js, Node.js, TypeScript,
						JavaScript, PostgreSQL, SQL Server, SQLite, Linux, and Nginx.
						Profile focused on software engineering, system design, process
						optimization, business analysis, and delivering solutions with
						measurable operational impact.
					</p>
				</section>

				<section className="mt-6">
					<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
						Core competencies
					</h2>
					<ul className="mt-3 grid gap-2 text-sm text-zinc-800 print:text-zinc-900 md:grid-cols-2">
						<li className="leading-6">Software Engineering</li>
						<li className="leading-6">Full Stack Development</li>
						<li className="leading-6">Systems Analysis</li>
						<li className="leading-6">Solutions Architecture</li>
						<li className="leading-6">Business Rules Definition</li>
						<li className="leading-6">Process Optimization</li>
						<li className="leading-6">Workflow Automation</li>
						<li className="leading-6">Data Analysis</li>
						<li className="leading-6">Technical Reporting</li>
						<li className="leading-6">Decision Support Systems</li>
						<li className="leading-6">Database Design</li>
						<li className="leading-6">API Integration</li>
						<li className="leading-6">Requirements Analysis</li>
						<li className="leading-6">Stakeholder Communication</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
						Technical stack
					</h2>
					<div className="mt-3 space-y-3">
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Languages:
							</span>{" "}
							JavaScript, TypeScript, SQL
						</p>
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Frontend:
							</span>{" "}
							React, Next.js
						</p>
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Backend:
							</span>{" "}
							Node.js, ASP.NET
						</p>
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Databases:
							</span>{" "}
							PostgreSQL, SQL Server, SQLite
						</p>
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Infrastructure:
							</span>{" "}
							Linux, Nginx, VPS, TLS/SSL, Firewalls, Web security, Caching
						</p>
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Data and automation:
							</span>{" "}
							Power Query, Data validation, Workflow automation, Technical
							reporting
						</p>
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Tools:
							</span>{" "}
							Git, GitHub, Redis, Strapi, Google Workspace, Microsoft Office
						</p>
						<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<span className="font-semibold text-zinc-900 print:text-zinc-900">
								Methodologies:
							</span>{" "}
							Functional analysis, Solution design, Institutional digitization,
							Process improvement, Technical documentation
						</p>
					</div>
				</section>

				<section className="mt-6">
					<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
						Professional experience
					</h2>
					<div className="mt-4 space-y-6">
						<article className="space-y-2">
							<h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
								ICVM Hawk
							</h3>
							<p className="text-sm font-medium text-zinc-700 print:text-zinc-800">
								Full Stack Developer
							</p>
							<p className="text-xs uppercase tracking-[0.14em] text-zinc-600 print:text-zinc-600">
								Jun 2026 - Present
							</p>
							<ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
								<li>
									Developed and maintained web applications, ensuring seamless
									functionality across both frontend and backend.
								</li>
								<li>
									Provided DevOps support, optimizing staging and production
									workflows for efficient deployment processes.
								</li>
								<li>
									Implemented SEO improvements to enhance website visibility and
									user engagement.
								</li>
								<li>
									Collaborated with cross-functional teams at ICVM Hawk, a dynamic
									digital agency in Miami, Florida, to deliver innovative
									solutions.
								</li>
							</ul>
						</article>

						<article className="space-y-2">
							<h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
								General Council of Education (CGE) - Ministry of Education
							</h3>
							<p className="text-sm font-medium text-zinc-700 print:text-zinc-800">
								Software Engineer | Systems Analyst | Solutions Architecture
							</p>
							<p className="text-xs uppercase tracking-[0.14em] text-zinc-600 print:text-zinc-600">
								2021 - Jun 2026
							</p>
							<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
								<span className="font-semibold text-zinc-900 print:text-zinc-900">
									Technologies:
								</span>{" "}
								React, Next.js, Node.js, JavaScript, TypeScript, PostgreSQL, SQL,
								Power Query, Linux, Nginx, Git, GitHub, CI/CD
							</p>
							<ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
								<li>
									Designed and implemented a digitization system for educational
									forms across 1,300 schools and 15,600 annual documents,
									eliminating paper-based administrative processes and generating
									estimated savings between ARS 74M and ARS 106M per year.
								</li>
								<li>
									Developed an institutional web platform from scratch with
									capacity to serve up to 25,000 monthly users.
								</li>
								<li>
									Defined functional architecture and business rules for an
									inter-ministerial Family Salary system.
								</li>
								<li>
									Conducted data analysis and operational modeling across 1,060
									schools to optimize cleaning staff distribution, covering 20.8%
									of the staffing gap through internal redistribution.
								</li>
								<li>
									Prepared technical reports and analyses for operational
									scenarios, resource optimization, and management decision
									support.
								</li>
								<li>
									Participated in institutional modernization initiatives combining
									software, data, and automation to improve traceability,
									efficiency, and scalability.
								</li>
							</ul>
						</article>

						<article className="space-y-2">
							<h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
								Freelance Software Engineer | Founder / Builder - Independent
								Projects
							</h3>
							<p className="text-sm font-medium text-zinc-700 print:text-zinc-800">
								Full Stack Developer | Web Infrastructure | Automation
							</p>
							<p className="text-xs uppercase tracking-[0.14em] text-zinc-600 print:text-zinc-600">
								2019 - Present
							</p>
							<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
								<span className="font-semibold text-zinc-900 print:text-zinc-900">
									Technologies:
								</span>{" "}
								React, Next.js, Node.js, JavaScript, TypeScript, PostgreSQL, SQL,
								Linux, Nginx, VPS, Git, GitHub, Redis, Strapi
							</p>
							<ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
								<li>
									Developed web solutions for clients and personal projects,
									integrating full stack development, automation, system design,
									and infrastructure.
								</li>
								<li>
									Acted as Founder / Builder of digital products, defining
									product, business logic, technical architecture, and deployment.
								</li>
								<li>
									Built citado.app, a platform for managing reservations,
									scheduling, and player rankings at padel clubs and courts.
								</li>
								<li>
									Developed CLEO Resolv Streetwear, an e-commerce project focused
									on branding, commercial experience, and conversion.
								</li>
								<li>
									Implemented commercial websites and custom infrastructure on
									hosting, domains, and VPS.
								</li>
								<li>
									Automated operational tasks and workflows to reduce manual work
									and improve efficiency.
								</li>
							</ul>
						</article>
					</div>
				</section>

				<section className="mt-6">
					<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
						Relevant projects
					</h2>
					<div className="mt-4 space-y-4">
						<article className="space-y-1">
							<h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
								citado.app
							</h3>
							<p className="text-sm font-medium text-zinc-700 print:text-zinc-800">
								Founder / Builder
							</p>
							<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
								Digital product focused on reservations, scheduling, rankings, and
								operations for padel courts. Emphasis on business logic, UX,
								operational administration, and system scalability.
							</p>
						</article>

						<article className="space-y-1">
							<h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
								CLEO Resolv Streetwear
							</h3>
							<p className="text-sm font-medium text-zinc-700 print:text-zinc-800">
								E-commerce Project
							</p>
							<p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
								E-commerce project focused on brand identity, digital experience,
								web performance, and conversion.
							</p>
						</article>
					</div>
				</section>

				<section className="mt-6 space-y-5">
					<div>
						<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
							Education
						</h2>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<li>
								University Programming Analyst - National University of the
								Northeast (UNNE)
							</li>
							<li>
								Bachelor&apos;s in Information Systems - National University of
								the Northeast (UNNE) - In progress
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
							Additional training
						</h2>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<li>Full Stack Programming - Talentos Digitales</li>
							<li>
								JavaScript, Algorithms and Data Structures - FreeCodeCamp
							</li>
							<li>
								Diploma in AI Applications for Education - UNNE
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
							Languages
						</h2>
						<ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
							<li>English - B1 Level (American British Academy)</li>
						</ul>
					</div>
				</section>

				<p className="mt-8 border-t border-zinc-200 pt-4 text-xs tracking-wide text-zinc-600 print:border-zinc-300 print:text-zinc-700">
					ATS-friendly CV. Last updated: March 2026.
				</p>
			</article>
		</main>
	);
}
