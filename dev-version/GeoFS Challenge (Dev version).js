// ==UserScript==
// @name         Geo-FS Speed Challenges (dev version)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An addon for challenges in Geo-FS
// @author       Elon Musk
// @match http://www.geo-fs.com/geofs.php
// @match https://www.geo-fs.com/geofs.php
// @run-at document-end
// @grant        none
// @namespace https://github.com/TotallyRealElonMusk/Geo-FS-Speed-Challenges
// ==/UserScript==


let itv = setInterval(
    function(){
        try{
            if(window.ui && window.flight){
                spawnHTML();
                clearInterval(itv);}

        }catch(err){}
    }
    ,500);

const parkour = []
var x = false
var init = false

const R = 6.378
var EPSILON = 1.1102230246251565e-16
var ERRBOUND3 = (3.0 + 16.0 * EPSILON) * EPSILON

async function checkIf(testx, testy, i) {
  var vertx = parkour[1][i].lat
  var verty = parkour[1][i].lon
  var polygon = []
  var arrayLength = vertx.length;
  for (var i2 = 0; i2 < arrayLength; i2++) {
    polygon.push([convertX(vertx[i2], verty[i2]), convertY(vertx[i2], verty[i2])])
  }
  var test = []
  test.push(convertX(testx, testy), convertY(testx, testy))
  var res = classifyPoint(polygon, test)
  if (res === -1) {
    if (i === parkour[0].waypoints) {
      end()
      await sleep(100)
      x = false
      var waypointNUM = `Waypoint ${i + 1} out of ${parkour[0].waypoints + 1}`
      var waypointnum = document.getElementById("waypointNumber")
      waypointnum.innerHTML = waypointNUM;
    }
    else if (i === 0) {
      console.log("Next waypoint, timer started")
      averageLoops()
      start()
      return true

    }
    else {
      console.log("next waypoint")
      return true
    }

  }
}
function convertX(x, y) {
  //return  x*Math.cos(y)
  return R * Math.cos(x) * Math.cos(y)
}
function convertY(x, y) {
  return R * Math.cos(x) * Math.sin(y)
}


async function spawnModel(i) {
  var yPosition = (parkour[1][i].lon[3] + parkour[1][i].lon[0] + parkour[1][i].lon[2] + parkour[1][i].lon[1]) / 4
  var xPosition = (parkour[1][i].lat[3] + parkour[1][i].lat[0] + parkour[1][i].lat[2] + parkour[1][i].lat[1]) / 4
  var altPosition = geofs.getGroundAltitude(xPosition, yPosition).location[2] + 200
  var La = yPosition
  var θa = xPosition
  var Lb = geofs.aircraft.instance.llaLocation[1]
  var θb = geofs.aircraft.instance.llaLocation[0]
  var coordX = (Math.cos(toRadians(θb))) * (Math.sin(toRadians(diff(Lb, La))))
  var coordY = (Math.cos(toRadians(θa))) * (Math.sin(toRadians(θb))) - (Math.sin(toRadians(θa))) * (Math.cos(toRadians(θb))) * (Math.cos(toRadians(diff(Lb, La))))
  var β = Math.atan2(coordX, coordY)
  var brng = (β * 180 / Math.PI + 360) % 360
  geofs.objects.objectList = [{
    "location": [xPosition, yPosition, altPosition],
    "url": "https://raw.githubusercontent.com/TotallyRealElonMusk/Geo-FS-Speed-Challenges/main/3d-models/arrow.glb",
    "htr": [brng, 0, 0],
    "scale": 2,
    "options": { "shadows": 0 }, "type": 100
  }]
  geofs.objects.loadModels();
}
async function deleteModels() {
  geofs.objects.unloadModels();
}
async function theLoop() {
  var i = 0
  x = true
  var brng = 0
  spawnModel(i)
  while (x === true) {
    var X = geofs.aircraft.instance.llaLocation[0];
    var Y = geofs.aircraft.instance.llaLocation[1];
    var res = await checkIf(X, Y, i)
    if (res === true) {
        geofs.lastFlightCoordinates = {0:geofs.aircraft.instance.llaLocation[0], 1:geofs.aircraft.instance.llaLocation[1], 2: geofs.aircraft.instance.llaLocation[2], 3: geofs.aircraft.instance.htr[0], 4: true}
      console.log("i has been added")
      i += 1
      deleteModels()
      spawnModel(i)
      var waypointNUM = `Waypoint ${i} out of ${parkour[0].waypoints + 1}`
      var waypointnum = document.getElementById("waypointNumber")
      waypointnum.innerHTML = waypointNUM;
    }

    var La = Y
    var θa = X
    var Lb = (parkour[1][i].lon[3] + parkour[1][i].lon[0] + parkour[1][i].lon[2] + parkour[1][i].lon[1]) / 4
    var θb = (parkour[1][i].lat[3] + parkour[1][i].lat[0] + parkour[1][i].lat[2] + parkour[1][i].lat[1]) / 4
    var coordX = (Math.cos(toRadians(θb))) * (Math.sin(toRadians(diff(Lb, La))))
    var coordY = (Math.cos(toRadians(θa))) * (Math.sin(toRadians(θb))) - (Math.sin(toRadians(θa))) * (Math.cos(toRadians(θb))) * (Math.cos(toRadians(diff(Lb, La))))
    var β = Math.atan2(coordX, coordY)
    brng = (β * 180 / Math.PI + 360) % 360



    geofs.animation.values.navHDG = brng


    if (i !== 0) {
      setTime()
    }
    await sleep(10);
  }
}
function setTime() {
  if (timeExist === true) {
    var currentTime = performance.now();

    var timeDifference = currentTime - time[0]; //in ms

    //timeDifference /= 1000;
    var actualTime = Math.round(timeDifference * 100) / 100
    var seconds = (timeDifference / 1000) % 60;
    seconds = Math.round(seconds * 100) / 100
    var minutes = (timeDifference-30000)/1000 / 60
    minutes = Math.round(minutes)
    var timeHtml = `Time: ${minutes}:${seconds}`
    //console.log(timeHtml)
    var timeValueDOM = document.getElementById("timeValuechallenge")
    timeValueDOM.innerHTML = timeHtml;
  }
}
function initialise() {
  console.log("initialised")
  theLoop()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const altitudeList = []
const speedList = []
async function averageLoops() {
  while (x === true) {
    var alt = geofs.relativeAltitude;
    var speed = geofs.animation.values.kias
    altitudeList.push(alt)
    speedList.push(speed)
    var averageAlt = "Your average altitude is: " + Math.round(getAltMedian())
    var averageSpd = "Your average speed is: " + Math.round(getSpdMedian())
    var speedValueDOM = document.getElementById("speedValue")
    speedValueDOM.innerHTML = averageSpd;
    var altValueDOM = document.getElementById("altValuechallenge")
    altValueDOM.innerHTML = averageAlt;
    await sleep(100);
  }
}

function getAltMedian() {
  var average = altitudeList.reduce((a, b) => a + b, 0) / altitudeList.length;
  return average
}
function getSpdMedian() {
  var average = speedList.reduce((a, b) => a + b, 0) / speedList.length;
  return average
}


var endTime
const time = []
var timeExist = false
async function start() {
  var startTime = performance.now()
  //console.log(startTime)
  time.push(startTime)
  timeExist = true

}

async function end() {
  endTime = performance.now();

  var timeDiff = endTime - time[0]; //in ms

  // strip the ms
  timeDiff /= 1000;

  var averageAlt = await getAltMedian()
  //console.log(`Average alt is ${averageAlt}`)
  var averageSpd = await getSpdMedian()
  //console.log(`Average speed is ${averageSpd}`)
    var score = 10000 * ((averageAlt / 2) ** -1) * ((timeDiff/3) ** -1) * averageSpd
  // get seconds
  //console.log("Parkour finished, you took " + Math.round(timeDiff* 100) / 100 + " seconds");
  var fScore = Math.round(score)
  var finalScore = `Your score is: ${fScore}`
  var scoreHTML = document.getElementById("score")
  scoreHTML.innerHTML = finalScore;
  //var score =
}
//let startInput = "q";
//document.addEventListener("keypress", function onEvent(event) {
//
//    if (event.key === startInput) {
//        if (x === false) { initialise() }
//        else { console.log("already started") }
//    }
//})

async function reload() {
  x = false
  console.log("reloaded")
  altitudeList.length = 0
  speedList.length = 0
  endTime = 0
  time.length = 0
  timeExist = false
  parkour.length = 0
}

//let reloadInput = "l";
//document.addEventListener("keypress", function onEvent(event) {
//
//    if (event.key === reloadInput) { reload() }
//})
function diff(num1, num2) {
  //  if (num1 > num2) {
  return num1 - num2
  // } else {
  //       return num2 - num1
  // }
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

// testing here...
async function spawnHTML() {
  geofs.animation.values.navHDG = 0
  var dataHTML = await createList()
  let customBuildings = document.createElement("div");
  customBuildings.innerHTML = '<ul class="geofs-list geofs-toggle-panel geofs-challenges-list geofs-preferences" data-noblur="true" data-onshow="{geofs.initializePreferencesPanel()}" data-onhide="{geofs.savePreferencesPanel()}"> <style>#MainDIV{position: absolute; left: 0px; top: 0px; background-color: white; text-align: left; padding: 0px 0px 0px 10px; margin-top: 2px; margin-bottom: 2px;}#DIVtitle{color: black; font-family: Helvetica, Arial, sans-serif; font-size: 20px;}{color: black; font-family: Helvetica, Arial, sans-serif;}</style> <div id="MainDIV"> <p id="DIVtitle">Geo-FS challenges page</p></p><p>Challenge JSON: <input type="text" placeholder="Enter the JSON here" id=parkour size=“25” value=> </p><button class=mdl-button mdl-js-button mdl-button—raised mdl-button—colored onclick=initialiseFunction() data-upgraded=,MaterialButton>Load JSON</button> <p id="jsonStatus" style="display: inline-block"></p><p id="description"></p></p><button class=mdl-button mdl-js-button mdl-button—raised mdl-button—colored onclick=secondInitialise() data-upgraded=,MaterialButton>Start challenge</button> <button class=mdl-button mdl-js-button mdl-button—raised mdl-button—colored onclick=reloadChallenge() data-upgraded=,MaterialButton>Reload Challenge</button> <p id="startValue" style="display: inline-block"></p></ul>';
  let sidePanel = document.getElementsByClassName("geofs-ui-left")[0];
  document.getElementsByClassName("geofs-ui-left")[0].appendChild(customBuildings);

  //document.getElementsByClassName("geofs-challenges-list")[0].appendChild('<div>Test</div>');


  // Toggle Button Code
  let buttonDiv = document.createElement("div");
  buttonDiv.innerHTML = '<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" data-toggle-panel=".geofs-challenges-list" data-tooltip-classname="mdl-tooltip--top" id="landButton" tabindex="0" data-upgraded=",MaterialButton">Geo-FS Challenges</button>';
  document.body.appendChild(buttonDiv);
  document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(buttonDiv);
  let element = document.getElementById("landButton");
  document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, buttonDiv);
}

window.initialiseFunction = async () => {
  parkour.length = 0
  var challengeName = document.getElementById("parkour").value
  if (challengeName === '') {
    var status = "Please select a challenge!"
    var parkourStatus = document.getElementById("jsonStatus")
    parkourStatus.innerHTML = status;
  }
  else { approveJSON(challengeName) }
}
window.secondInitialise = () => {
  if (parkour.length === 0) {
    var status = "Please insert a JSON!"
    var startStatus = document.getElementById("startValue")
    startStatus.innerHTML = status;
  }
  else {
    var status = ""
    var startStatus = document.getElementById("startValue")
    startStatus.innerHTML = status;
    geofs.flyTo(parkour[0].spawn)
    initialise()
    createMapParkour()
    createOverlay()
    ui.panel.toggle(".geofs-map-list");
    geofs.preferences.crashDetection = true

  }

}

window.reloadChallenge = async () => {
  reload()
  var status = "Challenge reloaded"
  var startStatus = document.getElementById("startValue")
  startStatus.innerHTML = status;
  await sleep(3000)
  var status = ""
  var startStatus = document.getElementById("startValue")
  startStatus.innerHTML = status;
  var timeValue = document.getElementById("timeValuechallenge")
  timeValue.innerHTML = status;
  var waypointStatus = document.getElementById("waypointNumber")
  waypointStatus.innerHTML = status;
  var speedStatus = document.getElementById("speedValue")
  speedStatus.innerHTML = status;
  var altStatus = document.getElementById("altValuechallenge")
  altStatus.innerHTML = status;
  var scoreStatus = document.getElementById("score")
  scoreStatus.innerHTML = status;
  var descStatus = document.getElementById("description")
  descStatus.innerHTML = status;

}

async function createOverlay() {
  var overlayHTML = document.getElementsByClassName("cesium-credit-lightbox-overlay")
  overlayHTML[0].insertAdjacentHTML('afterend', '<div class="cesium-performanceDisplay-defaultContainer"><div class="cesium-performanceDisplay"><div class="cesium-performanceDisplay-ms" id="timeValuechallenge"></div><div class="cesium-performanceDisplay-fps" id="waypointNumber"></div><div class="cesium-performanceDisplay-fps" id="speedValue"></div><div class="cesium-performanceDisplay-fps" id="altValuechallenge"></div><div class="cesium-performanceDisplay-fps" id="score"></div></div></div>');

}

async function createMapParkour() {
  var mapPark = []
  parkour[1].forEach(function (item, index) {
    mapPark.push([parkour[1][index].lat.reduce((a, b) => a + b, 0) / parkour[1][index].lat.length, parkour[1][index].lon.reduce((a, b) => a + b, 0) / parkour[1][index].lon.length]);
  });
  geofs.api.map.setPathPoints(mapPark)
  geofs.api.map.stopCreatePath()
}

async function editJSONHTML() {
  var status = "JSON validated!"
  var parkourStatus = document.getElementById("jsonStatus")
  parkourStatus.innerHTML = status;
  console.log(parkour)
  await sleep(3000)
  var status = ""
  var parkourStatus = document.getElementById("jsonStatus")
  parkourStatus.innerHTML = status;
}

async function createList() {
  var listData = await getList()
  var listHTML = '<label for="parkourSelect">Choose your challenge from the list:</label><select name="parkourSelect" id="parkourSelect">'
  var arrayLength = listData.length;
  for (var i = 0; i < arrayLength; i++) {
    listHTML += `<option value=${listData[i]}>${listData[i]}</option>`
  }
  listHTML += '  </select>'
  return listHTML
}

async function getList() {
  var listData = ['Paris River Following', 'Alps']
  return listData
}

async function approveJSON(challengeName) {
  try { inputJson = JSON.parse(document.getElementById("parkour").value) }
  catch (err) { console.log(err) }
  inputJson.forEach(function (item, index) {
    parkour.push(inputJson[index]);
    editJSONHTML()
  });
  var desc = parkour[0].description
  var parkourStatus = document.getElementById("description")
  parkourStatus.innerHTML = desc;
}
async function getParkour(challengeName) {
  var data = [{ "waypoints": 2, "spawn": [48.878679, 2.110172, 100, 0], "description": "A short route following the Seine in Paris" }, [{ "lat": [48.897721, 48.897774, 48.897981, 48.898023], "lon": [2.107237, 2.107273, 2.109939, 2.109996], "alt": [30, 50] }, { "lat": [48.917547, 48.917555, 48.917743, 48.917744], "lon": [2.118798, 2.118798, 2.121086, 2.121086], "alt": [30, 50] }, { "lat": [48.944206, 48.944472, 48.94505, 48.945322], "lon": [2.157384, 2.157735, 2.159169, 2.159477], "alt": [30, 50] }]]
  return data
}

//external function

function orientation3(a, b, c) {
  var l = (a[1] - c[1]) * (b[0] - c[0])
  var r = (a[0] - c[0]) * (b[1] - c[1])
  var det = l - r
  var s
  if (l > 0) {
    if (r <= 0) {
      return det
    } else {
      s = l + r
    }
  } else if (l < 0) {
    if (r >= 0) {
      return det
    } else {
      s = -(l + r)
    }
  } else {
    return det
  }
  var tol = ERRBOUND3 * s
  if (det >= tol || det <= -tol) {
    return det
  }
}
function classifyPoint(vs, point) {
  var x = point[0]
  var y = point[1]
  var n = vs.length
  var inside = 1
  var lim = n
  for (var i = 0, j = n - 1; i < lim; j = i++) {
    var a = vs[i]
    var b = vs[j]
    var yi = a[1]
    var yj = b[1]
    if (yj < yi) {
      if (yj < y && y < yi) {
        var s = orientation3(a, b, point)
        if (s === 0) {
          return 0
        } else {
          inside ^= (0 < s) | 0
        }
      } else if (y === yi) {
        var c = vs[(i + 1) % n]
        var yk = c[1]
        if (yi < yk) {
          var s = orientation3(a, b, point)
          if (s === 0) {
            return 0
          } else {
            inside ^= (0 < s) | 0
          }
        }
      }
    } else if (yi < yj) {
      if (yi < y && y < yj) {
        var s = orientation3(a, b, point)
        if (s === 0) {
          return 0
        } else {
          inside ^= (s < 0) | 0
        }
      } else if (y === yi) {
        var c = vs[(i + 1) % n]
        var yk = c[1]
        if (yk < yi) {
          var s = orientation3(a, b, point)
          if (s === 0) {
            return 0
          } else {
            inside ^= (s < 0) | 0
          }
        }
      }
    } else if (y === yi) {
      var x0 = Math.min(a[0], b[0])
      var x1 = Math.max(a[0], b[0])
      if (i === 0) {
        while (j > 0) {
          var k = (j + n - 1) % n
          var p = vs[k]
          if (p[1] !== y) {
            break
          }
          var px = p[0]
          x0 = Math.min(x0, px)
          x1 = Math.max(x1, px)
          j = k
        }
        if (j === 0) {
          if (x0 <= x && x <= x1) {
            return 0
          }
          return 1
        }
        lim = j + 1
      }
      var y0 = vs[(j + n - 1) % n][1]
      while (i + 1 < lim) {
        var p = vs[i + 1]
        if (p[1] !== y) {
          break
        }
        var px = p[0]
        x0 = Math.min(x0, px)
        x1 = Math.max(x1, px)
        i += 1
      }
      if (x0 <= x && x <= x1) {
        return 0
      }
      var y1 = vs[(i + 1) % n][1]
      if (x < x0 && (y0 < y !== y1 < y)) {
        inside ^= 1
      }
    }
  }
  return 2 * inside - 1
}
