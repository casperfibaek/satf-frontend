// global CustomFunctions

function wfw(str) {
  if (typeof str !== 'string') {
    return false;
  }
  if (str.split('.').length !== 3) {
    return false;
  }
  if (/^[a-zA-Z.]+$/.test(str) === false) {
    return false;
  }

  return true;
}

// eslint-disable-next-line no-unused-vars
async function LatLngToWhatFreeWords(latitude, longitude) {
  try {
    const res = await fetch(`https://marl.io/api/satf/latlng_to_whatfreewords?lat=${latitude}&lng=${longitude}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function LatLngToPluscode(latitude, longitude) {
  try {
    const res = await fetch(`https://marl.io/api/satf/latlng_to_pluscode?lat=${latitude}&lng=${longitude}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function WhatFreeWordsToLatLng(words) {
  try {
    const res = await fetch(`https://marl.io/api/satf/whatfreewords_to_latlng?words=${words}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    const coordinates = {
      lat: data[0],
      lng: data[1],
    };

    return coordinates;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function PopulationDensity(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/population_density?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function PopulationDensityBuffer(bufferMeters, latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(
      `https://marl.io/api/satf/population_density_buffer?lat=${lat}&lng=${lng}&buffer=${bufferMeters}`,
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function AdminLevel1(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/admin_level_1?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function AdminLevel2(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/admin_level_2?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function AdminLevel2FuzzyLev(name) {
  try {
    const res = await fetch(`https://marl.io/api/satf/admin_level_2_fuzzy_lev?name=${name}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function AdminLevel2FuzzyTri(name) {
  try {
    const res = await fetch(`https://marl.io/api/satf/admin_level_2_fuzzy_tri?name=${name}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function UrbanStatus(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/urban_status?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function UrbanStatusSimple(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/urban_status_simple?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function NearestPlace(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/nearest_placename?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function NearestPoi(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/nearest_poi?lat=${lat}&lng=${lng}`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function NearestBank(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/nearest_bank?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.text();

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

// eslint-disable-next-line no-unused-vars
async function NearestBankDist(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (wfw(latitude)) {
      const coords = await WhatFreeWordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://marl.io/api/satf/nearest_bank_distance?lat=${lat}&lng=${lng}`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    return data.distance;
  } catch (err) {
    throw new Error(err);
  }
}
