export function updateState(originalObject:any, updateObject:any): object {
  if (
    (typeof originalObject !== 'object' || originalObject === null)
    || (typeof updateObject !== 'object' || updateObject === null)
  ) {
    throw new Error('Unable to parse object for update. The input is not an object.');
  }

  const copy:any = {};
  const originalKeys = Object.keys(originalObject);
  const updateKeys = Object.keys(updateObject);

  for (let i = 0; i < originalKeys.length; i += 1) {
    const originalkey = originalKeys[i];
    copy[originalkey] = originalObject[originalkey];
  }

  for (let j = 0; j < updateKeys.length; j += 1) {
    const updateKey = updateKeys[j];
    copy[updateKey] = updateObject[updateKey];
  }

  return copy;
}

export default {
  updateState,
};
