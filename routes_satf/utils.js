module.exports = {
  translateUrbanClasses(klass, simple = false) {
    const klassString = typeof klass === 'number' ? String(klass) : klass;
    if (simple) {
      switch (klassString) {
        case '100':
          return 'Hinterland';
        case '10':
          return 'Urban';
        case '11':
          return 'Urban';
        case '12':
          return 'Urban';
        case '13':
          return 'Urban';
        case '14':
          return 'Urban';
        case '15':
          return 'Suburb';
        case '16':
          return 'Rural';
        default:
          return 'Hinterland';
      }
    } else {
      switch (klassString) {
        case '100':
          return 'Hinterland';
        case '10':
          return 'Road';
        case '11':
          return 'Industrial / Commercial';
        case '12':
          return 'Apartment / Hotel';
        case '13':
          return 'Dense Self-Organised (high)';
        case '14':
          return 'Dense Self-Organised (low)';
        case '15':
          return 'Suburb';
        case '16':
          return 'Rural';
        default:
          return 'Hinterland';
      }
    }
  },
};
