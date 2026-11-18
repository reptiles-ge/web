import { createGuideArticleRoute } from "@/lib/createGuideArticleRoute";

const guide = createGuideArticleRoute("/spiders/oboba-sakhlshi");

export const generateStaticParams = guide.generateStaticParams;
export const generateMetadata = guide.generateMetadata;
export default guide.Page;
