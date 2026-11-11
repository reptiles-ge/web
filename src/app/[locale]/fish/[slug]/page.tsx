import { createSpeciesHubRoute } from "@/lib/createSpeciesRoute";

const species = createSpeciesHubRoute("fish");

export const dynamicParams = true;
export const generateMetadata = species.generateMetadata;
export const generateStaticParams = species.generateStaticParams;

export default species.Page;
