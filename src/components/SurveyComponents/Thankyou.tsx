import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface ThankyouProps {}

export const Thankyou: React.FC<ThankyouProps> = ({}) => {
  const { width, height } = useWindowSize();

  const colors = [
    "#f38ba8",
    "#fab387",
    "#a6e3a1",
    "#89b4fa",
    "#cba6f7",
    "#f5c2e7",
  ];
  return (
    <>
      <Confetti
        width={width}
        height={height}
        colors={colors}
        numberOfPieces={100}
      />
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">
          Thanks for participating in the survey!
        </h2>
        <p className="text-muted-foreground">
          Once the survey is marked as complete, you will be able to see the
          results.
        </p>
      </div>
    </>
  );
};
