const fs = require('fs');
const file = 'app/doctor/analytics/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace state and fetch logic
code = code.replace(
  /const \[stats, setStats\] = useState<any>\(null\);\s*const \[isLoading, setIsLoading\] = useState\(true\);/,
  `const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);`
);

code = code.replace(
  /const res = await fetch\("\/api\/doctors\/analytics"\);\s*const data = await res\.json\(\);\s*if \(data\.success\) \{\s*setStats\(data\.stats\);\s*\}/,
  `const res = await fetch("/api/doctors/analytics");
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          setError(data.message || "Failed to load analytics");
        }`
);

code = code.replace(
  /console\.error\("Failed to fetch analytics:", error\);/,
  `console.error("Failed to fetch analytics:", error);
        setError("Network error. Could not fetch analytics.");`
);

// Replace rendering to use safeStats
const safeStatsInjection = `
  const safeStats = {
    totalPatients: stats?.totalPatients || 0,
    completedAppointments: stats?.completedAppointments || 0,
    pendingAppointments: stats?.pendingAppointments || 0,
    approvedAppointments: stats?.approvedAppointments || 0,
    totalPrescriptions: stats?.totalPrescriptions || 0,
    trends: stats?.trends || [],
  };

  const statCards`;

code = code.replace(/const statCards/, safeStatsInjection);

// Update all references of stats to safeStats
code = code.replace(/stats\?/g, 'safeStats');
code = code.replace(/stats\./g, 'safeStats.');

// Ensure Math.max doesn't get empty array
code = code.replace(
  /Math\.max\(\.\.\.safeStats\.trends\.map\(\(t: any\) => t\.consultations\)\)/g,
  `Math.max(1, ...safeStats.trends.map((t: any) => t.consultations))`
);

fs.writeFileSync(file, code);
