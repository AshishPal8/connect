import ProfileCard from "@/components/profile/profileCard";
import ProfileInfo from "@/components/profile/profileInfo";
import { getUserProfile } from "@/lib/fetcher/user";
import { notFound } from "next/navigation";
import React from "react";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const user = await getUserProfile(username, true);

  if (!user) {
    return notFound();
  }

  return (
    <div className="container mx-auto my-20 md:my-32 flex flex-col lg:flex-row gap-3 min-h-[70vh] px-2 md:px-0">
      <div className="lg:w-1/3 w-full lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100vh-theme(spacing.32)*2)] lg:overflow-y-auto">
        <ProfileCard user={user} />
      </div>
      <div className="lg:w-2/3 w-full">
        <ProfileInfo user={user} />
      </div>
    </div>
  );
};

export default UserPage;
