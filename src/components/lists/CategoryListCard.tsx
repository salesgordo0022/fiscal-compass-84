import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CategoryList } from '@/mocks/lists';

interface CategoryListCardProps {
  category: CategoryList;
}

const CategoryListCard: React.FC<CategoryListCardProps> = ({ category }) => {
  return (
    <div className="data-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{category.title}</h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
      
      <div className="space-y-2">
        {category.items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              {item.cnpj && (
                <p className="text-sm text-muted-foreground">{item.cnpj}</p>
              )}
              {item.observation && (
                <p className="text-xs text-muted-foreground mt-1">{item.observation}</p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{category.items.length} itens</span>
        </p>
      </div>
    </div>
  );
};

export default CategoryListCard;
