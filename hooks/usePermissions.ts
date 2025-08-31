import { useState, useEffect } from 'react';
import { adminService, UserRole } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';

export interface PermissionCheck {
  permission: string;
  organizationId?: string;
}

export const usePermissions = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());

  // Load user roles on mount
  useEffect(() => {
    if (user) {
      loadUserRoles();
    } else {
      setUserRoles([]);
      setPermissions(new Set());
      setLoading(false);
    }
  }, [user]);

  const loadUserRoles = async () => {
    try {
      setLoading(true);
      const roles = await adminService.getUserRoles();
      setUserRoles(roles);
      
      // Extract all permissions from user roles
      const allPermissions = new Set<string>();
      roles.forEach(userRole => {
        if (userRole.role?.permissions) {
          userRole.role.permissions.forEach(permission => {
            allPermissions.add(permission);
          });
        }
      });
      setPermissions(allPermissions);
    } catch (error) {
      console.error('Error loading user roles:', error);
      setUserRoles([]);
      setPermissions(new Set());
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string, organizationId?: string): boolean => {
    if (!user || userRoles.length === 0) return false;

    for (const userRole of userRoles) {
      if (!userRole.role) continue;
      
      const rolePermissions = userRole.role.permissions || [];
      
      // Check for global permissions
      if (rolePermissions.includes(permission)) {
        return true;
      }
      
      // Check for organization-specific permissions
      if (organizationId && userRole.organization_id === organizationId) {
        if (rolePermissions.includes(permission)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: string[], organizationId?: string): boolean => {
    return permissions.some(permission => hasPermission(permission, organizationId));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions: string[], organizationId?: string): boolean => {
    return permissions.every(permission => hasPermission(permission, organizationId));
  };

  // Check if user has a specific role
  const hasRole = (roleName: string, organizationId?: string): boolean => {
    if (!user || userRoles.length === 0) return false;

    return userRoles.some(userRole => {
      if (userRole.role?.name !== roleName) return false;
      
      // If organizationId is specified, check if role is for that organization
      if (organizationId) {
        return userRole.organization_id === organizationId;
      }
      
      // If no organizationId, check if role is global (no organization)
      return !userRole.organization_id;
    });
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames: string[], organizationId?: string): boolean => {
    return roleNames.some(roleName => hasRole(roleName, organizationId));
  };

  // Get user's primary role (first active role)
  const getPrimaryRole = (): UserRole | null => {
    if (userRoles.length === 0) return null;
    return userRoles[0];
  };

  // Get all roles for a specific organization
  const getOrganizationRoles = (organizationId: string): UserRole[] => {
    return userRoles.filter(userRole => userRole.organization_id === organizationId);
  };

  // Get global roles (no organization)
  const getGlobalRoles = (): UserRole[] => {
    return userRoles.filter(userRole => !userRole.organization_id);
  };

  // Check if user is super admin
  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
  };

  // Check if user is admin in any organization
  const isAdmin = (organizationId?: string): boolean => {
    return hasRole('admin', organizationId);
  };

  // Check if user is vet support
  const isVetSupport = (organizationId?: string): boolean => {
    return hasRole('vet_support', organizationId);
  };

  // Check if user is sales
  const isSales = (organizationId?: string): boolean => {
    return hasRole('sales', organizationId);
  };

  // Check if user can manage organizations globally
  const canManageOrganizations = (): boolean => {
    return hasPermission('organizations:manage:global');
  };

  // Check if user can manage users in an organization
  const canManageUsers = (organizationId?: string): boolean => {
    return hasPermission('users:manage:global') || 
           hasPermission('users:create:organization', organizationId);
  };

  // Check if user can manage products in an organization
  const canManageProducts = (organizationId?: string): boolean => {
    return hasPermission('products:manage:organization', organizationId);
  };

  // Check if user can manage sales in an organization
  const canManageSales = (organizationId?: string): boolean => {
    return hasPermission('sales:manage:organization', organizationId);
  };

  // Check if user can manage medical records
  const canManageMedicalRecords = (organizationId?: string): boolean => {
    return hasPermission('medical_records:manage:organization', organizationId);
  };

  // Refresh user roles (useful after role changes)
  const refreshRoles = () => {
    loadUserRoles();
  };

  return {
    // State
    userRoles,
    loading,
    permissions,
    
    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Role checks
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isAdmin,
    isVetSupport,
    isSales,
    
    // Role getters
    getPrimaryRole,
    getOrganizationRoles,
    getGlobalRoles,
    
    // Specific permission checks
    canManageOrganizations,
    canManageUsers,
    canManageProducts,
    canManageSales,
    canManageMedicalRecords,
    
    // Utilities
    refreshRoles
  };
};
