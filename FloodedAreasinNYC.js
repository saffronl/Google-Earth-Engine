var pt = /* color: #d63000 */ee.Geometry.Point([-73.9888429074526, 40.67764992313791]),
    geometry1 = /* color: #ffc82d */ee.Geometry.MultiPoint(),
    table = ee.FeatureCollection("users/saffron/buroughboundary"),
    neighborhoods = ee.FeatureCollection("users/saffron/NYCNeighborhoods"),
    UtilityPolygon = /* color: #d63000 */ee.Geometry.MultiPoint(),
    SlopeDataset = ee.Image("CGIAR/SRTM90_V4"),
    Precipitation = ee.ImageCollection("NASA/GPM_L3/IMERG_V06");

Map.centerObject(pt,10);

//////////////////////////////////////////////////////////////////////////
//////////////////////////// Calculating Precipitation
//Filter the date
var rain = Precipitation.filterDate('2019-07-23','2019-07-24').select('IRprecipitation');
//print('rain', rain);
//Take the image collection of all images that day and make a mean precipitation map for that day
var dailymeanprecip= ee.Image(rain.mean());
//print('dailymeanprecip', dailymeanprecip);
var vizParams = {
  min: 0,
  max: 0.2
};
//Black is low rain, white is high rain
Map.addLayer (dailymeanprecip.clip(table), vizParams, '7/23/19_rain');
//approximating scale to be 10km, 10,000m; it is actually .1 degrees
var totalprecip = dailymeanprecip.reduceRegion({reducer: ee.Reducer.sum(),
   geometry: table,
   scale: 10000});
   //the boro is smaller than 1 precipitation pixel so this is not really an average, but nonetheless...
print('Total Rainfall in NYC:', totalprecip);

//////////////////////////////////////////////////////////////////////////
////////////////////////////Choose the Before and After Images

// Sentinel Images - Filter for VV polarization
var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
.filterBounds(pt)
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.select('VV');

// Temporally Filter the Images
var before = collection.filterDate('2019-07-10', '2019-07-20').mosaic();
var before_clipped = before.clip(table);
var after = collection.filterDate('2019-07-20', '2019-07-30').mosaic();
var after_clipped = after.clip(table);
print("before image: ", collection.filterDate('2019-07-10', '2019-07-20'));
print("after image:", collection.filterDate('2019-07-20', '2019-07-30'));

Map.centerObject(pt, 10);

//////////////////////////////////////////////////////////////////////////
////////////////////////////Detecting Inundation
//Include the terrain of the area to remove false positives
var SlopeImage = ee.Terrain.slope(SlopeDataset);

// Threshold smoothed radar intensities to identify "flooded" areas.
var SMOOTHING_RADIUS = 100;
// Threshold is determined after a series of calculations
var DIFF_UPPER_THRESHOLD = -4.83;

// Apply the smoothing kernel and subtract the two images
var Smoothed_DifferenceImage = after.focal_median(SMOOTHING_RADIUS, 'circle', 'meters')
.subtract(before.focal_median(SMOOTHING_RADIUS, 'circle', 'meters'))
.mask(SlopeImage.lt(3)); //choosing the pixels with a slope less than 3 degrees to exclude false brightness

//only choose pixels less than the threshold value, aka the water values
var Thresholded_DifferenceImage = Smoothed_DifferenceImage.lt(DIFF_UPPER_THRESHOLD);
//clips it to the outline of NYC
var Thresholded_DifferenceImage_clipped = Thresholded_DifferenceImage.clip(table)

// Display map
Map.centerObject(pt, 10);
Map.addLayer(before_clipped, {min:-30,max:0}, 'Before flood');
Map.addLayer(after_clipped, {min:-30,max:0}, 'After flood');
Map.addLayer(Smoothed_DifferenceImage.clip(table), {min:-10,max:10}, 'diff smoothed', 0);
//Display the flooded areas in blue
var flooded = Thresholded_DifferenceImage_clipped.updateMask(Thresholded_DifferenceImage_clipped);
Map.addLayer(flooded,{palette:"0000FF"},'Detected Floods',1);

//////////////////////////////////////////////////////////////////////////
////////////////////////////Calculating Inundation

// Calculate flood extent area
// Create a raster layer containing the area information of each pixel 
var flood_pixelarea = flooded.select('VV')
  .multiply(ee.Image.pixelArea());
//print("flood pixel area",flood_pixelarea)

// Sum the areas of flooded pixels
// default is set to 'bestEffort: true' in order to reduce compuation time, for a more 
// accurate result set bestEffort to false and increase 'maxPixels'. 
var flood_stats = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: table,
  scale: 10, // native resolution 
  maxPixels: 1e9,
  bestEffort: false
  });
//print("flood_stats",flood_stats)

// Calculating the Area of Each Borough
var Bronx = table.filterMetadata('boro_name', 'contains', 'Bronx');
print("Bronx Area",Bronx.geometry().area());
var Brooklyn = table.filterMetadata('boro_name', 'contains', 'Brooklyn');
print("Brooklyn Area",Brooklyn.geometry().area());
var Queens = table.filterMetadata('boro_name', 'contains', 'Queens');
print("Queens Area",Queens.geometry().area());
var Manhattan = table.filterMetadata('boro_name', 'contains', 'Manhattan');
print("Manhattan Area",Manhattan.geometry().area());
var StatenIsland = table.filterMetadata('boro_name', 'contains', 'Staten Island');
print("Staten Island Area",StatenIsland.geometry().area());

// This function computes the feature's geometry area and adds it as a property.
var addArea = function(feature) {
  return feature.set({area: feature.geometry().area()});
};

// This function computes the feature's geometry area for specifically flooded areas and adds it as a property.
var addFloodArea = function(feature2) {
  var flood_pixelarea = flooded.select('VV')
  .multiply(ee.Image.pixelArea());
  var floodedArea = flood_pixelarea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: feature2.geometry(),
    scale: 10, // native resolution 
    maxPixels: 1e9,
    bestEffort: false
  })
  return feature2.set({floodedArea: floodedArea});
};

// Map the area getting function over the FeatureCollection of all NYC Neighborhoods.
var areaAdded = neighborhoods.map(addArea);
var areaFloodAdded = neighborhoods.map(addFloodArea);

//Export the two new tables as a csv file
//Export.table.toDrive(areaAdded)
//Export.table.toDrive(areaFloodAdded)

//Displays all of the neighborhoods
Map.addLayer(neighborhoods,  {color: 'black'}, 'NYC Neighborhoods');
//Displays the most flooded neighborhood
var stuyvesant = neighborhoods.filterMetadata('ntacode', 'contains', 'BK33');
Map.addLayer(stuyvesant, {color: '#C64444'}, 'Carroll Gardens');


/*
// Export the Flooded Map as a raster file.
Export.image.toDrive({
  image: flooded,
  description: 'flooded',
  folder: '',
  region: table,
  scale: 10,
  crs: 'EPSG:3857',
  maxPixels:10e10,
});
*/
