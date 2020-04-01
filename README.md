# (yet another) Australian Plant Search

A search engine and data aggregator for Australian native plants with a focus on being useful for gardeners.

Goals:
[x] Users can search for plants by common names and scientific names.
[x] Users can see related plants to the top result - subspecies, cultivars, etc.
[ ] Users can sign up to create lists/checklists of plants.

## TODO:

* The APNI doesn't indicate if a plant is native or naturalised.
* Use Wikipedia stats as a way to measure popularity of plants for sorting.
* Get pictures and descriptions from wikipedia.

Wikipedia stats:

`curl -X GET https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/Isopogon_sphaerocephalus/monthly/2004100100/2020040200`

## Data sources

Database retrieved from https://biodiversity.org.au/nsl/services/export/index

Other potential sources:

1. https://bie.ala.org.au/species/https://id.biodiversity.org.au/taxon/apni/51270591
2. Direct APNI: https://www.anbg.gov.au/apni/apni.html
3. Aus Plants: https://austplants.com.au/plant-database
4. Angus: https://www.gardeningwithangus.com.au/category/plant-database/page/123/
5. FloraBase: https://florabase.dpaw.wa.gov.au/search/quick?q=isopogon
6. ALA - Atlas of Living Australia - https://bie.ala.org.au/species/https://id.biodiversity.org.au/name/apni/195580
7. JSTOR: https://plants.jstor.org/search?genus=Isopogon&species=anemonifolius
8. KEW: http://apps.kew.org/herbcat/getHomePageResults.do?homePageSearchText=Isopogon+anemonifolius
9. ALA flora (pictures): https://profiles.ala.org.au/opus/foa/search

Misc.
1. DNA? https://www.ncbi.nlm.nih.gov/nuccore/363990557
2. ABNG Confluence: https://www.anbg.gov.au/ibis25/display/NSL/Home


## Notes

Interesting plants I've found while making this: https://www.flowerpower.com.au/isopogon-candy-cones-9336922015688 (https://pma.com.au/supportcentre/Images/FactSheet/i_candycones_fs_web.pdf)
