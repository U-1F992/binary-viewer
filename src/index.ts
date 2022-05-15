import { readFileSync } from "./fs.js";

"use strict";

function main(args: { length: number, Item(n: number): string }): number {

    if (args.length !== 1) {
        WScript.Echo(`
Usage:
    ${WScript.FullName} ${WScript.ScriptName} [path]
`);
        return 1;
    }

    const buffer = readFileSync(args.Item(0));

    if (typeof (buffer) == "string")
        throw new Error("ここには来ないはず...");

    let message = `
          | 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
----------+-------------------------------------------------`;

    const length = buffer.length;
    for (let i = 0; i < length; i++) {
        if (i % 16 == 0) message += (`\r\n ${`0000000${i.toString(16).toUpperCase()}`.slice(-8)} | `);

        const hex = `0${buffer.readUInt8(i).toString(16).toUpperCase()}`.slice(-2);
        message += `${hex} `;
    }
    message += "\r\n";

    WScript.Echo(message);
    return 0;
}

WScript.Quit(main(WScript.Arguments));
