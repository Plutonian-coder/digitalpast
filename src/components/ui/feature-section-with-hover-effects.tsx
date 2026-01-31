import { cn } from "@/lib/utils";
import {
    IconTerminal2,
    IconSearch,
    IconDownload,
    IconDeviceMobile,
    IconShieldCheck,
    IconClock,
    IconBooks,
    IconHelp,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
    const features = [
        {
            title: "Vast Archive",
            description:
                "Access thousands of past questions across all departments and levels.",
            icon: <IconBooks />,
        },
        {
            title: "Smart Search",
            description:
                "Find specific course codes and years in seconds with our optimized logic.",
            icon: <IconSearch />,
        },
        {
            title: "Instant PDF Downloads",
            description:
                "High-quality downloads for offline study anywhere, anytime.",
            icon: <IconDownload />,
        },
        {
            title: "Mobile Optimized",
            description: "A seamless experience on smartphones, tablets, and desktop browsers.",
            icon: <IconDeviceMobile />,
        },
        {
            title: "Verified Content",
            description: "All resources are vetted by academic contributors for accuracy.",
            icon: <IconShieldCheck />,
        },
        {
            title: "24/7 Access",
            description:
                "Our digital vault is open round the clock. Study at your own pace.",
            icon: <IconClock />,
        },
        {
            title: "Secure Platform",
            description:
                "Your data and transactions are protected with industry-standard security.",
            icon: <IconTerminal2 />,
        },
        {
            title: "Dedicated Support",
            description: "Run into an issue? Our support team is ready to help you succeed.",
            icon: <IconHelp />,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-neutral-600 white:text-neutral-400 group-hover/feature:text-black dark:group-hover/feature:text-white transition-colors duration-200">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 white:text-neutral-100 group-hover/feature:text-black dark:group-hover/feature:text-white">
                    {title}
                </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 group-hover/feature:text-black dark:group-hover/feature:text-white transition-colors duration-200">
                {description}
            </p>
        </div>
    );
};
