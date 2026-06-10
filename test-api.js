const fs = require('fs');
const file = 'app/api/doctors/analytics/route.ts';
let code = fs.readFileSync(file, 'utf8');

// Add comprehensive logging
code = code.replace(
  /export async function GET\(req: Request\) \{/,
  `export async function GET(req: Request) {
  console.log("=== API REQUEST ===");
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("Cookies:", req.headers.get("cookie"));
`
);

code = code.replace(
  /const auth = await requireAuth\(req\);/,
  `const auth = await requireAuth(req);
    console.log("Auth result:", auth);`
);

fs.writeFileSync(file, code);
