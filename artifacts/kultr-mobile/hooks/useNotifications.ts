import { useQueryClient } from "@tanstack/react-query";
import {
  useListNotifications,
  getListNotificationsQueryKey,
  useMarkNotificationRead as useMarkNotificationReadGenerated,
  useMarkAllNotificationsRead as useMarkAllNotificationsReadGenerated,
  type NotificationView,
} from "@workspace/api-client-react";
import { useApp } from "@/context/AppContext";

export type { NotificationView };

/** The signed-in user's real notification feed, newest first. */
export function useMyNotifications() {
  const { authToken } = useApp();
  return useListNotifications(undefined, {
    query: { queryKey: getListNotificationsQueryKey(), enabled: !!authToken },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  const m = useMarkNotificationReadGenerated({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    },
  });
  return {
    isPending: m.isPending,
    mutate: (id: string, callbacks?: { onSuccess?: () => void; onError?: (e: unknown) => void }) =>
      m.mutate({ id }, callbacks),
  };
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const m = useMarkAllNotificationsReadGenerated({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    },
  });
  return {
    isPending: m.isPending,
    mutate: (callbacks?: { onSuccess?: () => void; onError?: (e: unknown) => void }) =>
      m.mutate(undefined, callbacks),
  };
}
