interface Question {
  index?: number;
  type?: string;
  text: string;
  options?: string[];
  surveySlug?: string;
}

export default Question;
