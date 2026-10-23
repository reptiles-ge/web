import { createSpeciesHubRoute } from "@/lib/createSpeciesRoute";

const route = createSpeciesHubRoute("spiders");

export const dynamicParams = true;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
