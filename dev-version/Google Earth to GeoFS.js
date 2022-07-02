const xmlFIle = //The Converted XML file of Google Earth

var SpawnLat = //The latitude of where the plane will spawn to start the challenge
var SpawnLon = //The longitude of where the plane will spawn to start the challenge
var SpawnAlt = //The altitude of where the plane will spawn to start the challenge
var SpawnDirection = //The direction of where the plane will spawn to start the challenge
var Desc = //The challenges description

parkour = [{
    "waypoints": 0,
    "spawn": [SpawnLat, SpawnLon, SpawnAlt, SpawnDirection],
    "description": Desc
},[]]

var arrayLength = (xmlFIle.kml.Document.Folder.Placemark.length)/4;
let index = 0
for (var i = 0; i < arrayLength; i++) {
    let lat1 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[1]
    let lon1 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[0]
    index +=1
    let lat2 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[1]
    let lon2 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[0]
    index +=1
    let lat3 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[1]
    let lon3 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[0]
    index +=1
    let lat4 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[1]
    let lon4 = JSON.parse(`[${xmlFIle.kml.Document.Folder.Placemark[index].Point.coordinates}]`)[0]
    index +=1
    parkour[1].push({"lat":[lat1, lat2, lat3, lat4], "lon":[lon1, lon2, lon3, lon4]})
}
console.log(JSON.stringify(parkour))


