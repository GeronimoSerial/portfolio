"use client";

import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  MapPin,
} from "lucide-react";
import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

interface JobItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface EducationItemProps {
  degree: string;
  institution: string;
  year: string;
}

export default function AboutContent() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-sm text-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col items-center p-8 space-y-6">
          <img
            src="/profile_photo.webp"
            alt="Geronimo Serial"
            className="w-36 h-36 rounded-3xl shadow-md mb-3 justify-center"
          />
          <h1 className="text-4xl font-bold mb-2">Geronimo Serial</h1>
          <p className="text-xl mb-8">Especialista en TI y Desarrollo de Software</p>
          <div className="flex items-center text-white mb-8">
            <MapPin className="w-5 h-5 mr-2 text-indigo-300" />
            <span>Corrientes, Argentina</span>
          </div>

          <Section icon={User} title="Perfil">
            <p className="text-gray-100">
              Soy desarrollador web y técnico en sistemas con un enfoque integral en tecnologías frontend y backend, programación, hardware, redes y soluciones en la nube. Me destaco por mis habilidades técnicas avanzadas, diagnóstico preciso y mi capacidad para trabajar en entornos bilingües.
            </p>
          </Section>

          <Section icon={Briefcase} title="Experiencia Laboral">
            <JobItem
              title="Desarrollador Senior"
              company="TechCorp"
              period="2020 - Presente"
              description="Lideré el desarrollo de aplicaciones web utilizando React y Node.js."
            />
            <JobItem
              title="Desarrollador Full Stack"
              company="WebSolutions"
              period="2018 - 2020"
              description="Trabajé en proyectos full stack utilizando MERN stack."
            />
          </Section>

          <Section icon={GraduationCap} title="Educación">
            <EducationItem
              degree="Ingeniería en Sistemas Computacionales"
              institution="Universidad Tecnológica"
              year="2018"
            />
          </Section>

          <Section icon={Code} title="Habilidades">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "JavaScript",
                "React",
                "Node.js",
                "Express",
                "MongoDB",
                "SQL",
                "Git",
                "AWS",
              ].map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded shadow"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>

          <Section icon={Award} title="Certificaciones">
            <ul className="list-disc list-inside">
              <li className="text-gray-100">AWS Certified Developer - Associate</li>
              <li className="text-gray-100">MongoDB Certified Developer</li>
            </ul>
          </Section>

          <Section icon={Award} title="Idiomas">
            <p className="text-gray-100">Inglés: Nivel intermedio-alto, con capacidad para comprender y redactar documentación técnica, interactuar en entornos bilingües y participar en comunicaciones internacionales.</p>
          </Section>

          <Section icon={Award} title="Conocimientos Técnicos Adicionales">
            <ul className="list-disc list-inside">
              <li className="text-gray-100">Frontend: HTML5, CSS3, Bootstrap 5, Tailwind CSS, Angular</li>
              <li className="text-gray-100">Backend: C#, ASP.NET 8, PHP, MySQL, API Rest</li>
              <li className="text-gray-100">ORM: Entity Framework (C#)</li>
              <li className="text-gray-100">Lenguajes de Programación: C, C#, JAVA, JavaScript, TypeScript, Common Lisp, Assembler</li>
              <li className="text-gray-100">Bases de Datos: MySQL, Microsoft SQL Server, Redis, Upstash</li>
              <li className="text-gray-100">Sistemas Operativos: Windows, Linux, MacOS, VirtualBox</li>
              <li className="text-gray-100">Herramientas de Oficina: Microsoft Office, Google Workspace</li>
              <li className="text-gray-100">Redes y Seguridad: TCP/IP, HTTP/HTTPS, FTP/SFTP, DNS, configuración de routers y switches, firewalls, LAN/WAN, VPNs, Wi-Fi</li>
              <li className="text-gray-100">Servicios en la Nube: AWS, Azure, Google Cloud</li>
              <li className="text-gray-100">Virtualización: Hyper-V, servidores Windows/Linux</li>
              <li className="text-gray-100">Marketing Digital: Redes sociales, creación y edición de contenido visual</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-semibold text-gray-100 flex items-center gap-2 mb-3">
        <Icon className="h-6 w-6 text-indigo-300" />
        {title}
      </h2>
      <div className="ml-8">{children}</div>
    </div>
  );
}

function JobItem({ title, company, period, description }: JobItemProps) {
  return (
    <div className="mb-4">
      <h3 className="font-medium text-gray-100">{title}</h3>
      <p className="text-sm text-gray-200">
        {company} | {period}
      </p>
      <p className="text-gray-100 mt-1">{description}</p>
    </div>
  );
}

function EducationItem({ degree, institution, year }: EducationItemProps) {
  return (
    <div className="mb-4">
      <h3 className="font-medium text-gray-100">{degree}</h3>
      <p className="text-sm text-gray-200">
        {institution} | {year}
      </p>
    </div>
  );
}
