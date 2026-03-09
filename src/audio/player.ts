import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { platform } from 'node:os';

const activeProcesses = new Set<ChildProcess>();

function getPlayCommand(): { cmd: string; args: (file: string) => string[] } | null {
  const os = platform();
  if (os === 'darwin') {
    return { cmd: 'afplay', args: (file) => [file] };
  }
  if (os === 'linux') {
    return { cmd: 'aplay', args: (file) => ['-q', file] };
  }
  if (os === 'win32') {
    return {
      cmd: 'powershell',
      args: (file) => [
        '-c',
        `(New-Object Media.SoundPlayer '${file}').PlaySync()`,
      ],
    };
  }
  return null;
}

export function playFile(filePath: string): void {
  try {
    if (!existsSync(filePath)) return;

    const playCmd = getPlayCommand();
    if (!playCmd) return;

    const child = spawn(playCmd.cmd, playCmd.args(filePath), {
      stdio: 'ignore',
      detached: true,
    });

    activeProcesses.add(child);

    child.on('exit', () => {
      activeProcesses.delete(child);
    });

    child.on('error', () => {
      activeProcesses.delete(child);
    });

    child.unref();
  } catch {
    // Audio is non-critical — silently swallow all errors
  }
}

export function stopAll(): void {
  for (const proc of activeProcesses) {
    try {
      if (proc.pid) {
        process.kill(-proc.pid, 'SIGTERM');
      }
    } catch {
      // Process may have already exited
    }
  }
  activeProcesses.clear();
}
