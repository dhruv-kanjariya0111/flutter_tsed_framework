import * as vscode from 'vscode';
import { execSync } from 'child_process';

function getCwd(): string {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
}

function runCommand(command: string, label: string): void {
  const cwd = getCwd();
  const terminal = vscode.window.createTerminal(`Flutter TSed: ${label}`);
  terminal.show();
  terminal.sendText(`npx @boscdev/flutter-tsed-framework ${command}`);
}

export function activate(ctx: vscode.ExtensionContext): void {
  // Sync rules into workspace on extension activate
  try {
    execSync('npx @boscdev/flutter-tsed-framework sync-rules', { cwd: getCwd() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showWarningMessage(`Flutter TSed: sync-rules failed — ${message}`);
  }

  const commands: Array<[string, string, string]> = [
    ['flutter-tsed.init',            'init',            'Init Project'],
    ['flutter-tsed.tdd',             'tdd',             'TDD Feature'],
    ['flutter-tsed.tdd-backend',     'tdd-backend',     'TDD Backend'],
    ['flutter-tsed.verify',          'verify',          'Verify'],
    ['flutter-tsed.review',          'review',          'Review'],
    ['flutter-tsed.plan',            'plan',            'Plan'],
    ['flutter-tsed.refactor',        'refactor',        'Refactor'],
    ['flutter-tsed.release',         'release',         'Release'],
    ['flutter-tsed.analyze-bugs',    'analyze-bugs',    'Analyze Bugs'],
    ['flutter-tsed.perf-check',      'perf-check',      'Perf Check'],
    ['flutter-tsed.a11y-check',      'a11y-check',      'A11y Check'],
    ['flutter-tsed.sync-contract',   'sync-contract',   'Sync Contract'],
    ['flutter-tsed.api-design',      'api-design',      'API Design'],
    ['flutter-tsed.migrate',         'migrate',         'Migrate'],
    ['flutter-tsed.store-check',     'store-check',     'Store Check'],
    ['flutter-tsed.explore',         'explore',         'Explore'],
    ['flutter-tsed.offline-check',   'offline-check',   'Offline Check'],
  ];

  for (const [id, cmd, label] of commands) {
    if (id === 'flutter-tsed.init') {
      ctx.subscriptions.push(
        vscode.commands.registerCommand(id, () => {
          execSync('npx @boscdev/flutter-tsed-framework init', { cwd: getCwd() });
        })
      );
      continue;
    }

    ctx.subscriptions.push(vscode.commands.registerCommand(id, () => runCommand(cmd, label)));
  }
}

export function deactivate(): void {}
