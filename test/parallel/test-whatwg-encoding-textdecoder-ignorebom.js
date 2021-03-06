'use strict';

// From: https://github.com/w3c/web-platform-tests/blob/7f567fa29c/encoding/textdecoder-ignorebom.html
// TODO(joyeecheung): replace this with WPT

const common = require('../common');

if (!common.hasIntl)
  common.skip('missing Intl');

const assert = require('assert');

const cases = [
  {
    encoding: 'utf-8',
    bytes: [0xEF, 0xBB, 0xBF, 0x61, 0x62, 0x63]
  },
  {
    encoding: 'utf-16le',
    bytes: [0xFF, 0xFE, 0x61, 0x00, 0x62, 0x00, 0x63, 0x00]
  },
  {
    encoding: 'utf-16be',
    bytes: [0xFE, 0xFF, 0x00, 0x61, 0x00, 0x62, 0x00, 0x63]
  }
];

cases.forEach((testCase) => {
  const BOM = '\uFEFF';
  let decoder = new TextDecoder(testCase.encoding, { ignoreBOM: true });
  const bytes = new Uint8Array(testCase.bytes);
  assert.strictEqual(decoder.decode(bytes), `${BOM}abc`);
  decoder = new TextDecoder(testCase.encoding, { ignoreBOM: false });
  assert.strictEqual(decoder.decode(bytes), 'abc');
  decoder = new TextDecoder(testCase.encoding);
  assert.strictEqual(decoder.decode(bytes), 'abc');
});

{
  assert('ignoreBOM' in new TextDecoder());
  assert.strictEqual(typeof new TextDecoder().ignoreBOM, 'boolean');
  assert(!new TextDecoder().ignoreBOM);
  assert(new TextDecoder('utf-8', { ignoreBOM: true }).ignoreBOM);
}
