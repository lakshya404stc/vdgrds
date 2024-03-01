"use client";
import React, { useCallback, useState } from 'react';
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import axios, { AxiosResponse } from 'axios';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '../../components/ui/dialog';
import { Button, ButtonProps, buttonVariants } from '../../components/ui/button';
import {LucideArrowDownNarrowWide, MinusCircle, ArrowRight, CloudFog } from 'lucide-react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Spinner from '@/components/Spinner';
import { redirect } from 'next/navigation';
import { CardContent } from '@/components/Card-1';


interface FileObject extends Blob {
  name: string;
  // Define other properties of the file object here if needed
}

function Page() {
  const [files, setFiles] = useState<number>(0);

  const [files_real, setFiles_real] = useState<FileObject[]>([]);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handelremove = async(item: FileObject) => {
    const updatedFiles = files_real.filter(obj => obj !== item);
    await setFiles_real(updatedFiles);
    console.log(files_real)
  }
  const selectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = true; // Allow multiple files to be selected
    input.onchange = (e) => {
      const fileList = e?.target?.files; // Use fileList instead of a single file
      if (fileList) {
        const updatedFilesReal = [...files_real];
        for (let i = 0; i < fileList.length; i++) {
          updatedFilesReal.push(fileList[i]);
        }
        setFiles_real(updatedFilesReal);
      }
    };
    input.click();
  };

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const dropFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files;
  };
  const handelview = async(item: FileObject) => {
    window.open(URL.createObjectURL(item), '_blank');
  }

  const handelsend = async() =>{
    setLoading(true)
    const data = {
        "description": description,
        "Images": files_real
    }
    const response: AxiosResponse | undefined = await axios.post("URL", data)
    try{
      if(response?.data?.success === "true"){ 
        console.log(response)
      }
      else{
        console.log(data)
      }
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const updatedFilesReal = [...files_real];
    acceptedFiles.forEach(element => {
      console.log(element);
      updatedFilesReal.push(element);
    });
    setFiles_real(updatedFilesReal);
  }, [files_real]);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value); // Update description state
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <MaxWidthWrapper className="mb-5 mt-2 sm:mt-5 flex flex-wrap flex-col items-center text-center justify-center">
        <div>
          <h1 className="mx-auto  max-w-2xl text-center sm:text-3xl text-3xl md:text-4xl lg:text-5xl">
            Allow us to create<span className="text-blue-600"> Thumbnails</span> for you
          </h1>
          <p className="mx-auto mt-5 max-w-prose text-zinc-800 text-center sm:text-lg">
            Guaranteed 27x Support
          </p>
          
        </div>
      </MaxWidthWrapper>
      
      <div className=' mb-3 items-end justify-end text-right sm:mr-20 mr-4 flex flex-col'> 
          <p> View Our Work</p>
          <LucideArrowDownNarrowWide/></div>

          <form onSubmit={handelsend}>
        <div className=" flex flex-col sm:flex-row w-full mx-auto px-auto mt-5 justify-between">
          <div className="w-full  sm:w-[500px] mx-5 border border-blue-200 rounded-lg mr-auto shadow-lg h-full min-h-[500px] text-lg sm:text-xl resize-none">
            <div
              className="transition-transform hover:scale-105 w-[93%] mx-auto mt-2"
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
              <p className="text-xs text-black"> Uploaded</p>
            </div>
          </CardContent>
            </div>
            
            <div className="mt-5 block">
              {files_real.map((item: FileObject, index: number) => (
                <div key={index}>
                  <div className="w-[82%] mx-auto  relative shadow-lg rounded border bg-white overflow-hidden m-2 p-4 text-md transition-transform duration-300 hover:scale-105">
                    <span className="absolute inset-0"></span>
                    <p className="text-left text-md ">{item?.name.substring(0,10)}...</p>
                    <div className="absolute top-1 right-1 flex space-x-2 items-center">
                      <div onClick={() => handelremove(item)}>
                        <MinusCircle className="cursor-pointer mt-3" size={20} />
                      </div>
                      <div onClick={() => handelview(item)}>
                        <ArrowRight className="cursor-pointer mt-3" size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="  w-full ">
            <div className="w-full rounded-lg flex flex-col h-full">
              <textarea 
                value={description}
                required
                placeholder='Enter Your Description'
                onChange={handleDescriptionChange}
                className="text-sm sm:text-md border border-blue-200  w-[90%] mx-10 rounded-lg mt-1 shadow-lg h-full  min-h-[500px] p-5 resize-none flex-grow"></textarea>
            </div>
          </div>
        </div>
        <div className='mt-10 mb-10 px-auto'>
          <Button type='submit' className='mx-auto  flex flex-col min-w-[150px] sm:min-w-[400px]'>
            {loading ? <Spinner /> : "Upload"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default Page;
