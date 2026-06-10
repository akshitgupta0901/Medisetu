const fs = require('fs');
const file = 'app/api/doctors/analytics/route.ts';
let code = fs.readFileSync(file, 'utf8');

// Uncomment the auth check
code = code.replace(
  /\/\/\s*if \(auth\.role !== "doctor" && auth\.role !== "admin"\) \{\n\s*\/\/\s*return forbiddenResponse\(\);\n\s*\/\/\s*\}/,
  `if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse();
    }`
);

fs.writeFileSync(file, code);
