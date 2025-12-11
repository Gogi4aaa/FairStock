const users: { username: string; password: string }[] = [];

export function register(username: string, password: string): { success: boolean; message?: string; status: number } {
  if (users.find((u) => u.username === username)) {
    return { success: false, message: "User already exists.", status: 409 };
  }
  users.push({ username, password });
  return { success: true, status: 201 };
}

export function login(username: string, password: string): boolean {
  return !!users.find((u) => u.username === username && u.password === password);
}
