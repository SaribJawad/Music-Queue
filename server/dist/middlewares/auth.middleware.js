var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiError } from "src/utils/ApiError";
import { asyncHandler } from "src/utils/asyncHandler";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "src/config/config";
import { User } from "src/models/user.model";
const verifyJWT = asyncHandler((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accessToken = req.cookies.accessToken ||
            ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", ""));
        if (!accessToken) {
            new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const user = yield User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id);
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiError(401, "Unauthorized error");
    }
}));
export { verifyJWT };
