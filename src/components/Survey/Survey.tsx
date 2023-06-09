import Link from "next/link";
import React from "react";
import { Link2 } from "lucide-react";

interface SurveyProps {
  title: string;
  responseCount: number;
  slug: string;
  status: string;
}

export const Survey: React.FC<SurveyProps> = ({
  title,
  responseCount,
  slug,
  status,
}) => {
  
  let statusMessage;
  switch (status) {
    case "DRAFT":
      statusMessage = <p className="text-xs font-semibold">👩‍💻 {status}</p>;
      break;
    case "COMPLETE":
      statusMessage = <p className="text-xs font-semibold">✅ {status}</p>;
      break;
    case "ACTIVE":
      statusMessage = <p className="text-xs font-semibold ">😎 {status}</p>;
      break;
    default:
      break;
  }
  return (
    <Link href={`survey/${slug}`}>
      <div
        className={`flex flex-col gap-1 bg-card rounded p-6 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all ease-in ${
          status === "ACTIVE" && "border-accent border-b-2"
        }`}
      >
        <h2 className="font-semibold">{title}</h2>
        <div className="text-sm mb-4 flex items-center gap-2">
          <Link2 size={16} /> <p>{slug}</p>
        </div>
        <div className="flex justify-start items-center text-sm">
          {/* <p>
            {responseCount} {responseCount === 1 ? "response" : "responses"}
          </p> */}
          {statusMessage}
        </div>
      </div>
    </Link>
  );
};
