/**
 * Node-like method to read file synchronously.
 * 
 * https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
 * 
 * @param path 
 * @param option 
 */
export function readFileSync(path: string, option?: { encoding?: string, flag?: string }): string | Buffer {

    if (typeof (option) === "undefined")
        option = {};
    if (typeof (option.flag) === "undefined")
        option.flag = "r";

    const mode = convertFlag2Mode(option.flag);

    if (typeof (option.encoding) !== "undefined") {
        const charSet = convertEncoding2CharSet(option.encoding);
        return readFileSync_text(path, charSet, mode);
    } else {
        return readFileSync_binary(path, mode);
    }

    /**
     * https://nodejs.org/api/fs.html#file-system-flags
     * 
     * https://docs.microsoft.com/ja-jp/office/client-developer/access/desktop-database-reference/connectmodeenum
     * 
     * @param flag 
     * @returns 
     */
    function convertFlag2Mode(flag: string): number {
        // const adModeUnknown = 0;
        const adModeRead = 1;
        const adModeWrite = 2;
        const adModeReadWrite = 3;
        // const adModeShareDenyRead = 4;
        // const adModeShareDenyWrite = 8;
        // const adModeShareExclusive = 12;
        // const adModeShareDenyNone = 16;

        switch (flag) {
            case "a":
                return adModeWrite;
            case "ax":
                return adModeWrite;
            case "a+":
                return adModeReadWrite;
            case "ax+":
                return adModeReadWrite;
            case "as":
                return adModeWrite;
            case "as+":
                return adModeReadWrite;
            case "r":
                return adModeRead;
            case "r+":
                return adModeReadWrite;
            case "rs+":
                return adModeReadWrite;
            case "w":
                return adModeWrite;
            case "wx":
                return adModeWrite;
            case "w+":
                return adModeReadWrite;
            case "wx+":
                return adModeReadWrite;
            default:
                throw new Error("Invalid flag string.");
        }
    }

    /**
     * https://github.com/nodejs/node/blob/fb744749e204c349f76df79b3c513c7e0df7e4c6/lib/buffer.js#L590
     * 
     * @param encoding 
     * @returns 
     */
    function convertEncoding2CharSet(encoding: string): string {
        switch (encoding) {
            case "utf8":
                return "UTF-8";
            case "ascii":
                return "ASCII";
            case "utf16le":
                return "UTF-16LE";
            default:
                throw new Error("Not implemented.");
        }
    }

    /**
     * Read a text file.
     * 
     * @param path 
     * @param encoding 
     * @param mode 
     * @returns 
     */
    function readFileSync_text(path: string, charSet: string, mode: number): string {
        const adTypeText = 2;
        const adReadAll = -1;

        const stream = WScript.CreateObject("ADODB.Stream");
        stream.Type = adTypeText;
        stream.CharSet = charSet;
        // stream.Mode = mode;
        stream.Open();
        stream.LoadFromFile(path);
        const string = stream.ReadText(adReadAll);
        stream.Close();

        return string;
    }

    /**
     * Read a binary file.
     * 
     * @param path 
     * @param mode 
     * @returns 
     */
    function readFileSync_binary(path: string, mode: number): Buffer {

        // 「ASCIIで解釈された文字列のcharCodeAt(n)と、CP437で解釈された文字列のcharCodeAt(n)のペアは一意である」ことを利用して、number[]を作る
        const result: Array<number> = [];

        const CP437 = "437"; // 127以降が一意ではない
        const ASCII = "ASCII"; // 127で折り返す
        const charCodePair = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 24], [25, 25], [26, 26], [27, 27], [28, 28], [29, 29], [30, 30], [31, 31], [32, 32], [33, 33], [34, 34], [35, 35], [36, 36], [37, 37], [38, 38], [39, 39], [40, 40], [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46], [47, 47], [48, 48], [49, 49], [50, 50], [51, 51], [52, 52], [53, 53], [54, 54], [55, 55], [56, 56], [57, 57], [58, 58], [59, 59], [60, 60], [61, 61], [62, 62], [63, 63], [64, 64], [65, 65], [66, 66], [67, 67], [68, 68], [69, 69], [70, 70], [71, 71], [72, 72], [73, 73], [74, 74], [75, 75], [76, 76], [77, 77], [78, 78], [79, 79], [80, 80], [81, 81], [82, 82], [83, 83], [84, 84], [85, 85], [86, 86], [87, 87], [88, 88], [89, 89], [90, 90], [91, 91], [92, 92], [93, 93], [94, 94], [95, 95], [96, 96], [97, 97], [98, 98], [99, 99], [100, 100], [101, 101], [102, 102], [103, 103], [104, 104], [105, 105], [106, 106], [107, 107], [108, 108], [109, 109], [110, 110], [111, 111], [112, 112], [113, 113], [114, 114], [115, 115], [116, 116], [117, 117], [118, 118], [119, 119], [120, 120], [121, 121], [122, 122], [123, 123], [124, 124], [125, 125], [126, 126], [127, 127], [199, 0], [252, 1], [233, 2], [226, 3], [228, 4], [224, 5], [229, 6], [231, 7], [234, 8], [235, 9], [232, 10], [239, 11], [238, 12], [236, 13], [196, 14], [197, 15], [201, 16], [230, 17], [198, 18], [244, 19], [246, 20], [242, 21], [251, 22], [249, 23], [255, 24], [214, 25], [220, 26], [162, 27], [163, 28], [165, 29], [8359, 30], [402, 31], [225, 32], [237, 33], [243, 34], [250, 35], [241, 36], [209, 37], [170, 38], [186, 39], [191, 40], [8976, 41], [172, 42], [189, 43], [188, 44], [161, 45], [171, 46], [187, 47], [9617, 48], [9618, 49], [9619, 50], [9474, 51], [9508, 52], [9569, 53], [9570, 54], [9558, 55], [9557, 56], [9571, 57], [9553, 58], [9559, 59], [9565, 60], [9564, 61], [9563, 62], [9488, 63], [9492, 64], [9524, 65], [9516, 66], [9500, 67], [9472, 68], [9532, 69], [9566, 70], [9567, 71], [9562, 72], [9556, 73], [9577, 74], [9574, 75], [9568, 76], [9552, 77], [9580, 78], [9575, 79], [9576, 80], [9572, 81], [9573, 82], [9561, 83], [9560, 84], [9554, 85], [9555, 86], [9579, 87], [9578, 88], [9496, 89], [9484, 90], [9608, 91], [9604, 92], [9612, 93], [9616, 94], [9600, 95], [945, 96], [223, 97], [915, 98], [960, 99], [931, 100], [963, 101], [181, 102], [964, 103], [934, 104], [920, 105], [937, 106], [948, 107], [8734, 108], [966, 109], [949, 110], [8745, 111], [8801, 112], [177, 113], [8805, 114], [8804, 115], [8992, 116], [8993, 117], [247, 118], [8776, 119], [176, 120], [8729, 121], [183, 122], [8730, 123], [8319, 124], [178, 125], [9632, 126], [160, 127]];

        const raw = {
            cp437: readFileSync_text(path, CP437, mode),
            ascii: readFileSync_text(path, ASCII, mode)
        };
        if (raw.cp437.length !== raw.ascii.length) throw new Error("Unknown error: The length of the string differs when interpreted in CP437 and in ASCII.");

        const length = raw.cp437.length;
        for (let i = 0; i < length; i++) {
            charCodePair.forEach((value, j) => {
                if (value[0] === raw.cp437.charCodeAt(i) && value[1] === raw.ascii.charCodeAt(i)) {
                    result.push(j);
                    return;
                }
            });
        }

        return Buffer.from(result);
    }
}

/**
 * Node-like binary sequence class.
 */
export class Buffer {

    private readonly raw: Array<number>;
    readonly length: number;

    private constructor(array: Array<number>) {
        this.raw = array;
        this.length = this.raw.length;
    }

    static from(array: Array<number>): Buffer {
        return new Buffer(array);
    }

    readUInt8(offset: number = 0): number {
        if (offset < 0 || this.length - 1 < offset) throw new Error("Offset must be between 0 and length - 1");
        return this.raw[offset];
    }
}
