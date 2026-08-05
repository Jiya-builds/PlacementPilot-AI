"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
}


export default function StatCard({
  title,
  value,
  subtitle,
  color,
  icon: Icon,
}: Props) {


return (

<div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-purple-500 transition-all duration-300">


<div className="flex justify-between items-center">


<div>

<p className="text-gray-400">
{title}
</p>


<h2 className="text-4xl font-bold text-white mt-3">
{value}
</h2>


<p className={`mt-3 ${color}`}>
{subtitle}
</p>


</div>



<div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">

<Icon 
size={32}
className={color}
/>

</div>


</div>


</div>

)

}