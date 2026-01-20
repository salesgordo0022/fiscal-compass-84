export interface ListItem {
  id: string;
  name: string;
  cnpj?: string;
  observation?: string;
}

export interface CategoryList {
  id: string;
  title: string;
  description: string;
  items: ListItem[];
}

export const categorizedLists: CategoryList[] = [];
