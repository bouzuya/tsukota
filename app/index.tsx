import { Stack, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Firestore, addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  FAB,
  Button,
  Dialog,
  List,
  Portal,
  Provider,
  TextInput,
} from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { db } from "../firebase";
import { storage } from "../storage";

const createAccountInFirestore = async (name: string): Promise<Account> => {
  try {
    const accountsCollection = collection(db, "accounts");
    const docRef = await addDoc(accountsCollection, { name });
    console.log("Document written with ID: ", docRef.id);
    const id = docRef.id;
    return { id, name };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

const createAccount = async (
  name: string,
  setAccounts: (accounts: Account[]) => void
): Promise<void> => {
  const { id } = await createAccountInFirestore(name);
  await storage.save({ key: "accounts", id, data: { id, name } });
  const loaded = await getAccounts();
  setAccounts(loaded);
};

const getAccounts = async (): Promise<Account[]> => {
  const key = "accounts";
  const ids = await storage.getIdsForKey(key);

  // TODO: insert dummy data for debugging
  const dummyData = [
    { id: "MoLT1vUAru7aJ2KRBPHs", name: "Account1" },
    { id: "klzmBVOGMaF5xZqTORwy", name: "Account2" },
  ];
  for (const { id, name } of dummyData) {
    if (ids.indexOf(id) === -1) {
      await storage.save({ key, id, data: { id, name } });
    }
  }

  const accounts = [];
  for (const id of ids) {
    const account = await storage.load<Account>({
      key,
      id,
    });
    accounts.push(account);
  }

  return accounts;
};

type Account = {
  id: string;
  name: string;
};

function Inner(): JSX.Element {
  const insets = useSafeAreaInsets();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const loadedAccounts = await getAccounts();
      setAccounts(loadedAccounts);
    })();
  }, []);
  return (
    <Provider>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <Stack.Screen options={{ title: "Home" }} />
        <View style={styles.list}>
          <FlatList
            data={accounts}
            keyExtractor={(user) => user.id}
            renderItem={({ item }) => (
              <List.Item
                onPress={(_) =>
                  router.push({
                    pathname: "/accounts/[id]",
                    params: { id: item.id },
                  })
                }
                description={`id: ${item.id}`}
                title={item.name}
              />
            )}
          />
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
        <StatusBar style="auto" />
      </View>
      <Portal>
        <Dialog visible={modalVisible}>
          <Dialog.Title>Add Account</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              mode="outlined"
              onChangeText={setName}
              value={name}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setModalVisible(false);
                setName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                createAccount(name, setAccounts);
                setName("");
                setModalVisible(false);
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}

export default function Index() {
  return (
    <SafeAreaProvider>
      <Inner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
  list: {
    flex: 1,
    width: "100%",
  },
});
