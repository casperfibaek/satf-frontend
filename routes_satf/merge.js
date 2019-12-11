const express = require('express');

const router = express.Router();

const endpointSatf = require('./satf');
const cache = require('./cache');

router.route('/').get((req, res) => res.send('api.marl.io/satf/'));

// // GET
router.route('/population_density').get(cache, endpointSatf.population_density);
router.route('/population_density_walk').get(cache, endpointSatf.population_density_walk);
router.route('/population_density_bike').get(cache, endpointSatf.population_density_bike);
router.route('/population_density_car').get(cache, endpointSatf.population_density_car);
router.route('/population_density_buffer').get(cache, endpointSatf.population_density_buffer);
router.route('/urban_status').get(cache, endpointSatf.urban_status);
router.route('/urban_status_simple').get(cache, endpointSatf.urban_status_simple);
router.route('/admin_level_1').get(cache, endpointSatf.admin_level_1);
router.route('/admin_level_2').get(cache, endpointSatf.admin_level_2);
router.route('/admin_level_2_fuzzy_tri').get(cache, endpointSatf.admin_level_2_fuzzy_tri);
router.route('/admin_level_2_fuzzy_lev').get(cache, endpointSatf.admin_level_2_fuzzy_lev);
router.route('/nearest_placename').get(cache, endpointSatf.nearest_placename);
router.route('/nearest_poi').get(cache, endpointSatf.nearest_poi);
router.route('/nearest_bank').get(cache, endpointSatf.nearest_bank);
router.route('/nearest_bank_distance').get(cache, endpointSatf.nearest_bank_distance);
router.route('/whatfreewords_to_latlng').get(cache, endpointSatf.whatFreeWordsToLatLng);
router.route('/latlng_to_whatfreewords').get(cache, endpointSatf.latLngToWhatFreeWords);
router.route('/latlng_to_pluscode').get(cache, endpointSatf.latLngToPluscode);
router.route('/pluscode_to_latlng').get(cache, endpointSatf.pluscodeToLatLng);

module.exports = router;
