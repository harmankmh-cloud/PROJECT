import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  businessName: z.string().max(120).optional(),
  category: z.enum(["help", "suggestion", "bug", "billing", "other"]).default("help"),
  message: z.string().min(10).max(4000),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const admin = createServiceClient();

    if (!admin) {
      return NextResponse.json(
        { error: "Support is not configured yet. Email the site owner directly." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let businessName = body.businessName?.trim() || null;
    if (user && !businessName) {
      const { data: business } = await admin
        .from("businesses")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();
      businessName = business?.name ?? null;
    }

    const { error } = await admin.from("platform_messages").insert({
      user_id: user?.id ?? null,
      email: body.email.trim(),
      name: body.name?.trim() || null,
      business_name: businessName,
      category: body.category,
      message: body.message.trim(),
      status: "new",
    });

    if (error) {
      if (error.message.includes("platform_messages") || error.code === "42P01") {
        return NextResponse.json(
          {
            error:
              "Support inbox is not set up yet. The owner needs to run platform_messages.sql in Supabase.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please fill in email and a message (10+ characters)." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }
}
