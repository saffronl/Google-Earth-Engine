// Get a single NAIP image over the area of interest.
var image = ee.Image(naip
   .filterBounds(point)
   .sort('system:time_start', false)
   .first());
// Print the image to the console.
print('Inspect the image object:', image);
// Display the image with the default visualization.
Map.centerObject(point, 18);
Map.addLayer(image, {}, 'Original image');


// Display the projection of band 0.
print('Inspect the projection of band 0:', image.select(0).projection());

/*
// Display gamma stretches of the input image.
Map.addLayer(image.visualize({gamma: 0.5}), {}, 'gamma = 0.5');
Map.addLayer(image.visualize({gamma: 1.5}), {}, 'gamma = 1.5');
*/

// Print a uniform kernel to see its weights.
print('A uniform kernel:', ee.Kernel.square(2));
print('Inspect the pixels:', image.projection().nominalScale());

// Define a square, uniform kernel.
var uniformKernel = ee.Kernel.square({
 radius: 2,
 units: 'meters',
});
// Filter the image by convolving with the smoothing filter.
var smoothed = image.convolve(uniformKernel);
Map.addLayer(smoothed, {min: 0, max: 255}, 'smoothed image');

// Print a Gaussian kernel to see its weights.
print('A Gaussian kernel:', ee.Kernel.gaussian(2));

// Define a square Gaussian kernel:
var gaussianKernel = ee.Kernel.gaussian({
 radius: 2,
 units: 'meters',
});
// Filter the image by convolving with the Gaussian filter.
var gaussian = image.convolve(gaussianKernel);
//Map.addLayer(gaussian, {min: 0, max: 255}, 'Gaussian smoothed image');

// Define a Laplacian filter.
var laplacianKernel = ee.Kernel.laplacian8();
// Print the kernel to see its weights.
print(laplacianKernel);
// Filter the image by convolving with the Laplacian filter.
var edges = image.convolve(laplacianKernel)
                .reproject('EPSG:26912', null, 1); //MAKE SURE THE EPSG is correct for your image!
//Map.addLayer(edges, {min: 0, max: 255}, 'Laplacian filtered image');

// Define a big neighborhood with a 7-meter radius kernel.
var bigKernel = ee.Kernel.square({
 radius: 7,
 units: 'meters'
});
// Compute SD in a neighborhood.
var sd = image.reduceNeighborhood({
 reducer: ee.Reducer.stdDev(),
 kernel: bigKernel
});
Map.addLayer(sd, {min: 0, max: 70}, 'SD');
