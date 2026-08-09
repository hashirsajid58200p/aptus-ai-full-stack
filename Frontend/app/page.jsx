"use client"
import Hero from "@/components/hero";
import NavBar from "@/components/navbar";
import About from "@/components/about";
import Faq from "@/components/faq";
import Feature from "@/components/feature";
import { ChatBot } from "quickstart-ai-chatbot-widget";
import { useEffect } from "react";
import { loadUser } from "@/slices/userSlice";
import { useDispatch } from "react-redux";




export default function Home() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUser())
  }, [])


  return (
    <main className="flex flex-col min-h-dvh bg-white">
      <NavBar />
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="features">
        <Feature />
      </section>
      <section id="faq">
        <Faq />
      </section>

      <ChatBot 
        token="A1ED-7127544F-1EBAF3E7" 
        apiUrl={process.env.NEXT_PUBLIC_API_URL || "https://quick-start-ai-backend.vercel.app/api/v1"}
        theme="secondary"
        wantToShowSuggestions={true}
      />
    </main>

  );
}
