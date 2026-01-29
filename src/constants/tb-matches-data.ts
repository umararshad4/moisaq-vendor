import { TbMatchRow } from "@/types";

/**
 * Mock data for TB Matches overlay – term base source/target pairs for the current segment.
 * Used when the user clicks the TB button in the segment viewer header.
 */
export const TB_MATCHES_MOCK_DATA: TbMatchRow[] = [
  { sourceTerm: "upper back", targetTerm: "haut du dos" },
  { sourceTerm: "upper spine", targetTerm: "colonne vertébrale" },
  { sourceTerm: "overall movement", targetTerm: "mouvement global" },
];
