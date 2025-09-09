import React from 'react'

const HeroSection = () => {
    return (
        <section className="w-full bg-white py-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Food App<br />
                        Aplikasi Pesanan Makanan Online
                    </h1>
                    <p className="mt-6 text-gray-600 text-lg">
                        Dirancang buat bantu kamu yang malas masak, beli bahan, dan ngitung kembalian. Tanpa ribet, tanpa drama. Food App kerja siang-malam biar kamu bisa fokus ke hal yang lebih penting — kayak istirahat.</p>
                    <div className="mt-12 text-sm text-gray-500">
                        <span className="block mb-2 font-medium">Powered by:</span>
                        <div className="flex items-center gap-6 justify-center lg:justify-start">
                            <span className="text-base font-semibold">React</span>
                            <span className="text-base font-semibold">Express</span>
                        </div>
                    </div>
                </div>

                {/* Right: Video from local */}
                <div className="lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover pointer-events-none"
                    />
                </div>


            </div>
        </section>
    )
}

export default HeroSection
