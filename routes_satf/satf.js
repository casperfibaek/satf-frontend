const pg = require('pg');
const credentials = require('./credentials');
const utils = require('./utils');
const Wfw = require('./assets/whatfreewords');
const Pluscodes = require('./assets/pluscodes');

const openLocationCode = Pluscodes();

const pool = new pg.Pool(credentials);

async function latLngToWhatFreeWords(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }
  try {
    res.send(Wfw.latlon2words(Number(req.query.lat), Number(req.query.lng)));
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function whatFreeWordsToLatLng(req, res) {
  if (!req.query.words) {
    res.sendStatus(400);
    return;
  }
  try {
    res.send(Wfw.words2latlon(req.query.words));
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function latLngToPluscode(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }
  try {
    res.send(openLocationCode.encode(Number(req.query.lat), Number(req.query.lng), 10));
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function pluscodeToLatLng(req, res) {
  if (!req.query.code) {
    res.sendStatus(400);
    return;
  }
  try {
    const code = openLocationCode.decode(String(req.query.code).replace(' ', '+'));
    res.send([code.latitudeCenter, code.longitudeCenter]);
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function admin_level_1(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
        SELECT "adm1_name"
        FROM public.ghana_admin
        WHERE
            ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
        LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(r.rows[0].adm1_name);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function admin_level_2(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
        SELECT "adm2_name"
        FROM public.ghana_admin
        WHERE
            ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
        LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(r.rows[0].adm2_name);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function admin_level_2_fuzzy_tri(req, res) {
  if (!req.query.name) {
    res.sendStatus(400);
    return;
  }

  const q = `
    SELECT adm2_name as name
    FROM ghana_admin
    ORDER BY SIMILARITY(adm2_name, '${req.query.name}') DESC
    LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(r.rows[0].name);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function admin_level_2_fuzzy_lev(req, res) {
  if (!req.query.name) {
    res.sendStatus(400);
    return;
  }

  const q = `
    SELECT adm2_name as name
    FROM ghana_admin
    ORDER BY LEVENSHTEIN(adm2_name, '${req.query.name}') ASC
    LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(r.rows[0].name);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function urban_status(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
        SELECT ensemble
        FROM public.urban_rural_classification_vect
        WHERE
        ST_Contains(public.urban_rural_classification_vect.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
        LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(utils.translateUrbanClasses(r.rows[0].ensemble));
    } else {
      res.send('Hinterland');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function urban_status_simple(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
        SELECT ensemble
        FROM public.urban_rural_classification_vect
        WHERE
        ST_Contains(public.urban_rural_classification_vect.geom, ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
        LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(utils.translateUrbanClasses(r.rows[0].ensemble, true));
    } else {
      res.send('Hinterland');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function population_density(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
        WITH const (pp_geom) AS (
            values (ST_SetSRID(ST_Point(${req.query.lng}, ${req.query.lat}), 4326))
        )
        
        SELECT ST_Value(rast, 1, pp_geom) As val
        FROM ppl_per_hectare, const
        WHERE ST_Intersects(rast, pp_geom);
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(String(Math.round(Number(r.rows[0].val) * 1)));
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function population_density_buffer(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.buffer) {
    res.sendStatus(400);
    return;
  }

  const q = `
        WITH const (pp_geom) AS (
            values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${Number(
  req.query.buffer,
) + 10}')::geometry)
        )
        
        SELECT
            SUM((ST_SummaryStats(ST_Clip(
                ppl_per_hectare.rast, 
                const.pp_geom
            ))).sum::int) as val
        FROM
            ppl_per_hectare, const
        WHERE ST_Intersects(const.pp_geom, ppl_per_hectare.rast);
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(r.rows[0].val);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function nearest_placename(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
        SELECT fclass, name FROM places
        ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
        LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(`${r.rows[0].name}, ${r.rows[0].fclass}`);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function nearest_poi(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
        SELECT fclass, name FROM poi
        ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
        LIMIT 1;
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(`${r.rows[0].name}, ${r.rows[0].fclass}`);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

async function nearest_bank(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
    SELECT "name"
    FROM public.banks
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(r.rows[0].name);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function nearest_bank_distance(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.sendStatus(400);
    return;
  }

  const q = `
    SELECT ST_Distance(banks."geom"::geography, ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography)::int AS "distance"
    FROM public.banks
    ORDER BY geom <-> ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)
    LIMIT 1;
  `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.send(r.rows[0]);
    } else {
      res.send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}

module.exports = {
  whatFreeWordsToLatLng,
  latLngToWhatFreeWords,
  latLngToPluscode,
  pluscodeToLatLng,
  urban_status,
  urban_status_simple,
  population_density,
  population_density_buffer,
  admin_level_1,
  admin_level_2,
  admin_level_2_fuzzy_tri,
  admin_level_2_fuzzy_lev,
  nearest_placename,
  nearest_poi,
  nearest_bank,
  nearest_bank_distance,
};
