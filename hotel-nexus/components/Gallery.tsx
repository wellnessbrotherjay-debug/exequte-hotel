import { nexusAssets } from "@/hotel-nexus/lib/assets";

const images = [
  { src: nexusAssets.tvWorkout, label: "RaceFit on Hotel TV", span: "md:col-span-2" },
  { src: nexusAssets.ipadInterface, label: "iPad Tablet Interface" },
  { src: nexusAssets.stationPod, label: "Modular Smart Station" },
  { src: nexusAssets.roomWorkoutAction, label: "In-Room Workout Experience", span: "md:col-span-2" },
  { src: nexusAssets.rooftopGym, label: "Premium Gym Integration", span: "md:col-span-2" },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-32 px-6 bg-gradient-to-b from-white to-[hsl(220,20%,98%)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            PILOT PROGRAM
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground uppercase tracking-tight">
            Pilot Hotels & Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're now rolling out pilots across select Bali resorts and urban business hotels. 
            Each property measures guest engagement, usage rate, and retention uplift.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={image.label}
              className={`group relative overflow-hidden rounded-sm ${image.span || ""} animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square relative">
                <img
                  src={image.src}
                  alt={image.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-lg font-bold text-white">
                    {image.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
