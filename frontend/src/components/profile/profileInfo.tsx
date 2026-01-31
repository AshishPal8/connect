import { User } from "@/types/user";
import { Card } from "../ui/card";

const ProfileInfo = ({ user }: { user: User }) => {
  return (
    <Card className="w-full rounded-3xl h-[4000px] p-4">
      <h1>Profile Info</h1>
    </Card>
  );
};

export default ProfileInfo;
