"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "./ui/button";
import { Label } from "./ui/label";
import { useState } from "react";
import Spinner from "./Spinner";
import Chatbot from "./chatbot/Chatbot";

const formSchema = z.object({
  url: z.string().min(4, {
    message: "Channel Link must be at least 6 characters.",
  }),
  id: z.string().default("12345"), // New id field with default value
});

export function Search() {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      id: "1245345", // Default value for id
    },
  });
  const [loading, setLoading] = useState(false);
  const [button_loading, setButton_loading] = useState(false);

  async function onSubmit(data: { id: string; url: string }) { // Modified onSubmit function to include id
    try {
      setButton_loading(true);
      console.log(data)
      const response = await axios.post("http://127.0.0.1:5000/process-url", data); // Sending both url and id
      console.log(response.data);
      if (response) {
        setLoading(true);
        console.log("Channel Link has been processed. User can ask any sort of questions now.");
      } else {
        console.log("User Creation Failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      console.log("User Creation Failed");
    } finally {
      setButton_loading(false);
    }
  }

  return (
    <>
      <div className="grid w-full max-w-3xl items-center gap-1.5">
        <form onSubmit={handleSubmit(onSubmit)}> 
          <Input 
            id="exampleFormControlInput3"
            type="text" 
            {...register("url")}
            required
            placeholder="Channel Link"
            className="peer block min-h-[auto] max-w-[95%] rounded border-3 mt-10 mb-5 bg-transparent px-3 py-[0.32rem] shadow-xl leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 mx-auto data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition dark:text-neutral-200 dark:placeholder:text-neutral-200"
          />
          <Button style={{width:"80%"}} className={buttonVariants()} type="submit" disabled={button_loading}>
            {button_loading ? <Spinner /> : "Process"}
          </Button>
        </form>
      </div>
      <div style={{minWidth:"70%"}}>
        {loading && <Chatbot />} {/* Conditionally render ChatBot based on loading state */}
      </div>
    </>
  )
}
