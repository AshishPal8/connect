import { User } from "@/types/user";
import { Card, CardDescription, CardHeader } from "../ui/card";
import Image from "next/image";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import Icon from "../ui/Icon";

const ProfileCard = ({ user }: { user: User }) => {
  console.log("User", user);
  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex items-center justify-center flex-row md:flex-col">
        <div className="relative rounded-full w-24 h-24 md:w-56 md:h-56">
          <Image
            src={user.profilePicture}
            alt={user.name}
            width={250}
            height={250}
            className="rounded-full w-24 h-24 md:w-56 md:h-56"
          />
          <Link
            href={`/profile/${user.username}/edit`}
            className="absolute bottom-3 right-3 bg-secondary rounded-full p-2"
          >
            <Icon icon={SquarePen} size={20} className="text-foreground" />
          </Link>
        </div>
        <div className="flex items-center justify-center flex-col">
          <h2 className="text-2xl md:text-4xl font-bold mt-0 md:mt-2">
            {user.name}
          </h2>
          <p className="text-sm md:text-lg text-center">{user.bio}</p>
        </div>
      </CardHeader>
      <CardDescription>
        <Separator />
        <div className="flex flex-col gap-2 p-4">
          <h2 className="text-lg md:text-xl font-bold mb-2">Socials</h2>
          <ul className="flex flex-wrap items-center gap-5">
            {user.socials?.map((social) => {
              let imageSrc = "";
              switch (social.type.toUpperCase()) {
                case "TWITTER":
                  imageSrc = "/twitter.png";
                  break;
                case "GITHUB":
                  imageSrc = "/github.png";
                  break;
                case "FACEBOOK":
                  imageSrc = "/facebook.png";
                  break;
                case "INSTAGRAM":
                  imageSrc = "/instagram.png";
                  break;
                case "LINKEDIN":
                  imageSrc = "/linkedin.png";
                  break;
                default:
                  imageSrc = "/internet.png";
                  break;
              }

              return (
                <Link
                  key={social.id}
                  className="flex items-center hover:cursor-pointer"
                  href={social.url}
                  target="_blank"
                >
                  <Image
                    src={imageSrc}
                    alt={social.type}
                    width={45}
                    height={45}
                    className="w-8 md:w-12 h-8 md:h-12"
                  />
                </Link>
              );
            })}
          </ul>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 p-4">
          <h2 className="text-lg md:text-xl font-bold mb-2">Interests</h2>
          <ul className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <li
                key={interest.id}
                className="text-sm md:text-xl border-2 border-primary rounded-2xl px-2 py-1 hover:bg-primary hover:text-white hover:cursor-pointer"
              >
                {interest.title}
              </li>
            ))}
          </ul>
        </div>
      </CardDescription>
    </Card>
  );
};

export default ProfileCard;
