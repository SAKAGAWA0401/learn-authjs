// src/app/api/log/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// ※認証ライブラリ（例：next-auth）のセッション取得機能を利用する場合
// import getServerSession from 'next-auth';
import { auth } from '@/auth'; 
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // ① クライアント側から送られた JSON データをパース
    const clientData = await request.json();

    // ② サーバー側で IP アドレスを取得（リバースプロキシ経由の場合、x-forwarded-for を利用）
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : request.headers.get('x-real-ip') || 'unknown';

    // ③ サーバー側から fpIssue を取得（ミドルウェアでセットした cookie）
    const fpCookie = request.cookies.get('fpIssue')?.value || null;

    // ④ 認証済みユーザ情報の取得（NextAuth 等を利用している場合の例）
    const session = await auth();
    const user = session?.user || null;
    // ※ここでは、未実装のため仮に null とする
    // const user = null;

    // ⑤ クライアント側データとサーバー側情報を統合して 1 レコードにまとめる
    const logRecord = {
      fp_issue: fpCookie,
      document_character_set: clientData.documentCharacterSet,
      meta_description: clientData.description,
      navigator_language: clientData.navigatorLanguage,
      screen_color_depth: clientData.screenColorDepth,
      screen_width: clientData.screenWidth,
      screen_height: clientData.screenHeight,
      window_inner_width: clientData.windowInnerWidth,
      window_inner_height: clientData.windowInnerHeight,
      document_title: clientData.documentTitle,
      document_url: clientData.documentURL,
      navigator_user_agent: clientData.navigatorUserAgent,
      navigator_platform: clientData.navigatorPlatform,
      location_host: clientData.locationHost,
      location_pathname: clientData.locationPathname,
      document_referrer: clientData.documentReferrer,
      ip_address: ipAddress,
      user_id: user?.id || null,
      user_email: user?.email || null,
      created_at: new Date().toISOString(),
    };

    // ⑥ Neon (PostgreSQL) にレコードを保存
    await sql`
      INSERT INTO pageviews (
        fp_issue,
        document_character_set,
        meta_description,
        navigator_language,
        screen_color_depth,
        screen_width,
        screen_height,
        window_inner_width,
        window_inner_height,
        document_title,
        document_url,
        navigator_user_agent,
        navigator_platform,
        location_host,
        location_pathname,
        document_referrer,
        ip_address,
        user_id,
        user_email,
        created_at
      ) VALUES (
        ${logRecord.fp_issue},
        ${logRecord.document_character_set},
        ${logRecord.meta_description},
        ${logRecord.navigator_language},
        ${logRecord.screen_color_depth},
        ${logRecord.screen_width},
        ${logRecord.screen_height},
        ${logRecord.window_inner_width},
        ${logRecord.window_inner_height},
        ${logRecord.document_title},
        ${logRecord.document_url},
        ${logRecord.navigator_user_agent},
        ${logRecord.navigator_platform},
        ${logRecord.location_host},
        ${logRecord.location_pathname},
        ${logRecord.document_referrer},
        ${logRecord.ip_address},
        ${logRecord.user_id},
        ${logRecord.user_email},
        ${logRecord.created_at}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging pageview:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
