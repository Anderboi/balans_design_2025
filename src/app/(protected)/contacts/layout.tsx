import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Контакты | Адресная книга",
  description: "Управление списком клиентов, подрядчиков и компаний.",
};

const ContactsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className=" animate-in fade-in-50 duration-500">{children}</div>;
};

export default ContactsLayout;
