// @ts-ignore
import { Password } from "@convex-dev/auth/providers/Password";

import { DataModel } from "./_generated/dataModel";

export default Password<DataModel>({
  // @ts-ignore
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
});
