export const ADMIN_UID = "b85bce85-2f02-47f1-a375-720c6edfe2e8";

export function isAdminUser(user) {
  return user?.id === ADMIN_UID;
}
