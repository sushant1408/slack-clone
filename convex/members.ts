import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const populateUser = (ctx: QueryCtx, useId: Id<"users">) => {
  return ctx.db.get(useId);
};

export const currentMember = query({
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

    return member;
  },
});

export const getMembers = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return [];
    }

    // a "member" don't have name, email, image, etc.
    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const members = [];

    for (const member of data) {
      // so we are getting the user
      const user = await populateUser(ctx, member.userId);

      if (user) {
        // and adding the missing information along with member
        members.push({ ...member, user });
      }
    }

    return members;
  },
});
