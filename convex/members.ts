import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

export const currentMember = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await getMember(ctx, args.workspaceId, userId);

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

    const member = await getMember(ctx, args.workspaceId, userId);

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

export const getMemberById = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      return null;
    }

    const currentMember = await getMember(ctx, member.workspaceId, userId);

    if (!currentMember) {
      return null;
    }

    const user = await populateUser(ctx, member.userId);

    if (!user) {
      return null;
    }

    return {
      ...member,
      user,
    };
  },
});

export const updateMember = mutation({
  args: {
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      throw new Error("Member not found");
    }

    const currentMember = await getMember(ctx, member.workspaceId, userId);

    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.memberId, {
      role: args.role,
    });

    return args.memberId;
  },
});

export const removeMember = mutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      throw new Error("Member not found");
    }

    const currentMember = await getMember(ctx, member.workspaceId, userId);

    if (!currentMember) {
      throw new Error("Unauthorized");
    }

    if (member.role === "admin") {
      throw new Error("Admin cannot be removed");
    }

    if (currentMember._id === args.memberId && currentMember.role === "admin") {
      throw new Error("Cannot remove self if self is an admin");
    }

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(args.memberId);

    return args.memberId;
  },
});
