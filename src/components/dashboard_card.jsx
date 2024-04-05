import { Button } from '@supabase/ui'
import "@/styles/dashboard.css";
const FileCard = ({ file }) => {
  return (
    <div style={{ margin: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h4>{file.name}</h4>
      <h4>{file.last_opened}</h4>
      <Button>Edit</Button>
    </div>
  );
};

export default FileCard;