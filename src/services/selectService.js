// selectService.js

export async function getDocumentTypes(){
    const res = await fetch("/src/data/selects/documentsTypes.json");
    return res.json();
}