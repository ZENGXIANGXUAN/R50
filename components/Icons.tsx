import React from 'react';
import { Camera, Upload, RefreshCw, Aperture, Timer, Zap, Sliders, CheckCircle2, AlertCircle, Sun, Palette, Sparkles, Copy } from 'lucide-react';

export const Icons = {
  Camera: (props: any) => <Camera {...props} />,
  Upload: (props: any) => <Upload {...props} />,
  Refresh: (props: any) => <RefreshCw {...props} />,
  Aperture: (props: any) => <Aperture {...props} />,
  Shutter: (props: any) => <Timer {...props} />,
  ISO: (props: any) => <Zap {...props} />,
  Settings: (props: any) => <Sliders {...props} />,
  Check: (props: any) => <CheckCircle2 {...props} />,
  Info: (props: any) => <AlertCircle {...props} />,
  WhiteBalance: (props: any) => <Sun {...props} />,
  WBShift: (props: any) => <Palette {...props} />,
  Sparkles: (props: any) => <Sparkles {...props} />,
  Copy: (props: any) => <Copy {...props} />,
};