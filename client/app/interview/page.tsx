"use client";

import { useState } from "react";
import api from "@/services/api";

export default function InterviewPage(){

const [question,setQuestion]=useState("");
const [answer,setAnswer]=useState("");
const [feedback,setFeedback]=useState<any>(null);
const [loading,setLoading]=useState(false);

const [questions,setQuestions] = useState<any[]>([]);
const [current,setCurrent] = useState(0);
const [scores,setScores] = useState<number[]>([]);



const generateQuestion = async()=>{

try{

setLoading(true);

const res = await api.get(
"/ai/generate-questions"
);


const data = res.data.questions;


const allQuestions = [
  ...data.technicalQuestions,
  ...data.projectQuestions,
  ...data.HRQuestions
];


setQuestions(allQuestions);

setCurrent(0);

setQuestion(
  typeof allQuestions[0] === "string"
  ? allQuestions[0]
  : allQuestions[0].question
);

setFeedback(null);


}catch(error:any){

console.log(
error.response?.data || error.message
);

}

finally{

setLoading(false);

}

};







const submitAnswer = async()=>{

  console.log("SUBMIT FUNCTION RUNNING");

  if(!answer.trim()){
    alert("Please write answer");
    return;
  }

  try{

    setLoading(true);

    const res = await api.post(
      "/ai/evaluate-answer",
      {
        question,
        answer
      }
    );


    console.log("EVALUATION RESPONSE:", res.data);


    const evaluation = res.data.evaluation;


    setFeedback(evaluation);


    setScores([
      ...scores,
      evaluation.score
    ]);


  }catch(error:any){

    console.log(
      "EVALUATE ERROR:",
      error.response?.data || error.message
    );

  }
  finally{
    setLoading(false);
  }

};







return (

<div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">


<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
AI Mock Interview 🤖
</h1>





<button

onClick={generateQuestion}

className="bg-orange-600 px-6 py-3 rounded-xl text-white"

>

{
loading
?
"Generating..."
:
"Start Interview"
}

</button>






{
question &&

<div className="mt-8 max-w-3xl bg-orange-50 border border-orange-200 rounded-3xl p-5 sm:p-8">


<h2 className="text-orange-600 mb-4">

Question {current+1} / {questions.length}

</h2>



<p className="text-lg sm:text-xl text-gray-900">

{question}

</p>





<textarea

value={answer}

onChange={(e)=>setAnswer(e.target.value)}

placeholder="Type your answer here..."

className="
mt-6
w-full
h-40
bg-orange-50
border
border-orange-200
rounded-xl
p-4
text-gray-900
"

/>





<button
  type="button"
  onClick={() => {
    console.log("SUBMIT CLICKED");
    submitAnswer();
  }}
  className="
  mt-5
  bg-amber-600
  px-6
  py-3
  rounded-xl
  text-white
  cursor-pointer
  hover:bg-amber-700
  "
>
  Submit Answer
</button>



</div>

}








{
feedback &&

<div className="mt-8 max-w-3xl bg-orange-50 border border-orange-200 rounded-3xl p-5 sm:p-8">


<h2 className="text-2xl text-gray-900 font-bold">
AI Feedback
</h2>



<p className="text-green-600 mt-4 text-xl">

Score : {feedback.score}/10

</p>




<p className="text-gray-700 mt-4">

{feedback.feedback}

</p>



<p className="text-gray-600 mt-4">

Improvement:
<br/>

{feedback.improvements}

</p>



</div>

}







{
scores.length>0 && current === questions.length-1 &&

<div className="mt-8 max-w-3xl bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 sm:p-8">


<h2 className="text-2xl text-gray-900 font-bold">

Interview Completed 🎉

</h2>



<p className="text-gray-700 mt-4">

Average Score :

{
(
scores.reduce((a,b)=>a+b,0)
/ scores.length
).toFixed(1)
}

/10

</p>


</div>

}





</div>

)

}