import { Footer } from '@/components/ui/footer-section';

export default function FooterDemo() {
    return (
        <div className="relative flex min-h-svh flex-col pt-20">
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className='font-mono text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent italic'>Scroll Down!</h1>
                <p className="text-muted-foreground animate-bounce mt-4">↓</p>
            </div>
            <Footer />
        </div>
    );
}
