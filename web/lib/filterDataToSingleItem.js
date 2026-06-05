// Queries return an array; reduce it to a single document.
// Both clients use a single perspective ('published' or 'drafts'), so there is
// at most one document per slug — no need to disambiguate published vs draft here.
export function filterDataToSingleItem(data = []) {
  if (!Array.isArray(data)) {
    return data;
  }

  return data[0] ?? null;
}
