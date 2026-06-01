"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { formatTime } from "@/lib";

interface IDueDateSelector {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export const DueDateSelector: React.FC<IDueDateSelector> = ({
    date,
    setDate,
}) => {
    const [open, setOpen] = React.useState(false);
    const [time, setTime] = React.useState("00:00:00");

    React.useEffect(() => {
        if (!date) return;
        setTime(formatTime(date));
    }, [date]);

    const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value;
        setTime(timeStr);
        if (!date) return;

        const timeValues = timeStr.split(":");
        const hours = timeValues[0] ? parseInt(timeValues[0], 10) : 0;
        const minutes = timeValues[1] ? parseInt(timeValues[1], 10) : 0;
        const seconds = timeValues[2] ? parseInt(timeValues[2], 10) : 0;
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, seconds);
        setDate(newDate);
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">
                    Дедлайн виконання
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 justify-between font-normal"
                        >
                            {date ? date.toLocaleDateString() : "Оберіть дату"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            required
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">
                    Час виконання
                </Label>
                <Input
                    required
                    type="time"
                    id="time-picker"
                    step="1"
                    value={time}
                    onChange={handleChangeTime}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    );
};
