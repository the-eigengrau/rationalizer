import { input as inquirerInput } from '@inquirer/prompts';
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { colors } from './theme.js';
import { promptTheme } from './prompt-theme.js';

interface VimInputOptions {
  message?: string;
  validate?: (value: string) => boolean | string;
}

const inputTheme = {
  ...promptTheme,
  prefix: { idle: '  ›', done: '  ›' },
};

export async function vimInput(opts: VimInputOptions): Promise<string> {
  while (true) {
    let ctrlGDetected = false;
    let hasKeypress = false;
    const controller = new AbortController();

    const onKeypress = (_ch: unknown, key: { ctrl?: boolean; name?: string } | undefined) => {
      if (key?.ctrl && key?.name === 'g') {
        ctrlGDetected = true;
        controller.abort();
      }
    };

    const onAnyKey = () => {
      hasKeypress = true;
    };

    process.stdin.on('keypress', onKeypress);
    process.stdin.on('keypress', onAnyKey);

    try {
      const result = await inquirerInput(
        {
          message: opts.message || '',
          theme: inputTheme,
          validate: opts.validate,
          transformer: (value: string, { isFinal }: { isFinal: boolean }) => {
            if (!value && !isFinal && !hasKeypress) {
              process.nextTick(() => {
                const hint = 'ctrl+g for vim';
                process.stdout.write(`${colors.subtle(hint)}\x1b[${hint.length}D`);
              });
              return '';
            }
            return value;
          },
        },
        { signal: controller.signal },
      );
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.removeListener('keypress', onAnyKey);
      return result;
    } catch (err) {
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.removeListener('keypress', onAnyKey);

      if (ctrlGDetected) {
        // Clear the aborted prompt artifacts
        process.stdout.write('\x1b[1A\x1b[2K\r');

        const editorResult = openInEditor();
        if (editorResult.trim()) {
          // Show what was entered via editor
          console.log(`  › ${colors.white(editorResult.trim().split('\n')[0])}${editorResult.trim().includes('\n') ? colors.dim(' ...') : ''}`);
          return editorResult.trim();
        }
        // Empty result, re-show prompt
        continue;
      }
      throw err;
    }
  }
}

function openInEditor(): string {
  const editor = process.env.EDITOR || process.env.VISUAL || 'vim';
  const tmpFile = join(tmpdir(), `rationalizer-${randomUUID()}.txt`);
  writeFileSync(tmpFile, '', { encoding: 'utf-8', mode: 0o600 });

  spawnSync(editor, [tmpFile], { stdio: 'inherit' });

  try {
    const content = readFileSync(tmpFile, 'utf-8');
    unlinkSync(tmpFile);
    return content;
  } catch {
    return '';
  }
}
