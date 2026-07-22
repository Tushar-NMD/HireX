const PageBackground = ({ children }) => (
  <div className="home-page min-h-screen relative">
    <div className="home-page-bg" aria-hidden="true">
      <div className="home-glow-orb w-[520px] h-[520px] bg-amber-600/20 -top-32 -right-32" />
      <div className="home-glow-orb w-[400px] h-[400px] bg-amber-800/15 -bottom-20 -left-20 animation-delay-2000" />
      <div className="home-glow-orb w-[300px] h-[300px] bg-yellow-600/10 top-1/2 left-1/2 -translate-x-1/2 animation-delay-4000" />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

export default PageBackground;
