import { createGuideArticleRoute } from "@/lib/createGuideArticleRoute";

const guide = createGuideArticleRoute("/insects/krazanis-bude");

export const generateStaticParams = guide.generateStaticParams;
export const generateMetadata = guide.generateMetadata;
export default guide.Page;
