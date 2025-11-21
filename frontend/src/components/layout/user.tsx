"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserStore } from "@/store/userStore";
import api from "@/lib/axios/client";
import { handleError } from "@/lib/handleError";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

function UserDropdown({ isMenuOpen, setIsMenuOpen }: UserDropdownProps) {
  const { user } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      if (res.status === 200) {
        useUserStore.setState({ user: null, token: null });
      }
      router.push("/signin");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user?.profilePicture || ""}
                  alt={user?.name || "Profile"}
                />
                <AvatarFallback className="text-xs">
                  {user?.name?.[0]?.toUpperCase() || "B"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`/profile/${user?.username}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem>{user?.name}</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="flex items-center cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      )}

      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
}

export default UserDropdown;
