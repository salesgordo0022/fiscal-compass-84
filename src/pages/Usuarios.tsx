import React, { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import PageDescription from '@/components/layout/PageDescription';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  created_at: string;
}

const Usuarios: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as AppRole,
  });

  // Only admin can access this page
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, created_at');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar usuários',
          variant: 'destructive',
        });
        return;
      }

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

      // Combine data
      const usersWithRoles: UserWithRole[] = profiles?.map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        return {
          id: profile.id,
          email: '', // Email not exposed in profiles for security
          name: profile.name,
          role: (userRole?.role as AppRole) || 'user',
          created_at: profile.created_at,
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    if (newUser.password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);

    try {
      // Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: newUser.name,
          },
        },
      });

      if (authError) {
        toast({
          title: 'Erro',
          description: authError.message,
          variant: 'destructive',
        });
        return;
      }

      // If admin selected a different role, update it
      if (authData.user && newUser.role !== 'user') {
        // Wait a bit for the trigger to create the default role
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: newUser.role })
          .eq('user_id', authData.user.id);

        if (roleError) {
          console.error('Error updating role:', roleError);
        }
      }

      setNewUser({ name: '', email: '', password: '', role: 'user' });
      setIsDialogOpen(false);
      fetchUsers();

      toast({
        title: 'Sucesso',
        description: `Usuário ${newUser.name} criado com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar usuário',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Gestão de Usuários" subtitle="Administração" />
      <PageDescription description="Área exclusiva para administradores. Gerencie os usuários do sistema, crie novas contas e defina permissões de acesso." />
      
      <div className="p-6 animate-fade-in">
        <div className="data-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Usuários Cadastrados</h3>
              <p className="text-sm text-muted-foreground">Total: {users.length} usuários</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus size={18} />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Nome do usuário"
                        disabled={isCreating}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@exemplo.com"
                        disabled={isCreating}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                        disabled={isCreating}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Perfil</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: AppRole) => setNewUser({ ...newUser, role: value })}
                        disabled={isCreating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleCreateUser} 
                      className="w-full mt-4"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Criando...
                        </span>
                      ) : (
                        'Criar Usuário'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nome</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Nenhum usuário cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>
                        <span className={`status-badge ${
                          u.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                        }`}>
                          {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(u.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
