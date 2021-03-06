"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProp = exports.findUp = exports.isValidLocalPath = exports.hasDepInstalled = exports.getIncludePaths = exports.concat = exports.importAny = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
async function importAny(...modules) {
    try {
        const mod = await modules.reduce((acc, moduleName) => acc.catch(() => Promise.resolve().then(() => __importStar(require(moduleName)))), Promise.reject());
        return mod;
    }
    catch (e) {
        throw new Error(`Cannot find any of modules: ${modules}\n\n${e}`);
    }
}
exports.importAny = importAny;
function concat(...arrs) {
    return arrs.reduce((acc, a) => {
        if (a) {
            return acc.concat(a);
        }
        return acc;
    }, []);
}
exports.concat = concat;
/** Paths used by preprocessors to resolve @imports */
function getIncludePaths(fromFilename, base = []) {
    return [
        ...new Set([...base, 'node_modules', process.cwd(), path_1.dirname(fromFilename)]),
    ];
}
exports.getIncludePaths = getIncludePaths;
const cachedResult = {};
/**
 * Checks if a package is installed.
 *
 * @export
 * @param {string} dep
 * @returns boolean
 */
async function hasDepInstalled(dep) {
    if (cachedResult[dep] != null) {
        return cachedResult[dep];
    }
    let result = false;
    try {
        await Promise.resolve().then(() => __importStar(require(dep)));
        result = true;
    }
    catch (e) {
        result = false;
    }
    return (cachedResult[dep] = result);
}
exports.hasDepInstalled = hasDepInstalled;
const REMOTE_SRC_PATTERN = /^(https?:)?\/\//;
function isValidLocalPath(path) {
    return (path.match(REMOTE_SRC_PATTERN) == null &&
        // only literal strings allowed
        !path.startsWith('{') &&
        !path.endsWith('}'));
}
exports.isValidLocalPath = isValidLocalPath;
// finds a existing path up the tree
function findUp({ what, from }) {
    const { root, dir } = path_1.parse(from);
    let cur = dir;
    try {
        while (cur !== root) {
            const possiblePath = path_1.join(cur, what);
            if (fs_1.existsSync(possiblePath)) {
                return possiblePath;
            }
            cur = path_1.dirname(cur);
        }
    }
    catch (e) {
        console.error(e);
    }
    return null;
}
exports.findUp = findUp;
// set deep property in object
function setProp(obj, keyList, val) {
    let i = 0;
    for (; i < keyList.length - 1; i++) {
        const key = keyList[i];
        if (typeof obj[key] !== 'object') {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keyList[i]] = val;
}
exports.setProp = setProp;
