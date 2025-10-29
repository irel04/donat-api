export function generateTrackingNumber(): string {
	const prefix = 'TRK';

	return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 1000)}`;
}