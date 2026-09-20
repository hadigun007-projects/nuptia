import React, { useRef, useState } from 'react';
import { GuestData } from '../../../types';
import { Card, SectionHead, M3Field, M3Switch } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface GuestManagementTabProps {
  data: GuestData;
  onChange: (d: GuestData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function GuestManagementTab({ data, onChange, showToast }: GuestManagementTabProps) {
  const qrRef = useRef<HTMLInputElement>(null);
  const [qrPreview, setQrPreview] = useState('');

  function handleQr(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrPreview(URL.createObjectURL(file));
    showToast('QRIS berhasil diunggah!', 'success');
  }

  const set = (k: keyof GuestData) => (v: string | boolean) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* RSVP & Greetings */}
      <Card>
        <SectionHead title="Fitur Interaktif" sub="Aktifkan atau nonaktifkan fitur tamu" />
        <div className="space-y-1">
          {(
            [
              ['rsvpEnabled', 'Konfirmasi Kehadiran (RSVP)', 'Tamu bisa mengkonfirmasi kehadiran mereka'],
              ['greetingsEnabled', 'Ucapan & Doa', 'Kolom ucapan selamat dari para tamu'],
            ] as const
          ).map(([key, title, sub]) => (
            <div
              key={key}
              className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold text-on-surface">{title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>
              </div>
              <M3Switch checked={data[key]} onChange={(v) => set(key)(v)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Bank Account */}
      <Card>
        <SectionHead title="Rekening Bank" sub="Untuk amplop digital / hadiah uang tunai" />
        <div className="space-y-3">
          <M3Field
            label="Nama Bank"
            value={data.bankName}
            onChange={(v) => set('bankName')(v)}
            placeholder="Contoh: Bank Central Asia (BCA)"
          />
          <M3Field
            label="Nomor Rekening"
            value={data.accountNo}
            onChange={(v) => set('accountNo')(v)}
            placeholder="0000 0000 00"
          />
          <M3Field
            label="Nama Pemilik Rekening"
            value={data.accountHolder}
            onChange={(v) => set('accountHolder')(v)}
          />
          {data.accountNo && (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(data.accountNo);
                showToast('Nomor rekening disalin!', 'success');
              }}
              className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/70 transition-colors mt-1"
            >
              <Ic.Check s={14} /> Salin nomor rekening
            </button>
          )}
        </div>
      </Card>

      {/* E-Wallet */}
      <Card>
        <SectionHead title="Dompet Digital / E-Wallet" sub="Penerimaan tanda kasih via dompet digital" />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {['GoPay', 'OVO', 'Dana', 'ShopeePay'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => set('ewalletType')(w)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  data.ewalletType === w
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <M3Field label="Nomor E-Wallet" value={data.ewalletNo} onChange={(v) => set('ewalletNo')(v)} />
          <M3Field label="Nama Pemilik" value={data.ewalletName} onChange={(v) => set('ewalletName')(v)} />
        </div>
      </Card>

      {/* QRIS */}
      <Card>
        <SectionHead title="QRIS" sub="Upload gambar kode QR pembayaran transfer instan" />
        <div className="flex gap-4 items-start">
          <div
            className="w-32 h-32 flex-shrink-0 rounded-2xl bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => qrRef.current?.click()}
          >
            {qrPreview ? (
              <img src={qrPreview} alt="QRIS" className="w-full h-full object-contain p-2" />
            ) : (
              <div className="text-center p-3">
                <Ic.QR s={32} cls="mx-auto text-on-surface-variant/50 mb-1" />
                <p className="text-[10px] text-on-surface-variant">Upload QRIS</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-on-surface mb-1">Unggah gambar QRIS</p>
            <p className="text-xs text-on-surface-variant mb-3">Format PNG atau JPG, ukuran maks 5 MB</p>
            <button
              type="button"
              onClick={() => qrRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface text-sm font-semibold border border-outline-variant hover:bg-surface-container-high transition-all duration-200"
            >
              <Ic.Upload s={16} /> Pilih File
            </button>
          </div>
        </div>
        <input ref={qrRef} type="file" accept="image/*" className="hidden" onChange={handleQr} />
      </Card>
    </div>
  );
}
