"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
exports.default = {
    //   redis: new Redis(process.env.REDIS_URL),
    status: new ioredis_1.default(process.env.REDIS_URL),
    client: new ioredis_1.default(process.env.REDIS_URL),
    subscriber: new ioredis_1.default(process.env.REDIS_URL),
};
