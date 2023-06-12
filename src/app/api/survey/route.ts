import { getRedisUrl } from "@/lib/Redis";
import Redis from "ioredis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis(getRedisUrl());

/**
 * SEND RESPONSE TO REDIS and return 200
 * @param req Request
 * @param res Response
 * @returns status 200
 */

type SurveyResponse = {
  response: {
    surveySlug: string;
    userEmail: string;
    textResponses: string[];
    optionResponses: Number[];
  };
};

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "No body found",
      },
    });
  }

  const { response } = (await request.json()) as SurveyResponse;

  await redis.lpush(
    response.surveySlug,
    JSON.stringify({
      [response.userEmail]: {
        textResponses: response.textResponses,
        optionResponses: response.optionResponses,
      },
    })
  );

  return NextResponse.json({
    status: 200,
  });
}

export async function GET(request: NextRequest) {
  const surveySlug = request.nextUrl.searchParams.get("surveySlug");

  if (surveySlug) {
    const response = await redis.lrange(surveySlug, 0, -1);

    const parsedResponse = response.map(res => JSON.parse(res));

    return NextResponse.json({
      response: parsedResponse,
    });
  } else {
    return NextResponse.json({
      status: 400,
      body: {
        error: "No survey slug found",
      },
    });
  }
}
