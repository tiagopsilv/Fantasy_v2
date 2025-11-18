import { Upload, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeagueNameStepProps {
  name: string;
  logo: string | null;
  onChange: (name: string, logo: string | null) => void;
}

export function LeagueNameStep({ name, logo, onChange }: LeagueNameStepProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(name, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-white text-2xl mb-2">Nome da Liga</h3>
        <p className="text-[#B8BAC1]">
          Escolha um nome único e marcante para sua liga
        </p>
      </div>

      <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
        <div className="space-y-6">
          {/* Nome da Liga */}
          <div className="space-y-2">
            <Label htmlFor="league-name" className="text-white">
              Nome da Liga *
            </Label>
            <Input
              id="league-name"
              value={name}
              onChange={(e) => onChange(e.target.value, logo)}
              placeholder="Ex: Liga dos Campeões 2025"
              className="bg-[#1A2238] border-[#4A4E56] text-white placeholder:text-[#B8BAC1]"
            />
            <p className="text-[#B8BAC1] text-sm">
              O nome deve ter pelo menos 3 caracteres
            </p>
          </div>

          {/* Upload de Logo */}
          <div className="space-y-2">
            <Label className="text-white">Logo da Liga (Opcional)</Label>
            
            <div className="flex items-center gap-4">
              {/* Preview da Logo */}
              <div className="w-24 h-24 rounded-lg bg-[#1A2238] border-2 border-dashed border-[#4A4E56] flex items-center justify-center">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo da liga"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#B8BAC1]" />
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                  className="border-[#4A4E56] text-white hover:bg-[#1A2238] w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {logo ? "Alterar Logo" : "Fazer Upload"}
                </Button>
                <p className="text-[#B8BAC1] text-sm mt-2">
                  PNG, JPG ou GIF até 2MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview Card */}
      {name && (
        <Card className="bg-[#2C2F33] border-[#00E6B3] p-6">
          <div className="flex items-center gap-4">
            {logo && (
              <img
                src={logo}
                alt="Logo preview"
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="text-[#B8BAC1] text-sm mb-1">Preview:</p>
              <h4 className="text-white text-xl">{name}</h4>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
