import { getUserProfile } from "@/lib/fetcher/user";
import { notFound } from "next/navigation";
import React from "react";

const EditPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const resulvedParams = await params;
  const username = resulvedParams.username;

  const user = await getUserProfile(username, true);

  if (!user) {
    return notFound();
  }

  return <div>EditPage</div>;
};

export default EditPage;
