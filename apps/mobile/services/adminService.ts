import { supabase } from '../lib/supabase';

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  permissions: string[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  organization_id?: string;
  role_id: string;
  assigned_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: Role;
  user?: any;
  organization?: any;
}

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category_id?: string;
  stock_quantity: number;
  is_active: boolean;
  images: string[];
  specifications: any;
  created_at: string;
  updated_at: string;
  category?: any;
  organization?: any;
}

export interface Sale {
  id: string;
  organization_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  product?: Product;
  user?: any;
  organization?: any;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  organization_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: any;
  organization?: any;
}

class AdminService {
  // =====================================================
  // PERMISSIONS & ROLES
  // =====================================================

  // Get all permissions
  async getPermissions(): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('display_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  // Get all roles
  async getRoles(): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('display_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  // Get user roles
  async getUserRoles(userId?: string): Promise<UserRole[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          role:roles(*),
          organization:organizations(*),
          user:user_profiles(*)
        `)
        .eq('user_id', targetUserId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  }

  // Assign role to user
  async assignRole(userId: string, roleId: string, organizationId?: string): Promise<UserRole> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: userId,
          role_id: roleId,
          organization_id: organizationId,
          assigned_by: user.id
        }])
        .select(`
          *,
          role:roles(*),
          organization:organizations(*),
          user:user_profiles(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  }

  // Remove role from user
  async removeRole(userRoleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', userRoleId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing role:', error);
      throw error;
    }
  }

  // Check if user has permission
  async hasPermission(permission: string, organizationId?: string): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles();
      
      for (const userRole of userRoles) {
        if (!userRole.role) continue;
        
        const permissions = userRole.role.permissions || [];
        
        // Check for global permissions
        if (permissions.includes(permission)) {
          return true;
        }
        
        // Check for organization-specific permissions
        if (organizationId && userRole.organization_id === organizationId) {
          if (permissions.includes(permission)) {
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  // =====================================================
  // PRODUCTS
  // =====================================================

  // Get products for organization
  async getProducts(organizationId?: string): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*),
          organization:organizations(*)
        `)
        .eq('is_active', true);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Create product
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select(`
          *,
          category:product_categories(*),
          organization:organizations(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select(`
          *,
          category:product_categories(*),
          organization:organizations(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // =====================================================
  // SALES
  // =====================================================

  // Get sales for organization
  async getSales(organizationId?: string): Promise<Sale[]> {
    try {
      let query = supabase
        .from('sales')
        .select(`
          *,
          product:products(*),
          user:user_profiles(*),
          organization:organizations(*)
        `);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  // Create sale
  async createSale(saleData: Partial<Sale>): Promise<Sale> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([saleData])
        .select(`
          *,
          product:products(*),
          user:user_profiles(*),
          organization:organizations(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  // Update sale status
  async updateSaleStatus(saleId: string, status: Sale['status']): Promise<Sale> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({ status })
        .eq('id', saleId)
        .select(`
          *,
          product:products(*),
          user:user_profiles(*),
          organization:organizations(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating sale status:', error);
      throw error;
    }
  }

  // =====================================================
  // AUDIT LOGS
  // =====================================================

  // Get audit logs
  async getAuditLogs(organizationId?: string, limit: number = 100): Promise<AuditLog[]> {
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          user:user_profiles(*),
          organization:organizations(*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  // Get organization statistics
  async getOrganizationStats(organizationId: string): Promise<any> {
    try {
      const [products, sales, users] = await Promise.all([
        this.getProducts(organizationId),
        this.getSales(organizationId),
        this.getOrganizationUsers(organizationId)
      ]);

      const totalSales = sales.reduce((sum, sale) => sum + sale.total_price, 0);
      const completedSales = sales.filter(sale => sale.status === 'completed');
      const totalCommission = completedSales.reduce((sum, sale) => sum + sale.commission_amount, 0);

      return {
        totalProducts: products.length,
        totalSales: sales.length,
        totalRevenue: totalSales,
        totalCommission,
        totalUsers: users.length,
        activeProducts: products.filter(p => p.is_active).length,
        pendingSales: sales.filter(s => s.status === 'pending').length
      };
    } catch (error) {
      console.error('Error fetching organization stats:', error);
      throw error;
    }
  }

  // Get organization users
  async getOrganizationUsers(organizationId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          user:user_profiles(*),
          role:roles(*)
        `)
        .eq('organization_id', organizationId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching organization users:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
