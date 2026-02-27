#!/usr/bin/env -S node --disable-warning=DEP0040

import { main } from './cli.js';

main().catch((error) => {
  if (error instanceof Error && error.message.includes('User force closed')) {
    console.log('\n');
    process.exit(0);
  }
  console.error('\nUnexpected error:', error);
  process.exit(1);
});
