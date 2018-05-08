let fs = require('fs'),
  xml2js = require('xml2js');

let parser = new xml2js.Parser();
let r = {

};

let mapIdMap = {
  10001: 'JH',
  10002: 'DY',
  10003: 'JINGH',
  10004: 'YY',
  10005: 'BS',
  10006: 'YD',
  10007: 'XZ',
  // 10008: '',
  10009: 'QC',
  10010: 'HZ',
  10011: 'JN',
  10012: 'KF',
  10013: 'XH',
  10021: 'HHZ',
};


fs.readFile('./input.xml', function(err, data) {
  parser.parseString(data, function (err, result) {
    result['NewObj']['MapUiAreaNameTable'][0]['m_vecAreaNames'][0]['m_vecAreaNames'].forEach(({ $ }) => {
      let topLevel = Math.min(...$['szType'].split(';'));

      let o = {
        x: parseInt($['nPosX']) * 2,
        y: parseInt($['nPosY']) * 2,
        name: $['szName'],
        des: $['szDesc'],
        level: topLevel
      };
      let mapId = $['nMapID'];
      if(!r.hasOwnProperty(mapIdMap[mapId]))
        r[mapIdMap[mapId]] = [];
      r[mapIdMap[mapId]].push(o);
    });
  });

  fs.writeFile('./output/location_name.json', JSON.stringify(r, null, 4));
});