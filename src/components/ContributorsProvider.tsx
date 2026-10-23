"use client";

import { createContext, type ReactNode, useContext } from "react";

import {
  type ContributorDirectory,
  NO_CONTRIBUTORS,
} from "@/lib/contributorCredits";

const ContributorsContext =
  createContext<ContributorDirectory>(NO_CONTRIBUTORS);

export function ContributorsProvider({
  children,
  directory,
}: {
  children: ReactNode;
  directory: ContributorDirectory;
}) {
  return (
    <ContributorsContext.Provider value={directory}>
      {children}
    </ContributorsContext.Provider>
  );
}

export function useContributorDirectory() {
  return useContext(ContributorsContext);
}
