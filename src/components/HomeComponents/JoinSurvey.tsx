"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";

interface JoinSurveyProps {}

export const JoinSurvey: React.FC<JoinSurveyProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  return (
    <div className="flex gap-2 items-center">
      <Input placeholder="Enter Survey ID" ref={inputRef} />
      <Button
        variant="secondary"
        onClick={() => {
          console.log("inputRef.current?.value", inputRef.current?.value);

          if (inputRef.current?.value) {
            router.push(`/${inputRef.current?.value}`);
          }
        }}
      >
        Join
      </Button>
    </div>
  );
};
