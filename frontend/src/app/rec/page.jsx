"use client"
import Theme from "@/components/Theme/page";

const Recommmendation = () => {
    const {theme} = Theme();
    
  return (
    <div className={ `min-h-[90.02vh] bg-primary theme-${theme}`}>page</div>
  )
}

export default Recommmendation