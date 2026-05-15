import { NextResponse } from "next/server";
import { prisma } from "./prisma";

const modelMap = {
  users: prisma.users,
  roles: prisma.roles,
  statuses: prisma.statuses,
  locations: prisma.locations,
} as const;

const orderByMap: Record<string, any> = {
  users: { fname: "asc" },
  roles: { name: "asc" },
  statuses: { name: "asc" },
  locations: { name: "asc" },
};

type ModelName = keyof typeof modelMap;

export default function crudHandlers(model: ModelName) {
  return {
    GET: async (req: Request) => {
      try {
        const { searchParams } = new URL(req.url);

        const where: Record<string, any> = {};

        if (!(model in prisma)) {
          return NextResponse.json(
            { error: `Invalid model: ${model}` },
            { status: 400 },
          );
        }

        // 🔥 LOCATION TREE
        if (model === "locations") {
          const parentId = searchParams.get("parent_id");
          const type = searchParams.get("type");

          const locationWhere: any = {};

          // COUNTRY → STATE → LGA
          if (parentId) {
            locationWhere.parent_id = Number(parentId);
          }

          // ROOT LEVEL (countries)
          if (type) {
            locationWhere.type = type;
          }

          const items = await prisma.locations.findMany({
            where: locationWhere,
            orderBy: {
              name: "asc",
            },
          });

          return NextResponse.json(items);
        }

        // DEFAULT MODE

        const items =
          model === "users"
            ? await prisma.users.findMany({
                where,
                include: {
                  country: true,
                  state: true,
                  lga: true,
                  role: true,
                  status: true,
                },
                orderBy: { fname: "asc" },
              })
            : await (prisma[model] as any).findMany({
                where,
                orderBy: orderByMap[model] ?? { id: "asc" },
              });

        return NextResponse.json(items);
      } catch (err) {
        console.error(err);

        return NextResponse.json(
          { error: `Failed to fetch ${String(model)}` },
          { status: 500 },
        );
      }
    },

    POST: async (req: Request) => {
      try {
        const body = await req.json();

        // ======================
        // LOCATION VALIDATION
        // ======================
        if (model === "locations") {
          // REQUIRED FIELDS
          if (!body.name || !body.type) {
            return NextResponse.json(
              { error: "Name and type are required" },
              { status: 400 },
            );
          }

          // VALID TYPES
          const validTypes = ["country", "state", "lga"];

          if (!validTypes.includes(body.type)) {
            return NextResponse.json(
              {
                error: `Invalid location type. Allowed: ${validTypes.join(", ")}`,
              },
              { status: 400 },
            );
          }

          // STATES + LGAs MUST HAVE PARENT
          if (
            (body.type === "state" || body.type === "lga") &&
            !body.parent_id
          ) {
            return NextResponse.json(
              {
                error: `${body.type} requires parent_id`,
              },
              { status: 400 },
            );
          }
        }

        const item = await (prisma[model] as any).create({
          data: body,
        });

        return NextResponse.json(item, { status: 201 });
      } catch (err) {
        return NextResponse.json(
          {
            error: `Failed to create ${String(model)}`,
          },
          { status: 500 },
        );
      }
    },

    PUT: async (req: Request, { params }: any) => {
      try {
        const { id } = await params;
        const body = await req.json();

        const updated = await (prisma[model] as any).update({
          where: { id: Number(id) },
          data: body,
        });
        return NextResponse.json(updated);
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to update ${String(model)}` },
          { status: 500 },
        );
      }
    },

    DELETE: async (req: Request, { params }: any) => {
      try {
        const { id } = await params;

        // ======================
        // LOCATION SAFE DELETE
        // ======================
        if (model === "locations") {
          const children = await prisma.locations.count({
            where: { parent_id: Number(id) },
          });

          const users = await prisma.users.count({
            where: {
              OR: [
                { country_id: Number(id) },
                { state_id: Number(id) },
                { lga_id: Number(id) },
              ],
            },
          });

          if (children > 0) {
            return NextResponse.json(
              { error: "Cannot delete location with sub-locations" },
              { status: 400 },
            );
          }

          if (users > 0) {
            return NextResponse.json(
              { error: "Cannot delete location assigned to users" },
              { status: 400 },
            );
          }
        }

        await (prisma[model] as any).delete({
          where: { id: Number(id) },
        });

        return NextResponse.json({ success: true });
      } catch (err: any) {
        console.error("DELETE ERROR:", err);

        return NextResponse.json({ error: err }, { status: 500 });
      }
    },
  };
}
