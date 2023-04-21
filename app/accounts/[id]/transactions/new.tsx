import { useRouter, useSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  IconButton,
  Screen,
  TransactionForm,
  View,
  useAccount,
} from "../../../../components";
import { TransactionFormValues } from "../../../../components/TransactionForm";
import { createTransaction, getLastEventId } from "../../../../lib/account";
import { storeEvent } from "../../../../lib/api";
import { useTranslation } from "../../../../lib/i18n";

export default function TransactionNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useAccount(accountId, []);
  const router = useRouter();
  const { control, getValues, handleSubmit, setValue } =
    useForm<TransactionFormValues>({
      defaultValues: {
        amount: "",
        categoryId: "",
        comment: "",
        date: new Date().toISOString().substring(0, 10),
      },
    });
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = ({
    amount,
    categoryId,
    comment,
    date,
  }: TransactionFormValues) => {
    const result = createTransaction(account, {
      amount,
      categoryId,
      comment,
      date,
    });
    if (result.isErr()) return;
    const [newAccount, event] = result.value;
    storeEvent(getLastEventId(account), event).then((_) => {
      setAccount(newAccount);
      router.back();
    });
  };

  return (
    <Screen
      options={{
        title: t("title.transaction.new") ?? "",
        headerRight: () => (
          <IconButton
            accessibilityLabel={t("button.save") ?? ""}
            icon="check"
            onPress={handleSubmit(onClickOk)}
            size={28}
          />
        ),
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TransactionForm
          control={control}
          categories={account.categories}
          getValues={getValues}
          setValue={setValue}
        />
      </View>
    </Screen>
  );
}
