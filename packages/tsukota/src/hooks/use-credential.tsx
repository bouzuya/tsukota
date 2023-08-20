import { signInWithCustomToken, User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, createCustomToken } from "@/lib/firebase";
import { storage } from "@/lib/storage";
import { generate as generateUuidV4 } from "@/lib/uuid";

const getFirebaseAuthCurrentUser = (): Promise<User | null> => {
  return Promise.race([
    new Promise<never>((_, reject) => setTimeout(reject, 500)),
    new Promise<User | null>((resolve, reject) => {
      try {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        });
      } catch (_) {
        reject();
      }
    }),
  ]).then(
    (user) => user,
    (_) => null,
  );
};

const CredentialContext = createContext<{ user: User | null }>({
  user: null,
});

export function CredentialProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO: error handling
    if (user !== null) return;

    // no await
    void (async () => {
      const { deviceId, deviceSecret } = await ensureDevice();
      // TODO: customToken の期限が切れていても Firebase Authentication の
      // ログイン状態は継続されてしまうが、ひとまず考慮しない。
      const currentUser = await getFirebaseAuthCurrentUser();
      if (currentUser !== null) {
        console.log(`uid : ${currentUser.uid} (cached)`);
        setUser(currentUser);
      } else {
        // TODO: 期限までは customToken を永続化して再利用すると
        // Cloud Functions の呼び出しを減らせる & 高速化できそう
        const customTokenResult = await createCustomToken({
          device_id: deviceId,
          device_secret: deviceSecret,
        });
        const customToken = customTokenResult.data.custom_token;

        const userCredential = await signInWithCustomToken(auth, customToken);
        console.log(`uid : ${userCredential.user.uid} (signed in)`);
        setUser(userCredential.user);
      }
    })();
  }, [user]);

  return (
    <CredentialContext.Provider value={{ user }}>
      {children}
    </CredentialContext.Provider>
  );
}

export function useCurrentUserId(): string | null {
  const { user } = useContext(CredentialContext);
  return user?.uid ?? null;
}

type DeviceCredential = {
  deviceId: string;
  deviceSecret: string;
};

async function ensureDevice(): Promise<DeviceCredential> {
  try {
    const { deviceId, deviceSecret } = await storage.load<DeviceCredential>({
      key: "device",
    });
    return { deviceId, deviceSecret };
  } catch (_) {
    const deviceId = generateUuidV4();
    const deviceSecret = generateUuidV4();
    // throw error if failed to save
    await storage.save({
      key: "device",
      data: { deviceId, deviceSecret },
    });
    return { deviceId, deviceSecret };
  }
}
