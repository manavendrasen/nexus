import Question from "./Question";

interface Survey {
  slug: string;
  title: string;
  desc?: string;
  createdBy?: string;
  status?: string;
  responseCount?: number;
  questions?: Question[];
  responses?: Response[];
}

export default Survey;
