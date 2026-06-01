import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib";

interface IToRootButton {
    className?: string;
}

export const ToRootButton: FC<IToRootButton> = ({ className }) => {
    return (
        <Link href={"/boards"}>
            <Button variant={"outline"} className={cn(className)}>
                <Undo2 className="w-5 h-5 mr-1" />
                Повернутись на головну
            </Button>
        </Link>
    );
};

