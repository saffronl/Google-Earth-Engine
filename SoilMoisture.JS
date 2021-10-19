var soilCollection = ee.ImageCollection("NASA/GLDAS/V021/NOAH/G025/T3H")
var geometry = [-97.95,40.65]


var sorted =  ee.Image(soilCollection.filterDate('2019-09-30','2019-10-31')
                                      .filterBounds(geometry)
                                      .first());
var soilMoist10 = sorted.select('SoilMoi0_10cm_inst');
print('soilMoist10: ',soilMoist10);
print('Inspect the pixels:', soilMoist10.projection().nominalScale());

//['red','green','blue']
var visParams = {min: 0, max: 100, palette: ['FF3B28','48EB12','00A7FA']};
//Map.addLayer(soilMoist10,visParams,'Soil Moisture 0-10');

var soilMoist40 = sorted.select('SoilMoi40_100cm_inst');
print('soilMoist10: ',soilMoist40);
print('Inspect the pixels:', soilMoist40.projection().nominalScale());

Map.centerObject(geometry, 4);
//Map.addLayer(soilMoist40,visParams,'Soil Moisture 40-100');

var sorted_Oct2000 =  ee.Image(soilCollection.filterDate('2000-09-30','2000-10-31')
                                      .filterBounds(geometry)
                                      .first());
var soilMoist10_Oct2000 = sorted_Oct2000.select('SoilMoi0_10cm_inst');
print('soilMoist10_Oct2000: ',soilMoist10_Oct2000);
print('Inspect the pixels:', soilMoist10_Oct2000.projection().nominalScale());

Map.addLayer(soilMoist10_Oct2000,visParams,'Soil Moisture 0-10 for Oct 2000');

var visParams2 = {min: -200, max: 0, palette: ['FF3B28','48EB12','00A7FA']};
var difference_topbottom2019 = soilMoist10.subtract(soilMoist40)
Map.addLayer(difference_topbottom2019,visParams2,'Difference in Oct 2019')

var visParams3 = {min: -10, max: 20, palette: ['FF3B28','48EB12','00A7FA']};
var difference_2000_2019 = soilMoist10.subtract(soilMoist10_Oct2000)
Map.addLayer(difference_2000_2019,visParams3,'Difference between Oct 2000 to 2019]')

var difference_2000_2019 = difference_2000_2019.clip(geometry2);
var difference_2000_2019Values = difference_2000_2019.reduceRegion({
reducer: ee.Reducer.toList(1),
geometry: geometry2
}).values().get(0);
var difference_2000_2019Values = ee.List(difference_2000_2019Values); // Cast valuesList
print('difference_2000_2019Values', difference_2000_2019Values);
var myFeatures = ee.FeatureCollection(difference_2000_2019Values.map(function(el){
el = ee.List(el); // cast every element of the list
return ee.Feature(geometry2,{'diff':ee.Number(el.get(0))});
}));
Export.table.toDrive({
collection: myFeatures,
description:'differenceMap_2000_2019LasVegas',
fileFormat: 'csv'
});

//var reducers = ;
var stats = difference_2000_2019.reduceRegion(ee.Reducer.mean());
print(stats)
