import { TrendingUp, Users, FileText, Truck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from "react";

// Animated counter hook
function useCounter(target: number, duration: number = 2000, start: boolean = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame: number;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);
  return value;
}

// Mini sparkline SVG with draw animation
const Sparkline = ({ data, color, animate }: { data: number[]; color: string; animate: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  // Calculate path length for draw animation
  const pathRef = useRef<SVGPolylineElement>(null);
  const [pathLength, setPathLength] = useState(200);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: animate ? 0 : pathLength,
          transition: "stroke-dashoffset 1.5s ease-out",
        }}
      />
    </svg>
  );
};

const DashboardMockup = () => {
  const { i18n } = useTranslation();
  const en = i18n.language === 'en';
  const [visible, setVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const revenue = useCounter(284500, 2200, visible);
  const clients = useCounter(47, 1800, visible);
  const invoices = useCounter(1283, 2000, visible);
  const trips = useCounter(156, 1600, visible);

  const barValues = [35, 42, 38, 55, 48, 62, 58, 72, 68, 78, 74, 84];
  const months = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  const kpis = [
    {
      label: en ? "Revenue" : "Facturación",
      value: `$${revenue.toLocaleString()}`,
      change: "+12.4%",
      up: true,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      spark: [30, 45, 38, 52, 48, 61, 55, 72, 68, 84],
      sparkColor: "#10b981",
    },
    {
      label: en ? "Active clients" : "Clientes activos",
      value: clients.toString(),
      change: "+3",
      up: true,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      spark: [20, 22, 25, 24, 28, 31, 33, 36, 40, 47],
      sparkColor: "#3b82f6",
    },
    {
      label: en ? "Invoices issued" : "Facturas emitidas",
      value: invoices.toLocaleString(),
      change: "+8.1%",
      up: true,
      icon: FileText,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      spark: [60, 58, 65, 70, 68, 75, 82, 79, 88, 95],
      sparkColor: "#8b5cf6",
    },
    {
      label: en ? "Trips completed" : "Viajes completados",
      value: trips.toString(),
      change: "-2.3%",
      up: false,
      icon: Truck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      spark: [40, 45, 42, 38, 44, 41, 39, 36, 38, 35],
      sparkColor: "#f59e0b",
    },
  ];

  const rows = en
    ? [
        { name: "FacturaInteligente", status: "Active", metric: "342 inv/mo", health: 95 },
        { name: "HCH Cargo", status: "Active", metric: "48 trips/mo", health: 87 },
        { name: "Recruiting Agency", status: "Active", metric: "89 CVs/wk", health: 92 },
        { name: "MyMate Hub", status: "Active", metric: "12 clients", health: 78 },
      ]
    : [
        { name: "FacturaInteligente", status: "Activo", metric: "342 fact/mes", health: 95 },
        { name: "HCH Cargo", status: "Activo", metric: "48 viajes/mes", health: 87 },
        { name: "Agencia Recruiting", status: "Activo", metric: "89 CVs/sem", health: 92 },
        { name: "MyMate Hub", status: "Activo", metric: "12 clientes", health: 78 },
      ];

  return (
    <div
      className={`w-full max-w-5xl mx-auto transition-all duration-1000 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Dashboard window frame */}
      <div className="rounded-2xl border border-brand-blue/15 bg-white/80 backdrop-blur-sm shadow-2xl shadow-brand-navy/10 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70 hover:bg-red-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400/70 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/70 hover:bg-green-500 transition-colors cursor-pointer"></div>
          </div>
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-muted/50 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              dashboard.daleautomations.com
            </div>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Dashboard content */}
        <div className="p-4 md:p-6 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((kpi, i) => (
              <div
                key={i}
                className="tilt-card rounded-xl border border-border/40 bg-white p-3 space-y-2 hover:border-brand-blue/30 hover:shadow-md transition-all duration-300 cursor-default"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{kpi.label}</span>
                  <div className={`p-1 ${kpi.bg} rounded-md`}>
                    <kpi.icon className={`h-3 w-3 ${kpi.color}`} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold text-brand-navy tabular-nums">{kpi.value}</span>
                  <Sparkline data={kpi.spark} color={kpi.sparkColor} animate={visible} />
                </div>
                <div className="flex items-center gap-1">
                  {kpi.up ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-400" />
                  )}
                  <span className={`text-[11px] font-medium ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                    {kpi.change}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{en ? "vs last month" : "vs mes anterior"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row: chart + table */}
          <div className="grid md:grid-cols-5 gap-3">
            {/* Chart area */}
            <div className="md:col-span-3 rounded-xl border border-border/40 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-navy">{en ? "Monthly revenue" : "Facturación mensual"}</span>
                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted/50">{en ? "Last 12 months" : "Últimos 12 meses"}</span>
              </div>
              {/* Interactive bar chart */}
              <div className="flex items-end gap-1 h-20 relative">
                {barValues.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 relative group"
                    style={{ height: "100%" }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div
                      className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-700 ${
                        hoveredBar === i
                          ? "bg-gradient-to-t from-brand-navy to-brand-blue"
                          : "bg-gradient-to-t from-brand-navy/80 to-brand-blue/60"
                      }`}
                      style={{
                        height: visible ? `${h}%` : "0%",
                        transitionDelay: `${i * 60}ms`,
                        transform: hoveredBar === i ? "scaleY(1.08)" : "scaleY(1)",
                        transformOrigin: "bottom",
                      }}
                    />
                    {/* Tooltip */}
                    {hoveredBar === i && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-brand-navy text-white text-[9px] font-medium whitespace-nowrap z-10">
                        ${Math.round(h * 3.4)}k
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {months.map((m, i) => (
                  <span
                    key={i}
                    className={`text-[9px] flex-1 text-center transition-colors duration-200 ${
                      hoveredBar === i ? "text-brand-navy font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini table with health bars */}
            <div className="md:col-span-2 rounded-xl border border-border/40 bg-white p-4">
              <span className="text-xs font-semibold text-brand-navy block mb-3">{en ? "Active systems" : "Sistemas activos"}</span>
              <div className="space-y-2">
                {rows.map((row, i) => (
                  <div
                    key={i}
                    className="py-1.5 border-b border-border/30 last:border-0 hover:bg-muted/30 rounded-md px-1 -mx-1 transition-colors duration-200 cursor-default"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-xs text-foreground font-medium">{row.name}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{row.metric}</span>
                    </div>
                    {/* Health bar */}
                    <div className="mt-1 h-1 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-blue/60 to-emerald-500/60 transition-all duration-1000"
                        style={{
                          width: visible ? `${row.health}%` : "0%",
                          transitionDelay: `${800 + i * 200}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
