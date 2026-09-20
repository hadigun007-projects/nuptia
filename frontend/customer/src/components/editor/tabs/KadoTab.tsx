import React, { useRef, useState } from 'react';
import { GuestData, PhysicalGiftAddress } from '../../../types';
import { Card, SectionHead, M3Field, M3Switch } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface KadoTabProps {
  data: GuestData;
  onChange: (d: GuestData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function KadoTab({ data, onChange, showToast }: KadoTabProps) {
  const qrRef = useRef<HTMLInputElement>(null);
  const [qrPreview, setQrPreview] = useState(data.qrisUrl || '');

  function handleQr(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setQrPreview(url);
    onChange({ ...data, qrisUrl: url });
    showToast('QRIS amplop digital berhasil diunggah!', 'success');
  }

  const set = (k: keyof GuestData) => (v: string | boolean) => onChange({ ...data, [k]: v });

  const addr = data.physicalGiftAddress || {
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  };

  const updateAddr = (k: keyof PhysicalGiftAddress, v: string) => {
    onChange({
      ...data,
      physicalGiftAddress: { ...addr, [k]: v },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Rekening Bank */}
      <Card>
        <SectionHead
          title="Rekening Bank (Transfer Cashless)"
          sub="Pemberian hadiah amplop digital langsung ke rekening mempelai tanpa potongan admin"
        />
        <div className="space-y-3.5">
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
            placeholder="Nama lengkap sesuai buku tabungan"
          />
        </div>
      </Card>

      {/* Dompet Digital / E-Wallet */}
      <Card>
        <SectionHead
          title="Dompet Digital / E-Wallet"
          sub="Opsi amplop digital instan untuk rekan & sahabat"
        />
        <div className="space-y-3.5">
          <div className="flex flex-wrap gap-2">
            {['GoPay', 'OVO', 'Dana', 'ShopeePay'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => set('ewalletType')(w)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
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
          <M3Field label="Nama Pemilik Akun" value={data.ewalletName} onChange={(v) => set('ewalletName')(v)} />
        </div>
      </Card>

      {/* QRIS Barcode */}
      <Card>
        <SectionHead
          title="QRIS Pembayaran Digital"
          sub="Unggah kode QRIS universal untuk transfer cepat dari semua bank & e-wallet"
        />
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div
            className="w-36 h-36 rounded-2xl bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-all flex-shrink-0"
            onClick={() => qrRef.current?.click()}
          >
            {qrPreview ? (
              <img src={qrPreview} alt="QRIS" className="w-full h-full object-contain p-2" />
            ) : (
              <div className="text-center p-3">
                <Ic.QR s={36} cls="mx-auto text-primary/60 mb-1" />
                <p className="text-[10px] font-bold text-on-surface">Unggah QRIS</p>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xs font-bold text-on-surface">Format Gambar Barcode QRIS</p>
            <p className="text-xs text-on-surface-variant">
              Tamu dapat memindai barcode ini langsung lewat aplikasi perbankan m-BCA, Livin, GoPay, OVO, dll.
            </p>
            <button
              type="button"
              onClick={() => qrRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors"
            >
              <Ic.Upload s={15} /> Pilih File QRIS
            </button>
          </div>
        </div>
        <input ref={qrRef} type="file" accept="image/*" className="hidden" onChange={handleQr} />
      </Card>

      {/* Alamat Pengiriman Kado Fisik */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHead
            title="Kirim Kado Fisik (Alamat Penerima)"
            sub="Berikan alamat rumah bila tamu ingin mengirimkan kado bingkisan fisik"
          />
          <M3Switch
            checked={data.physicalGiftEnabled ?? true}
            onChange={(v) => onChange({ ...data, physicalGiftEnabled: v })}
          />
        </div>

        {data.physicalGiftEnabled && (
          <div className="space-y-3 pt-2 border-t border-outline-variant/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <M3Field
                label="Nama Penerima"
                value={addr.recipientName}
                onChange={(v) => updateAddr('recipientName', v)}
                placeholder="Reza & Hana"
              />
              <M3Field
                label="Nomor WhatsApp / Telepon"
                value={addr.phone}
                onChange={(v) => updateAddr('phone', v)}
                placeholder="0812 3456 7890"
              />
            </div>
            <M3Field
              label="Alamat Lengkap Rumah"
              value={addr.address}
              onChange={(v) => updateAddr('address', v)}
              multiline
              rows={2}
              placeholder="Jl. Melati No. 45, RT 02/RW 05..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <M3Field
                label="Kota / Kabupaten"
                value={addr.city}
                onChange={(v) => updateAddr('city', v)}
                placeholder="Jakarta Selatan"
              />
              <M3Field
                label="Kode Pos"
                value={addr.postalCode}
                onChange={(v) => updateAddr('postalCode', v)}
                placeholder="12430"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
