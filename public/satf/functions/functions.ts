// global CustomFunctions

function isWhat3WordsString(str) {
  if (typeof str !== 'string') { return false; }
  if (str.split('.').length !== 3) { return false; }
  if (/^[a-zA-Z.]+$/.test(str) === false) { return false; }

  return true;
}

async function LatLngToWhat3Words(latitude, longitude) {
  try {
    const res = await fetch(`https://marl.io/api/satf/latlng_to_whatfreewords?lat=${latitude}&lng=${longitude}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.json();
    return data;

  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function What3WordsToLatLng(str) {
  try {
    const res = await fetch(`https://api.what3words.com/v3/convert-to-coordinates?words=${str}&key=TI2OVXV0`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.json();

    return data.coordinates;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function PopulationDensity(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/population_density?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.json();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function PopulationDensityBuffer(buffer_in_meters, latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/population_density_buffer?lat=${lat}&lng=${lng}&buffer=${buffer_in_meters}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.json();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}


async function AdminLevel1(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/admin_level_1?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function AdminLevel2(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/admin_level_2?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function AdminLevel2FuzzyLev(name) {
  try {
    const res = await fetch(`https://localhost/api/satf/admin_level_2_fuzzy_lev?name=${name}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function AdminLevel2FuzzyTri(name) {
  try {
    const res = await fetch(`https://localhost/api/satf/admin_level_2_fuzzy_tri?name=${name}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function UrbanStatus(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/urban_status?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function UrbanStatusSimple(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/urban_status_simple?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function NearestPlace(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/nearest_placename?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function NearestPoi(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/nearest_poi?lat=${lat}&lng=${lng}`);
    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function NearestBank(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/nearest_bank?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.text();

    return data;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

async function NearestBankDist(latitude, longitude = false) {
  try {
    let lat = latitude;
    let lng = longitude;

    if (isWhat3WordsString(latitude)) {
      const coords = await What3WordsToLatLng(latitude);
      lat = coords.lat;
      lng = coords.lng;
    }

    const res = await fetch(`https://localhost/api/satf/nearest_bank_distance?lat=${lat}&lng=${lng}`);
    if (!res.ok) {
      const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
      throw error;
    }

    const data = await res.json();

    return data.distance;
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

function helloWorld1() {
  return 'helloWorld1';
}
