import documentsTypes from "@/data/selects/documentsTypes.json";
import userTypes from "@/data/selects/userTypes.json";
import dishCategories from "@/data/selects/dishCategories.json";

export async function getDocumentTypes() {
  return documentsTypes;
}

export async function getUserTypes() {
  return userTypes;
}

export async function getDishCategories() {
  return dishCategories;
}