/* eslint-disable max-len */
const backendBase = `${process.env.REACT_APP_BACKEND_BASE}:${process.env.REACT_APP_BACKEND_PORT}`;

export default {
  usersUri: {
    loginUri: `${backendBase}/api/cardamine-users/login`,
    logoutUri: `${backendBase}/api/cardamine-users/logout?access_token=<%accessToken%>`,
  },
  chromosomeDataUri: {
    baseUri: `${backendBase}/api/cdata?access_token=<%accessToken%>`,
    getByIdUri: `${backendBase}/api/cdata/<%id%>?filter={"include":["dna",{"histories":"list-of-species"},{"material":"reference"}]}&access_token=<%accessToken%>`,
    getAllWFilterUri: `${backendBase}/api/cdata-admin-views?access_token=<%accessToken%>&filter={"where":<%&where%>,"offset":<%offset%>,"limit":<%limit%>,"order":<%&order%>}`,
    countUri: `${backendBase}/api/cdata-admin-views/count?where=<%&whereString%>&access_token=<%accessToken%>`,
    exportUri: `${backendBase}/api/cdata?access_token=<%accessToken%>&filter={"where":<%&where%>,"include":[{"material":[{"reference":["literature","original-identification"]},"collected-by","identified-by","world-l4"]},"latest-revision","dna","counted-by"]}`,
    refreshAdminViewUri: `${backendBase}/api/cdata-admin-views/refresh?access_token=<%accessToken%>`,
  },
  dnaUri: {
    baseUri: `${backendBase}/api/dnas?access_token=<%accessToken%>`,
  },
  materialUri: {
    baseUri: `${backendBase}/api/materials?access_token=<%accessToken%>`,
    getCoordinatesUri: `${backendBase}/api/materials?filter={"fields":["id","idCdata","coordinatesLat","coordinatesLon","coordinatesGeoref","coordinatesForMap"],"where":<%&where%>,"offset":<%offset%>,"limit":<%limit%>,"order":"idCdata"}&access_token=<%accessToken%>`,
    patchAttributesUri: `${backendBase}/api/materials/<%id%>?access_token=<%accessToken%>`,
    countUri: `${backendBase}/api/materials/count?where=<%&whereString%>&access_token=<%accessToken%>`,
  },
  referenceUri: {
    baseUri: `${backendBase}/api/references?access_token=<%accessToken%>`,
  },
  listOfSpeciesUri: {
    baseUri: `${backendBase}/api/list-of-species?access_token=<%accessToken%>`,
    getAllWOrderUri: `${backendBase}/api/list-of-species?filter={"order":["genus","species","subsp","var","subvar","forma","authors","id"]}&access_token=<%accessToken%>`,
    getAllWFilterUri: `${backendBase}/api/list-of-species?filter={"where":<%&where%>}&access_token=<%accessToken%>`,
    getByIdUri: `${backendBase}/api/list-of-species/<%id%>?access_token=<%accessToken%>`,
    getByIdWFilterUri: `${backendBase}/api/list-of-species/<%id%>?filter={"include":"synonyms-nomenclatoric"}&access_token=<%accessToken%>`,
    getNomenclatoricSynonymsUri: `${backendBase}/api/list-of-species/<%id%>/synonyms-nomenclatoric?filter={"include":"synonyms-nomenclatoric-through"}&access_token=<%accessToken%>`,
    getTaxonomicSynonymsUri: `${backendBase}/api/list-of-species/<%id%>/synonyms-taxonomic?filter={"include":"synonyms-nomenclatoric-through"}&access_token=<%accessToken%>`,
    getInvalidSynonymsUri: `${backendBase}/api/list-of-species/<%id%>/synonyms-invalid?access_token=<%accessToken%>`,
    getMisidentificationUri: `${backendBase}/api/list-of-species/<%id%>/synonyms-misidentification?access_token=<%accessToken%>`,
    getBasionymForUri: `${backendBase}/api/list-of-species/<%id%>/basionym-for?access_token=<%accessToken%>`,
    getReplacedForUri: `${backendBase}/api/list-of-species/<%id%>/replaced-for?access_token=<%accessToken%>`,
    getNomenNovumForUri: `${backendBase}/api/list-of-species/<%id%>/nomen-novum-for?access_token=<%accessToken%>`,
    getSynonymsOfParent: `${backendBase}/api/list-of-species/<%id%>/parent-of-synonyms?filter=<%filter%>&access_token=<%accessToken%>`,
    countUri: `${backendBase}/api/list-of-species/count?access_token=<%accessToken%>`,
  },
  literaturesUri: {
    baseUri: `${backendBase}/api/literature?access_token=<%accessToken%>`,
    getAllWFilterUri: `${backendBase}/api/literature?filter={"where":<%&where%>,"offset":<%offset%>,"limit":<%limit%>,"order":<%&order%>}&access_token=<%accessToken%>`,
    getAllWOrderUri: `${backendBase}/api/literature?filter={"order":["paperAuthor","paperTitle","year","id"]}&access_token=<%accessToken%>`,
    getByIdUri: `${backendBase}/api/literature/<%id%>?access_token=<%accessToken%>`,
    countUri: `${backendBase}/api/literature/count?where=<%&whereString%>&access_token=<%accessToken%>`,
  },
  personsUri: {
    baseUri: `${backendBase}/api/persons?access_token=<%accessToken%>`,
    getByIdUri: `${backendBase}/api/persons/<%id%>?access_token=<%accessToken%>`,
    getByNameUri: `${backendBase}/api/persons?filter={"where":{"persName":"<%name%>"}}&access_token=<%accessToken%>`,
    getAllWFilterUri: `${backendBase}/api/persons?filter={"where":<%&where%>,"offset":<%offset%>,"limit":<%limit%>,"order":<%&order%>}&access_token=<%accessToken%>`,
    getAllWOrderUri: `${backendBase}/api/persons?filter={"order":["persName","id"]}&access_token=<%accessToken%>`,
    countUri: `${backendBase}/api/persons/count?where=<%&whereString%>&access_token=<%accessToken%>`,
  },
  synonymsUri: {
    baseUri: `${backendBase}/api/synonyms?access_token=<%accessToken%>`,
    synonymsByIdUri: `${backendBase}/api/synonyms/<%id%>?access_token=<%accessToken%>`,
  },
  worldl4Uri: {
    getAllWFilterUri: `${backendBase}/api/world-l4s?filter={"order":["description","id"]}&access_token=<%accessToken%>`,
    getByDescription: `${backendBase}/api/world-l4s?filter={"where":{"description":"<%description%>"}}&access_token=<%accessToken%>`,
  },
};
