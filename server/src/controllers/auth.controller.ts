import { User } from "src/models/user.model";
import { asyncHandler } from "src/utils/asyncHandler";

const handleGoogleLogin = asyncHandler(async (req, res) => {
  // TODO :
  // create jwt
  // send cookie to FE
  console.log("req.user", req.user);
});

export { handleGoogleLogin };
