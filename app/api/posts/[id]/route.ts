import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  try {
    const id = Number(params.id);

    // ======================
    // POST
    // ======================

    const post = await prisma.posts.findUnique({
      where: {
        id,
      },

      include: {
        author: {
          select: {
            id: true,
            fname: true,
            oname: true,
            lname: true,
          },
        },

        shares: {
          include: {
            user: true,
          },
        },

        reactions: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          error: "Post not found",
        },

        {
          status: 404,
        },
      );
    }

    // ======================
    // COMMENTS
    // ======================

    const comments = await prisma.comments.findMany({
      where: {
        post_id: id,
      },

      include: {
        author: {
          select: {
            id: true,
            fname: true,
            oname: true,
            lname: true,
          },
        },

        reactions: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        created_at: "asc",
      },
    });

    const commentIds = comments.map((c) => c.id);

    const userIds = [
      post.author.id,

      ...comments.filter((c) => c.author).map((c) => c.author!.id),
    ];

    // ======================
    // POST MEDIA
    // ======================

    const postMedia = await prisma.media.findMany({
      where: {
        entity_type: "post",

        entity_id: id,
      },
    });

    // ======================
    // COMMENT MEDIA
    // ======================

    const commentMedia = await prisma.media.findMany({
      where: {
        entity_type: "comment",

        entity_id: {
          in: commentIds,
        },
      },
    });

    // ======================
    // AVATARS
    // ======================

    const avatars = await prisma.media.findMany({
      where: {
        entity_type: "user",

        entity_id: {
          in: userIds,
        },

        type: "avatar",
      },
    });

    // ======================
    // COMMENTS WITH MEDIA
    // ======================

    const commentsWithMedia = comments.map((comment) => {
      const { reactions, ...rest } = comment;

      return {
        ...rest,

        author: comment.author
          ? {
              ...comment.author,

              avatar:
                avatars.find((a) => a.entity_id === comment.author!.id)?.url ||
                null,
            }
          : null,

        media: commentMedia.filter((media) => media.entity_id === comment.id),

        likes: reactions.filter((reaction) => reaction.type === "like"),

        dislikes: reactions.filter((reaction) => reaction.type === "dislike"),
      };
    });

    // ======================
    // FINAL RESULT
    // ======================

    const { reactions, ...rest } = post;

    const result = {
      ...rest,

      author: {
        ...post.author,

        avatar:
          avatars.find((a) => a.entity_id === post.author.id)?.url || null,
      },

      media: postMedia,

      comments: commentsWithMedia,

      likes: reactions.filter((reaction) => reaction.type === "like"),

      dislikes: reactions.filter((reaction) => reaction.type === "dislike"),
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        error: "Failed to fetch post",
      },

      {
        status: 500,
      },
    );
  }
}
