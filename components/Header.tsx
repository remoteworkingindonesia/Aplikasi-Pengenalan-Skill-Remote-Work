import rwiLogo from 'figma:asset/30f0f53d6518ab570c6ae797b83d49de5777eada.png';

export function Header() {
  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      <img 
        src={rwiLogo} 
        alt="Remote Working Indonesia" 
        className="w-32 h-32 object-contain"
      />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Skill Discovery Tool
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Temukan potensi skill tersembunyi Anda untuk memulai karir remote working
        </p>
      </div>
    </div>
  );
}