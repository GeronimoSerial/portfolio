'use client'

import { User, Briefcase, GraduationCap, Code, Award } from 'lucide-react'
import React from 'react'
import { type LucideIcon } from 'lucide-react'
import { Card } from '../components/card';
import { Navigation } from '../components/nav';

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
      <div className="bg-gradient-to-tl from-indigo-900 via-indigo-400/10 text-white mt-10 shadow-lg rounded-lg overflow-hidden">
        {/* <Navigation/> */}
      <div className="container flex w-full justify-center min-h-screen "> 
        <Card>
          <div className="flex justify-center mt-4 ">
            <img
              src="/geroserial.png" 
              alt="Geronimo Serial"
              className="w-32 h-32 rounded-full shadow-md"
            />
          </div>
        <h1 className="text-5xl font-bold mt-6 mb-3 px-3 ">Geronimo Serial</h1>
        <p className="text-lg mb-8 px-4">Desarrollador Web Full Stack</p>

        <Section icon={User} title="Perfil">
          <p className="text-gray-300">
            Desarrollador web apasionado con 5 años de experiencia en la creación de aplicaciones web
            escalables y eficientes. Especializado en React, Node.js y bases de datos SQL/NoSQL.
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
          <div className="flex flex-wrap gap-4">
            {['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'AWS'].map((skill) => (
                <span key={skill} className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded shadow">
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section icon={Award} title="Certificaciones">
          <ul className="list-disc list-inside">
            <li className="text-gray-300">AWS Certified Developer - Associate</li>
            <li className="text-gray-300">MongoDB Certified Developer</li>
          </ul>
        </Section>
    </Card>        
            </div>
      </div>
    
  )
}

function Section({ icon: Icon, title, children }: SectionProps) {
    return (
        <div className="mb-8 p-4    ">
      <h2 className="text-2xl font-semibold text-gray-200 flex items-center gap-2 mb-3">
        <Icon className="h-6 w-6 text-blue-400" />
        {title}
      </h2>
      <div className="ml-8">{children}</div>
    </div>
  )
}

function JobItem({ title, company, period, description }: JobItemProps) {
  return (
    <div className="mb-4 p-4">
      <h3 className="font-medium text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400">{company} | {period}</p>
      <p className="text-gray-300 mt-1">{description}</p>
    </div>
  )
}

function EducationItem({ degree, institution, year }: EducationItemProps) {
  return (
    <div className="mb-4 p-4">
      <h3 className="font-medium text-gray-200">{degree}</h3>
      <p className="text-sm text-gray-400">{institution} | {year}</p>
    </div>
  )
}