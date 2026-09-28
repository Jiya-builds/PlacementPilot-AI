"use client";

import { useEffect,useState } from "react";
import api from "@/services/api";


export default function ProfilePage(){

const [user,setUser]=useState<any>(null);


useEffect(()=>{


const fetchProfile=async()=>{

try{

const res=await api.get(
"/auth/profile"
);


console.log(res.data);

setUser(res.data.user);


}catch(error:any){

console.log(
error.response?.data || error.message
);

}

};


fetchProfile();


},[]);



return(

<div className="min-h-screen bg-white p-4 sm:p-6 md:p-10">


<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
My Profile 👤
</h1>


{
user &&

<div className="max-w-xl rounded-3xl bg-orange-50 border border-orange-200 p-5 sm:p-8">


<h2 className="text-2xl text-gray-900 font-bold">
{user.name}
</h2>


<p className="text-gray-600 mt-3">
{user.email}
</p>


<div className="mt-6 text-gray-700">

<p>
Resume:
{
user.resume 
?
" Uploaded ✅"
:
" Not Uploaded ❌"
}
</p>


<p className="mt-3">
AI Analysis:
{
user.analysis
?
" Completed ✅"
:
" Pending"
}
</p>


</div>


</div>

}


</div>

)

}