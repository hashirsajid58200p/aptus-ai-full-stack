import Link from "next/link"
import Image from "next/image"

const ICON_URL = "/images/crosshaven-icon.svg"

const footerLinks = {
  navigation: [
    { label: "About", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Careers", href: "#careers" },
  ],
  connect: [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Terms", href: "#terms" },
    { label: "Privacy", href: "#privacy" },
    { label: "Disclosures", href: "#disclosures" },
  ],
}

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-foreground flex items-center justify-center">
                <Image
                  src={ICON_URL || "/placeholder.svg"}
                  alt="Crosshaven"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  unoptimized
                />
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60 max-w-xs leading-relaxed">
              Ready to discuss your next chapter? We're always looking to meet exceptional teams building the future.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-widest mb-6 text-primary-foreground/40">
              Navigation
            </h4>
            <ul className="space-y-4">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-widest mb-6 text-primary-foreground/40">
              Connect
            </h4>
            <ul className="space-y-4">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-widest mb-6 text-primary-foreground/40">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-primary-foreground/40">
            © {new Date().getFullYear()} Crosshaven Partners LP. All rights reserved.
          </p>
          <p className="text-[13px] text-primary-foreground/40 tracking-wide">New York • San Francisco • London</p>
        </div>
      </div>
    </footer>
  )
}
