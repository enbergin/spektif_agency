# 🚀 Deployment Troubleshooting Guide

## Overview
This document captures all the deployment issues encountered while deploying the Spektif Agency monorepo to Vercel (frontend) and Render (backend).

## 🎯 Architecture
- **Frontend**: Next.js 14 → Deployed to **Vercel**
- **Backend**: NestJS API → Deployed to **Render**
- **Database**: SQLite (for simplicity in deployment)

---

## 📝 Issues Encountered & Solutions

### 1. ❌ Vercel Monorepo Configuration
**Error**: `The file "/vercel/path0/apps/web/.next/routes-manifest.json" couldn't be found`

**Root Cause**: Vercel didn't know which subdirectory to build in a monorepo structure.

**Solution**:
```json
// apps/web/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "bun install",
  "framework": "nextjs"
}
```
- Configure Vercel project to use `apps/web` as root directory
- Add `vercel.json` in the web app directory

---

### 2. ❌ Database Provider Mismatch
**Error**: `Error validating datasource db: the URL must start with the protocol postgresql:// or postgres://`

**Root Cause**: Prisma schema had `provider = "postgresql"` but `DATABASE_URL=file:./dev.db` (SQLite).

**Solution**:
```prisma
// apps/api/prisma/schema.prisma
datasource db {
  provider = "sqlite"  // Changed from "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### 3. ❌ SQLite Enum Compatibility
**Error**: `Field 'priority' in model 'Card' can't be of type Priority. The current connector does not support the Enum type.`

**Root Cause**: SQLite doesn't support enum types.

**Solution**:
```prisma
// Comment out enum definitions
// enum Priority { LOW, MEDIUM, HIGH, URGENT }

// Change all enum fields to String
priority  String?  @default("MEDIUM")  // Was: Priority? @default(MEDIUM)
role      String   @default("USER")    // Was: Role @default(USER)
type      String                       // Was: NotificationType
```

---

### 4. ❌ SQLite JSON Type Support
**Error**: `Field 'data' in model 'Notification' can't be of type Json. The current connector does not support the Json type.`

**Root Cause**: SQLite doesn't support JSON type.

**Solution**:
```prisma
// Change Json fields to String
data  String?  // Was: Json?
```

---

### 5. ❌ Database Migration Conflicts
**Error**: `Added the required column 'createdBy' to the 'boards' table without a default value. There are 4 rows in this table`

**Root Cause**: Existing database data conflicted with new schema requirements.

**Solution**:
```json
// apps/api/package.json
"build": "npx prisma generate && npx prisma db push --force-reset && npx ts-node prisma/seed-simple.ts"
```
- Add `--force-reset` flag to drop and recreate database fresh

---

### 6. ❌ TypeScript Config Dependencies
**Error**: `File '@spektif/typescript-config/base.json' not found`

**Root Cause**: Monorepo TypeScript config package not available during deployment.

**Solution**:
```json
// apps/api/tsconfig.json - Remove "extends" and include all options inline
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "target": "ES2021",
    // ... all other options inline
  }
}
```

---

### 7. ❌ Seed Script Schema Mismatches
**Error**: `Object literal may only specify known properties, and 'branding' does not exist in type 'OrganizationCreateInput'`

**Root Cause**: Seed script used field names that don't exist in the current schema.

**Solution**:
- Create simplified `seed-simple.ts` with only essential data
- Use correct field names matching the schema:
  - `orgId` → `organizationId`
  - Remove non-existent `branding` field
  - Remove non-existent models like `expense`, `salary`

---

### 8. ❌ NestJS CLI Not Found
**Error**: `sh: 1: nest: not found`

**Root Cause**: NestJS CLI not globally available in deployment environment.

**Solution**:
```json
// apps/api/package.json
{
  "scripts": {
    "build": "npx prisma generate && npx prisma db push --force-reset && npx ts-node prisma/seed-simple.ts",
    "start": "npx nest start",        // Use npx
    "start:prod": "npx ts-node src/main.ts"  // Direct ts-node execution
  }
}
```

---

## 🔧 Final Working Configuration

### Backend (Render)
```json
// apps/api/package.json
{
  "scripts": {
    "build": "npx prisma generate && npx prisma db push --force-reset && npx ts-node prisma/seed-simple.ts",
    "start": "npx nest start",
    "start:prod": "npx ts-node src/main.ts"
  }
}
```

**Environment Variables**:
- `DATABASE_URL=file:./dev.db`
- `PORT=3001` (or auto-assigned by Render)

### Frontend (Vercel)
```json
// apps/web/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next", 
  "installCommand": "bun install",
  "framework": "nextjs"
}
```

**Environment Variables**:
- `NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com/api`
- `NEXTAUTH_SECRET=your-secret-key`
- `GOOGLE_CLIENT_ID=your-google-client-id`
- `GOOGLE_CLIENT_SECRET=your-google-client-secret`

---

## 🎉 Success Criteria

When deployment works, you should see:
1. ✅ Prisma client generated successfully
2. ✅ Database reset and schema sync completed  
3. ✅ Seed script runs without errors
4. ✅ NestJS server starts successfully
5. ✅ Health check endpoint responds: `GET /health`
6. ✅ Login credentials work: `admin@spektif.com` / `admin123`

---

## 🔍 Debugging Tips

1. **Check commit hash**: Ensure deployment uses latest commit
2. **Force new deployment**: Make small change and push to trigger rebuild
3. **Check logs carefully**: TypeScript errors show exact line numbers
4. **Test locally first**: Run `npm run build` in `apps/api` locally
5. **Verify schema**: Ensure all field names match between schema and seed script

---

## 📚 Key Learnings

1. **SQLite limitations**: No enums, no JSON types - use String instead
2. **Monorepo complexity**: Each platform needs specific configuration
3. **Schema-seed alignment**: Field names must match exactly
4. **Deployment isolation**: Dependencies not available across monorepo packages
5. **Progressive debugging**: Fix one error at a time, test, repeat

---

*Last updated: January 2025*
