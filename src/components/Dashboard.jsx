import "@/styles/dashboard.css";
import FileCard from '@/components/dashboard_card';
import { Button } from '@supabase/ui'
import { supabase } from '@/utils/GetSupabaseClient'
import { React,useEffect,useState } from 'react';
import Popup from 'reactjs-popup';

useEffect(
function CreateFile(){

}
)

function DashboardPage(){
  const [files, setFiles] = useState([]);
  if(files == None){
  return (
    <div>
    <Popup trigger={<Button>Add File</Button>} position="right center">
    <input type='text' class='input-create-file'></input>
    <Button>Add</Button>
    </Popup>
    </div>
  );
  }
  else{
    return(
    {files,map(file => (
      <div>
      <FileCard key={file.file_id} id={file.file_id} name={file.file_name} last_opened={file.last_opened} />
      <Button>edit</Button>
      </div>
    ))}
    );
  }

export default DashboardPage;