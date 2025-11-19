import { User } from "@/types/user";
import React from "react";
import { Card, CardHeader } from "../ui/card";
import Image from "next/image";

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex items-center justify-center flex-col">
        <Image
          src={user.profilePicture}
          alt={user.name}
          width={250}
          height={250}
          className="rounded-full"
        />
        <h2 className="text-4xl font-bold mt-2">{user.name}</h2>
        <p className="text-xl">{user.bio}</p>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard;
