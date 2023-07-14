import {
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  doc,
} from "firebase/firestore";

// `/users/${userId}`
type UserDocument = {
  id: string;
  account_ids: string[];
};

const userDocumentConverter: FirestoreDataConverter<UserDocument> = {
  fromFirestore: function (
    // 怪しい
    snapshot: QueryDocumentSnapshot<UserDocument>,
    options?: SnapshotOptions | undefined
  ): UserDocument {
    return snapshot.data(options);
  },
  toFirestore: function (
    modelObject: WithFieldValue<UserDocument>
  ): DocumentData {
    return modelObject;
  },
};

export function getUserDocumentRef(
  db: Firestore,
  userId: string
): DocumentReference<UserDocument> {
  return doc(db, "users", userId).withConverter(userDocumentConverter);
}
