import { createSpeciesHubRoute } from "@/lib/createSpeciesRoute";

const species = createSpeciesHubRoute("scorpions");

export const generateMetadata = species.generateMetadata;
export const generateStaticParams = species.generateStaticParams;

export default species.Page;
