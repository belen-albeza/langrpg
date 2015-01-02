var uuid = require('node-uuid');
var level = require('levelup');

var dbActivities = level('./db/activities', {
  createIfMissing: true,
  valueEncoding: 'json'
});

var ACTIVITIES_FIXTURES = [{
  title: "Watch video (with subtitles)",
  units: "minutes",
    xp: 1.5
}, {
  title: "Watch video",
  units: "minutes",
  xp: 3
}, {
  title: "Learn new cards in Anki",
  unit: "cards",
  xp: 1
}, {
  title: "Do Anki reviews",
  unit: "reviews",
  xp: 1
}, {
  title: "Conversate with a native",
  unit: "minutes",
  xp: 5
}, {
  title: "Misc. study",
  unit: "minutes",
  xp: 3
}];

dbActivities.batch(ACTIVITIES_FIXTURES.map(function (x) {
  return { type: 'put', key: uuid.v4(), value: x };
}), function (err) {
  if (err) { throw err; }
});
