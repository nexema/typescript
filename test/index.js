"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typia_1 = __importDefault(require("typia"));
function test() {
    const result = (input => {
        const $string = typia_1.default.stringify.string;
        const $so0 = input => `{"id":${$string(input.id)},"firstName":${$string(input.firstName)},"lastName":${$string(input.lastName)},"email":${$string(input.email)}}`;
        return $so0(input);
    })({});
    console.log(result);
}
