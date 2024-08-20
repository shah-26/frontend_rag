'use client'
import { useState, useEffect } from "react"
export default function Query(){
    async function useQueryFun(){
        // const text = 
        let fetchedResult = await fetch(`http://localhost:8000/question`,{
            headers:{
                "Content-Type": "application/json",
            },
            method:"POST",
            body: JSON.stringify({ question: queryText, session_id:localStorage.getItem("session_id") }),
        })
        const data = await fetchedResult.json()
        setFetchedResult(data.status)
            let streamEvent = new EventSource(`http://localhost:8000/event/${localStorage.getItem("session_id")}`)
            streamEvent.onmessage = (event) => {
                console.log("Event data:",event);
                setFetchedResult((d) => {
                   if (d === "Processing") d = ''
                   return d + ' ' + event.data
                })
            };
            
            streamEvent.onerror = (error) => {
                console.error("SSE Error:", error);
                streamEvent.close(); // Close the connection on error
            };
            return () => {
                streamEvent.close();
            };
        

        
        // Cleanup on component unmount
        

    }
    function formSubmit(event:React.FormEvent<HTMLFormElement>){
            setFileUpload(1)
            event.preventDefault(); // Prevents the form from reloading the page
            // debugger
            const formData = new FormData(event.currentTarget);
            fetch('http://localhost:8000/uploadfiles', { // Replace with your server endpoint
                method: 'POST',
                body: formData,
            })
            .then(async response => {
                try{
                    const resp = await response.json()
                    localStorage.setItem("session_id",resp.session_id)
                    setFileUpload(2)
                }catch(error){
                    console.log(error)
                }
                
            }) // Assuming server responds with JSON
            .catch(error => {
                // document.getElementById('response').innerText = 'An error occurred.';
                console.error('Error:', error);
            });
    }
    const [queryText, setqueryText] = useState<string>("") 
    const [fetchedResult,setFetchedResult] = useState<string>("")
    const [fileUpload, setFileUpload] = useState<number>(0)
    // const [outputText,setOutputText] = useState<string>("")
    // const [ind,setind]= useState<number>(0)
    // useEffect(() => {
    //     if(fetchedResult && fetchedResult !== "Processing"){
    //         while(ind < outputText.length){

    //         }
    //     }
    // },[fetchedResult])
    return (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <h3 className="mb-5 bolder">Upload any .txt or .csv files and query insights!</h3>  
            <form id="submit-form" encType="multipart/form-data" onSubmit={formSubmit}>
                <input name="files" type="file" onChange={() => setFileUpload(0)} multiple></input>
                <button type="submit" className="btn btn-primary" id="">Upload Files</button>
            </form>
            <div>{fileUpload == 2 ? "Upload Successful!" : fileUpload == 1 ? "Saving Files..." : ""}</div>
            <input type="text" className="form-control my-2"  placeholder="Enter query" onChange={(e) => setqueryText(e.target.value)}></input>
            <button type="button" className="btn btn-success" onClick={useQueryFun}>Send Query</button>
            {fetchedResult === "Processing" ? <p>Loading...</p> : ''}
            {fetchedResult && fetchedResult !== "Processing" ? <div className="chat-div border border-rounded">
                    {fetchedResult}
                </div> : '' }
        </div>
        

    )
} 
