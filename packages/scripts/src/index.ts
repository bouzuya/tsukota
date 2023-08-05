import { argv } from "node:process";
import { handle as handleAddOwner } from "./handler/add-owner";

async function main(): Promise<void> {
  const args = argv.slice(2);
  switch (args[0]) {
    // npm start -- add-owner <act-as> <account-id> <user-id>
    case "add-owner": {
      const [_command, actAs, accountId, userId] = args;
      if (actAs === undefined) throw new Error("act-as is required");
      if (accountId === undefined) throw new Error("account-id is required");
      if (userId === undefined) throw new Error("user-id is required");
      await handleAddOwner(actAs, accountId, userId);
      break;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
