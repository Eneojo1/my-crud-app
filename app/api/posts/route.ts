import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ======================
    // POSTS
    // ======================
    const posts = await prisma.posts.findMany({
      include: {
        author: {
          select: { id: true, fname: true, oname: true, lname: true },
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

      orderBy: {
        created_at: "desc",
      },
    });

    const postIds = posts.map((post) => post.id);

    const comments = await prisma.comments.findMany({
      where: { post_id: { in: postIds } },

      include: {
        author: {
          select: { id: true, fname: true, oname: true, lname: true },
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
      ...posts.map((p) => p.author.id),
      ...comments.filter((c) => c.author).map((c) => c.author!.id),
    ];

    // ======================
    // POST MEDIA
    // ======================
    const postMedia = await prisma.media.findMany({
      where: {
        entity_type: "post",
        entity_id: { in: postIds },
      },
    });

    // ======================
    // COMMENT MEDIA
    // ======================
    const commentMedia = await prisma.media.findMany({
      where: {
        entity_type: "comment",
        entity_id: { in: commentIds },
      },
    });

    // ======================
    // USER AVATARS
    // ======================
    const avatars = await prisma.media.findMany({
      where: {
        entity_type: "user",
        entity_id: { in: userIds },
        type: "avatar",
      },
    });

    // ======================
    // MERGE COMMENT MEDIA
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

    const result = posts.map((post) => {
      const { reactions, ...rest } = post;

      return {
        ...rest,
        author: {
          ...post.author,
          avatar:
            avatars.find((a) => a.entity_id === post.author.id)?.url || null,
        },

        media: postMedia.filter((media) => media.entity_id === post.id),

        comments: commentsWithMedia.filter((c) => c.post_id === post.id),

        likes: reactions.filter((reaction) => reaction.type === "like"),

        dislikes: reactions.filter((reaction) => reaction.type === "dislike"),
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// export async function POST(req: Request) {
//   try {
//     const form = await req.formData();
//     const avatar = form.get("avatar") as File | null;

//     let avatarUrl: string | null = null;

//     // ==========================
//     // Upload avatar to folder
//     // ==========================

//     if (avatar && avatar.size > 0) {
//       const bytes = await avatar.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const filename = `${Date.now()}-${avatar.name.replace(/\s+/g, "-")}`;

//       const uploadDir = path.join(
//         process.cwd(),
//         "public",
//         "uploads",
//         "avatars",
//       );

//       await fs.mkdir(uploadDir, {
//         recursive: true,
//       });

//       const filepath = path.join(uploadDir, filename);

//       await fs.writeFile(filepath, buffer);

//       avatarUrl = `/uploads/avatars/${filename}`;
//     }

//     // ==========================
//     // Hash password
//     // ==========================

//     const password = form.get("password") as string;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const socials = JSON.parse((form.get("socials") as string) || "[]");

//     // ==========================
//     // Create USER first
//     // ==========================

//     const user = await prisma.posts.create({
//       data: {
//         fname: form.get("fname") as string,
//         oname: form.get("oname") as string,
//         lname: form.get("lname") as string,
//         email: form.get("email") as string,
//         phone: form.get("phone") as string,
//         sex: form.get("sex") as any,
//         password: hashedPassword,
//         address: form.get("address") as string,
//         country_id: Number(form.get("country_id")),
//         state_id: Number(form.get("state_id")),
//         lga_id: Number(form.get("lga_id")),
//         role_id: Number(form.get("role_id")),
//         status_id: Number(form.get("status_id")),
//         socials,
//       },
//     });

//     // ==========================
//     // Save avatar in Media table
//     // AFTER user exists
//     // ==========================

//     if (avatarUrl) {
//       await prisma.media.create({
//         data: {
//           url: avatarUrl,
//           type: "avatar",
//           entity_type: "user",
//           entity_id: user.id,
//           is_thumbnail: false,
//         },
//       });
//     }
//     return NextResponse.json(user, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Failed to create user" },
//       { status: 500 },
//     );
//   }
// }
