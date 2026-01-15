import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Calculator, 
  Building2, 
  FileText, 
  Heart,
  LogOut,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Planilha Geral', path: '/planilha-geral', icon: FileSpreadsheet },
  { title: 'Carnê Leão', path: '/carne-leao', icon: Calculator },
  { title: 'Controle de Holding', path: '/controle-holding', icon: Building2 },
  { title: 'ECD e ECF', path: '/ecd-ecf', icon: FileText },
  { title: 'Terceiro Setor', path: '/terceiro-setor', icon: Heart },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo / Brand */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-lg">C</span>
            </div>
            <div>
              <h2 className="font-bold text-sidebar-primary text-sm">CONTÁBIL</h2>
              <p className="text-xs text-sidebar-foreground/60">Sistema de Controle</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-sidebar-primary-foreground font-bold text-lg">C</span>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar-accent rounded-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "nav-item w-full",
                    isActive && "nav-item-active"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Admin Only - User Management */}
        {user?.role === 'admin' && (
          <>
            <div className={cn("my-4 border-t border-sidebar-border", collapsed && "mx-2")} />
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => navigate('/usuarios')}
                  className={cn(
                    "nav-item w-full",
                    location.pathname === '/usuarios' && "nav-item-active"
                  )}
                  title={collapsed ? "Usuários" : undefined}
                >
                  <Users size={20} className="shrink-0" />
                  {!collapsed && <span>Usuários</span>}
                </button>
              </li>
            </ul>
          </>
        )}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-sidebar-primary truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            <span className="inline-block mt-1 text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-0.5 rounded capitalize">
              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-destructive hover:bg-destructive/10"
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
