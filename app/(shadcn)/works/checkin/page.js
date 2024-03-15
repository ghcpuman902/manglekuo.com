'use client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table"



export default function Page() {
    const items = [
        {
            "category": "Bed",
            "details": [
                { "item": "Bed (Blue, King-sized)", "conditionIn": "", "conditionOut": "" },
                { "item": "Mattress", "conditionIn": "", "conditionOut": "" },
                { "item": "Mattress Protector", "conditionIn": "", "conditionOut": "" },
                { "item": "Bed Sheet (Grey)", "conditionIn": "", "conditionOut": "" },
                { "item": "Duvet", "conditionIn": "", "conditionOut": "" },
                { "item": "Duvet Cover (Grey)", "conditionIn": "", "conditionOut": "" },
                { "item": "Pillows (2)", "conditionIn": "", "conditionOut": "" },
                { "item": "Pillowcases (2, Grey)", "conditionIn": "", "conditionOut": "" },
                { "item": "Extra Bed Sheets (White)", "conditionIn": "", "conditionOut": "" },
                { "item": "Extra Pillowcases (2, Striped)", "conditionIn": "", "conditionOut": "" },
                { "item": "Extra Duvet Cover (Striped)", "conditionIn": "", "conditionOut": "" }
            ]
        },
        {
            "category": "Wardrobe",
            "details": [,
                { "item": "Wardrobe", "conditionIn": "", "conditionOut": "" },
                { "item": "Standing Mirror", "conditionIn": "", "conditionOut": "" },
                { "item": "Hangers (7 Wooden, 4 Plastic)", "conditionIn": "", "conditionOut": "" }
            ]
        },
        {
            "category": "Toilet",
            "details": [
                { "item": "Toilet Brush", "conditionIn": "", "conditionOut": "" },
                { "item": "Bin", "conditionIn": "", "conditionOut": "" },
                { "item": "Water-Absorbing Soap Dish", "conditionIn": "", "conditionOut": "" },
                { "item": "Floor Rug", "conditionIn": "", "conditionOut": "" }
            ]
        },
        {
            "category": "Miscellaneous",
            "details": [
                { "item": "Remote Control for AC", "conditionIn": "", "conditionOut": "" },
                { "item": "Curtain Ties x2", "conditionIn": "", "conditionOut": "" },
                { "item": "Light in a Jar (Orange)", "conditionIn": "", "conditionOut": "" }
            ]
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto pb-10 px-4">
            <div className="mt-4 mb-20">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Room Inventory
                </h1>
                <Table>
                    <TableCaption>A list of room inventory for check-in and check-out.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border-solid border-2">Item</TableHead>
                            <TableHead className="border-solid border-2">Check-In</TableHead>
                            <TableHead className="border-solid border-2">Check-Out</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(group => (
                            group.details.map(detail => (
                                <TableRow key={detail.item}>
                                    <TableCell className="border-solid border-2">{detail.item}</TableCell>
                                    <TableCell className="border-solid border-2">{detail.conditionIn}</TableCell>
                                    <TableCell className="border-solid border-2">{detail.conditionOut}</TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Signatures:
                </h4>

            </div>
        </div>
    );
}