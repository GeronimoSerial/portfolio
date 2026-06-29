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
        title="Operational Load Reduction"
      >
        Automating frequent inquiries freed up{" "}
        <strong>40% of the time</strong> of the administrative team for
        strategic tasks
      </ImpactCard>
      <ImpactCard
        icon={<Target className="w-6 h-6" />}
        title="Equitable Access"
      >
        <strong>24/7</strong> availability for more than 1,200 schools across
        the province of Corrientes
      </ImpactCard>
      <ImpactCard
        icon={<TrendingUp className="w-6 h-6" />}
        title="Institutional Transparency"
      >
        Consolidated portal as the <strong>single official source</strong> of
        provincial education information
      </ImpactCard>
    </div>
  );
}
