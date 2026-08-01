import { NextResponse } from "next/server";
import { getCompaniesFile, saveCompaniesFile } from "../../../../lib/github.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { companies, sha } = await getCompaniesFile();
    return NextResponse.json({ companies, sha });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { companies, sha, message } = body;
    if (!Array.isArray(companies) || !sha) {
      return NextResponse.json({ error: "Ogiltig data skickades." }, { status: 400 });
    }
    const result = await saveCompaniesFile(companies, sha, message);
    return NextResponse.json({ sha: result.sha });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
