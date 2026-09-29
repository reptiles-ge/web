import { createGuideArticleRoute } from "@/lib/createGuideArticleRoute";

const guide = createGuideArticleRoute("/insects/chrchili-tansatsmelshi");

export const generateStaticParams = guide.generateStaticParams;
export const generateMetadata = guide.generateMetadata;
export default guide.Page;
