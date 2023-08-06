import { argv } from "node:process";
import { handle as handleAddOwner } from "./handler/add-owner";
import { handle as handleImportCsv } from "./handler/import-csv";

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
    // npm start -- import-csv <csv-file> <category-map-file> <act-as> <account-id> <dry-run>
    case "import-csv": {
      const [
        _command,
        csvFile,
        categoryMapFile,
        actAs,
        accountId,
        dryRunAsString,
      ] = args;
      if (csvFile === undefined) throw new Error("csv-file is required");
      if (categoryMapFile === undefined)
        throw new Error("category-map-file is required");
      if (actAs === undefined) throw new Error("act-as is required");
      if (accountId === undefined) throw new Error("account-id is required");
      if (dryRunAsString === undefined) throw new Error("dry-run is required");
      const dryRun = dryRunAsString !== "false";
      await handleImportCsv(csvFile, categoryMapFile, actAs, accountId, dryRun);
      break;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
