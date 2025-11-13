export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/projects/${slug}.mdx`);

  return <Post />;
}

export function generateStaticParams() {
  return [{ slug: "consejo" }, { slug: "about" }];
}

export const dynamicParams = false;
