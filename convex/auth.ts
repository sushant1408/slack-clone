import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

import CustomPassword from "./CustomPassword";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword, Google, GitHub],
});
