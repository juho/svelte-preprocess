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
const tagInfo_1 = require("../modules/tagInfo");
const utils_1 = require("../modules/utils");
const prepareContent_1 = require("../modules/prepareContent");
exports.default = (options) => ({
    async script(svelteFile) {
        const { transformer } = await Promise.resolve().then(() => __importStar(require('../transformers/typescript')));
        let { content, filename, attributes, lang, dependencies, } = await tagInfo_1.getTagInfo(svelteFile);
        content = prepareContent_1.prepareContent({ options, content });
        if (lang !== 'typescript') {
            return { code: content };
        }
        const transformed = await transformer({
            content,
            filename,
            attributes,
            options,
        });
        return {
            ...transformed,
            dependencies: utils_1.concat(dependencies, transformed.dependencies),
        };
    },
});
