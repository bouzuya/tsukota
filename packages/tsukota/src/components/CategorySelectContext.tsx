import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { useAccount } from "@/components/AccountContext";
import { Category, listCategory } from "@/lib/account";

type ContextValue = {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
};

const CategorySelectContext = createContext<ContextValue>({
  selectedCategory: null,
  setSelectedCategory: () => {
    // do nothing
  },
});

export type Props = {
  children: ReactNode;
};

export function CategorySelectProvider({ children }: Props): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  return (
    <CategorySelectContext.Provider
      value={{ selectedCategory, setSelectedCategory }}
    >
      {children}
    </CategorySelectContext.Provider>
  );
}

export function useCategorySelect(accountId: string): {
  categoriesWithDeleted: Category[] | null;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
} {
  const { selectedCategory, setSelectedCategory } = useContext(
    CategorySelectContext,
  );
  const { account } = useAccount(accountId, []);
  const categoriesWithDeleted = useMemo(
    () => (account === null ? null : listCategory(account, true)),
    [account],
  );
  return {
    categoriesWithDeleted,
    selectedCategory,
    setSelectedCategory,
  };
}
