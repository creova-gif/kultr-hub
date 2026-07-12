import { useReportEvent as useReportEventGenerated, useGetPublicUser, getGetPublicUserQueryKey } from "@workspace/api-client-react";

interface MutationCallbacks<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

/** File a fraud/abuse report on an event. Any authenticated user. */
export function useReportEvent() {
  const m = useReportEventGenerated();
  return {
    isPending: m.isPending,
    mutate: (
      eventId: string,
      data: { reason: string; details?: string },
      callbacks?: MutationCallbacks<unknown>,
    ) => m.mutate({ id: eventId, data }, callbacks),
  };
}

/** Lightweight public profile lookup — used for the Verified Organizer badge. */
export function usePublicUser(userId: string | undefined) {
  return useGetPublicUser(userId ?? "", {
    query: { queryKey: getGetPublicUserQueryKey(userId ?? ""), enabled: !!userId },
  });
}
