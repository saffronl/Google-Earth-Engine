var pt = /* color: #d63000 */ee.Geometry.Point([-73.9888429074526, 40.67764992313791]),
    table = ee.FeatureCollection("users/saffron/buroughboundary"),
    neighborhoods = ee.FeatureCollection("users/saffron/NYCNeighborhoods"),
    Polygon_Islands = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-73.90764707615376, 40.66787657689762],
          [-73.90764707615376, 40.57197676278344],
          [-73.7588166623354, 40.57197676278344],
          [-73.7588166623354, 40.66787657689762]]], null, false),
    Polygon_KnownFlooding = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-74.00886489304405, 40.68909048335531],
          [-74.00886489304405, 40.665136059591404],
          [-73.97041274460655, 40.665136059591404],
          [-73.97041274460655, 40.68909048335531]]], null, false),
    Polygon_HalfWater = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-74.12422133835655, 40.58800691818087],
          [-74.12422133835655, 40.541060515277074],
          [-74.05967666062217, 40.541060515277074],
          [-74.05967666062217, 40.58800691818087]]], null, false),
    Polygon_CentralPark = /* color: #ffc82d */ee.Geometry.Polygon(
        [[[-73.98114102098369, 40.768376781178425],
          [-73.97307293626689, 40.76525649907466],
          [-73.95058529588603, 40.79632277310579],
          [-73.95831005784892, 40.799441596133455]]]),
    Polygon_HudsonRiver = /* color: #00ffff */ee.Geometry.Polygon(
        [[[-74.00063509514926, 40.78371591803944],
          [-73.97711688827276, 40.773966553157706],
          [-73.96372696005008, 40.79268407008775],
          [-73.98758849870325, 40.80347024261891]]]),
    Polygon_Channel = 
    /* color: #bf04c2 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-73.93763482828722, 40.72936272542491],
          [-73.93763482828722, 40.71310011370911],
          [-73.9149755265294, 40.71310011370911],
          [-73.9149755265294, 40.72936272542491]]], null, false),
    Polygon_Bay = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-74.10054721592596, 40.704679507737],
          [-74.10054721592596, 40.66458640984481],
          [-74.04561557530096, 40.66458640984481],
          [-74.04561557530096, 40.704679507737]]], null, false),
    Polygon_Land = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-73.8909410010312, 40.757232584913325],
          [-73.8909410010312, 40.719773252948706],
          [-73.81678328618744, 40.719773252948706],
          [-73.81678328618744, 40.757232584913325]]], null, false);


// Slope Satellite
var SlopeDataset = ee.Image("CGIAR/SRTM90_V4");
// Flooding Satellite from Sentinel
var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
.filterBounds(pt)
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.select('VV');

var before = collection.filterDate('2019-07-10', '2019-07-20').mosaic();
var after = collection.filterDate('2019-07-20', '2019-07-30').mosaic();
print("before image: ", collection.filterDate('2019-07-10', '2019-07-20'));
print("after image:", collection.filterDate('2019-07-20', '2019-07-30'));

Map.centerObject(pt, 10);

//////////////////////////////////////////////////////////////////////////
////////////////////////////Caclulating the Threshold

// Subtract Before and After
var Reference_DifferenceImage = after.subtract(before);

/////////////// 1
var options = {
  title: 'Reference Histogram - Islands',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_Islands, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
/////////////// 2
var options = {
  title: 'Reference Histogram - Known Flooding',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_KnownFlooding, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
/////////////// 3
var options = {
  title: 'Reference Histogram - Half Water, Half Land',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_HalfWater, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
/////////////// 4
var options = {
  title: 'Reference Histogram - Central Park',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_CentralPark, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
/////////////// 5
var options = {
  title: 'Reference Histogram - Hudson River',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_HudsonRiver, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
/////////////// 6
var options = {
  title: 'Reference Histogram - Channel',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_Channel, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
/////////////// 7
var options = {
  title: 'Reference Histogram - Bay',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_Bay, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
/////////////// 8
var options = {
  title: 'Reference Histogram - Land',
  fontSize: 20,
  hAxis: {title: 'Pixel Difference'},
  vAxis: {title: 'count'},
  series: {
    1: {color: 'blue'}}
};
var hist = ui.Chart.image.histogram(Reference_DifferenceImage, Polygon_Land, 10)
    .setSeriesNames(['VV'])
    .setOptions(options);
print(hist);
