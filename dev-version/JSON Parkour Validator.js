const park = //insert your JSON here


const R = 6.378
var EPSILON = 1.1102230246251565e-16
var ERRBOUND3 = (3.0 + 16.0 * EPSILON) * EPSILON
var arrayLength = park[1].length;
for (var i = 0; i < arrayLength; i++) {
  var averageX = (park[1][i].lat[0] + park[1][i].lat[1] + park[1][i].lat[2] + park[1][i].lat[3]) / 4
  var averageY = (park[1][i].lon[0] + park[1][i].lon[1] + park[1][i].lon[2] + park[1][i].lon[3]) / 4
  //console.log(averageX, averageY)
  var res = checkif(park[1][i].lat, park[1][i].lon, averageX, averageY)
  if (res === -1) {
    console.log(i + " is a cube!")
  }
  else {
    console.log(i + " is not a cube!")
    // park[1][i].lat[2], park[1][i].lat[3] = park[1][i].lat[3], park[1][i].lat[2]
    // park[1][i].lon[2], park[1][i].lon[3] = park[1][i].lon[3], park[1][i].lon[2]
    var tmp = park[1][i].lat[2]
    park[1][i].lat[2] = park[1][i].lat[3]
    park[1][i].lat[3] = tmp
    var tmp = park[1][i].lon[2]
    park[1][i].lon[2] = park[1][i].lon[3]
    park[1][i].lon[3] = tmp
    res = checkif(park[1][i].lat, park[1][i].lon, averageX, averageY)
    console.log("Tried to fix, " + res)
  }

}
park[0].waypoints = arrayLength - 1
console.log(JSON.stringify(park))



function checkif(vertx, verty, testx, testy) {
  var polygon = []
  var arrayLength = vertx.length;
  for (var i = 0; i < arrayLength; i++) {
    polygon.push([convertX(vertx[i], verty[i]), convertY(vertx[i], verty[i])])
  }
  var test = []
  test.push(convertX(testx, testy), convertY(testx, testy))
  var res = classifyPoint(polygon, test)
  return res
}

function convertX(x, y) {
  //return  x*Math.cos(y) 
  return R * Math.cos(x) * Math.cos(y)
}
function convertY(x, y) {
  return R * Math.cos(x) * Math.sin(y)
}



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

