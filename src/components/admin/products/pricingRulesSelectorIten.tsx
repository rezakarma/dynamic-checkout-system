"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useEffect, useState } from "react";

interface PricingRulesSelectorItemProps {
  id: string;
  type: string;
  name: string;
  isChecked: boolean;
  onCheckedChange: (isChecked: boolean | string, id: string) => void;
}
const PricingRulesSelectorItem = ({
  id,
  type,
  name,
  isChecked,
  onCheckedChange,
}: PricingRulesSelectorItemProps) => {
  return (
    <Card className="my-2">
      <CardContent className="flex p-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={id}
            checked={isChecked}
            onCheckedChange={(checked) => {
              onCheckedChange(checked, id);
            }}
          />
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            type: {type}, name: {name}
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingRulesSelectorItem;
