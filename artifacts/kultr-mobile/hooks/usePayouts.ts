import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPayoutBalance,
  getGetPayoutBalanceQueryKey,
  useListMyPayouts,
  getListMyPayoutsQueryKey,
  useRequestPayout as useRequestPayoutGenerated,
  type PayoutView,
  type PayoutCurrencyBalance,
} from "@workspace/api-client-react";
import { useApp } from "@/context/AppContext";

export type { PayoutView, PayoutCurrencyBalance };

/** Real available balance per currency for the signed-in creator. */
export function usePayoutBalance() {
  const { authToken } = useApp();
  return useGetPayoutBalance({
    query: { queryKey: getGetPayoutBalanceQueryKey(), enabled: !!authToken },
  });
}

/** The signed-in creator's own payout requests, newest first. */
export function useMyPayouts() {
  const { authToken } = useApp();
  return useListMyPayouts({
    query: { queryKey: getListMyPayoutsQueryKey(), enabled: !!authToken },
  });
}

interface MutationCallbacks<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

/** Request a new payout — server validates the amount against the real balance. */
export function useRequestPayout() {
  const qc = useQueryClient();
  const m = useRequestPayoutGenerated({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetPayoutBalanceQueryKey() });
        qc.invalidateQueries({ queryKey: getListMyPayoutsQueryKey() });
      },
    },
  });
  return {
    isPending: m.isPending,
    mutate: (
      data: { amount: number; currency: string; destination: string },
      callbacks?: MutationCallbacks<PayoutView>,
    ) => m.mutate({ data }, callbacks),
  };
}
