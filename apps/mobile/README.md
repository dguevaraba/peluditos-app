# 🐾 Peluditos - Pet Health Companion

Una aplicación móvil React Native para el cuidado y seguimiento de la salud de mascotas.

## 📱 Características

- **Autenticación completa** con Google, Facebook, Apple y email/password
- **Sistema de temas dinámicos** con múltiples colores personalizables
- **Gestión de mascotas** con historial médico
- **Recordatorios de vacunas** y citas veterinarias
- **Galería de fotos** de mascotas
- **Interfaz moderna** y responsive

## 🚀 Tecnologías

- **React Native** con Expo
- **TypeScript**
- **Supabase** (Autenticación y Base de datos)
- **React Navigation**
- **Expo Linear Gradient**
- **Lucide React Native** (Iconos)

## 📋 Requisitos

- Node.js 16+
- Expo CLI
- Cuenta de Supabase
- Cuenta de Google Cloud Console (para OAuth)
- Cuenta de Facebook Developers (para OAuth)

## 🛠️ Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/peluditos.git
cd peluditos
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anonima
```

4. **Inicia la aplicación:**
```bash
npm start
```

## 🔧 Configuración

### Supabase
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Configura la autenticación con los providers deseados
3. Agrega las URLs de redirección en la configuración

### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto y habilita Google+ API
3. Configura las credenciales OAuth 2.0
4. Agrega las URLs de redirección autorizadas

### Facebook OAuth
1. Ve a [Facebook Developers](https://developers.facebook.com)
2. Crea una aplicación
3. Configura Facebook Login
4. Agrega las URLs de redirección

## 📁 Estructura del Proyecto

```
peluditos/
├── assets/                 # Imágenes y recursos
├── contexts/              # Contextos de React
│   ├── AuthContext.tsx    # Contexto de autenticación
│   └── ThemeContext.tsx   # Contexto de temas
├── docs/                  # Documentación y políticas
│   ├── privacy-policy.html
│   └── data-deletion.html
├── lib/                   # Configuraciones
│   └── supabase.ts        # Cliente de Supabase
├── screens/               # Pantallas de la aplicación
│   ├── LoginScreen.tsx
│   └── SignUpScreen.tsx
├── services/              # Servicios
│   └── authService.ts     # Servicio de autenticación
├── App.tsx                # Componente principal
├── theme.ts               # Configuración de temas
└── colorConfig.ts         # Configuración de colores
```

## 🎨 Temas y Colores

La aplicación incluye un sistema de temas dinámicos con:
- **Tema claro y oscuro**
- **8 colores personalizables**
- **Aplicación automática** en toda la UI

## 🔐 Autenticación

### Métodos soportados:
- **Email/Password** (con verificación)
- **Google OAuth**
- **Facebook OAuth**
- **Apple Sign-In** (iOS)

### Flujo de autenticación:
1. Usuario selecciona método de login
2. Se redirige al proveedor correspondiente
3. Después de la autenticación, regresa a la app
4. Se establece la sesión automáticamente

## 📱 Navegación

La aplicación usa React Navigation con:
- **Stack Navigator** para autenticación
- **Tab Navigator** para la aplicación principal
- **Navegación condicional** basada en el estado de autenticación

## 🚀 Despliegue

### Para desarrollo:
```bash
npm start
```

### Para producción:
```bash
expo build:android
expo build:ios
```

## 📄 Políticas

- [Política de Privacidad](./docs/privacy-policy.html)
- [Instrucciones de Eliminación de Datos](./docs/data-deletion.html)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Email**: privacy@peluditos.app
- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ para el cuidado de mascotas
