const backendBase = `${process.env.REACT_APP_BACKEND_BASE}:${process.env.REACT_APP_BACKEND_PORT}`;

const L = '%7B';
const R = '%7D';

export default {
  usersUri: {
    loginUri: `${backendBase}/api/cardamine-users/login`,
    logoutUri: `${backendBase}/api/cardamine-users/logout?access_token={accessToken}`
  },
  chromosomeDataUri: {
    baseUri: `${backendBase}/api/cdata?access_token={accessToken}`,
    getByIdUri: `${backendBase}/api/cdata/{id}?filter=%7B"include":["dna",%7B"histories":"list-of-species"%7D,%7B"material":"reference"%7D]%7D&access_token={accessToken}`,
    getAllWFilterUri: `${backendBase}/api/cdata?access_token={accessToken}&filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":[ 
                %7B
                    "relation":"counted-by",
                    "scope":%7B
                        "where":%7B%7D
                    %7D
                %7D,
                %7B
                    "relation":"latest-revision",
                    "scope":%7B
                        "include":%7B
                            "relation":"list-of-species",
                            "where":%7B%7D
                        %7D
                    %7D 
                %7D,
                %7B
                    "relation":"material",
                    "scope":%7B
                        "where":%7B%7D,
                        "include":[
                            %7B
                                "relation":"world-l4",
                                "scope":%7B
                                    "where":%7B%7D
                                %7D
                            %7D,
                            %7B
                                "relation":"reference",
                                "scope":%7B
                                    "include":[
                                        %7B
                                            "relation":"literature"
                                        %7D,
                                        %7B
                                            "relation":"original-identification"
                                        %7D
                                    ]
                                %7D
                            %7D
                        ]
                    %7D
                %7D
            ]%7D`,
    exportUri: `${backendBase}/api/cdata?access_token={accessToken}&filter=${L}"where":{where},"include":[${L}"material":[${L}"reference":["literature","original-identification"]${R},"collected-by","identified-by","world-l4"]${R},"latest-revision","dna","counted-by"]${R}`,
    countUri: `${backendBase}/api/cdata/count?where={whereString}&access_token={accessToken}`
  },
  dnaUri: {
    baseUri: `${backendBase}/api/dnas?access_token={accessToken}`
  },
  materialUri: {
    baseUri: `${backendBase}/api/materials?access_token={accessToken}`
  },
  referenceUri: {
    baseUri: `${backendBase}/api/references?access_token={accessToken}`
  },
  listOfSpeciesUri: {
    baseUri: `${backendBase}/api/list-of-species?access_token={accessToken}`,
    getAllWOrderUri: `${backendBase}/api/list-of-species?filter=%7B"order":["genus","species","subsp","var","subvar","forma","authors","id"]%7D&access_token={accessToken}`,
    getAllWFilterUri: `${backendBase}/api/list-of-species?filter=%7B"where":{where}%7D&access_token={accessToken}`,
    getByIdUri: `${backendBase}/api/list-of-species/{id}?access_token={accessToken}`,
    getByIdWFilterUri: `${backendBase}/api/list-of-species/{id}?filter=%7B"include":"synonyms-nomenclatoric"%7D&access_token={accessToken}`,
    getNomenclatoricSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-nomenclatoric?filter=%7B"include":"synonyms-nomenclatoric-through"%7D&access_token={accessToken}`,
    getTaxonomicSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-taxonomic?filter=%7B"include":"synonyms-nomenclatoric-through"%7D&access_token={accessToken}`,
    getInvalidSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-invalid?access_token={accessToken}`,
    getMisidentificationUri: `${backendBase}/api/list-of-species/{id}/synonyms-misidentification?access_token={accessToken}`,
    getBasionymForUri: `${backendBase}/api/list-of-species/{id}/basionym-for?access_token={accessToken}`,
    getReplacedForUri: `${backendBase}/api/list-of-species/{id}/replaced-for?access_token={accessToken}`,
    getNomenNovumForUri: `${backendBase}/api/list-of-species/{id}/nomen-novum-for?access_token={accessToken}`,
    getSynonymsOfParent: `${backendBase}/api/list-of-species/{id}/parent-of-synonyms?filter={filter}&access_token={accessToken}`,
    countUri: `${backendBase}/api/list-of-species/count?access_token={accessToken}`
  },
  literaturesUri: {
    baseUri: `${backendBase}/api/literature?access_token={accessToken}`,
    getAllWFilterUri: `${backendBase}/api/literature?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"order":["paperAuthor","paperTitle","year","id"]%7D&access_token={accessToken}`,
    getAllWOrderUri: `${backendBase}/api/literature?filter=%7B"order":["paperAuthor", "paperTitle", "year", "id"]%7D&access_token={accessToken}`,
    getByIdUri: `${backendBase}/api/literature/{id}?access_token={accessToken}`,
    countUri: `${backendBase}/api/literature/count?access_token={accessToken}`
  },
  personsUri: {
    baseUri: `${backendBase}/api/persons?access_token={accessToken}`,
    getByIdUri: `${backendBase}/api/persons/{id}?access_token={accessToken}`,
    getByNameUri: `${backendBase}/api/persons?filter=%7B"where":%7B"persName":"{name}"%7D%7D&access_token={accessToken}`,
    getAllWFilterUri: `${backendBase}/api/persons?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"order":["persName","id"]%7D&access_token={accessToken}`,
    getAllWOrderUri: `${backendBase}/api/persons?filter=%7B"order":["persName","id"]%7D&access_token={accessToken}`,
    countUri: `${backendBase}/api/persons/count?access_token={accessToken}`
  },
  synonymsUri: {
    baseUri: `${backendBase}/api/synonyms?access_token={accessToken}`,
    synonymsByIdUri: `${backendBase}/api/synonyms/{id}?access_token={accessToken}`
  },
  worldl4Uri: {
    getAllWFilterUri: `${backendBase}/api/world-l4s?filter=%7B"order":["description","id"]%7D&access_token={accessToken}`,
    getByDescription: `${backendBase}/api/world-l4s?filter=%7B"where":%7B"description":"{description}"%7D%7D&access_token={accessToken}`
  }
}