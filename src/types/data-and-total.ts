// This is use for returning paginated data along with total count in services — e.g., findAll, findAndCount methods in services or repo
export interface DataAndTotal <T> {
	data: T[];
	total: number;
}