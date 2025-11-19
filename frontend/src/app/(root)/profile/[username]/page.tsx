import ProfileCard from "@/components/profile/profileCard";
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

  console.log("User", user);

  if (!user) {
    return notFound();
  }

  return (
    <div className="container mx-auto min-h-screen mt-32">
      <div className="w-1/3">
        <ProfileCard user={user} />
      </div>
      <div className="w-2/3"></div>
    </div>
  );
};

export default UserPage;
