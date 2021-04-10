import * as vscode from "vscode";

import { InputOr } from ".";
import { Context, prompt, toMode } from "../api";

/**
 * Set modes.
 */
declare module "./modes";

/**
 * Set Dance mode.
 *
 * #### Variants
 *
 * | Title              | Identifier   | Keybinding        | Command                                 |
 * | ------------------ | ------------ | ----------------- | --------------------------------------- |
 * | Set mode to Normal | `set.normal` | `escape` (insert) | `[".modes.set", { "input": "normal" }]` |
 * | Set mode to Insert | `set.insert` |                   | `[".modes.set", { "input": "insert" }]` |
 *
 * Other variants are provided to switch to insert mode:
 *
 * | Title                | Identifier         | Keybinding     | Commands                                                                                      |
 * | -------------------- | ------------------ | -------------- | --------------------------------------------------------------------------------------------- |
 * | Insert before        | `insert.before`    | `i` (normal)   | `[".selections.faceBackward"], [".modes.set", { "input": "insert" }], [".selections.reduce"]` |
 * | Insert after         | `insert.after`     | `a` (normal)   | `[".selections.faceForward"] , [".modes.set", { "input": "insert" }], [".selections.reduce"]` |
 * | Insert at line start | `insert.lineStart` | `s-i` (normal) | `[".select.lineStart", { "shift": "jump" }], [".modes.set", { "input": "insert" }]`           |
 * | Insert at line end   | `insert.lineEnd`   | `s-a` (normal) | `[".select.lineEnd"  , { "shift": "jump" }], [".modes.set", { "input": "insert" }]`           |
 */
export async function set(_: Context, inputOr: InputOr<string>) {
  await toMode(await inputOr(() => prompt(validateModeName())));
}

/**
 * Set Dance mode temporarily.
 *
 * #### Variants
 *
 * | Title                 | Identifier               | Keybindings    | Commands                                            |
 * | --------------------- | ------------------------ | -------------- | --------------------------------------------------- |
 * | Temporary Normal mode | `set.temporarily.normal` | `c-v` (insert) | `[".modes.set.temporarily", { "input": "normal" }]` |
 * | Temporart Insert mode | `set.temporarily.insert` | `c-v` (normal) | `[".modes.set.temporarily", { "input": "insert" }]` |
 */
export async function set_temporarily(
  _: Context,
  inputOr: InputOr<string>,
  repetitions: number,
) {
  await toMode(await inputOr(() => prompt(validateModeName())), repetitions);
}

function validateModeName(ctx = Context.WithoutActiveEditor.current) {
  const modes = ctx.extensionState.modes;

  return {
    validateInput(value) {
      if (modes.get(value) !== undefined) {
        return undefined;
      }

      return `mode ${JSON.stringify(value)} does not exist`;
    },
  } as vscode.InputBoxOptions;
}
