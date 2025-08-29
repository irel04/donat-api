export const FIXED_DATE = new Date("2026-04-05T00:00:00Z")

export const MOCK_USER = {
	id: "user-123",
	firstName: "John",
	lastName: "Doe",
	email: "test@example.com",
	password: "password123",
	role: "admin",
	createdAt: FIXED_DATE
}

export const MOCK_EVENT = {
	id: "event-123",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	starDate: FIXED_DATE,
	endDate: FIXED_DATE,
	user: MOCK_USER,
	createdAt: FIXED_DATE,
	updatedAt: null
}