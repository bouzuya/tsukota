import { signInWithCustomToken, UserCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, createCustomToken } from "../lib/firebase";
import { storage } from "../lib/storage";
import { generate as generateUuidV4 } from "../lib/uuid";

const ensureDevice = async (): Promise<{
  deviceId: string;
  deviceSecret: string;
}> => {
  try {
    const { deviceId, deviceSecret } = await storage.load({
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
};

export function useCredential(): UserCredential | null {
  const [processing, setProcessing] = useState<boolean>(false);
  const [userCredential, setUserCredential] = useState<UserCredential | null>(
    null
  );

  useEffect(() => {
    (async () => {
      if (processing) return;
      setProcessing(true);
      try {
        const { deviceId, deviceSecret } = await ensureDevice();

        // TODO: 期限までは customToken を永続化して再利用すると
        // Cloud Functions の呼び出しを減らせる & 高速化できそう
        const customTokenResult = await createCustomToken({
          device_id: deviceId,
          device_secret: deviceSecret,
        });
        const customToken = customTokenResult.data.custom_token;

        const userCredential = await signInWithCustomToken(auth, customToken);
        console.log(`uid : ${userCredential.user.uid}`);
        setUserCredential(userCredential);
      } finally {
        setProcessing(false);
      }
    })();
  }, []);

  return userCredential;
}
