"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import { toast } from "sonner";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "../../../model/Schema/signUpSchema";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { FaDiscord, FaGoogle, FaLinkedin } from "react-icons/fa";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(
    (value) => setUsername(value),
    300,
  );

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/sign-up", data);

      toast.success(response.data.message);

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      toast.error(error.response?.data.message ?? "Error signing up");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleDiscordSignUp = async () => {
    await signIn("discord", {
      callbackUrl: "/dashboard",
      redirect: process.env.DISCORD_REDIRECT_URL,
    });
  };

  const handleLinkedInSignIn = async () => {
    await signIn("linkedin", { callbackUrl: "/dashboard" });
  };

  return (
    <div>
      <div className="bg-cover bg-center ">
        <div className="flex justify-center items-center">
          <Card className="w-[23rem] max-sm:w-[19rem] border-zinc-400/10">
            <CardHeader className="p-2">
              <CardDescription className="flex flex-col gap-2 pt-5 items-center justify-center">
                <Image
                  src="/assets/logo.jpg"
                  alt=""
                  width={500}
                  height={500}
                  className="size-12 rounded-xl"
                />
                <p className="font-bold text-base">Create an account.</p>
                <p className="text-zinc-400">
                  Welcome! Please fill the details to get started.
                </p>
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-5">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-zinc-300">
                          Username
                        </FormLabel>
                        <Input
                          className="text-base border-zinc-400/10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedUsername(e.target.value);
                          }}
                        />
                        {isCheckingUsername && (
                          <Loader2 className="animate-spin" />
                        )}
                        {!isCheckingUsername && usernameMessage && (
                          <p
                            className={`text-sm ${
                              usernameMessage === "Username is unique"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {usernameMessage}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-zinc-300">
                          Email
                        </FormLabel>
                        <Input
                          className="text-base border-zinc-400/10"
                          {...field}
                          name="email"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-zinc-300">
                          Password
                        </FormLabel>
                        <Input
                          className="text-base border-zinc-400/10"
                          type="password"
                          {...field}
                          name="password"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full font-bold"
                    disabled={isSubmitting}
                    arial-label="signup-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                  <div className="my-1 flex items-center">
                    <div className="h-[1px] bg-zinc-400/20 w-1/2"></div>
                    <div className="mx-2 text-foreground/60 font-bold">or</div>
                    <div className="h-[1px] bg-zinc-400/20 w-1/2"></div>
                  </div>

                  <div className="w-full">
                    <div className="text-center flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="default"
                        className="w-full flex gap-4"
                        onClick={handleGoogleSignUp}
                        arial-label="google-signin-btn"
                      >
                        <FaGoogle className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="w-full flex gap-4"
                        onClick={handleDiscordSignUp}
                        arial-label="discord-signin-btn"
                      >
                        <FaDiscord className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="w-full flex gap-4"
                        onClick={handleLinkedInSignIn}
                        arial-label="discord-signin-btn"
                      >
                        <FaLinkedin className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-5 text-foreground/80 text-xs text-center text-zinc-400">
                    Already a member?{" "}
                    <Link
                      href="/sign-in"
                      className="hover:text-blue-800 underline transition-all "
                      aria-label="signin-btn"
                    >
                      Sign in
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
