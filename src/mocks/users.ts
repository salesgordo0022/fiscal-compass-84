export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
  createdBy: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@contabil.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    createdAt: '2024-01-01',
    createdBy: 'Sistema',
  },
  {
    id: '2',
    email: 'maria@contabil.com',
    password: 'maria123',
    name: 'Maria Silva',
    role: 'user',
    createdAt: '2024-01-15',
    createdBy: 'Administrador',
  },
  {
    id: '3',
    email: 'joao@contabil.com',
    password: 'joao123',
    name: 'João Santos',
    role: 'user',
    createdAt: '2024-02-01',
    createdBy: 'Administrador',
  },
  {
    id: '4',
    email: 'ana@contabil.com',
    password: 'ana123',
    name: 'Ana Oliveira',
    role: 'user',
    createdAt: '2024-02-15',
    createdBy: 'Administrador',
  },
];

export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user || null;
};
