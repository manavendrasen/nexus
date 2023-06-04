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
  return (
    <Link href={`survey/${slug}`}>
      <div className="flex flex-col gap-1 border-2 bg-white border-slate-100 rounded-sm p-6 hover:border-slate-400">
        <h2 className="font-semibold">{title}</h2>
        <div className="text-sm text-slate-600 mb-4 flex items-center gap-2">
          <Link2 size={16} /> <p>{slug}</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p>
            {responseCount} {responseCount === 1 ? "response" : "responses"}
          </p>
          {status === "ACTIVE" ? (
            <p className="text-xs font-semibold text-green-500">{status}</p>
          ) : (
            <p className="text-xs font-semibold text-slate-500">{status}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
