interface Response {
  surveySlug: string;
  userEmail: string;
  textResponses: string[];
  optionResponses: number[];
  coordinates?: number[];
  name?: string;
}

export default Response;
