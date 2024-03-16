import React from "react";
import { MacbookScroll } from "./ui/macbook-scroll";
import Link from "next/link";

export function MacbookScrollDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacbookScroll
        title={
          <span>
            "Caring for your health isn't a luxury, it's a necessity. <br />
              Your overall well-being is vital for a fulfilling life. 
            <br /> 
            Let's advocate for holistic health and make self-care a priority."
          </span>
        }
        src={`https://astrotalk.com/astrology-blog/wp-content/uploads/2023/07/achieve-inner-peace.png`}
        showGradient={false}
      />
    </div>
  );
}
