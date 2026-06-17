import { FrDocumentLang } from "@/components/landing/FrDocumentLang";

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FrDocumentLang />
      {children}
    </>
  );
}
