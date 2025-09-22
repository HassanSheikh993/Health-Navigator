import { useState } from "react";
import { useContext } from "react";
export function Test1() {
  const user = useContext(MyContext); 
return(
  <>
  <h1>MY NAME IS {user}</h1>
  </>
)

 
}
