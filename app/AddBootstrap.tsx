"use client";

import { useEffect } from "react";

export default function AddBootstrap()
{
    useEffect(()=>{
            console.log("frpom ddd")
            import("bootstrap/dist/js/bootstrap.bundle.js")
    },[])
    return <></>
}