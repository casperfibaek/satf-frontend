/*
  Utility functions
*/

module.exports = {
  // Translate between the raster integer values and their urban classes. Works for greater Ghana.
  translateUrbanClasses(klass) {
    if (isNaN(klass)) { return 'Unknown'; }
    if (Number(klass) === 0) { return 'Rural'; }
    if (Number(klass) === 1) { return 'Suburban'; }
    if (Number(klass) === 2) { return 'Urban'; }
    if (Number(klass) === 3) { return 'Dense Urban'; }
    return 'Rural';
  },
};
