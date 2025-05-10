import { UserRequest } from "../types/admin.ts";

function isDirtyHelper(
  prevValues: UserRequest,
  newValues: UserRequest
): UserRequest {
  const newProfileData: UserRequest = {};

  for (const key in newValues) {
    const k = key as keyof UserRequest;
    if (prevValues[k] !== newValues[k]) {
      newProfileData[k] = newValues[k];
    }
  }
  return newProfileData;
}

export default isDirtyHelper;
