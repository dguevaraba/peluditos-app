# Peluditos Monorepo

A comprehensive pet management system with a React Native mobile app and Next.js administrative PWA.

## 🏗️ Project Structure

```
peluditos/
├── apps/
│   ├── mobile/          # React Native mobile app
│   └── admin/           # Next.js administrative PWA
├── packages/
│   ├── shared/          # Shared utilities and constants
│   ├── ui/              # Shared UI components (future)
│   └── supabase/        # Supabase client and types
├── tools/
│   └── eslint-config/   # Shared ESLint configuration
└── package.json         # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- React Native development environment (for mobile app)
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd peluditos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both `apps/mobile/` and `apps/admin/`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development servers**

   **Mobile App:**
   ```bash
   npm run mobile
   ```

   **Admin PWA:**
   ```bash
   npm run admin
   ```

   **Both simultaneously:**
   ```bash
   npm run dev
   ```

## 📱 Mobile App (React Native)

The mobile app is a comprehensive pet management system with features like:

- **Pet Management**: Add, edit, and track pets
- **Photo Gallery**: Organize pet photos in albums
- **Health Tracking**: Weight monitoring and medical records
- **Chat System**: AI-powered pet advice and service chats
- **Community & Market**: Social features and pet products
- **Theme System**: Customizable colors and dark mode

### Key Features:
- Real-time data sync with Supabase
- Offline-first architecture
- Push notifications
- Camera and photo management
- GPS integration for vet locations

## 🖥️ Admin PWA (Next.js)

The administrative PWA provides comprehensive system management:

### Role-Based Access Control:
- **Super Admin**: Full system control
- **Admin**: Organization and user management
- **Vet Support**: Clinic-specific management
- **Sales**: Product and sales management
- **User**: Basic pet management

### Key Features:
- **User Management**: Create, edit, and manage user accounts
- **Organization Management**: Veterinary clinics and pet shops
- **Pet Database**: View and manage all registered pets
- **Product Catalog**: Manage pet products and services
- **Analytics Dashboard**: System statistics and reports
- **Audit Logs**: Track all system activities

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Run all apps in development mode
npm run mobile           # Run mobile app only
npm run admin            # Run admin PWA only

# Building
npm run build            # Build all apps
npm run mobile:build     # Build mobile app only
npm run admin:build      # Build admin PWA only

# Linting
npm run lint             # Lint all packages

# Testing
npm run test             # Run tests for all packages

# Cleaning
npm run clean            # Clean all build artifacts
```

### Adding New Packages

1. Create a new directory in `packages/`
2. Add `package.json` with workspace dependencies
3. Update root `package.json` if needed
4. Run `npm install` to link packages

### Database Schema

The system uses Supabase with the following main tables:

- `users` - User accounts
- `user_profiles` - Extended user information
- `pets` - Pet information
- `organizations` - Veterinary clinics, pet shops, etc.
- `roles` - System roles and permissions
- `user_roles` - User role assignments
- `products` - Product catalog
- `sales` - Sales records
- `audit_logs` - System activity tracking

## 🎨 Design System

### Colors
The system uses a consistent color palette:
- Primary: `#65b6ad` (Green)
- Secondary: Various pastel colors
- Dark mode support throughout

### Components
- Shared UI components in `packages/ui/`
- Consistent styling with Tailwind CSS
- Responsive design for all screen sizes

## 🔐 Security

- Row Level Security (RLS) in Supabase
- Role-based access control
- JWT authentication
- Audit logging for all actions
- Input validation and sanitization

## 📊 Analytics

The admin panel provides:
- User registration statistics
- Pet registration trends
- Organization growth metrics
- Sales analytics
- System usage reports

## 🚀 Deployment

### Mobile App
- Expo Application Services (EAS)
- App Store and Google Play Store
- Over-the-air updates

### Admin PWA
- Vercel (recommended)
- Netlify
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**Built with ❤️ for pet lovers everywhere**
