-- =====================================================
-- MIGRATION: Create Administrative System
-- Date: 2024-12-01
-- Description: Creates roles, permissions, products, and sales tables
-- =====================================================

-- =====================================================
-- 1. TABLA PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABLA ROLES
-- =====================================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABLA USER_ROLES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id, role_id)
);

-- =====================================================
-- 4. TABLA PRODUCT_CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABLA PRODUCTS
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  category_id UUID REFERENCES product_categories(id),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABLA SALES
-- =====================================================

CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABLA AUDIT_LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. ÍNDICES PARA RENDIMIENTO
-- =====================================================

-- Permissions
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource, action);

-- Roles
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_system ON roles(is_system_role);

-- User Roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_organization_id ON user_roles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(is_active);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_organization_id ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Sales
CREATE INDEX IF NOT EXISTS idx_sales_organization_id ON sales(organization_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Permissions (read-only for authenticated users)
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view permissions" ON permissions
  FOR SELECT USING (true);

-- Roles (read-only for authenticated users)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view roles" ON roles
  FOR SELECT USING (true);

-- User Roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles in their organization" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = user_roles.organization_id
      AND ur.role_id IN (
        SELECT id FROM roles WHERE name IN ('super_admin', 'admin')
      )
      AND ur.is_active = true
    )
  );

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Organization members can manage their products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = products.organization_id
      AND ur.is_active = true
    )
  );

-- Sales
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sales" ON sales
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Organization members can view their organization sales" ON sales
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = sales.organization_id
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can create sales" ON sales
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Organization admins can view organization audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = audit_logs.organization_id
      AND ur.role_id IN (
        SELECT id FROM roles WHERE name IN ('super_admin', 'admin')
      )
      AND ur.is_active = true
    )
  );

-- =====================================================
-- 10. TRIGGERS PARA AUDIT
-- =====================================================

-- Function to log changes
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    organization_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    COALESCE(NEW.organization_id, OLD.organization_id),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for audit logging
CREATE TRIGGER audit_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_products
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_sales
  AFTER INSERT OR UPDATE OR DELETE ON sales
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- =====================================================
-- 11. DATOS INICIALES
-- =====================================================

-- Insert basic permissions
INSERT INTO permissions (name, display_name, description, resource, action) VALUES
  ('organizations:manage:global', 'Manage Organizations Globally', 'Full control over all organizations', 'organizations', 'manage'),
  ('organizations:read:global', 'View Organizations Globally', 'View all organizations', 'organizations', 'read'),
  ('users:manage:global', 'Manage Users Globally', 'Full control over all users', 'users', 'manage'),
  ('users:create:organization', 'Create Users in Organization', 'Invite users to organization', 'users', 'create'),
  ('users:read:organization', 'View Users in Organization', 'View organization members', 'users', 'read'),
  ('products:manage:organization', 'Manage Products in Organization', 'Full control over organization products', 'products', 'manage'),
  ('products:read:organization', 'View Products in Organization', 'View organization products', 'products', 'read'),
  ('sales:manage:organization', 'Manage Sales in Organization', 'Full control over organization sales', 'sales', 'manage'),
  ('sales:create:own', 'Create Own Sales', 'Create sales records', 'sales', 'create'),
  ('pets:read:organization', 'View Pets in Organization', 'View pets in organization', 'pets', 'read'),
  ('medical_records:manage:organization', 'Manage Medical Records', 'Full control over medical records', 'medical_records', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Insert system roles
INSERT INTO roles (name, display_name, description, permissions, is_system_role) VALUES
  ('super_admin', 'Super Administrator', 'Full platform control', 
   '["organizations:manage:global", "users:manage:global", "products:manage:organization", "sales:manage:organization", "pets:read:organization", "medical_records:manage:organization"]'::jsonb, 
   true),
  ('admin', 'Administrator', 'Organization management', 
   '["users:create:organization", "users:read:organization", "products:manage:organization", "sales:manage:organization", "pets:read:organization", "medical_records:manage:organization"]'::jsonb, 
   true),
  ('vet_support', 'Veterinary Support', 'Medical records and pet management', 
   '["pets:read:organization", "medical_records:manage:organization"]'::jsonb, 
   true),
  ('sales', 'Sales Representative', 'Product and sales management', 
   '["products:read:organization", "sales:create:own"]'::jsonb, 
   true),
  ('user', 'Regular User', 'Basic user permissions', 
   '[]'::jsonb, 
   true)
ON CONFLICT (name) DO NOTHING;

-- Insert basic product categories
INSERT INTO product_categories (name, description) VALUES
  ('Food & Nutrition', 'Pet food and nutritional supplements'),
  ('Health & Medicine', 'Veterinary medicines and health products'),
  ('Grooming & Care', 'Grooming tools and care products'),
  ('Toys & Entertainment', 'Pet toys and entertainment items'),
  ('Accessories', 'Collars, leashes, and other accessories'),
  ('Equipment', 'Crates, beds, and other equipment')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 12. COMENTARIOS
-- =====================================================

COMMENT ON TABLE permissions IS 'System permissions for role-based access control';
COMMENT ON TABLE roles IS 'User roles with associated permissions';
COMMENT ON TABLE user_roles IS 'User role assignments within organizations';
COMMENT ON TABLE products IS 'Products sold by organizations';
COMMENT ON TABLE sales IS 'Sales transactions and commissions';
COMMENT ON TABLE audit_logs IS 'Audit trail for all administrative actions';
