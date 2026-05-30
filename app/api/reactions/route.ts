import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      guest,
      post_id,
      comment_id,
      type, // "like" | "dislike"
    } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Reaction type required" },
        { status: 400 },
      );
    }

    if (!post_id && !comment_id) {
      return NextResponse.json({ error: "Target required" }, { status: 400 });
    }

    // =========================
    // Identify owner (user OR guest)
    // =========================
    if (!user_id && !guest) {
      return NextResponse.json(
        { error: "User or guest required" },
        { status: 400 },
      );
    }

    const identity = user_id ? { user_id: Number(user_id) } : { guest };

    // =========================
    // Find existing reaction
    // =========================
    const existing = await prisma.reactions.findFirst({
      where: {
        ...identity,
        post_id: post_id ? Number(post_id) : null,
        comment_id: comment_id ? Number(comment_id) : null,
      },
    });

    // =========================
    // CASE 1: same reaction → remove (toggle off)
    // =========================
    if (existing?.type === type) {
      await prisma.reactions.delete({
        where: { id: existing?.id },
      });

      return NextResponse.json({ action: "removed" });
    }

    // =========================
    // CASE 2: opposite exists → update
    // =========================
    if (existing) {
      const updated = await prisma.reactions.update({
        where: { id: existing.id },
        data: { type },
      });

      return NextResponse.json({
        action: "updated",
        reaction: updated,
      });
    }

    // =========================
    // CASE 3: create new
    // =========================
    const created = await prisma.reactions.create({
      data: {
        user_id: user_id ? Number(user_id) : null,
        guest: guest ?? null,
        post_id: post_id ? Number(post_id) : null,
        comment_id: comment_id ? Number(comment_id) : null,
        type,
      },
    });

    return NextResponse.json({
      action: "created",
      reaction: created,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
