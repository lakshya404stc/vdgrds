"use client"
import { DollarSign, Users, CreditCard, Activity, ArrowRight, CloudFog, ArrowUpFromLine } from "lucide-react";
import Card, { CardProps } from "@/components/Card-1";
import { SalesProps } from "@/components/SalesCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { cn } from "../lib/utils";

const cardData: CardProps[] = [
  {
    label: "Total Revenue",
    amount: "$45,231.89",
    discription: "+20.1% from last month",
    icon: DollarSign
  },
  {
    label: "Subscriptions",
    amount: "+2350",
    discription: "+180.1% from last month",
    icon: Users
  },
  {
    label: "Sales",
    amount: "+12,234",
    discription: "+19% from last month",
    icon: CreditCard
  },
  {
    label: "Active Now",
    amount: "+573",
    discription: "+201 since last hour",
    icon: Activity
  }
];

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border p-5 shadow",
        props.className
      )}
    />
  );
}

const userSalesData: SalesProps[] = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    saleAmount: "+$1,999.00"
  },
  {
    name: "Jackson Lee",
    email: "isabella.nguyen@email.com",
    saleAmount: "+$1,999.00"
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    saleAmount: "+$39.00"
  },
  {
    name: "William Kim",
    email: "will@email.com",
    saleAmount: "+$299.00"
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    saleAmount: "+$39.00"
  }
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [discription, setdiscription] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Normal method to create data");
    const data = {
      title,
      discription,
      video: selectedFile as Blob
    };

    try {
      setLoading(true);
      console.log(data);
      const response = await axios.post("YOUR_API_ENDPOINT", data);
      if (response) {
        console.log("Form data submitted successfully");
        setTitle("");
        setdiscription("");
        setSelectedFile(null);
      } else {
        console.error("Failed to submit form data");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e?.target?.files[0] as File;
      handleFile(file);
    };
    input.click();
  };

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const dropFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file: File) => {
    console.log('Selected file:', file);
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <h1 className="max-w-3xl mx-10 my-5 sm:text-4xl text-3xl md:text-5xl lg:text-6xl">
        Dashboard
      </h1> 
      <section className="grid max-w-[95%] mx-10 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            discription={d.discription}
            icon={d.icon}
            label={d.label}
          />
        ))}

        <div
          className="transition-transform hover:scale-105"
          onClick={selectFile}
          onDrop={dropFile}
          onDragOver={allowDrop}
          style={{ background: "linear-gradient(135deg, #ffffff, #f0f0f0)" }} // Add gradient background
        >
          <CardContent>
            <div style={{ margin: "auto" }} className="flex flex-col items-center justify-center pt-5 pb-6">
              <CloudFog className="h-6 w-6 text-black mb-2" />
              <p className="mb-2 text-sm text-black">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-black">{selectedFile?.name} Uploaded</p>
            </div>
          </CardContent>
        </div>

        <div className="transition-transform hover:scale-105 w-full max-w-xl"
          style={{ background: "linear-gradient(135deg, #ffffff, #f0f0f0)" }} // Add gradient background
        > 
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-1">
                <input
                  type="text"
                  placeholder="Enter title..."
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm border border-gray-300 rounded-sm px-1 py-1 mb-1 h-8 w-full max-w-md" 
                />
                <div className="text-sm flex justify-between w-full max-w-md"> 
                  <textarea
                    required
                    placeholder="Enter your post..."
                    value={discription}
                    onChange={(e) => setdiscription(e.target.value)}
                    className="text-sm border border-gray-300 rounded-sm px-1 py-1 mr-1 mb-1 w-full max-w-[80%] h-20 resize-none" 
                  />
                  <button
                    type="submit"
                    title="Submit"
                    className={buttonVariants({
                      class: "inline-flex items-center justify-center whitespace-nowrap rounded-md t font-medium ring-offset-background  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm bg-blue-500 text-white  mb-1  hover:bg-blue-600 transition-colors h-20"
                    })}
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : <ArrowUpFromLine />}
                  </button>

                </div>
              </div>
            </CardContent>
          </form>
        </div>
      </section>
    </div>
  );
}
