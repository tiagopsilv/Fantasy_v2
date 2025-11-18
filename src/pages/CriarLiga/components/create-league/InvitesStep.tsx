import { useState } from "react";
import { Copy, Share2, QrCode, Check, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface InvitesStepProps {
  leagueName: string;
}

export function InvitesStep({ leagueName }: InvitesStepProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [invites, setInvites] = useState<Array<{ email: string; sent: boolean }>>([]);
  const [newEmail, setNewEmail] = useState("");

  // Generate mock invite link
  const inviteLink = `https://10jardas.com/join/${leagueName.toLowerCase().replace(/\s+/g, '-')}/abc123`;
  
  // Generate QR code data URL (simplified version)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteLink)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Link copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = `🏈 Você foi convidado para jogar Fantasy Football!\n\nLiga: ${leagueName}\n\nClique no link para participar:\n${inviteLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.success("Abrindo WhatsApp...");
  };

  const handleAddInvite = () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("Digite um email válido");
      return;
    }

    if (invites.some(inv => inv.email === newEmail)) {
      toast.error("Este email já foi adicionado");
      return;
    }

    setInvites([...invites, { email: newEmail, sent: false }]);
    setNewEmail("");
    toast.success("Email adicionado à lista de convites");
  };

  const handleSendInvite = (email: string) => {
    // Simulate sending email
    setInvites(invites.map(inv => 
      inv.email === email ? { ...inv, sent: true } : inv
    ));
    toast.success(`Convite enviado para ${email}!`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-white text-2xl mb-2">Convidar Participantes</h3>
        <p className="text-[#B8BAC1]">
          Compartilhe o link da liga ou envie convites por email
        </p>
      </div>

      {/* Link de Convite */}
      <Card className="bg-[#2C2F33] border-[#00E6B3] p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-[#00E6B3]" />
            <h4 className="text-white">Link de Convite</h4>
          </div>

          <div className="flex gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="bg-[#1A2238] border-[#4A4E56] text-white flex-1"
            />
            <Button
              onClick={handleCopyLink}
              className={`${
                copied
                  ? "bg-[#0B6623] hover:bg-[#0B6623]/90"
                  : "bg-[#00E6B3] hover:bg-[#00E6B3]/90"
              } text-[#1A2238]`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsApp}
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Compartilhar no WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowQR(!showQR)}
              className="border-[#4A4E56] text-white hover:bg-[#1A2238]"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? "Ocultar" : "Mostrar"} QR Code
            </Button>
          </div>

          {showQR && (
            <div className="flex justify-center p-4 bg-[#1A2238] rounded-lg">
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Enviar Convites por Email */}
      <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
        <div className="space-y-4">
          <h4 className="text-white">Enviar Convites por Email</h4>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInvite()}
                placeholder="email@exemplo.com"
                className="bg-[#1A2238] border-[#4A4E56] text-white"
              />
            </div>
            <Button
              onClick={handleAddInvite}
              className="bg-[#0B6623] hover:bg-[#0B6623]/90 text-white"
            >
              Adicionar
            </Button>
          </div>

          {invites.length > 0 && (
            <div className="space-y-2 mt-4">
              <Label className="text-white">Convites Pendentes ({invites.length})</Label>
              {invites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between bg-[#1A2238] rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white">{invite.email}</span>
                    {invite.sent && (
                      <Badge className="bg-[#0B6623] text-white text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Enviado
                      </Badge>
                    )}
                  </div>
                  {!invite.sent && (
                    <Button
                      size="sm"
                      onClick={() => handleSendInvite(invite.email)}
                      className="bg-[#00E6B3] hover:bg-[#00E6B3]/90 text-[#1A2238]"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Enviar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Instruções */}
      <Card className="bg-[#1A2238] border-[#4A4E56] p-4">
        <h5 className="text-white mb-2">Como funciona?</h5>
        <ul className="text-[#B8BAC1] text-sm space-y-2">
          <li>• Os participantes devem criar uma conta antes de aceitar o convite</li>
          <li>• Cada pessoa pode ter apenas um time por liga</li>
          <li>• O administrador pode remover participantes a qualquer momento</li>
          <li>• A liga pode ser fechada após o draft ou início da temporada</li>
        </ul>
      </Card>

      <Card className="bg-[#0B6623]/20 border-[#0B6623] p-4">
        <p className="text-[#00E6B3] text-sm text-center">
          ✅ Parabéns! Sua liga está quase pronta. Clique em "Criar Liga" para finalizar.
        </p>
      </Card>
    </div>
  );
}
