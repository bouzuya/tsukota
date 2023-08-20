import { getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { ResultAsync } from "neverthrow";
import { AccountEvent } from "@/lib/account";
import {
  db,
  storeAccountEvent as firebaseStoreAccountEvent,
} from "@/lib/firebase";
import {
  getAccountEventCollectionRef,
  getSystemStatusDocumentRef,
  getUserDocumentRef,
} from "@/lib/ref-helpers";
import { timeSpan } from "@/lib/time-span";

export function storeAccountEvent(
  lastEventId: string | null,
  event: AccountEvent,
): ResultAsync<void, string> {
  return ResultAsync.fromPromise(
    firebaseStoreAccountEvent({
      last_event_id: lastEventId,
      event,
    }).then((result) => void result),
    String,
  );
}

export async function loadAccountIds(currentUserId: string): Promise<string[]> {
  const uid = currentUserId;
  const userSnapshot = await getDoc(getUserDocumentRef(db, uid));
  const data = userSnapshot.data();
  if (data === undefined) return [];
  return data.account_ids;
}

export async function loadEventsFromRemote(
  accountId: string,
  since: string | null,
): Promise<AccountEvent[]> {
  return await timeSpan(`loadEventsFromRemote ${accountId}`, async () => {
    const q = query(
      getAccountEventCollectionRef(db, accountId),
      where("at", ">", since !== null ? since : "1970-01-01T00:00:00Z"),
      orderBy("at"),
    );
    const eventsSnapshot = await getDocs(q);
    return eventsSnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => {
        return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
      });
  });
}

export const getMinAppVersion = async (): Promise<string> => {
  const systemStatusDocSnapshot = await getDoc(getSystemStatusDocumentRef(db));
  return systemStatusDocSnapshot.data()?.minAppVersion ?? "0.0.0";
};
