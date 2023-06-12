"use client";

import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

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
