import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const QRCheckIn = () => {
  const url = `${window.location.origin}/mood`;

  return (
    <Card className="w-fit mx-auto">
      <CardContent className="p-6 text-center">
        <Badge variant="outline" className="mb-3">For Schools</Badge>
        <div className="bg-white p-4 rounded-xl inline-block">
          <QRCodeSVG value={url} size={160} level="H" />
        </div>
        <p className="text-sm text-muted-foreground mt-3 max-w-[200px]">
          Scan to check in anonymously — 30 seconds
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCheckIn;
