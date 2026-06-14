import { NextResponse } from "next/server";

// Digital Asset Links for the Ziro Market Android app.
// Served at https://ziromarket.com/.well-known/assetlinks.json
//
// Enables:
//   - common.handle_all_urls  -> Android App Links (verified deep links)
//   - common.get_login_creds  -> credential / password sharing between site and app
export const dynamic = "force-static";

const ASSET_LINKS = [
  {
    relation: [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds",
    ],
    target: {
      namespace: "android_app",
      package_name: "com.ziro.market",
      sha256_cert_fingerprints: [
        "1F:9E:44:F7:A5:27:E5:1D:12:B8:4C:52:5F:CA:0C:56:C4:14:F4:2B:49:59:0A:1C:AA:DA:A8:A5:F6:AE:B7:C6",
      ],
    },
  },
];

export function GET() {
  return NextResponse.json(ASSET_LINKS);
}
