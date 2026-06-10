const fs = require('fs');
const file = 'app/doctor/analytics/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /const safeStats = \{\s*totalPatients: safeStats\.totalPatients \|\| 0,\s*completedAppointments: safeStats\.completedAppointments \|\| 0,\s*pendingAppointments: safeStats\.pendingAppointments \|\| 0,\s*approvedAppointments: safeStats\.approvedAppointments \|\| 0,\s*totalPrescriptions: safeStats\.totalPrescriptions \|\| 0,\s*trends: safeStats\.trends \|\| \[\],\s*\};/,
  `const safeStats = {
    totalPatients: stats?.totalPatients || 0,
    completedAppointments: stats?.completedAppointments || 0,
    pendingAppointments: stats?.pendingAppointments || 0,
    approvedAppointments: stats?.approvedAppointments || 0,
    totalPrescriptions: stats?.totalPrescriptions || 0,
    trends: stats?.trends || [],
  };`
);

fs.writeFileSync(file, code);
