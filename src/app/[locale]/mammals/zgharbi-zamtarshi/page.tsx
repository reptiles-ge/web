import { createGuideArticleRoute } from "@/lib/createGuideArticleRoute";

const guide = createGuideArticleRoute("/mammals/zgharbi-zamtarshi");

export const generateStaticParams = guide.generateStaticParams;
export const generateMetadata = guide.generateMetadata;
export default guide.Page;
