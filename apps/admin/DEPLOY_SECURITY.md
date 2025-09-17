# 🔒 GUÍA DE SEGURIDAD PARA DEPLOY

## ⚠️ VARIABLES DE ENTORNO REQUERIDAS

### **CRÍTICO: Estas variables DEBEN estar configuradas en producción**

```bash
# Variables públicas (pueden estar en el cliente)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Variable privada (SOLO servidor)
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

## 🚨 CAMBIOS DE SEGURIDAD REALIZADOS

### **ANTES (INSEGURO):**
```typescript
// ❌ PELIGROSO - Claves hardcodeadas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://goycdfmmrtqnfkhmiotn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### **DESPUÉS (SEGURO):**
```typescript
// ✅ SEGURO - Sin claves hardcodeadas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}
```

## 📋 CHECKLIST DE DEPLOY

### **Pre-Deploy:**
- [ ] Variables de entorno configuradas en el servidor
- [ ] No hay claves hardcodeadas en el código
- [ ] Build exitoso con variables de entorno
- [ ] Migraciones de base de datos aplicadas

### **Post-Deploy:**
- [ ] Aplicación funciona correctamente
- [ ] Autenticación funciona
- [ ] RLS policies funcionan
- [ ] No hay errores en logs

## 🔐 CONFIGURACIÓN DE PRODUCCIÓN

### **Vercel:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### **Docker:**
```dockerfile
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
```

### **Railway/Render:**
Configurar en el panel de variables de entorno del servicio.

## ⚡ COMANDOS DE VERIFICACIÓN

```bash
# Verificar build local
npm run build

# Verificar con variables de entorno
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... npm run build

# Verificar que no hay claves hardcodeadas
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" apps/admin/
```

## 🛡️ SEGURIDAD ADICIONAL

1. **Nunca commitees archivos .env**
2. **Usa diferentes claves para desarrollo/producción**
3. **Rota las claves regularmente**
4. **Monitorea el acceso a la base de datos**
5. **Revisa los logs de Supabase regularmente**
