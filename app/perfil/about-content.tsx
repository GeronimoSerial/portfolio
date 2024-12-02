"use client";

import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  MapPin,
  Globe
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
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="text-center mb-12">
            <img
              src="/memoji.png"
              alt="Geronimo Serial"
              className="w-30 h-32  mx-auto mb-4"
            />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Geronimo Serial</h1>
            <p className="text-xl text-indigo-200 mb-4">
              Especialista en TI y Desarrollo de Software
            </p>
            <div className="flex items-center justify-center text-indigo-200">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Corrientes, Argentina</span>
            </div>
          </div>

          <Section icon={User} title="Perfil">
            <p className="text-gray-200 leading-relaxed">
              Soy desarrollador web y técnico en sistemas con un enfoque
              integral en tecnologías frontend y backend, programación,
              hardware, redes y soluciones en la nube. Me destaco por mis
              habilidades técnicas avanzadas, diagnóstico preciso y mi capacidad
              para trabajar en entornos bilingües.
            </p>
          </Section>

          <Section icon={Briefcase} title="Experiencia Laboral">
            <JobItem
              title="Help Desk"
              company="CGE Corrientes"
              period="2022 - Presente"
              description="Formé parte del equipo de Centro de Computos en CGE Corrientes, brindando soporte tecnológico y gestionando proyectos audiovisuales en RRSS."
            />
          </Section>

          <Section icon={GraduationCap} title="Educación">
            <EducationItem
              degree="Licenciatura en Sistemas de Información"
              institution="Universidad Nacional del Nordeste"
              year="2022"
            />
          </Section>

          <Section icon={Code} title="Habilidades">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "JavaScript",
                "Typescript",
                "React",
                "Angular",
                "NextJS",
                "C#",
                ".NET",
                "MySQL",
                "Git",
                "Redes Sociales",
                "Gestión Digital",
                "Asesoramiento Tecnico",

              ].map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md transition-all hover:bg-indigo-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>

          <Section icon={Award} title="Certificaciones">
            <ul className="space-y-4">
              <li className="text-gray-200">
                <span className="font-semibold text-indigo-300">
                  Formación y Entrenamiento Talentos Digitales:
                </span>{" "}
                Programación FullStack - Telco, UNNE, PoloIT, Gobierno de
                Corrientes
                <div className="mt-2">
                  <a
                    href="https://bit.ly/4cN8wvb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    https://bit.ly/4cN8wvb
                  </a>
                  <span className="ml-2 text-gray-300">
                    (Código de validación: <strong>hvlPFq423l</strong>)
                  </span>
                </div>
              </li>

              <li className="text-gray-200">
                <span className="font-semibold text-indigo-300">Certificación: </span> 
                JavaScript, Algoritmo y Estructura de Datos - freecodecamp.org
              </li>
            </ul>
          </Section>

          <Section icon={Globe} title="Idiomas">
            <p className="text-gray-200">
              Inglés: Nivel intermedio-alto, con capacidad para comprender y
              redactar documentación técnica, interactuar en entornos bilingües
              y participar en comunicaciones internacionales.
            </p>
          </Section>

          <Section icon={Code} title="Conocimientos Técnicos Adicionales">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200">
              <li>Frontend: HTML5, CSS3, Bootstrap 5, Tailwind CSS, Angular</li>
              <li>Backend: C#, ASP.NET 8, PHP, MySQL, API Rest</li>
              <li>ORM: Entity Framework (C#)</li>
              <li>Lenguajes: C, C#, JAVA, JavaScript, TypeScript, Common Lisp, Assembler</li>
              <li>Bases de Datos: MySQL, Microsoft SQL Server, Redis, Upstash</li>
              <li>Sistemas Operativos: Windows, Linux, MacOS, VirtualBox</li>
              <li>Herramientas de Oficina: Microsoft Office, Google Workspace</li>
              <li>Redes y Seguridad: TCP/IP, HTTP/HTTPS, FTP/SFTP, DNS, routers, switches, firewalls, LAN/WAN, VPNs, Wi-Fi</li>
              <li>Servicios en la Nube: AWS, Azure, Google Cloud</li>
              <li>Virtualización: Hyper-V, servidores Windows/Linux</li>
              <li>Marketing Digital: Redes sociales, creación y edición de contenido visual</li>
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
