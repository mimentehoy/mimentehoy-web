import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "kit-para-padres",
      title: "Kit para padres",
      price: "39 €",
      tag: "Pack",
      description: "Recursos prácticos para acompañar rutinas, emociones y límites en casa con más claridad.",
      image: "/logo.png",
      link: "https://mimentehoy.myshopify.com/products/kit-para-padres?utm_source=tiktok&utm_medium=social&utm_campaign=perfil",
    },
    {
      id: "no-es-que-no-quiera",
      title: "No es que no quiera",
      price: "18 €",
      tag: "Libro",
      description: "Una mirada clara y amable para entender la relación entre esfuerzo, regulación emocional y apoyo.",
      image: "/logo.png",
      link: "https://mimentehoy.myshopify.com/products/no-es-que-no-quiera?utm_source=tiktok&utm_medium=social&utm_campaign=perfil",
    },
    {
      id: "guia-gratuita-para-empezar-con-calma",
      title: "Guía gratuita para empezar con calma",
      price: "Gratis",
      tag: "Recursos",
      description: "Guía descargable para familias que buscan empezar con más calma, claridad y orden.",
      image: "/logo.png",
      link: "/recursos/guia-gratuita-para-empezar-con-calma",
    },
  ]);
}
