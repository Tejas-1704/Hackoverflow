import Image from "next/image";
"use client"
import {MacbookScrollDemo} from "../components/macbook";
import { GlobeDemo } from "@/components/globe";
import Footer from "../components/footer/page"

export default function Home() {
  return (
    <main className="bg-zinc-800 mt-0" >
      <MacbookScrollDemo  />
      <GlobeDemo />
      <Footer/>
    </main>
  );
}






















{/* <div className="mt-16 text-white">Home</div>
<div className="theme-selection flex  ">
  {themes.map((t) => (
    <div key={t.id} onClick={()=>handleTheme(t)} className="text-tBase mx-16 border-2 border-borderclr px-8 py-2  rounded-md cursor-pointer">
      {t}
    </div>
  ))}
</div>
<ChatBot/> */}
