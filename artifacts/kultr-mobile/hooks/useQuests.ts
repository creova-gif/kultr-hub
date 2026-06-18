import { useQueryClient } from "@tanstack/react-query";
import {
  useGetQuestProgress,
  getGetQuestProgressQueryKey,
  useListPerks,
  getListPerksQueryKey,
  useVerifyCheckin,
  useUnlockPerk as useUnlockPerkGenerated,
  type CheckinResult,
  type PerkView,
} from "@workspace/api-client-react";
import { useApp } from "@/context/AppContext";

export type {
  QuestProgress,
  QuestView,
  CollectibleView,
  PerkView,
  CheckinResult,
} from "@workspace/api-client-react";

/** Full gamification state for the signed-in user. */
export function useQuestProgress() {
  const { authToken } = useApp();
  return useGetQuestProgress({
    query: { queryKey: getGetQuestProgressQueryKey(), enabled: !!authToken },
  });
}

/** Redeemable perks catalog. */
export function usePerks() {
  const { authToken } = useApp();
  return useListPerks({
    query: { queryKey: getListPerksQueryKey(), enabled: !!authToken },
  });
}

interface MutationCallbacks<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

/** Verify attendance at an event; advances quests and may award points/badges. */
export function useCheckIn() {
  const qc = useQueryClient();
  const m = useVerifyCheckin({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetQuestProgressQueryKey() }),
    },
  });
  return {
    isPending: m.isPending,
    mutate: (eventId: string, callbacks?: MutationCallbacks<CheckinResult>) =>
      m.mutate({ data: { eventId } }, callbacks),
  };
}

/** Spend KULTROINS to unlock a perk. */
export function useUnlockPerk() {
  const qc = useQueryClient();
  const m = useUnlockPerkGenerated({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetQuestProgressQueryKey() }),
    },
  });
  return {
    isPending: m.isPending,
    mutate: (perkSlug: string, callbacks?: MutationCallbacks<unknown>) =>
      m.mutate({ data: { perkSlug } }, callbacks),
  };
}

export type { PerkView as Perk };
