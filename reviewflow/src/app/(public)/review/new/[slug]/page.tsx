import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function WriteReviewRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/r/${slug}`);
}
