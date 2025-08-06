export function createSlug(name: string): string {
  return name
    .replace(/\s+/g, "-")
    .replace(/[_?]/gi, "-")
    .replace(/[^\w\-]+/gi, "-")
    .replace(/\-\-+/g, "-");
}
