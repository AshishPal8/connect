import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

function OAuth() {
  return (
    <div className="w-full flex items-center justify-center my-5">
      <Button size="lg" variant="outline" className="w-full">
        <Image src="/google.png" alt="Google" width={25} height={25} /> Continue
        with Google
      </Button>
    </div>
  );
}

export default OAuth;
