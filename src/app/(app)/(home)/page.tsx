import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  return (
   <div className="m-6">
    <Button variant={"elevated"}>I am button</Button>
    <div className="m-6">
    <Input placeholder="testing border"/>
    </div>

    <div className="m-6">
      <Progress value={50} />
    </div>

    <div className="m-6">

      <Textarea placeholder="testing border"/>
    </div>
    <div className="m-6">

      <Checkbox/>
    </div>
      
   </div>
  );
}
