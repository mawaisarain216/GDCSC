import { Globe, MessageCircle, Send } from "lucide-react";

type IconProps = { size?: number; className?: string };

export default function SocialIcons({ platform, size = 16, className }: IconProps & { platform: string }) {
  const common = { size, className };
  switch (platform.toLowerCase()) {
    case "linkedin": return <span className={className} style={{fontWeight:800,fontSize:size}}>in</span>;
    case "whatsapp": return <MessageCircle {...common} />;
    case "telegram": return <Send {...common} />;
    case "website": return <Globe {...common} />;
    case "facebook": return <span className={className} style={{fontWeight:800,fontSize:size}}>f</span>;
    case "instagram": return <span className={className} style={{fontWeight:700,fontSize:size}}>◎</span>;
    case "youtube": return <span className={className} style={{fontWeight:800,fontSize:size}}>▶</span>;
    case "tiktok": return <span className={className} style={{fontWeight:800,fontSize:size}}>♪</span>;
    case "x": return <span className={className} style={{fontWeight:700,fontSize:size}}>𝕏</span>;
    case "threads": return <span className={className} style={{fontWeight:700,fontSize:size}}>＠</span>;
    case "snapchat": return <span className={className} style={{fontWeight:800,fontSize:size}}>👻</span>;
    case "pinterest": return <span className={className} style={{fontWeight:800,fontSize:size}}>P</span>;
    default: return <Globe {...common} />;
  }
}

export function FacebookIcon({size=16,className}:IconProps){return <SocialIcons platform="facebook" size={size} className={className}/>;}
export function InstagramIcon({size=16,className}:IconProps){return <SocialIcons platform="instagram" size={size} className={className}/>;}
export function YoutubeIcon({size=16,className}:IconProps){return <SocialIcons platform="youtube" size={size} className={className}/>;}
export function TwitterIcon({size=16,className}:IconProps){return <SocialIcons platform="x" size={size} className={className}/>;}
