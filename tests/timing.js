const test = require('tape');

// Metatest
test('timing test', (t) => {
    t.plan(2);

    t.equal(typeof Date.now, 'function');
    const start = Date.now();

    setTimeout(() => {
        t.equal(Date.now() - start, 100);
    }, 100);
});
