"use client";

import { useLink } from "@/app/hooks/useLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { isValidHttpUrl as validateUrl } from "@/lib/validation";
import { ToastAction } from "@radix-ui/react-toast";
import { Check } from "lucide-react";
import * as React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineOpenInNew } from "react-icons/md";

import { Input } from "./ui/input";

type CardProps = React.ComponentProps<typeof Card>;

export function CardDemo({ className, ...props }: CardProps) {
  const { shortenLink, shortenedLink, error, loading } = useLink();
  const { toast } = useToast();

  const [originalUrl, setOriginalUrl] = React.useState<string>("");
  const [copyToClipboard, setCopyToClipboard] = React.useState<boolean>(false);

  const handleGenerateLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "URL cannot be empty",
        action: (
          <ToastAction altText="Try again">
            <Button
              onClick={() => document.querySelector("input")?.focus()}
              variant="secondary"
            >
              Try again
            </Button>
          </ToastAction>
        ),
      });
      return;
    }

    if (!validateUrl(originalUrl)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid URL with http:// or https://",
        action: (
          <ToastAction altText="Try again">
            <Button
              onClick={() => document.querySelector("input")?.focus()}
              variant="secondary"
            >
              Try again
            </Button>
          </ToastAction>
        ),
      });
      return;
    }

    shortenLink(originalUrl);
    setOriginalUrl("");
  };

  React.useEffect(() => {
    if (shortenedLink) {
      const displayLink = shortenedLink
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "");
      if (copyToClipboard) {
        navigator.clipboard.writeText(displayLink);
      }
      toast({
        title: "Link generated successfully",
        description: displayLink,
        action: (
          <ToastAction altText="Copy To Clipboard">
            <Button onClick={() => navigator.clipboard.writeText(displayLink)}>
              Copy
            </Button>
          </ToastAction>
        ),
      });
    } else if (error) {
      toast({
        title: "Error",
        description: error,
      });
    }
  }, [shortenedLink, error, toast, copyToClipboard]);

  return (
    <form onSubmit={handleGenerateLink}>
      <Card className={cn("w-[380px]", className)} {...props}>
        <CardHeader>
          <CardTitle>Shortify</CardTitle>
          <CardDescription>
            Open source URL shortener. Shorten your links with ease.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            type="text"
            placeholder="https://example.com"
            className="rounded-md border border-input bg-background px-3 py-4 text-sm w-full"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </CardFooter>

        <CardContent>
          {shortenedLink ? (
            <Badge variant="outline" className="hover:cursor-pointer">
              <a
                href={shortenedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm"
              >
                <span>Open in new tab</span>
                <MdOutlineOpenInNew />
              </a>
            </Badge>
          ) : (
            <Badge variant="outline" className="hover:cursor-not-allowed">
              <p className="text-sm flex items-center space-x-1">
                <span>Open in new tab</span>
                <MdOutlineOpenInNew />
              </p>
            </Badge>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
