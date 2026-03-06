# netcdf-gcms

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Parser from NetCDF files to JSON usable for GC / LC / GC-MS / HPLC-MS

## Installation

`$ npm install netcdf-gcms`

## [API Documentation](https://cheminfo.github.io/netcdf-gcms/)

## Example

```js
import { readFileSync } from 'node:fs';

import { netcdfGcms } from 'netcdf-gcms';

const data = readFileSync('Agilent.cdf');

// reads the data from the file
const json = netcdfGcms(data);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/netcdf-gcms.svg?style=flat-square
[npm-url]: https://npmjs.org/package/netcdf-gcms
[download-image]: https://img.shields.io/npm/dm/netcdf-gcms.svg?style=flat-square
[download-url]: https://npmjs.org/package/netcdf-gcms
