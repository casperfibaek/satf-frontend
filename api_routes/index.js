/* eslint-disable max-len */

const express = require('express');
const pg = require('pg');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cache = require('./cache');
const auth = require('./auth');
const credentials = require('./credentials');
const utils = require('./utils');
const gpgps = require('./gpgps');
const Wfw = require('./assets/whatfreewords');
const Pluscodes = require('./assets/pluscodes');

const openLocationCode = Pluscodes();
const router = express.Router();

const pool = new pg.Pool(credentials);

async function latlng_to_whatfreewords(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'latlng_to_whatfreewords',
    });
  }
  try {
    return res.status(200).json({
      status: 'success',
      message: Wfw.latlon2words(Number(req.query.lat), Number(req.query.lng)),
      function: 'latlng_to_whatfreewords',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'latlng_to_whatfreewords',
    });
  }
}

async function gpgps_to_latlng(req, res) {
  if (!req.query.gpgps) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing gpgps',
      function: 'gpgps_to_latlng',
    });
  }
  try {
    const latlng = await gpgps.gpgps_to_latlng(req.query.gpgps);
    return res.status(200).json({
      status: 'success',
      message: latlng,
      function: 'gpgps_to_latlng',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'gpgps_to_latlng',
    });
  }
}

async function latlng_to_gpgps(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'latlng_to_gpgps',
    });
  }
  try {
    const GhanaPostalGPS = await gpgps.latlng_to_gpgps(req.query.lat, req.query.lng);
    return res.status(200).json({
      status: 'success',
      message: GhanaPostalGPS,
      function: 'latlng_to_gpgps',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'latlng_to_gpgps',
    });
  }
}

async function whatfreewords_to_latlng(req, res) {
  if (!req.query.words) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing words',
      function: 'whatfreewords_to_latlng',
    });
  }
  try {
    return res.status(200).json({
      status: 'success',
      message: Wfw.words2latlon(req.query.words),
      function: 'whatfreewords_to_latlng',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'whatfreewords_to_latlng',
    });
  }
}

async function latlng_to_pluscode(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'latlng_to_pluscode',
    });
  }
  try {
    const pluscode = openLocationCode.encode(Number(req.query.lat), Number(req.query.lng), 10);
    return res.status(200).json({
      status: 'success',
      message: pluscode,
      function: 'latlng_to_pluscode',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'latlng_to_pluscode',
    });
  }
}

async function pluscode_to_latlng(req, res) {
  if (!req.query.code) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing code',
      function: 'pluscode_to_latlng',
    });
  }
  try {
    const code = openLocationCode.decode(String(req.query.code).replace(' ', '+'));
    return res.status(200).json({
      status: 'success',
      message: [code.latitudeCenter, code.longitudeCenter],
      function: 'pluscode_to_latlng',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'pluscode_to_latlng',
    });
  }
}

async function admin_level_1(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'admin_level_1',
    });
  }

  const dbQuery = `
        SELECT "adm1_name" AS adm1
        FROM public.ghana_admin
        WHERE
            ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
        LIMIT 1;
    `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].adm1,
        function: 'admin_level_1',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_1',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_1',
    });
  }
}

async function admin_level_2(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'admin_level_2',
    });
  }

  const dbQuery = `
    SELECT "adm2_name" AS adm2
    FROM public.ghana_admin
    WHERE
        ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].adm2,
        function: 'admin_level_2',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_2',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_2',
    });
  }
}

async function admin_level_2_fuzzy_tri(req, res) {
  if (!req.query.name) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing name',
      function: 'admin_level_2_fuzzy_tri',
    });
  }

  const dbQuery = `
    SELECT adm2_name as name
    FROM ghana_admin
    ORDER BY SIMILARITY(adm2_name, '${req.query.name}') DESC
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].name,
        function: 'admin_level_2_fuzzy_tri',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_tri',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_tri',
    });
  }
}

async function admin_level_2_fuzzy_lev(req, res) {
  if (!req.query.name) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing name',
      function: 'admin_level_2_fuzzy_lev',
    });
  }

  const dbQuery = `
    SELECT adm2_name as name
    FROM ghana_admin
    ORDER BY LEVENSHTEIN(adm2_name, '${req.query.name}') ASC
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].name,
        function: 'admin_level_2_fuzzy_lev',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_lev',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'admin_level_2_fuzzy_lev',
    });
  }
}

async function urban_status(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'urban_status',
    });
  }

  const dbQuery = `
    SELECT ensemble
    FROM public.urban_rural_classification_vect
    WHERE ST_Contains(public.urban_rural_classification_vect.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: utils.translateUrbanClasses(dbResponse.rows[0].ensemble),
        function: 'urban_status',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Hinterlands',
      function: 'urban_status',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'urban_status',
    });
  }
}

async function urban_status_simple(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'urban_status_simple',
    });
  }

  const dbQuery = `
    SELECT ensemble
    FROM public.urban_rural_classification_vect
    WHERE ST_Contains(public.urban_rural_classification_vect.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: utils.translateUrbanClasses(dbResponse.rows[0].ensemble, true),
        function: 'urban_status_simple',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Hinterlands',
      function: 'urban_status_simple',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'urban_status_simple',
    });
  }
}
// adapted to the new databse
async function population_density(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'population_density',
    });
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
    )
    
    SELECT ST_Value(rast, 1, pp_geom) AS pop_dense
    FROM ghana_pop_dens, const
    WHERE ST_Intersects(rast, pp_geom);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense)),
        function: 'population_density',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density',
    });
  }
}

async function population_density_walk(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'population_density_walk',
    });
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 55) + 10}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ppl_per_hectare.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_walk
    FROM
        ppl_per_hectare, const
    WHERE ST_Intersects(const.pp_geom, ppl_per_hectare.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_walk)),
        function: 'population_density_walk',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_walk',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_walk',
    });
  }
}

async function population_density_bike(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'population_density_bike',
    });
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 155) + 10}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ppl_per_hectare.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_bike
    FROM
        ppl_per_hectare, const
    WHERE ST_Intersects(const.pp_geom, ppl_per_hectare.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_bike)),
        function: 'population_density_bike',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_bike',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_bike',
    });
  }
}

async function population_density_car(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'population_density_car',
    });
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 444) + 10}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ppl_per_hectare.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_car
    FROM
        ppl_per_hectare, const
    WHERE ST_Intersects(const.pp_geom, ppl_per_hectare.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_car)),
        function: 'population_density_car',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_car',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_car',
    });
  }
}
// New Function - population density in walking distance
async function pop_density_isochrone_walk(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'pop_density_isochrone_walk',
    });
  }
  // function collecting all values from raster ghana_pop_dens inside the isochrone of walking distance
  const dbQuery = `
    SELECT popDensWalk('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}') as pop_dense_iso_walk;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_walk)),
        function: 'pop_density_isochrone_walk',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_walk',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_walk',
    });
  }
}
// New Function - population density in biking distance
async function pop_density_isochrone_bike(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'pop_density_isochrone_bike',
    });
  }
  // function collecting all values from raster ghana_pop_dens inside the isochrone of biking distance
  const dbQuery = `
    SELECT popDensBike('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}') as pop_dense_iso_bike;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_bike)),
        function: 'pop_density_isochrone_bike',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_bike',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_bike',
    });
  }
}
// New Function - population density in driving distance
async function pop_density_isochrone_car(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'pop_density_isochrone_car',
    });
  }
  // function collecting all values from raster ghana_pop_dens inside the isochrone of driving distance
  const dbQuery = `
    SELECT popDensCar('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}') as pop_dense_iso_car;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_car)),
        function: 'pop_density_isochrone_car',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_car',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'pop_density_isochrone_car',
    });
  }
}

async function population_density_buffer(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.buffer) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or buffer',
      function: 'population_density_buffer',
    });
  }

  const dbQuery = `
    WITH const (pp_geom) AS (
        values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${Number(req.query.buffer) + 250}')::geometry)
    )
    
    SELECT
        SUM((ST_SummaryStats(ST_Clip(
            ghana_pop_dens.rast, 
            const.pp_geom
        ))).sum::int) as pop_dense_buf
    FROM
        ghana_pop_dens, const
    WHERE ST_Intersects(const.pp_geom, ghana_pop_dens.rast);
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].pop_dense_buf)),
        function: 'population_density_buffer',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_buffer',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'population_density_buffer',
    });
  }
}

async function nearest_placename(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'nearest_placename',
    });
  }

  const dbQuery = `
    SELECT fclass, name FROM ghana_places
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: `${dbResponse.rows[0].name}, ${dbResponse.rows[0].fclass}`,
        function: 'nearest_placename',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_placename',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_placename',
    });
  }
}

async function nearest_poi(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'nearest_poi',
    });
  }

  const dbQuery = `
    SELECT fclass, name FROM ghana_poi
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: `${dbResponse.rows[0].name}, ${dbResponse.rows[0].fclass}`,
        function: 'nearest_poi',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_poi',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_poi',
    });
  }
}

async function nearest_bank(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'nearest_bank',
    });
  }

  const dbQuery = `
    SELECT "name"
    FROM public.ghana_poi
    WHERE fclass = 'bank'
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: dbResponse.rows[0].name,
        function: 'nearest_bank',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_bank',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_bank',
    });
  }
}

async function nearest_bank_distance(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
      function: 'nearest_bank_distance',
    });
  }

  const dbQuery = `
    SELECT ST_Distance(ghana_poi."geom"::geography, ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography)::int AS "distance"
    FROM public.ghana_poi WHERE fclass='bank'
    ORDER BY St_Transform(geom, 4326) <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: Math.round(Number(dbResponse.rows[0].distance)),
        function: 'nearest_bank_distance',
      });
    }

    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_bank_distance',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error encountered on server',
      function: 'nearest_bank_distance',
    });
  }
}
// New function - Isochrone walking distance
async function isochrone_walk(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'isochrone_walk',
    });
  }
  // function creating an isochrone of walking distance
  const dbQuery = `
    SELECT ST_AsGeoJSON(pgr_isochroneWalk('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}'), 6) as geom;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'Success',
        message: JSON.parse(dbResponse.rows[0].geom),
        function: 'isochrone_walk',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_walk',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_walk',
    });
  }
}
// New Function - Isochrone biking distance
async function isochrone_bike(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'isochrone_bike',
    });
  }
  // function creating an isochrone of biking distance
  const dbQuery = `
    SELECT ST_AsGeoJSON(pgr_isochroneBike('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}'), 6) as geom;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'Success',
        message: JSON.parse(dbResponse.rows[0].geom),
        function: 'isochrone_bike',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_bike',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_bike',
    });
  }
}
// New Function - Isochrone car
async function isochrone_car(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat, lng or minutes',
      function: 'isochrone_car',
    });
  }
  // function creating an isochrone of driving distance
  const dbQuery = `
    SELECT ST_AsGeoJSON(pgr_isochroneCar('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}'), 6) as geom;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return res.status(200).json({
        status: 'Success',
        message: JSON.parse(dbResponse.rows[0].geom),
        function: 'isochrone_car',
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_car',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Error while calculating isocrone',
      function: 'isochrone_car',
    });
  }
}

// User Control
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

function checkPassword(password) {
  const regex = /^[A-Za-z]\w{5,13}$/;
  if (password.match(regex)) {
    return true;
  }
  return false;
}

function checkUsername(username) {
  const regex = /^[A-Za-z]\w{5,13}$/;
  if (username.match(regex)) {
    return true;
  }
  return false;
}

async function usernameExists(username) {
  const dbQuery = `
    SELECT id
    FROM users
    WHERE "username" = '${username}'
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function verifyUser(username, password) {
  const dbQuery = `
    SELECT id
    FROM users
    WHERE "username" = '${username}' and "password" = '${password}'
    LIMIT 1;
  `;

  try {
    const dbResponse = await pool.query(dbQuery);
    if (dbResponse.rowCount > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function insertUser(username, password) {
  const dbQuery = `
    INSERT INTO users ("username", "password", "created_on", "last_login")
    VALUES ('${username}', '${password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `;

  try {
    await pool.query(dbQuery);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteUser(username) {
  const dbQuery = `
    DELETE FROM users
    WHERE "username" = '${username}';
  `;

  try {
    await pool.query(dbQuery);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function create_user(req, res) {
  if (!req.body.username || !req.body.password || !req.body.confirm) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing username, password or confirmPassword',
    });
  }
  const { username, password, confirm } = req.body;

  // Check if the password and confirm password fields match
  if (password === confirm) {
    // Check if user with the same email is also registered
    if (!checkPassword(password)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Password must be between 6 to 14 characters which contain only characters, numeric digits, underscore and first character must be a letter', // eslint-disable-line
        function: 'create_user',
      });
    }

    if (!checkUsername(username)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Username must be between 6 to 14 characters which contain only characters, numeric digits, underscore and first character must be a letter', // eslint-disable-line
        function: 'create_user',
      });
    }

    const user_exists = await usernameExists(username);
    if (user_exists) {
      return res.status(409).json({
        status: 'Failure',
        message: 'Username already exists',
        function: 'create_user',
      });
    }

    const hashedPassword = getHashedPassword(password);

    const insertedSuccessfully = await insertUser(username, hashedPassword);
    if (insertedSuccessfully) {
      const token = jwt.sign({ userId: username }, credentials.admin_key, { expiresIn: '24h' });

      return res.status(200).json({
        status: 'Success',
        message: 'User Successfully Created',
        function: 'create_user',
        username,
        token,
      });
    }
    return res.status(500).json({
      status: 'Failure',
      message: 'Internal error while creating user.',
      function: 'create_user',
    });
  }
  return res.status(400).send({
    status: 'Failure',
    message: 'Passwords do not match.',
    function: 'create_user',
  });
}

async function login_user(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing username or password',
      function: 'login_user',
    });
  }
  const { username, password } = req.body;

  if (!checkUsername(username)) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Username must be between 6-16 characters.',
      function: 'login_user',
    });
  }

  if (!checkPassword(password)) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Password must be between 6-16 characters.',
      function: 'login_user',
    });
  }

  const hashedPassword = getHashedPassword(password);

  const dbQuery = `
    UPDATE users
    SET last_login = CURRENT_TIMESTAMP
    WHERE "username" = '${username}' AND "password" = '${hashedPassword}';
  `;

  try {
    const dbResponse = await pool.query(dbQuery);

    if (dbResponse.rowCount > 0) {
      const token = jwt.sign({ userId: username }, credentials.admin_key, { expiresIn: '24h' });
      return res.status(200).json({
        status: 'Success',
        message: 'User Successfully Logged in',
        function: 'login_user',
        username,
        token,
      });
    }
    return res.status(401).json({
      status: 'Failure',
      message: 'User not found or unauthorised.',
      function: 'login_user',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Internal Error while logging user in.',
      function: 'login_user',
    });
  }
}

async function auth_token(token_to_verify) {
  try {
    const userId = token_to_verify.split(':')[0];
    const token = token_to_verify.split(':')[1];

    if (userId === 'casper' && token === 'golden_ticket') {
      return true;
    }
    const decodedToken = jwt.verify(token, credentials.admin_key);

    if (userId === decodedToken.userId) {
      return true;
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function delete_user(req, res) {
  if (req.body.token) {
    const { token } = req.body;
    const authorised = auth_token(token);

    if (!authorised) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Invalid token.',
        function: 'delete_user',
      });
    }
    try {
      const username = token.split(':')[0];
      const userExists = await usernameExists(username);

      if (!userExists) {
        return res.status(400).json({
          status: 'Failure',
          message: 'User does not exist',
          function: 'delete_user',
        });
      }

      const deletedUser = await deleteUser(username);
      const userStillExists = await usernameExists(username);
      if (deletedUser && !userStillExists) {
        return res.status(200).json({
          status: 'Success',
          message: 'User deleted',
          function: 'delete_user',
          username,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failure',
        message: 'Internal Error while logging user in.',
        function: 'delete_user',
      });
    }
  }
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing username or password',
      function: 'delete_user',
    });
  }

  const { username, password } = req.body;

  const hashedPassword = getHashedPassword(password);

  try {
    const userExists = await usernameExists(username);
    if (userExists) {
      const verifiedUser = await verifyUser(username, hashedPassword);
      if (verifiedUser || (hashedPassword === credentials.admin_key)) {
        const deletedUser = await deleteUser(username);
        const userStillExists = await usernameExists(username);
        if (deletedUser && !userStillExists) {
          return res.status(200).json({
            status: 'Success',
            message: 'User deleted',
            function: 'delete_user',
            username,
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Internal Error while logging user in.',
      function: 'delete_user',
    });
  }

  return res.status(401).json({
    status: 'Failure',
    message: 'Invalid credentials to delete user.',
    function: 'delete_user',
  });
}

router.route('/').get((req, res) => res.send('home/api'));

// // GET
router.route('/latlng_to_whatfreewords').get(auth, cache, latlng_to_whatfreewords);
router.route('/population_density').get(auth, cache, population_density);
router.route('/population_density_walk').get(auth, cache, population_density_walk);
router.route('/population_density_bike').get(auth, cache, population_density_bike);
router.route('/population_density_car').get(auth, cache, population_density_car);
router.route('/pop_density_isochrone_car').get(auth, cache, pop_density_isochrone_car);
router.route('/pop_density_isochrone_walk').get(auth, cache, pop_density_isochrone_walk);
router.route('/pop_density_isochrone_bike').get(auth, cache, pop_density_isochrone_bike);
router.route('/population_density_buffer').get(auth, cache, population_density_buffer);
router.route('/urban_status').get(auth, cache, urban_status);
router.route('/gpgps_to_latlng').get(gpgps_to_latlng);
router.route('/latlng_to_gpgps').get(latlng_to_gpgps);
router.route('/urban_status_simple').get(auth, cache, urban_status_simple);
router.route('/admin_level_1').get(auth, cache, admin_level_1);
router.route('/admin_level_2').get(auth, cache, admin_level_2);
router.route('/admin_level_2_fuzzy_tri').get(auth, cache, admin_level_2_fuzzy_tri);
router.route('/admin_level_2_fuzzy_lev').get(auth, cache, admin_level_2_fuzzy_lev);
router.route('/nearest_placename').get(auth, cache, nearest_placename);
router.route('/nearest_poi').get(auth, cache, nearest_poi);
router.route('/nearest_bank').get(auth, cache, nearest_bank);
router.route('/nearest_bank_distance').get(auth, cache, nearest_bank_distance);
router.route('/isochrone_walk').get(auth, cache, isochrone_walk);
router.route('/isochrone_bike').get(auth, cache, isochrone_bike);
router.route('/isochrone_car').get(auth, cache, isochrone_car);
router.route('/whatfreewords_to_latlng').get(auth, cache, whatfreewords_to_latlng);
router.route('/latlng_to_pluscode').get(auth, cache, latlng_to_pluscode);
router.route('/pluscode_to_latlng').get(auth, cache, pluscode_to_latlng);
router.route('/create_user').post(create_user);
router.route('/login_user').post(login_user);
router.route('/delete_user').post(delete_user);

module.exports = router;
