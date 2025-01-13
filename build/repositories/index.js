"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRepositories = exports.userRepositories = exports.folowersRepositories = exports.followingsRepositories = exports.otpRepositories = void 0;
const otpRepository_repositories_1 = __importDefault(require("./otpRepository/otpRepository.repositories"));
exports.otpRepositories = otpRepository_repositories_1.default;
const followingsRepository_repositories_1 = __importDefault(require("./followingRepository/followingsRepository.repositories"));
exports.followingsRepositories = followingsRepository_repositories_1.default;
const folowersRepository_repositories_1 = __importDefault(require("./followersRepository/folowersRepository.repositories"));
exports.folowersRepositories = folowersRepository_repositories_1.default;
const userRepository_repositories_1 = __importDefault(require("./userRepository/userRepository.repositories"));
exports.userRepositories = userRepository_repositories_1.default;
const walletRepository_repositories_1 = __importDefault(require("./walletRepository/walletRepository.repositories"));
exports.walletRepositories = walletRepository_repositories_1.default;
