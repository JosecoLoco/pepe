import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text, Trail, Sphere } from '@react-three/drei';
import { Aperture, ArrowRight, Instagram, Twitter, Mail, Triangle, Play, Disc } from 'lucide-react';
import * as THREE from 'three';

const App = () => {
    const [loading, setLoading] = useState(true);

    return (
        <>
            <AnimatePresence mode='wait'>
                {loading && <LoadingScreen key="loader" onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            {!loading && (
                <div className="relative font-sans selection:bg-krea-purple selection:text-white bg-krea-black min-h-screen text-white">
                    <CameraOverlay />
                    <GrainOverlay />
                    <CamoBackground />
                    <AmbientParticles />

                    <Navbar />
                    <Hero />
                    <Marquee />
                    <Philosophy />
                    <Gallery />
                    <TechSpecs />
                    <Footer />
                </div>
            )}
        </>
    );
};

// --- COMPONENTS ---

// 1. Loading Screen with Graffiti/Raw Aesthetic
const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 10) + 1;
            });
        }, 150);
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-krea-black flex flex-col justify-between p-8"
        >
            <div className="flex justify-between items-start font-mono text-xs text-neutral-500 uppercase tracking-widest">
                <span>Krea® System Boot</span>
                <span>V.2.0.24</span>
            </div>

            <div className="relative text-center">
                <h1 className="text-[20vw] font-impact leading-none text-transparent bg-clip-text bg-gradient-to-t from-neutral-800 to-white opacity-20 select-none blur-sm">
                    LOADING
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <span className="text-9xl font-black italic tracking-tighter text-krea-green" style={{ textShadow: "0 0 40px rgba(57,255,20,0.5)" }}>
                            {Math.min(progress, 100)}%
                        </span>
                        {/* "Graffiti" Scribble SVG Effect */}
                        <svg className="absolute -bottom-4 -right-12 w-48 h-24 stroke-krea-purple stroke-[3] fill-none" viewBox="0 0 200 100">
                            <motion.path
                                d="M10,50 Q50,90 90,50 T180,50"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: progress / 100 }}
                                transition={{ duration: 0.1 }}
                            />
                        </svg>
                    </motion.div>
                </div>
            </div>

            <div className="flex justify-between items-end font-mono text-xs uppercase">
                <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span>Initializing Assets...</span>
                </div>
                <span className="text-krea-purple">Madrid, ES</span>
            </div>
        </motion.div>
    );
};

// 2. Camera Overlay (Viewfinder)
const CameraOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-40 p-6 md:p-12 flex flex-col justify-between mix-blend-difference text-white opacity-80">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
            <div className="border-t-2 border-l-2 border-white w-8 h-8 md:w-16 md:h-16" />
            <div className="flex gap-8 font-mono text-xs md:text-sm tracking-widest">
                <span className="text-red-500 font-bold animate-pulse flex items-center gap-2">● REC</span>
                <span>ISO 800</span>
                <span>4K/60FPS</span>
                <span>[RAW]</span>
            </div>
            <div className="border-t-2 border-r-2 border-white w-8 h-8 md:w-16 md:h-16" />
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 text-white/30">+</div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-end">
            <div className="border-b-2 border-l-2 border-white w-8 h-8 md:w-16 md:h-16" />
            <div className="font-mono text-xs md:text-sm text-center">
                <div className="w-64 h-1 bg-white/20 relative overflow-hidden rounded-full mb-2">
                    <div className="absolute top-0 left-0 h-full w-3/4 bg-krea-green/80" />
                </div>
                <span>BATTERY 74%</span>
            </div>
            <div className="border-b-2 border-r-2 border-white w-8 h-8 md:w-16 md:h-16" />
        </div>
    </div>
);

// 3. Three.js Background Particles (Atmosphere)
const AmbientParticles = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <Suspense fallback={null}>
                    <fog attach="fog" args={['#050505', 5, 20]} />
                    <ambientLight intensity={0.5} />
                    <ParticleField />
                </Suspense>
            </Canvas>
        </div>
    )
}

const ParticleField = () => {
    const ref = useRef();
    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]} ref={ref}>
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <Points />
            </Float>
        </group>
    );
};

const Points = () => {
    // Generate random points manually to avoid heavy imports if needed, or use Drei's helper
    // Using simple spheres for "dust"
    return (
        <group>
            {[...Array(20)].map((_, i) => (
                <mesh key={i} position={[
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 10
                ]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshBasicMaterial color={Math.random() > 0.5 ? '#8b5cf6' : '#39ff14'} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    )
}


/* --- REST OF THE APP (Updated with new style) --- */

const GrainOverlay = () => (
    <div className="fixed inset-0 z-[5] pointer-events-none opacity-[0.07] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
);

const CamoBackground = () => (
    <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/army-camo.png')]" />
);

const Navbar = () => (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
        <span className="font-impact text-3xl tracking-tighter">KREA®</span>
        <div className="flex gap-8 font-bold text-sm uppercase tracking-widest hidden md:flex">
            {['Estudio', 'Portafolio', 'Manifiesto'].map((item) => (
                <a key={item} href="#" className="hover:text-krea-green transition-colors">{item}</a>
            ))}
        </div>
        <button className="bg-white text-black px-6 py-2 font-bold uppercase text-xs hover:bg-krea-green hover:scale-105 transition-all">
            Contacto
        </button>
    </nav>
);

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    return (
        <section className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-krea-black/60 via-transparent to-krea-black z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60 scale-110 grayscale contrast-125"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-urban-city-traffic-at-night-aerial-view-45084-large.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="z-10 relative w-full px-4 text-center">
                {/* Giant Logo */}
                <motion.div style={{ y: y1 }} className="relative inline-block">
                    <motion.h1
                        initial={{ scale: 0.9, y: 100, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[15vw] md:text-[20vw] leading-[0.85] font-impact tracking-tighter text-white uppercase mix-blend-screen select-none"
                    >
                        KREA
                    </motion.h1>
                    {/* Glitch Effect Duplicate */}
                    <motion.h1
                        className="absolute top-0 left-0 text-[15vw] md:text-[20vw] leading-[0.85] font-impact tracking-tighter text-krea-green opacity-40 mix-blend-color-dodge select-none w-full"
                        animate={{ x: [-2, 2, -2], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        KREA
                    </motion.h1>
                    <div className="absolute -bottom-8 right-0 text-krea-purple font-mono text-sm tracking-widest rotate-6 bg-black p-1 border border-krea-purple">
                        [EST. MMXXIV]
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12 bg-black/50 backdrop-blur-sm py-4 inline-flex px-12 border border-white/10 rounded-full"
                >
                    <p className="text-lg md:text-xl font-bold uppercase tracking-widest text-white max-w-xl leading-tight">
                        Ingeniería Visual <span className="text-krea-green mx-2">///</span> Street Culture
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

const Marquee = () => {
    return (
        <div className="bg-krea-purple text-white py-6 overflow-hidden whitespace-nowrap border-y-[6px] border-black z-20 relative transform -skew-y-3 origin-center scale-100 md:scale-110 mt-32 md:my-20">
            <motion.div
                className="flex gap-20 text-6xl font-black italic uppercase tracking-tighter"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            >
                {[...Array(6)].map((_, i) => (
                    <React.Fragment key={i}>
                        <span className="text-black" style={{ WebkitTextStroke: '2px white' }}>VISUALS </span>
                        <Disc className="w-12 h-12 text-white animate-spin" />
                        <span className="text-black">DIRECTING </span>
                        <span className="text-white">///</span>
                        <span className="text-black" style={{ WebkitTextStroke: '2px white' }}>DRONE </span>
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

const Philosophy = () => (
    <section className="py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
                <div className="inline-block bg-krea-green text-black px-2 font-mono font-bold mb-4 skew-x-12">MANIFIESTO.md</div>
                <h2 className="text-5xl md:text-7xl font-impact uppercase leading-none mb-8 text-white">
                    Caos <span className="text-transparent bg-clip-text bg-gradient-to-r from-krea-purple to-pink-600">Controlado</span>
                </h2>
                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed mb-6 font-mono">
                    &gt; Ejecutando visión creativa...<br />
                    &gt; Renderizando realidad...
                </p>
                <p className="text-white text-xl md:text-2xl leading-relaxed font-bold uppercase">
                    No seguimos tendencias. <br />Las atropellamos.
                </p>
            </div>
            <div className="relative group">
                <div className="absolute -inset-2 bg-krea-purple opacity-70 group-hover:blur-xl transition-all duration-500" />
                <div className="relative border-2 border-white bg-neutral-900 p-2">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                        alt="Philosophy"
                        className="w-full h-full object-cover grayscale contrast-125"
                    />
                    {/* Graffiti overlay */}
                    <div className="absolute bottom-4 left-4 text-6xl font-impact text-krea-green -rotate-12 mix-blend-screen opacity-80 pointer-events-none">RAW</div>
                </div>
            </div>
        </div>
    </section>
);

const Gallery = () => {
    const projects = [
        { title: "NIGHTRUN", category: "AUTO", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop" },
        { title: "NEON", category: "FASHION", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" },
        { title: "BLOCK", category: "URBAN", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" },
        { title: "DRIFT", category: "DOC", img: "https://images.unsplash.com/photo-1600705722838-831e67aa24de?q=80&w=1000&auto=format&fit=crop" },
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16 border-b-4 border-white/20 pb-8">
                    <h2 className="text-7xl md:text-9xl font-impact text-white tracking-img">OBRA</h2>
                    <div className="flex gap-2">
                        <div className="w-4 h-4 bg-krea-green rounded-full animate-bounce" />
                        <div className="w-4 h-4 bg-krea-purple rounded-full animate-bounce delay-100" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((p, i) => (
                        <ProjectCard key={i} project={p} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative cursor-pointer"
        >
            <div className="relative overflow-hidden aspect-video border-4 border-neutral-800 hover:border-krea-green transition-colors duration-200">
                <div className="absolute inset-0 bg-krea-purple/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-0 left-0 bg-krea-green text-black font-bold px-2 py-1 translate-y-full group-hover:translate-y-0 transition-transform font-mono text-sm">
                    VIEW PROJECT_
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 border-b border-neutral-800 pb-4 group-hover:border-krea-purple transition-colors">
                <h3 className="text-5xl font-impact uppercase text-white italic group-hover:text-krea-green transition-colors">
                    {project.title}
                </h3>
                <span className="font-mono text-neutral-500 text-sm">0{index + 1}</span>
            </div>
        </motion.div>
    )
}

const TechSpecs = () => {
    const specs = [
        { label: "CAM A", value: "KOMODO X" },
        { label: "CAM B", value: "FX3" },
        { label: "AIR", value: "MAVIC 3" },
        { label: "GLASS", value: "ATLAS" },
        { label: "STAB", value: "RONIN 4D" },
    ];

    return (
        <section className="py-24 border-y border-neutral-800 bg-neutral-900/50 backdrop-blur">
            <div className="w-full overflow-hidden">
                <div className="flex gap-4 items-center justify-center mb-12">
                    <Aperture className="text-white w-8 h-8 animate-spin-slow" />
                    <h2 className="text-3xl font-mono uppercase tracking-widest text-white">TECH_STACK</h2>
                </div>

                <div className="w-full overflow-hidden whitespace-nowrap">
                    <motion.div
                        className="inline-flex gap-8"
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    >
                        {[...specs, ...specs, ...specs, ...specs].map((spec, i) => (
                            <div
                                key={i}
                                className="border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition-colors duration-300 min-w-[200px]"
                            >
                                <div className="text-xs font-mono opacity-50 mb-1">{spec.label}</div>
                                <div className="text-2xl font-impact tracking-wider">{spec.value}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

const Footer = () => {
    return (
        <footer className="py-20 bg-krea-black text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh] border-t-8 border-krea-green">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

            <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative z-10 group cursor-pointer inline-block"
            >
                <div className="bg-white text-black text-6xl md:text-9xl font-impact px-8 py-4 transform -skew-x-12 hover:bg-krea-purple hover:text-white transition-colors duration-300 border-4 border-transparent hover:border-white shadow-[10px_10px_0px_#39ff14]">
                    CONTACTAR
                </div>
            </motion.a>

            <div className="flex gap-12 mt-20 z-10">
                <Instagram className="w-10 h-10 hover:text-krea-purple transition-colors hover:-translate-y-2 duration-300" />
                <Twitter className="w-10 h-10 hover:text-krea-green transition-colors hover:-translate-y-2 duration-300" />
                <Mail className="w-10 h-10 hover:text-white transition-colors hover:-translate-y-2 duration-300" />
            </div>

            <div className="mt-12 text-neutral-600 font-mono text-xs tracking-widest uppercase">
                Krea® Creative Corp • Madrid • 2024
            </div>
        </footer>
    )
}

export default App;
