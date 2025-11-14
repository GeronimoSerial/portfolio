"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, TrendingUp } from "lucide-react";

interface ImpactCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function ImpactCard({ icon, title, children }: ImpactCardProps) {
  return (
    <Card className="bg-white dark:bg-white/5 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3 text-zinc-900 dark:text-zinc-50">
          {icon}
        </div>
        <CardTitle className="text-lg text-zinc-900 dark:text-zinc-50">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {children}
        </p>
      </CardContent>
    </Card>
  );
}

export function ImpactGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ImpactCard
        icon={<Zap className="w-6 h-6" />}
        title="Reducción de Carga Operativa"
      >
        La automatización de consultas frecuentes liberó{" "}
        <strong>40% del tiempo</strong> del equipo administrativo para tareas
        estratégicas
      </ImpactCard>
      <ImpactCard
        icon={<Target className="w-6 h-6" />}
        title="Acceso Equitativo"
      >
        Disponibilidad <strong>24/7</strong> para más de 1,200 escuelas en toda
        la provincia de Corrientes
      </ImpactCard>
      <ImpactCard
        icon={<TrendingUp className="w-6 h-6" />}
        title="Transparencia Institucional"
      >
        Portal consolidado como <strong>fuente única oficial</strong> de
        información educativa provincial
      </ImpactCard>
    </div>
  );
}
