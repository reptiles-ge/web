import { createLegalRoute } from "@/lib/createLegalRoute";

const route = createLegalRoute("privacy");

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
