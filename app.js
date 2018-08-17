const https = require('https');

var location = process.argv[2];
console.log(location);
var axios = require('axios')
var base_url = 'https://www.tripadvisor.com'
var hotel_url, attraction_url
var start_url = `https://www.tripadvisor.com/TypeAheadJson?action=API&types=geo%2Cnbrhd%2Chotel%2Ctheme_park&filter=&legacy_format=true&urlList=true&strictParent=true&query=${location}&max=6&name_depth=3&interleaved=true&scoreThreshold=0.5&strictAnd=false&typeahead1_5=true&disableMaxGroupSize=true&geoBoostFix=true&geoPages=&injectList=&neighborhood_geos=true&details=true&link_type=hotel%2Cvr%2Ceat%2Cattr&rescue=true&uiOrigin=trip_search_Hotels&source=trip_search_Hotels&startTime=1534405083120&searchSessionId=6AF547AD9906BCD918FBAA5755C3CCE41534405068850ssid&nearPages=true&supportedSearchTypes=`

async function start() {
    await axios.get(start_url)
        .then(function (response) {
            hotel_url = base_url + response.data[0].url
            attraction_url = base_url + response.data[0].urls[3].url
        })
        .catch(function (error) {
            console.log(error);
        });

    console.log(hotel_url)
    console.log(attraction_url)
    axios.get(`http://localhost:9080/crawl.json?spider_name=hotels&url=${hotel_url}`)
        .then(function (response) {
            console.log('-------------------------------------------HOTELS--------------------------------------------------')
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error)
        })
    axios.get(`http://localhost:9080/crawl.json?spider_name=attractions&url=${attraction_url}`)
        .then(function (response) {
            console.log('-------------------------------------------ATTRACTIONS---------------------------------------------------')
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error)
        })
    console.log('----------------------------------------------------START--------------------------------------------------------')
};

start()