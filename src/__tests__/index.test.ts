import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { netcdfGcms } from '../index.ts';

const pathFiles = join(import.meta.dirname, 'data');

test('Unknown file format', () => {
  const data = readFileSync(join(pathFiles, 'madis-sao.nc')).buffer;

  expect(() => netcdfGcms(data)).toThrowError('Unknown file format');
});
