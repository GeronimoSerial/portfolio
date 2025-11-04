"use client";

import { useTranslations } from "next-intl";

import { useSkillsAnimations } from "@/hooks/useSkillsAnimations";
import { skillsData } from "@/lib/skills-data";
import Image from "next/image";
import { useState } from "react";

export default function Skills() {
  const t = useTranslations("skills");
  const { containerRef } = useSkillsAnimations();
  const [activeTab, setActiveTab] = useState(skillsData[0].key);

  const activeCategory = skillsData.find((cat) => cat.key === activeTab);

  return (
    <section ref={containerRef} id="skills" className="relative py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="skills-header text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display text-zinc-950 dark:text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Tabs Layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Tabs - Horizontal en mobile, Vertical en desktop */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible md:w-48 flex-shrink-0">
            {skillsData.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveTab(category.key)}
                className={`
                  tab-button px-4 py-3 rounded-lg text-left
                  transition-all duration-300
                  whitespace-nowrap md:whitespace-normal
                  ${
                    activeTab === category.key
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  }
                `}
              >
                {t(`categories.${category.key}.title`)}
              </button>
            ))}
          </div>

          {/* Skills Content */}
          <div className="flex-1">
            <div className="skills-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {activeCategory?.skills.map((skill, index) => (
                <div
                  key={`${skill.svglId}-${index}`}
                  className="skill-card group relative p-4
                            bg-gradient-to-b from-zinc-50/30 to-zinc-100/30 
                            dark:from-zinc-900/50 dark:to-zinc-800/30
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-lg
                            hover:border-zinc-300 dark:hover:border-zinc-700
                            transition-all duration-300
                            shadow-md shadow-zinc-200/50 dark:shadow-zinc-900/50"
                >
                  {/* Icon Container */}
                  <div className="skill-icon-container flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 md:w-16 md:h-16 relative
                                  flex items-center justify-center
                                  group-hover:scale-110 transition-transform duration-300"
                    >
                      <Image
                        src={`https://svgl.app/library/${skill.svglId}.svg`}
                        alt={skill.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>

                    {/* Skill Name */}
                    <span className="skill-name text-xs md:text-sm font-medium text-zinc-800 dark:text-zinc-200 text-center">
                      {skill.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
