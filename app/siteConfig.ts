export const siteConfig = {
  name: "Kitnets Beta",
  location: "Jardim Conceição, São Roque – SP",
  owners: ["Roni Fagundes", "Barbara Aline"],
  phone: "",
  whatsappMessage:
    "Olá! Vi o site da Kitnets Beta e gostaria de consultar a disponibilidade.",
} as const;

export function getWhatsappLink() {
  if (!siteConfig.phone) return null;
  return `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
}
