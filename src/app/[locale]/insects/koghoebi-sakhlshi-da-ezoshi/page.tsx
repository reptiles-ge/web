import { createGuideArticleRoute } from "@/lib/createGuideArticleRoute";

const guide = createGuideArticleRoute("/insects/koghoebi-sakhlshi-da-ezoshi");

export const generateStaticParams = guide.generateStaticParams;
export const generateMetadata = guide.generateMetadata;
export default guide.Page;
