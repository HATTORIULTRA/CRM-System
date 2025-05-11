import { useAppSelector } from "./redux.ts";
import { Roles } from "../types/admin.ts";

export function useHasRole(role: Roles) {
  const { user } = useAppSelector((state) => state.auth);
  return user?.roles.includes(role);
}
