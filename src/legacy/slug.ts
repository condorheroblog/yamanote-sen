// Helpers shared by the legacy app and its sub-routes.

export function asciify(name: string): string {
	return name
		.normalize("NFD")
		.replace(/[\u0300-\u036F]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
