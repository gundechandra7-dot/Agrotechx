import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Crop(){

  const [land,setLand] = useState("");
  const [rain,setRain] = useState("");
  const [result,setResult] = useState("");

  const navigate = useNavigate();

  const getRecommendation = async()=>{

    const res = await fetch("http://127.0.0.1:8000/recommend",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ land, rain })
    });

    const data = await res.json();
    setResult(data.crop);
  };

  return(
    <div className="container">

      <button onClick={()=>navigate("/")}>⬅ Back</button>

      <h2>🌾 What To Grow</h2>

      <select onChange={(e)=>setLand(e.target.value)}>
        <option value="">Select Land</option>
        <option value="red">Red Soil</option>
        <option value="dry">Dry Soil</option>
        <option value="wet">Wet Soil</option>
        <option value="clay">Clay Soil</option>
      </select>

      <select onChange={(e)=>setRain(e.target.value)}>
        <option value="">Select Rain</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button onClick={getRecommendation}>
        Get Recommendation
      </button>

      {result && (
        <div className="result-box">
          🌾 {result}
        </div>
      )}

    </div>
  );
}