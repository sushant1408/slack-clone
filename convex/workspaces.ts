import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const generateJoinCode = () => {
  const str = "0123456789abcdefghijklmnopqrstuvwxyz";

  /**
   * first generates an array of length 6, populating it by
   * randomly picking a char from 0 to 36 (length of "str") from "str" e.g. str[12], etc
   * and finally joining them to create a string of 6 chars like "12fvj7"
   */
  const code = Array.from(
    { length: 6 },
    () => str[Math.floor(Math.random() * str.length)]
  ).join("");

  return code;
};

export const createWorkspace = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const joinCode = generateJoinCode();

    // create a workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      joinCode,
      userId,
      name: args.name,
    });

    // create a ("admin") member for that workspace
    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

export const getWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    // get all the members whose userId matches the userId of currently logged in user
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    // collect the workspace ids of the memebrs
    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    /**
     * get the workspaces. This way we are getting all
     * workspaces where currently logged in user is a member.
     */
    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getWorkspaceById = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return await ctx.db.get(args.workspaceId);
  },
});
