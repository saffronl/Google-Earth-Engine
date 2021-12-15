
var roi = ee.Geometry.Point(-73.9888429074526, 40.67764992313791);

var collection = ee.ImageCollection("ESA/WorldCover/v100")
.filterBounds(roi)
.filterDate('2020-01-01', '2021-01-01')
.first();

var visualization = {
  bands: ['Map'],
};

Map.centerObject(roi,12);
Map.addLayer(collection, visualization, "Landcover");



// Make a Legend

// set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 
//  Palette with the colors
var palette = [
'006400', // trees
'ffbb22', // shrubland
'ffff4c', // grassland
'f096ff', // cropland
'fa0000', // built-up
'b4b4b4', // Barren/Sparse Vegetation
'f0f0f0', // Snow and Ice
'0064c8', // Open Water
'0096a0', // Herbaceous Wetland
'00cf75', // Mangroves
'fae6a0', // Moss and Lichen
];

// name of the legend
var names = ['Trees','Shrubland','Grassland','Cropland','Built-Up','Barren/Sparse Vegetations','Snow and Ice','Open Water',
'Herbaceous Wetland','Mangroves','Moss and Lichen'];

// Add color and and names
for (var i = 0; i < 11; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }
// add legend to map (alternatively you can also print the legend to the console)
Map.add(legend);

