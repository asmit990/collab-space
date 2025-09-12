import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Collab-app" },
    { name: "description", content: "UseThis,GOOGLEDOCisForBeta" },
  ];
}

export default function Home() {
  return (
       <>
       </>
  )
}
