import $ from "cheerio";
import { isText, Text } from "domhandler";
import { readdir, readFile } from "fs/promises";

import { EXTENDED_FILE } from "../config";
import { Database } from "../db/loadDB";
import { findByLevenshtein, getAccepted } from "../server/searchEngine";
import { ApniName } from "../types/apni";
import { ExtraLayout } from "../types/result";
import { timestamp, updateJSON } from "./scrapeUtils";

const DATABASE_PAGE = (page: number) =>
    `https://www.gardeningwithangus.com.au/category/plant-database/page/${page}/`;

const DIR = "./angus";

let skipped = 0;

const manual: { [key: string]: string } = {
    "Actinotus minor- Lesser Flannel Flower ": "Actinotus minor",
    "Rhodanthe chlorocephala ssp rosea": "Rhodanthe chlorocephala subsp. rosea",
    "Lomandra confertifolia ssp rubiginosa 'Mist'":
        "Lomandra confertifolia subsp. rubiginosa 'Mist'",
    "Adenanthos pungens subsp effusus 'Coral Cover'":
        "Adenanthos pungens 'Coral Cover'",
    "Crowea hybrid 'Poorinda Ecstasy'": "Crowea 'Poorinda Ecstasy'",
    "Corymbia hybrid 'Summer Snow'": "Corymbia 'Summer Snow'",
    "Correa reflexa x alba 'Lemon Twist'": "Correa 'Lemon Twist'",
    "Correa pulchella x alba 'Ice Maiden'": "Correa 'Ice Maiden'",
    "Correa baeuerlenii -Chefs Cap Correa": "Correa baeuerlenii",
    "Eucalyptus leucoxylon subspecies megalocarpa":
        "Eucalyptus leucoxylon subsp. megalocarpa",
    "Kingia australis Kingia": "Kingia australis",
    "Crowea hybrid 'Festival'": "Crowea 'Festival'",
    "Corymbia hybrid 'Summer Beauty'": "Corymbia 'Summer Beauty'",
    "Corymbia hybrid 'Summer Red'": "Corymbia 'Summer Red'",
    "Callistemon hybrid 'Mary MacKillop'": "Callistemon 'Mary MacKillop'",
    "Banksia hybrid 'Giant Candles'": "Banksia 'Giant Candles'",
    "Hibiscus hybrid 'Citrus Mist'": "Hibiscus 'Citrus Mist'",
    "Acmena smithii 'Sunrise'": "Syzygium smithii 'Sunrise'",
    "Adenanthos hybrid 'Waratah Bay'": "Adenanthos 'Waratah Bay'",
    "Grevillea hybrid 'Aussie Crawl'": "Grevillea 'Aussie Crawl'",
    "Ozothamnus hybrid 'Colour Surprise'": "Ozothamnus 'Colour Surprise'",
    "Ozothamnus hybrid 'Magic Marmalade'": "Ozothamnus 'Magic Marmalade'",
    "Hibiscus hybrid 'Aussie Pink'": "Hibiscus 'Aussie Pink'",
    "Hibiscus hybrid 'Aussie Pearl'": "Hibiscus 'Aussie Pearl'",
    "Hibiscus hybrid 'Aussie Delight'": "Hibiscus 'Aussie Delight'",
    "Acmena hybrid 'Minnie Magic'": "Acmena smithii 'Minnie Magic'",
    "Grevillea hybrid 'Bon Accord'": "Grevillea 'Bon Accord'",
    //
    "Asterolasia species 'Dungowan Creek'":
        "Asterolasia sp. Dungowan Creek (Beckers s.n. 25 Oct 1995)",
    "Alyogyne 'Blue Heeler'": "Alyogyne wrayae 'Blue Heeler'",
    "Grevillea 'Ned Kelly (Mason's Hybrid)'": "Grevillea 'Ned Kelly'",
    "Austromyrtus dulcis x tenuifolia 'Copper Tops'":
        "Austromyrtus 'Copper Tops'",
    "Hardenbergia violaceae 'Happy Wanderer'":
        "Hardenbergia violacea 'Happy Wanderer'",
    "Hardenbergia violaceae 'Free And Easy'":
        "Hardenbergia violacea 'Free 'n' Easy'",
    "Hardenbergia violaceae 'Snow White'": "Hardenbergia violacea 'Snow White'",
    "Hardenbergia 'Bushy Blue'": "Hardenbergia violacea 'Bushy Blue'",
    "Grevillea 'Lady O'": "Grevillea 'LadyO'",
    "Dianella 'Australiana'": "Dianella tasmanica 'Australiana'",
    "Dianella 'Goddess'": "Dianella caerulea 'Goddess'",
    "Chamelaucium 'Dancing Queen'": "Chamelaucium uncinatum 'Dancing Queen'",
    "Ceratopetalum gummiferum 'Alberys Red'":
        "Ceratopetalum gummiferum 'Albery's Red'",
    "Brachyscome multifida 'Break O Day'":
        "Brachyscome multifida 'Break of Day'",
    "Anigozanthos 'Bush Pioneer'": "Anigozanthos 'Bushpioneer'",
    "Myoporum parvifolium purpurea": "Myoporum parvifolium 'Purpurea'",
    "Anigozanthos 'Bush Elegance'": "Anigosanthos 'Bush Elegance'",
    "Anigozanthos 'Bush Pizzaz'": "Anigozanthos 'Bush Pizzazz'",
    "Grevillea gaudichaudii 'Gaudi's Ghost'":
        "Grevillea x gaudichaudii 'Gaudi's Ghost'",
    "Grevillea juniperina 'Molongolo'": "Grevillea juniperina 'Molonglo'",
    "Lomandra longifolia 'Fine N Dandy'": "Lomandra longifolia 'Fine 'n Dandy'",
    "Eucalyptus leucoxylon 'Euky Dwarf'": "Eucalyptus leucoxylon 'Dwarf'",
    "Grevillea obtusifolia 'Ging Gin Gem'":
        "Grevillea obtusifolia 'Gin Gin Gem'",
    "Grevillea gaudichaudii": "Grevillea x gaudichaudii R.Br. ex Gaudich.",
    "Baloskion tetraphylllum":
        "Baloskion tetraphyllum (Labill.) B.G.Briggs & L.A.S.Johnson",
    "Callistemon 'Wee Johnnie'": "Callistemon viminalis 'Wee Johnnie'",
    "Citrus australasica var sanguinea 'Rainforest Pearl'":
        "Citrus australasica var. sanguinea 'Rainforest Pearl'",
    "Tetratheca thymifolia alba": "Tetratheca thymifolia var. alba",
    "Leionema  'Green Screen'": "Leionema 'Green Screen'",
    "Diplopeltis huegelli": "Diplopeltis huegelii Endl.",
    "Brachyscome  'Jumbo Yellow'": "Brachyscome 'Jumbo Yellow'",
    "Tristaniopsis laurina 'Burgundy Blush'":
        "Tristaniopsis laurina 'Burgundyblush'",
    "Ozothamnus diosmofolius 'Springtime White'":
        "Ozothamnus diosmifolius 'Springtime White'",
    "Acacia cognata 'Emerald Curl'": "Acacia cognata 'Emeraldcurl'",
    "Westringia brevifolia 'Lilac and Lace'":
        "Westringia brevifolia 'Lilac & Lace'",
    "Melaleuca pentagona var latifolia 'Little Penta'":
        "Melaleuca pentagona var. latifolia 'Little Penta'",
    "Westringia longifolia 'Snow Flurry'": "Westringia longifolia 'Snowflurry'",
    "Eucalyptus landsdowneana": "Eucalyptus lansdowneana F.Muell. & J.E.Br.",
    "Disphyma crassifolia": "Disphyma crassifolium (L.) L.Bolus",
    "Alloxylon flameum": "Alloxylon flammeum P.H.Weston & Crisp",
    "Cupaniopsis anarcardiodes": "Cupaniopsis anacardioides (A.Rich.) Radlk.",
    "Acmena smithii 'Fire Screen'": "Acmena smithii 'Firescreen'",
    "Scaevola aemula 'New Summer White Fan'":
        "Scaevola aemula 'Summer White Fan'",
    "Eucalyptus haemostoma": "Eucalyptus haemastoma Sm.",
    "Thryptomene saxicola 'FC Payne'": "Thryptomene saxicola 'F.C. Payne'",
    "Thyrptomene calycina": "Thryptomene calycina (Lindl.) Stapf",
    "Olearia languinosa 'Ghost Town'": "Olearia lanuginosa 'Ghost Town'",
    "Gastrolobium praemorsum 'Brown Butterfly'":
        "Gastrolobium praemorsum 'Bronze Butterfly'",
    "Grevillea 'Winter Delight'": "Grevillea lanigera 'Winter Delight'",
    "Westringia fruticosa 'Flat'n'Fruity'":
        "Westringia fruticosa 'Flat n Fruity'",
    "Grevillea rhyolitica 'Deua Gold'": "Grevillea 'Deuagold'",
    "Callistemon 'Mount Drummer'": "Callistemon 'Mt. Drummer'",
    "Coronidium elatum 'Sunny Side Up'": "Coronidium elatum 'Sunnyside Up'",
    "Adenanthos sericeus 'Silver Wave'": "Adenanthos argyreus 'Silver Wave'",
    "Conostylis candicans 'Silver Sunrise'":
        "Conostylis candicans 'Silversunrise'",
    "Telopea  speciosissima 'Wirrimbirra White'":
        "Telopea speciosissima 'Wirrimbirra White'",
    "Telopea  speciosissima 'Shade of Pale'":
        "Telopea speciosissima 'Shade of Pale'",
    "Telopea  speciosissima 'Fire and Brimstone'":
        "Telopea speciosissima 'Fire and Brimstone'",
    "Telopea  speciosissima 'Cardinal'": "Telopea speciosissima 'Cardinal'",
    "Westringia  'Wynyabbie Gem'": "Westringia 'Wynyabbie Gem'",
    "Syzygium australe 'Tayla Made'": "Syzygium australe 'Tayla-Made'",
    "Syzygium australe 'Oranges and Lemons'":
        "Syzygium australe 'Oranges & Lemmons'",
    "Poa labillardieri 'Eskdale'": "Poa labillardierei 'Eskdale'",
    "Dianella caerulea ssp assera 'Curly Tops'":
        "Dianella caerulea var. assera 'Curly Tops'",
    "Pandorea pandorana 'Snowbells'": "Pandorea pandorana 'Snow Bells'",
    "Lomandra 'Silver Grace'":
        "Lomandra confertifolia subsp. rubiginosa 'Silver Grace'",
    "Melaleuca nesophila 'Little Nessie'": "Melaleuca nesophila 'Little Nessy'",
    "Hardenbergia violaceae 'White Out'": "Hardenbergia violacea 'White Out'",
    "Hardenbergia violaceae 'Sweet Heart'":
        "Hardenbergia violacea 'Sweet Heart'",
    "Hardenbergia violaceae 'Purple Spray'":
        "Hardenbergia violacea 'Purple Spray'",
};

export const getAngusPages = async (db: Database) => {
    // const name = "Acacia lanuginosa";
    // console.log(db.names.filter(species => species.canonicalName.toLowerCase() === name.toLowerCase()))
    // let exactMatches = await findAllAccepted(db, db.names.filter(species => species.canonicalName.toLowerCase() === name.toLowerCase()));
    // console.log(exactMatches);

    const files = await readdir(DIR);

    console.log(await findByLevenshtein(db, "Grevillea 'Lady O'"));

    // await parseDatabaseListing(db, `./angus/database-75.html`);

    for (const file of files) {
        await parseDatabaseListing(db, `${DIR}/${file}`);
    }

    console.log(`Skipped ${skipped} items`);

    // for (let i = files.length; i < 124; i++) {
    //     console.log(`Getting page ${i + 1}`);
    //     const html = (await Axios.get(DATABASE_PAGE(i + 1))).data;
    //     fs.writeFileSync(`${DIR}/database-${i + 1}.html`, html);
    // }
};

const assert = (assertion: boolean, msg?: string) => {
    if (!assertion) {
        throw new Error(msg || "Assertion failed");
    }
};

const findByCanonicalName = (db: Database, query: string) => {
    let accepted = db.names
        .filter(
            (taxon) => taxon.canonicalName.toLowerCase() === query.toLowerCase()
        )
        .map((taxon) => getAccepted(db, taxon));
    return accepted;
};

const findByIncludes = (db: Database, query: string) => {
    let accepted = db.names
        .filter((taxon) =>
            taxon.canonicalName.toLowerCase().includes(query.toLowerCase())
        )
        .map((taxon) => getAccepted(db, taxon));
    if (accepted.filter((item) => item.canonicalName === query).length) {
        accepted = accepted.filter((item) => item.canonicalName === query);
    }
    return accepted;
};

const parseDatabaseListing = async (db: Database, filename: string) => {
    console.log(`Filename: ${filename}`);
    const file = (await readFile(filename)).toString();
    const articles = $("article", file);

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];

        const titles = $("a", $("h1", $("header", article)[0])[0]);

        if (titles.length === 0) {
            skipped++;
            continue;
        }

        assert(titles.length === 1, "Expected 1 title");
        const title = titles[0];
        assert(title.children.length === 1, "Expected 1 child of a");
        assert(
            isText(title.children[0]),
            "Expected title's first child to be text element"
        );
        const name = (title.children[0] as Text).data
            .replace(/‘/g, "'")
            .replace(/’/g, "'");
        let [scientificName, commonName] = name.split("–").map((s) => s.trim());
        let [_, scientificName2, commonName2] =
            scientificName.match(/^([^']*'[^']*') ?([^']*)?$/) || [];
        if (commonName2) {
            scientificName = scientificName2 || scientificName;
            commonName = commonName || commonName2;
        }
        const link = title.attribs.href;

        const summaries = $("p", $("div.entry-summary", article)[0]);
        assert(summaries.length <= 1, "Expected 1 summary");

        let summary = "";
        if (summaries.length === 1) {
            const p = summaries[0];
            assert(p.children.length === 1, "Expected 1 child of p");
            assert(
                isText(p.children[0]),
                "Expected title's first child to be text element"
            );
            summary = (p.children[0] as Text).data;
        }

        let exactMatches = findByCanonicalName(db, scientificName);
        if (exactMatches.length === 1) {
            const query = exactMatches[0].scientificName;
            db.extended = await updateJSON<ExtraLayout>(EXTENDED_FILE, query, {
                gardeningWithAngus: {
                    timestamp: timestamp(),
                    title: commonName,
                    link: link,
                    plaintext: summary,
                },
            });
        } else if (!manual[scientificName]) {
            console.log(
                `\t\tChecking ${scientificName} ${
                    commonName ? `(${commonName})` : ""
                }`
            );

            const checkMatch = async (
                original: string,
                name: string,
                fn?: (db: Database, query: string) => ApniName[],
                filter?: (data: ApniName) => boolean
            ) => {
                let exactMatches = (fn || findByCanonicalName)(db, name);
                exactMatches = filter
                    ? exactMatches.filter(filter)
                    : exactMatches;
                if (exactMatches.length) {
                    console.log("Found?", exactMatches.length);
                    console.log(
                        `\t"${original}": "${exactMatches[0].scientificName}"`
                    );
                }
            };

            let scientificNameFixed = scientificName
                .replace(" subspecies ", " subsp. ")
                .replace(" ssp ", " subsp. ")
                .replace(" var ", " var. ")
                .replace(" hybrid ", " ");

            await checkMatch(scientificName, scientificNameFixed);

            const match = scientificNameFixed.match(
                /^([A-Za-z]+) [A-Za-z]+ ('.*')$/
            );
            if (match) {
                const [_all, first, second] = match;
                await checkMatch(scientificName, first + second);
            }

            const match2 = scientificNameFixed.match(/^([A-Za-z]+) ('.*')$/);
            if (match2) {
                const [_all, first, second] = match2;
                await checkMatch(
                    scientificName,
                    second,
                    findByIncludes,
                    (item) => item.genericName === first
                );
            }

            await checkMatch(
                scientificName,
                scientificNameFixed,
                findByLevenshtein
            );

            // console.log("\n");
        }
    }
};
