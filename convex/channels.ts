import { v } from "convex/values";

import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const create = mutation({
  args: { name: v.string(), workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const formattedName = args.name.replace(/\s+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: formattedName,
      workspaceId: args.workspaceId,
    });

    return channelId;
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      return [];
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    return channels;
  },
});

export const getById = query({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      return null;
    }

    const member = await getMember(ctx, channel.workspaceId, userId);

    if (!member) {
      return null;
    }

    return channel;
  },
});

export const update = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      throw new Error("Channel not found");
    }

    const member = await getMember(ctx, channel.workspaceId, userId);

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      throw new Error("Channel not found");
    }

    const member = await getMember(ctx, channel.workspaceId, userId);

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const [messages] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.id))
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
