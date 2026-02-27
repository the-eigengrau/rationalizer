#!/usr/bin/env node

// Suppress punycode deprecation warning from dependencies
const originalEmit = process.emit;
// @ts-expect-error -- patching process.emit to suppress dep warnings
process.emit = function (event: string, ...args: unknown[]) {
  if (event === 'warning' && typeof args[0] === 'object' && args[0] && (args[0] as { name?: string }).name === 'DeprecationWarning') {
    return false;
  }
  // @ts-expect-error -- forwarding to original
  return originalEmit.apply(process, [event, ...args]);
};

import { main } from './cli.js';

main().catch((error) => {
  if (error instanceof Error && error.message.includes('User force closed')) {
    console.log('\n');
    process.exit(0);
  }
  console.error('\nUnexpected error:', error);
  process.exit(1);
});
