import { useCallback, useEffect } from "react";
import { AsyncStatus } from "../store/async-status";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadUsers } from "../store/users-slice";

export function useUsers() {
  const dispatch = useAppDispatch();
  const usersState = useAppSelector((state) => state.users);
  const isIdle = usersState.status === AsyncStatus.IDLE;

  useEffect(() => {
    if (isIdle) {
      dispatch(loadUsers());
    }
  }, [dispatch, isIdle]);

  const onReload = useCallback(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  return { ...usersState, onReload };
}
