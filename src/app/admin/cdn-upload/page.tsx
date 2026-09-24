import Link from "next/link";

import { AdminCdnUpload } from "@/components/admin/AdminCdnUpload";
import { assertLocalAdminPage } from "@/lib/adminAccess";

export const dynamic = "force-dynamic";

export default function AdminCdnUploadPage() {
  assertLocalAdminPage();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link
        className="text-[13px] text-muted-foreground hover:text-foreground"
        href="/admin"
      >
        ← ადმინი
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
        ფოტოების CDN-ზე ატვირთვა
      </h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
        ფოტოები აიტვირთება იმავე კომპრესიით, როგორც სახეობის ფოტოები. ძირითადი
        JPEG/PNG URL-ები და AVIF/WebP ზომები გამოჩნდება ქვემოთ. Image manifest
        და ოპტიმიზებული სურათების კატალოგი PR-ში განახლდება; merge შენზეა.
        სახეობის გალერეა და MDX არ შეიცვლება.
      </p>
      <div className="mt-8">
        <AdminCdnUpload />
      </div>
    </main>
  );
}
