"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Tremor chart colors optimized for grayscale design system
export const CHART_COLORS = [
  "zinc",
  "slate",
  "gray",
  "neutral",
  "stone",
] as const;

// KPI Card Component
interface KPIProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "increase" | "decrease" | "neutral";
}

export function KPI({ label, value, delta, deltaType = "neutral" }: KPIProps) {
  const deltaColors = {
    increase: "text-emerald-600 dark:text-emerald-500",
    decrease: "text-rose-600 dark:text-rose-500",
    neutral: "text-zinc-500 dark:text-zinc-400",
  };

  return (
    <Card className="bg-white dark:bg-white/5 border-zinc-200 dark:border-zinc-800 backdrop-blur transition-colors duration-300">
      <CardHeader className="pb-2">
        <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs font-medium uppercase tracking-wide transition-colors duration-300">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
          {value}
        </div>
        {delta && (
          <p
            className={`text-sm mt-1 ${deltaColors[deltaType]} transition-colors duration-300`}
          >
            {delta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Chart Card Wrapper Component
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card className="bg-white dark:bg-white/5 border-zinc-200 dark:border-zinc-800 backdrop-blur transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
          {title}
        </CardTitle>
        {subtitle && (
          <CardDescription className="text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
            {subtitle}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-80">{children}</CardContent>
    </Card>
  );
}

// KPI Data
export const kpis: KPIProps[] = [
  {
    label: "Usuarios mensuales",
    value: "28,500+",
    delta: "+42% vs año anterior",
    deltaType: "increase",
  },
  {
    label: "Publicaciones",
    value: "1,200+",
    delta: "Noticias y recursos",
    deltaType: "neutral",
  },
  {
    label: "Trámites digitalizados",
    value: "45",
    delta: "Guías paso a paso",
    deltaType: "neutral",
  },
  {
    label: "Tiempo de respuesta promedio",
    value: "2.8 días",
    delta: "-35% vs proceso manual",
    deltaType: "increase",
  },
];

// Chart Data: Publicaciones por Categoría
export const publicacionesPorCategoria = [
  { name: "Convocatorias", value: 320 },
  { name: "Normativa", value: 280 },
  { name: "Capacitaciones", value: 215 },
  { name: "Comunicados", value: 195 },
  { name: "Eventos", value: 190 },
];

// Chart Data: Trámites Más Consultados
export const tramitesConsultados = [
  { name: "Licencias", consultas: 4200 },
  { name: "Pases", consultas: 3800 },
  { name: "Certificados", consultas: 3200 },
  { name: "Inscripciones", consultas: 2900 },
  { name: "Vacantes", consultas: 2400 },
];

// Chart Data: Crecimiento de Descargas Documentales
export const descargasDocumentos = [
  { mes: "Ene", downloads: 1200 },
  { mes: "Feb", downloads: 1450 },
  { mes: "Mar", downloads: 1650 },
  { mes: "Abr", downloads: 1800 },
  { mes: "May", downloads: 2100 },
  { mes: "Jun", downloads: 2400 },
  { mes: "Jul", downloads: 2650 },
  { mes: "Ago", downloads: 2900 },
  { mes: "Sep", downloads: 3200 },
  { mes: "Oct", downloads: 3500 },
  { mes: "Nov", downloads: 3850 },
  { mes: "Dic", downloads: 4200 },
];

// Chart Data: Escuelas por Departamento (muestra)
export const escuelasPorDepto = [
  { depto: "Capital", escuelas: 145 },
  { depto: "Goya", escuelas: 98 },
  { depto: "Curuzú Cuatiá", escuelas: 87 },
  { depto: "Mercedes", escuelas: 76 },
  { depto: "Paso de los Libres", escuelas: 72 },
  { depto: "Santo Tomé", escuelas: 65 },
  { depto: "Esquina", escuelas: 58 },
  { depto: "Monte Caseros", escuelas: 54 },
];

// Chart Data: Satisfacción del Usuario
export const satisfaccion = [
  { categoria: "Muy satisfecho", porcentaje: 45 },
  { categoria: "Satisfecho", porcentaje: 38 },
  { categoria: "Neutral", porcentaje: 12 },
  { categoria: "Insatisfecho", porcentaje: 5 },
];

// Chart Data: SLA de Respuesta en Contacto
export const slaContacto = [
  { name: "Dentro de SLA (<3 días)", value: 78 },
  { name: "Fuera de SLA (>3 días)", value: 22 },
];

// Chart Data: Chat Normativo - Resolución Autónoma
export const resolucionChat = [
  { categoria: "Resueltas sin intervención", porcentaje: 72 },
  { categoria: "Derivadas a humano", porcentaje: 28 },
];

// Chart Data: Volumen Mensual de Consultas (Chat)
export const consultasChat = [
  { mes: "Ene", consultas: 2400 },
  { mes: "Feb", consultas: 2650 },
  { mes: "Mar", consultas: 3100 },
  { mes: "Abr", consultas: 2900 },
  { mes: "May", consultas: 3200 },
  { mes: "Jun", consultas: 3450 },
  { mes: "Jul", consultas: 3100 },
  { mes: "Ago", consultas: 3300 },
  { mes: "Sep", consultas: 3600 },
  { mes: "Oct", consultas: 3200 },
  { mes: "Nov", consultas: 3400 },
  { mes: "Dic", consultas: 2800 },
];

// Wrapper Components with Data (for MDX usage)
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

// ============================================
// COMPONENTES ESTÉTICOS PERSISTENTES
// ============================================

// Timeline Component
interface TimelineItemProps {
  date: string;
  icon: string;
  children: React.ReactNode;
}

function TimelineItem({ date, icon, children }: TimelineItemProps) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-800 mt-2" />
      </div>
      <div className="pb-8 flex-1">
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
          {date}
        </div>
        <p className="text-zinc-700 dark:text-zinc-300">{children}</p>
      </div>
    </div>
  );
}

export function ProjectTimeline() {
  return (
    <div className="space-y-0">
      <TimelineItem date="Julio 2023" icon="🚀">
        <strong>Lanzamiento del portal unificado</strong> - Consolidación de
        información institucional dispersa en un único punto de acceso oficial
      </TimelineItem>
      <TimelineItem date="Septiembre 2023" icon="🤖">
        <strong>Integración de Chat Normativo</strong> - Sistema automatizado
        para resolver consultas frecuentes sobre normativa educativa
      </TimelineItem>
      <TimelineItem date="Enero 2024" icon="📱">
        <strong>Optimización Mobile First</strong> - Rediseño responsive y
        cumplimiento de estándares WCAG 2.1 AA para accesibilidad
      </TimelineItem>
      <TimelineItem date="Junio 2024" icon="🔗">
        <strong>Integración de Sistemas</strong> - Conexión con bases de datos
        internas del CGE para consultas en tiempo real
      </TimelineItem>
    </div>
  );
}

// Impact Cards Component
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

// Tech Stack Component
interface TechBadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

function TechBadge({ children, variant = "primary" }: TechBadgeProps) {
  const variants = {
    primary: "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900",
    secondary:
      "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-300 ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function TechStackSection() {
  return (
    <div className="flex flex-wrap gap-2">
      <TechBadge>Next.js 15</TechBadge>
      <TechBadge>TypeScript</TechBadge>
      <TechBadge>React 19</TechBadge>
      <TechBadge>Tailwind CSS</TechBadge>
      <TechBadge variant="secondary">shadcn/ui</TechBadge>
      <TechBadge variant="secondary">MDX</TechBadge>
      <TechBadge variant="secondary">Nginx</TechBadge>
      <TechBadge variant="secondary">PM2</TechBadge>
      <TechBadge variant="secondary">Google Analytics 4</TechBadge>
    </div>
  );
}

// Before/After Comparison
export function BeforeAfter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/50">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-500" />
            Antes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-rose-600 dark:text-rose-500">❌</span>
              <span>
                Información dispersa en múltiples canales sin trazabilidad
              </span>
            </li>
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-rose-600 dark:text-rose-500">❌</span>
              <span>
                Consultas telefónicas repetitivas sobrecargando al personal
              </span>
            </li>
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-rose-600 dark:text-rose-500">❌</span>
              <span>Sin métricas de satisfacción ni tiempos de respuesta</span>
            </li>
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-rose-600 dark:text-rose-500">❌</span>
              <span>Acceso limitado a horarios administrativos</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            Después
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-emerald-600 dark:text-emerald-500">✅</span>
              <span>Portal unificado con SSR y contenido centralizado</span>
            </li>
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-emerald-600 dark:text-emerald-500">✅</span>
              <span>
                Chat automatizado 24/7 resolviendo el 72% de consultas
              </span>
            </li>
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-emerald-600 dark:text-emerald-500">✅</span>
              <span>Dashboard analítico con métricas en tiempo real</span>
            </li>
            <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-emerald-600 dark:text-emerald-500">✅</span>
              <span>Disponibilidad permanente desde cualquier dispositivo</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// Metrics Overview Component
interface MetricProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
}

function Metric({ icon, value, label, trend }: MetricProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
        {value}
      </div>
      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        {label}
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{trend}</div>
    </div>
  );
}

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Metric
        icon="👥"
        value="28K+"
        label="Usuarios mensuales activos"
        trend="Crecimiento sostenido desde lanzamiento"
      />
      <Metric
        icon="📄"
        value="1,200+"
        label="Publicaciones y recursos"
        trend="Actualización continua de contenido"
      />
      <Metric
        icon="🏫"
        value="+1,200"
        label="Escuelas conectadas"
        trend="Cobertura provincial completa"
      />
      <Metric
        icon="⚡"
        value="-60%"
        label="Reducción en tiempos"
        trend="vs. proceso manual anterior"
      />
    </div>
  );
}

// Feature Highlights Component
interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          {title}
        </h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FeatureHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Feature
        icon="📰"
        title="Noticias y Comunicados"
        description="Centro oficial de difusión institucional con categorización automática y búsqueda semántica"
      />
      <Feature
        icon="📋"
        title="Trámites Digitalizados"
        description="45+ guías paso a paso que reducen errores y demoras en procedimientos administrativos"
      />
      <Feature
        icon="📚"
        title="Documentos Oficiales"
        description="Repositorio centralizado de normativa, resoluciones e instructivos con versionado"
      />
      <Feature
        icon="🏫"
        title="Base de Escuelas"
        description="Directorio completo de establecimientos educativos por departamento con datos actualizados"
      />
      <Feature
        icon="💬"
        title="Chat Normativo"
        description="Asistente automatizado para consultas frecuentes con precisión del 72% sin intervención humana"
      />
      <Feature
        icon="✉️"
        title="Contacto Institucional"
        description="Sistema de gestión de consultas con SLA de 3 días hábiles y seguimiento completo"
      />
    </div>
  );
}

// ============================================
// COMPONENTES DE CHARTS (MANTENER POR SI ACASO)
// ============================================

// Chart configs for shadcn
const noticiasConfig = {
  convocatorias: { label: "Convocatorias", color: "hsl(240, 10%, 3.9%)" },
  normativa: { label: "Normativa", color: "hsl(240, 5.9%, 10%)" },
  capacitaciones: { label: "Capacitaciones", color: "hsl(240, 5%, 26%)" },
  comunicados: { label: "Comunicados", color: "hsl(240, 4.8%, 45.9%)" },
  eventos: { label: "Eventos", color: "hsl(240, 5%, 64.9%)" },
} satisfies ChartConfig;

const tramitesConfig = {
  licencias: { label: "Licencias", color: "hsl(240, 10%, 3.9%)" },
  pases: { label: "Pases", color: "hsl(240, 5.9%, 10%)" },
  certificados: { label: "Certificados", color: "hsl(240, 5%, 26%)" },
  inscripciones: { label: "Inscripciones", color: "hsl(240, 4.8%, 45.9%)" },
  vacantes: { label: "Vacantes", color: "hsl(240, 5%, 64.9%)" },
} satisfies ChartConfig;

const documentosConfig = {
  downloads: { label: "Descargas", color: "hsl(240, 10%, 3.9%)" },
} satisfies ChartConfig;

const escuelasConfig = {
  capital: { label: "Capital", color: "hsl(240, 10%, 3.9%)" },
  goya: { label: "Goya", color: "hsl(240, 5.9%, 10%)" },
  curuzucuatia: { label: "Curuzú Cuatiá", color: "hsl(240, 5%, 26%)" },
  mercedes: { label: "Mercedes", color: "hsl(240, 4.8%, 45.9%)" },
  pasodelosLibres: {
    label: "Paso de los Libres",
    color: "hsl(240, 5%, 64.9%)",
  },
  santotome: { label: "Santo Tomé", color: "hsl(240, 4%, 73%)" },
  esquina: { label: "Esquina", color: "hsl(240, 3%, 80%)" },
  montecaseros: { label: "Monte Caseros", color: "hsl(240, 2%, 87%)" },
} satisfies ChartConfig;

const chatResolucionConfig = {
  resueltas: {
    label: "Resueltas sin intervención",
    color: "hsl(142, 76%, 36%)",
  },
  derivadas: { label: "Derivadas a humano", color: "hsl(240, 5%, 64.9%)" },
} satisfies ChartConfig;

const consultasConfig = {
  consultas: { label: "Consultas", color: "hsl(240, 10%, 3.9%)" },
} satisfies ChartConfig;

const slaConfig = {
  dentroSLA: { label: "Dentro de SLA", color: "hsl(142, 76%, 36%)" },
  fueraSLA: { label: "Fuera de SLA", color: "hsl(0, 84%, 60%)" },
} satisfies ChartConfig;

const satisfaccionConfig = {
  porcentaje: { label: "Porcentaje", color: "hsl(240, 10%, 3.9%)" },
} satisfies ChartConfig;

export function KPIGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((k) => (
        <KPI key={k.label} {...k} />
      ))}
    </div>
  );
}

export function NoticiasChart() {
  const dataWithKeys = publicacionesPorCategoria.map((item) => ({
    ...item,
    fill: `var(--color-${item.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")})`,
  }));

  return (
    <ChartCard
      title="Distribución de publicaciones por categoría"
      subtitle="Canal oficial de difusión institucional (2023-2025)"
    >
      <ChartContainer config={noticiasConfig} className="h-full w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={dataWithKeys}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function TramitesChart() {
  const dataWithKeys = tramitesConsultados.map((item) => ({
    ...item,
    fill: `var(--color-${item.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")})`,
  }));

  return (
    <ChartCard
      title="Trámites más consultados"
      subtitle="Guías digitalizadas que reducen errores y demoras operativas"
    >
      <ChartContainer config={tramitesConfig} className="h-full w-full">
        <BarChart data={dataWithKeys}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="consultas" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function DocumentosChart() {
  return (
    <ChartCard
      title="Crecimiento de descargas documentales"
      subtitle="Acceso público a normativa vigente, resoluciones e instructivos"
    >
      <ChartContainer config={documentosConfig} className="h-full w-full">
        <AreaChart data={descargasDocumentos}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          <XAxis dataKey="mes" className="text-xs" />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="downloads"
            fill="var(--color-downloads)"
            fillOpacity={0.2}
            stroke="var(--color-downloads)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function EscuelasChart() {
  const dataWithKeys = escuelasPorDepto.map((item) => {
    // Normalizar el nombre del departamento para que coincida con el config
    const keyMap: Record<string, string> = {
      Capital: "capital",
      Goya: "goya",
      "Curuzú Cuatiá": "curuzucuatia",
      Mercedes: "mercedes",
      "Paso de los Libres": "pasodelosLibres",
      "Santo Tomé": "santotome",
      Esquina: "esquina",
      "Monte Caseros": "montecaseros",
    };

    return {
      ...item,
      fill: `var(--color-${keyMap[item.depto] || item.depto})`,
    };
  });

  return (
    <ChartCard
      title="Escuelas registradas por departamento"
      subtitle="Base de datos de establecimientos educativos de Corrientes (muestra)"
    >
      <ChartContainer config={escuelasConfig} className="h-full w-full">
        <BarChart data={dataWithKeys}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          <XAxis
            dataKey="depto"
            className="text-xs"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="escuelas" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function ChatResolucionChart() {
  const dataWithKeys = [
    {
      categoria: "Resueltas sin intervención",
      porcentaje: 72,
      fill: "var(--color-resueltas)",
    },
    {
      categoria: "Derivadas a humano",
      porcentaje: 28,
      fill: "var(--color-derivadas)",
    },
  ];

  return (
    <ChartCard
      title="Resolución autónoma de consultas"
      subtitle="Porcentaje de consultas resueltas sin intervención humana"
    >
      <ChartContainer config={chatResolucionConfig} className="h-full w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={dataWithKeys}
            dataKey="porcentaje"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label={({ porcentaje }) => `${porcentaje}%`}
          />
          <Legend />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function ChatVolumenChart() {
  return (
    <ChartCard
      title="Volumen mensual de consultas (Chat Normativo)"
      subtitle="Evolución de interacciones automatizadas (2024-2025)"
    >
      <ChartContainer config={consultasConfig} className="h-full w-full">
        <LineChart data={consultasChat}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          <XAxis dataKey="mes" className="text-xs" />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="consultas"
            stroke="var(--color-consultas)"
            strokeWidth={2}
            dot={{ fill: "var(--color-consultas)" }}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function ContactoSLAChart() {
  const dataWithKeys = [
    {
      name: "Dentro de SLA (<3 días)",
      value: 78,
      fill: "var(--color-dentroSLA)",
    },
    {
      name: "Fuera de SLA (>3 días)",
      value: 22,
      fill: "var(--color-fueraSLA)",
    },
  ];

  return (
    <ChartCard
      title="SLA de respuesta"
      subtitle="Cumplimiento del tiempo objetivo: 3 días hábiles"
    >
      <ChartContainer config={slaConfig} className="h-full w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={dataWithKeys}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label={({ value }) => `${value}%`}
          />
          <Legend />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function ContactoSatisfaccionChart() {
  return (
    <ChartCard
      title="Satisfacción del usuario"
      subtitle="Encuestas post-contacto (muestra 2024-2025)"
    >
      <ChartContainer config={satisfaccionConfig} className="h-full w-full">
        <BarChart data={satisfaccion}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          <XAxis
            dataKey="categoria"
            className="text-xs"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="porcentaje"
            fill="var(--color-porcentaje)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
