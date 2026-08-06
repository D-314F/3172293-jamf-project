export async function getDocumentTypes() {
  const res = await fetch("/src/data/selects/documentsTypes.json");
  return res.json();
}

export async function getUserTypes() {
  const res = await fetch("/src/data/selects/userTypes.json");
  return res.json();
}

export async function getDishCategories() {
  const res = await fetch("/src/data/selects/dishCategories.json");
  return res.json();
}