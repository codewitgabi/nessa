import { notFound } from "next/navigation";
import type { IUserCardProps } from "../../types";
import { getUser, getUsers } from "../_actions/user.actions";

// Next.js will invalidate the cache when a
// request comes in, at most once every 1 hour
export const revalidate = 3600
 
// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const users: IUserCardProps[] = await getUsers();

  return users.map((user) => ({
    id: String(user.id),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUser({ id });

  if (!user) return notFound();

  return {
    title: `@${user.username}`,
    description: `${user.name} profile. ${user.company.name}`,
    openGraph: {
      type: "profile",
      url: `https://next-playground-red.vercel.app/users/${id}`,
      title: `${user.name} @${user.username}`,
      description: user.company.catchPhrase,
      images: [
        {
          url: "https://avatars.githubusercontent.com/u/99000002?v=4",
          width: 1200,
          height: 630,
        },
      ],
      siteName: "Nextjs playground",
    },
    keywords: [user.name, user.username, user.company.catchPhrase],
  };
}

async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <div className="">Page for user {id}</div>;
}

export default UserDetailPage;
