import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  acceptNotification,
} from "@/services/notifications-service";

export function useNotifications() {
  return useQuery({
    queryKey: ["vendors", "notifications"],
    queryFn: getNotifications,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useAcceptNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptNotification,
    onSuccess: () => {
      // Invalidate notifications to refresh the list after accepting
      queryClient.invalidateQueries({ queryKey: ["vendors", "notifications"] });
      // Also refresh active jobs since accepting a notification might add a new active job
      queryClient.invalidateQueries({ queryKey: ["vendors", "active-jobs"] });
    },
  });
}
