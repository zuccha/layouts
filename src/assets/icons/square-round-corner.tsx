import { createIcon } from "@chakra-ui/react";

const SquareRoundCorner = createIcon({
  displayName: "LuSquareRoundCorner",
  path: (
    <svg
      className="lucide lucide-square-round-corner-icon lucide-square-round-corner"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 11a8 8 0 0 0-8-8" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </svg>
  ),
  viewBox: "0 0 24 24",
});

export default SquareRoundCorner;
