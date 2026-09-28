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

<div className="rounded-3xl border border-orange-200 bg-orange-50 backdrop-blur-xl p-5 md:p-6 hover:border-orange-500 transition-all duration-300">


<div className="flex justify-between items-center">


<div>

<p className="text-gray-600">
{title}
</p>


<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
{value}
</h2>


<p className={`mt-3 ${color}`}>
{subtitle}
</p>


</div>



<div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl bg-orange-500/20 flex items-center justify-center">

<Icon 
size={32}
className={color}
/>

</div>


</div>


</div>

)

}