const fs = require('fs');
const file = 'lib/api-auth.ts';
let code = fs.readFileSync(file, 'utf8');

// Move custom JWT cookie check BEFORE NextAuth session
code = code.replace(
  /\/\/ 2\. Try NextAuth session[\s\S]*?\/\/ 3\. Try custom JWT cookie\s*const cookieStore = await cookies\(\);\s*const cookieToken = cookieStore\.get\(TOKEN_COOKIE_NAME\)\?\.value;\s*if \(cookieToken\) \{\s*const payload = verifyToken\(cookieToken\);\s*if \(payload\) return payload;\s*\}/,
  `// 2. Try custom JWT cookie first (to match middleware precedence)
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload) return payload;
  }

  // 3. Try NextAuth session
  try {
    const nextAuthToken = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (nextAuthToken?.userId) {
      return {
        userId: nextAuthToken.userId as string,
        email: nextAuthToken.email as string,
        role: nextAuthToken.role as any,
      };
    }
  } catch (error) {
    console.error("NextAuth getToken error:", error);
  }`
);

fs.writeFileSync(file, code);
