import { storage } from "./storage";

type LocalAccount = {
  id: string;
  name: string;
};

export const deleteAccountFromLocal = async (
  accountId: string
): Promise<void> => {
  const key = "accounts";
  await storage.remove({ key, id: accountId });
};

export const loadAccountsFromLocal = async (): Promise<LocalAccount[]> => {
  const key = "accounts";
  const ids = await storage.getIdsForKey(key);

  const accounts = [];
  for (const id of ids) {
    const account = await storage.load<LocalAccount>({
      key,
      id,
    });
    accounts.push(account);
  }

  return accounts;
};
