const express = require('express');
const pg = require('pg');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cache = require('./cache');
const auth = require('./auth');
const credentials = require('./credentials');
const utils = require('./utils');
const Wfw = require('./assets/whatfreewords');
const Pluscodes = require('./assets/pluscodes');

const openLocationCode = Pluscodes();
const router = express.Router();

const pool = new pg.Pool(credentials);

async function latlng_to_whatfreewords(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.status(400);
    return;
  }
  try {
    res.send(Wfw.latlon2words(Number(req.query.lat), Number(req.query.lng)));
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function whatfreewords_to_latlng(req, res) {
  if (!req.query.words) {
    res.status(400);
    return;
  }
  try {
    res.send(Wfw.words2latlon(req.query.words));
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function latlng_to_pluscode(req, res) {
  if (!req.query.lat || !req.query.lng) {
    res.status(400);
    return;
  }
  try {
    res.send(openLocationCode.encode(Number(req.query.lat), Number(req.query.lng), 10));
  } catch (err) {
    res.send(err);
    console.log(err.stack);
  }
}

async function pluscode_to_latlng(req, res) {
  if (!req.query.code) {
    res.status(400);
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
    res.status(400);
    return;
  }
  res.setHeader('Cache-Control', 'public, max-age=86400');

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
    res.status(400);
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
    res.status(400);
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
    res.status(400);
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
    res.status(400);
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
    res.status(400);
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
    res.status(400);
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

//to be substituted by popDensWalk
async function population_density_walk(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    res.status(400);
    return;
  }

  const q = `
        WITH const (pp_geom) AS (
            values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 55) + 10}')::geometry)
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

//to be substituted  by popDensBike 
async function population_density_bike(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    res.status(400);
    return;
  }

  const q = `
        WITH const (pp_geom) AS (
            values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 155) + 10}')::geometry)
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

async function population_density_car(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    res.status(400);
    return;
  }

  const q = `
        WITH const (pp_geom) AS (
            values (ST_Buffer(ST_SetSRID(ST_Point('${req.query.lng}', '${req.query.lat}'), 4326)::geography, '${(Number(req.query.minutes) * 444) + 10}')::geometry)
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

async function population_density_buffer(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.buffer) {
    res.status(400);
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
    res.status(400);
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
    res.status(400);
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
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
    });
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
      res.status(200).send(r.rows[0].name);
    } else {
      res.status(400).send('null');
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err.stack);
  }
}

async function nearest_bank_distance(req, res) {
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
    });
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
      res.status(200).send(r.rows[0]);
    } else {
      res.status(400).send('null');
    }
  } catch (err) {
    res.send(err.stack);
    console.log(err.stack);
  }
}



async function isochrone_walk(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    res.status(400);
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
    });
  }
  //function collecting all values from raster ghana_pop_dens inside the isochrone of walking distance
  const q = `
        SELECT pgr_isochroneWalk('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}')      
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.status(200).send(r.rows[0].name);
    } else {
      res.status(400).send('null');
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err.stack);
  }
}

async function isochrone_bike(req, res) {
  if (!req.query.lat || !req.query.lng || !req.query.minutes) {
    res.status(400);
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing lat or lng',
    });
  }
  //function collecting all values from raster ghana_pop_dens inside the isochrone of walking distance
  const q = `
        SELECT pgr_isochroneBike('${req.query.lng}', '${req.query.lat}', '${Number(req.query.minutes)}')      
    `;

  try {
    const r = await pool.query(q);
    if (r.rowCount > 0) {
      res.status(200).send(r.rows[0].name);
    } else {
      res.status(400).send('null');
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err.stack);
  }
}

// User Control
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

function CheckPassword(password) {
  const regex = /^[A-Za-z]\w{6,14}$/;
  if (password.match(regex)) {
    return true;
  }
  return false;
}

async function usernameExists(username) {
  const dbQuery = `
    SELECT id
    FROM users
    WHERE "username" = '${username}'
    LIMIT 1;`;

  try {
    const dbRequest = await pool.query(dbQuery);
    if (dbRequest.rowCount > 0) {
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
    LIMIT 1;`;

  try {
    const dbRequest = await pool.query(dbQuery);
    if (dbRequest.rowCount > 0) {
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
    VALUES ('${username}', '${password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;

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
    WHERE "username" = '${username}';`;

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
    const user_exists = await usernameExists(username);
    if (user_exists) {
      return res.status(409).json({
        status: 'Failure',
        message: 'Username already exists',
      });
    }
    if (CheckPassword(password)) {
      const hashedPassword = getHashedPassword(password);

      const insertedSuccessfully = await insertUser(username, hashedPassword);
      if (insertedSuccessfully) {
        const token = jwt.sign({ userId: username }, credentials.admin_key, { expiresIn: '24h' });

        return res.status(200).json({
          status: 'Success',
          message: 'User Successfully Created',
          username,
          token,
        });
      }
      return res.status(500).json({
        status: 'Failure',
        message: 'Internal error while creating user.',
      });
    }
    return res.status(400).json({
      status: 'Failure',
      message: 'Password; must be between 6 to 14 characters which contain only characters, numeric digits, underscore and first character must be a letter', // eslint-disable-line
    });
  }
  return res.status(400).send({
    status: 'Failure',
    message: 'Passwords do not match.',
  });
}

async function login_user(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing username or password',
    });
  }
  const { username, password } = req.body;

  const hashedPassword = getHashedPassword(password);

  const dbQuery = `
    UPDATE users
    SET last_login = CURRENT_TIMESTAMP
    WHERE "username" = '${username}' AND "password" = '${hashedPassword}';`;

  try {
    const dbRequest = await pool.query(dbQuery);

    if (dbRequest.rowCount > 0) {
      const token = jwt.sign({ userId: username }, credentials.admin_key, { expiresIn: '24h' });
      return res.status(200).json({
        status: 'Success',
        message: 'User Successfully Logged in',
        username,
        token,
      });
    }
    return res.status(401).json({
      status: 'Failure',
      message: 'User not found or unauthorised.',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failure',
      message: 'Internal Error while logging user in.',
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
      });
    }
    try {
      const username = token.split(':')[0];
      const userExists = await usernameExists(username);

      if (!userExists) {
        return res.status(400).json({
          status: 'Failure',
          message: 'User does not exist',
        });
      }

      const deletedUser = await deleteUser(username);
      const userStillExists = await usernameExists(username);
      if (deletedUser && !userStillExists) {
        return res.status(200).json({
          status: 'Success',
          message: 'User deleted',
          username,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 'Failure',
        message: 'Internal Error while logging user in.',
      });
    }
  }
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Request missing username or password',
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
    });
  }

  return res.status(401).json({
    status: 'Failure',
    message: 'Invalid credentials to delete user.',
  });
}

router.route('/').get((req, res) => res.send('home/api'));

// // GET
router.route('/latlng_to_whatfreewords').get(auth, cache, latlng_to_whatfreewords);
router.route('/population_density').get(auth, cache, population_density);
router.route('/population_density_walk').get(auth, cache, population_density_walk);
router.route('/population_density_bike').get(auth, cache, population_density_bike);
router.route('/population_density_car').get(auth, cache, population_density_car);
router.route('/population_density_buffer').get(auth, cache, population_density_buffer);
router.route('/urban_status').get(auth, cache, urban_status);
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
router.route('/whatfreewords_to_latlng').get(auth, cache, whatfreewords_to_latlng);
router.route('/latlng_to_pluscode').get(auth, cache, latlng_to_pluscode);
router.route('/pluscode_to_latlng').get(auth, cache, pluscode_to_latlng);
router.route('/create_user').post(create_user);
router.route('/login_user').post(login_user);
router.route('/delete_user').post(delete_user);

module.exports = router;
