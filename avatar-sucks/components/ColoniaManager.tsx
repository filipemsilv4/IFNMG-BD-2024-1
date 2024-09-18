import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import JazidaSelector from "./Colonia/JazidaSelector";

export default function ColoniaTable() {
    return (
        <div>
            <Label>ID COLONIA</Label>
            <Input></Input>
            <Label>NOME</Label>
            <Input></Input>
            <Label>APELIDO</Label>
            <Input></Input>
            <div>
                <Checkbox />
                <Label>PRESSURIZADA</Label>
            </div>
            <Label>ESCOLHA A SUA JAZIDA</Label>
            <JazidaSelector />
        </div>
    )
}